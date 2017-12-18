'use strict';

import models from '../models';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import logger from '../util/logger';
import * as _ from 'lodash';
import moment from 'moment';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import constants from '../../config/constants';
import * as commonUtil from '../util/common.util';

import * as patientService from '../services/patient.service';
import * as patientMedicalHistoryService from '../services/patient.medical.history.service';
import * as importDataService from '../services/import.data.service';

const operations = {
  getOrgPatientList: (req, resp) => {
    logger.info('About to get organisation patient list');
    const {authenticatedUser} = req.locals;
    const options = {};
    options.where = {};
    if (req.query.status) {
      options.where.status = +req.query.status;
    }
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }
    if (req.query.orgId) {
      options.where['orgId'] = req.query.orgId;
    }
    if (req.query.searchText) {
      options.where = {
        [Op.or]: [{firstName: {[Op.iLike]: `%${req.query.searchText}%`}},
          {surName: {[Op.iLike]: `%${req.query.searchText}%`}},
          {middleName: {[Op.iLike]: `%${req.query.searchText}%`}},
          {phoneNo: {[Op.iLike]: `%${req.query.searchText}%`}},
          {mobileNo: {[Op.iLike]: `%${req.query.searchText}%`}},
          {email: {[Op.iLike]: `%${req.query.searchText}%`}}]
      }
    }
    return patientService
      .getOrgPatientList(req.query, options)
      .then((data) => {
        if (data) {
          data.rows = _.map(data.rows, (row) => {
            row = row.get({plain: true});
            row.createdAt = moment(row.createdAt).format('YYYY-MM-DD HH:ss:mm');
            return row;
          })
          resp.status(200).json(data);
        }
      }).catch((err) => {
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  },
  get: (req, resp) => {
    const id = req.params.id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    logger.info('About to get patient ', id);
    const options = {where: {}};
    if (tokenDecoded.context && tokenDecoded.context === constants.contexts.PATIENT) {
      options.where['orgId'] = tokenDecoded.orgId;
    } else if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
      if (req.query.orgId && userOrgIds.indexOf(req.query.orgId) === -1) {
        return resp.status(403).send({success: false, message: errorMessages.INVALID_ORG_ID});
      }
      options.where['orgId'] = userOrgIds;
    }
    return patientService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.INVALID_PATIENT_ID);
        }
      }).catch((err) => {
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  },
  signUp: (req, resp) => {
    const body = req.body;
    logger.info('About to signup patient ', body);
    const {patient} = req.locals;

    const patientData = {
      id: patient.id,
      email: body.email,
      patientNumber: body.address,
      password: body.password,
      status: 1,
      registered: 1,
    }
    return sequelize.transaction()
      .then((t) => {
        return patientService
          .update(patientData, {transaction: t})
          .then(() => {
            t.commit();
            const payload = {
              id: patient.id,
              orgId: patient.orgId,
              context: constants.contexts.PATIENT,
              email: patientData.email,
              firstName: patient.firstName,
              surName: patient.surName,
              middleName: patient.middleName
            };
            const token = commonUtil.jwtSign(payload);
            return resp.json({
              success: true,
              token: token,
              data: payload,
              message: successMessages.PATIENT_SIGNUP_SUCCESS
            });
          })
          .catch((err) => {
            t.rollback();
            let message, status;
            if (err && errorMessages[err.message]) {
              status = 403;
              message = errorMessages[err.message];
            } else {
              logger.error(err);
              status = 500;
              message = errorMessages.SERVER_ERROR;
            }
            resp.status(status).send({
              success: false,
              message,
            });
          });
      });
  },
  signIn: (req, resp) => {
    const {
      email,
      password
    } = req.body;
    const context = req.headers['context'];
    let patientResult;
    return patientService
      .findOne({
        where: {
          email: email,
          status: 1
        },
        attributes: {include: ['password']}
      })
      .then((data) => {
        if (!data) {
          throw new Error('PATIENT_INVALID_LOGIN_CREDENTIALS');
        }
        let hashedPassword = commonUtil.getHash(password);
        if (hashedPassword !== data.get('password')) {
          throw new Error('PATIENT_INVALID_LOGIN_CREDENTIALS');
        }
        patientResult = data.get({plain: true});
        const payload = {
          id: patientResult.id,
          orgId: patientResult.orgId,
          context: constants.contexts.PATIENT,
          email: patientResult.email,
          firstName: patientResult.firstName,
          surName: patientResult.surName,
          middleName: patientResult.middleName
        }
        return payload;
      })
      .then(payload => {
        const token = commonUtil.jwtSign(payload);
        resp.status(200).json({
          success: true,
          message: successMessages.PATIENT_LOGIN_SUCCESS,
          token: token,
          data: payload
        });
      })
      .catch((err) => {
        let message, status, code;
        if (err && errorMessages[err.message]) {
          code = err.message;
          status = 403;
          message = errorMessages[err.message];
        } else {
          logger.error(err);
          code = 'SERVER_ERROR';
          status = 500;
          message = errorMessages.SERVER_ERROR;
        }

        resp.status(status).send({
          success: false,
          message,
          code
        });
      });
  },
  importOrgPatient: (req, resp) => {
    const body = req.body;
    let transactionRef, createdPatients;
    const {privateKeyDetails} = req.locals;
    let patientsData = [];
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return importDataService.create({
          importedData:body,
          orgApiKeyId:privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        body.patients.forEach((patient) => {
          let patientNumber = Math.random().toString(36).slice(-10);
          let patientData = {
            patientInternalId: patient.INTERNALID,
            firstName: patient.FIRSTNAME,
            surName: patient.SURNAME,
            middleName: patient.MIDDLENAME,
            patientNumber: patientNumber,
            gender: patient.SEXCODE,
            address1: patient.ADDRESS1,
            address2: patient.ADDRESS2,
            city: patient.CITY,
            postcode: patient.POSTCODE,
            postalAddress: patient.POSTALADDRESS,
            postalCity: patient.POSTALCITY,
            postalPostcode: patient.POSTALPOSTCODE,
            phoneNo: patient.HOMEPHONE,
            mobileNo: patient.MOBILEPHONE,
            orgId: privateKeyDetails.orgId,
            importedDataId:importedObj.get('id')
          };
          if (patient.DOB) {
            patientData.dob = moment(patient.DOB, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD');
          }
          _.each(patientData, (v, k) => {
            v = _.trim(v);
            if (v !== '' && v !== null) {
              patientData[k] = v;
            } else {
              delete patientData[k];
            }
          });
          patientsData.push(patientData);
        });
        return patientService.bulkCreate(patientsData, {transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          message: successMessages.PATIENT_IMPORTED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else if (err && err.name === 'SequelizeUniqueConstraintError') {
          status = 403;
          if (err.fields.patientInternalId !== undefined) {
            message = 'INTERNALID=' + err.fields.patientInternalId + ' .' + errorMessages.PATIENT_INTERNAL_ID_EXIST;
          } else {
            message = errorMessages.UNIQUE_CONSTRAINT_ERROR;
          }
        } else {
          logger.error(err);
          status = 500;
          message = err.message || errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  },
  importOrgPatientMedicalHistory: (req, resp) => {
    const body = req.body;
    let transactionRef;
    const {privateKeyDetails} = req.locals;
    let importData = [];
    let patientInternalIds=[];
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return importDataService.create({
          importedData:body,
          orgApiKeyId:privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        const importedDataId=importedObj.get('id');
        body.medicalHistory.forEach((medicalHistory) => {
          let data = {
            patientInternalId: medicalHistory.InternalID,
            day: medicalHistory.Day,
            month: medicalHistory.Month,
            year: medicalHistory.Year,
            condition: medicalHistory.Condition,
            conditionId: medicalHistory.ConditionID,
            status: medicalHistory.Status,
            side: medicalHistory.Side,
            severity: medicalHistory.Severity,
            acute: medicalHistory.Acute,
            summary: medicalHistory.Summary,
            fracture: medicalHistory.Fracture,
            displaced: medicalHistory.Displaced,
            compound: medicalHistory.Compound,
            comminuted: medicalHistory.Comminuted,
            spiral: medicalHistory.Spiral,
            greenStick: medicalHistory.Greenstick,
            details: medicalHistory.Details,
            importedDataId:importedDataId
          };
          _.each(data, (v, k) => {
            v = _.trim(v);
            if (v !== '' && v !== null) {
              data[k] = v;
            } else {
              delete data[k];
            }
          });
          patientInternalIds.push(medicalHistory.InternalID);
          importData.push(data);
        });

        patientInternalIds=_.uniq(patientInternalIds);
        return patientService.getPatients({
          attributes:['id','patientInternalId','orgId'],
          where:{
            orgId:privateKeyDetails.orgId,
            patientInternalId:patientInternalIds
          }
        });
      })
      .then(patientsObj=>{
        let patientIdAndInternalIdKeyValueObj={};
        patientsObj.map(a=>{
          patientIdAndInternalIdKeyValueObj[a.patientInternalId]=a.id;
        });

        importData.map(a=>{
          a.patientId=patientIdAndInternalIdKeyValueObj[a.patientInternalId];
          return a;
        });
        return patientMedicalHistoryService.bulkCreate(importData,{transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          message: successMessages.PATIENT_MEDICAL_HISTORY_IMPORTED_SUCCESS
        });
      })
      .catch((err) => {
        transactionRef.rollback();
        let message, status;
        if (err && errorMessages[err.message]) {
          status = 403;
          message = errorMessages[err.message];
        } else if (err && err.name === 'SequelizeUniqueConstraintError') {
          status = 403;
          if (err.fields.patientInternalId !== undefined) {
            message = 'INTERNALID=' + err.fields.patientInternalId + ' .' + errorMessages.PATIENT_INTERNAL_ID_EXIST;
          } else {
            message = errorMessages.UNIQUE_CONSTRAINT_ERROR;
          }
        } else {
          logger.error(err);
          status = 500;
          message = err.message || errorMessages.SERVER_ERROR;
        }
        resp.status(status).send({
          success: false,
          message
        });
      });
  },
}

export default operations;
