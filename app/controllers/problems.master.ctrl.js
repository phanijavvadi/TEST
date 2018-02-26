'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as problemsMasterService from '../services/problem.master.service';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import models from '../models';
import successMessage from "../util/constants/success.messages";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getOptions: (req, resp) => {
    return problemsMasterService
      .getOptions()
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetrics: (req, resp) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        status: [1]
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
      }
    };
    return problemMetricsMasterService
      .findAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetric: (req, resp) => {
    const metricId = req.params.metricId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        id: metricId,
        status: [1]
      },
      include: [
        {
          model: models.CareProblemMetricTarget,
          as: 'targets',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
          }
        }, {
          model: models.CareProblemMetricActionPlan,
          as: 'actionPlans',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
          },
          include: [
            {
              model: models.CareProblemMetricActionPlanInput,
              as: 'actionPlanInputs',
              attributes: {
                exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
              },
              include: [
                {
                  model: models.CareProblemMetricActionPlanInputOption,
                  as: 'actionPlanInputOptions',
                  attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt', 'status']
                  }
                },
                {
                  model: models.MasterData,
                  as: 'inputType',
                  attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt', 'order', 'status']
                  }
                },
                {
                  model: models.MasterData,
                  as: 'uom',
                  attributes: {
                    exclude: ['deletedAt', 'createdAt', 'updatedAt', 'order', 'status']
                  }
                }

              ]
            }
          ]
        }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    return problemMetricsMasterService
      .findOne(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  savePoblemsMasterData: (req, resp) => {
    const data = req.body.problems;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const que = [];
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.forEach(a => {
          a.createdBy = authenticatedUser.id;
          que.push(models.ProblemsMaster.create(a, {
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
      .catch((err) => {
        transactionRef.rollback();
        logger.info(err);
        resp.status(500).send('error');
      });
  },
  saveMetricsMasterData: (req, resp, next) => {
    const metrics = req.body.metrics;
    const problem_mid = req.body.problem_mid;
    const que = [];
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        metrics.forEach(a => {
          a.createdBy = authenticatedUser.id;
          a.problem_mid = problem_mid;
          if (a.master_targets) {
            a.master_targets = a.master_targets.map(master_target => {
              master_target.createdBy = authenticatedUser.id;
              return master_target;
            });
          }
          if (a.master_act_plans) {
            a.master_act_plans = a.master_act_plans.map(master_act_plan => {
              master_act_plan.inputs_master = master_act_plan.inputs_master.map(input_master => {
                input_master.createdBy = authenticatedUser.id;
                if (input_master.input_options_master) {
                  input_master.input_options_master = input_master.input_options_master.map(input_options_master => {
                    input_options_master.createdBy = authenticatedUser.id;
                    return input_options_master;
                  });
                }
                return input_master;
              });
              master_act_plan.createdBy = authenticatedUser.id;
              return master_act_plan;
            });
          }
          que.push(models.ProblemMetricsMaster.create(a, {
            include: [
              {
                model: models.ProblemMetricTargetMaster,
                as: 'master_targets'
              },
              {
                model: models.ProblemMetricActionPlanMaster,
                as: 'master_act_plans',
                include: [
                  {
                    model: models.ProblemMetricActionPlanInputMaster,
                    as: 'inputs_master',
                    include: [
                      {
                        model: models.ProblemMetricActionPlanInputOptionMaster,
                        as: 'input_options_master'
                      }
                    ]
                  }
                ]
              }
            ],
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
        transactionRef.rollback();
        let message = err.message;
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'METRIC_TYPE_EXIST') {
          message = 'Metric type ' + err.errors[0].value + ' already exist';
        }
        commonUtil.handleException({code: 422, message}, req, resp, next);
        return null;
      })
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
};

export default operations;
