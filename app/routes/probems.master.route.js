'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import problemsMasterCtrl from '../controllers/problems.master.ctrl';
import problemsMasterValidator from '../validators/problems.master.validator';

const router = express.Router();
const adminRouter = express.Router();
const patientRouter = express.Router();

export default function (app) {


  router.route('/options')
    .get([
      problemsMasterCtrl.getOptions]);

  router.route('/:problem_mid/metrics')
    .get([
      problemsMasterCtrl.getMetrics]);

  router.route('/distinct-metrics')
    .get([
      problemsMasterCtrl.getDistinctMetrics]);
  patientRouter.route('/distinct-metrics')
    .get([
      problemsMasterCtrl.getDistinctMetrics])

  router.route('/metric/:metricId')
    .get([
      problemsMasterCtrl.getMetric]);

  adminRouter.route('/save-metrics')
    .post([
      problemsMasterValidator.saveMetricsMasterDataReqValidator,
      problemsMasterCtrl.saveMetricsMasterData]);

  adminRouter.route('/save-problems')
    .post([
      problemsMasterValidator.savePoblemsMasterDataReqValidator,
      problemsMasterCtrl.savePoblemsMasterData]);

  app.use('/api/admin/private/care-problems', router);
  app.use('/api/admin/private/care-problems', adminRouter);
  app.use('/api/org-user/private/care-problems', router);


  app.use('/api/patient/private/care-problems', patientRouter)
}
