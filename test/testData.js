/*
 * Test data for Unit and E2E tests
 */

const invalidChallengeId = 123
const noResourceChallengeId = 1234560
const noSubmissionChallengeId = 1234561
const submissionPhaseChallengeId = 30049360
const reviewPhaseChallengeId = 30049361
const appealsPhaseChallengeId = 30049362
const completedChallengeId = 30049363
const f2fChallengeId = 30049364

const resourcesResponse = {
  'id': '-7afbdf6f:168c51fa14f:-7a2e',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': [
      {
        'id': 1043043,
        'projectId': 30049360,
        'name': null,
        'role': 'Copilot',
        'phaseId': null,
        'submissions': [],
        'properties': {
          'Registration Date': '05.04.2018 04:18 AM',
          'Payment': '600.0',
          'External Reference ID': '151743',
          'Payment Status': 'No',
          'Manual Payments': 'false',
          'Handle': 'Ghostar'
        },
        'updatedAt': '2019-02-13T07:26:26.943Z',
        'createdAt': '2018-05-04T08:18:23.828Z',
        'createdBy': '151743',
        'updatedBy': '8547899'
      },
      {
        'id': 1034760,
        'projectId': 30049360,
        'name': null,
        'role': 'Manager',
        'phaseId': null,
        'submissions': [],
        'properties': {
          'Registration Date': '07.27.2015 09:19 AM',
          'External Reference ID': '23274118',
          'Handle': 'ritesh_cs'
        },
        'updatedAt': '2019-03-05T13:16:37.977Z',
        'createdAt': '2015-07-27T13:19:43.648Z',
        'createdBy': '11823846',
        'updatedBy': '8547899'
      },
      {
        'id': 1034763,
        'projectId': 30049360,
        'name': null,
        'role': 'Observer',
        'phaseId': null,
        'submissions': [],
        'properties': {
          'Registration Date': '07.27.2015 09:19 AM',
          'External Reference ID': '40009650',
          'Payment Status': 'N/A',
          'Handle': 'msoni'
        },
        'updatedAt': '2019-03-05T13:16:38.099Z',
        'createdAt': '2015-07-27T13:19:43.758Z',
        'createdBy': '11823846',
        'updatedBy': '8547899'
      },
      {
        'id': 1052450,
        'projectId': 30049360,
        'name': null,
        'role': 'Client Manager',
        'phaseId': 733197,
        'submissions': [],
        'properties': {
          'Registration Date': '08.30.2018 08:32 AM',
          'External Reference ID': '8547845',
          'Handle': 'mess'
        },
        'updatedAt': '2019-03-05T13:16:38.927Z',
        'createdAt': '2018-08-30T12:32:37.268Z',
        'createdBy': '8547899',
        'updatedBy': '8547899'
      },
      {
        'id': 1070205,
        'projectId': 30049360,
        'name': null,
        'role': 'reviewer',
        'phaseId': 733197,
        'submissions': [],
        'properties': {
          'Registration Date': '03.05.2019 08:16 AM',
          'External Reference ID': '22713337',
          'Handle': 'pvmagacho'
        },
        'updatedAt': '2019-03-05T13:16:39.744Z',
        'createdAt': '2019-03-05T13:16:39.744Z',
        'createdBy': '8547899',
        'updatedBy': '8547899'
      },
      {
        'id': 1070206,
        'projectId': 30049360,
        'name': null,
        'role': 'Iterative Reviewer',
        'phaseId': 733197,
        'submissions': [],
        'properties': {
          'Registration Date': '03.05.2019 08:16 AM',
          'External Reference ID': '22713338',
          'Handle': 'jessie'
        },
        'updatedAt': '2019-03-05T13:16:39.744Z',
        'createdAt': '2019-03-05T13:16:39.744Z',
        'createdBy': '8547899',
        'updatedBy': '8547899'
      },
      {
        'id': 40048649,
        'projectId': 30049360,
        'name': null,
        'role': 'Submitter',
        'phaseId': null,
        'submissions': [
          509262
        ],
        'properties': {
          'Registration Date': '07.30.2015 03:36 PM',
          'External Reference ID': '10336829',
          'Appeals Completed Early': 'NO',
          'Handle': 'Sharathkumar92'
        },
        'updatedAt': '2019-03-05T13:16:38.968Z',
        'createdAt': '2015-07-30T23:37:34.000Z',
        'createdBy': '10336829',
        'updatedBy': '8547899'
      },
      {
        'id': 40048650,
        'projectId': 30049360,
        'name': null,
        'role': 'Submitter',
        'phaseId': null,
        'submissions': [
          205459
        ],
        'properties': {
          'Registration Date': '10.27.2015 09:19 AM',
          'External Reference ID': '8521452',
          'Appeals Completed Early': 'NO',
          'Handle': 'lazybaer'
        },
        'updatedAt': '2019-03-05T13:16:39.016Z',
        'createdAt': '2015-10-27T17:20:32.000Z',
        'createdBy': '8547899',
        'updatedBy': '8547899'
      },
      {
        'id': 40048651,
        'projectId': 30049360,
        'name': null,
        'role': 'submitter',
        'phaseId': null,
        'submissions': [],
        'properties': {
          'Registration Date': '10.28.2015 04:37 PM',
          'External Reference ID': '151741',
          'Appeals Completed Early': 'NO',
          'Handle': 'crazyk'
        },
        'updatedAt': '2019-03-05T13:16:39.070Z',
        'createdAt': '2015-10-29T00:38:21.000Z',
        'createdBy': '151741',
        'updatedBy': '8547899'
      }

    ]
  },
  'version': 'v3'
}

