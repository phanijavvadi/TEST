'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import models from '../models';
import successMessage from "../util/constants/success.messages";
import constants from "../util/constants/constants";
import errorMessages from "../util/constants/error.messages";
import _ from 'lodash';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getOptions: (req, resp, next) => {
    const gender = [];
    if (req.params.gender) {
      gender.push(Number(req.params.gender));
    }
    const where = {
      status: 1
    };
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      where.orgId = [...userOrgIds];
    }
    return models.PreventiveActivityCategoryMaster
      .findAll({
        where: where,
        include: [
          {
            model: models.PreventiveActivityMaster,
            as: 'activities',
            attributes: ['id', 'name', 'notes'],
            where: {
              gender: {
                [Op.or]: [
                  null,
                  gender
                ]
              },
              status: 1
            }
          }
        ],
        attributes: ['id', 'name'],
        order: ['name']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getCategoriesList: (req, resp, next) => {
    const where = {
      // status: 1
    };
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      where.orgId = [...userOrgIds];
    }
    return models.PreventiveActivityCategoryMaster
      .findAndCountAll({
        where: where,
        attributes: ['id', 'name', 'status', 'orgId'],
        order: ['name']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  createPreventiveCategoryMasterData: (req, resp, next) => {
    const data = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const que = [];
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(data.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.PreventiveActivityCategoryMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true
        });
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
          message = 'Duplicate activity category ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updatePreventiveCategoryMasterData: (req, resp, next) => {
    const data = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const que = [];
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        const options = {
          where: {}
        };
        if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
          let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
            return role.orgId;
          });
          options.where.orgId = [...userOrgIds];
        }
        return models.PreventiveActivityCategoryMaster.findById(data.id, options);
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
          data: res,
          success: true,
          message: successMessage.UPDATED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'ACTIVITY_CATEGORY_NAME_EXIST') {
          message = 'Duplicate activity category ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },


  getActivitiesList: (req, resp, next) => {
    const preventive_act_cat_mid = req.params.preventive_act_cat_mid;
    const {authenticatedUser} = req.locals;
    const where = {
      preventive_act_cat_mid
    };
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      where.orgId = [...userOrgIds];
    }
    return models.PreventiveActivityMaster
      .findAndCountAll({
        where: where,
        attributes: ['id', 'name', 'gender', 'notes', 'status'],
        order: ['name'],
        include: [{
          model: models.PreventiveActivityHealthChecksMaster,
          as: 'activity_health_checks',
          attributes: ['id', 'hc_mid'],
        }]
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  createPreventiveActivity: (req, resp, next) => {
    const body = req.body;

    const {authenticatedUser, tokenDecoded} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      preventive_act_cat_mid: body.preventive_act_cat_mid,
      name: body.name,
      notes: body.notes,
      gender: body.gender,
      status: body.status,
    };
    if (body.health_checks && body.health_checks.length > 0) {
      data.activity_health_checks = body.health_checks.map(a => {
        return {
          createdBy,
          hc_mid: a.id
        };
      })
    }
    const que = [];
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(data.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = createdBy;
        return models.PreventiveActivityMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true,
          include: [{
            model: models.PreventiveActivityHealthChecksMaster,
            as: 'activity_health_checks'
          }]
        });
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
          message = 'Duplicate activity name ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updatePreventiveActivity: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      name: body.name,
      id: body.id,
      notes: body.notes,
      gender: body.gender,
      status: body.status,
    };
    let activity_health_checks = [];
    if (body.health_checks && body.health_checks.length > 0) {
      activity_health_checks = body.health_checks.map(a => {
        return {
          createdBy,
          hc_mid: a.id,
          preventive_act_mid: data.id
        };
      })
    }
    const que = [];
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        const options = {
          where: {},
          attributes: ['id', 'name', 'gender', 'notes', 'status']
        };
        if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
          let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
            return role.orgId;
          });
          options.where.orgId = [...userOrgIds];
        }
        return models.PreventiveActivityMaster.findById(data.id, options);
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
      .then(res => {
        return models.PreventiveActivityHealthChecksMaster.destroy({
          where: {preventive_act_mid: data.id}
        }, {
          transaction: transactionRef,
        });
      })
      .then(res => {
        return models.PreventiveActivityHealthChecksMaster.bulkCreate(activity_health_checks, {
          transaction: transactionRef,
        })
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.UPDATED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'ACTIVITY_NAME_EXIST') {
          message = 'Duplicate activity name ' + err.errors[0].instance.get('name');
        }
        throw  new Error(message);
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },

  getActivityAgeGroups: (req, resp, next) => {
    const preventive_act_mid = req.params.preventive_act_mid;
    const {authenticatedUser} = req.locals;
    const where = {
      preventive_act_mid
    };
    return models.PreventiveActivityAgeGroupMaster
      .findAll({
        where: where,
        attributes: ['id', 'from', 'to']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  saveActivityAgeGroups: (req, resp, next) => {
    let age_groups = req.body.age_groups;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const createdBy = authenticatedUser.id;
    age_groups = age_groups.map(age_group => {
      age_group.preventive_act_mid = req.body.preventive_act_mid;
      age_group.createdBy = createdBy;
      return age_group;
    });
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityAgeGroupMaster.bulkCreate(age_groups, {
          transaction: transactionRef,
          individualHooks: true
        });
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  deleteActivityAgeGroup: (req, resp, next) => {
    let age_group = req.body;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityAgeGroupMaster.destroy({
          where: {
            id: age_group.id
          }
        }, {
          transaction: transactionRef,
          individualHooks: true
        });
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.REMOVED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },


  getActivityMetrics: (req, resp, next) => {
    const preventive_act_mid = req.params.preventive_act_mid;
    const {authenticatedUser} = req.locals;
    const where = {
      preventive_act_mid
    };
    return models.PreventiveActivityMetricMaster
      .findAll({
        where: where,
        attributes: ['id', 'name', 'status', 'frequency']
      })
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  saveActivityMetrics: (req, resp, next) => {
    let data = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const createdBy = authenticatedUser.id;
    data.createdBy = createdBy;
    data.frequency_options_master = (data.frequency_options_master || []).map(frequency_option => {
      frequency_option.createdBy = createdBy;
      return frequency_option;
    });
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityMetricMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true,
          include: [{
            model: models.PreventiveActivityMetricsFrequencyMaster,
            as: 'frequency_options_master'
          }]
        });
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateActivityMetrics: (req, resp, next) => {
    let data = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityMetricMaster.findById(data.id);
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
          // data: res,
          success: true,
          message: successMessage.UPDATED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getActivityMetricFrequencyList: (req, resp, next) => {
    const preventive_act_metric_mid = req.params.preventive_act_metric_mid;
    const {authenticatedUser} = req.locals;
    const where = {
      preventive_act_metric_mid
    };
    /* if (req.query.status) {
       where.status = +req.query.status;
     }*/
    return models.PreventiveActivityMetricsFrequencyMaster
      .findAll({
        where: where,
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
  saveActivityMetricFrequencyOptions: (req, resp, next) => {
    let data = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const frequency_options_master = [];
    data.frequency_options_master = (data.frequency_options_master || []).forEach(frequency_option => {
      frequency_option.createdBy = createdBy;
      frequency_option.preventive_act_metric_mid = data.preventive_act_metric_mid;
      frequency_options_master.push(frequency_option);
    });
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityMetricsFrequencyMaster.bulkCreate(frequency_options_master, {
          transaction: transactionRef,
          individualHooks: true
        });
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  deleteActivityMetricFrequency: (req, resp, next) => {
    let data = req.body;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.PreventiveActivityMetricsFrequencyMaster.destroy({
          where: {
            id: data.id
          }
        }, {
          transaction: transactionRef,
          individualHooks: true
        });
      })
      .then((res) => {
        transactionRef.commit();
        return resp.send({
          // data: res,
          success: true,
          message: successMessage.REMOVED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
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
        attributes: ['id', 'name', 'notes', 'frequency']
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
    const que = [];
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        req.body.data.forEach(data => {
          const acts = data.acts;
          const preventive_act_cat_mid = data.preventive_act_cat_mid;
          acts.forEach(a => {
            a.createdBy = authenticatedUser.id;
            a.preventive_act_cat_mid = preventive_act_cat_mid;
            if (a.age_groups) {
              a.age_groups = (a.age_groups || []).map(age_group => {
                age_group.createdBy = authenticatedUser.id;
                return age_group;
              });
            }
            if (a.preventive_metrics_master) {
              a.preventive_metrics_master = (a.preventive_metrics_master || []).map(metric_master => {
                metric_master.createdBy = authenticatedUser.id;
                return metric_master;
              });
            }
            que.push(models.PreventiveActivityMaster.create(a, {
              transaction: transactionRef,
              individualHooks: true,
              include: [{
                model: models.PreventiveActivityAgeGroupMaster,
                as: 'age_groups'
              },
                {
                  model: models.PreventiveActivityMetricMaster,
                  as: 'preventive_metrics_master'
                }]
            }))
          });
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
        logger.info(err);
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
