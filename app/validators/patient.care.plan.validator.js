'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import commonUtil from "../util/common.util";
import errorMessages from '../util/constants/error.messages';
import * as patientCarePlanService from '../services/patient.care.plan.service';
import * as patientCarePlanProblemService from '../services/patient.care.plan.problems.service';
import * as attachmentValidator from './attachment.validator';
import constants from '../util/constants/constants';
import _ from 'lodash';

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
      validators.checkCarePlanExist(body.patientId, req, resp, next);
    }
  },
  publishReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      patientId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  checkCarePlanExist: (patientId, req, resp, next) => {
    patientCarePlanService.findOne({where: {patientId, status: [1, 3]}})
      .then((data) => {
        if (data) {
          throw new Error('CARE_PLAN_EXIST');
        } else {
          next();
          return null;
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidCarePlanId: (carePlanId, req, resp, next) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        id: carePlanId,
        status: 1
      },
      attributes: ['id']
    };

    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
      options.where['patientId'] = tokenDecoded.id;
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }

    patientCarePlanService.findOne(options)
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_INPUT');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidCarePlanProblemId: (cp_prob_id, req, resp, next) => {
    patientCarePlanProblemService.findOne({where: {id: cp_prob_id}, attributes: ['id']})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_CARE_PLAN_PROBLEM_ID');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addCarePlanProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      careProblems: Joi.array().items(subSchema).min(1).required(),
      patientId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  removeCarePlanProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
      problemId: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      patientId: Joi.string().required(),
      careProblems: Joi.array().items(subSchema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  addProblemMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      carePlanId: Joi.string().required(),
      patientId: Joi.string().required(),
      metric_mid: Joi.string().required(),
      cp_prob_id: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  saveMetricTargetReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      carePlanId: Joi.string().required(),
      id: Joi.string().required(),
      response: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  saveMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      carePlanId: Joi.string().required(),
      id: Joi.string().required(),
      management: Joi.string().required(),
      frequency: Joi.string().allow([null,'']),
      goal: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  },
  saveActionPlanInputReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      carePlanId: Joi.string().required(),
      id: Joi.string().required(),
      response: Joi.string().allow([null,''])
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidCarePlanId(body.carePlanId, req, resp, next);
    }
  }
};
export default validators;
