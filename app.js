/**
 * The application entry point
 */

require('./app-bootstrap')

const config = require('config')
const express = require('express')
const bodyParser = require('body-parser')
const _ = require('lodash')
const cors = require('cors')
const logger = require('./src/common/logger')
const HttpStatus = require('http-status-codes')
const healthCheck = require('topcoder-healthcheck-dropin')

// setup express app
const app = express()

function check () {
  // Return 200 OK for health check
  return true
}

app.use(cors())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(healthCheck.middleware([check]))
app.set('port', config.PORT)

// Register routes
require('./app-routes')(app)

// The error handler
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  logger.logFullError(err, req.signature || `${req.method} ${req.url}`)
  logger.info('Error handler')
  const errorResponse = {}
  const status = err.isJoi ? HttpStatus.BAD_REQUEST : (err.status || err.httpStatus || HttpStatus.INTERNAL_SERVER_ERROR)
  if (_.isArray(err.details)) {
    if (err.isJoi) {
      _.map(err.details, (e) => {
        if (e.message) {
          if (_.isUndefined(errorResponse.message)) {
            errorResponse.message = e.message
          } else {
            errorResponse.message += `, ${e.message}`
          }
        }
      })
    }
  }
  if (_.isUndefined(errorResponse.message)) {
    if (err.message && status !== HttpStatus.INTERNAL_SERVER_ERROR) {
      errorResponse.message = err.message
    } else {
      errorResponse.message = 'Internal server error'
    }
  }

  res.status(status).json(errorResponse)
})

app.listen(app.get('port'), () => {
  logger.info(`Express server listening on port ${app.get('port')}`)
})

module.exports = app
