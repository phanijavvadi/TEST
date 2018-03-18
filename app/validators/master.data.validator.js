'use strict';
import * as Joi from 'joi';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import commonUtil from "../util/common.util";
import constants from "../util/constants/constants";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  importMasterDataReqValidator: (req, resp, next) => {
    const body = req.body;
    const category_schema = Joi.object().keys({
      key: Joi.string().required(),
      name: Joi.string().required(),
      value: Joi.string().required(),
      order: Joi.number().integer().min(0),

    });
    let schema = {
      data: Joi.array().items(category_schema).min(1).required(),
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  addHealthCheckReqValidator: (req, resp, next) => {
    const body = req.body;
    const schemaObj = {
      id: Joi.string(),
      name: Joi.string().required(),
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
  }

};
export default validators;
