'use strict';

import models from '../models';
import errorMessages from '../../config/error.messages';

const Patient = models.Patient;

/**
 * Find all patient in the db
 *
 **/
export function getOrgPatientList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return Patient.findAndCountAll({
    attributes: {
      exclude: ['createdBy', 'deletedAt', 'password'],
    },
    limit: Number(limit),
    offset: Number(offset),
    distinct: true,
    where: {
      ...(options.where || {})
    }
  })
    ;
};

/**
 * Find a patient by patient id
 * @param patientId
 **/
export function findById(id, options = {includeAll: false}) {
  return Patient.findById(id, {
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : [],
    where: {
      ...(options.where || {})
    }
  });
};

/**
 * Find a patient by options
 **/
export function findOne(options = {includeAll: false}) {

  return Patient.findOne({
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt']},
    include: options.includeAll ? [{all: true}] : (options.include) ? options.include : [],
    where: {
      ...(options.where || {})
    }
  });
};


/**
 * Create a new patient
 * @param patient object literal containing info about a patient
 **/
export function create(patient, {transaction = null, ...options} = {}) {
  return Patient.create(patient, {transaction});
};

/**
 * Update a patient
 * @param patient object literal containing info about a patient
 **/
export function update(patient, {transaction = null, ...options} = {}) {
  return Patient.findById(patient.id, {
    attributes: {
      exclude: ['password'],
    }
  }).then((p) => {
    if (p) {
      return p.update(patient, {transaction});
    } else {
      return new Promise((resolve, reject) => {
        reject({message: errorMessages.INVALID_PATIENT_ID, code: 'INVALID_PATIENT_ID'})
      })
    }
  });
};

/**
 * Delete patient(s) based on input criteria
 * @param patient object literal containing info about a patient
 **/
export function deletePatient(patient) {
  return Patient.destroy({
    where: {
      ...patient
    }
  });
};
