'use strict';
import * as _ from 'lodash';
import models from '../models';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import * as patientDeviceService from '../services/patient.device.service';
import * as patientNotificationService from '../services/patient.notification';
import * as config from '../../config/config';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import moment from 'moment';

const axios = require("axios");
import * as fs from 'fs';
import constants from "../util/constants/constants";
import errorMessages from "../util/constants/error.messages";

const path = require('path');
const APNS = require('apns2');
const {BasicNotification} = APNS;

const operations = {
  registerDevice: (req, resp, next) => {
    const data = req.body;
    let transaction;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientDeviceService.destroy({
          registration_id: data.registration_id,
        }, {transaction});
      })
      .then(() => {
        return patientDeviceService.create(data, {transaction});
      })
      .then(data => {
        transaction.commit();
        return resp.json({
          success: true,
          data,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        transaction.rollback();
        commonUtil.handleException(err, req, resp, next);
      });

  },

  sendInAppMessage: (req, resp, next) => {
    const body = req.body;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      orgId: body.orgId,
      patient_id: body.patientId,
      createdBy:authenticatedUser.id
    };
    let transaction;
    let devices;
    sequelize.transaction()
      .then((t) => {
        transaction = t;
        return patientDeviceService.findAll(options);
      })
      .then(data => {
        devices = data;
        if (devices && devices.length === 0) {
          throw new Error('NO_DEVICES_FOUND');
        }
        return patientNotificationService.create({
          patient_id: body.patient_id,
          message: body.message,
          type: 'IN_APP_MESSAGE'
        }, {transaction});
      })
      .then(() => {
        let apnsClient = new APNS({
          host: config.APNS_HOST,
          team: config.APNS_TEAM_ID,
          keyId: config.APNS_KEY_ID,
          signingKey: fs.readFileSync(path.resolve('./config/AuthKey_QB29S98VZG.p8')),
          defaultTopic: config.APNS_DEFAULT_TOPIC
        });
        (devices || []).forEach(device => {
          if (device.platform.toLowerCase() === 'ios') {
            let bn = new BasicNotification(device.registration_id, body.message, {
              sound: "ping.aiff",
              data: {
                userId: '12345'
              }
            });
            apnsClient.send(bn).then();
          } else if (device.platform.toLowerCase() === 'android') {
            axios({
              method: 'post',
              url: config.FCM_HOST,
              headers: {
                "Authorization": "key=" + config.FCM_PRIVATE_KEY,
                "Content-Type": "application/json"
              },
              data: {
                "to": device.registration_id,
                "collapse_key": "type_a",
                "data": {
                  "body": body.message,
                  "title": authenticatedUser.firstName + authenticatedUser.lastName
                }
              }
            }).then((response) => {
            })
          }
        });
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
  getMessages: (req, resp, next) => {
    const queryParams = req.query;
    const {authenticatedUser, tokenDecoded} = req.locals;
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      if (queryParams.patient_id !== tokenDecoded.id) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_INPUT});
      }
    }
    else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }

    models.PatientNotification.findAndCountAll({
      where: {patient_id: queryParams.patient_id},
      limit: Number(queryParams.limit || 25),
      offset: Number(queryParams.limit || 0),
      attributes: ['id', 'message', 'createdAt'],
      order: [['updatedAt', 'DESC']],
      raw: true
    })
      .then(data => {
        data.rows = data.rows.map(a => {
          a.createdAt = moment(a.createdAt).format('YYYY-MM-DD HH:ss');
          return a;
        });
        return resp.json(data);
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });

  },
};

export default operations;
