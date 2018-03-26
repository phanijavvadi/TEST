'use strict';

import logger from '../util/logger';
import models from '../models';
import errorMessages from '../util/constants/error.messages';
import successMessages from '../util/constants/success.messages';
import * as orgUserTypeService from '../services/user.type.service';
import * as commonUtil from '../util/common.util';
import constants from "../util/constants/constants";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const operations = {
  getOrgUserCategories: (req, resp) => {
    return models.UserSubCategory
      .findAll({
        include: [{
          model: models.UserCategory,
          attributes: [],
          require: true,
          where: {
            value: constants.userCategoryTypes.ORG_USER,
          },
          as: 'userCategory'
        }],
        attributes: [['id', 'userSubCategoryId'], 'name', 'userCategoryId']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  getOrgTypeslist: (req, resp) => {
    logger.info('About to get organisation user type options');
    return orgUserTypeService
      .getOrgTypeslist(req.query)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  getOrgUserTypeOptions: (req, resp) => {
    logger.info('About to get organisation user type options');
    const options = {where: {}};
    if (req.query.type) {
      options.where['$userSubCategory.value$'] = req.query.type;
    }
    return orgUserTypeService
      .getOrgUserTypeOptions(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  create: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    const value = body.name.replace(/\s+/g, '_').toUpperCase();
    const data = {
      name: body.name,
      value: value,
      regNoVerificationRequired: body.regNoVerificationRequired,
      userCategoryId: body.userCategoryId,
      userSubCategoryId: body.userSubCategoryId,
    };
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.UserType.create(data, {transaction});
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'USER_TYPE_NAME_EXIST') {
          message = 'Duplicate user type name ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  update: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    const value = body.name.replace(/\s+/g, '_').toUpperCase();
    const data = {
      name: body.name,
      value: value,
      regNoVerificationRequired: body.regNoVerificationRequired,
      userCategoryId: body.userCategoryId,
      userSubCategoryId: authenticatedUser.userSubCategoryId,
    };
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.UserType.findById(body.id, {transaction});
      })
      .then((p) => {
        if (p) {
          return p.update(data, {
            transaction: transaction,
            individualHooks: true
          });
        } else {
          throw new Error('INVALID_INPUT');
        }
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'USER_TYPE_NAME_EXIST') {
          message = 'Duplicate user type name ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
}

export default operations;
