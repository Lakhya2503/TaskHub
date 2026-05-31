import User from "../models/auth.model.js"
import ApiError from "../utils/ApiError.js"
import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import { ENV } from "../utils/ENV.js"
import { Todo } from './../models/todo.model.js';

export const verifyJWT = asyncHandler(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "")


  if (!token) {
    throw new ApiError(401, "Unauthorized request")
  }

  const decodedToken = jwt.verify(token, ENV.ACCESS_TOKEN_SECRET)

  const user = await User.findById(decodedToken._id).select(
    "-password -refreshToken"
  )


  if (!user) {
    throw new ApiError(401, "Invalid access token")
  }

  req.user = user
  next()
})

// export const verifyTodo = asyncHandler(async(req,res)=>{

//     const todoId = req.body.todoId || req.params.todoId

//     if(!todoId) {
//       throw new ApiError(400, "Todo Id Is required")
//     }

//     const todo = await Todo.findById(todoId)

//     if(!todo) {
//       throw new ApiError(400, "Todo not Exists")
//     }

//     req.todo = todo
//     next();
// })

// export const verifyTodoMember = asyncHandler(async(req,res)=>{


//     const user = req.user

//     if(!user) {
//       throw new ApiError("login First")
//     }

//     const todo = req.todo

//      if(!todo) {
//       throw new ApiError(400, "Todo not Exists")
//     }


//     const todoMemeber =  todo.filter((todo) => {
//         if(todo.userId === user._id) {
//           return todo
//         } else {
//           throw new ApiError(400, "your not a part of the todo")
//         }
//     })


// })
