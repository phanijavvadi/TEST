'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import userCtrl from '../controllers/user.ctrl';
import userValidator from '../validators/user.validator';
import orgUserTypeValidator from '../validators/user.type.validator';
import userAccessValidator from '../validators/user.access.validator';
import orgValidator from '../validators/organisation.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/org/list').get([
    userCtrl.getOrgUserList]);

  router.route('/org/:id').get([
    userCtrl.get]);

  router.route('/org/create').post([
    userValidator.orgUserCreateReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    userValidator.emailUniqueValidation,
    userValidator.validateOrgId,
    userCtrl.createOrgUser
  ]);

  router.route('/org/change-status').post([
    userValidator.changeUserStatusValidation,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    userCtrl.changeUserStatus
  ]);

  /*router.route('/org/update').put([
    userValidator.updateReqValidator,
    orgUserTypeValidator.userTypeIdValidator,
    orgValidator.validateOrgId,
    userCtrl.update]);
*/

  router.route('/org/change-password').post([
    userValidator.changePasswordReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    orgValidator.validateOrgId,
    userCtrl.changePassword]);

  //only for super admin
  adminRoutes.route('/api/admin/private/user/org/verify-regno').post([
    userValidator.verifyRegNoReqValidator,
    userValidator.validateVerificationId,
    userCtrl.verifyUserRegNo])
  app.use(adminRoutes);

  app.use('/api/admin/private/user', router);
  app.use('/api/org-user/private/user', router);
}
