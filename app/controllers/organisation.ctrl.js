'use strict';
import * as _ from 'lodash';
import models from '../models';
const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgService from '../services/organisation.service';
import * as orgContactDetailService from '../services/org.contact.details.service';

const operations = {
  list: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get organisation list');

    const options = {};
    options.where = {};
    if (req.query.status) {
      options.where.status = +req.query.status;
    }

    if (req.query.searchText) {
      options.where = {
        [Op.or]:[{name:{[Op.iLike]: `%${req.query.searchText}%`}},
          {phoneNo:{[Op.iLike]: `%${req.query.searchText}%`}}]
      }
    }
    return orgService
      .findAll(req.query, options)
      .then((data) => {
        resp.status(200).json(data);
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  getOptions: (req, resp) => {
    logger.info('About to get organisation options');
    return orgService
      .getOptions(req.query)
      .then((data) => {
        resp.status(200).json(data);
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  get: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get organisation ', id);
    let record = null;
    return orgService.findById(id)
      .then((data) => {
        if (data) {
          /* const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
             return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
           })*/
          record = data;
          return record.getContactDetails({
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy'],
            },
            limit: 1,
          });

        } else {
          throw new Error('INVALID_ORG_ID');
        }
      }).then(contactDetails => {
        record = record.get({plain: true});

        record = _.extend(record, {
          contPerId: contactDetails[0].id,
          contPerFname: contactDetails[0].firstName,
          contPerLname: contactDetails[0].lastName,
          contPerEmail: contactDetails[0].email,
          contPerPhoneNo: contactDetails[0].phoneNo,
          contPerTypeId: contactDetails[0].userTypeId
        });

        resp.status(200).json(record);
      }).catch((err) => {
        if (err && err.message === 'INVALID_ORG_ID') {
          return resp.status(404).send(errorMessages.INVALID_ORG_ID);
        }

        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  create: (req, resp) => {
    logger.info('About to create organisation ', organisation);
    const organisation = req.body;
    const {authenticatedUser} = req.locals;
    const orgDetails = {
      name: organisation.name,
      address: organisation.address,
      suburb: organisation.suburb,
      postcode: organisation.postcode,
      state: organisation.state,
      country: organisation.country,
      phoneNo: organisation.phoneNo,
      fax: organisation.fax,
      orgLogo: organisation.orgLogo || null,
      createdBy: authenticatedUser.id
    }
    const orgContPerDetails = {
      firstName: organisation.contPerFname,
      lastName: organisation.contPerLname,
      email: organisation.contPerEmail,
      phoneNo: organisation.contPerPhoneNo,
      createdBy: authenticatedUser.id,
      userTypeId: organisation.contPerTypeId,
    }
    return sequelize.transaction()
      .then((t) => {
        return orgService
          .create(orgDetails, {transaction: t})
          .then((org) => {
            orgContPerDetails.orgId = org.get('id');
            return orgContactDetailService.create(orgContPerDetails, {transaction: t});
          })
          .then((contDetails) => {
            t.commit();
            return resp.json({
              success: true,
              // data: resultObj,
              message: successMessages.ORG_CREATED
            });
          })
          .catch((err) => {
            t.rollback();
            let message = err.message || errorMessages.SERVER_ERROR;
            logger.info(err);
            resp.status(500).send({
              message
            });
          });
      });
  },
  update: (req, resp) => {
    logger.info('About to update organisation ', organisation);
    const organisation = req.body;
    const orgDetails = {
      id: organisation.id,
      name: organisation.name,
      address: organisation.address,
      suburb: organisation.suburb,
      postcode: organisation.postcode,
      state: organisation.state,
      country: organisation.country,
      phoneNo: organisation.phoneNo,
      fax: organisation.fax,
      orgLogo: organisation.orgLogo || null
    }
    const orgContPerDetails = {
      id: organisation.contPerId,
      firstName: organisation.contPerFname,
      lastName: organisation.contPerLname,
      // email: organisation.contPerEmail,
      phoneNo: organisation.contPerPhoneNo,
      userTypeId: organisation.contPerTypeId,

    }
    return sequelize.transaction()
      .then((t) => {
        return orgService
          .update(orgDetails, {transaction: t})
          .then((data) => {
            return orgContactDetailService.update(orgContPerDetails, {transaction: t});
          })
          .then((data) => {
            t.commit();
            return resp.json({
              success: true,
              message: successMessages.ORG_UPDATED
            });
          }).catch(function (err) {
            t.rollback();
            let message = err.message || errorMessages.SERVER_ERROR;
            logger.info(err);

            resp.status(500).send({
              success: false,
              message
            });
          });
      });
  },
  activate: (req, resp) => {
    const data = {
      id: req.body.id,
      status: 1
    }
    logger.info('About to activate organisation ', data);
    return orgService
      .update(data,{})
      .then((res) => {
        resp.json({
          success: true,
          message: successMessages.ORG_UPDATED
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  inActivate: (req, resp) => {
    const data = {
      id: req.body.id,
      status: 2
    }
    logger.info('About to in activate organisation ', data);
    return orgService
      .update(data,{})
      .then((res) => {
        resp.json({
          success: true,
          message: successMessages.ORG_UPDATED
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
