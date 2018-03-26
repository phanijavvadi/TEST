'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import patientCareTeamCtrl from '../controllers/patient.care.team.ctrl';
import patientCareTeamValidator from '../validators/patient.care.team.validator';
import userAccessValidator from '../validators/user.access.validator';
import cors from 'cors';

const router = express.Router();
const patientRouter = express.Router();

export default function (app) {


  router.route('/list')
    .get([
      patientCareTeamValidator.getCareTeamListReqValidator,
      (req, resp, next) => {
        const orgId = req.query.orgId;
        userAccessValidator.validateUserHasOrgAccessById(orgId, req, resp, next);
      },
      patientCareTeamCtrl.getCareTeamList]);

  router.route('/create')
    .post([
      patientCareTeamValidator.createReqValidator,
      (req, resp, next) => {
        const orgId = req.body.orgId;
        userAccessValidator.validateUserHasOrgAccessById(orgId, req, resp, next);
      },
      patientCareTeamCtrl.create]);
  router.route('/remove')
    .delete([
      patientCareTeamValidator.removeReqValidator,
      (req, resp, next) => {
        const orgId = req.body.orgId;
        userAccessValidator.validateUserHasOrgAccessById(orgId, req, resp, next);
      },
      patientCareTeamCtrl.remove]);

  app.use('/api/org-user/private/care-team', router);
  app.use('/api/patient/private/care-team', patientRouter);
}
