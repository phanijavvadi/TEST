'use strict';

import logger from '../util/logger';
import models from '../models';
import user from "../models/user";
const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import constants from '../util/constants/constants';

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
      return resp.send('seed completed successfully');
    }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  importMasterData: (req, resp) => {
    models.MasterData.bulkCreate([
      {
        key: 'PROBLEM_METRIC_FREQUENCY',
        order: 1,
        name: 'Daily',
        value: 'DAILY'
      },
      {
        key: 'PROBLEM_METRIC_FREQUENCY',
        order: 2,
        name: 'Weekly',
        value: 'WEEKLY'
      }, {
        key: 'PROBLEM_METRIC_FREQUENCY',
        order: 3,
        name: 'Monthly',
        value: 'MONTHLY'
      }, {
        key: 'PROBLEM_METRIC_FREQUENCY',
        order: 4,
        name: 'Yearly',
        value: 'YEARLY',
      },
      {
        key: 'METRIC_TARGET_OPERATOR',
        order: 1,
        name: '>',
        value: '>'
      }, {
        key: 'METRIC_TARGET_OPERATOR',
        order: 2,
        name: '>=',
        value: '>=',
      }, {
        key: 'METRIC_TARGET_OPERATOR',
        order: 3,
        name: '<',
        value: '<',
      }, {
        key: 'METRIC_TARGET_OPERATOR',
        order: 4,
        name: '<=',
        value: '<=',
      }, {
        key: 'METRIC_TARGET_OPERATOR',
        order: 4,
        name: '=',
        value: '=',
      },
      {
        key: 'UOM',
        order: 1,
        name: 'Kg',
        value: 'KG',
      },
      {
        key: 'UOM',
        order: 1,
        name: 'Min/Week',
        value: 'MIN_PER_WEEK',
      },
      {
        key: 'UOM',
        order: 1,
        name: 'cm',
        value: 'CM',
      },
      {
        key: 'UOM',
        order: 1,
        name: '1/min',
        value: '1_PER_MIN',
      },
      {
        key: 'UOM',
        order: 1,
        name: '/day',
        value: 'PER_DAY',
      },
      {
        key: 'INPUT_TYPES',
        order: 1,
        name: 'Text Box',
        value: 'TEXT_BOX',
      }, {
        key: 'INPUT_TYPES',
        order: 1,
        name: 'Free Text',
        value: 'TEXT_AREA',
      }, {
        key: 'INPUT_TYPES',
        order: 1,
        name: 'Select Box',
        value: 'SELECT_BOX',
      }, {
        key: 'INPUT_TYPES',
        order: 1,
        name: 'Radio button',
        value: 'RADIO_BUTTON',
      },
    ], {individualHooks: true})
      .then(() => {
        return resp.send('seed completed successfully');
      }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  /*sendNotification: (req, resp) => {

    axios({
      method: 'post',
      url: 'https://fcm.googleapis.com/fcm/send',
      headers: {
        "Authorization": "key=AAAAEi8MZQI:APA91bEBMhY-GVvaSzdovSQnK2Zj_c1-XI0WTVC3Bb3vssZl__IIi_xwSDJegtD5ZwBHTl-hBtUNhfnDjamO1l1weVWJbCpajfMIPSN1DjR54nBZBs0_RJb3CSH1NGhdh4jBhciRQlt_",
        "Content-Type": "application/json"
      },
      data: {
        "to": "cm_b1hYwTXo:APA91bEmj_r4spUpwVjoeyvnys_DukMvoxqvNKF7eEhnK0bUxNznzGmeBnnbjpTGpWhnOgWeSCI8gU90XUGYcZ4gxZcrMiFt_qh1IUEpPQmqyB3AOJYimftWloNd2BueasqnddwAJKJl",
        "collapse_key": "type_a",
        "notification": {
          "body": "First Notification",
          "title": "Collapsing A"
        },
        "data": {
          "body": "First Notification",
          "title": "Collapsing A",
          "key_1": "Data for key one",
          "key_2": "Hellowww"
        }
      }
    }).then((response) => {
      return resp.status(200).json(response.data);
    }).catch((err) => {
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  sendIOSNotification: (req, resp) => {
    const token = '8a6273c2d81a97e643a085625fd47379c36d0cdb62fe3ef4a7700c35b2071b2a';
    let bn = new BasicNotification(token, 'Hello, World', {
      badge: 4,
      sound: "ping.aiff",
      data: {
        userId: '12345'
      }
    });

    client.send(bn).then((result) => {
      // sent successfully
      return resp.status(200).json(result);
    })
      .catch(err => {
        logger.info(err);
        resp.status(500).json(err);
      });

  }*/
};

export default operations;
