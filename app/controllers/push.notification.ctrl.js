'use strict';
import * as _ from 'lodash';
import models from '../models';
import * as commonUtil from '../util/common.util';
import successMessages from '../util/constants/success.messages';
import * as patientDeviceService from '../services/patient.device.service';
import * as config from '../../config/config';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;

const axios = require("axios");
import * as fs from 'fs';
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

    const options = {
      orgId: body.orgId,
      patient_id: body.patientId,
    };
    let transaction;
    patientDeviceService.findAll(options)
      .then(devices => {
        const push_notifications = [];
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
            push_notifications.push(apnsClient.send(bn));
          } else if (device.platform.toLowerCase() === 'android') {
            push_notifications.push(axios({
              method: 'post',
              url: config.FCM_HOST,
              headers: {
                "Authorization": "key=" + config.FCM_PRIVATE_KEY,
                "Content-Type": "application/json"
              },
              data: {
                "to": device.registration_id,
                "collapse_key": "type_a",
                "notification": {
                  "body": body.message,
                  // "title": "Collapsing A"
                },
                "data": {
                  "body": body.message,
                }
              }
            }));
          }
        });
        return Promise.all(push_notifications);
      })
      .then(res => {
        return resp.json({
          success: true,
          message: successMessages.CREATEED_SUCCESS
        });
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });

  },
};

export default operations;
