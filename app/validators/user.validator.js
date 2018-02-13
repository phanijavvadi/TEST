'use strict';
import * as Joi from 'joi';
import logger from '../util/logger';
import * as _ from 'lodash';


const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import errorMessages from '../util/constants/error.messages';
import constants from '../util/constants/constants';
import * as orgService from '../services/organisation.service';
import * as userService from '../services/user.service';
import * as userTypeService from '../services/user.type.service';
import * as userVerificationService from '../services/user.verification.service';

const validators = {
  orgUserCreateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = Joi.object().keys({
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      phoneNo: Joi.string().required(),
      practitionerTypeId: Joi.string().allow(''),
      otherUserRoles: Joi.array().items(Joi.string()).unique(),
      regNo: Joi.string().allow(''),
      orgId: Joi.string().required(),
      status: Joi.number().valid([1, 2]).label('Status'),
    }).or('practitionerType', 'otherUserRoles')
      .with('practitionerType', 'regNo');

    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else if (body.practitionerTypeId === '' && body.otherUserRoles.length == 0) {
      resp.status(403).send({message: errorMessages.INVALID_INPUT});
    } else {

      const userTypeServices = [];
      if (body.practitionerTypeId) {
        userTypeServices.push(userTypeService.findById(body.practitionerTypeId, {includeAssos: true}));
      }
      body.otherUserRoles.forEach(userRoleId => {
        userTypeServices.push(userTypeService.findById(userRoleId, {includeAssos: true}));
      });

      Promise.all(userTypeServices)
        .then(results => {
          results.forEach((result) => {
            /**
             *  if any user type not exist throw error with INVALID_USER_TYPE
             */
            if (!result) {
              throw new Error('INVALID_USER_TYPE');
            }
          });

          results = results.map(result => result.get({plain: true}));
          /**
           * Checking all user types category should be ORG_USER otherwise send bad request error
           * */
          const orgUserCategoryObjects = results.every(userType => {
            return userType.userCategory.value === constants.userCategoryTypes.ORG_USER;
          });
          req.locals.userCategory = results[0].userCategory;
          if (!orgUserCategoryObjects) {
            throw new Error('INVALID_USER_TYPE');
          }

          if (body.practitionerTypeId) {
            if (results[0].userSubCategory.value !== constants.userSubCategory.ORG_PRACTITIONERS) {
              throw new Error('INVALID_PRACTITIONER_ID');
            }
            req.locals.practitioner = results[0];
            req.locals.otherUserRoles = results.slice(1);
          } else {
            req.locals.otherUserRoles = results;
          }
          req.locals.otherUserRoles.forEach(userRole => {
            if (userRole.userSubCategory.value !== constants.userSubCategory.ORG_ADMIN_USERS) {
              throw new Error('INVALID_ORG_USER_ROLE_ID');
            }
          });
          next();
        }).catch((err) => {
        if (err && err.message === 'INVALID_USER_TYPE') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.INVALID_USER_TYPE
          });
        }
        if (err && err.message === 'INVALID_ORG_USER_ROLE_ID') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.INVALID_ORG_USER_ROLE_ID
          });
        }
        if (err && err.message === 'INVALID_PRACTITIONER_ID') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.INVALID_PRACTITIONER_ID
          });
        }
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      })
    }
  },
  orgUserUpdateReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      phoneNo: Joi.string().required(),
      orgId: Joi.string().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  /*createReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      firstName: Joi.string().min(3).required(),
      lastName: Joi.string().min(1).required(),
      email: Joi.string().email().required(),
      userTypes: Joi.array().items(Joi.object({id: Joi.string().required()})).min(1).unique().required()
    };
    let result = Joi.validate(body, schema, {allowUnknown: true});
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      let userTypes = null;
      const userTypeServices = body.userTypes.map((userType) => userTypeService.findById(userType.id, {includeAssos: true}));

      Promise.all(userTypeServices)
        .then(results => {
          results.forEach((result) => {
            /!**
            *  if any user type not exist throw error with INVALID_USER_TYPE
            *!/
            if (!result) {
              throw new Error('INVALID_USER_TYPE');
            }
          });

          /!**
           * Setting all usertypes objects to request locals variable
           * *!/
          userTypes = results.map(result => result.get({plain: true}));
          req.locals.userTypes = userTypes;

          /!**
           * Checking all user types category should be same otherwise send bad request error
           * *!/
          const sameUserCategoryObjects=userTypes.every(userType=>{
            return userType.userCategory.id===userTypes[0].userCategory.id;
          });
          if(!sameUserCategoryObjects){
            return resp.status(403).send({
              success: false,
              message: errorMessages.USER_CREATION_SAME_CATEGORY_USERTYPES_REQUIRED
            });
          }

          /!**
           * Checking usertype needed reg no based on regNoVerificationRequired flag.
           * Throw an error if no regno found for user type
           * *!/
          userTypes.forEach((userType)=>{
            if (userType.regNoVerificationRequired) {
              const bodyUserTypeObj=_.find(body.userTypes,(a)=>{ return a.id===userType.id});
              if(!bodyUserTypeObj || (!bodyUserTypeObj.regNo)){
                throw new Error(`${userType.name} required registration number`);
              }
            }
          });
          /!**
           * checking orgId if user category is ORG_USER
           * *!/
          if (userTypes[0].userCategory.value === 'ORG_USER') {
            schema.orgId = Joi.string().required();
          }

          let result = Joi.validate(body, schema);
          if (result && result.error) {
           return resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
          }
          next();
        }).catch((err) => {
        if (err && err.message === 'INVALID_USER_TYPE') {
          return resp.status(403).send({
            success: false,
            message: errorMessages.INVALID_USER_TYPE
          });
        }
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
    }
  },*/
  validateOrgId: (req, resp, next) => {
    const {orgId} = req.body;
    logger.info('About to validate orgid',orgId);
    orgService.findById(orgId)
      .then((data) => {
        if (data) {
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
  validateVerificationId: (req, resp, next) => {
    const {verificationId} = req.body;
    userVerificationService.findById(verificationId)
      .then((data) => {
        if (data) {
          req.locals.verificationObj = data.get({plain: true});
          if (req.locals.verificationObj.verifiedOn) {
            return resp.status(403).send({success: false, message: errorMessages.USER_ALREADY_VERIFIED});
          } else {
            next();
          }
          return null;
        } else {
          return resp.status(403).send({success: false, message: errorMessages.INVALID_VERIFICATION_ID});
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
  emailUniqueValidation: (req, resp, next) => {
    const {email} = req.body;
    let where = {email};
    if (req.body && req.body.id) {
      where.id = {
        [Op.ne]: req.body.id
      }
    }
    const options = {where};
    userService.findOne(options)
      .then((data) => {
        if (data) {
          resp.status(403).send({success: false, message: errorMessages.USER_EMAIL_EXISTS});
        } else {
          next();
          return null;
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

  changePasswordReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      id: Joi.string().required(),
      orgId: Joi.string().required(),
      password: Joi.string().required(),
      confirmPassword: Joi.string().required().valid(Joi.ref('password')).options({
        language: {
          any: {
            allowOnly: '!!Passwords do not match',
          }
        }
      })
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  changeUserStatusValidation: (req, resp, next) => {
    const body = req.body;
    let schema = {
      userId: Joi.string().required(),
      orgId: Joi.string().required(),
      status: Joi.string().required().valid([1,2])
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  },
  verifyRegNoReqValidator: (req, resp, next) => {
    const body = req.body;
    let schema = {
      verificationId: Joi.string().required(),
      userId: Joi.string().required()
    };
    let result = Joi.validate(body, schema);
    if (result && result.error) {
      resp.status(403).send({errors: result.error.details, message: result.error.details[0].message});
    } else {
      next();
    }
  }
}
export default validators;
