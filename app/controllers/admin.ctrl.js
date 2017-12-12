'use strict';
import moment from 'moment';
import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import constants from '../../config/constants';
import * as userService from '../services/user.service';
import * as orgSubscriptionService from '../services/org.subscription.service';

import models from '../models';

const operations = {

  login: (req, resp) => {
    const {
      userName,
      password
    } = req.body;
    const context = req.headers['context'];
    let userResult;
    return userService
      .findOne({
        where: {
          email: userName,
          status: 1
        },
        attributes: {include: ['password']},
        include: [{
          model: models.UserCategory,
          as: 'userCategory',
          where: {
            value: context
          }
        }, {
          model: models.UserRole,
          as: 'userRoles'
        }]
      })
      .then((data) => {
        if (!data) {
          throw new Error('INVALID_USERNAME_OR_PASSWORD');
        }
        let hashedPassword = commonUtil.getHash(password);
        if (hashedPassword !== data.get('password')) {
          throw new Error('INVALID_USERNAME_OR_PASSWORD');
        }
        userResult = data.get({plain: true});
        if (userResult.userRoles.length === 0) {
          throw new Error('USER_NOT_HAVE_ANY_ROLES');
        }
        const payload = {
          id: userResult.id,
          email: userResult.email,
          firstName: userResult.firstName,
          lastName: userResult.lastName,
          context:req.headers['context']
        }
        if (userResult.userCategory.value === constants.userCategoryTypes.ORG_USER) {

          logger.info('About to validate organisation has valid subscription');
          return orgSubscriptionService
            .findOne({
              where: {
                validUpTo: {
                  $gte: moment()
                },
                status: 1,
                orgId: userResult.userRoles[0].orgId
              }
            })
            .then(subscription => {
              if (!subscription) {
                throw new Error('ORG_NOT_HAS_VALID_SUBSCRIPTION');
              }
              return payload;
            })
            .catch(err => {
              throw err;
            })
        } else {
          return payload;
        }
      })
      .then(payload => {
        const token = commonUtil.jwtSign(payload);
        resp.status(200).json({
          success: true,
          message: successMessages.USER_LOGIN_SUCCESS,
          token: token,
          data: payload
        });
      })
      .catch((err) => {
        let message, status, code;
        if (err && errorMessages[err.message]) {
          code = err.message;
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          code = 'SERVER_ERROR';
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }

        resp.status(status).send({
          success: false,
          message,
          code
        });
      });
  }
}

export default operations;
