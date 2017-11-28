'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as userService from '../services/user.service';

const operations = {

  login: (req, resp) => {
    const {
      userName,
      password
    } = req.body;
    return userService
      .findOne({
        where: {email:userName, status: 1}, attributes: {
          include: ['password']
        }
      })
      .then((data) => {
        if (!data) {
          resp.status(400).send({
            errors: [],
            message: errorMessages.INVALID_USERNAME_OR_PASSWORD
          });
          return;
        }
        let hashedPassword = commonUtil.getHash(password);
        if (hashedPassword != data.get('password')) {
          resp.status(400).send({
            errors: [],
            message: errorMessages.INVALID_USERNAME_OR_PASSWORD
          });
          return;
        } else {
          const payload = {
            id: data.id,
            email: data.email
          };
          var token = commonUtil.jwtSign(payload);
          resp.status(200).json({
            success: true,
            message: successMessages.USER_LOGIN_SUCCESS,
            token: token,
            data: payload
          });
        }
      }).catch((err) => {
        let message = errorMessages.SERVER_ERROR;
        logger.error(err);
        resp.status(500).send({
          message
        });
      });
  }
}

export default operations;
