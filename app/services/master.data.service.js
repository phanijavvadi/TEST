'use strict';

import models from '../models';

const MasterData = models.MasterData;

export function findAll(options = {}) {
  return MasterData.findAll({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    },
    where: {
      ...(options.where || {})
    }
  });
}

export function getOptions(options = {}) {
  return MasterData.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt','status','order']
    },
    where: {
      ...(options.where || {})
    }
  });
}

export function findById(id, options = {}) {
  return MasterData.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function findOne(options = {}) {
  return MasterData.findOne({
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    attributes: options.attributes || {},
    where: {
      ...options.where || {}
    }
  });
}

export function create(masterData, {transaction = null, ...options} = {}) {
  return MasterData.create(masterData, {transaction});
}

export function update(masterData, {transaction = null, ...options} = {}) {
  return MasterData.findById(masterData.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(masterData, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_PREV_HEALTH_ID');
    }
  });
}

export function destroy(masterData) {
  return MasterData.destroy({
    where: {
      ...masterData
    }
  });
}
