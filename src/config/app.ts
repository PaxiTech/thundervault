export default () => ({
  mongodbUrl: process.env.MONGODB_CONNECTION_STRING || 'mongodb://localhost/nest',
  jwtSecret:
    process.env.JWT_SECRET || 'f+DTSnxnvrl1/vrtyyWVCneGIFBWG8ceBs4AbLjsfpa/8MaQ7FMf7UFU4LE=',
  jwtTokenExpiresIn: process.env.JWT_TOKEN_EXPIRES_IN || '1d',
  jwtOtpTokenExpiresIn: process.env.JWT_OTP_TOKEN_EXPIRES_IN || '1h',
  server_url: process.env.SERVER_URL || '',
  debug: process.env.IS_DEBUG || false,
  presaleId: process.env.PRESALE_ID || 1,
  currentTime: process.env.CURRENT_TIME || '',
});
