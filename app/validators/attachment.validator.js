'use strict';
import * as Joi from 'joi';
import errorMessages from '../../config/error.messages';
import * as attachmentService from '../services/attachment.service';
import commonUtil from "../util/common.util";

const validators = {
  validateAttachmentId: (id, req, resp, next) => {
    attachmentService.findById(id)
      .then((data) => {
        if (data) {
          next();
          return null;
        } else {
          return resp.status(403).send({success: false, message: errorMessages.INVALID_ATTACHMENT_ID});
        }
      })
      .catch((err) => {
        commonUtil.handleException(err, req, resp, next);
      });
  }
};
export default validators;
