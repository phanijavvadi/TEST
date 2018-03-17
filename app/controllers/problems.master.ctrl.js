'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as problemsMasterService from '../services/problem.master.service';
import * as problemMetricsMasterService from '../services/problem.metrics.master.service';
import models from '../models';
import successMessage from "../util/constants/success.messages";
import constants from "../util/constants/constants";
import errorMessages from "../util/constants/error.messages";
import _ from 'lodash';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getProblemsList: (req, resp, next) => {
    const options = {
      ...req.query,
      where: {
        status: 1
      }
    };
    if (req.query.searchText) {
      options.where = {
        [Op.or]: [{name: {[Op.iLike]: `%${req.query.searchText}%`}},
          {phoneNo: {[Op.iLike]: `%${req.query.searchText}%`}}]
      }
    }
    if (req.query.status) {
      options.where.status = +req.query.status;
    }

    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      options.orgId = [...userOrgIds, null];
    }
    return problemsMasterService
      .findAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getOptions: (req, resp, next) => {
    const options = {
      ...req.query,
      where: {
        status: 1
      }
    };
    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      options.orgId = [...userOrgIds, null];
    }
    return problemsMasterService
      .getOptions(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },

  createProblemMetric: (req, resp, next) => {
    const body = req.body;
    const data = {
      problem_mid: body.problem_mid,
      name: body.name,
      type: body.type,
      goal: body.goal,
      management: body.management,
      status: body.status,
      frequency: 'PROBLEM_METRIC_FREQUENCY'
    };
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.ProblemMetricsMaster.create(data, {
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateProblemMetric: (req, resp, next) => {
    const body = req.body;
    const data = {
      problem_mid: body.problem_mid,
      name: body.name,
      type: body.type,
      goal: body.goal,
      management: body.management,
      status: body.status,
    };
    const {authenticatedUser, tokenDecoded} = req.locals;
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.ProblemMetricsMaster.findById(body.id);
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetricsList: (req, resp, next) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    const problem_mid = req.params.problem_mid;
    const options = {
      where: {
        problem_mid
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    return problemMetricsMasterService
      .findAndCountAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetrics: (req, resp, next) => {
    const {authenticatedUser, tokenDecoded} = req.locals;
    const problem_mid = req.params.problem_mid;
    const options = {
      where: {
        status: [1],
        problem_mid
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
  getDistinctMetrics: (req, resp, next) => {
    const options = {
      where: {
        status: [1]
      },
      include: [
        {
          model: models.ProblemMetricTargetMaster,
          as: 'master_targets',
          attributes: ['operator', 'defVal', 'uom']
        }
      ],
      attributes: [Sequelize.literal('DISTINCT ON(type) 1'), 'id', 'name', 'goal', 'management', 'type']
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


  createProblemMetricTarget: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      metric_mid: body.metric_mid,
      operator: body.operator,
      defVal: body.defVal,
      status: body.status,
      uom: body.uom,
      createdBy

    };
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.ProblemMetricTargetMaster.create(data, {
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateProblemMetricTarget: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const data = {
      metric_mid: body.metric_mid,
      operator: body.operator,
      defVal: body.defVal,
      status: body.status,
      uom: body.uom

    };
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.ProblemMetricTargetMaster.findById(body.id)
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetricTargets: (req, resp, next) => {
    const metric_mid = req.params.metric_mid;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        metric_mid: metric_mid,
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    return models.ProblemMetricTargetMaster
      .findAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },

  createProblemMetricActionPlan: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      metric_mid: body.metric_mid,
      title: body.title,
      status: body.status,
      createdBy
    };
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.ProblemMetricActionPlanMaster.create(data, {
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateProblemMetricActionPlan: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      metric_mid: body.metric_mid,
      title: body.title,
      status: body.status,
    };
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return models.ProblemMetricActionPlanMaster.findById(body.id)
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetricActionPlans: (req, resp, next) => {
    const metric_mid = req.params.metric_mid;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        metric_mid: metric_mid
      },
      include: [{
        model: models.ProblemMetricActionPlanInputMaster,
        as: 'inputs_master',
        include: [{
          model: models.MasterData,
          as: 'input_type_master'
        }, {
          model: models.ProblemMetricActionPlanInputOptionMaster,
          as: 'input_options_master'
        }]
      }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    return models.ProblemMetricActionPlanMaster
      .findAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },

  createProblemMetricActionPlanInput: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      act_plan_mid: body.act_plan_mid,
      label: body.label,
      defVal: body.defVal,
      input_type_mid: body.input_type_mid,
      status: body.status,
      createdBy
    };
    if (body.input_options_master) {
      data.input_options_master = (body.input_options_master || []).map(a => {
        a.createdBy = createdBy;
        return a;
      })
    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.ProblemMetricActionPlanInputMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true,
          include: [{
            model: models.ProblemMetricActionPlanInputOptionMaster,
            as: 'input_options_master'
          }]
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  updateProblemMetricActionPlanInput: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser} = req.locals;
    const createdBy = authenticatedUser.id;
    const data = {
      act_plan_mid: body.act_plan_mid,
      label: body.label,
      defVal: body.defVal,
      input_type_mid: body.input_type_mid,
      status: body.status,
      createdBy
    };
    if (body.input_options_master) {
      data.input_options_master = (body.input_options_master || []).map(a => {
        a.createdBy = createdBy;
        return a;
      })
    }
    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.createdBy = authenticatedUser.id;
        return models.ProblemMetricActionPlanInputMaster.create(data, {
          transaction: transactionRef,
          individualHooks: true,
          include: [{
            model: models.ProblemMetricActionPlanInputOptionMaster,
            as: 'input_options_master'
          }]
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetricActionPlanInputs: (req, resp, next) => {
    const act_plan_mid = req.params.act_plan_mid;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        act_plan_mid: act_plan_mid,
      },
      include: [{
        model: models.MasterData,
        as: 'input_type_master',
        attributes: ['name', 'value']
      }, {
        model: models.ProblemMetricActionPlanInputOptionMaster,
        as: 'input_options_master',
        required: false,
        attributes: ['name', 'id']
      }],
      attributes: ['id', 'act_plan_mid', 'defVal', 'label']
    };
    return models.ProblemMetricActionPlanInputMaster
      .findAll(options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },

  getMetric: (req, resp, next) => {
    const metric_mid = req.params.metric_mid;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        id: metric_mid,
        status: [1]
      },
      include: [
        {
          model: models.ProblemMetricTargetMaster,
          as: 'targets',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
          }
        },
        {
          model: models.CareProblemMetricActionPlan,
          as: 'actionPlans',
          attributes: {
            exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
          },
          include: [
            {
              model: models.ProblemMetricActionPlanInputMaster,
              as: 'inputs_master',
              attributes: {
                exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
              },
              include: [
                {
                  model: models.ProblemMetricActionPlanInputOptionMaster,
                  as: 'input_options_master',
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


  createPoblemMasterData: (req, resp, next) => {
    const body = req.body;
    const data = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;

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
        return models.ProblemsMaster.create(data, {
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
      .catch((err) => {
        transactionRef.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  savePoblemsMasterData: (req, resp, next) => {
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
        let message = 'UNKNOWN_ERROR';
        if (err && err.errors &&
          err.errors.length > 0 &&
          err.errors[0].message === 'METRIC_TYPE_EXIST') {
          message = 'Metric type ' + err.errors[0].value + ' already exist';
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
