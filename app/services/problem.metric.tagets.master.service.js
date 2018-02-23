'use strict';

import models from '../models';

const ProblemMetricTargetMaster = models.ProblemMetricTargetMaster;

export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return ProblemMetricTargetMaster.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions() {
  return ProblemMetricTargetMaster.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return ProblemMetricTargetMaster.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return ProblemMetricTargetMaster.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(problemMetricTargetMaster, {transaction = null, ...options} = {}) {
  return ProblemMetricTargetMaster.create(problemMetricTargetMaster, {transaction});
}

export function update(problemMetricTargetMaster, {transaction = null, ...options} = {}) {
  return ProblemMetricTargetMaster.findById(problemMetricTargetMaster.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(problemMetricTargetMaster, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(problemMetricTargetMaster) {
  return ProblemMetricTargetMaster.destroy({
    where: {
      ...problemMetricTargetMaster
    }
  });
}
