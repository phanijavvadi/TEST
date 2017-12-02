'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgCtrl from '../controllers/organisation.ctrl';
import orgValidator from '../validators/organisation.validator';
import orgUserTypeValidator from '../validators/user.type.validator';

const router = express.Router();
const publicRouter = express.Router();
const adminRouter = express.Router();

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
  router.route('/:id/details').get([
    orgCtrl.getDetails]);


  router.route('/update').put([
    orgValidator.updateReqValidator,
    orgValidator.validateOrgLogo,
    orgValidator.validateContPerTypeId,
    orgCtrl.update]);

  // admin specific routers
  adminRouter.route('/create').post([
    orgValidator.createReqValidator,
    orgValidator.validateOrgLogo,
    orgValidator.validateContPerTypeId,
    orgCtrl.create]);

  adminRouter.route('/activate').post([
    orgValidator.orgActivateReqValidator,
    orgCtrl.activate]);

  adminRouter.route('/in-activate').post([
    orgValidator.orgInActivateReqValidator,
    orgCtrl.inActivate]);

  // Public Routers
  publicRouter.route('/sign-up').post([
    orgValidator.userSignupReqValidator,
    orgValidator.validateOrgLogo,
    orgValidator.validateContPerTypeId,
    orgValidator.validateRegNoRequiredOrNot,
    orgCtrl.signUp]);

  app.use('/api/admin/private/organisation', router);
  app.use('/api/admin/private/organisation', adminRouter);

  app.use('/api/org-user/private/organisation', router);

  app.use('/api/org-user/public/organisation', publicRouter);
}
