'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import orgApiKeysCtrl from '../controllers/org.api.keys.ctrl';
import orgApiKeyValidator from '../validators/org.api.keys.validator';
import orgValidator from '../validators/organisation.validator';

const router = express.Router();
const adminRoutes = express.Router();

export default function (app) {

  router.route('/list').get([
    orgApiKeysCtrl.getOrgOrgApiKeyList]);

  router.route('/:id').get([
    orgApiKeysCtrl.get]);

  router.route('/create').post([
    orgApiKeyValidator.createOrgApiKeyValidator,
    orgValidator.validateOrgId,
    orgApiKeysCtrl.createOrgApiKey
  ]);

  router.route('/delete').delete([
    orgApiKeyValidator.validateDeleteRequest,
    orgValidator.validateOrgId,
    orgApiKeysCtrl.deleteOrgApiKey
  ]);


  app.use('/api/org-user/private/api-keys', router);
}
