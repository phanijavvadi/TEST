'use strict';
import * as Joi from 'joi';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import commonUtil from "../util/common.util";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  savePreventiveCategoryMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const category_schema = Joi.object().keys({
      name: Joi.string().required(),
    });
    let schema = {
      categories: Joi.array().items(category_schema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  savePreventiveActsMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    let act_schema = {
      name: Joi.string().required(),
      notes: Joi.string().allow(['', null]),
    };
    let schema = {
      preventive_act_cat_mid: Joi.string().required(),
      acts: Joi.array().items(act_schema).min(1).unique((a, b) => a.name === b.name).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  savePreventiveMetricsMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const preventive_metrics_master_schema = Joi.object().keys({
      name: Joi.string().required(),
      notes: Joi.string().allow(['', null]),
      frequency_master_key: Joi.string().required(),
      preventive_act_mid: Joi.string().required(),
    });
    let schema = {

      metrics: Joi.array().items(preventive_metrics_master_schema).unique((a, b) =>{ return a.preventive_act_mid===b.preventive_act_mid && a.name === b.name}),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },

};
export default validators;