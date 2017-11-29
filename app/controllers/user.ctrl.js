'use strict';

import models from '../models';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import logger from '../util/logger';
import * as _ from 'lodash';
import moment from 'moment';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as userService from '../services/user.service';
import * as userRoleService from '../services/user.role.service';
import * as userVerificationService from '../services/user.verification.service';
import * as mailNotificationUtil from "../util/mail.notification.util";
import * as adminMailTemplate from "../templates/admin.mail.template";

const operations = {
  getOrgUserList: (req, resp) => {
    logger.info('About to get organisation user list');

    const options = {};
    options.where = {};
    options.userRoles = {where:{}};
    if (req.query.status) {
      options.where.status = +req.query.status;
    }
    if (req.query.userTypeId) {
      options.userRoles.where['userTypeId'] = req.query.userTypeId;
      // options.where['$userRoles.userTypeId$'] = req.query.userTypeId;
    }
    if (req.query.orgId) {
      options.userRoles.where['orgId'] = req.query.orgId;
    }
    if (req.query.searchText) {
      options.where = {
        [Op.or]:[{firstName:{[Op.iLike]: `%${req.query.searchText}%`}},
          {lastName:{[Op.iLike]: `%${req.query.searchText}%`}},
          {phoneNo:{[Op.iLike]: `%${req.query.searchText}%`}}]
      }
    }
    return userService
      .getOrgUserList(req.query,options)
      .then((data) => {
        if (data) {
          data.rows=_.map(data.rows,(row)=>{
            row=row.get({plain:true});
            row.createdAt=moment(row.createdAt).format('YYYY-MM-DD HH:ss:mm');
            return row;
          })
          resp.status(200).json(data);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  get: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get user ', id);

    return userService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.ORG_USER_NOT_FOUND);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  createOrgUser: (req, resp) => {
    const body = req.body;
    const {otherUserRoles, practitioner, organization, userCategory, authenticatedUser} = req.locals;
    const userData = {
      firstName: body.firstName,
      lastName: body.lastName,
      email: body.email,
      phoneNo: body.phoneNo,
      userCategoryId: userCategory.id,
      createdBy: authenticatedUser.id
    }
    const userRoles = [];
    if (practitioner) {
      userRoles.push({
        userCategoryId: practitioner.userCategory.id,
        userSubCategoryId: practitioner.userSubCategory.id,
        userTypeId: practitioner.id,
        orgId: organization.id,

      });
    }
    otherUserRoles.forEach(userType => {
      let userRole = {
        userCategoryId: userType.userCategory.id,
        userSubCategoryId: userType.userSubCategory.id,
        userTypeId: userType.id,
        orgId: organization.id
      }
      userRoles.push(userRole);
    });


    logger.info('About to create  user', userData);
    userData.password = Math.random().toString(36).slice(-8);
    let user;
    let createdUserRoles;
    let transactionRef;
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return userService.create(userData, {transaction: transactionRef});
      })
      .then(res => {
        user = res;
        userRoles.forEach(userRole => {
          userRole.userId = user.get('id');
        });
        return userRoleService.bulkCreate(userRoles, {transaction: transactionRef});
      })
      .then(res => {
        createdUserRoles = res;
        if (practitioner) {
          return userVerificationService.create({
            userId: user.get('id'),
            regNo: body.regNo,
            userRoleId: createdUserRoles[0].get('id')
          }, {transaction: transactionRef});
        } else {
          return userData;
        }
      })
      .then(res => {
        transactionRef.commit();
        let contentObj = adminMailTemplate.orgUserCreation(userData);
        mailNotificationUtil.sendMail({
          to: [{email: userData.email, name: userData.firstName}],
          body: contentObj.body,
          subject: contentObj.subject
        });
        return resp.json({
          success: true,
          message: successMessages.ORG_USER_CREATED
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  update: (req, resp) => {
    const orgUser = req.body;
    logger.info('About to update organisation user', orgUser);
    return userService
      .update(orgUser)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.ORG_USER_UPDATED
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  changePassword: (req, resp) => {
    const orgUser = req.body;
    let data = _.omit(orgUser, ['confirmPassword']);
    logger.info('About to change password user');
    return userService
      .update(data)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.ORG_USER_PASSWORD_UPDATED
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        if (err && err.code == 'ORG_USER_NOT_FOUND') {
          resp.status(404).send({
            message
          });
          return;
        }
        resp.status(500).send({
          message
        });
      });
  },
  verifyUserRegNo: (req, resp) => {
    const data = req.body;
    const {verificationObj, authenticatedUser} = req.locals;
    logger.info('About to verify user');

    const verificationData = {
      id: data.verificationId,
      verifiedOn: new Date(),
      verifiedUserId: authenticatedUser.id
    }
    return userVerificationService
      .update(verificationData)
      .then(() => {
        resp.json({
          success: true,
          data:verificationData,
          message: successMessages.ORG_USER_REG_NO_VERIFICATION_STATUS_UPDATED_SUCCESSFULLY
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        if (err && err.code == 'INVALID_VERIFICATION_ID') {
          resp.status(404).send({
            message:errorMessages.INVALID_VERIFICATION_ID
          });
          return;
        }
        resp.status(500).send({
          message
        });
      });
  },
  changeUserStatus: (req, resp) => {
    const {authenticatedUser} = req.locals;
    logger.info('About to verify user');

    const data = {
      id: req.body.userId,
      status:req.body.status
    }
    return userService
      .update(data)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.ORG_USER_UPDATED
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        if (err && err.code == 'INVALID_VERIFICATION_ID') {
          resp.status(404).send({
            message:errorMessages.INVALID_VERIFICATION_ID
          });
          return;
        }
        resp.status(500).send({
          message
        });
      });
  }
}

export default operations;
