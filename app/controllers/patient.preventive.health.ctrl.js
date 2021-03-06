'use strict';
import * as _ from 'lodash';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as htmlToText from 'html-to-text';
import moment from 'moment';
import models from '../models';
import errorMessages from '../util/constants/error.messages';
import * as patientService from '../services/patient.service';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import constants from '../util/constants/constants';
import logger from "../util/logger";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const patientPreventiveHealthModel = models.PatientPreventiveHealth;
const patientPreventiveActivitiesModel = models.PatientPreventiveActivities;
const patientPrevetiveActivityMetricModel = models.PatientPrevetiveActivityMetric;

const preventiveActivityMasterModel = models.PreventiveActivityMaster;
const preventiveActivityMetricMasterModel = models.PreventiveActivityMetricMaster;


const operations = {
  get: (req, resp) => {
    const patient_id = req.params.patientId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        patient_id: patient_id,
        status: [1]
      },
      include: [
        {
          model: models.PatientPreventiveActivities,
          as: 'ph_acts',
          attributes: ['id', 'ph_id', 'preventive_act_mid'],
          include: [
            {
              model: models.PatientPrevetiveActivityMetric,
              attributes: ['id', 'name', 'preventive_metric_mid', 'notes', 'frequencyKey', 'frequency'],
              as: 'metrics'
            },
            {
              model: models.PreventiveActivityMaster,
              as: 'preventive_act_master',
              attributes: ['id', 'name', 'notes']
            }
          ]
        },
        {
          model: models.User,
          attributes: ['firstName', 'lastName', 'id'],
          as: 'createdBy'
        }
      ],
      attributes: {
        exclude: ['deletedAt']
      }
    };
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
      // options.where['status'] = 3;
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }
    return patientPreventiveHealthModel.findOne(options)
      .then((data) => {
        if (data) {
          const resultObj = data.get({plain: true});
          if (resultObj.createdAt) {
            resultObj.createdAt = moment(resultObj.createdAt).format('YYYY-MM-DD HH:ss');
          }
          if (resultObj.updatedAt) {
            resultObj.updatedAt = moment(resultObj.updatedAt).format('YYYY-MM-DD HH:ss');
          }
          resp.status(200).json(resultObj);
        } else {
          resp.status(200).send({});
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp);
      });
  },
  getPatientHealthChecks: (req, resp, next) => {
    let patient_id = req.query.patient_id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        patient_id: patient_id,
        status: [1]
      },
      attributes: ['id'],
      raw: true
    };
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['patient_id'] = tokenDecoded.id;
    }
    patientPreventiveHealthModel.findOne(options)
      .then(res => {
        if (!res) {
          return [];
        } else {
          const options = {
            where: {
              ph_id: res.id
            },
            attributes: ['id', 'name'],
            include: [{
              model: models.PatientPreventiveHealthChecksData,
              as: 'health_check_data',
              attributes: ['id', 'due_date', 'checkup_date', 'hc_id'],
              order: [['updatedAt', 'DESC']],
              limit: 1,
              separate: true
            }],
            // raw: true
          };
          return models.PatientPreventiveHealthChecks.findAll(options);
        }
      })
      .then(res => {
        res = res.map(a => {
          a = a.get({plain: true});
          a.health_check_data = a.health_check_data.map(b => {
            if (b.due_date) {
              b.due_date = moment(b.due_date).format('DD,MMM YYYY')
            }
            if (b.checkup_date) {
              b.checkup_date = moment(b.checkup_date).format('DD,MMM YYYY')
            }
            return b;
          });
          return a;
        });
        return resp.json(res);
      }).catch((err) => {
      commonUtil.handleException(err, req, resp, next);
    });
  },
  getHealthChecks: (req, resp, next) => {
    const ph_id = req.params.ph_id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        ph_id: ph_id
      },
      attributes: ['id', 'name'],
      include: [{
        model: models.PatientPreventiveHealthChecksData,
        as: 'health_check_data',
        attributes: ['id', 'due_date', 'checkup_date', 'hc_id'],
        order: [['updatedAt', 'DESC']],
        limit: 1,
        separate: true
      }],
      // raw: true
    };
    models.PatientPreventiveHealthChecks.findAll(options)
      .then(res => {
        res = res.map(a => {
          a = a.get({plain: true});
          a.health_check_data = a.health_check_data.map(b => {
            if (b.due_date) {
              b.due_date = moment(b.due_date).format('DD,MMM YYYY')
            }
            if (b.checkup_date) {
              b.checkup_date = moment(b.checkup_date).format('DD,MMM YYYY')
            }
            return b;
          });
          return a;
        });
        return resp.json(res);
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  create: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    const created_by = authenticatedUser.id;
    const data = {
      orgId: body.orgId,
      patient_id: body.patient_id,
      created_by,
      status: 1
    };
    let transaction;
    let ph_record;
    let patient_record;
    let acts_master = [];
    const ph_acts = [];
    const ph_acts_index = {};
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientService
          .findById(body.patient_id, {
            attributes: ['dob', 'gender', 'orgId'],
            where: {
              id: body.patient_id
            }
          })
      })
      .then(patient => {
        if (!patient) {
          throw new Error('INVALID_INPUT');
        }
        patient_record = patient;
        const gender = [];
        if (patient.gender) {
          gender.push(patient.gender);
        }
        let patient_age;
        let age_groups_where_condition = {};
        if (patient.dob) {
          patient_age = moment().diff(moment(patient.dob, 'YYYY-MM-DD'), 'years', false);
          age_groups_where_condition = Sequelize.literal(`((${patient_age} between "age_groups"."from"  and "age_groups"."to") or ("age_groups"."to" is null and "age_groups"."from"<=${patient_age}) or ("age_groups"."from" is null and "age_groups"."to">=${patient_age}))`);
        }
        return preventiveActivityMasterModel.findAll({
          where: {
            gender: {
              [Op.or]: [
                null,
                gender
              ]
            },
            status: 1,
            orgId: patient.orgId
          },
          include: [
            {
              model: models.PreventiveActivityAgeGroupMaster,
              as: 'age_groups',
              attributes: ['preventive_act_mid'],
              where: age_groups_where_condition
            }
          ],
          attributes: [[Sequelize.fn('DISTINCT', Sequelize.col('"PreventiveActivityMaster"."id"')), 'id']],
          raw: true
        })
      })
      .then(res => {
        acts_master = res;
        return patientPreventiveHealthModel.create(data, {transaction: transaction})
      })
      .then(ph => {
        ph_record = ph;
        const que = [];
        acts_master.forEach((act_master, index) => {
          const ph_act = {
            ph_id: ph.id,
            preventive_act_mid: act_master.id,
            patient_id: body.patient_id,
            created_by,
            metrics: []
          };
          ph_acts.push(ph_act);
          ph_acts_index[act_master.id] = index;

          const options = {
            where: {
              preventive_act_mid: act_master.id,
              status: [1]
            },
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status']
            },
            raw: true
          };
          que.push(preventiveActivityMetricMasterModel.findAll(options));
        });
        return Promise.all(que);
      })
      .then((act_metrics_data) => {
        if (act_metrics_data) {
          act_metrics_data.forEach(metrics_master => {
            (metrics_master || []).forEach(metric_master => {
              const phMatricData = {
                preventive_metric_mid: metric_master.id,
                name: metric_master.name,
                notes: metric_master.notes,
                frequency: metric_master.frequency,
                created_by: created_by
              };
              ph_acts[ph_acts_index[metric_master.preventive_act_mid]].metrics.push(phMatricData);
            });
          });
        }
        const ph_acts_que = [];
        ph_acts.forEach(ph_act => {
          ph_acts_que.push(patientPreventiveActivitiesModel.create(ph_act, {
            transaction: transaction,
            include: [{
              model: models.PatientPrevetiveActivityMetric,
              as: 'metrics'
            }]
          }));
        });
        return Promise.all(ph_acts_que);
      })
      .then(res => {
        const act_mids = acts_master.map(a => a.id);
        if (act_mids && act_mids.length > 0) {
          const options = {
            where: {
              preventive_act_mid: act_mids
            },
            attributes: [Sequelize.literal('DISTINCT ON(hc_mid) hc_mid'), 'preventive_act_mid'],
            include: [{
              model: models.HealthChecksMaster,
              as: 'hc_master',
              attributes: [['name', 'hc_master_name']]
            }],
            raw: true
          };
          return models.PreventiveActivityHealthChecksMaster.findAll(options);
        } else {
          return null;
        }
      })
      .then(healthChecks => {
        if (!healthChecks) {
          return null;
        } else {
          const activity_health_checks = [];
          (healthChecks || []).forEach(hc => {
            activity_health_checks.push(models.PatientPreventiveHealthChecks.create({
              name: hc['hc_master.hc_master_name'],
              hc_mid: hc.hc_mid,
              ph_id: ph_record.id,
              created_by
            }, {
              transaction: transaction
            }));
          });
          return Promise.all(activity_health_checks)
        }
      })
      .then((res) => {
        transaction.commit();
        return resp.json({
          success: true,
          data: ph_record,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  addActivity: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    const created_by = authenticatedUser.id;

    let transaction;
    let ph_acts = [];
    const ph_acts_index = {};
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        const que = [];
        body.acts_master.forEach((act_master, index) => {
          const ph_act = {
            ph_id: body.ph_id,
            preventive_act_mid: act_master.id,
            patient_id: body.patient_id,
            created_by: created_by,
            metrics: []
          };
          ph_acts.push(ph_act);
          ph_acts_index[act_master.id] = index;

          const options = {
            where: {
              preventive_act_mid: act_master.id,
              status: [1]
            },
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status']
            }
          };
          que.push(preventiveActivityMetricMasterModel.findAll(options));
        });
        return Promise.all(que);
      })
      .then((act_metrics_data) => {
        if (act_metrics_data) {
          act_metrics_data.forEach(metrics_master => {
            (metrics_master || []).forEach(metric_master => {
              const phMatricData = {
                preventive_metric_mid: metric_master.id,
                name: metric_master.name,
                notes: metric_master.notes,
                frequency: metric_master.frequency,
                created_by: created_by
              };
              ph_acts[ph_acts_index[metric_master.preventive_act_mid]].metrics.push(phMatricData);
            });
          });
        }
        const ph_acts_que = [];
        ph_acts.forEach(ph_act => {
          ph_acts_que.push(patientPreventiveActivitiesModel.create(ph_act, {
            transaction: transaction,
            include: [{
              model: models.PatientPrevetiveActivityMetric,
              as: 'metrics'
            }]
          }));
        });
        return Promise.all(ph_acts_que);
      }).then(res => {
        ph_acts = res;
        return models.PatientPreventiveHealthChecks.findAll({
          where: {
            ph_id: body.ph_id
          },
          attributes: ['hc_mid'],
          raw: true
        })
      })
      .then(existingHealthCheckIds => {
        const extHcIds = (existingHealthCheckIds || []).map(a => a.hc_mid);
        const act_mids = body.acts_master.map(a => a.id);
        if (act_mids && act_mids.length > 0) {
          const options = {
            where: {
              preventive_act_mid: act_mids,
              hc_mid: {
                [Op.notIn]: extHcIds
              }
            },
            attributes: [Sequelize.literal('DISTINCT ON(hc_mid) hc_mid'), 'preventive_act_mid'],
            include: [{
              model: models.HealthChecksMaster,
              as: 'hc_master',
              attributes: ['name']
            }],
            raw: true
          };
          return models.PreventiveActivityHealthChecksMaster.findAll(options);
        } else {
          return null;
        }
      })
      .then(healthChecks => {
        if (!healthChecks) {
          return null;
        } else {
          const activity_health_checks = [];
          (healthChecks || []).forEach(hc => {
            activity_health_checks.push(models.PatientPreventiveHealthChecks.create({
              hc_mid: hc.hc_mid,
              ph_id: body.ph_id,
              name: hc['hc_master.name'],
              created_by
            }, {transaction}));
          });
          return Promise.all(activity_health_checks)
        }
      })
      .then((res) => {
        transaction.commit();
        const options = {
          attributes: ['id', 'ph_id', 'preventive_act_mid'],
          include: [
            {
              model: models.PatientPrevetiveActivityMetric,
              attributes: ['id', 'name', 'preventive_metric_mid', 'notes', 'frequencyKey', 'frequency'],
              as: 'metrics'
            },
            {
              model: models.PreventiveActivityMaster,
              as: 'preventive_act_master',
              attributes: ['id', 'name', 'notes']
            }
          ],
          where: {
            id: ph_acts.map(a => a.id)
          }
        };
        return patientPreventiveActivitiesModel.findAll(options);
      })
      .then(resultObj => {
        if (resultObj) {
          resultObj = resultObj.map((ph_act, i) => {
            return ph_act;
          });
        }
        return resp.json({
          success: true,
          data: resultObj,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        logger.info(err);
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'PH_ACT_ALREADY_MAPPED') {
          message = 'PH_ACT_ALREADY_MAPPED';
        }
        throw new Error(message);
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  removeActivity: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    const data = {
      id: body.ph_acts.map(a => a.id),
      ph_id: body.ph_id,
    };
    return sequelize.transaction()
      .then((t) => {
        return patientPreventiveActivitiesModel
          .destroy({
            where: data
          }, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              message: successMessages.REMOVED_SUCCESS
            });
          })
          .catch((err) => {
            t.rollback();
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  addPhActMetric: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    const created_by = authenticatedUser.id;
    let transaction;

    const options = {
      where: {
        id: body.preventive_metric_mid,
        status: [1]
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status']
      }
    };
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        return preventiveActivityMetricMasterModel.findOne(options)
      })
      .then((metric_master) => {
        if (!metric_master) {
          throw new Error('INVALID_INPUT');
        }
        metric_master = metric_master.get({plain: true});
        const phMatricData = {
          preventive_metric_mid: metric_master.id,
          ph_act_id: body.ph_act_id,
          name: metric_master.name,
          notes: metric_master.notes,
          frequencyKey: metric_master.frequency_master_key,
          created_by: created_by
        };
        return patientPrevetiveActivityMetricModel.create(phMatricData, {
          transaction: transaction
        })
      })
      .then((res) => {
        transaction.commit();
        return resp.json({
          success: true,
          data: res,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  removePhActMetric: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(body.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }
    const data = {
      id: body.preventive_metric_id,
      ph_act_id: body.ph_act_id,
    };
    return sequelize.transaction()
      .then((t) => {
        return patientPrevetiveActivityMetricModel
          .destroy({where: data}, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              message: successMessages.REMOVED_SUCCESS
            });
          })
          .catch((err) => {
            t.rollback();
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  saveMetric: (req, resp, next) => {
    const data = req.body;
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientPrevetiveActivityMetricModel.findById(data.id, {transaction});
      })
      .then((p) => {
        if (p) {
          return p.update(data, {transaction});
        } else {
          throw new Error('INVALID_PATIENT_PH_ID');
        }
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessages.UPDATED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });

  },
  saveHealthCheckData: (req, resp, next) => {
    const data = req.body;
    let transaction;
    let {authenticatedUser, tokenDecoded} = req.locals;
    data.created_by = authenticatedUser.id;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.PatientPreventiveHealthChecksData.create(data, {transaction});
      })
      .then(res => {
        const resObj = {
          id: res.id,
          due_date: moment(res.due_date).format('DD,MMM YYYY'),
          checkup_date: (res.checkup_date) ? moment(res.checkup_date).format('DD,MMM YYYY') : null
        };
        transaction.commit();
        return resp.json({
          success: true,
          data: resObj,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });

  },
  updateHealthCheckData: (req, resp, next) => {
    const data = req.body;
    let transaction;
    let {authenticatedUser, tokenDecoded} = req.locals;
    // data.created_by = authenticatedUser.id;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.PatientPreventiveHealthChecksData.findById(data.id);
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
          message: successMessages.UPDATED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  }
};

export default operations;
