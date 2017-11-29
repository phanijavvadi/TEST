'use strict';

const errorMessages = {
  SERVER_ERROR: "Oops..Server error!!! Please conctact the system admin",
  NOT_FOUND: "The submitted request can not be understood",
  UNPARSABLE_REQUEST: "Can not parse the request. Please try again with correct format",
  TOKEN_IS_REQUIRED: 'No token provided',
  TOKEN_IS_EXPIRED: 'Token is expired. Please login again',
  TOKEN_IS_INVALID: 'Invalid Token. Please login again',
  INVALID_INPUT:'Invalid input',

  ///admin table service start

  ADMIN_USER_NAME_ALREADY_EXIST: 'User name already exist',
  ORG_USER_ROLE_ID_NOT_FOUND: 'Invalid User role id',


  //Organization services start
  ORG_EMAIL_EXISTS: "Email already registered",
  INVALID_ORG_ID: "Invalid organization id",
  ATLEAST_ONE_ACTIVE_PRACTITIONER_REQUIRED_TO_ACTIVATE_ORG:'Atleast one active practitioner user required to activate organisation',
  INVALID_ORG_CONTCT_ID:'Invalid organisation contact id',
  //User Types
  INVALID_USER_TYPE:'Invalid User type',
  // users services
  USER_CREATED:"User created successfully",

  USER_UPDATED:'User updated successfully',
  USER_EMAIL_EXISTS:'User email already registered',
  USER_NOT_FOUND:'User not found',
  USER_CREATION_SAME_CATEGORY_USERTYPES_REQUIRED:'For User creation same category user types required',
  USER_ALREADY_VERIFIED:'User already verified',
  INVALID_USER_ID:'User not found',
  INVALID_USERNAME_OR_PASSWORD: 'Invalid Username/password',
  INVALID_PRACTITIONER_ID:'Invalid practitioner',
  INVALID_ORG_USER_ROLE_ID:'Invalid user role id',

  // User role

  INVALID_USER_ROLE_ID:'Invalid user role id',
  // user verification

  INVALID_VERIFICATION_ID:'Invalid verification id',

  // File uploads
  FILE_EXT_NOT_ALLOWED:'Invalid file type',
  UNABLE_TO_UPLOAD_FILE:'Server error unable to upload file',
  ATTACHMENT_REQUIRED:"Attachment required",
  FILE_INVALID_IMAGE_EXT:'Invalid file type. Only images are allowed (.png,.jpg,.gif,.jpeg)',
  INVALID_ATTACHMENT_ID:'Invalid attachment id',

  // Subscriptions
  SUBSCRIPTION_TYPE_NOT_FOUND:'Subscription type is not found',

  //Org subscriptions

  INVALID_ORG_SUBSCRIPTION_ID:'Invalid Subscription id',
  ORG_SUBSCRIPTION_ALREADY_EXIST_PLEASE_UNSUBSCRIBE:'Subscription already exists. Please un subscribe existing one to upgrade new one ',


};
export default errorMessages;
