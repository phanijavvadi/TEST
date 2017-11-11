'use strict';

const errorMessages = {
  SERVER_ERROR: "Oops..Server error!!! Please conctact the system admin",
  NOT_FOUND: "The submitted request can not be understood",
  UNPARSABLE_REQUEST: "Can not parse the request. Please try again with correct format",
  TOKEN_IS_REQUIRED: 'No token provided',
  TOKEN_IS_EXPIRED: 'Token is expired. Please login again',
  TOKEN_IS_INVALID: 'Invalid Token. Please login again',

  ///admin table service start
  ADMIN_USER_NAME_NOT_FOUND: 'Invalid Username/password',
  ADMIN_USER_NAME_ALREADY_EXIST: 'User name already exist',
  ORG_USER_ROLE_ID_NOT_FOUND: 'Invalid User role id',

  ///admin table service end

  //Organization services start
  ORG_EMAIL_EXISTS: "Email already registered",
  INVALID_ORG_ID: "Invalid organization id",
  //Organization services end


};
export default errorMessages;
