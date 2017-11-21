'use strict';

import models from '../models';

const Attachment = models.Attachment;

/**
 * Find a attachment by attachment Id
 * @param attachmentId
 **/
export function findById(id, options = {}) {

  return Attachment.findOne({
    where: {
      id: id
    }
  });
};

/**
 * Create a new attachment
 * @param attachment object literal containing info about a attachment
 **/
export function create(attachment) {
  return Attachment.create(attachment);
};

/**
 * Delete attachment(s) based on input criteria
 * @param attachment object literal containing info about a attachment
  **/
export function deleteAdmin(attachment) {
  return Attachment.destroy({
    where: {
      ...attachment
    }
  });
};
