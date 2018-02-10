'use strict';
const multer = require('multer');
const path = require('path');
import logger from '../util/logger';
import errorMessages from '../../config/error.messages';
import successMessages from '../../config/success.messages';
import * as commonUtil from '../util/common.util';
import * as attachmentService from '../services/attachment.service';


const storage = multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './public/uploads')
  },
  filename: function (req, file, callback) {
    callback(null, path.parse(file.originalname).name + '-' + Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({
  storage: storage,
  fileFilter: function (req, file, callback) {
    var ext = path.extname(file.originalname)
    if (ext !== '.png' && ext !== '.jpg' && ext !== '.gif' && ext !== '.jpeg') {
      return callback({code: 'FILE_INVALID_IMAGE_EXT'}, null)
    }
    callback(null, true)
  }
}).single('inputfile');


const operations = {

  upload: (req, resp, next) => {
    upload(req, resp, (err) => {
      let file = req.file;
      if (err) {
        if (err.code === 'FILE_INVALID_IMAGE_EXT') {
          return resp.status(403).send({
            success: false,
            code: 'FILE_INVALID_IMAGE_EXT',
            message: errorMessages.FILE_INVALID_IMAGE_EXT
          });
        }
        logger.info(err);
        return resp.status(403).send({success: false, message: errorMessages.UNABLE_TO_UPLOAD_FILE});
      }
      if (file === undefined) {
        return resp.status(403).send({success: false, message: errorMessages.ATTACHMENT_REQUIRED});
      }
      const fileInfo = {
        originalname: file.originalname,
        encoding: file.encoding,
        mimetype: file.mimetype,
        filename: file.filename,
        size: file.size
      };
      return attachmentService.create({fileInfo})
        .then((data) => {
          resp.json({
            success: true,
            data,
            message: successMessages.FILE_UPLOADED_SUCCESS
          });
        }).catch((err) => {
          commonUtil.handleException(err, req, resp, next)
        });
    });
  },
  getFile: (req, resp, next) => {
    const id = req.params.id;
    logger.info('About to get user ', id);

    return attachmentService.findById(id)
      .then((data) => {
        if (data) {
          resp.status(200).sendFile(data.fileInfo.filename, {root: path.join(__dirname, '../../public/uploads')});
        } else {
          resp.status(404).send(errorMessages.INVALID_ATTACHMENT_ID);
        }
      }).catch((err) => {
        commonUtil.handleException(err, req, resp, next)
      });
  }

}

export default operations;
