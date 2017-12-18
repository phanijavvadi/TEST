'use strict';

import models from '../models';
const PatientFamilyHistory = models.PatientFamilyHistory;

/**
 * Find all patientFamilyHistory in the db
 *
 **/
export function getFamilyHistoryList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientFamilyHistory.findAndCountAll({
    attributes: {
      exclude: ['createdAt', 'updatedAt','deletedAt', 'importedDataId','orgId'],
    },
    limit: Number(limit),
    offset: Number(offset),
    where: {
      ...(options.where || {})
    }
  })
    ;
};
/**
 * get patientFamilyHistorys
 *
 **/
export function getPatientFamilyHistory(options = {}) {
  return PatientFamilyHistory.findAndCountAll({
    attributes:options.attributes ||  {
      exclude: ['createdAt', 'updatedAt','deletedAt', 'importedDataId','orgId'],
    },
    where: {
      ...(options.where || {})
    }
  })
    ;
};

/**
 * Find a patientFamilyHistory by patientFamilyHistory id
 * @param patientFamilyHistoryId
 **/
export function findById(id, options = {includeAll: false}) {
  return PatientFamilyHistory.findById(id, {
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a patientFamilyHistory by options
 **/
export function findOne(options = {includeAll: false}) {

  return PatientFamilyHistory.findOne({
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new patientFamilyHistory
 * @param patientFamilyHistory object literal containing info about a patientFamilyHistory
 **/
export function create(patientFamilyHistory, {transaction = null, ...options} = {}) {
  return PatientFamilyHistory.create(patientFamilyHistory, {transaction});
};
/**
 * Create a new patientFamilyHistorys
 **/
export function bulkCreate(patientFamilyHistorys, {transaction = null, ...options} = {}) {
  return PatientFamilyHistory.bulkCreate(patientFamilyHistorys, {transaction});
};

/**
 * Update a patientFamilyHistory
 * @param patientFamilyHistory object literal containing info about a patientFamilyHistory
 **/
export function update(patientFamilyHistory, {transaction = null, ...options} = {}) {
  return PatientFamilyHistory.findById(patientFamilyHistory.id).then((p) => {
    if (p) {
      return p.update(patientFamilyHistory, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_FAMILY_HISTORY__ID');
    }
  });
};

/**
 * Delete patientFamilyHistory(s) based on input criteria
 * @param patientFamilyHistory object literal containing info about a patientFamilyHistory
 **/
export function deletePatientFamilyHistory(patientFamilyHistory) {
  return PatientFamilyHistory.destroy({
    where: {
      ...patientFamilyHistory
    }
  });
};
