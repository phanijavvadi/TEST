'use strict';

import models from '../models';

const PatientCarePlanProblemMetricActionPlanInput = models.PatientCarePlanProblemMetricActionPlanInput;

export function findById(id, options = {}) {
  return PatientCarePlanProblemMetricActionPlanInput.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findALL(options = {}) {
  return PatientCarePlanProblemMetricActionPlanInput.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}
export function findOne(options = {}) {
  return PatientCarePlanProblemMetricActionPlanInput.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(actionPlanInput, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricActionPlanInput.create(actionPlanInput, {transaction});
}

export function update(actionPlanInput, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblemMetricActionPlanInput.findById(actionPlanInput.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(actionPlanInput, {transaction});
    } else {
      throw new Error('INVALID_INPUT');
    }
  });
}

export function destroy(actionPlanInput) {
  return PatientCarePlanProblemMetricActionPlanInput.destroy({
    where: {
      ...actionPlanInput
    }
  });
}
