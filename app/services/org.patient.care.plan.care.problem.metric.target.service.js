'use strict';

import models from '../models';

const PatientCarePlanProblemMetricTarget = models.PatientCarePlanProblemMetricTarget;

export function findById(id, options = {}) {
  return PatientCarePlanProblemMetricTarget.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientCarePlanProblemMetricTarget.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}
export function create(carePlanProblemMetricTarget, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricTarget.create(carePlanProblemMetricTarget, {transaction});
}

export function update(carePlanProblemMetricTarget, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricTarget.findById(carePlanProblemMetricTarget.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(carePlanProblemMetricTarget, {transaction});
    } else {
      throw new Error('INVALID_INPUT');
    }
  });
}
export function destroy(carePlanProblemMetricTarget) {
  return PatientCarePlanProblemMetricTarget.destroy({
    where: {
      ...carePlanProblemMetricTarget
    }
  });
}
