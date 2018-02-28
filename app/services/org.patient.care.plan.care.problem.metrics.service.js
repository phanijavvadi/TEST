'use strict';

import models from '../models';

const PatientCarePlanProblemMetric = models.PatientCarePlanProblemMetric;

export function findById(id, options = {}) {
  return PatientCarePlanProblemMetric.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientCarePlanProblemMetric.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(carePlanProblemMetric, options = {}) {
  return PatientCarePlanProblemMetric.create(carePlanProblemMetric, options);
}

export function update(carePlanProblemMetric, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetric.findById(carePlanProblemMetric.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(carePlanProblemMetric, {transaction});
    } else {
      throw new Error('INVALID_INPUT');
    }
  });
}

export function destroy(carePlanProblemMetric, options = {}) {
  return PatientCarePlanProblemMetric.destroy({
    where: {
      ...carePlanProblemMetric
    }
  }, options);
}
