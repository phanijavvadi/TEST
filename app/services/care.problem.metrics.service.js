'use strict';

import models from '../models';

const CareProblemMetric = models.CareProblemMetric;

export function findAll(options = {}) {
  return CareProblemMetric.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    },
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions() {
  return CareProblemMetric.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return CareProblemMetric.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return CareProblemMetric.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(careProblemMetric, {transaction = null, ...options} = {}) {
  return CareProblemMetric.create(careProblemMetric, {transaction});
}

export function update(careProblemMetric, {transaction = null, ...options} = {}) {
  return CareProblemMetric.findById(careProblemMetric.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(careProblemMetric, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(careProblemMetric) {
  return CareProblemMetric.destroy({
    where: {
      ...careProblemMetric
    }
  });
}
