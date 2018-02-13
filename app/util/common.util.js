'use strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as config from '../../config/config';
import errorMessages from './constants/error.messages';
import logger from '../util/logger';
const ENCRYPTION_KEY = config.ENCRYPTION_KEY; // Must be 256 bytes (32 characters)
const IV_LENGTH = 16; // For AES, this is always 16

const baseRgx = /(.*).(js)$/;
const encrypt = (text) => {
  let iv = crypto.randomBytes(IV_LENGTH);
  let cipher = crypto.createCipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
  let encrypted = cipher.update(text);

  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return iv.toString('hex') + ':' + encrypted.toString('hex');
};
const decrypt = (text) => {
  let textParts = text.split(':');
  let iv = new Buffer(textParts.shift(), 'hex');
  let encryptedText = new Buffer(textParts.join(':'), 'hex');
  let decipher = crypto.createDecipheriv('aes-256-cbc', new Buffer(ENCRYPTION_KEY), iv);
  let decrypted = decipher.update(encryptedText);

  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
const commonUtil = {
  getHash: (password) => {
    return crypto.createHmac('sha256', config.cryptoHmacSecreteKey).update(password).digest('hex');
  },
  encrypt: (text) => {
    return encrypt(text);
  },
  decrypt: (text) => {
    return decrypt(text);
  },
  jwtSign: (payload) => {
    return jwt.sign(payload, config.jsonwebtokenSecrete, {
      expiresIn: config.jsonwebtokenExpiresIn
    });
  },
  createPrivateKey: (options) => {
    return encrypt(jwt.sign(options.payload, config.jsonwebtokenSecrete));
  },
  getPrivateKeyObj: (key) => {
    return decrypt(key);
  },
  jwtVerify: (token) => {
    return new Promise((resolve) => {
      if (!token) {
        throw new Error('TOKEN_IS_REQUIRED');
      }
      jwt.verify(token, config.jsonwebtokenSecrete, (err, decoded) => {
        if (err) {
          throw new Error('TOKEN_IS_INVALID');
        }
        resolve(decoded);
      });
    });
  },
  isEmty: (str) => !str || str.length === 0,
  // recursively walk modules path and callback for each file
  walk: function walk(wpath, type, excludeDir, callback) {
    // slice type
    var stype = type.slice(-1) === 's' ? type.slice(0, -1) : type;
    var rgx = new RegExp('(.*)-' + stype + '.(js)$', 'i');
    if (!fs.existsSync(wpath)) return;
    fs.readdirSync(wpath).forEach(function (file) {
      var newPath = path.join(wpath, file);
      var stat = fs.statSync(newPath);
      if (stat.isFile() && (rgx.test(file) || (baseRgx.test(file)) && newPath.indexOf(type) >= 0)) {
        // if (!rgx.test(file)) console.log('  Consider updating filename:', newPath);
        callback(newPath);
      } else if (stat.isDirectory() && file !== excludeDir && ~newPath.indexOf(type)) {
        walk(newPath, type, excludeDir, callback);
      }
    });
  },
  handleException(err, req, resp,next) {
    let message, status, code;
    if (err && errorMessages[err.message]) {
      code = err.message;
      status = 403;
      message = errorMessages[err.message];
    } else {
      logger.error(err);
      code = 'SERVER_ERROR';
      status = 500;
      message = err.message || errorMessages.SERVER_ERROR;
    }

    resp.status(status).send({
      success: false,
      message,
      code
    });
  }

}
export default commonUtil;
