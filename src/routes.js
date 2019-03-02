/**
 * Contains all routes
 */

module.exports = {
  '/challengeSubmissions': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'getChallengeSubmissions',
      auth: 'jwt'
    }
  },
  '/challengeSubmissions/:submissionId/reviews': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'getSubmissionReviews',
      auth: 'jwt'
    }
  },
  '/challengeSubmissions/:submissionId/download': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'downloadSubmission',
      auth: 'jwt'
    }
  }
}
