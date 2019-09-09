/*
 * Setting up Mock for all tests
 */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

require('../app-bootstrap')

const config = require('config')
const nock = require('nock')
const prepare = require('mocha-prepare')
const URL = require('url')
const { noResourceChallengeId,
  noSubmissionChallengeId,
  submissionPhaseChallengeId,
  reviewPhaseChallengeId,
  appealsPhaseChallengeId,
  completedChallengeId,
  f2fChallengeId,
  mmChallengeId,
  reviewTypes,
  resourcesResponse,
  submissionPhaseChallengeResponse,
  reviewPhaseChallengeResponse,
  appealsPhaseChallengeResponse,
  completedChallengeResponse,
  f2fChallengeResponse,
  mmChallengeResponse,
  subPhaseSubmissions,
  reviewPhaseSubmissions,
  appealsPhaseSubmissions,
  completedChallengeSubmissions,
  f2fSubmissions,
  mmSubmissions,
  invalidChallengeIdSubmission,
  noResourceChallengeIdSubmission,
  artifactsResponse } = require('./testData')

prepare(function (done) {
  // Mock Posting to Bus API and ES interactions
  const authUrl = URL.parse(config.M2M.AUTH0_URL)
  const reviewTypesUrl = URL.parse(`${config.REVIEW_TYPE_API_URL}?&page=1&perPage=100`)

  nock(/.com/)
    .persist()
    .filteringPath((path) => {
      // Retrieve Challenge ID or Resources Keyword
      if (path.indexOf('challenges') !== -1 &&
        path.indexOf(`${noResourceChallengeId}/resources`) === -1) {
        return path.substring(path.lastIndexOf('/') + 1)
      }

      if (path.indexOf('submissions?challengeId=') !== -1 && path.indexOf(noSubmissionChallengeId) !== -1) {
        return 'noSubmissions'
      }

      if (path.indexOf('submissions?challengeId=') !== -1 && path.indexOf(f2fChallengeId) !== -1) {
        return 'f2fSubmissions'
      }

      if (path.indexOf('submissions?challengeId=') !== -1 && path.indexOf(mmChallengeId) !== -1) {
        return 'mmSubmissions'
      }

      if (path.indexOf('submissions?challengeId=') !== -1 && path.indexOf(noResourceChallengeId) === -1) {
        return 'subPhaseSubmissions'
      }

      if (path.indexOf('download') !== -1) {
        return 'download'
      }

      if (path.indexOf('artifacts') !== -1) {
        return 'artifacts'
      }

      if (path.indexOf('submissions') !== -1) {
        return path.substring(path.lastIndexOf('/') + 1)
      }

      return path
    })
    .post(authUrl.path)
    .reply(200, { access_token: 'test' })
    .get('resources')
    .reply(200, resourcesResponse)
    .get(noResourceChallengeId)
    .reply(200, submissionPhaseChallengeResponse)
    .get(noSubmissionChallengeId)
    .reply(200, submissionPhaseChallengeResponse)
    .get(submissionPhaseChallengeId)
    .reply(200, submissionPhaseChallengeResponse)
    .get(reviewPhaseChallengeId)
    .reply(200, reviewPhaseChallengeResponse)
    .get(appealsPhaseChallengeId)
    .reply(200, appealsPhaseChallengeResponse)
    .get(completedChallengeId)
    .reply(200, completedChallengeResponse)
    .get(f2fChallengeId)
    .reply(200, f2fChallengeResponse)
    .get(mmChallengeId)
    .reply(200, mmChallengeResponse)
    .get('noSubmissions')
    .reply(200, [])
    .get('subPhaseSubmissions')
    .reply(200, subPhaseSubmissions)
    .get('f2fSubmissions')
    .reply(200, f2fSubmissions)
    .get('mmSubmissions')
    .reply(200, mmSubmissions)
    .get(reviewTypesUrl.path)
    .reply(200, reviewTypes)
    .get(subPhaseSubmissions[0].id)
    .reply(200, subPhaseSubmissions[0])
    .get(subPhaseSubmissions[1].id)
    .reply(200, subPhaseSubmissions[1])
    .get(reviewPhaseSubmissions[0].id)
    .reply(200, reviewPhaseSubmissions[0])
    .get(reviewPhaseSubmissions[1].id)
    .reply(200, reviewPhaseSubmissions[1])
    .get(appealsPhaseSubmissions[0].id)
    .reply(200, appealsPhaseSubmissions[0])
    .get(appealsPhaseSubmissions[1].id)
    .reply(200, appealsPhaseSubmissions[1])
    .get(completedChallengeSubmissions[0].id)
    .reply(200, completedChallengeSubmissions[0])
    .get(completedChallengeSubmissions[1].id)
    .reply(200, completedChallengeSubmissions[1])
    .get(invalidChallengeIdSubmission.id)
    .reply(200, invalidChallengeIdSubmission)
    .get(noResourceChallengeIdSubmission.id)
    .reply(200, noResourceChallengeIdSubmission)
    .get(mmSubmissions[0].id)
    .reply(200, mmSubmissions[0])
    .get('download')
    .reply(200, 'download')
    .get('artifacts')
    .reply(200, artifactsResponse)

  done()
}, function (done) {
  // called after all test completes (regardless of errors)
  nock.cleanAll()
  done()
})
