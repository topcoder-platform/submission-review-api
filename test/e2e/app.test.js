/*
 * Submission Review API tests
 */

/* eslint-disable no-unused-expressions */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const chai = require('chai')
const chaiHttp = require('chai-http')
const app = require('../../app')
const logger = require('../../src/common/logger')

const should = chai.should()
chai.use(chaiHttp)
chai.use(require('chai-as-promised'))

const { invalidChallengeId,
  invalidChallengeIdSubmission,
  noResourceChallengeId,
  noResourceChallengeIdSubmission,
  noSubmissionChallengeId,
  submissionPhaseChallengeId,
  reviewPhaseChallengeId,
  appealsPhaseChallengeId,
  completedChallengeId,
  f2fChallengeId,
  mmChallengeId,
  completedMmChallengeId,
  adminToken,
  submitter1Token,
  submitter2Token,
  submitter3Token,
  nonSubmitterToken,
  observerToken,
  managerToken,
  copilotToken,
  reviewerToken,
  reviewer,
  clientManagerToken,
  subPhaseSubmissions,
  reviewPhaseSubmissions,
  appealsPhaseSubmissions,
  completedChallengeSubmissions,
  artifactsResponse } = require('../testData')

describe('Submission Review API tests', () => {
  const errorLogs = []
  const error = logger.error

  before(() => {
    logger.error = (message) => {
      errorLogs.push(message)
      error(message)
    }
  })

  beforeEach(() => {
    // clear logs
    errorLogs.length = 0
  })

  after(() => {
    // restore logger
    logger.error = error
  })

  /*
   * Test GET /challengeSubmissions route
   */
  describe('GET /challengeSubmissions', () => {
    describe('Tests related to MM challenge', () => {
      it('Admin will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('Observer will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('Manager will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('Copilot will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('Client Manager will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.eql(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('Reviewer will have access to scores of all submissions of marathon match', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(5)
        errorLogs.should.be.empty
      })

      it('For MM Challenge in Review phase, only provisional rank will be present and will be ordered by provisional rank', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        for (const submission of submissions) {
          submission.should.have.property('provisionalRank')
          submission.should.not.have.property('finalRank')
        }
        submissions[0].provisionalRank.should.be.eql(1)
        submissions[1].provisionalRank.should.be.eql(2)
        submissions[0].submissions[0].provisionalScore.should.be.gt(submissions[1].submissions[0].provisionalScore)
        errorLogs.should.be.empty
      })

      it('For completed MM Challenge, both final and provisional rank will be present and will be ordered by final rank', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedMmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        for (const submission of submissions) {
          submission.should.have.property('provisionalRank')
          submission.should.have.property('finalRank')
        }
        submissions[0].finalRank.should.be.eql(1)
        submissions[1].finalRank.should.be.eql(2)
        submissions[0].submissions[0].finalScore.should.be.gt(submissions[1].submissions[0].finalScore)
        errorLogs.should.be.empty
      })

      it('When provisional scores are same, earlier submission will get higher rank', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        submissions[1].provisionalRank.should.be.eql(2)
        submissions[2].provisionalRank.should.be.eql(3)
        submissions[1].submissions[0].provisionalScore.should.be.eql(submissions[2].submissions[0].provisionalScore)
        const firstDate = new Date(submissions[1].submissions[0].created)
        const secondDate = new Date(submissions[2].submissions[0].created)
        firstDate.should.be.lt(secondDate)
        errorLogs.should.be.empty
      })

      it('When final scores are same, earlier submission will get higher rank', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedMmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        submissions[2].finalRank.should.be.eql(3)
        submissions[3].finalRank.should.be.eql(4)
        submissions[2].submissions[0].finalScore.should.be.eql(submissions[3].submissions[0].finalScore)
        const firstDate = new Date(submissions[2].submissions[0].created)
        const secondDate = new Date(submissions[3].submissions[0].created)
        firstDate.should.be.lt(secondDate)
        errorLogs.should.be.empty
      })

      it('In Ranking, 0 is greater than undefined', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedMmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        submissions[3].finalRank.should.be.eql(4)
        submissions[4].finalRank.should.be.eql(5)
        submissions[3].submissions[0].finalScore.should.be.eql(0)
        should.not.exist(submissions[4].submissions[0].finalScore)
        errorLogs.should.be.empty
      })

      it('When submission has multiple valid reviews, only latest review will be considered', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${mmChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        const submissions = response.body
        submissions.length.should.be.eql(5)
        submissions[2].provisionalRank.should.be.eql(3)
        submissions[2].submissions[0].provisionalScore.should.be.eql(23.62432)
        errorLogs.should.be.empty
      })
    })

    describe('Agnostic tests', () => {
      // TODO - Auth library should ideally return 401 instead of 403
      it('Getting challenge submissions without token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('No token provided.')
      })

      it('Getting challenge submissions with invalid token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions`)
          .set('Authorization', `Bearer testing`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('Invalid Token.')
      })

      it('Getting challenge submissions without challenge ID should result in validation error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(400)
        response.body.message.should.be.eql('"challengeId" is required')
      })

      it('Invalid challenge should be rejected with could not load challenge error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${invalidChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Challenge without resource details should have error related to challenge resources in logs', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${noResourceChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        errorLogs.should.not.be.empty
        errorLogs[0].should.have.string(`Could not load challenge resources`)
      })

      it('Challenge with no submission should return empty array', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${noSubmissionChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.eql([])
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.eql(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during submission phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(1)
        response.body[0].should.not.have.keys(['memberId', 'memberHandle'])
        response.body[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(0)
      })

      it('Reviewer should not have access to any submission during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${submissionPhaseChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(0)
      })

      it('Reviewer have access to all submissions in F2F during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${f2fChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.eql(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during review phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(1)
        response.body[0].should.not.have.keys(['memberId', 'memberHandle'])
        response.body[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(0)
      })

      it('Reviewer will have access to all submission during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${reviewPhaseChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.eql(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during appeals phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(1)
        response.body[0].should.not.have.keys(['memberId', 'memberHandle'])
        response.body[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(0)
      })

      it('Reviewer will have access to all submission during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${appealsPhaseChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.eql(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to all submissions after appeals response closure ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all submission after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
      })

      it('Reviewer will have access to all submission after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions?challengeId=${completedChallengeId}`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.should.be.an('array')
        response.body.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test GET /challengeSubmissions/:submissionId/reviews route
   */
  describe('GET /challengeSubmissions/:submissionId/reviews', () => {
    describe('Agnostic tests', () => {
      // TODO - Auth library should ideally return 401 instead of 403
      it('Getting submission reviews without token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('No token provided.')
      })

      it('Getting challenge submissions with invalid token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer testing`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('Invalid Token.')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/abcd-def/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${invalidChallengeIdSubmission.id}/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${noResourceChallengeIdSubmission.id}/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load challenge resources')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all reviews during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[1].id}/reviews`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(0)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[1].id}/reviews`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(0)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will not have access to his own reviews during review phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.should.not.have.keys(['review'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to any review during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You cannot view other member reviews before Appeals Response closure')
      })

      it('Reviewer should have access to his own review during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(1)
        reviews[0].reviewer.should.be.equal(reviewer.handle)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all reviews during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own reviews during appeals phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to any review during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You cannot view other member reviews before Appeals Response closure')
      })

      it('Reviewer should have access to his own review during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(1)
        reviews[0].reviewer.should.be.equal(reviewer.handle)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to all reviews after appeals response closure ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter2Token}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Reviewer should have access to all reviews after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/reviews`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        const reviews = response.body.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test GET /challengeSubmissions/:submissionId/download route
   */
  describe('GET /challengeSubmissions/:submissionId/download', () => {
    describe('Agnostic tests', () => {
      // TODO - Auth library should ideally return 401 instead of 403
      it('Getting submission reviews without token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('No token provided.')
      })

      it('Getting challenge submissions with invalid token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer testing`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('Invalid Token.')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/abcd-def/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${invalidChallengeIdSubmission.id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${noResourceChallengeIdSubmission.id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during submission phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download this submission')
      })

      it('Reviewer should not have access to submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during review phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download this submission')
      })

      it('Reviewer should have access to submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during appeals phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download this submission')
      })

      it('Reviewer should have access to submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to all submissions after appeals response closure ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[1].id}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Reviewer will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test GET /challengeSubmissions/:submissionId/artifacts route
   */
  describe('GET /challengeSubmissions/:submissionId/artifacts', () => {
    describe('Agnostic tests', () => {
      // TODO - Auth library should ideally return 401 instead of 403
      it('Getting submission reviews without token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('No token provided.')
      })

      it('Getting challenge submissions with invalid token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer testing`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('Invalid Token.')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/abcd-def/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${invalidChallengeIdSubmission.id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${noResourceChallengeIdSubmission.id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during submission phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should not have access to submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during review phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should have access to submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during appeals phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should have access to submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to all submissions after appeals response closure ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[1].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Reviewer will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.body.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test GET /challengeSubmissions/:submissionId/artifacts/:artifactId/download route
   */
  describe('GET /challengeSubmissions/:submissionId/artifacts/:artifactId/download', () => {
    describe('Agnostic tests', () => {
      // TODO - Auth library should ideally return 401 instead of 403
      it('Getting submission reviews without token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('No token provided.')
      })

      it('Getting challenge submissions with invalid token should result in Unauthorized error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer testing`)
        response.status.should.be.eql(403)
        response.body.result.content.message.should.be.eql('Invalid Token.')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/abcd-def/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${invalidChallengeIdSubmission.id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${noResourceChallengeIdSubmission.id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(404)
        response.body.message.should.contain('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during submission phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should not have access to submissions during submission phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${subPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during review phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should have access to submissions during review phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${reviewPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own submission during appeals phase ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to other member submission during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should have access to submissions during appeals phase', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${appealsPhaseSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${adminToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${observerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${managerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${copilotToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${clientManagerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${nonSubmitterToken}`)
        response.status.should.be.eql(403)
        response.body.message.should.be.contain(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to all submissions after appeals response closure ', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[1].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter1Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${submitter3Token}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })

      it('Reviewer will have access to all submissions after appeals response closure', async () => {
        const response = await chai.request(app)
          .get(`/challengeSubmissions/${completedChallengeSubmissions[0].id}/artifacts/${artifactsResponse.artifacts[0]}/download`)
          .set('Authorization', `Bearer ${reviewerToken}`)
        response.status.should.be.eql(200)
        response.text.should.be.eql('download')
        errorLogs.should.be.empty
      })
    })
  })
})

/* eslint-enable no-unused-expressions */
