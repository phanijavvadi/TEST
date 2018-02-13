'use strict';
import moment from 'moment';
import errorMessages from '../util/constants/error.messages';
import constants from '../util/constants/constants';
import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as userService from '../services/user.service';
import * as patientService from '../services/patient.service';
import * as orgSubscriptionService from '../services/org.subscription.service';

const validators = {
  validateAdminJwtToken: (req, resp, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    commonUtil.jwtVerify(token)
      .then(decoded => {
        req.locals = req.locals || {};
        req.locals.tokenDecoded = decoded;
        return userService.findOne({
          includeAll: true,
          where: {
            status: 1,
            id: decoded.id
          }
        });
      })
      .then((userRecord) => {
        if (!userRecord) {
          throw new Error('TOKEN_IS_INVALID');
        }
        /**
         *
         * Every jwt authenticating request setting authenticated user object into req local variable
         * we can able to use this object into next middleware functions
         */
        const user = userRecord.get({plain: true});
        if (user.userCategory.value !== constants.userCategoryTypes.CM_USER) {
          throw new Error('TOKEN_IS_INVALID');
        }
        req.locals.authenticatedUser = user;
        if (!user.userRoles || user.userRoles.length === 0) {
          throw new Error('TOKEN_IS_INVALID');
        }
        next();
        return null;
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
      })
  },
  validateOrgUserJwtToken: (req, resp, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    commonUtil.jwtVerify(token)
      .then(decoded => {
        req.locals = req.locals || {};
        req.locals.tokenDecoded = decoded;
        return userService.findOne({
          includeAll: true,
          where: {
            status: 1,
            id: decoded.id
          }
        });
      })
      .then((userRecord) => {
        if (!userRecord) {
          throw new Error('TOKEN_IS_INVALID');
        }
        /**
         *
         * Every jwt authenticating request setting authenticated user object into req local variable
         * we can able to use this object into next middleware functions
         */
        const user = userRecord.get({plain: true});
        if (user.userCategory.value !== constants.userCategoryTypes.ORG_USER) {
          throw new Error('TOKEN_IS_INVALID');
        }
        req.locals.authenticatedUser = user;
        if (!user.userRoles || user.userRoles.length === 0) {
          throw new Error('TOKEN_IS_INVALID');
        }
        logger.info('About to validate organisation has valid subscription', user.userRoles[0].orgId);
        return orgSubscriptionService.findOne({
          where: {
            validUpTo: {
              $gte: moment()
            },
            status: 1,
            orgId: user.userRoles[0].orgId
          }
        });
      })
      .then(subscription => {
        if (!subscription) {
          throw new Error('ORG_NOT_HAS_VALID_SUBSCRIPTION');
        }
        req.locals.orgSubscription = subscription;
        next();
        return null;
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
      })

  },
  validatePatientJwtToken: (req, resp, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    commonUtil.jwtVerify(token)
      .then(decoded => {
        req.locals = req.locals || {};
        req.locals.tokenDecoded = decoded;
        return patientService.findOne({
          where: {
            status: 1,
            id: decoded.id
          }
        });
      })
      .then((patientRecord) => {
        if (!patientRecord) {
          throw new Error('TOKEN_IS_INVALID');
        }
        const patient = patientRecord.get({plain: true});
        req.locals.authenticatedPatient = patient;
        next();
        return null;

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
      })

  }
}
export default validators;
