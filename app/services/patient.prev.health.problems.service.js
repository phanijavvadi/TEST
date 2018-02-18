'use strict';

import models from '../models';

const PreventativeHealthProblems = models.PreventativeHealthProblems;

export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PreventativeHealthProblems.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions() {
  return PreventativeHealthProblems.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PreventativeHealthProblems.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PreventativeHealthProblems.findOne({
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(preventativeHealthProblem, {transaction = null, ...options} = {}) {
  return PreventativeHealthProblems.create(preventativeHealthProblem, {transaction});
}

export function bulkCreate(patientCarePlanProblems, {transaction = null, ...options} = {}) {
  return PreventativeHealthProblems.bulkCreate(patientCarePlanProblems, {transaction, individualHooks: true});
}

export function update(preventativeHealthProblem, {transaction = null, ...options} = {}) {
  return PreventativeHealthProblems.findById(preventativeHealthProblem.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(preventativeHealthProblem, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_PROBLEM_ID');
    }
  });
}

export function destroy(preventativeHealthProblem, {transaction = null, ...options} = {}) {
  return PreventativeHealthProblems.destroy({
    where: {
      ...preventativeHealthProblem
    }
  }, {transaction});
}
