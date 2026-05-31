import { configDotenv } from 'dotenv'

configDotenv({
  path : "./.env",
  quiet : true
})

export const ENV = {
      NODE_ENV :   process.env.NODE_ENV,
      PORT : process.env.PORT,
      MONGODB_URI : process.env.MONGODB_URI,
      APP_NAME : process.env.APP_NAME,
      RATE_LIMIT_WINDOW_MS : process.env.RATE_LIMIT_WINDOW_MS,
      RATE_LIMIT_MAX : process.env.RATE_LIMIT_MAX,
      DEAFULT_ROUTE : process.env.DEAFULT_ROUTE,
      CORS_ORIGIN : process.env.CORS_ORIGIN,
      CLIENT_URL : process.env.CLIENT_URL,
      BACKEND_URI : process.env.BACKEND_URI,
      CLOUDINARY_CLOUD_NAME : process.env.CLOUDINARY_CLOUD_NAME,
      CLOUDINARY_API_KEY : process.env.CLOUDINARY_API_KEY,
      CLOUDINARY_API_SECRET : process.env.CLOUDINARY_API_SECRET,
      ACCESS_TOKEN_SECRET : process.env.ACCESS_TOKEN_SECRET,
      REFRESH_TOKEN_SECRET : process.env.REFRESH_TOKEN_SECRET,
      ACCESS_TOKEN_EXPIRY : process.env.ACCESS_TOKEN_EXPIRY,
      REFRESH_TOKEN_EXPIRY  : process.env.REFRESH_TOKEN_EXPIRY,
      BREVO_API_KEY : process.env.BREVO_API_KEY,
      BREVO_SENDER_NAME : process.env.BREVO_SENDER_NAME,
      BREVO_SENDER_EMAIL : process.env.BREVO_SENDER_EMAIL,
      GOOGLE_CLIENT_ID : process.env.GOOGLE_CLIENT_ID,
      GOOGLE_CLIENT_SECRET : process .env.GOOGLE_CLIENT_SECRET,
      GOOGLE_CALLBACK_URL : process.env.GOOGLE_CALLBACK_URL
}
