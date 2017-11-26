'use strict';
import errorMessages from '../../config/error.messages';
import * as commonUtil from '../util/common.util';
import * as userService from '../services/user.service';

const validators = {
  validateJwtToken: (req, resp, next) => {
    const token = req.body.token || req.query.token || req.headers['x-access-token'];
    if (token) {
      commonUtil.jwtVerify(token, (err, decoded) => {

        if (err && err.name == 'TokenExpiredError') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.TOKEN_IS_EXPIRED,
            code: 'TOKEN_IS_EXPIRED'
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
              resp.status(403).send({
                success: false,
                message: errorMessages.TOKEN_IS_INVALID,
                code: 'TOKEN_IS_INVALID'
              });
            } else {
              req.locals.jwtUserRecord = userRecord.get({plain:true});
              next();
              return null;
            }
          }).catch((err) => {
            let message = errorMessages.SERVER_ERROR;
            logger.error(err);
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
