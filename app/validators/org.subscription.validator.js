'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as subscriptionTypeService from '../services/subscription.type.service';
import * as orgSubscriptionService from '../services/org.subscription.service';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
const validators = {
  subscribeReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      subscriptionTypeId: Joi.string().required(),
      orgId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  unSubscribeReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      // id: Joi.string().required(),
      orgId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateSubscriptionTypeId: (req, resp, next) => {
    const {subscriptionTypeId} = req.body;
    subscriptionTypeService.findById(subscriptionTypeId)
      .then((data) => {
        if (data) {
          req.locals = req.locals || {};
          req.locals.subscriptionType = data.get({plain: true});
          next();
          return '';
        } else {
          return resp.status(403).send({success: false, message: errorMessages.SUBSCRIPTION_TYPE_NOT_FOUND});
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

  validateSubscriptionAlreadyExist: (req, resp, next) => {
    const {subscriptionId} = req.body;
    orgSubscriptionService.findOne({
      where: {
        status: 1,
        orgId: req.body.orgId
      }
    })
      .then((data) => {
        if (data) {
          return resp.status(403).send({
            success: false,
            message: errorMessages.ORG_SUBSCRIPTION_ALREADY_EXIST_PLEASE_UNSUBSCRIBE
          });
        } else {
          next();
          return '';
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
}
export default validators;
