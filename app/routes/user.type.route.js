'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import userTypeCtrl from '../controllers/user.type.ctrl';

const router = express.Router();
const publicRouter = express.Router();

export default function (app) {

  publicRouter.route('/get-org-user-type-options').get([
    userTypeCtrl.getOrgUserTypeOptions]);

  router.route('/org-list').get([
    userTypeCtrl.getOrgTypeslist]);

  app.use('/api/admin/private/user-type', router);
  app.use('/api/admin/public/user-type', publicRouter);
  app.use('/api/org-user/public/user-type', publicRouter);
}
