const dataBaseUri = process.env.DATABASE_URI;
const jwtAccessToken = process.env.JWT_ACCESS_TOKEN;
const jwtAccessExpiry = process.env.JWT_ACCESS_EXPIRY;
const jwtRefreshToken = process.env.JWT_REFRESH_TOKEN;
const jwtRefreshExpiry = process.env.JWT_REFRESH_EXPIRY;
const portServer = process.env.PORT;
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const cloudKey = process.env.CLOUDINARY_CLOUD_KEY;
const cloudSecret = process.env.CLOUDINARY_CLOUD_SECRET;

export {
  dataBaseUri,
  jwtAccessExpiry,
  jwtAccessToken,
  jwtRefreshExpiry,
  jwtRefreshToken,
  portServer,
  cloudKey,
  cloudName,
  cloudSecret,
};
