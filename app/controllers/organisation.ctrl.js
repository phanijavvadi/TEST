'use strict';
import * as _ from 'lodash';

const Sequelize = models.sequelize;
import logger from '../util/logger';
import models from '../models';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgService from '../services/organisation.service';
import * as orgContactDetailService from '../services/org.contact.details.service';

const operations = {
  list: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get organisation list');

    return orgService
      .findAll(req.query)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        } else {
          resp.status(404).send(errorMessages.INVALID_ORG_ID);
        }
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

    return orgService.findById(id, {includeOrgUserType: true})
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          })
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.INVALID_ORG_ID);
        }
      }).catch((err) => {
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
      createdBy: authenticatedUser.id
    }
    return Sequelize.transaction()
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
      email: organisation.contPerEmail,
      phoneNo: organisation.contPerPhoneNo
    }
    return Sequelize.transaction()
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
      .update(data)
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
      .update(data)
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
