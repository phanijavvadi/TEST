'use strict';
import * as Joi from 'joi';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import errorMessages from '../util/constants/error.messages';
import * as orgApiKeysService from '../services/org.api.keys.service';
import commonUtil from "../util/common.util";

const validators = {
  createOrgApiKeyValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateDeleteRequest: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      id: Joi.string().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: false});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateOrgPrivateKey: (req, resp, next) => {
    const token = req.headers['x-access-token'];
    if (!token) {
      return resp.status(403).send({success: false, message: errorMessages.TOKEN_IS_REQUIRED});
    }
    orgApiKeysService.findOne({
      where: {
        privateKey: token
      }
    }).then((tokenDetails) => {
      if (!tokenDetails) {
        throw new Error('TOKEN_IS_INVALID');
      }
      req.locals.privateKeyDetails = tokenDetails.get({plain: true});
      // req.locals.privateKeyPayload=commonUtil.jwtVerify(commonUtil.getPrivateKeyObj(token));
      next();
      return null;
    }).catch((err) => {
      let message, status, code;
      if (err && errorMessages[err.message]) {
        code = err.message;
        status = 403;
        message = errorMessages[err.message];
      } else {
        logger.error(err);
        code = 'SERVER_ERROR';
        status = 500;
        message = errorMessages.SERVER_ERROR;
      }

      resp.status(status).send({
        success: false,
        message,
        code
      });
    })

  },
}
export default validators;
