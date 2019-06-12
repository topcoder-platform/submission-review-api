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
 * Get MM challenge full submissions results.
 * @param {Object} challenge the challenge details
 * @param {Array} resources the challenge resources
 * @param {Array} submissions the challenge submissions
 * @returns {Array} the MM challenge full submissions results
 */
async function getMMChallengeFullSubmissions (challenge, resources, submissions) {
  // get review types
  let reviewTypes
  try {
    reviewTypes = await fetchPaginated(`${config.REVIEW_TYPE_API_URL}?`)
  } catch (e) {
    throw new errors.NotFoundError(`Could not load review types.\n Details: ${_.get(e, 'message')}`)
  }

  // find MM review type ids, used to filter valid MM reviews
  const mmReviewTypeIds = _.map(config.MM_REVIEW_TYPES, (typeName) => {
    const reviewType = _.find(reviewTypes, (t) => t.name.toLowerCase() === typeName.toLowerCase())
    if (!reviewType) {
      throw new Error(`Can not find review type of name: ${typeName}`)
    }
    return reviewType.id
  })

  const results = {}
  _.forEach(submissions, (submission) => {
    // find valid MM reviews
    const validReviews = _.filter(submission.review || [], (r) => _.includes(mmReviewTypeIds, r.typeId))
    validReviews.sort((a, b) => new Date(b.created).getTime() - new Date(a.created).getTime())
    // find provisional score and final score
    const provisionalScore = _.get(validReviews, '[0].score')
    const finalScore = _.get(submission, 'reviewSummation[0].aggregateScore')

    // group submissions by member id
    if (!results[submission.memberId]) {
      results[submission.memberId] = {
        memberId: submission.memberId,
        memberHandle: _.get(resources[submission.memberId], 'memberHandle'),
        submissions: []
      }
    }
    results[submission.memberId].submissions.push({
      id: submission.id,
      created: submission.created,
      legacySubmissionId: submission.legacySubmissionId,
      reviewSummation: _.get(submission, 'reviewSummation[0]'),
      provisionalScore,
      finalScore
    })
  })
  const records = _.map(results, r => r)

  // populate provisional ranks
  records.sort((a, b) => {
    const psa = _.get(a, 'submissions[0].provisionalScore', -1)
    const psb = _.get(b, 'submissions[0].provisionalScore', -1)

    if (psa !== psb) {
      return psb - psa
    }

    // provisional scores are the same, then use created time to break the tie
    // earlier submission will get higher rank
    const ta = _.get(a, 'submissions[0].created')
    const tb = _.get(b, 'submissions[0].created')
    return new Date(ta).getTime() - new Date(tb).getTime()
  })
  _.forEach(records, (record, i) => {
    record.provisionalRank = i + 1
  })

  // populate final ranks only after completion of review phase
  if (!challenge.isSubmitPhase && !challenge.isReviewPhase) {
    records.sort((a, b) => {
      // first check final scores
      const fsa = _.get(a, 'submissions[0].finalScore', -1)
      const fsb = _.get(b, 'submissions[0].finalScore', -1)

      if (fsa !== fsb) {
        return fsb - fsa
      }

      // final scores are same, then use created time to break the tie
      // earlier submission will get higher rank
      const ta = _.get(a, 'submissions[0].created')
      const tb = _.get(b, 'submissions[0].created')
      return new Date(ta).getTime() - new Date(tb).getTime()
    })
    _.forEach(records, (record, i) => {
      record.finalRank = i + 1
    })
  }

  return records
}

/**
 * Get challenge submissions.
 * The provisionalScore, finalScore, provisionalRank, finalRank will be populated if
 * the challenge is MM challenge and current user has full access to the challenge.
 *
 * @param {Object} currentUser the current user
 * @param {String} challengeId the challenge id
 * @returns {Array} the challenge submissions
 */
