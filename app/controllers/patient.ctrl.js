'use strict';

import models from '../models';

const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import logger from '../util/logger';
import * as _ from 'lodash';
import moment from 'moment';
import twilio from 'twilio';

import errorMessages from '../util/constants/error.messages';
import successMessages from '../util/constants/success.messages';
import constants from '../util/constants/constants';
import * as commonUtil from '../util/common.util';


import * as patientService from '../services/patient.service';
import * as patientMedicalHistoryService from '../services/patient.medical.history.service';
import * as patientFamilyHistoryService from '../services/patient.family.history.service';
import * as patientMedicationsService from '../services/patient.medications.service';
import * as importDataService from '../services/import.data.service';
import * as config from '../../config/config';

const client = new twilio(config.TWILIO_ACCOUNTSID, config.TWILIO_AUTHTOKEN);

const operations = {
  getOrgPatientList: (req, resp, next) => {
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
        commonUtil.handleException(err, req, resp, next);
      });
  },
  get: (req, resp, next) => {
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
    return patientService.findById(id, options)
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
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMedicalHistory: (req, resp, next) => {
    const id = req.params.id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    logger.info('About to get patient medical history ', id);
    const options = {
      where: {
        patientId: id
      }
    };
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
    return patientMedicalHistoryService.getMedicalHistoryList(req.query, options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        } else {
          resp.status(404).send(errorMessages.INVALID_PATIENT_ID);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getFamilyHistoryList: (req, resp, next) => {
    const id = req.params.id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    logger.info('About to get patient medical history ', id);
    const options = {
      where: {
        patientId: id
      }
    };
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
    return patientFamilyHistoryService.getFamilyHistoryList(req.query, options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        } else {
          resp.status(404).send(errorMessages.INVALID_PATIENT_ID);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMedicationList: (req, resp, next) => {
    const id = req.params.id;
    const {authenticatedUser, tokenDecoded} = req.locals;
    logger.info('About to get patient medical history ', id);
    const options = {
      where: {
        patientId: id
      }
    };
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
    return patientMedicationsService.getMedicationList(req.query, options)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        } else {
          resp.status(404).send(errorMessages.INVALID_PATIENT_ID);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  signUp: (req, resp, next) => {
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
            commonUtil.handleException(err, req, resp, next);
          });
      });
  },
  signIn: (req, resp, next) => {
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
        commonUtil.handleException(err, req, resp, next);
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
          importedData: body,
          orgApiKeyId: privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        body.data.forEach((patient) => {
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
            importedDataId: importedObj.get('id')
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
    let patientInternalIds = [];
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return importDataService.create({
          importedData: body,
          orgApiKeyId: privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        const importedDataId = importedObj.get('id');
        body.data.forEach((medicalHistory) => {
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
            importedDataId: importedDataId,
            orgId: privateKeyDetails.orgId,
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

        patientInternalIds = _.uniq(patientInternalIds);
        return patientService.getPatients({
          attributes: ['id', 'patientInternalId', 'orgId'],
          where: {
            orgId: privateKeyDetails.orgId,
            patientInternalId: patientInternalIds
          }
        });
      })
      .then(patientsObj => {
        let patientIdAndInternalIdKeyValueObj = {};
        patientsObj.map(a => {
          patientIdAndInternalIdKeyValueObj[a.patientInternalId] = a.id;
        });

        importData.map(a => {
          a.patientId = patientIdAndInternalIdKeyValueObj[a.patientInternalId];
          return a;
        });
        return patientMedicalHistoryService.bulkCreate(importData, {transaction: transactionRef});
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
  importOrgPatientFamilyHistory: (req, resp) => {
    const body = req.body;
    let transactionRef;
    const {privateKeyDetails} = req.locals;
    let importData = [];
    let patientInternalIds = [];
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return importDataService.create({
          importedData: body,
          orgApiKeyId: privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        const importedDataId = importedObj.get('id');
        body.data.forEach((familyHistory) => {
          let data = {
            patientInternalId: familyHistory.InternalID,
            relationName: familyHistory.RelationName,
            condition: familyHistory.Condition,
            diseaseCode: familyHistory.DiseaseCode,
            comment: familyHistory.Comment,
            orgId: privateKeyDetails.orgId,
            importedDataId: importedDataId
          };
          _.each(data, (v, k) => {
            v = _.trim(v);
            if (v !== '' && v !== null) {
              data[k] = v;
            } else {
              delete data[k];
            }
          });
          patientInternalIds.push(familyHistory.InternalID);
          importData.push(data);
        });

        patientInternalIds = _.uniq(patientInternalIds);
        return patientService.getPatients({
          attributes: ['id', 'patientInternalId', 'orgId'],
          where: {
            orgId: privateKeyDetails.orgId,
            patientInternalId: patientInternalIds
          }
        });
      })
      .then(patientsObj => {
        let patientIdAndInternalIdKeyValueObj = {};
        patientsObj.map(a => {
          patientIdAndInternalIdKeyValueObj[a.patientInternalId] = a.id;
        });

        importData.map(a => {
          a.patientId = patientIdAndInternalIdKeyValueObj[a.patientInternalId];
          return a;
        });
        return patientFamilyHistoryService.bulkCreate(importData, {transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          message: successMessages.PATIENT_FAMILY_HISTORY_IMPORTED_SUCCESS
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
  importOrgPatientMedications: (req, resp) => {
    const body = req.body;
    let transactionRef;
    const {privateKeyDetails} = req.locals;
    let importData = [];
    let patientInternalIds = [];
    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return importDataService.create({
          importedData: body,
          orgApiKeyId: privateKeyDetails.id
        }, {transaction: transactionRef});
      }).then((importedObj) => {
        const importedDataId = importedObj.get('id');
        body.data.forEach((medication) => {
          let data = {
            patientInternalId: medication.InternalID,
            productName: medication.ProductName,
            productDescription: medication.ProductDescription,
            dose: medication.Dose,
            frequency: medication.Frequency,
            food: medication.Food,
            otherDetail: medication.OtherDetail,
            PRN: medication.PRN,
            instructions: medication.Instructions,
            route: medication.Route,
            quantity: medication.Quantity,
            productUnit: medication.ProductUnit,
            repeats: medication.Repeats,
            repeatInterval: medication.RepeatInterval,
            SAHCNo: medication.SAHCNo,
            userId: medication.UserID,
            restrictionCode: medication.RestrictionCode,
            authority: medication.Authority,
            authorityNumber: medication.AuthorityNumber,
            approvalNumber: medication.ApprovalNumber,
            allowSubscription: medication.AllowSubstitution,
            regulation24: medication.Regulation24,
            provider: medication.Provider,
            SCID: medication.SCID,
            orgId: privateKeyDetails.orgId,
            importedDataId: importedDataId
          };
          if (medication.ScriptDate) {
            data.scriptDate = moment(medication.ScriptDate, 'YYYY-MM-DD HH:mm:ss').format('YYYY-MM-DD HH:mm:ss');
          }
          _.each(data, (v, k) => {
            v = _.trim(v);
            if (v !== '' && v !== null) {
              data[k] = v;
            } else {
              delete data[k];
            }
          });
          patientInternalIds.push(medication.InternalID);
          importData.push(data);
        });

        patientInternalIds = _.uniq(patientInternalIds);
        return patientService.getPatients({
          attributes: ['id', 'patientInternalId', 'orgId'],
          where: {
            orgId: privateKeyDetails.orgId,
            patientInternalId: patientInternalIds
          }
        });
      })
      .then(patientsObj => {
        let patientIdAndInternalIdKeyValueObj = {};
        patientsObj.map(a => {
          patientIdAndInternalIdKeyValueObj[a.patientInternalId] = a.id;
        });

        importData.map(a => {
          a.patientId = patientIdAndInternalIdKeyValueObj[a.patientInternalId];
          return a;
        });
        return patientMedicationsService.bulkCreate(importData, {transaction: transactionRef});
      })
      .then(res => {
        transactionRef.commit();
        return resp.json({
          success: true,
          message: successMessages.PATIENT_MEDICATIONS_IMPORTED_SUCCESS
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
  sendInvitationMessage: (req, resp, next) => {
    const body = req.body;
    logger.info('About to get patient ', body.id);
    const options = {
      where: {},
      attributes: ['id', 'patientNumber', 'firstName', 'middleName', 'surName']
    };

    return patientService.findById(body.patientId, options)
      .then((data) => {
        if (!data) {
          throw new Error('INVALID_PATIENT_ID');
        }
        return client.messages.create({
          body: body.message,
          to: body.mobileNo,
          from: '+61417409688',
        })
      }).then((message) => {
        return resp.json({
          success: true,
          message: successMessages.PATIENT_INVITATION_SENT_SUCCESS
        });
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },


  updateProfilePic: (req, resp) => {
    const data = req.body;
    logger.info('About to updateProfilePic');
    return patientService
      .update(data)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.PATIENT_UPDATED_SUCCESS
        });
      }).catch((err) => {
        commonUtil.handleException(err, req, resp);
      });
  },
}

export default operations;
