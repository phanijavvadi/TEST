'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as adminService from '../services/admin.service';

const operations = {

  login: (req, resp) => {
    const {
      userName,
      password
    } = req.body;
    return adminService
      .findByUserName(userName, {
        include: ['password']
      })
      .then((data) => {
        if (!data) {
          resp.status(400).send({
            errors: [],
            message: errorMessages.ADMIN_USER_NAME_NOT_FOUND
          });
          return;
        }
        let hashedPassword = commonUtil.getHash(password);
        if (hashedPassword != data.get('password')) {
          resp.status(400).send({
            errors: [],
            message: errorMessages.ADMIN_USER_NAME_NOT_FOUND
          });
          return;
        } else {
          const payload = {
            id: data.id,
            userName: data.userName
          };
          var token = commonUtil.jwtSign(payload);
          resp.status(200).json({
            success: true,
            message: successMessages.ADMIN_LOGIN_SUCCESS,
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
  },
  create: (req, resp) => {
    const admin = req.body;
    logger.info('About to create admin ', admin);
    return adminService
      .create(admin)
      .then((data) => {
        const {userName,id,status}=data;
        resp.json({
          success:true,
          data:{
            id:data.get('id'),
            userName:data.get('userName'),
            status:data.get('status')
          },
          message:successMessages.ADMIN_USER_CREATED_SCUCCESS
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  }

}

export default operations;
