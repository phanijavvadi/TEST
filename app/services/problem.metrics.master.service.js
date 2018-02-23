'use strict';

import models from '../models';

const ProblemMetricsMaster = models.ProblemMetricsMaster;

export function findAll(options = {}) {
  return ProblemMetricsMaster.findAll({
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
  return ProblemMetricsMaster.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return ProblemMetricsMaster.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return ProblemMetricsMaster.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(problemMetricsMaster, {transaction = null, ...options} = {}) {
  return ProblemMetricsMaster.create(problemMetricsMaster, {transaction});
}

export function update(problemMetricsMaster, {transaction = null, ...options} = {}) {
  return ProblemMetricsMaster.findById(problemMetricsMaster.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(problemMetricsMaster, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(problemMetricsMaster) {
  return ProblemMetricsMaster.destroy({
    where: {
      ...problemMetricsMaster
    }
  });
}
