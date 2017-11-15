'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgCtrl from '../controllers/organization.ctrl';
import orgValidator from '../validators/organization.validator';
import orgUserTypeValidator from '../validators/org.user.type.validator';

const router = express.Router();

export default function (app) {

  router.route('/list').get([
    orgCtrl.list]);
  router.route('/:id').get([
    orgCtrl.get]);
  router.route('/create').post([
    orgValidator.createReqValidator,
    orgValidator.validateEmailUniqueValidation,
    orgUserTypeValidator.userTypeIdValidator,
    orgCtrl.create]);
  router.route('/update').put([
    orgValidator.updateReqValidator,
    orgUserTypeValidator.userTypeIdValidator,
    orgCtrl.update]);
  app.use('/api/admin/private/organization', router);
}
