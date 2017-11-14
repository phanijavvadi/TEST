'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as orgUserRolesService from '../services/organization.user.roles.service'

const validators = {
  userRoleIdValidator: (req, resp, next) => {
    const {orgUserRoleId} = req.body;
    orgUserRolesService.findById(orgUserRoleId)
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          return resp.status(403).send({success: false, message: errorMessages.ORG_USER_ROLE_ID_NOT_FOUND});
        }
      })
      .catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },

}
export default validators;
