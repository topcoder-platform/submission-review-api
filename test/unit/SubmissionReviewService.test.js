/*
 * Unit testing of Submission service with mocks
 */

/* eslint-disable no-unused-expressions */

// During the test the env variable is set to test
process.env.NODE_ENV = 'test'

const chai = require('chai')
const logger = require('../../src/common/logger')

const service = require('../../src/services/SubmissionReviewService')

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
  admin,
  submitter1,
  submitter2,
  submitter3,
  nonSubmitter,
  observer,
  manager,
  copilot,
  reviewer,
  clientManager,
  subPhaseSubmissions,
  reviewPhaseSubmissions,
  appealsPhaseSubmissions,
  completedChallengeSubmissions } = require('../testData')

chai.should()
chai.use(require('chai-as-promised'))

describe('Submission Review Service tests', () => {
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
   * Test the function getChallengeSubmissions
   */
  describe('Function getChallengeSubmissions tests', () => {
    describe('Agnostic tests', () => {
      it('Null message should be rejected with Current User required error', async () => {
        return service.getChallengeSubmissions().should.be.rejectedWith('"currentUser" is required')
      })

      it('Calling function without challengeId should be rejected with required field error', async () => {
        return service.getChallengeSubmissions(admin).should.be.rejectedWith('"challengeId" is required')
      })

      it('Invalid challenge should be rejected with could not load challenge error', async () => {
        return service.getChallengeSubmissions(admin, invalidChallengeId).should.be.rejectedWith(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Challenge without resource details should have error related to challenge resources in logs', async () => {
        await service.getChallengeSubmissions(admin, noResourceChallengeId).should.be.rejected
        errorLogs.should.not.be.empty
        errorLogs[1].should.have.string(`Could not load challenge resources`)
      })

      it('Challenge with no submission should return empty array', async () => {
        await service.getChallengeSubmissions(admin, noSubmissionChallengeId).should.eventually.eql([])
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(admin, submissionPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(observer, submissionPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(manager, submissionPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(copilot, submissionPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(clientManager, submissionPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        await service.getChallengeSubmissions(nonSubmitter, submissionPhaseChallengeId).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during submission phase ', async () => {
        const submissions = await service.getChallengeSubmissions(submitter1, submissionPhaseChallengeId)
        submissions.length.should.be.eql(1)
        submissions[0].should.not.have.keys(['memberId', 'memberHandle'])
        submissions[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during submission phase', async () => {
        await service.getChallengeSubmissions(submitter3, submissionPhaseChallengeId).should.eventually.eql([])
        errorLogs.should.be.empty
      })

      it('Reviewer should not have access to any submission during submission phase', async () => {
        await service.getChallengeSubmissions(reviewer, submissionPhaseChallengeId).should.eventually.eql([])
        errorLogs.should.be.empty
      })

      it('Reviewer have access to all submissions in F2F during submission phase', async () => {
        const submissions = await service.getChallengeSubmissions(reviewer, f2fChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(admin, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(observer, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(manager, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(copilot, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(clientManager, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        await service.getChallengeSubmissions(nonSubmitter, reviewPhaseChallengeId).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during review phase ', async () => {
        const submissions = await service.getChallengeSubmissions(submitter1, reviewPhaseChallengeId)
        submissions.length.should.be.eql(1)
        submissions[0].should.not.have.keys(['memberId', 'memberHandle'])
        submissions[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during review phase', async () => {
        await service.getChallengeSubmissions(submitter3, reviewPhaseChallengeId).should.eventually.eql([])
        errorLogs.should.be.empty
      })

      it('Reviewer should have access to all submissions during review phase', async () => {
        const submissions = await service.getChallengeSubmissions(reviewer, reviewPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(admin, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(observer, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(manager, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(copilot, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(clientManager, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        await service.getChallengeSubmissions(nonSubmitter, appealsPhaseChallengeId).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during appeals phase ', async () => {
        const submissions = await service.getChallengeSubmissions(submitter1, appealsPhaseChallengeId)
        submissions.length.should.be.eql(1)
        submissions[0].should.not.have.keys(['memberId', 'memberHandle'])
        submissions[0].should.have.keys(['submissions'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should not have access to any submission during appeals phase', async () => {
        await service.getChallengeSubmissions(submitter3, appealsPhaseChallengeId).should.eventually.eql([])
        errorLogs.should.be.empty
      })

      it('Reviewer should have access to all submissions during appeals phase', async () => {
        const submissions = await service.getChallengeSubmissions(reviewer, appealsPhaseChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(admin, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(observer, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(manager, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(copilot, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(clientManager, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any submission', async () => {
        await service.getChallengeSubmissions(nonSubmitter, completedChallengeId).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access to all submissions after appeals response closure ', async () => {
        const submissions = await service.getChallengeSubmissions(submitter1, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission should have access to all submission after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(submitter3, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Reviewer should have access to all submissions after appeals response closure', async () => {
        const submissions = await service.getChallengeSubmissions(reviewer, completedChallengeId)
        submissions.length.should.be.eql(2)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test the function getSubmissionReviews
   */
  describe('Function getSubmissionReviews tests', () => {
    describe('Agnostic tests', () => {
      it('Null message should be rejected with Current User required error', async () => {
        return service.getSubmissionReviews().should.be.rejectedWith('"currentUser" is required')
      })

      it('Calling function without submissionId should be rejected with required field error', async () => {
        return service.getSubmissionReviews(admin).should.be.rejectedWith('"submissionId" is required')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        return service.getSubmissionReviews(admin, 'abcd-def').should.be.rejectedWith('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        return service.getSubmissionReviews(admin, invalidChallengeIdSubmission.id).should.be.rejectedWith(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        return service.getSubmissionReviews(admin, noResourceChallengeIdSubmission.id).should.be.rejectedWith('Could not load challenge resources')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all reviews during review phase', async () => {
        const submission = await service.getSubmissionReviews(admin, reviewPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews during review phase', async () => {
        const submission = await service.getSubmissionReviews(observer, reviewPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews during review phase', async () => {
        const submission = await service.getSubmissionReviews(manager, reviewPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews during review phase', async () => {
        const submission = await service.getSubmissionReviews(copilot, reviewPhaseSubmissions[1].id)
        const reviews = submission.review
        reviews.length.should.be.eql(0)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews during review phase', async () => {
        const submission = await service.getSubmissionReviews(clientManager, reviewPhaseSubmissions[1].id)
        const reviews = submission.review
        reviews.length.should.be.eql(0)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        await service.getSubmissionReviews(nonSubmitter, reviewPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter will not have access to his own reviews during review phase ', async () => {
        const submission = await service.getSubmissionReviews(submitter1, reviewPhaseSubmissions[0].id)
        submission.should.not.have.keys(['review'])
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will not have access to any review during review phase', async () => {
        await service.getSubmissionReviews(submitter3, reviewPhaseSubmissions[0].id).should.be.rejectedWith('You cannot view other member reviews before Appeals Response closure')
      })

      it('Reviewer should have access to his own review during review phase', async () => {
        const submission = await service.getSubmissionReviews(reviewer, reviewPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(1)
        reviews[0].reviewer.should.be.equal(reviewer.handle)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(admin, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(observer, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(manager, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(copilot, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(clientManager, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        await service.getSubmissionReviews(nonSubmitter, appealsPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(submitter1, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will not have access to others reviews during appeals phase', async () => {
        await service.getSubmissionReviews(submitter2, appealsPhaseSubmissions[0].id).should.be.rejectedWith('You cannot view other member reviews before Appeals Response closure')
      })

      it('Registered User with no submission will not have access to any reviews during appeals phase', async () => {
        await service.getSubmissionReviews(submitter3, appealsPhaseSubmissions[0].id).should.be.rejectedWith('You cannot view other member reviews before Appeals Response closure')
      })

      it('Reviewer should have access to his own reviews during appeals phase', async () => {
        const submission = await service.getSubmissionReviews(reviewer, appealsPhaseSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(1)
        reviews[0].reviewer.should.be.equal(reviewer.handle)
        errorLogs.should.be.empty
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(admin, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Observer have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(observer, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Manager have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(manager, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Copilot have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(copilot, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Client Manager have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(clientManager, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('User who has not registered will not have access to any reviews', async () => {
        await service.getSubmissionReviews(nonSubmitter, completedChallengeSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter will have access to his own reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(submitter1, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Submitter will have access to others reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(submitter2, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Registered User with no submission will have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(submitter3, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        errorLogs.should.be.empty
      })

      it('Reviewer should have access to all reviews after appeals response closure', async () => {
        const submission = await service.getSubmissionReviews(reviewer, completedChallengeSubmissions[0].id)
        const reviews = submission.review
        reviews.length.should.be.eql(2)
        reviews[0].reviewer.should.be.equal(reviewer.handle)
        errorLogs.should.be.empty
      })
    })
  })

  /*
   * Test the function getDownloadUrl
   */
  describe('Function getDownloadUrl tests', () => {
    describe('Agnostic tests', () => {
      it('Null message should be rejected with Current User required error', async () => {
        return service.getDownloadUrl().should.be.rejectedWith('"currentUser" is required')
      })

      it('Calling function without submissionId should be rejected with required field error', async () => {
        return service.getDownloadUrl(admin).should.be.rejectedWith('"submissionId" is required')
      })

      it('Invalid Submission ID should be rejected with could not load submission error', async () => {
        return service.getDownloadUrl(admin, 'abcd-def').should.be.rejectedWith('Could not load submission.')
      })

      it('Submission with Invalid Challenge should be rejected with could not load challenge error', async () => {
        return service.getDownloadUrl(admin, invalidChallengeIdSubmission.id).should.be.rejectedWith(`Could not load challenge: ${invalidChallengeId}`)
      })

      it('Submission with Invalid Challenge resources should be rejected with could not load challenge resources error', async () => {
        return service.getDownloadUrl(admin, noResourceChallengeIdSubmission.id).should.be.rejectedWith('Could not load challenge resources')
      })
    })

    describe('Tests related to submission phase checks', () => {
      it('Admin have access to all submissions during submission phase', async () => {
        return service.getDownloadUrl(admin, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Observer have access to all submissions during submission phase', async () => {
        return service.getDownloadUrl(observer, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Manager have access to all submissions during submission phase', async () => {
        return service.getDownloadUrl(manager, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Copilot have access to all submissions during submission phase', async () => {
        return service.getDownloadUrl(copilot, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Client Manager have access to all submissions during submission phase', async () => {
        return service.getDownloadUrl(clientManager, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getDownloadUrl(nonSubmitter, subPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during submission phase ', async () => {
        return service.getDownloadUrl(submitter1, subPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Submitter will not have access to other submission during submission phase', async () => {
        return service.getDownloadUrl(submitter3, subPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download this submission')
      })

      it('Reviewer should not have access to any submission during submission phase', async () => {
        return service.getDownloadUrl(reviewer, subPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download this submission')
      })
    })

    describe('Tests related to review phase checks', () => {
      it('Admin have access to all submissions during review phase', async () => {
        return service.getDownloadUrl(admin, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Observer have access to all submissions during review phase', async () => {
        return service.getDownloadUrl(observer, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Manager have access to all submissions during review phase', async () => {
        return service.getDownloadUrl(manager, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Copilot have access to all submissions during review phase', async () => {
        return service.getDownloadUrl(copilot, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Client Manager have access to all submissions during review phase', async () => {
        return service.getDownloadUrl(clientManager, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getDownloadUrl(nonSubmitter, reviewPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during review phase ', async () => {
        return service.getDownloadUrl(submitter1, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Submitter will not have access to other submission during review phase', async () => {
        return service.getDownloadUrl(submitter3, reviewPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download this submission')
      })

      it('Reviewer will have access to all submission during review phase', async () => {
        return service.getDownloadUrl(reviewer, reviewPhaseSubmissions[0].id).should.be.fulfilled
      })
    })

    describe('Tests related to appeals phase checks', () => {
      it('Admin have access to all submissions during appeals phase', async () => {
        return service.getDownloadUrl(admin, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Observer have access to all submissions during appeals phase', async () => {
        return service.getDownloadUrl(observer, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Manager have access to all submissions during appeals phase', async () => {
        return service.getDownloadUrl(manager, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Copilot have access to all submissions during appeals phase', async () => {
        return service.getDownloadUrl(copilot, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Client Manager have access to all submissions during appeals phase', async () => {
        return service.getDownloadUrl(clientManager, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getDownloadUrl(nonSubmitter, appealsPhaseSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access only to his submission during appeals phase ', async () => {
        return service.getDownloadUrl(submitter1, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })

      it('Submitter will not have access to other submission during appeals phase', async () => {
        return service.getDownloadUrl(submitter3, appealsPhaseSubmissions[0].id).should.be.rejectedWith('You are not allowed to download this submission')
      })

      it('Reviewer will have access to all submission during appeals phase', async () => {
        return service.getDownloadUrl(reviewer, appealsPhaseSubmissions[0].id).should.be.fulfilled
      })
    })

    describe('Tests related to appeals response closure checks', () => {
      it('Admin have access to all submissions after appeals response closure', async () => {
        return service.getDownloadUrl(admin, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Observer have access to all submissions after appeals response closure', async () => {
        return service.getDownloadUrl(observer, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Manager have access to all submissions after appeals response closure', async () => {
        return service.getDownloadUrl(manager, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Copilot have access to all submissions after appeals response closure', async () => {
        return service.getDownloadUrl(copilot, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Client Manager have access to all submissions after appeals response closure', async () => {
        return service.getDownloadUrl(clientManager, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('User who has not registered will not have access to any submission', async () => {
        return service.getDownloadUrl(nonSubmitter, completedChallengeSubmissions[0].id).should.be.rejectedWith(`You don't have access to this challenge!`)
      })

      it('Submitter have access to his submission after appeals response closure ', async () => {
        return service.getDownloadUrl(submitter1, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Submitter will have access to other submission after appeals response closure', async () => {
        return service.getDownloadUrl(submitter3, completedChallengeSubmissions[0].id).should.be.fulfilled
      })

      it('Reviewer will have access to all submission after appeals response closure', async () => {
        return service.getDownloadUrl(reviewer, completedChallengeSubmissions[0].id).should.be.fulfilled
      })
    })
  })
})

/* eslint-enable no-unused-expressions */
