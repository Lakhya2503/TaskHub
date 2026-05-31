import app  from "./app.js";
import { connectDB } from './config/db.js'
import { ENV } from "./utils/ENV.js";

const port = ENV.PORT || 5002


connectDB().then(()=>{
  app.listen(port ,()=>{
      console.log("🚀 SERVER LISTEN PORT : ", port);
  })
}).catch((error)=>{
  console.error(" Error on server connected ?? " , error.message);
})
