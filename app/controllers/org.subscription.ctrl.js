'use strict';

import logger from '../util/logger';
import * as _ from 'lodash';
import moment from 'moment';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgSubscriptionService from '../services/org.subscription.service';


const operations = {
  list: (req, resp) => {
    logger.info('About to get org subscription list');
    return orgSubscriptionService
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

  get: (req, resp) => {
    const id = req.params.id;
    logger.info('About to get org subscription by id', id);

    return orgSubscriptionService.findById(id)
      .then((data) => {
        if (data) {
          const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
            return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
          });
          resp.status(200).json(resultObj);
        } else {
          resp.status(404).send(errorMessages.INVALID_ORG_SUBSCRIPTION_ID);
        }
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  subscribe: (req, resp) => {
    const subscriptionType = req.body;
    subscriptionType.price = req.locals.subscriptionType.price;
    subscriptionType.validUpTo = moment().add(req.locals.subscriptionType.validity, 'days').format('YYYY-MM-DD');
    subscriptionType.name = req.locals.subscriptionType.name;
    subscriptionType.status = 1;
    logger.info('About to create org subscription', subscriptionType);
    return orgSubscriptionService
      .create(subscriptionType)
      .then((data) => {
        const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
          return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
        });
        resp.json({
          success: true,
          data: resultObj,
          message: successMessages.ORG_SUBSCRIPTION_CREATEED
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
  unSubscribe: (req, resp) => {
    const subscriptionType = req.body;
    subscriptionType.status = 2;
    logger.info('About to create org subscription', subscriptionType);
    return orgSubscriptionService
      .update(subscriptionType)
      .then((data) => {
        resp.json({
          success: true,
          message: successMessages.ORG_UN_SUBSCRIBED_SUCCESS
        });
      }).catch((err) => {
        let message = err.message || errorMessages.SERVER_ERROR;
        logger.info(err);
        resp.status(500).send({
          message
        });
      });
  },
}

export default operations;
