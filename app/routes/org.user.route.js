'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgUserCtrl from '../controllers/org.user.ctrl';
import orgUserValidator from '../validators/org.user.validator';
import orgUserTypeValidator from '../validators/org.user.type.validator';
import orgValidator from '../validators/organisation.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/list').get([
    orgUserCtrl.list]);
  router.route('/:id').get([
    orgUserCtrl.get]);
  router.route('/create').post([
    orgUserValidator.createReqValidator,
    orgUserValidator.emailUniqueValidation,
    orgUserTypeValidator.userTypeIdValidator,
    orgValidator.validateOrgId,
    orgUserCtrl.create
  ]);
  router.route('/update').put([
    orgUserValidator.updateReqValidator,
    orgUserTypeValidator.userTypeIdValidator,
    orgValidator.validateOrgId,
    orgUserCtrl.update]);

  router.route('/change-password').put([
    orgUserValidator.changePasswordReqValidator,
    orgValidator.validateOrgId,
    orgUserCtrl.changePassword]);

  //only for super admin
   adminRoutes.route('/api/admin/private/org/user/verify-regno').post([
    orgUserValidator.verifyRegNoReqValidator,
    orgUserTypeValidator.userTypeIdValidator,
    orgValidator.validateOrgId,
    orgUserCtrl.verifyUserRegNo])
  app.use(adminRoutes);

  app.use('/api/admin/private/org/user', router);
}
