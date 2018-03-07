'use strict';
import express from 'express';
import patientClinicalDataValidator from '../validators/patient.clinical.data.validator';
import patientValidator from '../validators/patient.validator';
import problemsMasterValidator from '../validators/problems.master.validator';
import patientClinicalMetricDataCtrl from '../controllers/patient.clinical.metrics.data.ctrl';

const router = express.Router();
const patientRouter = express.Router();

export default function (app) {


  router.route('/save')
    .post([
      patientClinicalDataValidator.saveClinicalMetricReqValidator,
      (req, resp, next) => {
        patientValidator.isValidPatientId({
          attributes: ['id'],
          where: {
            id: req.body.patient_id,
            orgId: req.body.orgId,
            status: 1
          }
        }, req, resp, next);
      },
      (req, resp, next) => {
        problemsMasterValidator.isValidProblemMetric({
          where: {
            type: req.body.metric_type,
            status: 1
          }
        }, req, resp, next)
      },
      patientClinicalMetricDataCtrl.saveClinicalMetricData]);


  patientRouter.route('/save')
    .post([
      patientClinicalDataValidator.saveClinicalMetricReqValidator,
      (req, resp, next) => {
        patientValidator.isValidPatientId({
          attributes: ['id'],
          where: {
            id: req.body.patient_id,
            orgId: req.body.orgId,
            status: 1
          }
        }, req, resp, next);
      },
      (req, resp, next) => {
        problemsMasterValidator.isValidProblemMetric({
          where: {
            type: req.body.metric_type,
            status: 1
          }
        }, req, resp, next)
      },
      patientClinicalMetricDataCtrl.saveClinicalMetricData]);

  router.route('/:patient_id/:metric_type')
    .get([patientClinicalMetricDataCtrl.getClinicalMetricData]);
  patientRouter.route('/:patient_id/:metric_type')
    .get([patientClinicalMetricDataCtrl.getClinicalMetricData]);

  router.route('/:patient_id')
    .get([patientClinicalMetricDataCtrl.getClinicalData]);
  patientRouter.route('/:patient_id')
    .get([patientClinicalMetricDataCtrl.getClinicalData]);
  app.use('/api/org-user/private/clinical-data', router);
  app.use('/api/patient/private/clinical-data', patientRouter);
}
