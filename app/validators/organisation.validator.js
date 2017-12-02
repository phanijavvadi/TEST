'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';

const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import _ from 'lodash';
import errorMessages from '../../config/error.messages';
import constants from '../../config/constants';
import * as orgService from '../services/organisation.service';
import * as orgUserService from '../services/user.service';
import * as userRoleService from '../services/user.role.service';
import * as userTypeService from '../services/user.type.service';
import * as attachmentService from '../services/attachment.service';

const validators = {
  createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      name: Joi.string().min(3).required(),
      address: Joi.string().min(3).required(),
      address1: Joi.string().min(3).allow(''),
      address2: Joi.string().min(3).allow(''),
      suburb: Joi.string().min(3).required(),
      postcode: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      phoneNo: Joi.string().required(),
      fax: Joi.string().allow(''),
      orgLogo: Joi.string().allow(''),
      // parentOrgId: Joi.string().allow(null),//need to work sub organisations
      contPerFname: Joi.string().min(3).required(),
      contPerLname: Joi.string().min(1).required(),
      contPerEmail: Joi.string().email().required(),
      contPerPhoneNo: Joi.string().required(),
      contPerTypeId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  userSignupReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      name: Joi.string().min(3).required(),
      address: Joi.string().min(3).required(),
      address1: Joi.string().min(3).allow(''),
      address2: Joi.string().min(3).allow(''),
      suburb: Joi.string().min(3).allow(''),
      postcode: Joi.string().allow(''),
      state: Joi.string().allow(''),
      country: Joi.string().allow(''),
      phoneNo: Joi.string().allow(''),
      fax: Joi.string().allow(''),
      orgLogo: Joi.string().allow(''),
      // parentOrgId: Joi.string().allow(null),//need to work sub organisations
      contPerFname: Joi.string().min(3).required(),
      contPerLname: Joi.string().min(1).required(),
      contPerEmail: Joi.string().email().required(),
      contPerPhoneNo: Joi.string().required(),
      contPerTypeId: Joi.string().required(),
      regNo: Joi.string().allow(''),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateOrgLogo: (req, resp, next) => {
    const body = req.body;
    if (!body.orgLogo) {
      next();
    } else {
      attachmentService.findById(body.orgLogo)
        .then((data) => {
          if (data) {
            next();
            return null;
          } else {
            return resp.status(403).send({success: false, message: errorMessages.INVALID_ATTACHMENT_ID});
          }
        })
        .catch((err) => {
          let message = err.message || errorMessages.SERVER_ERROR;
          logger.info(err);
          resp.status(500).send({
            message
          });
        });
    }
  },
  validateContPerTypeId: (req, resp, next) => {
    userTypeService.findById(req.body.contPerTypeId, {includeAssos: true})
      .then((data) => {
        if (data) {
          req.locals.contPerUserType = data;

          if (data.userCategory.value !== constants.userCategoryTypes.ORG_USER) {
            throw new Error(constants.errorCodes.INVALID_ORG_USER_TYPE);
          }
          next();
          return null;
        } else {
          throw new Error(constants.errorCodes.INVALID_USER_TYPE);
        }
      })
      .catch((err) => {
        let message, status;
        if (err && constants.errorCodes[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else {
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          message
        });
      });
  },
  validateRegNoRequiredOrNot: (req, resp, next) => {
    const {contPerUserType} = req.locals;
    if (contPerUserType.userSubCategory.value === constants.userSubCategory.ORG_PRACTITIONERS) {
      let schema = {
        regNo: Joi.string().required()
      };
      let result = Joi.validate(req.body, schema, {allowUnknown: true});
      if (result && result.error) {
        return resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
      } else {
        next();
      }
    } else {
      next();
    }

  },
  updateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required(),
      name: Joi.string().min(3).required(),
      address: Joi.string().min(3).required(),
      address1: Joi.string().min(3).allow(''),
      address2: Joi.string().min(3).allow(''),
      suburb: Joi.string().min(3).required(),
      postcode: Joi.string().required(),
      state: Joi.string().required(),
      country: Joi.string().required(),
      phoneNo: Joi.string().required(),
      fax: Joi.string().allow(''),
      orgLogo: Joi.string().allow(''),
      // parentOrgId: Joi.string().allow(null),//need to work sub organisations
      contPerFname: Joi.string().min(3).required(),
      contPerLname: Joi.string().min(1).required(),
      // contPerEmail: Joi.string().email().required(),
      contPerPhoneNo: Joi.string().required(),
      contPerId: Joi.string().required(),
      contPerTypeId: Joi.string().required(),
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  orgActivateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  orgInActivateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      orgId: Joi.string().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  validateOrgId: (req, resp, next) => {
    const {orgId} = req.body;

    const {authenticatedUser} = req.locals;

    if (authenticatedUser.userCategory.value === 'ORG_USER') {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });

      if (userOrgIds.indexOf(orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
    }


    orgService.findById(orgId)
      .then((data) => {
        if (data) {
          req.locals = req.locals || {};
          req.locals.organization = data.get({plain: true});
          next();
          return null;
        } else {
          return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
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
  validateUserHasOrgAccess: (req, resp, next) => {
    const {orgId} = req.body;

    const {authenticatedUser} = req.locals;
    if (authenticatedUser.userCategory.value === 'CM_USER') {
      next();
      return null;
    }
    if (authenticatedUser.userCategory.value === 'ORG_USER') {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
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
