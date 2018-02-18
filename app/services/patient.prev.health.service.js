'use strict';

import models from '../models';

const PreventativeHealth = models.PreventativeHealth;

export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return PreventativeHealth.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions() {
  return PreventativeHealth.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return PreventativeHealth.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return PreventativeHealth.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(preventativeHealth, {transaction = null, ...options} = {}) {
  return PreventativeHealth.create(preventativeHealth, {transaction});
}

export function update(preventativeHealth, {transaction = null, ...options} = {}) {
  return PreventativeHealth.findById(preventativeHealth.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(preventativeHealth, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(preventativeHealth) {
  return PreventativeHealth.destroy({
    where: {
      ...preventativeHealth
    }
  });
}
