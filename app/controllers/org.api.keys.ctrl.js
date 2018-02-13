'use strict';

import models from '../models';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';
import logger from '../util/logger';
import commonUtil from '../util/common.util';
import * as _ from 'lodash';
import errorMessages from '../util/constants/error.messages';
import successMessages from '../util/constants/success.messages';
import * as orgApiKeysService from '../services/org.api.keys.service';

const operations = {
  getOrgOrgApiKeyList: (req, resp) => {
    logger.info('About to get organisation api keys list');
    const {authenticatedUser} = req.locals;
    const options = {};
    options.where = {};

    /**
     * check user has organisation access and add filter query
     * Throw error if don't has access
     * */
    if (authenticatedUser.userCategory.value === 'ORG_USER') {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }


    if (req.query.orgId) {
      options.where['orgId'] = req.query.orgId;
    }
    return orgApiKeysService
      .getOrgOrgApiKeyList(req.query, options)
      .then((data) => {
        if (data) {
          data.rows = _.map(data.rows, (row) => {
            row = row.get({plain: true});
            row.createdAt = moment(row.createdAt).format('YYYY-MM-DD HH:ss:mm');
            return row;
          })
          resp.status(200).json(data);
        }
      }).catch((err) => {
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
  get: (req, resp) => {
    const id = req.params.id;
    const {authenticatedUser} = req.locals;
    logger.info('About to get user ', id);
    const options = {where: {}};

    if (authenticatedUser.userCategory.value === 'ORG_USER') {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      options.where['orgId'] = userOrgIds;
    }

    return orgApiKeysService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.INVALID_ORG_API_KEY_ID);
        }
      }).catch((err) => {
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
  createOrgApiKey: (req, resp) => {
    const body = req.body;
    const {authenticatedUser, organization} = req.locals;
    const payload = {
      userId: authenticatedUser.id,
      orgId:organization.id,
      email: authenticatedUser.email,
      firstName: authenticatedUser.firstName,
      lastName: authenticatedUser.lastName,
      context: 'ORG_API_KEY'
    };
    const apiKeyData = {
      privateKey: commonUtil.createPrivateKey({payload: payload}),
      createdBy: authenticatedUser.id,
      orgId: organization.id
    };
    logger.info('About to create  org api key', apiKeyData);
    let transactionRef;
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return orgApiKeysService.create(apiKeyData, {transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          data: {
            id: res.id,
            orgId: res.orgId,
            privateKey: res.privateKey
          },
          message: successMessages.ORG_API_KEY_CREATED
        });
      })
      .catch((err) => {
        transactionRef.rollback();
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
  deleteOrgApiKey: (req, resp) => {
    const body = req.body;
    const apiData = {
      id: body.id,
      orgId: body.orgId
    };
    logger.info('About to delete  apikey', apiData);
    let transactionRef;
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return orgApiKeysService.deleteOrgApiKey(apiData, {transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          message: successMessages.ORG_API_KEY_DELETED
        });
      })
      .catch((err) => {
        transactionRef.rollback();
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
};

export default operations;
