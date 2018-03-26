'use strict';
import * as _ from 'lodash';
import moment from 'moment';
import models from '../models';
import errorMessages from '../util/constants/error.messages';
import * as commonUtil from '../util/common.util';
import successMessage from "../util/constants/success.messages";
import constants from "../util/constants/constants";

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const operations = {
  create: (req, resp, next) => {
    const body = req.body;
    let {authenticatedUser, tokenDecoded} = req.locals;
    authenticatedUser = authenticatedUser || {};
    const data = {
      comments: body.comments,
      orgId: body.orgId,
      patient_id: body.patient_id,
      provider_id: body.provider_id,
      created_by: authenticatedUser.id,
    };
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.PatientCareTeam.create(data, {transaction});
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessage.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getCareTeamList: (req, resp, next) => {
    const patient_id = req.query.patient_id;
    const orgId = req.query.orgId;
    models.PatientCareTeam.findAll({
      where: {
        orgId: orgId,
        patient_id: patient_id,
      }
    }).then(res => {
      return resp.json({
        success: true,
        message: successMessage.CREATEED_SUCCESS
      });
    }).catch((err) => {
      commonUtil.handleException(err, req, resp, next);
    });
  },
  remove: (req, resp, next) => {
    const body = req.body;
    let transaction;
    const data = {
      where: {
        orgId: body.orgId,
        id: body.orgId,
        patient_id: body.patient_id,
      }
    };
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return models.PatientCareTeam.destroy(data, {transaction});
      })
      .then(res => {
        transaction.commit();
        return resp.json({
          success: true,
          message: successMessage.REMOVED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });

  },
};

export default operations;
