'use strict';

import models from '../models';

const PatientCarePlan = models.PatientCarePlan;

/**
 * Find all patientCarePlan in the db
 *
 **/
export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientCarePlan.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

/**
 * Find all patientCarePlan in the db
 *
 **/
export function getOptions() {
  return PatientCarePlan.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PatientCarePlan.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientCarePlan.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(patientCarePlan, options = {}) {
  return PatientCarePlan.create(patientCarePlan, options);
}

export function update(patientCarePlan, options = {}) {
  return PatientCarePlan.findById(patientCarePlan.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(patientCarePlan, options);
    } else {
      throw new Error('INVALID_PATIENT_CARE_PLAN_ID');
    }
  });
}

export function destroy(patientCarePlan) {
  return PatientCarePlan.destroy({
    where: {
      ...patientCarePlan
    }
  });
}
