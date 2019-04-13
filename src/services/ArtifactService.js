/**
 * This service provides operations of submission review
 */

const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const {
  makeRequest,
  getChallengeDetail,
  getChallengeResources,
  getAccess
} = require('../common/helper')
const errors = require('../common/errors')
const { UserRoles } = require('../../app-constants')

/**
 * Checks for accessing artifacts
 * @param {Object} currentUser
 * @param {String} submissionId
 * @returns {Object} submission
 */
async function _checkAccess (currentUser, submissionId) {
  let submission
  let resources
  let challenge

  try {
    submission = _.get(await makeRequest('GET', `${config.SUBMISSION_API_URL}/${submissionId}`), 'body')
    console.log(submission)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load submission.\n Details: ${_.get(e, 'message')}`)
  }
  try {
    challenge = await getChallengeDetail(submission.challengeId)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge: ${submission.challengeId}.\n Details: ${_.get(e, 'message')}`)
  }
  try {
    resources = await getChallengeResources(submission.challengeId)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
  }

  // User access check
  if (!resources[currentUser.userId] && currentUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) === -1) {
    throw new errors.ForbiddenError(`You don't have access to this challenge!`)
  }

  // Access flags
  const { hasFullAccess, isReviewer, isSubmitter } = getAccess(currentUser, resources)

  if (hasFullAccess) return submission

  if (isSubmitter) {
    if (challenge.appealResponseEnded || submission.memberId.toString() === currentUser.userId.toString()) {
      return submission
    }
  }

  if (isReviewer) {
    if (!challenge.isSubmitPhase) {
      return submission
    }
  }
  throw new errors.ForbiddenError('You are not allowed to download artifacts of this submission')
}

/**
 * Get submission artifacts
 * @param {Object} currentUser the current user
 * @param {String} submissionId the submission id
 * @returns {Object} the submission artifact ids
 */
async function getSubmissionArtifacts (currentUser, submissionId) {
  // Check access and retrieve submission
  let submission = await _checkAccess(currentUser, submissionId)

  try {
    // Reviews need not be part of this end point response
    submission = _.omit(submission, ['review', 'reviewSummation'])
    const result = _.get(await makeRequest('GET', `${config.SUBMISSION_API_URL}/${submissionId}/artifacts`), 'body')
    submission.artifacts = result.artifacts
    return submission
  } catch (e) {
    throw new errors.NotFoundError(`Could not access submission artifacts.\n Details: ${_.get(e, 'message')}`)
  }
}

getSubmissionArtifacts.schema = {
  currentUser: Joi.any().required(),
  submissionId: Joi.id() // defined in app-bootstrap
}

/**
 * Get download url for artifact
 * @param {Object} currentUser the current user
 * @param {String} submissionId the submission id
 * @param {String} artifactId the artifact id
 * @returns {String} Artifact download URL
 */
async function getArtifactDownloadUrl (currentUser, submissionId, artifactId) {
  // Check user acess
  await _checkAccess(currentUser, submissionId)
  // Artifact download URL
  return `${config.SUBMISSION_API_URL}/${submissionId}/artifacts/${artifactId}/download`
}

getArtifactDownloadUrl.schema = {
  currentUser: Joi.any().required(),
  submissionId: Joi.id(), // defined in app-bootstrap
  artifactId: Joi.id()
}

module.exports = {
  getSubmissionArtifacts,
  getArtifactDownloadUrl
}

logger.buildService(module.exports)
