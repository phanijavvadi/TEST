'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgCtrl from '../controllers/organisation.ctrl';
import orgValidator from '../validators/organisation.validator';
import orgUserTypeValidator from '../validators/org.user.type.validator';

const router = express.Router();

export default function (app) {

  router.route('/list').get([
    orgCtrl.list]);
  router.route('/options').get([
    orgCtrl.getOptions]);
  router.route('/:id').get([
    orgCtrl.get]);
  router.route('/create').post([
    orgValidator.createReqValidator,
    orgValidator.validateOrgLogo,
    orgValidator.validateEmailUniqueValidation,
    orgUserTypeValidator.userTypeIdValidator,
    orgCtrl.create]);

  router.route('/update').put([
    orgValidator.updateReqValidator,
    orgValidator.validateOrgLogo,
    orgUserTypeValidator.userTypeIdValidator,
    orgCtrl.update]);
  router.route('/activate').post([
    orgValidator.orgActivateReqValidator,
    orgCtrl.activate]);
  router.route('/in-activate').post([
    orgValidator.orgInActivateReqValidator,
    orgCtrl.inActivate]);

  app.use('/api/admin/private/organisation', router);
}
