'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

import errorMessages from '../../config/error.messages';
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

import * as patientService from '../services/patient.service';

const validators = {
  importPatientsReqValidator: (req, resp, next) => {
    const body = req.body;
    const patientSchema = Joi.object().keys({
      INTERNALID: Joi.number().required(),
      FIRSTNAME: Joi.any().allow('', null),
      SURNAME: Joi.any().allow('', null),
      MIDDLENAME: Joi.any().allow('', null),
      DATEOFDEATH: Joi.any().allow('', null),
      SEXCODE: Joi.any().allow('', null),
      ADDRESS1: Joi.any().allow('', null),
      ADDRESS2: Joi.any().allow('', null),
      CITY: Joi.any().allow('', null),
      POSTCODE: Joi.any().allow('', null),
      POSTALADDRESS: Joi.any().allow('', null),
      POSTALCITY: Joi.any().allow('', null),
      POSTALPOSTCODE: Joi.any().allow('', null),
      HOMEPHONE: Joi.any().allow('', null),
      MOBILEPHONE: Joi.any().allow('', null),
    });
    let schema = {
      patients: Joi.array().unique((a, b) => a.INTERNALID === b.INTERNALID).items(patientSchema).min(1).required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  importPatientMedicalHistoryReqValidator: (req, resp, next) => {
    const body = req.body;
    const medicalHistorySchema = Joi.object().keys({
      InternalID: Joi.number().required(),
      Day: Joi.any().allow('', null),
      Month: Joi.any().allow('', null),
      Year: Joi.any().allow('', null),
      Condition: Joi.any().allow('', null),
      ConditionID: Joi.any().allow('', null),
      Status: Joi.any().allow('', null),
      Side: Joi.any().allow('', null),
      Severity: Joi.any().allow('', null),
      Acute: Joi.any().allow('', null),
      Summary: Joi.any().allow('', null),
      Fracture: Joi.any().allow('', null),
      Displaced: Joi.any().allow('', null),
      Compound: Joi.any().allow('', null),
      Comminuted: Joi.any().allow('', null),
      Spiral: Joi.any().allow('', null),
      Greenstick: Joi.any().allow('', null),
      Details: Joi.any().allow('', null),
  });
    let schema = {
      medicalHistory: Joi.array().items(medicalHistorySchema).min(1).required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  sendInvitationMessageValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      patientId: Joi.string().required(),
      mobileNo: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  signUpValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      email: Joi.string().required(),
      password: Joi.string().required(),
      patientNumber: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  signInValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      email: Joi.string().required(),
      password: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  patientEmailUniqueValidation: (req, resp, next) => {
    const {email} = req.body;
    let where = {email};
    if (req.body && req.body.id) {
      where.id = {
        [Op.ne]: req.body.id
      }
    }
    const options = {
      where,
      attributes: ['id', 'email']
    };
    patientService.findOne(options)
      .then((data) => {
        if (data) {
          throw new Error('PATIENT_EMAIL_EXISTS');
        } else {
          next();
          return null;
        }
      })
      .catch((err) => {
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  },
  validatePatientNumberIsRegistered: (req, resp, next) => {
    const {patientNumber} = req.body;
    let where = {patientNumber};
    const options = {
      where,
      attributes: ['id', 'email', 'firstName','surName','middleName','registered', 'status', 'patientNumber','orgId']
    };
    patientService.findOne(options)
      .then((data) => {
        if (!data) {
          throw new Error('INVALID_PATIENT_NUMBER');
        } else {
          if (data.registered === 1) {
            throw new Error('ALREADY_REGISTERED_WITH_PATIENT_NUMBER');
          } else {
            req.locals.patient = data.get({plain: true});
            next();
            return null;
          }
        }
      })
      .catch((err) => {
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  }
}
export default validators;