const submissionPhaseChallengeResponse = {
  'id': '3878311e:168c51f9843:-7a42',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'challengeType': 'Code',
      'challengeName': 'Code Dev-Env Test',
      'challengeId': submissionPhaseChallengeId,
      'projectId': 7572,
      'forumId': '28457',
      'detailedRequirements': '<p>testing</p>\n',
      'finalSubmissionGuidelines': '<p>testing</p>\n',
      'screeningScorecardId': null,
      'reviewScorecardId': '30001610',
      'cmcTaskId': '',
      'numberOfCheckpointsPrizes': 0,
      'topCheckPointPrize': '',
      'postingDate': '2015-07-27T01:00:00Z',
      'registrationEndDate': '2019-12-02T02:00:00Z',
      'checkpointSubmissionEndDate': null,
      'submissionEndDate': '2019-12-02T02:00:00Z',
      'reviewType': 'COMMUNITY',
      'environment': null,
      'codeRepo': null,
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=28457',
      'appealsEndDate': '2019-12-06T02:00:00Z',
      'finalFixEndDate': null,
      'currentStatus': 'Active',
      'digitalRunPoints': null,
      'challengeCommunity': 'develop',
      'directUrl': `https://www.topcoder.com/direct/contest/detail.action?projectId=${submissionPhaseChallengeId}`,
      'technology': [
        '.NET'
      ],
      'prize': [
        350,
        150
      ],
      'currentPhaseName': 'Registration',
      'currentPhaseRemainingTime': 23277726,
      'currentPhaseEndDate': '2019-12-02T02:00:00Z',
      'documents': [],
      'platforms': [
        'Android'
      ],
      'phases': [
        {
          'type': 'Registration',
          'status': 'Open',
          'scheduledStartTime': '2015-07-27T01:00:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Submission',
          'status': 'Open',
          'scheduledStartTime': '2015-07-27T01:05:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Review',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-02T02:00:00Z',
          'scheduledEndTime': '2019-12-04T02:00:00Z'
        },
        {
          'type': 'Appeals',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-04T02:00:00Z',
          'scheduledEndTime': '2019-12-05T02:00:00Z'
        },
        {
          'type': 'Appeals Response',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-05T02:00:00Z',
          'scheduledEndTime': '2019-12-06T02:00:00Z'
        }
      ],
      'submissions': [],
      'checkpoints': [],
      'numberOfRegistrants': 16,
      'numberOfSubmissions': 7,
      'numberOfCheckpointSubmissions': 0
    }
  },
  'version': 'v3'
}

const reviewPhaseChallengeResponse = {
  'id': '3878311e:168c51f9843:-7a42',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'challengeType': 'Code',
      'challengeName': 'Code Dev-Env Review',
      'challengeId': reviewPhaseChallengeId,
      'projectId': 7573,
      'forumId': '28458',
      'detailedRequirements': '<p>testing</p>\n',
      'finalSubmissionGuidelines': '<p>testing</p>\n',
      'screeningScorecardId': null,
      'reviewScorecardId': '30001610',
      'cmcTaskId': '',
      'numberOfCheckpointsPrizes': 0,
      'topCheckPointPrize': '',
      'postingDate': '2015-07-27T01:00:00Z',
      'registrationEndDate': '2019-12-02T02:00:00Z',
      'checkpointSubmissionEndDate': null,
      'submissionEndDate': '2019-12-02T02:00:00Z',
      'reviewType': 'COMMUNITY',
      'environment': null,
      'codeRepo': null,
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=28458',
      'appealsEndDate': '2019-12-06T02:00:00Z',
      'finalFixEndDate': null,
      'currentStatus': 'Active',
      'digitalRunPoints': null,
      'challengeCommunity': 'develop',
      'directUrl': `https://www.topcoder.com/direct/contest/detail.action?projectId=${reviewPhaseChallengeId}`,
      'technology': [
        '.NET'
      ],
      'prize': [
        350,
        150
      ],
      'currentPhaseName': 'Review',
      'currentPhaseRemainingTime': 23277726,
      'currentPhaseEndDate': '2019-12-04T02:00:00Z',
      'documents': [],
      'platforms': [
        'Android'
      ],
      'phases': [
        {
          'type': 'Registration',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:00:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Submission',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:05:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Review',
          'status': 'Open',
          'scheduledStartTime': '2019-12-02T02:00:00Z',
          'actualStartTime': '2019-12-02T02:00:00Z',
          'scheduledEndTime': '2019-12-04T02:00:00Z'
        },
        {
          'type': 'Appeals',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-04T02:00:00Z',
          'scheduledEndTime': '2019-12-05T02:00:00Z'
        },
        {
          'type': 'Appeals Response',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-05T02:00:00Z',
          'scheduledEndTime': '2019-12-06T02:00:00Z'
        }
      ],
      'submissions': [],
      'checkpoints': [],
      'numberOfRegistrants': 16,
      'numberOfSubmissions': 7,
      'numberOfCheckpointSubmissions': 0
    }
  },
  'version': 'v3'
}

