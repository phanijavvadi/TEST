'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import commonUtil from "../util/common.util";
import errorMessages from '../util/constants/error.messages';
import constants from '../util/constants/constants';
import _ from 'lodash';
// import * as Extension from 'joi-date-extensions';

// const extJoi = Joi.extend(Extension);
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import models from '../models';

const patientPreventiveHealthModel = models.PatientPreventiveHealth;

const patientPreventiveActivitiesModel = models.PatientPreventiveActivities;
const patientPrevetiveActivityMetricModel = models.PatientPrevetiveActivityMetric;
const validators = {

  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patient_id: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.checkPhExist({
        where: {
          patient_id: body.patient_id,
          status: [1]
        }
      }, req, resp, next);
    }
  },
  saveHealthCheckDataValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      hc_id: Joi.string().required(),
      due_date: Joi.date().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  updateHealthCheckDataValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      checkup_date: Joi.date().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  checkPhExist: (options, req, resp, next) => {
    patientPreventiveHealthModel.findOne({where: options.where})
      .then((data) => {
        if (data) {
          throw new Error('PH_EXIST');
        } else {
          next();
          return null;
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidPhId: (options = {}, req, resp, next) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    options = {
      where: options.where || {},
      attributes: ['id']
    };

    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
      options.where['patient_id'] = tokenDecoded.id;
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }

    patientPreventiveHealthModel.findOne(options)
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
  isValidPhActId: (ph_act_id, req, resp, next) => {
    patientPreventiveActivitiesModel.findOne({where: {id: ph_act_id}, attributes: ['id']})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_PH_ACT_ID');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addPhActReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      ph_id: Joi.string().required(),
      acts_master: Joi.array().items(subSchema).min(1).unique((a, b) => a.id === b.id).required(),
      patient_id: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPhId({where: {id: body.ph_id, status: [1]}}, req, resp, next);
    }
  },

  removePhActReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      ph_id: Joi.string().required(),
      patient_id: Joi.string().required(),
      ph_acts: Joi.array().items(subSchema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPhId({where: {id: body.ph_id, status: [1]}}, req, resp, next);
    }
  },
  addPhActMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      ph_id: Joi.string().required(),
      patient_id: Joi.string().required(),
      preventive_metric_mid: Joi.string().required(),
      ph_act_id: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPhId({where: {id: body.ph_id, status: [1]}}, req, resp, next);
    }
  },
  removePhActMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      ph_id: Joi.string().required(),
      patient_id: Joi.string().required(),
      preventive_metric_id: Joi.string().required(),
      ph_act_id: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPhId({where: {id: body.ph_id, status: [1]}}, req, resp, next);
    }
  },
  saveMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      ph_id: Joi.string().required(),
      id: Joi.string().required(),
      notes: Joi.string().required().allow([null, '']),
      frequency: Joi.string().allow([null, '']),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPhId({where: {id: body.ph_id, status: [1]}}, req, resp, next);
    }
  },
};
export default validators;
