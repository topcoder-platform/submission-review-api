/**
 * The configuration file.
 */

module.exports = {
  LOG_LEVEL: process.env.LOG_LEVEL || 'debug',
  PORT: process.env.PORT || 3000,
  AUTH_SECRET: process.env.AUTH_SECRET || 'mysecret',
  SUBMISSION_TYPE: process.env.SUBMISSION_TYPE || 'Contest Submission',
  VALID_ISSUERS: process.env.VALID_ISSUERS ? process.env.VALID_ISSUERS.replace(/\\"/g, '') : '["https://api.topcoder-dev.com", "https://api.topcoder.com", "https://topcoder-dev.auth0.com/"]',
  CHALLENGE_API_URL: process.env.CHALLENGE_API_URL || 'https://api.topcoder-dev.com/v5/challenges',
  SUBMISSION_API_URL: process.env.SUBMISSION_API_URL || 'https://api.topcoder-dev.com/v5/submissions',
  REVIEW_SUMMATIONS_API_URL: process.env.REVIEW_SUMMATIONS_API_URL || 'https://api.topcoder-dev.com/v5/reviewSummations',
  REVIEW_TYPE_API_URL: process.env.REVIEW_TYPE_API_URL || 'https://api.topcoder-dev.com/v5/reviewTypes',
  RESOURCES_API_URL: process.env.RESOURCES_API_URL || 'https://api.topcoder-dev.com/v5/resources',
  RESOURCE_ROLES_API_URL: process.env.RESOURCE_ROLES_API_URL || 'https://api.topcoder-dev.com/v5/resource-roles',
  F2F_TYPE_ID: process.env.F2F_TYPE_ID || 'dc876fa4-ef2d-4eee-b701-b555fcc6544c',
  MM_TRACK_ID: process.env.MM_TRACK_ID || 'c0f5d461-8219-4c14-878a-c3a3f356466d',
  M2M: {
    AUTH0_URL: process.env.AUTH0_URL || 'https://topcoder-dev.auth0.com/oauth/token',
    AUTH0_AUDIENCE: process.env.AUTH0_AUDIENCE || 'https://m2m.topcoder-dev.com/',
    TOKEN_CACHE_TIME: process.env.TOKEN_CACHE_TIME || 90,
    AUTH0_CLIENT_ID: process.env.AUTH0_CLIENT_ID || 'enjw1810eDz3XTwSO2Rn2Y9cQTrspn3B',
    AUTH0_CLIENT_SECRET: process.env.AUTH0_CLIENT_SECRET || '6wzC0_gfeuM4yEWOoobl5BylXsI44lczJjGTBABM2EJpbg9zucUwTGlgO7WWbHdt'
  }
}
