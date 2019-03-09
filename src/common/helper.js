/**
 * This file defines helper methods
 */

const _ = require('lodash')
const config = require('config')
const request = require('superagent')
const m2mAuth = require('tc-core-library-js').auth.m2m
const { xHeaders, ProjectRoles, UserRoles } = require('../../app-constants')
const logger = require('./logger')

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
  const hasFullAccess = authUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) > -1 || _.intersection(_.get(resources[authUser.userId], 'roles', []), [
    ProjectRoles.Manager,
    ProjectRoles.Copilot,
    ProjectRoles.Observer
  ]).length > 0
  const isReviewer = !hasFullAccess && _.includes(_.get(resources[authUser.userId], 'roles', []), ProjectRoles.Reviewer)
  const isSubmitter = !hasFullAccess && !isReviewer && _.includes(_.get(resources[authUser.userId], 'roles', []), ProjectRoles.Submitter)

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
  const token = await getM2Mtoken()
  logger.debug(`M2M Token: ${token}`)
  if (reqType === 'POST') {
    return request
      .post(path)
      .set('Authorization', `Bearer ${token}`)
      .set('Content-Type', 'application/json')
      .send(reqBody)
  } else if (reqType === 'GET') {
    return request
      .get(path)
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
  const content = _.get(await makeRequest('GET', `${config.CHALLENGE_API_URL}/${challengeId}`), 'body.result.content')
  const ret = {}

  const phases = {}
  _.each(content.phases, element => {
    if (!phases[element.type]) {
      phases[element.type] = element
    } else {
      // For F2F challenge, it has multiple iterative-review phases
      if (_.isArray(phases[element.type])) {
        phases[element.type].push(element)
      } else {
        phases[element.type] = [phases[element.type]]
      }
    }
  })

  ret.isMM = content.subTrack !== undefined && content.subTrack.endsWith('MARATHON_MATCH')
  ret.isF2F = content.subTrack !== undefined && content.subTrack.endsWith('FIRST_2_FINISH')
  if (ret.isF2F) {
    // F2F has multiple iterative-review phases, no appeal/appeal-response phase
    if (_.isArray(phases['Iterative Review'])) {
      ret.isReviewPhase = phases['Iterative Review'][phases['Iterative Review'].length - 1].actualEndTime === undefined
    } else {
      ret.isReviewPhase = phases['Iterative Review'].actualEndTime === undefined
    }
    if (content.winners) {
      ret.winF2F = content.winners[0].submitter
    }
  } else {
    ret.isSubmitPhase = phases['Submission'].actualStartTime && phases['Submission'].actualEndTime === undefined
    ret.isReviewPhase = phases['Review'].actualStartTime && phases['Review'].actualEndTime === undefined
    ret.hasAppeal = phases['Appeals'] !== undefined
    if (ret.hasAppeal) {
      ret.isAppealsPhase = phases['Appeals'].actualStartTime && phases['Appeals'].actualEndTime === undefined
      ret.appealEnded = phases['Appeals'].actualEndTime !== undefined
      ret.appealResponseEnded = phases['Appeals Response'].actualEndTime !== undefined
    }
  }

  ret.phases = phases

  return {
    ...ret,
    ..._.pick(content, ['track', 'subTrack'])
  }
}

/**
 * Get challenge resources
 * @param {String} challengeId the challenge id
 */
const getChallengeResources = async (challengeId) => {
  const body = _.get(await makeRequest('GET', `${config.CHALLENGE_API_URL}/${challengeId}/resources`), 'body.result.content', [])
  const resources = {}
  _.each(body, (resource) => {
    if (!resources[resource.properties['External Reference ID']]) {
      resources[resource.properties['External Reference ID']] = {
        memberId: resource.properties['External Reference ID'],
        memberHandle: resource.properties['Handle'],
        roles: []
      }
    }
    resources[resource.properties['External Reference ID']].roles.push(resource.role)
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
