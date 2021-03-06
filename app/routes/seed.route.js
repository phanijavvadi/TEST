'use strict';

/**
 * Module dependencies.
 */
import express from 'express';
import SeedCtrl from '../controllers/seed.ctrl';

const router = express.Router();

export default function (app) {
  router.route('/seed').get([SeedCtrl.seed]);
  router.route('/importMasterData').get([SeedCtrl.importMasterData]);
  app.use('/api/masterimport', router);

}
