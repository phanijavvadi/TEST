'use strict';

import logger from '../util/logger';
import * as _ from 'lodash';
import errorMessages from '../util/constants/error.messages';
import successMessages from '../util/constants/success.messages';
import * as subscriptionTypeService from '../services/subscription.type.service';

const operations = {
  list: (req, resp) => {
    logger.info('About to get subscription type list');
    return subscriptionTypeService
      .findAll(req.query)
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
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
    logger.info('About to get subscription type options');
    return subscriptionTypeService
      .getOptions()
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
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
    logger.info('About to get subscription type by id', id);

    return subscriptionTypeService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.SUBSCRIPTION_TYPE_NOT_FOUND);
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
    const subscriptionType = req.body;
    logger.info('About to create subscription type', subscriptionType);
    return subscriptionTypeService
      .create(subscriptionType)
      .then((data) => {
        const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
          return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
        });
        resp.json({
          success: true,
          data: resultObj,
          message: successMessages.SUBSCRIPTION_CREATEED
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
    const subscriptionType = req.body;
    logger.info('About to update subscription type', subscriptionType);
    return subscriptionTypeService
      .update(subscriptionType)
      .then(() => {
        resp.json({
          success: true,
          message: successMessages.SUBSCRIPTION_UPDATED
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
