'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import models from '../models';
import successMessage from "../util/constants/success.messages";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getOptions: (req, resp, next) => {
    return models.PreventiveActivityCategoryMaster
      .findAll({
        where: {
          status: 1
        },
        include: [
          {
            model: models.PreventiveActivityMaster,
            as: 'activities',
            attributes: ['id', 'name', 'notes'],
            where: {
              status: 1
            }
          }
        ],
        attributes: ['id', 'name']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetricOptions: (req, resp, next) => {
    const preventive_act_mid = req.params.preventive_act_mid;
    return models.PreventiveActivityMetricMaster
      .findAll({
        where: {
          status: 1,
          preventive_act_mid
        },
        attributes: ['id', 'name', 'notes', 'frequency_master_key']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  savePreventiveCategoryMasterData: (req, resp, next) => {
    const data = req.body.categories;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const que = [];
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.forEach(a => {
          a.createdBy = authenticatedUser.id;
          que.push(models.PreventiveActivityCategoryMaster.create(a, {
            transaction: transactionRef,
            individualHooks: true
          }))
        });
        return Promise.all(que)
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'ACTIVITY_CATEGORY_NAME_EXIST') {
          message = 'Duplicate activity category ' + err.errors[0].value;
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  savePreventiveActsMasterData: (req, resp, next) => {
    const acts = req.body.acts;
    const preventive_act_cat_mid = req.body.preventive_act_cat_mid;
    const que = [];
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        acts.forEach(a => {
          a.createdBy = authenticatedUser.id;
          a.preventive_act_cat_mid = preventive_act_cat_mid;
          que.push(models.PreventiveActivityMaster.create(a, {
            transaction: transactionRef,
            individualHooks: true
          }))
        });
        return Promise.all(que)
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'ACTIVITY_NAME_EXIST') {
          message = 'Duplicate Activity name ' + err.errors[0].value;
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  savePreventiveMetricsMasterData: (req, resp, next) => {
    const metrics = req.body.metrics;
    // const preventive_act_mid = req.body.preventive_act_mid;
    const que = [];
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        metrics.forEach(a => {
          a.createdBy = authenticatedUser.id;
          // a.preventive_act_mid = preventive_act_mid;
          que.push(models.PreventiveActivityMetricMaster.create(a, {
            transaction: transactionRef,
            individualHooks: true
          }))
        });
        return Promise.all(que)
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'METRIC_NAME_EXIST') {
          message = 'Duplicate Metric name ' + err.errors[0].value;
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
};

export default operations;
