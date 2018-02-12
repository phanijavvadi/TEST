'use strict';

import logger from '../util/logger';
import models from '../models';
import user from "../models/user";

import constants from '../../config/constants';

const operations = {
  seed: (req, resp) => {
    logger.info('About to import seed data ');
    let userCats, userSubCats, userTypes, users, userroles;
    models.UserCategory.bulkCreate([
      {name: 'CM Users', value: constants.userCategoryTypes.CM_USER},
      {name: 'Org Users', value: constants.userCategoryTypes.ORG_USER},
    ], {individualHooks: true})
      .then((res) => {
        userCats = res;
        return models.UserSubCategory.bulkCreate([
          {
            name: 'Care Monitor Admin Users',
            value: constants.userSubCategory.CM_ADMIN_USERS,
            userCategoryId: userCats[0].id,
            multipleRolesAllowCount: 0
          },
          {
            name: 'Org Admin users',
            value: constants.userSubCategory.ORG_ADMIN_USERS,
            userCategoryId: userCats[1].id,
            multipleRolesAllowCount: 0
          },
          {
            name: 'Org Practitioners',
            value: constants.userSubCategory.ORG_PRACTITIONERS,
            userCategoryId: userCats[1].id,
            multipleRolesAllowCount: 1
          },
        ], {individualHooks: true})
      })
      .then(res => {
        userSubCats = res;
        return models.UserType.bulkCreate([
          {
            name: 'Super Admin',
            value: constants.userTypes.SUPER_ADMIN,
            regNoVerificationRequired: false,
            userCategoryId: userCats[0].id,
            userSubCategoryId: userSubCats[0].id
          },
          {
            name: 'Org Admin',
            value: constants.userTypes.ORG_ADMIN,
            regNoVerificationRequired: false,
            userCategoryId: userCats[1].id,
            userSubCategoryId: userSubCats[1].id
          },
          {
            name: 'Aboriginal and Torres Strait Islander Health Practitioner',
            value: constants.userTypes.ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER,
            regNoVerificationRequired: true,
            userCategoryId: userCats[1].id,
            userSubCategoryId: userSubCats[2].id
          },
          {
            name: 'Chinese Medicine Practitioner',
            value: constants.userTypes.CHINESE_MEDICINE_PRACTITIONER,
            regNoVerificationRequired: true,
            userCategoryId: userCats[1].id,
            userSubCategoryId: userSubCats[2].id
          },
          {
            name: 'Chiropractor',
            value: constants.userTypes.CHIROPRACTOR,
            regNoVerificationRequired: true,
            userCategoryId: userCats[1].id,
            userSubCategoryId: userSubCats[2].id
          }
        ], {individualHooks: true});
      })
      .then(res => {
        userTypes = res;
        return models.User.bulkCreate([
          {
            firstName: 'Super Admin',
            lastName: 'Care monitor',
            email: 'admin@caremonitor.com.au',
            password: 'password',
            userCategoryId: userCats[0].id,
            status: 1
          }
        ], {individualHooks: true});
      })
      .then(res => {
        users = res;
        return models.UserRole.bulkCreate([
          {
            userId: users[0].id,
            orgId: null,
            userCategoryId: userCats[0].id,
            userSubCategoryId: userSubCats[0].id,
            userTypeId: userTypes[0].id
          }
        ]);
      }).then(() => {
      resp.send('seed completed successfully');
    }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  importProblemsMasterData: (req, resp) => {
    let userCats, userSubCats, userTypes, users, userroles;
    models.CareProblems.bulkCreate([
      {
        problem: 'Asthma', description: 'Asthma'
      }, {
        problem: 'Heart Failure',
        description: 'Heart Failure'
      }, {
        problem: 'Ischaemic Heart Disease',
        description: 'Ischaemic Heart Disease'
      }, {
        problem: 'Hypertension',
        description: 'Hypertension'
      }, {
        problem: 'Diabetes',
        description: 'Diabetes'
      }, {
        problem: 'Obesity/Overweight',
        description: 'Obesity/Overweight'
      }, {
        problem: 'COPD',
        description: 'COPD'
      }, {
        problem: 'Alcohol Excess',
        description: 'Alcohol Excess'
      }, {
        problem: 'Smoking',
        description: 'Smoking'
      }
    ], {individualHooks: true})
      .then(() => {
        resp.send('seed completed successfully');
      }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  }
}

export default operations;
