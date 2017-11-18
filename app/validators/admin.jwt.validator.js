'use strict';
import errorMessages from '../../config/error.messages';
import * as commonUtil from '../util/common.util';
import * as adminService from '../services/admin.service';

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
        adminService.findById(payload.id)
          .then((adminRecord) => {
            if (!adminRecord) {
              resp.status(403).send({
                success: false,
                message: errorMessages.TOKEN_IS_INVALID,
                code: 'TOKEN_IS_INVALID'
              });
            } else {
              req.locals.adminRecord = adminRecord;
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
  },
  loginReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      userName: Joi.string().min(3).required(),
      password: Joi.string().min(5).required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({
        errors: result.error.details,
        message: result.error.details[0].message
      });
    } else {
      next();
    }
  }
}
export default validators;
