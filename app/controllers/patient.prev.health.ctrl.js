'use strict';
import * as _ from 'lodash';
import models from '../models';
import errorMessages from '../util/constants/error.messages';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import * as patientPrevHealthService from '../services/patient.prev.health.service';
import * as patientPrevHealthProblemService from '../services/patient.prev.health.problems.service';
import constants from '../util/constants/constants';

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
        status: 1
      },
      include: [{
        model: models.PreventativeHealthProblems,
        as: 'prevHealthProblems'
      }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt']
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
    return patientPrevHealthService.findOne(options)
      .then((data) => {
        if (data) {
          const resultObj = data.get({plain: true});
          resp.status(200).json(resultObj);
        } else {
          resp.status(200).send({});
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp);
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
        return patientPrevHealthService
          .create(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              data: res,
              message: successMessages.PREV_HEALTH_CREATEED
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
        prevHealthId: body.prevHealthId,
        careProblemId: a.id,
        patientId: body.patientId,
        createdBy: authenticatedUser.id,
      }
    });
    return sequelize.transaction()
      .then((t) => {
        return patientPrevHealthProblemService
          .bulkCreate(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              data: res,
              message: successMessages.ORG_CREATED
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
      prevHealthId: body.prevHealthId,
    };
    return sequelize.transaction()
      .then((t) => {
        return patientPrevHealthProblemService
          .destroy(data, {transaction: t})
          .then((res) => {
            t.commit();
            return resp.json({
              success: true,
              message: successMessages.PREV_HEALTH_PROBLEM_REMOVED
            });
          })
          .catch((err) => {
            t.rollback();
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
};

export default operations;
