export const envs = {
  env: process.env.NODE_ENV as "development" | "production" | "test",
  port: process.env.PORT as string,

  googleAuthUser: process.env?.GOOGLE_AUTH_USER as string,
  googleAuthPassword: process.env?.GOOGLE_AUTH_PASSWORD as string,

  dbURL: process.env.DB_URL as string,

  baseUrlProd: process.env.BASEURLPROD as string,
  baseUrlDev: `http://localhost:${process.env.PORT}` as string,
  baseUrl: (process.env.NODE_ENV === "development"
    ? `http://localhost:${process.env.PORT}`
    : process.env.BASEURLPROD) as string,

  jwtSecret: process.env.JWT_SECRET as string,
  jwtExpiration: process.env.JWT_EXPIRATION as string,

  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY as string,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET as string,
};
