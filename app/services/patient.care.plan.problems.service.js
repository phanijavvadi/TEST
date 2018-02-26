'use strict';

import models from '../models';

const PatientCarePlanProblems = models.PatientCarePlanProblems;

/**
 * Find all patientCarePlan in the db
 *
 **/
export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientCarePlanProblems.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

/**
 * Find all patientCarePlanProblem in the db
 *
 **/
export function getOptions() {
  return PatientCarePlanProblems.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PatientCarePlanProblems.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientCarePlanProblems.findOne({
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(patientCarePlanProblem, options = {}) {
  return PatientCarePlanProblems.create(patientCarePlanProblem, options);
}

export function update(patientCarePlanProblem, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblems.findById(patientCarePlanProblem.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(patientCarePlanProblem, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_CARE_PLAN_PROBLEM_ID');
    }
  });
}

export function destroy(patientCarePlanProblem, {transaction = null, ...options} = {}) {
  return PatientCarePlanProblems.destroy({
    where: {
      ...patientCarePlanProblem
    }
  }, {transaction});
}
