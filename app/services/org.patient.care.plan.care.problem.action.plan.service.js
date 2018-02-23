'use strict';

import models from '../models';

const PatientCarePlanProblemMetricActionPlan = models.PatientCarePlanProblemMetricActionPlan;

export function findById(id, options = {}) {
  return PatientCarePlanProblemMetricActionPlan.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findALL(options = {}) {
  return PatientCarePlanProblemMetricActionPlan.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}
export function findOne(options = {}) {
  return PatientCarePlanProblemMetricActionPlan.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(carePlanProblemMetricActionPlan, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricActionPlan.create(carePlanProblemMetricActionPlan, {transaction});
}

export function update(carePlanProblemMetricActionPlan, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricActionPlan.findById(carePlanProblemMetricActionPlan.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(carePlanProblemMetricActionPlan, {transaction});
    } else {
      throw new Error('INVALID_INPUT');
    }
  });
}

export function destroy(carePlanProblemMetricActionPlan) {
  return PatientCarePlanProblemMetricActionPlan.destroy({
    where: {
      ...carePlanProblemMetricActionPlan
    }
  });
}
