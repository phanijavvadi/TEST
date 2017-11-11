'use strict';

import logger from '../util/logger';
import * as _ from 'lodash';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgService from '../services/organization.service';

const operations = {
  get: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get organization ', id);

    return orgService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          })
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.INVALID_ORG_ID);
        }
      })
  },
  create: (req, resp) => {
    const organization = req.body;
    logger.info('About to create organization ', organization);
    return orgService
      .create(organization)
      .then((data) => {
        const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
          return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
        })
        resp.json({
          success: true,
          data: resultObj,
          message: successMessages.ADMIN_USER_CREATED_SCUCCESS
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  update: (req, resp) => {
    const organization = req.body;
    logger.info('About to update organization ', organization);
    return orgService
      .update(organization)
      .then((data) => {
        resp.json({
          success: true,
          message: successMessages.ADMIN_USER_UPDATED_SCUCCESS
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
