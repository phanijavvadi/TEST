'use strict';
import * as Joi from 'joi';
import _ from 'lodash';
import constants from "../util/constants/constants";
import errorMessages from "../util/constants/error.messages";

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {

  saveClinicalMetricReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patient_id: Joi.string().required(),
      measurement: Joi.string().required(),
      metric_type: Joi.string().required(),

    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      return resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    }
    const {authenticatedUser, tokenDecoded} = req.locals;
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT && tokenDecoded.id !== body.patient_id) {
      return resp.status(403).send({success: false, message: errorMessages.INVALID_INPUT});
    } else if (authenticatedUser && authenticatedUser.userCategory && authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    next();
  },
};
export default validators;
