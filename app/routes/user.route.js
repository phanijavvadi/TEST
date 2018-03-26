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
  router.route('/org/options').get([
    userCtrl.getOrgUserOptions]);

  router.route('/org/:id').get([
    userCtrl.get]);

  router.route('/update-profile-pic')
    .put([
      userValidator.updateProfilePicValidator,
      userCtrl.updateProfilePic]);

  router.route('/org/create').post([
    userValidator.orgUserCreateReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    userValidator.emailUniqueValidation,
    userValidator.validateOrgId,
    userCtrl.createOrgUser
  ]);
  router.route('/org/update').put([
    userValidator.orgUserUpdateReqValidator,
    userAccessValidator.validateUserHasOrgAccess,
    userValidator.validateOrgId,
    userCtrl.updateOrgUser
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
  router.route('/org/verify-regno').post([
    userValidator.verifyRegNoReqValidator,
    userValidator.validateVerificationId,
    userCtrl.verifyUserRegNo])
  //only for super admin

  // app.use(adminRoutes);

  app.use('/api/admin/private/user', router);
  app.use('/api/org-user/private/user', router);
}
