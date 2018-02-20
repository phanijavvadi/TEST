'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import masterDataCtrl from '../controllers/master.data.ctrl';

const router = express.Router();

export default function (app) {


  router.route('/:key')
    .get([
      masterDataCtrl.getOptions]);

  app.use('/api/admin/private/master-data', router);
  app.use('/api/org-user/private/master-data', router);
}
