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
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        status: [1]
      },
      attributes: {
        exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy','status']
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
  },
  getMetric: (req, resp) => {
    const metricId = req.params.metricId;
    const {authenticatedUser, tokenDecoded} = req.locals;
    const options = {
      where: {
        id: metricId,
        status: [1]
      },
      include: [{
        model: models.CareProblemMetricTarget,
        as: 'targets',
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
        }
      }, {
        model: models.CareProblemMetricActionPlan,
        as: 'actionPlans',
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
        },
        include: [
          {
            model: models.CareProblemMetricActionPlanInput,
            as: 'actionPlanInputs',
            attributes: {
              exclude: ['deletedAt', 'createdAt', 'updatedAt', 'createdBy', 'status']
            },
            include: [
              {
                model: models.CareProblemMetricActionPlanInputOption,
                as: 'actionPlanInputOptions',
                attributes: {
                  exclude: ['deletedAt', 'createdAt', 'updatedAt', 'status']
                }
              },
              {
                model: models.MasterData,
                as: 'inputType',
                attributes: {
                  exclude: ['deletedAt', 'createdAt', 'updatedAt', 'order', 'status']
                }
              },
              {
                model: models.MasterData,
                as: 'uom',
                attributes: {
                  exclude: ['deletedAt', 'createdAt', 'updatedAt', 'order', 'status']
                }
              }

            ]
          }
        ]
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
