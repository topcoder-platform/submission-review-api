/**
 * This file defines helper methods
 */

const _ = require('lodash')
const config = require('config')
const request = require('superagent')
const m2mAuth = require('tc-core-library-js').auth.m2m
const { xHeaders, ProjectRoles, UserRoles } = require('../../app-constants')
const logger = require('./logger')
const moment = require('moment')

const m2m = m2mAuth(_.pick(config.M2M, ['AUTH0_URL', 'AUTH0_AUDIENCE', 'TOKEN_CACHE_TIME']))

/**
 * Wrap async function to standard express function
 * @param {Function} fn the async function
 * @returns {Function} the wrapped function
 */
const wrapExpress = (fn) => {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}

/**
 * Wrap all functions from object
 * @param obj the object (controller exports)
 * @returns {Object|Array} the wrapped object
 */
const autoWrapExpress = (obj) => {
  if (_.isArray(obj)) {
    return obj.map(autoWrapExpress)
  }
  if (_.isFunction(obj)) {
    if (obj.constructor.name === 'AsyncFunction') {
      return wrapExpress(obj)
    }
    return obj
  }
  _.each(obj, (value, key) => {
    obj[key] = autoWrapExpress(value)
  })
  return obj
}

/**
 * Check the user's access to a challenge
 * @param {Object} authUser the user
 * @param {Array} resources the challenge resources
 */
const getAccess = (authUser, resources) => {
  // Case Insensitive Role checks
  const hasFullAccess = authUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) > -1 || _.intersectionWith(_.get(resources[authUser.userId], 'roles', []), [
    ProjectRoles.Manager,
    ProjectRoles.Copilot,
    ProjectRoles.Observer,
    ProjectRoles.Client_Manager
  ], (act, exp) => act.toLowerCase() === exp.toLowerCase()).length > 0

  const isReviewer = !hasFullAccess && _.intersectionWith(_.get(resources[authUser.userId], 'roles', []), [
    ProjectRoles.Reviewer,
    ProjectRoles.Iterative_Reviewer
  ], (act, exp) => act.toLowerCase() === exp.toLowerCase()).length > 0

  const isSubmitter = !hasFullAccess && !isReviewer && _.intersectionWith(_.get(resources[authUser.userId], 'roles', []), [
    ProjectRoles.Submitter
  ], (act, exp) => act.toLowerCase() === exp.toLowerCase()).length > 0

  return { hasFullAccess, isReviewer, isSubmitter }
}

/**
 * Function to get M2M token
 * @returns {Promise}
 */
const getM2Mtoken = async () => {
  return m2m.getMachineToken(config.M2M.AUTH0_CLIENT_ID, config.M2M.AUTH0_CLIENT_SECRET)
}

/**
 * Function to make request using M2M token
 * @param {String} reqType Type of the request GET / POST
 * @param {String} path Complete path of the API URL
 * @param {Object} reqBody Body of the request
 * @returns {Promise} Promise of the response
 */
const makeRequest = async (reqType, path, reqBody) => {
  logger.info(`Calling: ${path}`)
  const token = await getM2Mtoken()
  logger.debug(`M2M Token: ${token}`)
  if (reqType === 'POST') {
    return request
      .post(path)
      .timeout(1000 * 60) // TODO: remove this. 60 sec is a rediculous timeout
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(reqBody)
  } else if (reqType === 'GET') {
    return request
      .get(path)
      .timeout(1000 * 60) // TODO: remove this. 60 sec is a rediculous timeout
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
  }
}

/**
 * Fetch all available results from a paginated endpoint by following the X-Headers
 * @param {String} path Complete path of the API URL
 */
const fetchPaginated = async (path) => {
  let results = []
  let page = 1
  let res = await makeRequest('GET', `${path}&page=${page}&perPage=${xHeaders.maxPerPage}`)
  let { body, headers } = res
  results = [...body]
  while (page < _.get(headers, xHeaders.xTotalPages, 0)) {
    page += 1
    res = await makeRequest('GET', `${path}&page=${page}&perPage=${xHeaders.maxPerPage}`)
    body = res.body
    headers = res.headers
    results = [...results, ...body]
  }
  return results
}

/**
 * Get challenge details
 * @param {String} challengeId the challenge id
 * @returns {Object} the challenge details
 */
const getChallengeDetail = async (challengeId) => {
  // check if challengeId is a uuid
  let url = `${config.CHALLENGE_API_URL}/${challengeId}`
  const isUUID = `${challengeId}`.match(/^[a-f\d]{8}(-[a-f\d]{4}){4}[a-f\d]{8}$/i)
  if (!isUUID) {
    url = `${config.CHALLENGE_API_URL}?legacyId=${challengeId}`
  }
  const { body: res } = await makeRequest('GET', url)
  const body = isUUID ? res : res[0]

  return {
    isMM: body.trackId === config.MM_TRACK_ID,
    isF2F: body.typeId === config.F2F_TYPE_ID,
    isReviewPhase: _.get(_.find(body.phases, p => p.name === 'Review' || (p.name === 'Iterative Review' && p.isOpen)), 'isOpen', false),
    winF2F: _.get(body, 'winners', []).length > 0 ? body.winners[0] : null,
    isSubmitPhase: _.get(_.find(body.phases, p => p.name === 'Submission'), 'isOpen', false),
    isAppealsPhase: _.get(_.find(body.phases, p => p.name === 'Appeals'), 'isOpen', false),
    appealEnded: moment(_.get(_.find(body.phases, p => p.name === 'Submission'), 'scheduledEndDate')).isBefore(),
    appealResponseEnded: moment(_.get(_.find(body.phases, p => p.name === 'Appeals Response'), 'scheduledEndDate')).isBefore(),
    track: body.track,
    subTrack: body.type
  }
}

/**
 * Get resource roles from API
 */
const getResourceRoles = async () => {
  const { body } = await makeRequest('GET', config.RESOURCE_ROLES_API_URL)
  return body
}

/**
 * Get challenge resources
 * @param {String} challengeId the challenge id
 */
const getChallengeResources = async (challengeId) => {
  const resourceRoles = await getResourceRoles()
  const { body } = await makeRequest('GET', `${config.RESOURCES_API_URL}?challengeId=${challengeId}`)
  const resources = {}

  _.each(body, (resource) => {
    if (!resources[resource.memberId]) {
      resources[resource.memberId] = {
        memberId: resource.memberId,
        memberHandle: resource.memberHandle,
        roles: []
      }
    }
    resources[resource.memberId].roles.push(_.get(_.find(resourceRoles, r => r.id === resource.roleId), 'name'))
  })
  return resources
}

module.exports = {
  wrapExpress,
  autoWrapExpress,
  getAccess,
  makeRequest,
  getM2Mtoken,
  fetchPaginated,
  getChallengeResources,
  getChallengeDetail
}
