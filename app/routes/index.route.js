'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import AdminCtrl from '../controllers/admin.ctrl';
import adminValidator from '../validators/admin.validator';
import userJwtValidator from '../validators/user.jwt.validator';

const router = express.Router();

export default function (app) {

  router.route('/login').post([adminValidator.loginReqValidator, AdminCtrl.login]);
  // router.route('/private/create').post([adminValidator.createReqValidator, adminValidator.uniqueUserNameValidator, AdminCtrl.create]);
  app.use('/api', (req, resp, next) => {
    req.locals = req.locals || {};
    next();
  });
  app.use('/api/admin', router);
  app.use('/api/admin/private', userJwtValidator.validateAdminJwtToken);
  app.use('/api/org-user/private', userJwtValidator.validateOrgUserJwtToken);

}
