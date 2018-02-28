'use strict';

import models from '../models';

const ProblemsMaster = models.ProblemsMaster;

/**
 * Find all problemsMasters in the db
 *
 **/
export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return ProblemsMaster.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

/**
 * Find all problemsMasters in the db
 *
 **/
export function getOptions() {
  return ProblemsMaster.findAll({
    attributes: ['id', 'name', 'description']
  });
}

export function findById(id, options = {}) {
  return ProblemsMaster.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function create(problemsMaster, {transaction = null, ...options} = {}) {
  return ProblemsMaster.create(problemsMaster, {transaction});
}

export function update(problemsMaster, {transaction = null, ...options} = {}) {
  return ProblemsMaster.findById(problemsMaster.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(problemsMaster, {transaction});
    } else {
      throw new Error('INVALID_CARE_PROBLEM_ID');
    }
  });
}

export function destroy(problemsMaster) {
  return ProblemsMaster.destroy({
    where: {
      ...problemsMaster
    }
  });
}
