'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import problemsMasterCtrl from '../controllers/problems.master.ctrl';
import problemsMasterValidator from '../validators/problems.master.validator';
import constants from "../util/constants/constants";
import _ from 'lodash';

const router = express.Router();
const adminRouter = express.Router();
const patientRouter = express.Router();

export default function (app) {


  router.route('/options')
    .get([
      problemsMasterCtrl.getOptions]);
  router.route('/list')
    .get([
      problemsMasterCtrl.getProblemsList]);

  router.route('/:problem_mid/metrics')
    .get([
      problemsMasterCtrl.getMetrics]);

  router.route('/:problem_mid/metrics-list')
    .get([
      problemsMasterCtrl.getMetricsList]);
  router.route('/distinct-metrics')
    .get([
      problemsMasterCtrl.getDistinctMetrics]);
  patientRouter.route('/distinct-metrics')
    .get([
      problemsMasterCtrl.getDistinctMetrics])

  router.route('/metric/:metric_mid')
    .get([
      problemsMasterCtrl.getMetric]);

  router.route('/metric/:metric_mid/targets')
    .get([
      problemsMasterCtrl.getMetricTargets]);

  router.route('/create')
    .post([
      problemsMasterValidator.createProblemMasterReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          problemsMasterCtrl.updatePoblemMasterData(req, resp, next)
        } else {

          problemsMasterCtrl.createPoblemMasterData(req, resp, next)
        }
      }]);

  router.route('/metric/create')
    .post([
      problemsMasterValidator.createProblemMetricReqValidator,
      (req, resp, next) => {
        const {authenticatedUser, tokenDecoded} = req.locals;
        const options = {
          where: {id: req.body.problem_mid}
        };
        if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
          options.where.orgId = _.map(authenticatedUser.userRoles, (role) => {
            return role.orgId;
          })
        }
        problemsMasterValidator.isValidProblemId(options, req, resp, next);
      },
      (req, resp, next) => {
        if (req.body.id) {
          problemsMasterCtrl.updateProblemMetric(req, resp, next)
        } else {
          problemsMasterCtrl.createProblemMetric(req, resp, next)
        }
      }]);
  router.route('/metric/target/create')
    .post([
      problemsMasterValidator.createProblemMetricTargetReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          problemsMasterCtrl.updateProblemMetricTarget(req, resp, next)
        } else {
          problemsMasterCtrl.createProblemMetricTarget(req, resp, next)
        }
      }
    ]);


  router.route('/metric/:metric_mid/action-plans')
    .get([
      problemsMasterCtrl.getMetricActionPlans]);

  router.route('/metric/action-plan/create')
    .post([
      problemsMasterValidator.createProblemMetricActionPlanReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          problemsMasterCtrl.updateProblemMetricActionPlan(req, resp, next)
        } else {
          problemsMasterCtrl.createProblemMetricActionPlan(req, resp, next)
        }
      }]);

  router.route('/action-plan/:act_plan_mid/inputs')
    .get([
      problemsMasterCtrl.getMetricActionPlanInputs]);

  router.route('/metric/action-plan/input/create')
    .post([
      problemsMasterValidator.createProblemMetricActionPlanInputReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          problemsMasterCtrl.updateProblemMetricActionPlanInput(req, resp, next)
        } else {
          problemsMasterCtrl.createProblemMetricActionPlanInput(req, resp, next)
        }
      }]);

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
