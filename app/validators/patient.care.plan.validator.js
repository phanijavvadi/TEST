'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import commonUtil from "../util/common.util";
import errorMessages from '../../config/error.messages';
import * as patientCarePlanService from '../services/patient.care.plan.service';
import * as patientCarePlanProblemService from '../services/patient.care.plan.problems.service';
import * as attachmentValidator from './attachment.validator';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {

  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patientId: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      this.checkCarePlanExist(body.patientId, req, resp, next);
    }
  },
  checkCarePlanExist: (patientId, req, resp, next) => {
    patientCarePlanService.findOne({patientId})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('CARE_PLAN_EXIST');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidCarePlanId: (carePlanId, req, resp, next) => {
    patientCarePlanService.findOne({where: {id: carePlanId}, attributes: ['id']})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('CARE_PLAN_EXIST');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidCarePlanProblemId: (carePlanProblemId, req, resp, next) => {
    patientCarePlanProblemService.findOne({where: {id: carePlanProblemId}, attributes: ['id']})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('CARE_PLAN_EXIST');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addCarePlanProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      careProblemId: Joi.string().required(),
      patientId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      this.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  removeCarePlanProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      carePlanProblemId: Joi.string().required(),
      careProblemId: Joi.string().required(),
      patientId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      this.isValidCarePlanProblemId(body.carePlanProblemId, req, resp, next);
    }
  }
};
export default validators;
