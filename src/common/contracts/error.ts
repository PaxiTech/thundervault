import { HttpStatus } from '@nestjs/common';
export const Errors = {
  OBJECT_NOT_FOUND: {
    code: 'OBJECT_NOT_FOUND',
    message: 'Object not found',
    status: HttpStatus.NOT_FOUND,
  },
  INVALID_TOKEN: {
    code: 'INVALID_TOKEN',
    message: 'Token is invalid',
    status: HttpStatus.BAD_REQUEST,
  },
  EXPIRED_TOKEN: {
    code: 'EXPIRED_TOKEN',
    message: 'Token is expired',
    status: HttpStatus.BAD_REQUEST,
  },
  PERMISSION_DENIED: {
    code: 'PERMISSION_DENIED',
    message: 'Permission denied.',
    status: HttpStatus.FORBIDDEN,
  },
  INVALID_SIGNATURE: {
    code: 'INVALID_SIGNATURE',
    message: 'Invalid signature',
    status: HttpStatus.BAD_REQUEST,
  },
  PROBLEM_SIGNATURE: {
    code: 'PROBLEM_SIGNATURE',
    message: 'Problem with signature verification.',
    status: HttpStatus.FORBIDDEN,
  },
  ACCOUNT_NOT_EXIST: {
    code: 'ACCOUNT_NOT_EXIST',
    message: 'The account does not exist.',
    status: HttpStatus.NOT_FOUND,
  },
  HAD_BEEN_KYC: {
    code: 'HAD_BEEN_KYC',
    message: 'KYC has been waiting for approval or has been approved.',
    status: HttpStatus.BAD_REQUEST,
  },
  ACCOUNT_IS_NOT_ACTIVE: {
    code: 'ACCOUNT_IS_NOT_ACTIVE',
    message: 'Your account is not active',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_PASSWORD: {
    code: 'INVALID_PASSWORD',
    message: 'The password is invalid',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_BUY_TIME: {
    code: 'INVALID_BUY_TIME',
    message: 'invalid by time',
    status: HttpStatus.BAD_REQUEST,
  },
  OVER_MAX_AMOUNT: {
    code: 'OVER_MAX_AMOUNT',
    message: 'over max amount this campaign',
    status: HttpStatus.BAD_REQUEST,
  },
};
