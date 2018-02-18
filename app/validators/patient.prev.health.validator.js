'use strict';
import * as Joi from 'joi';
import commonUtil from "../util/common.util";
import errorMessages from '../util/constants/error.messages';
import * as patientPrevHealthService from '../services/patient.prev.health.service';
import * as patientPrevHealthProblemService from '../services/patient.prev.health.problems.service';
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
      validators.checkPrevHealthExist(body.patientId, req, resp, next);
    }
  },
  checkPrevHealthExist: (patientId, req, resp, next) => {
    patientPrevHealthService.findOne({where: {patientId, status: 1}})
      .then((data) => {
        if (data) {
          throw new Error('PREV_HEALTH_RECORD_EXIST');
        } else {
          next();
          return null;
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidPrevHealthId: (id, req, resp, next) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        id: id,
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

    patientPrevHealthService.findOne(options)
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  isValidPrevHealthProblemId: (prevHealthProblemId, req, resp, next) => {
    patientPrevHealthProblemService.findOne({where: {id: prevHealthProblemId}, attributes: ['id']})
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('PREV_HEALTH_RECORD_EXIST');
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addPrevHealthProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      prevHealthId: Joi.string().required(),
      careProblems: Joi.array().items(subSchema).min(1).required(),
      patientId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPrevHealthId(body.prevHealthId, req, resp, next);
    }
  },
  removePrevHealthProblemReqValidator: (req, resp, next) => {
    const body = req.body;
    const subSchema = Joi.object().keys({
      id: Joi.string().required(),
      careProblemId: Joi.string().required(),
    });
    let schema = {
      orgId: Joi.string().required(),
      prevHealthId: Joi.string().required(),
      patientId: Joi.string().required(),
      careProblems: Joi.array().items(subSchema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      validators.isValidPrevHealthId(body.prevHealthId, req, resp, next);
    }
  }
};
export default validators;
