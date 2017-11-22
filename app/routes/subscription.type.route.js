'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import subscriptionTypeCtrl from '../controllers/subscription.type.ctrl';
import subscriptionTypeValidator from '../validators/subscription.type.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/list').get([
    subscriptionTypeCtrl.list]);
  router.route('/options').get([
    subscriptionTypeCtrl.getOptions]);
  router.route('/:id').get([
    subscriptionTypeCtrl.get]);
  router.route('/create').post([
    subscriptionTypeValidator.createReqValidator,
    subscriptionTypeCtrl.create
  ]);
  router.route('/update').put([
    subscriptionTypeValidator.updateReqValidator,
    subscriptionTypeCtrl.update]);

  app.use('/api/admin/private/subscription-type', router);
}
