'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  importReqValidator: (req, resp, next) => {
    const body = req.body;
    const patientSchema = joi.object().keys({
      INTERNALID: Joi.string().required(),
      FIRSTNAME: body.FIRSTNAME.allow('', null),
      SURNAME: body.SURNAME.allow('', null),
      MIDDLENAME: body.MIDDLENAME.allow('', null),
      DATEOFDEATH: body.DATEOFDEATH.allow('', null),
      SEXCODE: body.SEXCODE.allow('', null),
      ADDRESS1: body.ADDRESS1.allow('', null),
      ADDRESS2: body.ADDRESS2.allow('', null),
      CITY: body.CITY.allow('', null),
      POSTCODE: body.POSTCODE.allow('', null),
      POSTALADDRESS: body.POSTALADDRESS.allow('', null),
      POSTALCITY: body.POSTALCITY.allow('', null),
      POSTALPOSTCODE: body.POSTALPOSTCODE.allow('', null),
      HOMEPHONE: body.HOMEPHONE.allow('', null),
      MOBILEPHONE: body.MOBILEPHONE.allow('', null),
    });
    let schema = {
      orgId: Joi.string().required(),
      patients: joi.array().unique((a, b) => a.INTERNALID === b.INTERNALID).items(patientSchema).min(1)
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  }
}
export default validators;
