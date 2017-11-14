'use strict';
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import * as orgUserTypeService from '../services/org.user.type.service'

const validators = {
  userTypeIdValidator: (req, resp, next) => {
    const {OrgUserRoleId} = req.body;
    orgUserRolesService.findById(OrgUserRoleId)
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
