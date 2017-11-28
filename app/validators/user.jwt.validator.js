'use strict';
import errorMessages from '../../config/error.messages';
import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as userService from '../services/user.service';
import * as userRoleService from '../services/user.role.service';

const validators = {
  validateJwtToken: (req, resp, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      commonUtil.jwtVerify(token, (err, decoded) => {

        if (err && err.name == 'TokenExpiredError') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.TOKEN_IS_EXPIRED,
            code: 'TOKEN_IS_INVALID'
          });
        }
        if (err && err.name == 'JsonWebTokenError') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.TOKEN_IS_INVALID,
            code: 'TOKEN_IS_INVALID'
          });
        }
        if (err) {
          return resp.status(403).send({
            success: false,
            message: errorMessages.SERVER_ERROR
          });
        }

        req.locals = req.locals || {};
        req.locals.tokenDecoded = decoded;
        let payload = decoded;
        userService.findById(payload.id)
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
            req.locals.authenticatedUser = user;
            return userRoleService.getUserRoles(user.id);
          })
          .then((roles) => {
            const userRoles = roles.map((role) => role.get({plain: true}));
            /**
             *
             * Every jwt authenticating request setting authenticated user roles object into req local variable
             * we can able to use this object into next middleware functions
             */
            req.locals.authenticatedUserRoles = userRoles || [];
            next();
            return '';
          }).catch((err) => {
          if (err && err.message === 'TOKEN_IS_INVALID') {
            return resp.status(403).send({
              success: false,
              message: errorMessages.TOKEN_IS_INVALID,
              code: 'TOKEN_IS_INVALID'
            });
          }
          logger.error(err);
          let message = errorMessages.SERVER_ERROR;
          return resp.status(500).send({
            message
          });
        })
      })
    } else {
      resp.status(403).send({
        success: false,
        message: errorMessages.TOKEN_IS_INVALID,
        code: 'TOKEN_IS_INVALID'
      });
    }
  }
}
export default validators;
