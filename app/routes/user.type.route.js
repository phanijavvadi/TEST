'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import userTypeCtrl from '../controllers/user.type.ctrl';

const router = express.Router();

export default function (app) {

  router.route('/get-org-user-type-options').get([
    userTypeCtrl.getOrgUserTypeOptions]);
  router.route('/list').get([
    userTypeCtrl.list]);
  app.use('/api/admin/private/user-type', router);
}
