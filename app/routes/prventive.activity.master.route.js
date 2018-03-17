'use strict';
/**
 * Module dependencies.
 */
import express from 'express';
import preventiveActivitiesMasterCtrl from '../controllers/preventive.activities.master.ctrl';
import preventiveActivityMasterValidator from '../validators/preventive.activity.master.validator';

const router = express.Router();
const adminRouter = express.Router();
const patientRouter = express.Router();

export default function (app) {


  router.route('/options')
    .get([
      preventiveActivitiesMasterCtrl.getOptions]);

  router.route('/:preventive_act_mid/metrics')
    .get([
      preventiveActivitiesMasterCtrl.getMetricOptions]);


  router.route('/category-list')
    .get([
      preventiveActivitiesMasterCtrl.getCategoriesList,
    ]);
  router.route('/category')
    .post([
      preventiveActivityMasterValidator.createOrUpdatePreventiveCategoryMasterDataReqValidator,
      (req, resp, next) => {
        if (req.body.id) {
          preventiveActivitiesMasterCtrl.updatePreventiveCategoryMasterData(req, resp, next);
        } else {
          preventiveActivitiesMasterCtrl.createPreventiveCategoryMasterData(req, resp, next);
        }
      }]);

  router.route('/:preventive_act_cat_mid/activities-list')
    .get([
      preventiveActivitiesMasterCtrl.getActivitiesList,
    ]);
  router.route('/activity')
    .post([
      preventiveActivityMasterValidator.createOrUpdatePreventiveActivityReqValidator,
      (req, resp, next) => {
        preventiveActivityMasterValidator.isValidPrevCatMid(req.body.preventive_act_cat_mid, req, resp, next);
      },
      (req, resp, next) => {
        if (req.body.id) {
          preventiveActivitiesMasterCtrl.updatePreventiveActivity(req, resp, next);
        } else {
          preventiveActivitiesMasterCtrl.createPreventiveActivity(req, resp, next);
        }
      }
    ]);
  router.route('/activity/:preventive_act_mid/age-groups')
    .get([
      preventiveActivitiesMasterCtrl.getActivityAgeGroups,
    ]);
  router.route('/activity/add-age-groups')
    .post([
      preventiveActivityMasterValidator.saveActivityAgeGroupsReqValidator,
      preventiveActivitiesMasterCtrl.saveActivityAgeGroups,
    ]);
  router.route('/activity/delete-age-group')
    .post([
      preventiveActivityMasterValidator.deleteActivityAgeGroupReqValidator,
      preventiveActivitiesMasterCtrl.deleteActivityAgeGroup,
    ]);

  adminRouter.route('/save-category')
    .post([
      preventiveActivityMasterValidator.savePreventiveCategoryMasterDataReqValidator,
      preventiveActivitiesMasterCtrl.savePreventiveCategoryMasterData]);

  adminRouter.route('/save-acts')
    .post([
      preventiveActivityMasterValidator.savePreventiveActsMasterDataReqValidator,
      preventiveActivitiesMasterCtrl.savePreventiveActsMasterData]);
  adminRouter.route('/save-metrics')
    .post([
      preventiveActivityMasterValidator.savePreventiveMetricsMasterDataReqValidator,
      preventiveActivitiesMasterCtrl.savePreventiveMetricsMasterData]);

  app.use('/api/admin/private/preventive-activity/master', router);
  app.use('/api/admin/private/preventive-activity/master', adminRouter);
  app.use('/api/org-user/private/preventive-activity/master', router);


  app.use('/api/patient/private/preventive-activity/master', patientRouter)
}
