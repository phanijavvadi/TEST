'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgCtrl from '../controllers/organization.ctrl';
import orgValidator from '../validators/org.user.validator';
import orgUserRolesValidator from '../validators/org';
const router = express.Router();

export default function (app) {

  router.route('/list').get([
    orgCtrl.list]);
  router.route('/:id').get([
    orgCtrl.get]);
  router.route('/create').post([
    orgValidator.createReqValidator,
    orgValidator.validateEmailUniqueValidation,
    orgUserRolesValidator.userRoleIdValidator,
    orgCtrl.create]);
  router.route('/update').put([
    orgValidator.updateReqValidator,
    orgUserRolesValidator.userRoleIdValidator,
    orgCtrl.update]);

  app.use('/api/admin/private/org/user', router);
}
