'use strict';
import * as Joi from 'joi';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const validators = {

  registerDeviceReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patient_id: Joi.string().required(),
      registration_id: Joi.string().required(),
      uuid: Joi.string().allow(['', null]),
      model: Joi.string().allow(['', null]),
      platform: Joi.string().allow(['', null]),
      version: Joi.string().allow(['', null]),
      manufacturer: Joi.string().allow(['', null]),
      serial: Joi.string().allow(['', null]),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
  inAppMessageReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patient_id: Joi.string().required(),
      message: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
  getMessagesReqValidator: (req, resp, next) => {
    const body = req.query;
    let schema = {
      orgId: Joi.string().required(),
      patient_id: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
};
export default validators;
