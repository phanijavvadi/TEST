'use strict';

import logger from '../util/logger';
import * as _ from 'lodash';
import * as commonUtil from '../util/common.util';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgService from '../services/organisation.service';

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
    const organisation = req.body;
    logger.info('About to create organisation ', organisation);
    return orgService
      .create(organisation)
      .then((data) => {
        const resultObj = _.pickBy(data.get({plain: true}), (value, key) => {
          return ['deletedAt', 'updatedAt', 'createdAt'].indexOf(key) === -1;
        })
        resp.json({
          success: true,
          data: resultObj,
          message: successMessages.ORG_CREATED
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
    const organisation = req.body;
    logger.info('About to update organisation ', organisation);
    return orgService
      .update(organisation)
      .then((data) => {
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
