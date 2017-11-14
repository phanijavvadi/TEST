'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import errorMessages from '../../config/error.messages';
import * as orgService from '../services/organization.service';

const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      organizationName: Joi.string().min(3).required(),
      organizationAddress: Joi.string().min(3).required(),
      phoneNumber: Joi.string().required(),
      fax: Joi.string(),
      orgUserRoleId: Joi.string().required(),
      AHPRANumber: Joi.string(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateEmailUniqueValidation: (req, resp, next) => {
    const {email} = req.body;
    let whereOptions = {email};
    if (req.body && req.body.id) {
      whereOptions.id = {
        [Op.ne]: req.body.id
      }
    }
    orgService.findOne(whereOptions)
      .then((data) => {
        if (data) {
          resp.status(403).send({success: false, message: errorMessages.ORG_EMAIL_EXISTS});
        } else {
          next();
          return null;
        }
      })
      .catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  updateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      organizationName: Joi.string().min(3).required(),
      organizationAddress: Joi.string().min(3).required(),
      phoneNumber: Joi.string().required(),
      fax: Joi.string(),
      orgUserRoleId: Joi.string().required(),
      AHPRANumber: Joi.string(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateOrgId: (req, resp, next) => {
    const {orgId} = req.body;
    orgService.findById(orgId)
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
        }
      })
      .catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  }

}
export default validators;
