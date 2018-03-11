'use strict';

import models from '../models';
import errorMessages from '../util/constants/error.messages';

const Patient = models.Patient;

/**
 * Find all patient in the db
 *
 **/
export function getOrgPatientList({limit = 50, offset = 0, ...otherOptions} = {}, options = {}) {
  return Patient.findAndCountAll({
    attributes: {
      exclude: ['createdBy', 'deletedAt', 'password', 'registered'],
    },
    include: options.include || [],
    limit: Number(limit),
    offset: Number(offset),
    distinct:'id',
    where: {
      ...(options.where || {})
    }
  })
    ;
};

/**
 * get patients
 *
 **/
export function getPatients(options = {}) {
  return Patient.findAll({
    attributes: options.attributes || {
      exclude: ['createdBy', 'deletedAt', 'password', 'registered'],
    },
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
    attributes: options.attributes || {exclude: ['password', 'createdAt', 'deletedAt', 'updatedAt', 'registered']},
    include: options.include || [],
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
 * Create a new patients
 **/
export function bulkCreate(patients, {transaction = null, ...options} = {}) {
  return Patient.bulkCreate(patients, {transaction});
};

/**
 * Update a patient
 * @param patient object literal containing info about a patient
 **/
export function update(patient, {transaction = null, ...options} = {}) {
  return Patient.findById(patient.id).then((p) => {
    if (p) {
      return p.update(patient, {transaction});
    } else {
      throw new Error('INVALID_PATIENT_ID');
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
