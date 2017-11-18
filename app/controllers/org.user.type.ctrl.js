'use strict';

import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgUserTypeService from '../services/org.user.type.service';

const operations = {
  getOptions: (req, resp) => {
    logger.info('About to get organization user type options');
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
