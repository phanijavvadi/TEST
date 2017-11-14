'use strict';

import logger from '../util/logger';
import * as _ from 'lodash';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgUserService from '../services/org.user.service';

const operations = {
  list: (req, resp) => {
    logger.info('About to get organization user list');
    return orgUserService
      .findAll(req.query)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      })
  },
  get: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get organization user ', id);

    return orgUserService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.ORG_USER_NOT_FOUND);
        }
      })
  },
  create: (req, resp) => {
    const orgUser = req.body;
    logger.info('About to create organization user', orgUser);
    return orgUserService
      .create(orgUser)
      .then((data) => {
        const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
          return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
        });
        resp.json({
          success: true,
          data: resultObj,
          message: successMessages.ORG_USER_CREATED
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
    const orgUser = req.body;
    logger.info('About to update organization user', orgUser);
    return orgUserService
      .update(orgUser)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.ORG_USER_UPDATED
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
