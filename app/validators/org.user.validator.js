'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import errorMessages from '../../config/error.messages';
import * as orgUserService from '../services/org.user.service';

const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      phoneNumber: Joi.string().required(),
      orgUserTypeId: Joi.string().required(),
      AHPRANumber: Joi.string(),
      isAdmin: Joi.boolean().required(),
      orgId: Joi.string().required(),
      status: Joi.number().valid([1, 2]).label('Status'),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  emailUniqueValidation: (req, resp, next) => {
    const {email} = req.body;
    let whereOptions = {email};
    if (req.body && req.body.id) {
      whereOptions.id = {
        [Op.ne]: req.body.id
      }
    }
    orgUserService.findOne(whereOptions)
      .then((data) => {
        if (data) {
          resp.status(403).send({success: false, message: errorMessages.ORG_USER_EMAIL_EXISTS});
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
      phoneNumber: Joi.string().required(),
      orgUserTypeId: Joi.string().required(),
      orgId: Joi.string().required(),
      AHPRANumber: Joi.string(),
      isAdmin: Joi.boolean().required(),
      status: Joi.number().valid([1, 2]).label('Status'),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  changePasswordReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      orgUserTypeId: Joi.string().required(),
      orgId: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
          any: {
            allowOnly: '!!Passwords do not match',
          }
        }
      })
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  verifyRegNoReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      orgUserTypeId: Joi.string().required(),
      orgId: Joi.string().required(),
      isRegNoVerified: Joi.boolean().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },

}
export default validators;
