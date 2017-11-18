'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgUserTypeCtrl from '../controllers/org.user.type.ctrl';

const router = express.Router();

export default function (app) {

  router.route('/get-options').get([
    orgUserTypeCtrl.getOptions]);
  app.use('/api/admin/private/org-user-type', router);
}
