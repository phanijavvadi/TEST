'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import userTypeCtrl from '../controllers/user.type.ctrl';

import userTypeValidator from '../validators/user.type.validator';

const router = express.Router();
const publicRouter = express.Router();

export default function (app) {

  publicRouter.route('/get-org-user-type-options').get([
    userTypeCtrl.getOrgUserTypeOptions]);

  router.route('/org-list').get([
    userTypeCtrl.getOrgTypeslist]);

  router.route('/org-user-categories').get([
    userTypeCtrl.getOrgUserCategories]);

  router.route('/create')
    .post([
      userTypeValidator.createReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          userTypeCtrl.update(req, resp, next);
        } else {
          userTypeCtrl.create(req, resp, next);
        }
      }]);

  app.use('/api/admin/private/user-type', router);
  app.use('/api/admin/public/user-type', publicRouter);
  app.use('/api/org-user/public/user-type', publicRouter);
}
