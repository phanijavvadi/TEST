'use strict';

import models from '../models';

const PatientPrventiveHealth = models.PatientPrventiveHealth;

export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientPrventiveHealth.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}
export function getOptions() {
  return PatientPrventiveHealth.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PatientPrventiveHealth.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientPrventiveHealth.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(data, options = {}) {
  return PatientPrventiveHealth.create(data, options);
}

export function update(data, options = {}) {
  return PatientPrventiveHealth.findById(data.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(data, options);
    } else {
      throw new Error('INVALID_PATIENT_PH_ID');
    }
  });
}

export function destroy(data) {
  return PatientPrventiveHealth.destroy({
    where: {
      ...data
    }
  });
}
