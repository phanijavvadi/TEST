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
  importProblemsMasterData: (req, resp) => {
    const data = req.body;
    const que = [];

    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;

        data.forEach(a => {
          que.push(models.ProblemsMaster.create(a, {
            transaction: transactionRef
          }))
        });
        return Promise.all(que)
      }).then(() => {
      transactionRef.commit();
      return resp.send('seed completed successfully');
    }).catch((err) => {
      transactionRef.rollback();
      logger.info(err);
      resp.status(500).send('error');
    });
  },
  importMetricsMasterData: (req, resp) => {
    const TEXT_BOX = '1de3718f-6437-420a-9124-b4a78c257c56';
    const SELECT_BOX = '1abe4624-e0f1-41de-b544-172a9acedb54';
    const TEXT_AREA = 'aaeea354-fd06-4306-b2de-d4ade59c4f6b';

    const data = [
      {
        "name": "BP",
        "goal": "Keep blood pressure within target range",
        "management": "Take Medications as Prescribed; Web Resource : https://www.heartfoundation.org.au/",
        "frequency": "PROBLEM_METRIC_FREQUENCY",
        "status": 1,
        "master_targets": [
          {
            "operator": "<",
            "defVal": "140/90",
            "uom": null,
            "status": 1
          },
          {
            "operator": ">",
            "defVal": "120/60",
            "uom": null,
            "status": 1
          }
        ],
        "master_act_plans": [
          {
            "title": "If BP",
            "inputs_master": [
              {
                "label": "<",
                "defVal": "140/90",
                "input_type_mid": TEXT_BOX,
              },
              {
                "label": "For >",
                "defVal": "3 Readings",
                "input_type_mid": SELECT_BOX,
                "input_options_master": [
                  {
                    "name": "1 Reading"
                  },
                  {
                    "name": "2 Readings"
                  },
                  {
                    "name": "3 Readings"
                  }
                ]
              },
              {
                "label": "Action",
                "defVal": null,
                "input_type_mid": TEXT_BOX
              }
            ]
          },
          {
            "title": "If BP",
            "inputs_master": [
              {
                "label": "<",
                "defVal": "105/40",
                "input_type_mid": TEXT_BOX
              },
              {
                "label": "For >",
                "defVal": "1 Readings",
                "input_type_mid": SELECT_BOX,
                "input_options_master": [
                  {
                    "name": "1 Reading"
                  },
                  {
                    "name": "2 Readings"
                  },
                  {
                    "name": "3 Readings"
                  }
                ]
              },
              {
                "label": "Action",
                "defVal": null,
                "input_type_mid": TEXT_BOX
              }
            ]
          },
          {
            "title": "Provider",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": SELECT_BOX,
                "input_options_master": [
                  {
                    "name": "Doctor"
                  },
                  {
                    "name": "Patient"
                  },
                  {
                    "name": "Dietitian"
                  }
                ]
              }
            ]
          }
        ]
      },
      {
        "name": "Weight",
        "goal": "Keep weight within target range",
        "management": "Diet and exercise as advised; Web Resources www.makehealthynormal.com.au",
        "frequency": "PROBLEM_METRIC_FREQUENCY",
        "status": 1,
        "master_targets": [
          {
            "operator": "<",
            "defVal": "50",
            "uom": "KG",
            "status": 1
          }
        ],
        "master_act_plans": [
          {
            "title": "Diet and exercise as advised",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": TEXT_AREA
              }
            ]
          },
          {
            "title": "Dietician review and advice",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": TEXT_AREA
              }
            ]
          },
          {
            "title": "Physiologist review and advice",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": TEXT_AREA
              }
            ]
          }
        ]
      },
      {
        "name": "Minutes Exercise",
        "goal": "Maintain good activity levels",
        "management": "Regular Exercise",
        "frequency": "PROBLEM_METRIC_FREQUENCY",
        "status": 1,
        "master_targets": [
          {
            "operator": ">",
            "defVal": "50",
            "uom": "KG",
            "status": 1
          }
        ],
        "master_act_plans": [
          {
            "title": "Advised",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": TEXT_AREA
              }
            ]
          },
          {
            "title": "Provider",
            "inputs_master": [
              {
                "label": null,
                "defVal": "",
                "input_type_mid": SELECT_BOX,
                "input_options_master": [
                  {
                    "name": "Exercise Physiologist"
                  },
                  {
                    "name": "Patient"
                  }
                ]
              }
            ]
          }

        ]
      }
    ];
    const que = [];

    let transactionRef;
    sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        data.forEach(a => {
          que.push(models.ProblemMetricsMaster.create(a, {
            include: [
              {
                model: models.ProblemMetricTargetMaster,
                as: 'master_targets'
              },
              {
                model: models.ProblemMetricActionPlanMaster,
                as: 'master_act_plans',
                include: [
                  {
                    model: models.ProblemMetricActionPlanInputMaster,
                    as: 'inputs_master',
                    include: [
                      {
                        model: models.ProblemMetricActionPlanInputOptionMaster,
                        as: 'input_options_master'
                      }
                    ]
                  }
                ]
              }
            ],
            transaction: transactionRef
          }))
        });
        return Promise.all(que)
      }).then(() => {
      transactionRef.commit();
      return resp.send('seed completed successfully');
    }).catch((err) => {
      transactionRef.rollback();
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
  }
};

export default operations;
