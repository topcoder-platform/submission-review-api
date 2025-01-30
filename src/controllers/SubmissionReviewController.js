/**
 * Controller for submission review endpoints
 */
const service = require('../services/SubmissionReviewService')
const { getM2Mtoken } = require('../common/helper')
const request = require('superagent')
const logger = require('../common/logger')

/**
 * Get challenge submissions
 * @param req the request
 * @param res the response
 */
async function getChallengeSubmissions (req, res) {
  const result = await service.getChallengeSubmissions(req.authUser, req.query.challengeId)
  res.send(result)
}

/**
 * Get submission reviews
 * @param req the request
 * @param res the response
 */
async function getSubmissionReviews (req, res) {
  const result = await service.getSubmissionReviews(req.authUser, req.params.submissionId)
  res.send(result)
}

/**
 * Download Submission
 * @param req the request
 * @param res the response
 */
async function downloadSubmission (req, res) {
  logger.info(`downloadSubmission ${req.params.submissionId}`)
  const url = await service.getDownloadUrl(req.authUser, req.params.submissionId)
  res.set('Content-Disposition', `attachment; filename=submission-${req.params.submissionId}.zip`)
  const token = await getM2Mtoken()
  request
    .get(url)
    .set('Authorization', `Bearer ${token}`)
    .set('Content-Type', 'application/json')
    .set('Accept', 'application/json')
    .pipe(res)
}

module.exports = {
  getChallengeSubmissions,
  getSubmissionReviews,
  downloadSubmission
}
