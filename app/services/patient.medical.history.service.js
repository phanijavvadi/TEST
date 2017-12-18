'use strict';

import models from '../models';
const PatientMedicalHistory = models.PatientMedicalHistory;

/**
 * Find all patientMedicalHistory in the db
 *
 **/
export function getOrgPatientMedicalHistoryList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientMedicalHistory.findAndCountAll({
    attributes: {
      exclude: ['createdBy', 'deletedAt', 'password','registered'],
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
 * get patientMedicalHistorys
 *
 **/
export function getPatientMedicalHistory(options = {}) {
  return PatientMedicalHistory.findAndCountAll({
    attributes:options.attributes ||  {
      exclude: ['createdBy', 'deletedAt', 'password','registered'],
    },
    where: {
      ...(options.where || {})
    }
  })
    ;
};

/**
 * Find a patientMedicalHistory by patientMedicalHistory id
 * @param patientMedicalHistoryId
 **/
export function findById(id, options = {includeAll: false}) {
  return PatientMedicalHistory.findById(id, {
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a patientMedicalHistory by options
 **/
export function findOne(options = {includeAll: false}) {

  return PatientMedicalHistory.findOne({
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new patientMedicalHistory
 * @param patientMedicalHistory object literal containing info about a patientMedicalHistory
 **/
export function create(patientMedicalHistory, {transaction = null, ...options} = {}) {
  return PatientMedicalHistory.create(patientMedicalHistory, {transaction});
};
/**
 * Create a new patientMedicalHistorys
 **/
export function bulkCreate(patientMedicalHistorys, {transaction = null, ...options} = {}) {
  return PatientMedicalHistory.bulkCreate(patientMedicalHistorys, {transaction});
};

/**
 * Update a patientMedicalHistory
 * @param patientMedicalHistory object literal containing info about a patientMedicalHistory
 **/
export function update(patientMedicalHistory, {transaction = null, ...options} = {}) {
  return PatientMedicalHistory.findById(patientMedicalHistory.id).then((p) => {
    if (p) {
      return p.update(patientMedicalHistory, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_MEDICAL_HISTORY__ID');
    }
  });
};

/**
 * Delete patientMedicalHistory(s) based on input criteria
 * @param patientMedicalHistory object literal containing info about a patientMedicalHistory
 **/
export function deletePatientMedicalHistory(patientMedicalHistory) {
  return PatientMedicalHistory.destroy({
    where: {
      ...patientMedicalHistory
    }
  });
};
