'use strict';

import logger from '../util/logger';
import * as commonUtil from '../util/common.util';
import * as careProblemsService from '../services/care.problems.service';
import * as careProblemMetricsService from '../services/care.problem.metrics.service';
import models from '../models';
const sequelize = models.sequelize;
const Sequelize = require('sequelize');
const Op = Sequelize.Op;


const operations = {
  getOptions: (req, resp) => {
    return careProblemsService
      .getOptions()
      .then((data) => {
        if (data) {
          resp.status(200).json(data);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  },
  getMetrics: (req, resp) => {
    const careProblemId = req.params.careProblemId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        careProblemId: careProblemId,
        status: [1]
      },
      include: [{
        model: models.CareProblemMetricTarget,
        as: 'targets',
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
        }
      }],
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy']
      }
    };
    return careProblemMetricsService
      .findAll(options)
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
