'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as careProblemsService from '../services/care.problems.service';

const operations = {
  getOptions: (req, resp) => {
    logger.info('About to get subscription type options');
    return careProblemsService
      .getOptions()
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  }
};

export default operations;