const appealsPhaseChallengeResponse = {
  'id': '3878311e:168c51f9843:-7a42',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'challengeType': 'Code',
      'challengeName': 'Code Dev-Env Appeals',
      'challengeId': appealsPhaseChallengeId,
      'projectId': 7574,
      'forumId': '28459',
      'detailedRequirements': '<p>testing</p>\n',
      'finalSubmissionGuidelines': '<p>testing</p>\n',
      'screeningScorecardId': null,
      'reviewScorecardId': '30001610',
      'cmcTaskId': '',
      'numberOfCheckpointsPrizes': 0,
      'topCheckPointPrize': '',
      'postingDate': '2015-07-27T01:00:00Z',
      'registrationEndDate': '2019-12-02T02:00:00Z',
      'checkpointSubmissionEndDate': null,
      'submissionEndDate': '2019-12-02T02:00:00Z',
      'reviewType': 'COMMUNITY',
      'environment': null,
      'codeRepo': null,
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=28459',
      'appealsEndDate': '2019-12-06T02:00:00Z',
      'finalFixEndDate': null,
      'currentStatus': 'Active',
      'digitalRunPoints': null,
      'challengeCommunity': 'develop',
      'directUrl': `https://www.topcoder.com/direct/contest/detail.action?projectId=${appealsPhaseChallengeId}`,
      'technology': [
        '.NET'
      ],
      'prize': [
        350,
        150
      ],
      'currentPhaseName': 'Appeals',
      'currentPhaseRemainingTime': 23277726,
      'currentPhaseEndDate': '2019-12-05T02:00:00Z',
      'documents': [],
      'platforms': [
        'Android'
      ],
      'phases': [
        {
          'type': 'Registration',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:00:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Submission',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:05:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Review',
          'status': 'Closed',
          'scheduledStartTime': '2019-12-02T02:00:00Z',
          'actualStartTime': '2019-12-02T02:00:00Z',
          'scheduledEndTime': '2019-12-04T02:00:00Z',
          'actualEndTime': '2019-12-04T02:00:00Z'
        },
        {
          'type': 'Appeals',
          'status': 'Open',
          'scheduledStartTime': '2019-12-04T02:00:00Z',
          'actualStartTime': '2019-12-04T02:00:00Z',
          'scheduledEndTime': '2019-12-05T02:00:00Z'
        },
        {
          'type': 'Appeals Response',
          'status': 'Scheduled',
          'scheduledStartTime': '2019-12-05T02:00:00Z',
          'scheduledEndTime': '2019-12-06T02:00:00Z'
        }
      ],
      'submissions': [],
      'checkpoints': [],
      'numberOfRegistrants': 16,
      'numberOfSubmissions': 7,
      'numberOfCheckpointSubmissions': 0
    }
  },
  'version': 'v3'
}

