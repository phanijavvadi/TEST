'use strict';

import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgUserTypeService from '../services/user.type.service';

const operations = {
  list: (req, resp) => {
    logger.info('About to get organisation user type options');
    return orgUserTypeService
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
    logger.info('About to get organisation user type options');
    return orgUserTypeService
      .getOptions(req.query)
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

}

export default operations;
