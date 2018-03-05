'use strict';

import models from '../models';

const PatientDevice = models.PatientDevice;

export function findById(id, options = {}) {
  return PatientDevice.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientDevice.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}
export function findAll(options = {}) {
  return PatientDevice.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(data, options = {}) {
  return PatientDevice.create(data, options);
}

export function update(data, options = {}) {
  return PatientDevice.findById(data.id, {
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
  return PatientDevice.destroy({
    where: {
      ...data
    }
  }, options);
}
