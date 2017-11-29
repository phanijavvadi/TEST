'use strict';

/**
 * Module dependencies.
 */
import express from 'express';

import fileUploadctrl from '../controllers/file.upload.ctrl';


const router = express.Router();

export default function (app) {
  router.route('/upload').post(fileUploadctrl.upload);
  router.route('/:id').get(fileUploadctrl.getFile);
  app.use('/api/file', router);

}
