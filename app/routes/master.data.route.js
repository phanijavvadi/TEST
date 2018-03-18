'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import masterDataCtrl from '../controllers/master.data.ctrl';
import masterDataValidator from '../validators/master.data.validator';

const router = express.Router();
const adminRouter = express.Router();

export default function (app) {


  router.route('/:key')
    .get([
      masterDataCtrl.getOptions]);

  adminRouter.route('/save')
    .post([
      masterDataValidator.importMasterDataReqValidator,
      masterDataCtrl.importMasterData]);

  router.route('/health-checks/list')
    .get([
      masterDataCtrl.getHealthChecksList]);
router.route('/health-checks/options')
    .get([
      masterDataCtrl.getHealthChecksOptions]);

  router.route('/health-checks/save-health-check')
    .post([
      masterDataValidator.addHealthCheckReqValidator,
      (req, resp,next) => {
        if (req.body.id) {
          masterDataCtrl.updateHealthCheck(req, resp,next);
        } else {
          masterDataCtrl.addHealthCheck(req, resp,next);
        }
      }
    ]);

  app.use('/api/admin/private/master-data', router);
  app.use('/api/admin/private/master-data', adminRouter);
  app.use('/api/org-user/private/master-data', router);
}
