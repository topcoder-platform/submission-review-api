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
  },
  '/challengeSubmissions/:submissionId/artifacts': {
    get: {
      controller: 'ArtifactController',
      method: 'getSubmissionArtifacts',
      auth: 'jwt'
    }
  },
  '/challengeSubmissions/:submissionId/artifacts/:artifactId/download': {
    get: {
      controller: 'ArtifactController',
      method: 'downloadArtifact',
      auth: 'jwt'
    }
  }
}
