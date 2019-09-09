/*
 * Unit testing of Artifact service with mocks
 */

/* eslint-disable no-unused-expressions */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const chai = require('chai')
const logger = require('../../src/common/logger')

const service = require('../../src/services/ArtifactService')

const { invalidChallengeId,
  invalidChallengeIdSubmission,
  noResourceChallengeIdSubmission,
  admin,
  submitter1,
  submitter3,
  mmSubmitter,
  nonSubmitter,
  observer,
  manager,
  copilot,
  reviewer,
  clientManager,
  subPhaseSubmissions,
  reviewPhaseSubmissions,
  appealsPhaseSubmissions,
  completedChallengeSubmissions,
  mmSubmissions,
  artifactsResponse } = require('../testData')

chai.should()
chai.use(require('chai-as-promised'))

describe('Artifact Service tests', () => {
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
   * Test the function getSubmissionArtifacts
   */
  describe('Function getSubmissionArtifacts tests', () => {
    describe('Agnostic tests', () => {
      it('Null message should be rejected with Current User required error', async () => {
        return service.getSubmissionArtifacts().should.be.rejectedWith('"currentUser" is required')
      })

      it('Calling function without submissionId should be rejected with required field error', async () => {
        return service.getSubmissionArtifacts(admin).should.be.rejectedWith('"submissionId" is required')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        return service.getSubmissionArtifacts(admin, 'abcd-def').should.be.rejectedWith('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        return service.getSubmissionArtifacts(admin, invalidChallengeIdSubmission.id).should.be.rejectedWith(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        return service.getSubmissionArtifacts(admin, noResourceChallengeIdSubmission.id).should.be.rejectedWith('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submission artifacts during submission phase', async () => {
        const submission = await service.getSubmissionArtifacts(admin, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submission artifacts during submission phase', async () => {
        const submission = await service.getSubmissionArtifacts(observer, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submission artifacts during submission phase', async () => {
        const submission = await service.getSubmissionArtifacts(manager, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submission artifacts during submission phase', async () => {
        const submission = await service.getSubmissionArtifacts(copilot, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submission artifacts during submission phase', async () => {
        const submission = await service.getSubmissionArtifacts(clientManager, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission artifacts', async () => {
        return service.getSubmissionArtifacts(nonSubmitter, subPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission artifacts during submission phase ', async () => {
        const submission = await service.getSubmissionArtifacts(submitter1, subPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will not have access to other submission artifacts during submission phase', async () => {
        return service.getSubmissionArtifacts(submitter3, subPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should not have access to any submission artifacts during submission phase', async () => {
        return service.getSubmissionArtifacts(reviewer, subPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submission artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(admin, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submission artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(observer, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submission artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(manager, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submission artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(copilot, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submission artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(clientManager, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission artifacts', async () => {
        return service.getSubmissionArtifacts(nonSubmitter, reviewPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission artifacts during review phase ', async () => {
        const submission = await service.getSubmissionArtifacts(submitter1, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will not have access to other submission artifacts during review phase', async () => {
        return service.getSubmissionArtifacts(submitter3, reviewPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer will have access to all submission artifacts other than internal artifacts during review phase', async () => {
        const submission = await service.getSubmissionArtifacts(reviewer, reviewPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submission artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(admin, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submission artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(observer, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submission artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(manager, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submission artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(copilot, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submission artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(clientManager, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission artifacts', async () => {
        return service.getSubmissionArtifacts(nonSubmitter, appealsPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission artifacts during appeals phase ', async () => {
        const submission = await service.getSubmissionArtifacts(submitter1, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will not have access to other submission artifacts during appeals phase', async () => {
        return service.getSubmissionArtifacts(submitter3, appealsPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer will have access to all submission artifacts other than internal artifacts during appeals phase', async () => {
        const submission = await service.getSubmissionArtifacts(reviewer, appealsPhaseSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(admin, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(observer, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(manager, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(copilot, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(clientManager, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(3)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission artifacts', async () => {
        return service.getSubmissionArtifacts(nonSubmitter, completedChallengeSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his submission artifacts after appeals response closure ', async () => {
        const submission = await service.getSubmissionArtifacts(submitter1, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will have access to other submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(submitter3, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter should not have access to other submission artifacts after appeals response closure if the challenge is MM', async () => {
        return service.getSubmissionArtifacts(mmSubmitter, mmSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Reviewer will have access to all submission artifacts after appeals response closure', async () => {
        const submission = await service.getSubmissionArtifacts(reviewer, completedChallengeSubmissions[0].id)
        submission.artifacts.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test the function getArtifactDownloadUrl
   */
  describe('Function getArtifactDownloadUrl tests', () => {
    describe('Agnostic tests', () => {
      it('Null message should be rejected with Current User required error', async () => {
        return service.getArtifactDownloadUrl().should.be.rejectedWith('"currentUser" is required')
      })

      it('Calling function without submissionId should be rejected with required field error', async () => {
        return service.getArtifactDownloadUrl(admin).should.be.rejectedWith('"submissionId" is required')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        return service.getArtifactDownloadUrl(admin, 'abcd-def', artifactsResponse.artifacts[0]).should.be.rejectedWith('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        return service.getArtifactDownloadUrl(admin, invalidChallengeIdSubmission.id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        return service.getArtifactDownloadUrl(admin, noResourceChallengeIdSubmission.id, artifactsResponse.artifacts[0]).should.be.rejectedWith('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(admin, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Observer have access to all submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(observer, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Manager have access to all submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(manager, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Copilot have access to all submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(copilot, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Client Manager have access to all submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(clientManager, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getArtifactDownloadUrl(nonSubmitter, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission artifacts during submission phase ', async () => {
        return service.getArtifactDownloadUrl(submitter1, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Submitter will not have access to other submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(submitter3, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer should not have access to any submission artifacts during submission phase', async () => {
        return service.getArtifactDownloadUrl(reviewer, subPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submission artifacts during review phase', async () => {
        return service.getArtifactDownloadUrl(admin, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Observer have access to all submission artifacts during review phase', async () => {
        return service.getArtifactDownloadUrl(observer, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Manager have access to all submission artifacts during review phase', async () => {
        return service.getArtifactDownloadUrl(manager, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Copilot have access to all submission artifacts during review phase', async () => {
        return service.getArtifactDownloadUrl(copilot, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Client Manager have access to all submission artifacts during review phase', async () => {
        return service.getArtifactDownloadUrl(clientManager, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getArtifactDownloadUrl(nonSubmitter, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during review phase ', async () => {
        return service.getArtifactDownloadUrl(submitter1, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Submitter will not have access to other submission during review phase', async () => {
        return service.getArtifactDownloadUrl(submitter3, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer will have access to all submission during review phase', async () => {
        return service.getArtifactDownloadUrl(reviewer, reviewPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submission artifacts during appeals phase', async () => {
        return service.getArtifactDownloadUrl(admin, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Observer have access to all submission artifacts during appeals phase', async () => {
        return service.getArtifactDownloadUrl(observer, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Manager have access to all submission artifacts during appeals phase', async () => {
        return service.getArtifactDownloadUrl(manager, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Copilot have access to all submission artifacts during appeals phase', async () => {
        return service.getArtifactDownloadUrl(copilot, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Client Manager have access to all submission artifacts during appeals phase', async () => {
        return service.getArtifactDownloadUrl(clientManager, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getArtifactDownloadUrl(nonSubmitter, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during appeals phase ', async () => {
        return service.getArtifactDownloadUrl(submitter1, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Submitter will not have access to other submission during appeals phase', async () => {
        return service.getArtifactDownloadUrl(submitter3, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith('You are not allowed to download artifacts of this submission')
      })

      it('Reviewer will have access to all submission during appeals phase', async () => {
        return service.getArtifactDownloadUrl(reviewer, appealsPhaseSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submission artifacts after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(admin, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Observer have access to all submission artifacts after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(observer, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Manager have access to all submission artifacts after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(manager, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Copilot have access to all submission artifacts after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(copilot, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Client Manager have access to all submission artifacts after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(clientManager, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getArtifactDownloadUrl(nonSubmitter, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access to his submission after appeals response closure ', async () => {
        return service.getArtifactDownloadUrl(submitter1, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Submitter will have access to other submission after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(submitter3, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })

      it('Submitter should not have access to other submission after appeals response closure if the challenge is MM', async () => {
        return service.getArtifactDownloadUrl(mmSubmitter, mmSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Reviewer will have access to all submission after appeals response closure', async () => {
        return service.getArtifactDownloadUrl(reviewer, completedChallengeSubmissions[0].id, artifactsResponse.artifacts[0]).should.be.fulfilled
      })
    })
  })
})

/* eslint-enable no-unused-expressions */
