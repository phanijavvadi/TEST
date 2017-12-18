'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const ImportedData = models.ImportedData;

/**
 * Find a patient import data by options
 **/
export function findOne(options = {includeAll: false}) {

  return ImportedData.findOne({
    attributes: options.attributes || {exclude: ['deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new patient import data
 **/
export function create(patient, {transaction = null, ...options} = {}) {
  return ImportedData.create(patient, {transaction});
};
