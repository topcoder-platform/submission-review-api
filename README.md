# Topcoder Submission Review APP API

## Prerequisites

- NodeJS (v8+)

## Configuration

Configuration for the application is at `config/default.js`.
The following parameters can be set in config files or in env variables:

- LOG_LEVEL: the log level, default is 'debug', in production default is 'info'
- PORT: the server port, default is 3000
- AUTH_SECRET: The authorization secret used during token verification.
- VALID_ISSUERS: The valid issuer of tokens.
- CHALLENGE_API_URL: Challenge api url, default is 'https://api.topcoder-dev.com/v4/challenges'
- SUBMISSION_API_URL: Submission api url, default is 'https://api.topcoder-dev.com/v5/submissions'
- REVIEW_SUMMATIONS_API_URL: Review summation api url, default is 'http://api.topcoder-dev.com/v5/reviewSummations'
- REVIEW_TYPE_API_URL: Review type api url, default is 'http://api.topcoder-dev.com/v5/reviewTypes'
- AUTH0_URL: The M2M auth URL
- AUTH0_AUDIENCE: The M2M audience
- TOKEN_CACHE_TIME: The M2M token cache time
- AUTH0_CLIENT_ID: The M2M client ID
- AUTH0_CLIENT_SECRET: The M2M client secret
- MM_REVIEW_TYPES: MM review type names, used to filter valid MM reviews


## Local Deployment

- Install dependencies `npm install`
- Run lint `npm run lint`
- Run lint fix `npm run lint:fix`
- Start app `npm start`
- App is running at `http://localhost:3000`


## Running tests

All external API calls are mocked in Unit tests and E2E tests. Hence tests can be run without any dependency.

Logging level for tests can be controlled at `config/test.js`

#### Running unit tests

To run unit tests alone

```
npm run test
```

To run unit tests with coverage report

```
npm run test:cov
```

#### Running integration tests

To run integration tests alone

```
npm run e2e
```

To run integration tests with coverage report

```
npm run e2e:cov
```

## Notes
- Currently, Submission v5 api and Review v5 api doesn't support OR data. In another word, we can't retrieve such review data of Challenges(Code, F2F and etc.) using OR to perform review. It has been approved that these issues will be left into next challenge in the forum.
- This API accepts TC v3 JWT for authorization, `tc-core-library-js` node modules contains a middleware jwtAuthenticator which provide authorization business logic.
Here is one of the example payload for v3 JWT using in DEV
```
{
  "roles": [
    "Topcoder User",
    "Connect Support",
    "administrator",
    "testRole",
    "aaa",
    "tony_test_1",
    "Connect Manager",
    "Connect Admin",
    "copilot",
    "Connect Copilot Manager"
  ],
  "iss": "https://api.topcoder-dev.com",
  "handle": "TonyJ",
  "exp": 1551792211,
  "userId": "8547899",
  "iat": 1549791611,
  "email": "tjefts+fix@topcoder.com",
  "jti": "f94d1e26-3d0e-46ca-8115-8754544a08f1"
}
```
- All JWT tokens provided in Postman environment file is created in JWT.IO with secret `mysecret`, same as default AUTH_SECRET value in `config/default.js` file.
