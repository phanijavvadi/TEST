'use strict';
import * as Joi from 'joi';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import commonUtil from "../util/common.util";
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
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
      problem_mid:Joi.string().required(),
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
};
export default validators;
