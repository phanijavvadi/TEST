'use strict';
import * as dbConfig from "../db.config";
const config = {
	db: dbConfig.production,
  cryptoHmacSecreteKey:'SEACRETKEYDONTCHANGE',// One time secrete key never change once production user exists
  jsonwebtokenSecrete:'732f17d08213caf280ae3c4092414dbd0dcc62b424d393fccb00406bcb8f642b',
  jsonwebtokenExpiresIn:24*60*60,//in seconds
  log: {
		//morgan options: 'combined', 'common', 'dev', 'short', 'tiny'
		format: 'combined',
		//winston config
		transports: {
			file: {
				level: 'debug',
				filename: '../logs/applog.log',
				handleExceptions: true,
				json: false,
				maxsize: 5242880, //5MB
				colorize: false
			}
		}
	}
};
export default config;
