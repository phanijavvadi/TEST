'use strict';
import express from 'express';
import patientValidator from '../validators/patient.validator';
import pushNotificationValidator from '../validators/push.notificatoin.validator';
import * as patientDeviceService from '../services/patient.device.service';
import pushNotificationCtrl from '../controllers/push.notification.ctrl';
import commonUtil from "../util/common.util";

const router = express.Router();
const patientRouter = express.Router();

export default function (app) {


  patientRouter.route('/register-device')
    .post([
      pushNotificationValidator.registerDeviceReqValidator,
      (req, resp, next) => {
        patientValidator.isValidPatientId({
          id: req.body.patient_id,
          orgId: req.body.orgId
        }, req, resp, next);
      },
      (req, resp, next) => {
        patientDeviceService.findOne({
          attributes: ['id', 'registration_id'],
          where: {
            patient_id: req.body.patient_id,
            registration_id: req.body.registration_id
          }
        }).then(data => {
          if (data) {
            return resp.status(200).json(data);
          } else {
            next();
          }
        }).catch(err => {
          commonUtil.handleException(err, req, resp);
        });
      },
      pushNotificationCtrl.registerDevice]);
  router.route('/in-app-message')
    .post([
      pushNotificationValidator.inAppMessageReqValidator,
      (req, resp, next) => {
        patientValidator.isValidPatientId({
          id: req.body.patient_id,
          orgId: req.body.orgId
        }, req, resp, next);
      },
      pushNotificationCtrl.sendInAppMessage]);

  app.use('/api/org-user/private/notification', router);
  app.use('/api/patient/private/notification', patientRouter);
}
