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
  ORG_ACTIVE_AHPRANO_REQUIRED_TO_ACTIVATE:'Atleast one active AHPRA regnumber user required to activate',
  //User Types
  ORG_USER_TYPE_NOT_FOUND:'Invalid User type',
  //Organization users services
  ORG_USER_CREATED:"User created successfully",
  ORG_USER_UPDATED:'User updated successfully',
  ORG_USER_EMAIL_EXISTS:'User email already registered',
  ORG_USER_NOT_FOUND:'User not found',
  // File uploads
  FILE_EXT_NOT_ALLOWED:'Invalid file type',
  UNABLE_TO_UPLOAD_FILE:'Server error unable to upload file',
  ATTACHMENT_REQUIRED:"Attachment required",
  FILE_INVALID_IMAGE_EXT:'Invalid file type. Only images are allowed (.png,.jpg,.gif,.jpeg)',
  INVALID_ATTACHMENT_ID:'Invalid attachment id'


};
export default errorMessages;
