'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import careProblemsCtrl from '../controllers/care.problems.ctrl';

const router = express.Router();

export default function (app) {


  router.route('/options')
    .get([
      careProblemsCtrl.getOptions]);

  app.use('/api/admin/private/care-problems', router);
  app.use('/api/org-user/private/care-problems', router);
}
