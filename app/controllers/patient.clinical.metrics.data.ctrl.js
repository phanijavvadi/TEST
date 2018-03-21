'use strict';
import models from '../models';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import * as patientClinicalMetricsDataService from '../services/patient.clinical.metrics.data.service';
import constants from "../util/constants/constants";
import moment from 'moment';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const operations = {
  saveClinicalMetricData: (req, resp, next) => {
    const data = req.body;

    const {authenticatedUser, tokenDecoded} = req.locals;
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      data.source = 1;//patient
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      data.source = 2; //practice
    }
    data.on_date = moment();
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientClinicalMetricsDataService.create(data, {transaction});
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getClinicalMetricData: (req, resp, next) => {
    const options = {
      where: {
        metric_type: req.params.metric_type,
        patient_id: req.params.patient_id,
      },
      attributes: ['measurement', 'id', 'source', 'on_date'],
      order: [['on_date', 'ASC']],
      raw: true
    };
    const {authenticatedUser, tokenDecoded} = req.locals;
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where.patient_id = tokenDecoded.id;
    }

    if (req.query.limit) {
      options.limit = Number(req.query.limit);
      options.offset = Number(req.query.offset || 0);
    }
    models.PatientClinicalMetricData.findAndCountAll(options)
      .then(res => {
        const resObj = {
          // count: res.count
        };
        let rows = res.rows;
        rows = rows.map(a => {
          if (a.on_date) {
            a.on_date = moment(a.on_date).format('YYYY-MM-DD');
          }
          return a;
        });
        resObj.rows = rows;
        resObj.count = res.count;
        return resObj;
        /*return models.PatientClinicalMetricData.PatientCarePlan.findOne({
          where: {
            patient_id: patient_id,
            status: [3]
          },
          include:[
            {
              model:models.models.PatientCarePlanProblems,
              as:'cp_problems',
              attributes:['id'],
              include:[{
                model: models.PatientCarePlanProblemMetric,
                as: 'metrics',
                attributes: {
                  exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
                },
                include: [
                  {
                    model: models.PatientCarePlanProblemMetricTarget,
                    as: 'targets',
                    attributes: {
                      exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
                    },
                    include: [
                      {
                        model: models.ProblemMetricTargetMaster,
                        as: 'metric_target_master',
                        attributes: {
                          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
                        },
                      }
                    ]
                  }
                ]
              }]
            }
          ]
        })*/
      })
      .then(resObj => {
        return resp.json({
          success: true,
          data: resObj,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getClinicalData: (req, resp, next) => {
    const options = {
      where: {
        patient_id: req.params.patient_id,
      },
      attributes: [Sequelize.literal('DISTINCT ON(metric_type) metric_type'), 'measurement', 'id', 'source', 'on_date'],
      order: [['metric_type', 'DESC'], ['on_date', 'DESC']]
      /*include: [{
        model: models.ProblemMetricsMaster,
        as: 'metrics_master',
        on: {'$PatientClinicalMetricData.metric_type$': {$col: 'ProblemMetricsMaster.type'}},
        required: false,
        constraints:false
      }]*/
    };
    const {authenticatedUser, tokenDecoded} = req.locals;
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where.patient_id = tokenDecoded.id;
    }
    patientClinicalMetricsDataService.findAndCountAll(options)
      .then(res => {
        const resObj = {};
        let rows = res;
        rows = rows.map(a => {
          if (a.on_date) {
            a.on_date = moment(a.on_date).format('YYYY-MM-DD');
          }
          return a;
        });
        resObj.rows = rows;
        return resp.json({
          success: true,
          data: resObj,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
};

export default operations;
