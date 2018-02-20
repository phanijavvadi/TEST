'use strict';

import models from '../models';

const CareProblemMetricTarget = models.CareProblemMetricTarget;

export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return CareProblemMetricTarget.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions() {
  return CareProblemMetricTarget.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return CareProblemMetricTarget.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return CareProblemMetricTarget.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(careProblemMetricTarget, {transaction = null, ...options} = {}) {
  return CareProblemMetricTarget.create(careProblemMetricTarget, {transaction});
}

export function update(careProblemMetricTarget, {transaction = null, ...options} = {}) {
  return CareProblemMetricTarget.findById(careProblemMetricTarget.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(careProblemMetricTarget, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(careProblemMetricTarget) {
  return CareProblemMetricTarget.destroy({
    where: {
      ...careProblemMetricTarget
    }
  });
}
