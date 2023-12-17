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
  ownerWallet: process.env.OWNER_WALLET || '',
  nftOwnerWallet: process.env.NFTOWNERWALLET || '',
  stakingOwnerWallet: process.env.STAKINGOWNERWALLET || '',
  marketOwnerWallet: process.env.MARKETOWNERWALLET || '',
  systemWallet: process.env.SYSTEMWALLET || '',
  f0Wallet: process.env.F0WALLET || '',
  totalSystemCommissionFee: process.env.TOTALSYSTEMCOMMISSIONFEE || 0,
  nftAddress: process.env.NFT_ADDRESS || '',
  tdvAddress: process.env.TDV_ADDRESS || '',
  configSecretKey:
    process.env.SECRET_KEY || 'nJVvIsM2KJY4HRQVL1lwZ5gBHo3TAcz/GHOWJaN90HhOyN2a7rCPI9iJqyU=',
  nft_resource: process.env.NFT_RESOURCE || './asset/resource/',
  mainnet: process.env.MAINNET || true,
});
