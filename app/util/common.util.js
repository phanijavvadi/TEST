'use strict';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import * as jwt from 'jsonwebtoken';
import * as config from '../../config/config';

const baseRgx = /(.*).(js)$/;
const commonUtil = {
  getHash: (password) => {
    return crypto.createHmac('sha256', config.cryptoHmacSecreteKey).update(password).digest('hex');
  },
  jwtSign: (payload) => {
    return jwt.sign(payload, config.jsonwebtokenSecrete, {
      expiresIn: config.jsonwebtokenExpiresIn
    });
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
  }

}
export default commonUtil;
