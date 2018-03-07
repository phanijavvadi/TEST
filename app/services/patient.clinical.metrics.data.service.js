'use strict';

import models from '../models';

const PatientClinicalMetricData = models.PatientClinicalMetricData;

export function findById(id, options = {}) {
  return PatientClinicalMetricData.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientClinicalMetricData.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function findAndCountAll(options = {}) {
  return PatientClinicalMetricData.findAndCountAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    limit: Number(options.limit || 10),
    offset: Number(options.offset || 0),
    where: {
      ...options.where || {}
    },
    order: options.order || [],
    raw: true
  });
}

export function create(data, options = {}) {
  return PatientClinicalMetricData.create(data, options);
}

export function update(data, options = {}) {
  return PatientClinicalMetricData.findById(data.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(data, options);
    } else {
      throw new Error('INVALID_INPUT');
    }
  });
}

export function destroy(data, options = {}) {
  return PatientClinicalMetricData.destroy({
    where: {
      ...data
    }
  }, options);
}
