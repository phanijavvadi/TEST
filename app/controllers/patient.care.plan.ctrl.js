'use strict';
import * as _ from 'lodash';
import models from '../models';
import errorMessages from '../util/constants/error.messages';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import * as patientCarePlanService from '../services/patient.care.plan.service';
import * as patientCarePlanProblemService from '../services/patient.care.plan.problems.service';
import * as patientCarePlanProblemMetricService from '../services/org.patient.care.plan.care.problem.metrics.service';
import constants from '../util/constants/constants';
import * as careProblemMetricsService from '../services/problem.metrics.master.service';
import * as patientCarePlanProblemMetricActionPlan from '../services/org.patient.care.plan.care.problem.action.plan.service';
import * as patientCarePlanProblemMetricTargetService from '../services/org.patient.care.plan.care.problem.metric.target.service';
import * as patientCarePlanProblemMetricActionPlanInputService from '../services/org.patient.care.plan.care.problem.action.plan.input.service';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  get: (req, resp) => {
    const patientId = req.params.patientId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        patientId: patientId,
        status: [1, 3]
      },
      include: [{
        model: models.PatientCarePlanProblems,
        as: 'carePlanProblems',
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
        },
        include: [
          {
            model: models.PatientCarePlanProblemMetric,
            as: 'metrics',
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
            },
            include: [
              {
                model: models.PatientCarePlanProblemMetricTarget,
                as: 'targets',
                attributes: {
                  exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
                },
                include: [
                  {
                    model: models.ProblemMetricTargetMaster,
                    as: 'metric_target_master',
                    attributes: {
                      exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
                    },
                  }
                ]
              }/*,
              {
                model: models.PatientCarePlanProblemMetricActionPlan,
                as: 'act_plans',
                attributes: ['id', 'title', 'act_plan_mid'],
                include: [
                  {
                    model: models.PatientCarePlanProblemMetricActionPlanInput,
                    as: 'inputs',
                    attributes: ['id', 'defVal', 'response'],
                    include: [{
                      model: models.ProblemMetricActionPlanInputMaster,
                      as: 'input_master',
                      attributes: ['id', ['input_type_mid', 'intmid']],
                      include: [
                        {
                          model: models.ProblemMetricActionPlanInputOptionMaster,
                          as: 'input_options_master'
                        }
                      ]
                    }]

                  }
                ]
              }*/
            ]
          },
          {
            model: models.ProblemsMaster,
            as: 'careProblem',
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'status', 'id']
            },
          }
        ]
      }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }
    return patientCarePlanService.findOne(options)
      .then((data) => {
        if (data) {
          const resultObj = data.get({plain: true});

          if (resultObj.carePlanProblems) {
            resultObj.carePlanProblems = resultObj.carePlanProblems.map((carePlanProblem, i) => {

              carePlanProblem.metrics = carePlanProblem.metrics.map(metric => {
                metric.targets = metric.targets.map(target => {
                  if (!target.response) {
                    target.response = target.defVal;
                  }
                  return target;
                });
                return metric;
              });
              return carePlanProblem;
            });
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

  getActionPlanInputs: (req, resp) => {
    const metric_id = req.params.metric_id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        metric_id: metric_id
      },
      include: [
        {
          model: models.PatientCarePlanProblemMetricActionPlanInput,
          as: 'inputs',
          attributes: ['id', 'defVal', 'response'],
          include: [{
            model: models.ProblemMetricActionPlanInputMaster,
            as: 'input_master',
            attributes: ['id', 'label', 'required'],
            include: [
              {
                model: models.MasterData,
                as: 'input_type_master',
                attributes: ['id', 'name', 'value']
              }, {
                model: models.ProblemMetricActionPlanInputOptionMaster,
                as: 'input_options_master',
                attributes: ['id', 'name', ['name', 'label'], ['name', 'value']]
              }
            ]
          }]

        }
      ],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };

    return patientCarePlanProblemMetricActionPlan.findALL(options)
      .then((data) => {
        data = data.map(act_plan => {
          act_plan.inputs = act_plan.inputs.map(input => {
            if (!input.response) {
              input.response = input.defVal;
            }
            return input;
          });
          return act_plan
        });
        resp.status(200).json(data);
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp);
      });
  },
  saveMetricTarget: (req, resp, next) => {
    const data = req.body;
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientCarePlanProblemMetricTargetService.update(data, {transaction});
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
  saveMetric: (req, resp, next) => {
    const data = req.body;
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientCarePlanProblemMetricService.update(data, {transaction});
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
  saveActionPlanInput: (req, resp, next) => {
    const data = req.body;
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientCarePlanProblemMetricActionPlanInputService.update(data, {transaction});
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
    const data = {
      orgId: body.orgId,
      patientId: body.patientId,
      createdBy: authenticatedUser.id,
      status: 1
    };
    return sequelize.transaction()
      .then((t) => {
        return patientCarePlanService
          .create(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              data: res,
              message: successMessages.CARE_PLAN_CREATEED
            });
          })
          .catch((err) => {
            t.rollback();

            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  publish: (req, resp, next) => {
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
      id: body.carePlanId,
      patientId: body.patientId,
      orgId: body.orgId,
      status: 3
    };
    return sequelize.transaction()
      .then((t) => {
        return patientCarePlanService
          .update(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              data: res,
              message: successMessages.CARE_PLAN_PUBLISHED
            });
          })
          .catch((err) => {
            t.rollback();

            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  addProblem: (req, resp, next) => {
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
    const data = body.careProblems.map(a => {
      return {
        carePlanId: body.carePlanId,
        problemId: a.id,
        patientId: body.patientId,
        createdBy: authenticatedUser.id,
      }
    });
    return sequelize.transaction()
      .then((t) => {
        return patientCarePlanProblemService
          .bulkCreate(data, {transaction: t, individualHooks: true})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              data: res,
              message: successMessages.CARE_PLAN_PROBLEM_CREATEED
            });
          })
          .catch((err) => {
            t.rollback();
            if (err && err.name === 'SequelizeUniqueConstraintError') {
              return resp.status(403).send({
                success: false,
                code: 'CARE_PROBLEM_ALREADY_MAPPED',
                message: errorMessages.CARE_PROBLEM_ALREADY_MAPPED
              });
            }
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  removeProblem: (req, resp, next) => {
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
      id: body.careProblems.map(a => a.id),
      carePlanId: body.carePlanId,
    };
    return sequelize.transaction()
      .then((t) => {
        return patientCarePlanProblemService
          .destroy(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              message: successMessages.CARE_PLAN_PROBLEM_REMOVED
            });
          })
          .catch((err) => {
            t.rollback();
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },

  addProblemMetric: (req, resp, next) => {
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
    const createdBy = authenticatedUser.id;
    let transaction;

    const options = {
      where: {
        id: body.metric_mid,
        status: [1]
      },
      include: [
        {
          model: models.ProblemMetricTargetMaster,
          as: 'master_targets',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status', 'metric_mid']
          }
        },
        {
          model: models.ProblemMetricActionPlanMaster,
          as: 'master_act_plans',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status', 'metric_mid']
          },
          include: [
            {
              model: models.ProblemMetricActionPlanInputMaster,
              as: 'inputs_master',
              attributes: {
                include: ['id', 'defVal']
              }
            }
          ]
        }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
      }
    };
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        return careProblemMetricsService.findOne(options)
      })
      .then((metricData) => {
        if (!metricData) {
          throw new Error('INVALID_INPUT');
        }
        metricData = metricData.get({plain: true});
        const carePlanMatricData = {
          metric_mid: metricData.id,
          cp_prob_id: body.cp_prob_id,
          name: metricData.name,
          goal: metricData.goal,
          frequencyKey: metricData.frequency,
          management: metricData.management,
          createdBy: createdBy,
          targets: [],
          act_plans: []
        };
        metricData.master_targets.forEach(master_target => {
          const target = {
            defVal: master_target.defVal,
            uom: master_target.uom,
            operator: master_target.operator,
            createdBy: createdBy,
            metric_target_mid: master_target.id,
          };
          carePlanMatricData.targets.push(target);
        });
        metricData.master_act_plans.forEach(master_act_plan => {
          let act_plan = {
            title: master_act_plan.title,
            act_plan_mid: master_act_plan.id,
            createdBy: createdBy,
            inputs: []
          };
          act_plan.inputs = master_act_plan.inputs_master.map(inputMaster => {
            return {
              input_mid: inputMaster.id,
              defVal: inputMaster.defVal,
              createdBy: createdBy
            };
          });
          carePlanMatricData.act_plans.push(act_plan);
        });
        return patientCarePlanProblemMetricService.create(carePlanMatricData, {
          transaction: transaction,
          include: [
            {
              model: models.PatientCarePlanProblemMetricTarget,
              as: 'targets'
            },
            {
              model: models.PatientCarePlanProblemMetricActionPlan,
              as: 'act_plans',
              include: [
                {
                  model: models.PatientCarePlanProblemMetricActionPlanInput,
                  as: 'inputs'
                }
              ]
            }
          ]
        })
      }).then((res) => {
        transaction.commit();
        return resp.json({
          success: true,
          data: res,
          message: successMessages.CARE_PLAN_PROBLEM_METRIC_CREATEED
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  saveProblemMetric: (req, resp, next) => {

  },
};

export default operations;
