'use strict';

import models from '../models';

const PatientPreventiveActivities = models.PatientPreventiveActivities;

export function getAll(options = {}) {
  return PatientPreventiveActivities.findAll({
    include: options.include || [
      {
        model: models.PatientPrevetiveActivityMetric,
        as: 'metrics',
        attributes: {
          exclude: ['deletedAt', 'createdAt', 'updatedAt', 'created_by']
        }
      }
    ],
    where: {
      ...(options.where || {})
    }
  });
}


export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientPreventiveActivities.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}
export function getOptions() {
  return PatientPreventiveActivities.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PatientPreventiveActivities.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientPreventiveActivities.findOne({
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(data, options = {}) {
  return PatientPreventiveActivities.create(data, options);
}

export function update(data, {transaction = null, ...options} = {}) {
  return PatientPreventiveActivities.findById(data.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(data, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_CARE_PLAN_PROBLEM_ID');
    }
  });
}

export function destroy(data, {transaction = null, ...options} = {}) {
  return PatientPreventiveActivities.destroy({
    where: {
      ...data
    }
  }, {transaction});
}
