'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgUserTypeCtrl from '../controllers/user.type.ctrl';

const router = express.Router();

export default function (app) {

  router.route('/get-options').get([
    orgUserTypeCtrl.getOptions]);
  router.route('/list').get([
    orgUserTypeCtrl.list]);
  app.use('/api/admin/private/org-user-type', router);
}
