'use strict';
import * as _ from 'lodash';
import * as ejs from 'ejs';
import * as fs from 'fs';
import * as htmlToText from 'html-to-text';
import moment from 'moment';
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
import logger from "../util/logger";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const cp_problem_metrics_include_options = {
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
};
const cp_problems_include_options = [{
  model: models.PatientCarePlanProblems,
  as: 'cp_problems',
  attributes: {
    exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
  },
  include: [
    {
      ...cp_problem_metrics_include_options
    },
    {
      model: models.ProblemsMaster,
      as: 'problem_master',
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'status', 'id']
      },
    }
  ]
}];

const metrics_master_include_options = [
  {
    model: models.ProblemMetricTargetMaster,
    as: 'master_targets',
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status', 'metric_mid']
    }
  },
  {
    model: models.ProblemMetricActionPlanMaster,
    as: 'master_act_plans',
    attributes: {
      exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status', 'metric_mid']
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
  }];

const operations = {
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
      patient_id: body.patient_id,
      created_by: authenticatedUser.id,
      status: 1
    };
    let transaction;
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientCarePlanService
          .create(data, {transaction: transaction})
      })
      .then((res) => {
        transaction.commit();
        return resp.json({
          success: true,
          data: res,
          message: successMessages.CARE_PLAN_CREATEED
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
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
      id: body.cp_id,
      patient_id: body.patient_id,
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
    const created_by = authenticatedUser.id;

    let transaction;
    const cp_problems = [];
    const cp_problems_index = {};
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        const que = [];
        body.problems_master.forEach((problem_master, index) => {
          const cp_problem = {
            cp_id: body.cp_id,
            problem_mid: problem_master.id,
            patient_id: body.patient_id,
            created_by: created_by,
            metrics: []
          };
          cp_problems.push(cp_problem);
          cp_problems_index[problem_master.id] = index;

          const options = {
            where: {
              problem_mid: problem_master.id,
              status: [1]
            },
            include: metrics_master_include_options,
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status']
            }
          };
          que.push(careProblemMetricsService.findAll(options));
        });
        return Promise.all(que);
      })
      .spread((metricsMasterData) => {
        if (metricsMasterData) {
          metricsMasterData.forEach(metric_master => {
            const carePlanMatricData = {
              metric_mid: metric_master.id,
              name: metric_master.name,
              type: metric_master.type,
              goal: metric_master.goal,
              frequencyKey: metric_master.frequency,
              management: metric_master.management,
              created_by: created_by,
              targets: [],
              act_plans: []
            };
            if (metric_master.master_targets) {
              metric_master.master_targets.forEach(master_target => {
                const target = {
                  defVal: master_target.defVal,
                  response: master_target.defVal,
                  uom: master_target.uom,
                  operator: master_target.operator,
                  created_by: created_by,
                  metric_target_mid: master_target.id,
                };
                carePlanMatricData.targets.push(target);
              });
            }
            if (metric_master.master_act_plans) {
              metric_master.master_act_plans.forEach(master_act_plan => {
                let act_plan = {
                  title: master_act_plan.title,
                  act_plan_mid: master_act_plan.id,
                  created_by: created_by,
                  inputs: []
                };
                act_plan.inputs = master_act_plan.inputs_master.map(inputMaster => {
                  return {
                    input_mid: inputMaster.id,
                    defVal: inputMaster.defVal,
                    response: inputMaster.defVal,
                    created_by: created_by
                  };
                });
                carePlanMatricData.act_plans.push(act_plan);
              });
            }
            cp_problems[cp_problems_index[metric_master.problem_mid]].metrics.push(carePlanMatricData);
          });
        }
        const cp_problems_que = [];
        cp_problems.forEach(cp_problem => {
          cp_problems_que.push(patientCarePlanProblemService.create(cp_problem, {
            transaction: transaction,
            include: [{
              model: models.PatientCarePlanProblemMetric,
              as: 'metrics',
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
            }]
          }));
        });
        return Promise.all(cp_problems_que);
      })
      .then((cp_problems) => {
        transaction.commit();
        const options = {
          where: {
            id: cp_problems.map(a => a.id)
          }
        };
        return patientCarePlanProblemService.getAll(options);
      })
      .then(resultObj => {
        if (resultObj) {
          resultObj = resultObj.map((cp_problem, i) => {
            cp_problem.metrics = cp_problem.metrics.map(metric => {
              metric.targets = metric.targets.map(target => {
                if (!target.response) {
                  target.response = target.defVal;
                }
                return target;
              });
              return metric;
            });
            return cp_problem;
          });
        }
        return resp.json({
          success: true,
          data: resultObj,
          message: successMessages.CARE_PLAN_PROBLEM_CREATEED
        });
      })
      .catch(Sequelize.ValidationError, function (err) {
        let message = 'UNKNOWN_ERROR';
        logger.info(err);
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'CARE_PROBLEM_ALREADY_MAPPED') {
          message = 'CARE_PROBLEM_ALREADY_MAPPED';
        }
        throw new Error(message);
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
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
      id: body.cp_problems.map(a => a.id),
      cp_id: body.cp_id,
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
    const created_by = authenticatedUser.id;
    let transaction;

    const options = {
      where: {
        id: body.metric_mid,
        status: [1]
      },
      include: metrics_master_include_options,
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by', 'status']
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
          type: metricData.type,
          goal: metricData.goal,
          frequencyKey: metricData.frequency,
          management: metricData.management,
          created_by: created_by,
          targets: [],
          act_plans: []
        };
        metricData.master_targets.forEach(master_target => {
          const target = {
            defVal: master_target.defVal,
            response: master_target.defVal,
            uom: master_target.uom,
            operator: master_target.operator,
            created_by: created_by,
            metric_target_mid: master_target.id,
          };
          carePlanMatricData.targets.push(target);
        });
        metricData.master_act_plans.forEach(master_act_plan => {
          let act_plan = {
            title: master_act_plan.title,
            act_plan_mid: master_act_plan.id,
            created_by: created_by,
            inputs: []
          };
          act_plan.inputs = master_act_plan.inputs_master.map(inputMaster => {
            return {
              input_mid: inputMaster.id,
              defVal: inputMaster.defVal,
              response: inputMaster.defVal,
              created_by: created_by
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
      })
      .then((res) => {
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
  removeProblemMetric: (req, resp, next) => {
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
      id: body.metric_id,
      cp_prob_id: body.cp_prob_id,
    };
    return sequelize.transaction()
      .then((t) => {
        return patientCarePlanProblemMetricService
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

  cloneCarePlan: (req, resp) => {
    const body = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const created_by = authenticatedUser.id;
    const options = {
      where: {
        id: body.cp_id,
        status: [3]
      },
      include: [{
        model: models.PatientCarePlanProblems,
        as: 'cp_problems',
        attributes: ['problem_mid'],
        include: [
          {
            model: models.PatientCarePlanProblemMetric,
            as: 'metrics',
            attributes: ['name', 'type', 'goal', 'management', 'frequency', 'frequencyKey', 'metric_mid'],
            include: [
              {
                model: models.PatientCarePlanProblemMetricTarget,
                as: 'targets',
                attributes: ['defVal', 'operator', 'uom', 'response', 'metric_target_mid'],
              },
              {
                model: models.PatientCarePlanProblemMetricActionPlan,
                as: 'act_plans',
                attributes: ['title', 'act_plan_mid'],
                include: [
                  {
                    model: models.PatientCarePlanProblemMetricActionPlanInput,
                    as: 'inputs',
                    attributes: ['defVal', 'response', 'input_mid'],
                  }
                ]
              }
            ]
          }
        ]
      }],
      attributes: ['patient_id', 'orgId']
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


    let transaction;
    return sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientCarePlanService.findOne(options)
      })
      .then((data) => {
        if (data) {
          const resultObj = data.get({plain: true});
          resultObj.cloned_from = body.cp_id;
          resultObj.created_by = created_by;
          resultObj.status = 1;
          resultObj.cp_problems = (resultObj.cp_problems || []).map(cp_problem => {
            cp_problem.created_by = created_by;
            cp_problem.metrics = (cp_problem.metrics || []).map(metric => {
              metric.created_by = created_by;
              metric.targets = (metric.targets || []).map(target => {
                target.created_by = created_by;
                return target;
              });
              metric.act_plans = (metric.act_plans || []).map(act_plan => {
                act_plan.created_by = created_by;
                act_plan.inputs = (act_plan.inputs || []).map(input => {
                  input.created_by = created_by;
                  return input;
                });
                return act_plan;
              });
              return metric;
            });

            return cp_problem;
          });
          return Promise.all([
            patientCarePlanService.update({
              id: body.cp_id,
              status: 2
            }, {transaction: transaction}),
            patientCarePlanService.create(resultObj, {
              transaction: transaction,
              include: [{
                model: models.PatientCarePlanProblems,
                as: 'cp_problems',
                include: [
                  {
                    model: models.PatientCarePlanProblemMetric,
                    as: 'metrics',
                    include: [
                      {
                        model: models.PatientCarePlanProblemMetricTarget,
                        as: 'targets',
                      },
                      {
                        model: models.PatientCarePlanProblemMetricActionPlan,
                        as: 'act_plans',
                        include: [
                          {
                            model: models.PatientCarePlanProblemMetricActionPlanInput,
                            as: 'inputs',
                          }
                        ]
                      }
                    ]
                  }
                ]
              }]
            })
          ]);
        } else {
          throw new Error('INVALID_INPUT');
        }
      })
      .then((res) => {
        transaction.commit();
        return resp.json({
          success: true,
          data: res,
          message: successMessages.CARE_PLAN_CREATEED
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp);
      });
  },
  downloadCarePlan: (req, resp) => {
    const body = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const created_by = authenticatedUser.id;
    const options = {
      where: {
        id: body.cp_id,
      },
      include: [{
        model: models.PatientCarePlanProblems,
        as: 'cp_problems',
        attributes: ['problem_mid'],
        include: [
          {
            model: models.ProblemsMaster,
            as: 'problem_master',
            attributes: ['name', 'description'],
          },
          {
            model: models.PatientCarePlanProblemMetric,
            as: 'metrics',
            attributes: ['name', 'type', 'goal', 'management', 'frequency', 'frequencyKey'],
            include: [
              {
                model: models.PatientCarePlanProblemMetricTarget,
                as: 'targets',
                attributes: ['defVal', 'operator', 'uom', 'response'],
              },
              {
                model: models.PatientCarePlanProblemMetricActionPlan,
                as: 'act_plans',
                attributes: ['title', 'act_plan_mid'],
                include: [
                  {
                    model: models.PatientCarePlanProblemMetricActionPlanInput,
                    as: 'inputs',
                    attributes: ['defVal', 'response', 'input_mid'],
                    include: [{
                      model: models.ProblemMetricActionPlanInputMaster,
                      as: 'input_master',
                      attributes: ['label']
                    }]
                  }
                ]
              }
            ]
          }
        ]
      }, {
        model: models.User,
        attributes: ['firstName', 'lastName', 'id'],
        as: 'createdBy'
      }, {
        model: models.Patient,
        attributes: ['firstName', 'surName', 'patientNumber', 'mobileNo', 'email'],
        as: 'patient'
      }],
      attributes: ['createdAt', 'updatedAt']
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


    let transaction, filename;
    return patientCarePlanService.findOne(options)
      .then((data) => {
        if (data) {
          const resultObj = data.get({plain: true});
          filename = resultObj.patient.firstName + '_' + resultObj.patient.surName + '_' + resultObj.patient.patientNumber + '_careplan.txt';
          resultObj.createdOn = moment(resultObj.createdAt, 'YYYY-MM-DD HH:ss').format('DD,MMM YYYY @hh:ss A');

          let html = fs.readFileSync(__dirname + '/../templates/care-plan-tmpl.html', 'utf8');
          html = ejs.render(html, {
            carePlan: resultObj
          });
          return htmlToText.fromString(html);
        } else {
          throw new Error('INVALID_INPUT');
        }
      })
      .then((content) => {
        resp.setHeader('Content-disposition', 'attachment; filename=' + filename);
        resp.setHeader('Content-type', 'text/plain');
        resp.setHeader('filename', filename);
        resp.setHeader('Access-Control-Expose-Headers', 'filename');
        resp.charset = 'UTF-8';
        resp.write(content);
        resp.end();
        /*return resp.json({
          success: true,
          data: res,
          message: successMessages.CARE_PLAN_CREATEED
        });*/
      })
      .catch((err) => {
        // transaction.rollback();
        commonUtil.handleException(err, req, resp);
      });
  },
  get: (req, resp) => {
    const patient_id = req.params.patientId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        patient_id: patient_id,
        status: [1, 3]
      },
      include: [...cp_problems_include_options, {
        model: models.User,
        attributes: ['firstName', 'lastName', 'id'],
        as: 'createdBy'
      }],
      attributes: {
        include:[['cloned_from', 'prev_cp_id']],
        exclude: ['deletedAt']
      }
    };
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
      options.where['status'] = 3;
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
          if (resultObj.cp_problems) {
            resultObj.cp_problems = resultObj.cp_problems.map((cp_problem, i) => {
              cp_problem.metrics = cp_problem.metrics.map(metric => {
                metric.targets = metric.targets.map(target => {
                  if (!target.response) {
                    target.response = target.defVal;
                  }
                  return target;
                });
                return metric;
              });
              return cp_problem;
            });
          }
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
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
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

  }
};

export default operations;
