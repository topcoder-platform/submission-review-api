/**
 * This service provides operations of submission review
 */

const _ = require('lodash')
const Joi = require('joi')
const config = require('config')
const logger = require('../common/logger')
const {
  fetchPaginated,
  makeRequest,
  getChallengeDetail,
  getChallengeResources,
  getAccess
} = require('../common/helper')
const errors = require('../common/errors')
const { UserRoles, SystemReviewers } = require('../../app-constants')

/**
 * Get challenge submissions
 * @param {Object} currentUser the current user
 * @param {String} challengeId the challenge id
 * @returns {Object} the challenge submissions
 */
async function getChallengeSubmissions (currentUser, challengeId) {
  let submissions
  let resources
  let challenge

  try {
    challenge = await getChallengeDetail(challengeId)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge: ${challengeId}.\n Details: ${_.get(e, 'message')}`)
  }
  try {
    resources = await getChallengeResources(challengeId)
    if (!resources[currentUser.userId] && currentUser.roles.indexOf(UserRoles.Admin) === -1) {
      throw new errors.ForbiddenError(`You don't have access to this challenge!`)
    }
  } catch (e) {
    logger.error(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
    resources = {}
  }
  try {
    submissions = await fetchPaginated(`${config.SUBMISSION_API_URL}?challengeId=${challengeId}&type=${config.SUBMISSION_TYPE}`)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge submissions.\n Details: ${_.get(e, 'message')}`)
  }
  // Access flags
  const { isSubmitter, hasFullAccess } = getAccess(currentUser, resources)
  const scorePath = 'review[0].score'

  submissions.sort((a, b) => {
    if (challenge.isF2F && (_.get(b, scorePath) || _.get(b, scorePath))) {
      if (_.get(b, scorePath, 0) !== _.get(a, scorePath, 0)) {
        return _.get(b, scorePath, 0) - _.get(a, scorePath, 0)
      }
    }
    return (new Date(b.created).getTime()) - (new Date(a.created).getTime())
  })

  const results = {}
  _.each(submissions, (submission) => {
    let inlcudeSubmission = true
    // Access checks
    if (isSubmitter && submission.memberId.toString() !== currentUser.userId.toString()) {
      // Return all submission if the appeals response phase has ended
      if (!challenge.appealResponseEnded) {
        inlcudeSubmission = false
      }
    }

    if (inlcudeSubmission === true) {
      if (!results[submission.memberId]) {
        results[submission.memberId] = {
          ...(challenge.appealResponseEnded || hasFullAccess ? {
            ..._.pick(submission, [
              'memberId'
            ]),
            memberHandle: _.get(resources[submission.memberId], 'memberHandle')
          } : {}),
          submissions: []
        }
      }

      submission.reviewSummation = _.get(submission, 'reviewSummation[0]')
      results[submission.memberId].submissions.push({
        ..._.pick(submission, [
          'id',
          'created',
          'legacySubmissionId',
          challenge.appealResponseEnded || hasFullAccess ? 'reviewSummation' : null
        ])
      })
    }
  })
  return _.map(results, entry => ({ ...entry }))
}

getChallengeSubmissions.schema = {
  currentUser: Joi.any(),
  challengeId: Joi.id() // defined in app-bootstrap
}

/**
 * Get submission reviews
 * @param {Object} currentUser the current user
 * @param {String} submissionId the submission id
 * @returns {String} the submission reviews
 */
async function getSubmissionReviews (currentUser, submissionId) {
  let submission
  let resources
  let challenge
  let reviewTypes

  try {
    reviewTypes = await fetchPaginated(`${config.REVIEW_TYPE_API_URL}?`)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load review types.\n Details: ${_.get(e, 'message')}`)
  }
  try {
    submission = _.get(await makeRequest('GET', `${config.SUBMISSION_API_URL}/${submissionId}`), 'body')
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
    if (!resources[currentUser.userId] && currentUser.roles.indexOf(UserRoles.Admin) === -1) {
      throw new errors.ForbiddenError(`You don't have access to this challenge!`)
    }
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
  }

  submission.review = _.map(submission.review || [], (review) => ({
    ...review,
    reviewType: _.get(_.find(reviewTypes, type => type.id === review.typeId), 'name'),
    reviewer: _.get(resources[review.reviewerId], 'memberHandle', SystemReviewers.Default)
  }))
  submission.reviewSummation = _.get(submission, 'reviewSummation[0]')

  // Access flags
  const { hasFullAccess, isReviewer, isSubmitter } = getAccess(currentUser, resources)
  if (hasFullAccess) return submission
  if (isSubmitter) {
    if (challenge.isAppealsPhase || challenge.appealEnded || challenge.appealResponseEnded) {
      return submission
    }
    return _.pick(submission, ['legacySubmissionId', 'id', 'created'])
  }
  if (isReviewer) {
    if (challenge.appealResponseEnded) {
      return submission
    }
    if (!challenge.isReviewPhase) {
      return {
        ..._.pick(submission, ['legacySubmissionId', 'id', 'created']),
        review: _.filter(submission.review, r => r.reviewerId.toString() === currentUser.userId.toString())
      }
    }
  }
  throw new errors.ForbiddenError('You are not allowed to view this submissios')
}

getSubmissionReviews.schema = {
  currentUser: Joi.any(),
  submissionId: Joi.id() // defined in app-bootstrap
}

/**
 * Get download url
 * @param {Object} currentUser the current user
 * @param {String} submissionId the submission id
 * @returns {String} the download url
 */
async function getDownloadUrl (currentUser, submissionId) {
  let submission
  let resources
  let challenge

  try {
    submission = _.get(await makeRequest('GET', `${config.SUBMISSION_API_URL}/${submissionId}`), 'body')
    _.defaults(submission, { review: [] })
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
    if (!resources[currentUser.userId] && currentUser.roles.indexOf(UserRoles.Admin) === -1) {
      throw new errors.ForbiddenError(`You don't have access to this challenge!`)
    }
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
  }
  // Access flags
  const { hasFullAccess, isReviewer, isSubmitter } = getAccess(currentUser, resources)
  const url = `${config.SUBMISSION_API_URL}/${submissionId}/download`
  if (hasFullAccess) return url
  if (isSubmitter) {
    if (challenge.appealResponseEnded || submission.memberId.toString() === currentUser.userId.toString()) {
      return url
    }
  }
  if (isReviewer) {
    if (!challenge.isSubmitPhase) {
      return url
    }
  }
  throw new errors.ForbiddenError('You are not allowed to download this submissios')
}

getDownloadUrl.schema = {
  currentUser: Joi.any(),
  submissionId: Joi.id() // defined in app-bootstrap
}

module.exports = {
  getChallengeSubmissions,
  getSubmissionReviews,
  getDownloadUrl
}

logger.buildService(module.exports)
