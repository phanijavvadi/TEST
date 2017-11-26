'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import errorMessages from '../../config/error.messages';
import * as orgService from '../services/organisation.service';
import * as orgUserService from '../services/user.service';
import * as attachmentService from '../services/attachment.service';

const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      contPerFname: Joi.string().min(3).required(),
      contPerLname: Joi.string().min(1).required(),
      contPerEmail: Joi.string().email().required(),
      orgName: Joi.string().min(3).required(),
      contPerAHPRANo: Joi.string().allow(null),
      orgAdd1: Joi.string().min(3).required(),
      orgAdd2: Joi.string().min(3),
      phoneNo: Joi.string().required(),
      fax: Joi.string().allow(null),
      orgUserTypeId: Joi.string().required(),
      orgLogo: Joi.string().allow(null)
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateOrgLogo: (req, resp, next) => {
    const body = req.body;
    if (!body.orgLogo) {
      next();
    } else {
      attachmentService.findById(body.orgLogo)
        .then((data) => {
          if (data) {
            next();
            return null;
          } else {
            return resp.status(403).send({success: false, message: errorMessages.INVALID_ATTACHMENT_ID});
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
  },
  validateEmailUniqueValidation: (req, resp, next) => {
    const {contPerEmail} = req.body;
    let whereOptions = {contPerEmail};
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
      contPerFname: Joi.string().min(3).required(),
      contPerLname: Joi.string().min(1).required(),
      orgName: Joi.string().min(3).required(),
      contPerAHPRANo: Joi.string().allow(null),
      orgAdd1: Joi.string().min(3).required(),
      orgAdd2: Joi.string().min(3),
      phoneNo: Joi.string().required(),
      fax: Joi.string().allow(null),
      orgUserTypeId: Joi.string().required(),
      orgLogo: Joi.string().allow(null)
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  orgActivateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      // check atleast one active AHPRARegNo User exists
      const {id} = req.body;
      let whereOptions = {orgId: id, status: 1};
      orgUserService.findOne(whereOptions)
        .then((data) => {
          if (data) {
            next();
            return null;
          } else {
            resp.status(403).send({success: false, message: errorMessages.ORG_ACTIVE_AHPRANO_REQUIRED_TO_ACTIVATE});
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
  },
  orgInActivateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required()
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
          req.locals = req.locals || {};
          req.locals.organization = data.get({plain: true});
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
