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
    message: 'over max amount for this round',
    status: HttpStatus.BAD_REQUEST,
  },
  OWNER_WALLET_NOT_FOUND: {
    code: 'OWNER_WALLET_NOT_FOUND',
    message: 'Please set owner wallet',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_VALIDATE_TRANSACTION: {
    code: 'INVALID_VALIDATE_TRANSACTION',
    message: 'Invalid validate transaction',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_TRANSACTION_USED: {
    code: 'INVALID_TRANSACTION_USED',
    message: 'Invalid validate transaction. Transaction has been used.',
    status: HttpStatus.BAD_REQUEST,
  },
  INVALID_SECRET_KEY: {
    code: 'INVALID_SECRET_KEY',
    message: 'secret key is invalid',
    status: HttpStatus.BAD_REQUEST,
  },
  NFT_NOT_EXIST: {
    code: 'NFT_NOT_EXIST',
    message: 'The nft does not exist.',
    status: HttpStatus.NOT_FOUND,
  },
  REFERRAL_CODE_INVALID: {
    code: 'REFERRAL_CODE_INVALID',
    message: 'The ref code is invalid.',
    status: HttpStatus.NOT_FOUND,
  },
  REFERRAL_CODE_INVALID_YOURSELF: {
    code: 'REFERRAL_CODE_INVALID_YOURSELF',
    message: 'Can not use your own ref code.',
    status: HttpStatus.NOT_FOUND,
  },
  INVALID_BUY_NFT: {
    code: 'INVALID_BUY_NFT',
    message: 'Invalid buy nft',
    status: HttpStatus.NOT_FOUND,
  },
  INVALID_STAKING_OWNER_NFT: {
    code: 'INVALID_STAKING_OWNER_NFT',
    message: 'Invalid owner nft',
    status: HttpStatus.NOT_FOUND,
  },
  NFT_OUT_OF_STOCK: {
    code: 'NFT_OUT_OF_STOCK',
    message: 'The nft is out of stock.',
    status: HttpStatus.NOT_FOUND,
  },
};
