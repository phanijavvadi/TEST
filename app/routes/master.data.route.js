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

  app.use('/api/admin/private/master-data', router);
  app.use('/api/admin/private/master-data', adminRouter);
  app.use('/api/org-user/private/master-data', router);
}
