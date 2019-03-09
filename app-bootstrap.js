/**
 * App bootstrap
 */
global.Promise = require('bluebird')
const Joi = require('joi')

Joi.id = () => Joi.alternatives().try(Joi.number().integer().min(1), Joi.string()).required()
