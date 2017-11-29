'use strict';

import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as orgUserTypeService from '../services/user.type.service';

const operations = {
  getOrgTypeslist: (req, resp) => {
    logger.info('About to get organisation user type options');
    return orgUserTypeService
      .getOrgTypeslist(req.query)
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
  getOrgUserTypeOptions: (req, resp) => {
    logger.info('About to get organisation user type options');
    const options={where:{}};
    if(req.query.type){
      options.where['$userSubCategory.value$']=req.query.type;
    }
    return orgUserTypeService
      .getOrgUserTypeOptions(options)
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
