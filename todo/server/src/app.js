import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
// import passport from 'passport';
import ApiResponse from './utils/ApiResponse.js';
import { ENV } from './utils/ENV.js';



const app = express()


app.use(express.json({limit: "20kb"}))
app.use(express.urlencoded({ extended: true, limit: "20kb" }))
app.use(cookieParser())
app.use(cors({
  methods : ["GET", "POST", "PATCH", "PUT", "DELETE"],
  credentials : true,
  origin : ENV.CORS_ORIGIN
}))
app.use(express.static("public"))
// app.use(passport())




// ?? ---------  router import---------
import AuthRouter from './routes/auth.route.js';
import TodoRouter from './routes/todo.route.js';
import TodoItemRouter from './routes/todoItem.route.js';


// ?? ---------  router ---------
app.use("/api/v1/todo/auth" , AuthRouter)
app.use("/api/v1/todo/todo" , TodoRouter)
app.use("/api/v1/todo/todo-item" , TodoItemRouter)




app.use("/", (_, res) => {
    res.status(404).json(
        new ApiResponse(404, {}, "Page Not Found")
    )
})

export default app;