const completedChallengeResponse = {
  'id': '3878311e:168c51f9843:-7a42',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'challengeType': 'Code',
      'challengeName': 'Code Dev-Env Completed',
      'challengeId': completedChallengeId,
      'projectId': 7575,
      'forumId': '28460',
      'detailedRequirements': '<p>testing</p>\n',
      'finalSubmissionGuidelines': '<p>testing</p>\n',
      'screeningScorecardId': null,
      'reviewScorecardId': '30001610',
      'cmcTaskId': '',
      'numberOfCheckpointsPrizes': 0,
      'topCheckPointPrize': '',
      'postingDate': '2015-07-27T01:00:00Z',
      'registrationEndDate': '2019-12-02T02:00:00Z',
      'checkpointSubmissionEndDate': null,
      'submissionEndDate': '2019-12-02T02:00:00Z',
      'reviewType': 'COMMUNITY',
      'environment': null,
      'codeRepo': null,
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=28460',
      'appealsEndDate': '2019-12-06T02:00:00Z',
      'finalFixEndDate': null,
      'currentStatus': 'Completed',
      'digitalRunPoints': null,
      'challengeCommunity': 'develop',
      'directUrl': `https://www.topcoder.com/direct/contest/detail.action?projectId=${completedChallengeId}`,
      'technology': [
        '.NET'
      ],
      'prize': [
        350,
        150
      ],
      'currentPhaseName': 'Stalled',
      'currentPhaseRemainingTime': 0,
      'currentPhaseEndDate': null,
      'documents': [],
      'platforms': [
        'Android'
      ],
      'phases': [
        {
          'type': 'Registration',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:00:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Submission',
          'status': 'Closed',
          'scheduledStartTime': '2015-07-27T01:05:00Z',
          'actualStartTime': '2015-07-27T01:00:00Z',
          'scheduledEndTime': '2019-12-02T02:00:00Z',
          'actualEndTime': '2019-12-02T02:00:00Z'
        },
        {
          'type': 'Review',
          'status': 'Closed',
          'scheduledStartTime': '2019-12-02T02:00:00Z',
          'actualStartTime': '2019-12-02T02:00:00Z',
          'scheduledEndTime': '2019-12-04T02:00:00Z',
          'actualEndTime': '2019-12-04T02:00:00Z'
        },
        {
          'type': 'Appeals',
          'status': 'Closed',
          'scheduledStartTime': '2019-12-04T02:00:00Z',
          'actualStartTime': '2019-12-04T02:00:00Z',
          'scheduledEndTime': '2019-12-05T02:00:00Z',
          'actualEndTime': '2019-12-05T02:00:00Z'
        },
        {
          'type': 'Appeals Response',
          'status': 'Closed',
          'scheduledStartTime': '2019-12-05T02:00:00Z',
          'actualStartTime': '2019-12-05T02:00:00Z',
          'scheduledEndTime': '2019-12-06T02:00:00Z',
          'actualEndTime': '2019-12-06T02:00:00Z'
        }
      ],
      'submissions': [],
      'checkpoints': [],
      'numberOfRegistrants': 16,
      'numberOfSubmissions': 7,
      'numberOfCheckpointSubmissions': 0
    }
  },
  'version': 'v3'
}

const f2fChallengeResponse = {
  'id': '-2e28b0da:1692713635f:-3c2',
  'result': {
    'success': true,
    'status': 200,
    'metadata': null,
    'content': {
      'subTrack': 'FIRST_2_FINISH',
      'challengeTitle': 'SLD Editor Bug Fixes 79',
      'challengeId': f2fChallengeId,
      'projectId': 18809,
      'forumId': 62528,
      'detailedRequirements': 'F2F',
      'screeningScorecardId': null,
      'reviewScorecardId': '30001600',
      'cmcTaskId': '',
      'numberOfCheckpointsPrizes': 0,
      'topCheckPointPrize': '',
      'postingDate': '2019-03-06T09:49:22Z',
      'registrationEndDate': '2019-03-13T08:49:00Z',
      'checkpointSubmissionEndDate': null,
      'submissionEndDate': '2019-03-13T09:00:00Z',
      'reviewType': 'INTERNAL',
      'environment': null,
      'codeRepo': null,
      'forumLink': 'https://apps.topcoder.com/forums/?module=Category&categoryID=62528',
      'appealsEndDate': '2019-03-09T04:47:00Z',
      'finalFixEndDate': null,
      'currentStatus': 'Active',
      'digitalRunPoints': null,
      'challengeCommunity': 'develop',
      'directUrl': 'https://www.topcoder.com/direct/contest/detail.action?projectId=30085488',
      'technology': [
        'Angular 2+',
        ' CSS',
        ' JavaScript'
      ],
      'prize': [
        100
      ],
      'currentPhaseName': 'Registration',
      'currentPhaseRemainingTime': 441264,
      'currentPhaseEndDate': '2019-03-13T08:49:00Z',
      'platforms': [
        'HTML'
      ],
      'phases': [
        {
          'type': 'Registration',
          'status': 'Open',
          'scheduledStartTime': '2019-03-06T09:49:22Z',
          'actualStartTime': '2019-03-06T09:49:22Z',
          'scheduledEndTime': '2019-03-13T08:49:00Z',
          'actualEndTime': null
        },
        {
          'type': 'Iterative Review',
          'status': 'Closed',
          'scheduledStartTime': '2019-03-06T04:20:41Z',
          'actualStartTime': '2019-03-06T04:20:41Z',
          'scheduledEndTime': '2019-03-07T02:53:03Z',
          'actualEndTime': '2019-03-07T02:53:03Z'
        },
        {
          'type': 'Submission',
          'status': 'Open',
          'scheduledStartTime': '2019-03-06T10:05:38Z',
          'actualStartTime': '2019-03-06T10:05:38Z',
          'scheduledEndTime': '2019-03-13T09:00:00Z',
          'actualEndTime': null
        },
        {
          'type': 'Iterative Review',
          'status': 'Open',
          'scheduledStartTime': '2019-03-08T03:52:19Z',
          'actualStartTime': '2019-03-08T03:52:19Z',
          'scheduledEndTime': '2019-03-08T04:47:01Z',
          'actualEndTime': null
        }
      ],
      'submissions': [],
      'checkpoints': [],
      'numberOfRegistrants': 9,
      'numberOfSubmissions': 4,
      'numberOfCheckpointSubmissions': 0
    }
  },
  'version': 'v3'
}

