'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import patientPreventiveHealthCtrl from '../controllers/patient.preventive.health.ctrl';
import patientPreventiveHealthValidator from '../validators/patient.prventive.health.validator';
import cors from 'cors';

const router = express.Router();
const patientRouter = express.Router();

export default function (app) {

  router.route('/:patientId')
    .get([
      patientPreventiveHealthCtrl.get]);


  patientRouter.route('/:patientId')
    .get([
      patientPreventiveHealthCtrl.get]);

  router.route('/create')
    .post([
      patientPreventiveHealthValidator.createReqValidator,
      patientPreventiveHealthCtrl.create]);

  router.route('/add-activity')
    .post([
      patientPreventiveHealthValidator.addPhActReqValidator,
      patientPreventiveHealthCtrl.addActivity]);

  router.route('/remove-activity')
    .delete([
      patientPreventiveHealthValidator.removePhActReqValidator,
      patientPreventiveHealthCtrl.removeActivity]);

  router.route('/add-act-metric')
    .post([
      patientPreventiveHealthValidator.addPhActMetricReqValidator,
      (req, resp, next) => {
        patientPreventiveHealthValidator.isValidPhActId(req.body.ph_act_id, req, resp, next)
      },
      patientPreventiveHealthCtrl.addPhActMetric]);
  router.route('/save-metric')
    .post([
      patientPreventiveHealthValidator.saveMetricReqValidator,
      patientPreventiveHealthCtrl.saveMetric]);

  router.route('/remove-act-metric')
    .delete([
      patientPreventiveHealthValidator.removePhActMetricReqValidator,
      (req, resp, next) => {
        patientPreventiveHealthValidator.isValidPhActId(req.body.ph_act_id, req, resp, next)
      },
      patientPreventiveHealthCtrl.removePhActMetric]);

  app.use('/api/org-user/private/preventive-health', router);
  app.use('/api/patient/private/preventive-health', patientRouter);
}
