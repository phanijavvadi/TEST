'use strict';

import models from '../models';

const CareProblems = models.CareProblems;

/**
 * Find all careProblems in the db
 *
 **/
export function findAll({limit = 150, offset = 0, ...otherOptions} = {}, options = {}) {
  return CareProblems.findAndCountAll({
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  });
}

/**
 * Find all careProblems in the db
 *
 **/
export function getOptions() {
  return CareProblems.findAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt', 'deletedAt']
    }
  });
}

export function findById(id, options = {}) {
  return CareProblems.findOne({
    where: {
      id: id,
      ...options.where || {}
    }
  });
}

export function create(careProblem,{transaction = null, ...options} = {}) {
  return CareProblems.create(careProblem, {transaction});
}

export function update(careProblem,{transaction = null, ...options} = {}) {
  return CareProblems.findById(careProblem.id, {
    attributes: {
      exclude: [],
    }
  }).then((p) => {
    if (p) {
      return p.update(careProblem, {transaction});
    } else {
      throw new Error('INVALID_CARE_PROBLEM_ID');
    }
  });
}

export function destroy(careProblem) {
  return CareProblems.destroy({
    where: {
      ...careProblem
    }
  });
}
