'use strict';

import models from '../models';

const PatientNotification = models.PatientNotification;

export function findById(id, options = {}) {
  return PatientNotification.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PatientNotification.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}
export function findAll(options = {}) {
  return PatientNotification.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(data, options = {}) {
  return PatientNotification.create(data, options);
}

export function update(data, options = {}) {
  return PatientNotification.findById(data.id, {
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
  return PatientNotification.destroy({
    where: {
      ...data
    }
  }, options);
}
