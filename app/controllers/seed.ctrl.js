'use strict';

import logger from '../util/logger';
import models from '../models';
const operations = {
  seed: (req, resp) => {
    logger.info('About to import seed data ');

    return Promise.all([
      models.Admin.create({userName:'admin',password:'admin'}),
      models.OrgUserType.bulkCreate(
        [
          {

            name: 'Admin',
            value: 'ADMIN',
            isRegNoRequired: true
          }, {

          name: 'Staff',
          value: 'STAFF',
          isRegNoRequired: true,
        }, {

          name: 'Aboriginal and Torres Strait Islander Health Practitioner',
          value: 'ABORIGINAL_AND_TORRES_STRAIT_ISLANDER_HEALTH_PRACTITIONER',
          isRegNoRequired: true,
        }, {

          name: 'Chinese Medicine Practitioner',
          value: 'CHINESE_MEDICINE_PRACTITIONER',
          isRegNoRequired: true,
        }, {

          name: 'Chiropractor',
          value: 'Chiropractor',
          isRegNoRequired: true,
        }])
    ]).then(()=>{
      resp.send('seed completed successfully');

    }).catch((err)=>{
      let message = err.message || errorMessages.SERVER_ERROR;
      logger.info(err);
      resp.status(500).send({
        message
      });
    })
  }
}

export default operations;
