'use strict';
import _ from 'lodash';
import errorMessages from '../../config/error.messages';

const validators = {
  isUserHasOrgAccess: (locals,orgId) => {
    const {authenticatedUserRoles, authenticatedUser} = locals;
    return new Promise((resolve, reject) => {
      if (authenticatedUser.userCategory.value === 'CM_USER') {
        resolve(true);
      }
      if (authenticatedUser.userCategory.value === 'ORG_USER') {
        let userOrgIds = _.map(authenticatedUserRoles, (role) => {
          return role.orgId;
        });
        if (userOrgIds.indexOf(orgId) === -1) {
          reject({success: false, message: errorMessages.INVALID_ORG_ID});
        }
        resolve(true);
      }
    })

  },
  validateUserHasOrgAccess: (req, resp, next) => {
    const {orgId} = req.body;
    const {authenticatedUserRoles, authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === 'CM_USER') {
      next();
      return null;
    }
    if (authenticatedUser.userCategory.value === 'ORG_USER') {
      let userOrgIds = _.map(authenticatedUserRoles, (role) => {
        return role.orgId;
      });
      if (userOrgIds.indexOf(orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      next();
      return null;
    }
  }

}
export default validators;
