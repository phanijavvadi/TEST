'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import AdminCtrl from '../controllers/admin.ctrl';
import adminValidator from '../validators/admin.validator';
import adminJwtValidator from '../validators/admin.jwt.validator';
const router = express.Router();

export default function(app) {

  router.route('/login').post([adminValidator.loginReqValidator, AdminCtrl.login]);
  router.route('/create').post([adminJwtValidator.validateJwtToken, adminValidator.createReqValidator, adminValidator.uniqueUserNameValidator, AdminCtrl.create]);
	app.use('/api/admin', router);
}