async function getChallengeSubmissions (currentUser, challengeId) {
  let submissions
  let resources
  let challenge

  try {
    challenge = await getChallengeDetail(challengeId)
  } catch (e) {
    logger.error(e)
    throw new errors.NotFoundError(`Could not load challenge: ${challengeId}.\n Details: ${_.get(e, 'message')}`)
  }
  try {
    resources = await getChallengeResources(challengeId)
  } catch (e) {
    logger.error(e)
    logger.error(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
    resources = {}
  }

  // User access check
  if (!resources[currentUser.userId] && currentUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) === -1) {
    throw new errors.ForbiddenError(`You don't have access to this challenge!`)
  }

  try {
    submissions = await fetchPaginated(`${config.SUBMISSION_API_URL}?challengeId=${challengeId}&type=${config.SUBMISSION_TYPE}`)
  } catch (e) {
    logger.error(e)
    throw new errors.NotFoundError(`Could not load challenge submissions.\n Details: ${_.get(e, 'message')}`)
  }

  // Access flags
  const { isSubmitter, isReviewer, hasFullAccess } = getAccess(currentUser, resources)
  const scorePath = 'review[0].score'

  submissions.sort((a, b) => {
    if (challenge.isF2F && (_.get(a, scorePath) || _.get(b, scorePath))) {
      if (_.get(b, scorePath, 0) !== _.get(a, scorePath, 0)) {
        return _.get(b, scorePath, 0) - _.get(a, scorePath, 0)
      }
    }
    return (new Date(b.created).getTime()) - (new Date(a.created).getTime())
  })

  // In Marathon match, Submission scores are accessible to everyone
  if (challenge.isMM) {
    return getMMChallengeFullSubmissions(challenge, resources, submissions)
  }

  const results = {}
  _.each(submissions, (submission) => {
    let includeSubmission = true
    // Access checks
    if (isSubmitter && submission.memberId.toString() !== currentUser.userId.toString()) {
      // Return all submission if the appeals response phase has ended
      if (!challenge.appealResponseEnded) {
        includeSubmission = false
      }
    }

    // Reviewer doesn't have access to submissions during submission phase except F2F
    if (isReviewer && challenge.isSubmitPhase && !challenge.isF2F) {
      includeSubmission = false
    }

    if (includeSubmission === true) {
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
  currentUser: Joi.any().required(),
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
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
  }

  // User access check
  if (!resources[currentUser.userId] && currentUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) === -1) {
    throw new errors.ForbiddenError(`You don't have access to this challenge!`)
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
    // If Appeals Response is Closed, Reviews can be viewed for all members
    if (challenge.appealResponseEnded) {
      return submission
    }
    // Before Appeals Response Closure, Submitter is not allowed to access other reviews
    if (submission.memberId.toString() !== currentUser.userId.toString()) {
      throw new errors.ForbiddenError('You cannot view other member reviews before Appeals Response closure')
    }
    // Allow access to review of own submission
    if (challenge.isAppealsPhase || challenge.appealEnded) {
      return submission
    }
    // Return own submission details without Review
    return _.pick(submission, ['legacySubmissionId', 'id', 'created'])
  }

  if (isReviewer) {
    if (challenge.appealResponseEnded) {
      return submission
    }
    // Own reviews can be accessed during Review phase too
    return {
      ..._.pick(submission, ['legacySubmissionId', 'id', 'created']),
      review: _.filter(submission.review, r => r.reviewerId.toString() === currentUser.userId.toString())
    }
  }
}

getSubmissionReviews.schema = {
  currentUser: Joi.any().required(),
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
  } catch (e) {
    throw new errors.NotFoundError(`Could not load challenge resources.\n Details: ${_.get(e, 'message')}`)
  }

  // User access check
  if (!resources[currentUser.userId] && currentUser.roles.findIndex(item => UserRoles.Admin.toLowerCase() === item.toLowerCase()) === -1) {
    throw new errors.ForbiddenError(`You don't have access to this challenge!`)
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
  throw new errors.ForbiddenError('You are not allowed to download this submission')
}

getDownloadUrl.schema = {
  currentUser: Joi.any().required(),
  submissionId: Joi.id() // defined in app-bootstrap
}

module.exports = {
  getChallengeSubmissions,
  getSubmissionReviews,
  getDownloadUrl
}

logger.buildService(module.exports)
