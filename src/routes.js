/**
 * Contains all routes
 */

module.exports = {
  '/challengeSubmissions': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'getChallengeSubmissions',
      auth: 'jwt',
      blockByIp: true
    }
  },
  '/challengeSubmissions/:submissionId/reviews': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'getSubmissionReviews',
      auth: 'jwt',
      blockByIp: true
    }
  },
  '/challengeSubmissions/:submissionId/download': {
    get: {
      controller: 'SubmissionReviewController',
      method: 'downloadSubmission',
      auth: 'jwt',
      blockByIp: true
    }
  },
  '/challengeSubmissions/:submissionId/artifacts': {
    get: {
      controller: 'ArtifactController',
      method: 'getSubmissionArtifacts',
      auth: 'jwt',
      blockByIp: true
    }
  },
  '/challengeSubmissions/:submissionId/artifacts/:artifactId/download': {
    get: {
      controller: 'ArtifactController',
      method: 'downloadArtifact',
      auth: 'jwt',
      blockByIp: true
    }
  }
}