const subPhaseSubmissions = [
  {
    'challengeId': submissionPhaseChallengeId,
    'updatedBy': 'Sharathkumar92',
    'createdBy': 'Sharathkumar92',
    'created': '2018-08-22T19:58:48.839Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 509262,
    'id': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'type': 'Contest Submission',
    'updated': '2018-08-22T19:58:48.839Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'memberId': 10336829
  },
  {
    'challengeId': submissionPhaseChallengeId,
    'updatedBy': 'lazybaer',
    'createdBy': 'lazybaer',
    'created': '2018-08-22T20:32:17.436Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 205459,
    'id': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'type': 'Contest Submission',
    'updated': '2018-08-22T20:32:17.436Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'memberId': 8521452
  }
]

const reviewPhaseSubmissions = [
  {
    'challengeId': reviewPhaseChallengeId,
    'updatedBy': 'Sharathkumar92',
    'createdBy': 'Sharathkumar92',
    'created': '2018-08-22T19:58:48.839Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 509262,
    'id': 'dfa95c6e-efe8-4439-a6ab-d197e906bc7d',
    'type': 'Contest Submission',
    'updated': '2018-08-22T19:58:48.839Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'memberId': 10336829,
    'review': [
      {
        'score': 97,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3711',
        'updated': '2019-02-26T22:12:47.251Z'
      },
      {
        'score': 95,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713338,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3712',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  },
  {
    'challengeId': reviewPhaseChallengeId,
    'updatedBy': 'lazybaer',
    'createdBy': 'lazybaer',
    'created': '2018-08-22T20:32:17.436Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 205459,
    'id': 'e23f3b35-b9d5-4795-9459-2aadb58f224a',
    'type': 'Contest Submission',
    'updated': '2018-08-22T20:32:17.436Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'memberId': 8521452
  }
]

const appealsPhaseSubmissions = [
  {
    'challengeId': appealsPhaseChallengeId,
    'updatedBy': 'Sharathkumar92',
    'createdBy': 'Sharathkumar92',
    'created': '2018-08-22T19:58:48.839Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 509262,
    'id': 'dfa95c6e-efe8-4439-a6ab-d197e906bc8d',
    'type': 'Contest Submission',
    'updated': '2018-08-22T19:58:48.839Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'memberId': 10336829,
    'review': [
      {
        'score': 97,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3711',
        'updated': '2019-02-26T22:12:47.251Z'
      },
      {
        'score': 95,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713338,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3712',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  },
  {
    'challengeId': appealsPhaseChallengeId,
    'updatedBy': 'lazybaer',
    'createdBy': 'lazybaer',
    'created': '2018-08-22T20:32:17.436Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 205459,
    'id': 'e23f3b35-b9d5-4795-9459-2aadb58f225a',
    'type': 'Contest Submission',
    'updated': '2018-08-22T20:32:17.436Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'memberId': 8521452,
    'review': [
      {
        'score': 62,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3713',
        'updated': '2019-02-26T22:12:47.251Z'
      },
      {
        'score': 67,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713338,
        'submissionId': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3714',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  }
]

const completedChallengeSubmissions = [
  {
    'challengeId': completedChallengeId,
    'updatedBy': 'Sharathkumar92',
    'createdBy': 'Sharathkumar92',
    'created': '2018-08-22T19:58:48.839Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 509262,
    'id': 'dfa95c6e-efe8-4439-a6ab-d197e906bc9d',
    'type': 'Contest Submission',
    'updated': '2018-08-22T19:58:48.839Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'memberId': 10336829,
    'review': [
      {
        'score': 97,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3711',
        'updated': '2019-02-26T22:12:47.251Z'
      },
      {
        'score': 95,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713338,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3712',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  },
  {
    'challengeId': completedChallengeId,
    'updatedBy': 'lazybaer',
    'createdBy': 'lazybaer',
    'created': '2018-08-22T20:32:17.436Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 205459,
    'id': 'e23f3b35-b9d5-4795-9459-2aadb58f226a',
    'type': 'Contest Submission',
    'updated': '2018-08-22T20:32:17.436Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'memberId': 8521452,
    'review': [
      {
        'score': 62,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3713',
        'updated': '2019-02-26T22:12:47.251Z'
      },
      {
        'score': 67,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713338,
        'submissionId': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3714',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  }
]

const f2fSubmissions = [
  {
    'challengeId': f2fChallengeId,
    'updatedBy': 'Sharathkumar92',
    'createdBy': 'Sharathkumar92',
    'created': '2018-08-22T19:58:48.839Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 509262,
    'id': 'dfa95c6e-efe8-4439-a6ab-d197e906bc8d',
    'type': 'Contest Submission',
    'updated': '2018-08-22T19:58:48.839Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
    'memberId': 10336829,
    'review': [
      {
        'score': 0,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'dfa95c6e-efe8-4439-a6ab-d197e906bc6d',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3711',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  },
  {
    'challengeId': f2fChallengeId,
    'updatedBy': 'lazybaer',
    'createdBy': 'lazybaer',
    'created': '2018-08-22T20:32:17.436Z',
    'submissionPhaseId': 747596,
    'legacySubmissionId': 205459,
    'id': 'e23f3b35-b9d5-4795-9459-2aadb58f225a',
    'type': 'Contest Submission',
    'updated': '2018-08-22T20:32:17.436Z',
    'fileType': 'zip',
    'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/e23f3b35-b9d5-4795-9459-2aadb58f223a',
    'memberId': 8521452,
    'review': [
      {
        'score': 100,
        'updatedBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'reviewerId': 22713337,
        'submissionId': 'e23f3b35-b9d5-4795-9459-2aadb58f223a',
        'createdBy': 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B@clients',
        'created': '2019-02-26T22:11:29.842Z',
        'scoreCardId': 30001852,
        'typeId': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
        'id': 'e0f12278-266e-4fbe-bdc1-31685f2d3713',
        'updated': '2019-02-26T22:12:47.251Z'
      }
    ]
  }
]

const invalidChallengeIdSubmission = {
  'challengeId': invalidChallengeId,
  'updatedBy': 'tester',
  'createdBy': 'tester',
  'created': '2018-08-22T20:32:17.436Z',
  'submissionPhaseId': 747596,
  'legacySubmissionId': 206340,
  'id': 'a23f3b35-b9d5-4795-9459-2aadb58f223a',
  'type': 'Contest Submission',
  'updated': '2018-08-22T20:32:17.436Z',
  'fileType': 'zip',
  'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/a23f3b35-b9d5-4795-9459-2aadb58f223a',
  'memberId': 8521453
}

const noResourceChallengeIdSubmission = {
  'challengeId': noResourceChallengeId,
  'updatedBy': 'tester',
  'createdBy': 'tester',
  'created': '2018-08-22T20:32:17.436Z',
  'submissionPhaseId': 747596,
  'legacySubmissionId': 206341,
  'id': 'b23f3b35-b9d5-4795-9459-2aadb58f223a',
  'type': 'Contest Submission',
  'updated': '2018-08-22T20:32:17.436Z',
  'fileType': 'zip',
  'url': 'https://topcoder-dev-submissions-dmz.s3.amazonaws.com/b23f3b35-b9d5-4795-9459-2aadb58f223a',
  'memberId': 8521454
}

const reviewTypes = [
  {
    'name': 'MM',
    'id': '7086ac08-b27f-40e2-a12a-764ba0368a79',
    'isActive': true
  },
  {
    'name': 'Iterative Review',
    'id': 'c56a4180-65aa-42ec-a945-5fd21dec0505',
    'isActive': true
  },
  {
    'name': 'Appeals Response',
    'id': 'c56a4180-65aa-42ec-a945-5fd21dec0504',
    'isActive': true
  },
  {
    'name': 'Review',
    'id': 'c56a4180-65aa-42ec-a945-5fd21dec0503',
    'isActive': true
  },
  {
    'name': 'Virus Scan',
    'id': '68c5a381-c8ab-48af-92a7-7a869a4ee6c3',
    'isActive': true
  },
  {
    'name': 'Screening',
    'id': 'c56a4180-65aa-42ec-a945-5fd21dec0501',
    'isActive': true
  }
]

const adminToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIiwiQ29ubmVjdCBTdXBwb3J0IiwiYWRtaW5pc3RyYXRvciIsIkNvbm5lY3QgTWFuYWdlciIsIkNvbm5lY3QgQWRtaW4iLCJDb25uZWN0IENvcGlsb3QgTWFuYWdlciJdLCJpc3MiOiJodHRwczovL2FwaS50b3Bjb2Rlci1kZXYuY29tIiwiaGFuZGxlIjoiVG9ueUoiLCJleHAiOjE5NTE3OTIyMTEsInVzZXJJZCI6Ijg1NDc4OTkiLCJpYXQiOjE1NDk3OTE2MTEsImVtYWlsIjoidGplZnRzQHRvcGNvZGVyLmNvbSIsImp0aSI6ImY5NGQxZTI2LTNkMGUtNDZjYS04MTE1LTg3NTQ1NDRhMDhmMSJ9.t8HoOAm3jCayBYiY_qwbfstMsXkRnA0Uf3uUFT3uVIg'

const admin = {
  roles:
      [ 'Topcoder User',
        'Connect Support',
        'administrator',
        'Connect Manager',
        'Connect Admin',
        'Connect Copilot Manager' ],
  iss: 'https://api.topcoder-dev.com',
  handle: 'TonyJ',
  exp: 1951792211,
  userId: '8547899',
  iat: 1549791611,
  email: 'tjefts@topcoder.com',
  jti: 'f94d1e26-3d0e-46ca-8115-8754544a08f1'
}

const submitter1Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6IlNoYXJhdGhrdW1hcjkyIiwiZXhwIjoxOTUyMDI0MTU5LCJ1c2VySWQiOiIxMDMzNjgyOSIsImlhdCI6MTU1MjAyMzU1OSwiZW1haWwiOiJTaGFyYXRoa3VtYXI5MkB0b3Bjb2Rlci5jb20iLCJqdGkiOiJkZTNjOTE1Yy1hZDNlLTRkYWEtOWFhMy1lMzY4NWFiYzIyYTEifQ.t2O5LGupVkFwwf0CPe5hDi3OkhlSw6fKgp7KHeRwj6k'

const submitter1 = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'Sharathkumar92',
  'exp': 1952024159,
  'userId': '10336829',
  'iat': 1552023559,
  'email': 'Sharathkumar92@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const submitter2Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6ImxhenliYWVyIiwiZXhwIjoxOTUyMDI0MTU5LCJ1c2VySWQiOiI4NTIxNDUyIiwiaWF0IjoxNTUyMDIzNTU5LCJlbWFpbCI6ImxhenliYWVyQHRvcGNvZGVyLmNvbSIsImp0aSI6ImRlM2M5MTVjLWFkM2UtNGRhYS05YWEzLWUzNjg1YWJjMjJhMSJ9.DzndLV4zdeYm9xOg67h1v-Rgz12YVzTW1rU4lYqeVRI'

const submitter2 = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'lazybaer',
  'exp': 1952024159,
  'userId': '8521452',
  'iat': 1552023559,
  'email': 'lazybaer@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const submitter3Token = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6ImNyYXp5ayIsImV4cCI6MTk1MjAyNDE1OSwidXNlcklkIjoiMTUxNzQxIiwiaWF0IjoxNTUyMDIzNTU5LCJlbWFpbCI6ImNyYXp5a0B0b3Bjb2Rlci5jb20iLCJqdGkiOiJkZTNjOTE1Yy1hZDNlLTRkYWEtOWFhMy1lMzY4NWFiYzIyYTEifQ.2PJSZa3leaxMPDVkvLfgJMlphEXH_S85Uj-Xom9DtsY'

const submitter3 = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'crazyk',
  'exp': 1952024159,
  'userId': '151741',
  'iat': 1552023559,
  'email': 'crazyk@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const nonSubmitterToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InNreWhpdCIsImV4cCI6MTk1MjAyNDE1OSwidXNlcklkIjoiNjMyMTE0NCIsImlhdCI6MTU1MjAyMzU1OSwiZW1haWwiOiJza3loaXRAdG9wY29kZXIuY29tIiwianRpIjoiZGUzYzkxNWMtYWQzZS00ZGFhLTlhYTMtZTM2ODVhYmMyMmExIn0.qgsZrod_1TvPvYn3Nckc4Y_iwlxf-fV22HNAG3n5h2U'

const nonSubmitter = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'skyhit',
  'exp': 1952024159,
  'userId': '6321144',
  'iat': 1552023559,
  'email': 'skyhit@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const observerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6Im1zb25pIiwiZXhwIjoxOTUyMDI0MTU5LCJ1c2VySWQiOiI0MDAwOTY1MCIsImlhdCI6MTU1MjAyMzU1OSwiZW1haWwiOiJtc29uaUB0b3Bjb2Rlci5jb20iLCJqdGkiOiJkZTNjOTE1Yy1hZDNlLTRkYWEtOWFhMy1lMzY4NWFiYzIyYTEifQ.ZqAzXmEa03lJOIpIGcM1qNhn4SRHCcdWDg_FpdeqZ8Q'

const observer = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'msoni',
  'exp': 1952024159,
  'userId': '40009650',
  'iat': 1552023559,
  'email': 'msoni@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const managerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InJpdGVzaF9jcyIsImV4cCI6MTk1MjAyNDE1OSwidXNlcklkIjoiMjMyNzQxMTgiLCJpYXQiOjE1NTIwMjM1NTksImVtYWlsIjoicml0ZXNoX2NzQHRvcGNvZGVyLmNvbSIsImp0aSI6ImRlM2M5MTVjLWFkM2UtNGRhYS05YWEzLWUzNjg1YWJjMjJhMSJ9.TKlm_quMvsyASaibYbFGnjJVwu7EqS-C3c-9Tk8wgp4'

const manager = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'ritesh_cs',
  'exp': 1952024159,
  'userId': '23274118',
  'iat': 1552023559,
  'email': 'ritesh_cs@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const reviewerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6InB2bWFnYWNobyIsImV4cCI6MTk1MjAyNDE1OSwidXNlcklkIjoiMjI3MTMzMzciLCJpYXQiOjE1NTIwMjM1NTksImVtYWlsIjoicHZtYWdhY2hvQHRvcGNvZGVyLmNvbSIsImp0aSI6ImRlM2M5MTVjLWFkM2UtNGRhYS05YWEzLWUzNjg1YWJjMjJhMSJ9.jeW2PODse9NEF031H-F5YaTnsookzTIl0utPAqN-Of4'

const reviewer = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'pvmagacho',
  'exp': 1952024159,
  'userId': '22713337',
  'iat': 1552023559,
  'email': 'pvmagacho@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const copilotToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6Ikdob3N0YXIiLCJleHAiOjE5NTIwMjQxNTksInVzZXJJZCI6IjE1MTc0MyIsImlhdCI6MTU1MjAyMzU1OSwiZW1haWwiOiJHaG9zdGFyQHRvcGNvZGVyLmNvbSIsImp0aSI6ImRlM2M5MTVjLWFkM2UtNGRhYS05YWEzLWUzNjg1YWJjMjJhMSJ9.Ya1B-0eQQ3QNpf5Qk09HLY_SKR3kDFb9rv8hfIgRPZs'

const copilot = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'Ghostar',
  'exp': 1952024159,
  'userId': '151743',
  'iat': 1552023559,
  'email': 'Ghostar@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const clientManagerToken = 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJyb2xlcyI6WyJUb3Bjb2RlciBVc2VyIl0sImlzcyI6Imh0dHBzOi8vYXBpLnRvcGNvZGVyLmNvbSIsImhhbmRsZSI6Im1lc3MiLCJleHAiOjE5NTIwMjQxNTksInVzZXJJZCI6Ijg1NDc4NDUiLCJpYXQiOjE1NTIwMjM1NTksImVtYWlsIjoibWVzc0B0b3Bjb2Rlci5jb20iLCJqdGkiOiJkZTNjOTE1Yy1hZDNlLTRkYWEtOWFhMy1lMzY4NWFiYzIyYTEifQ.6G5RDQn-LvlK_FSOG4DEo0Z3U7tt0xe4Lw_d4dzkJlQ'

const clientManager = {
  'roles': [
    'Topcoder User'
  ],
  'iss': 'https://api.topcoder.com',
  'handle': 'mess',
  'exp': 1952024159,
  'userId': '8547845',
  'iat': 1552023559,
  'email': 'mess@topcoder.com',
  'jti': 'de3c915c-ad3e-4daa-9aa3-e3685abc22a1'
}

const artifactsResponse = {
  'artifacts': [
    'ab3c915c-ad3e-4daa-9aa3-e3685abc22c3',
    'ab3c915c-ad3e-4daa-9aa3-e3685abc22b4',
    '5rec915c-ad3e-4daa-9far-e38u5abc22b4-internal'
  ]
}

module.exports = {
  invalidChallengeId,
  invalidChallengeIdSubmission,
  noResourceChallengeId,
  noResourceChallengeIdSubmission,
  noSubmissionChallengeId,
  submissionPhaseChallengeId,
  reviewPhaseChallengeId,
  appealsPhaseChallengeId,
  completedChallengeId,
  f2fChallengeId,
  resourcesResponse,
  submissionPhaseChallengeResponse,
  reviewPhaseChallengeResponse,
  appealsPhaseChallengeResponse,
  completedChallengeResponse,
  f2fChallengeResponse,
  subPhaseSubmissions,
  reviewPhaseSubmissions,
  appealsPhaseSubmissions,
  completedChallengeSubmissions,
  f2fSubmissions,
  reviewTypes,
  adminToken,
  admin,
  submitter1Token,
  submitter1,
  submitter2Token,
  submitter2,
  submitter3Token,
  submitter3,
  nonSubmitterToken,
  nonSubmitter,
  observerToken,
  observer,
  managerToken,
  manager,
  reviewerToken,
  reviewer,
  copilotToken,
  copilot,
  clientManagerToken,
  clientManager,
  artifactsResponse
}
