
import mongoose from 'mongoose'
import { ENV } from '../utils/ENV.js'

export const connectDB = async(req,res) => {
  try {
      const promise = await mongoose.connect(`${ENV.MONGODB_URI}/${ENV.APP_NAME}`)
      return promise;
  } catch (error) {
        process.exit(1)
        console.error("MONGODB ERROR", error?.messsage)
  }
}
