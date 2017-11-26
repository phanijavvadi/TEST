'use strict';

import logger from '../util/logger';
import models from '../models';
import user from "../models/user";

const operations = {
  seed: (req, resp) => {
    logger.info('About to import seed data ');
    let userCats,userSubCats,userTypes,users,userroles;
    models.UserCategory.bulkCreate([
      {name: 'CM Users', value: 'CM_USER'},
      {name: 'Org Users', value: 'ORG_USER'},
    ], {individualHooks: true})
      .then((res) => {
      userCats=res;
        return models.UserSubCategory.bulkCreate([
          {name: 'Care Monitor Admin Users',value: 'CM_ADMIN_USERS', userCategoryId: userCats[0].id, multipleRolesAllowCount: 0},
          {name: 'Org Admin users',value: 'ORG_ADMIN_USERS', userCategoryId: userCats[1].id, multipleRolesAllowCount: 0},
          {name: 'Org Practitioners',value: 'ORG_PRACTITIONERS', userCategoryId: userCats[1].id, multipleRolesAllowCount: 1},
        ], {individualHooks: true})
      })
      .then(res => {
        userSubCats=res;
            return models.UserType.bulkCreate([
              {
                name: 'Super Admin',
                value:'SUPER_ADMIN',
                regNoVerificationRequired: false,
                userCategoryId: userCats[0].id,
                userSubCategoryId: userSubCats[0].id
              },
              {
                name: 'Org Admin',
                value:'ORG_ADMIN',
                regNoVerificationRequired: false,
                userCategoryId: userCats[1].id,
                userSubCategoryId: userSubCats[1].id
              },
              {
                name: 'Aboriginal and Torres Strait Islander Health Practitioner',
                value:'ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER',
                regNoVerificationRequired: true,
                userCategoryId: userCats[1].id,
                userSubCategoryId: userSubCats[2].id
              },
              {
                name: 'Chinese Medicine Practitioner',
                value:'CHINESE_MEDICINE_PRACTITIONER',
                regNoVerificationRequired: true,
                userCategoryId: userCats[1].id,
                userSubCategoryId: userSubCats[2].id
              },
              {
                name: 'Chiropractor',
                value:'CHIROPRACTOR',
                regNoVerificationRequired: true,
                userCategoryId: userCats[1].id,
                userSubCategoryId: userSubCats[2].id
              }
            ], {individualHooks: true});
      })
      .then(res => {
        userTypes=res;
            return models.User.bulkCreate([
              {
                firstName: 'Super Admin',
                lastName: 'Care monitor',
                email: 'superadmin@cm.com',
                password: 'password',
                userCategoryId: userCats[0].id,
                status:1
              }
            ], {individualHooks: true});
      })
      .then(res=>{
        users=res;
            return models.UserRole.bulkCreate([
              {
                userId:users[0].id,
                orgId:null,
                userCategoryId:userCats[0].id,
                userSubCategoryId:userSubCats[0].id,
                userTypeId:userTypes[0].id
              }
              ]);
      }).then(()=>{
      resp.send('seed completed successfully');
    }).catch((err)=>{
      logger.info(err);
      resp.status(500).send(err);
    });
  }
}

export default operations;
