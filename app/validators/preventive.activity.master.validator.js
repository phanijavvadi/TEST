'use strict';
import * as Joi from 'joi';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

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
  createOrUpdatePreventiveCategoryMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      name: Joi.string().required(),
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
  savePreventiveActsMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    let age_group_schema = {
      from: Joi.number().required().allow([null]),
      to: Joi.number().required().allow([null]),
    };

    const preventive_metrics_master_schema = Joi.object().keys({
      name: Joi.string().required(),
      notes: Joi.string().allow(['', null]),
      frequency_master_key: Joi.string().required(),
    });

    let act_schema = {
      name: Joi.string().required(),
      gender: Joi.number().required().allow([null]),
      notes: Joi.string().allow(['', null]),
      age_groups: Joi.array().items(age_group_schema).min(0).required(),
      preventive_metrics_master: Joi.array().items(preventive_metrics_master_schema)
        .unique((a, b) => {
          return a.name === b.name
        }),
    };
    let acts_schema = {
      preventive_act_cat_mid: Joi.string().required(),
      acts: Joi.array().items(act_schema).min(1).unique((a, b) => a.name === b.name).required(),
    };
    let schema = {
      data: Joi.array().items(acts_schema).min(1).unique((a, b) => a.preventive_act_cat_mid === b.preventive_act_cat_mid).required(),
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

      metrics: Joi.array().items(preventive_metrics_master_schema).unique((a, b) => {
        return a.preventive_act_mid === b.preventive_act_mid && a.name === b.name
      }),
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
