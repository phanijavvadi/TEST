'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgCtrl from '../controllers/organisation.ctrl';
import orgValidator from '../validators/organisation.validator';
import orgUserTypeValidator from '../validators/user.type.validator';

const router = express.Router();

export default function (app) {

  /**
   * get organisation list get method
   */
  router.route('/list').get([
    orgCtrl.list]);

  router.route('/options').get([
    orgCtrl.getOptions]);

  router.route('/:id').get([
    orgCtrl.get]);

  router.route('/create').post([
    orgValidator.createReqValidator,
    orgValidator.validateOrgLogo,
    orgCtrl.create]);

  router.route('/update').put([
    orgValidator.updateReqValidator,
    orgValidator.validateOrgLogo,
    orgCtrl.update]);

  router.route('/activate').post([
    orgValidator.orgActivateReqValidator,
    orgCtrl.activate]);

  router.route('/in-activate').post([
    orgValidator.orgInActivateReqValidator,
    orgCtrl.inActivate]);

  app.use('/api/admin/private/organisation', router);
}
