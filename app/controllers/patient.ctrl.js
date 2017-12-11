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

import * as patientService from '../services/patient.service';
import * as patientImportDataService from '../services/patient.import.data.service';

const operations = {
  getOrgPatientList: (req, resp) => {
    logger.info('About to get organisation patient list');
    const {authenticatedUser} = req.locals;
    const options = {};
    options.where = {};

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
    const {authenticatedUser} = req.locals;
    logger.info('About to get patient ', id);
    const options = {};
    /**
     * filter patient by organisation id
     * */
    if (authenticatedUser.userCategory.value === constants.userCategoryTypes.ORG_USER) {
      let userOrgIds = _.map(authenticatedUser.userRoles, (role) => {
        return role.orgId;
      });
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
  importOrgPatient: (req, resp) => {
    const body = req.body;
    let transactionRef,createdPatient;
    const patientNumber = Math.random().toString(36).slice(-10);
    const {otherUserRoles, practitioner, organization, userCategory, authenticatedUser} = req.locals;
    const patientData = {
      firstName: body.FIRSTNAME,
      surName: body.SURNAME,
      middleName: body.MIDDLENAME,
      patientNumber: patientNumber,
      dob: body.DATEOFDEATH,
      gender: body.SEXCODE,
      address1: body.ADDRESS1,
      address2: body.ADDRESS2,
      city: body.CITY,
      postcode: body.POSTCODE,
      postalAddress: body.POSTALADDRESS,
      postalCity: body.POSTALCITY,
      postalPostcode: body.POSTALPOSTCODE,
      phoneNo: body.HOMEPHONE,
      mobileNo: body.MOBILEPHONE,
      orgId:organization.id
    };

    return sequelize.transaction()
      .then((t) => {
        transactionRef = t;
        return patientService.create(patientData, {transaction: transactionRef});
      }).then((patient) => {
        createdPatient=patient;
        const patientImportData={
          patientId:patient.get('id'),
          importedData:body
        }
        return patientImportDataService.create(patientImportData, {transaction: transactionRef});
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
}

export default operations;
