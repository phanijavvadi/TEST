'use strict';
import * as Joi from 'joi';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {

  getCareTeamListReqValidator: (req, resp, next) => {
    const body = req.query;
    let schema = {
      provider_id: Joi.string().required(),
      orgId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string(),
      comments: Joi.string(),
      provider_id: Joi.string().required(),
      orgId: Joi.string().required(),
      patient_id: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  },
  removeReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      orgId: Joi.string().required(),
      patient_id: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
      return null;
    }
  }
};
export default validators;
