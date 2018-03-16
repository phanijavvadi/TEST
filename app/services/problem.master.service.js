'use strict';

import models from '../models';

const ProblemsMaster = models.ProblemsMaster;

/**
 * Find all problemsMasters in the db
 *
 **/
export function findAll(options = {}) {
  return ProblemsMaster.findAndCountAll({
    limit: Number(options.limit || 25),
    offset: Number(options.offset || 0),
    where: {
      ...(options.where || {})
    }
  });
}

/**
 * Find all problemsMasters in the db
 *
 **/
export function getOptions(options = {}) {
  return ProblemsMaster.findAll({
    attributes: ['id', 'name', 'description'],
    where: {
      ...(options.where || {})
    }
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
export function findOne(options = {}) {
  return ProblemsMaster.findOne({
    where: {
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
