'use strict';
import * as Joi from 'joi';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import * as problemMasterService from '../services/problem.master.service';
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  createProblemMasterReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      name: Joi.string().required(),
      description: Joi.string().required(),
      status: Joi.number().required()
    };

    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      schemaObj.orgId = Joi.string().required();
    }
    const schema = Joi.object().keys(schemaObj);
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  createProblemMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      problem_mid: Joi.string().required(),
      name: Joi.string().required(),
      type: Joi.string().required(),
      goal: Joi.string().required(),
      management: Joi.string().required(),
      frequency: Joi.string().required(),
      status: Joi.number().required()
    };
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      // schemaObj.orgId = Joi.string().required();
    }
    let schema = Joi.object().keys(schemaObj);
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  createProblemMetricTargetReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      metric_mid: Joi.string().required(),
      operator: Joi.string().required(),
      defVal: Joi.string().required(),
      uom: Joi.string().required().allow([null]),
      status: Joi.number().required()
    };
    let schema = Joi.object().keys(schemaObj);
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  createProblemMetricActionPlanReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      metric_mid: Joi.string().required(),
      title: Joi.string().required(),
      status: Joi.number().required()
    };
    let schema = Joi.object().keys(schemaObj);
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  createProblemMetricActionPlanInputReqValidator: (req, resp, next) => {
    const body = req.body;
    const input_options_master_schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const schemaObj = {
      act_plan_mid: Joi.string().required(),
      id: Joi.string(),
      label: Joi.string().allow([null]),
      defVal: Joi.string().allow([null]),
      input_type_mid: Joi.string().required(),
      input_options_master: Joi.array().items(input_options_master_schema),
      status: Joi.number().required()
    };
    let schema = Joi.object().keys(schemaObj);
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  savePoblemsMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const problems_schema = Joi.object().keys({
      name: Joi.string().required(),
      description: Joi.string().required(),
    });
    let schema = {
      problems: Joi.array().items(problems_schema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  saveMetricsMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const master_targets_schema = Joi.object().keys({
      operator: Joi.string().required(),
      defVal: Joi.string().allow(['', null]),
      status: Joi.number().required(),
      uom: Joi.string().allow(['', null]),
    });

    const input_options_master_schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    const inputs_master_schema = Joi.object().keys({
      label: Joi.string().allow(['', null]),
      defVal: Joi.string().allow(['', null]),
      input_type_mid: Joi.string().allow(['', null]),
      input_options_master: Joi.array().items(input_options_master_schema)
    });
    const master_act_plans_schema = Joi.object().keys({
      title: Joi.string().required(),
      inputs_master: Joi.array().items(inputs_master_schema).min(1).required(),
    });
    let metric_schema = {
      name: Joi.string().required(),
      goal: Joi.string().required(),
      type: Joi.string().required(),
      management: Joi.string().required(),
      frequency: Joi.string().required(),
      status: Joi.number().required(),
      master_targets: Joi.array().items(master_targets_schema),
      master_act_plans: Joi.array().items(master_act_plans_schema)
    };
    let schema = {
      problem_mid: Joi.string().required(),
      metrics: Joi.array().items(metric_schema).min(1).unique((a, b) => a.type === b.type).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  isValidProblemMetric: (options, req, resp, next) => {
    problemMetricsMasterService.findOne(options)
      .then(data => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_INPUT')
        }
      }).catch(err => {
      commonUtil.handleException(err, req, resp);
    })
  },
  isValidProblemId: (options, req, resp, next) => {
    problemMasterService.findOne(options)
      .then(data => {
        if (data) {
          next();
          return null;
        } else {
          throw new Error('INVALID_INPUT')
        }
      })
      .catch(err => {
        commonUtil.handleException(err, req, resp);
      })
  },
};
export default validators;
