'use strict';

import models from '../models';
const PatientMedication = models.PatientMedication;

/**
 * Find all patientMedication in the db
 *
 **/
export function getMedicationList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return PatientMedication.findAndCountAll({
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
 * get patientMedications
 *
 **/
export function getPatientMedication(options = {}) {
  return PatientMedication.findAndCountAll({
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
 * Find a patientMedication by patientMedication id
 * @param patientMedicationId
 **/
export function findById(id, options = {includeAll: false}) {
  return PatientMedication.findById(id, {
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a patientMedication by options
 **/
export function findOne(options = {includeAll: false}) {

  return PatientMedication.findOne({
    attributes: options.attributes || {exclude: ['createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new patientMedication
 * @param patientMedication object literal containing info about a patientMedication
 **/
export function create(patientMedication, {transaction = null, ...options} = {}) {
  return PatientMedication.create(patientMedication, {transaction});
};
/**
 * Create a new patientMedications
 **/
export function bulkCreate(patientMedications, {transaction = null, ...options} = {}) {
  return PatientMedication.bulkCreate(patientMedications, {transaction});
};

/**
 * Update a patientMedication
 * @param patientMedication object literal containing info about a patientMedication
 **/
export function update(patientMedication, {transaction = null, ...options} = {}) {
  return PatientMedication.findById(patientMedication.id).then((p) => {
    if (p) {
      return p.update(patientMedication, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_MEDICATION_ID');
    }
  });
};

/**
 * Delete patientMedication(s) based on input criteria
 * @param patientMedication object literal containing info about a patientMedication
 **/
export function deletePatientMedication(patientMedication) {
  return PatientMedication.destroy({
    where: {
      ...patientMedication
    }
  });
};
