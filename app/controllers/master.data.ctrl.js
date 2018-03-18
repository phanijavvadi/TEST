'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as masterDataService from '../services/master.data.service';
import models from '../models';
import successMessage from "../util/constants/success.messages";
import constants from "../util/constants/constants";
import _ from 'lodash';
import errorMessages from "../util/constants/error.messages";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getOptions: (req, resp) => {
    const key = req.params.key;
    const options = {
      where: {
        key: key,
        status: 1
      }
    };
    return masterDataService
      .getOptions(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  importMasterData: (req, resp, next) => {
    models.MasterData.bulkCreate(req.body.data, {individualHooks: true})
      .then(() => {
        return resp.send('import completed successfully');
      }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  getHealthChecksList: (req, resp, next) => {
    const options = {
      where: {},
      attributes: ['id', 'name', 'status', 'orgId']
    };
    if (req.query.status) {
      options.where.status = +req.query.status;
    }
    if (req.query.limit) {
      options.limit = Number(req.query.limit || 25);
      options.offset = Number(req.query.offset || 0);
    }
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      options.where.orgId = [...userOrgIds];
    }
    models.HealthChecksMaster.findAndCountAll(options)
      .then((res) => {
        return resp.send(res);
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getHealthChecksOptions: (req, resp, next) => {
    const options = {
      where: {
        status: 1
      },
      attributes: [['id', 'value'], ['name', 'label']]
    };

    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      options.where.orgId = [...userOrgIds];
    }
    models.HealthChecksMaster.findAll(options)
      .then((res) => {
        return resp.send(res);
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addHealthCheck: (req, resp, next) => {
    const body = req.body;
    const data = body;
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      data.orgId = body.orgId
    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.HealthChecksMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true
        })
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          data: {
            id: res.id,
          },
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        logger.info(err);
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'HEALTH_CHECK_NAME_EXIST') {
          message = 'Duplicate health check name ' + err.errors[0].instance.get('name');
        }
        throw new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateHealthCheck: (req, resp, next) => {
    const body = req.body;
    const data = body;
    const {authenticatedUser} = req.locals;
    const where = {
      id: data.id
    }
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      data.orgId = body.orgId;
      where.orgId = body.orgId;

    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.HealthChecksMaster.findOne({where})
      })
      .then((p) => {
        if (p) {
          return p.update(data, {
            transaction: transactionRef,
            individualHooks: true
          });
        } else {
          throw new Error('INVALID_INPUT');
        }
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          data: {
            id: res.id,
          },
          success: true,
          message: successMessage.UPDATED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        logger.info(err);
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'HEALTH_CHECK_NAME_EXIST') {
          message = 'Duplicate health check name ' + err.errors[0].instance.get('name');
        }
        throw new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
};

export default operations;
