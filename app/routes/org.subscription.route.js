'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgSubscriptionCrl from '../controllers/org.subscription.ctrl';
import orgSubscriptionValidator from '../validators/org.subscription.validator';
import organizationValidator from '../validators/organisation.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/list').get([
    orgSubscriptionCrl.list]);
  router.route('/:id').get([
    orgSubscriptionCrl.get]);
  router.route('/subscribe').post([
    orgSubscriptionValidator.subscribeReqValidator,
    orgSubscriptionValidator.validateSubscriptionId,
    organizationValidator.validateOrgId,
    orgSubscriptionValidator.validateSubscriptionAlreadyExist,
    orgSubscriptionCrl.subscribe
  ]);
  router.route('/un-subscribe').put([
    orgSubscriptionValidator.unSubscribeReqValidator,
    organizationValidator.validateOrgId,
    orgSubscriptionValidator.validateSubscriptionId,
    orgSubscriptionCrl.unSubscribe]);

  app.use('/api/admin/private/org-subscription', router);
}
