'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      name: Joi.string().min(3).required(),
      desc: Joi.string().required(),
      validity: Joi.number().required(),
      price: Joi.number().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
       next();
    }
  },
   updateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      name: Joi.string().min(3).required(),
      desc: Joi.string().required(),
      validity: Joi.number().required(),
      price: Joi.number().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  }
}
export default validators;
