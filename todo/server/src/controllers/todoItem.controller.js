
import asyncHandler from './../utils/asyncHandler.js';
import ApiResponse from './../utils/ApiResponse.js';
import { TodoItem } from '../models/todoItem.model.js';
import ApiError from '../utils/ApiError.js';

export const createTodoItem = asyncHandler(async(req,res)=>{

    const { context } = req.body
    const { todoId } = req.params

    if(!context) {
      throw new ApiError(400, "context is required")
    }

    if(!todoId) {
      throw new ApiError(400, "Todo Id is required")
    }

    const todoItem = await TodoItem.create({
      todoId : todoId,
      context : context,
      isComplete : false
    })

    if(!todoItem){
      throw new ApiError(400 , "todoItem Can't Create")
    }

    return res.status(201).json(new ApiResponse(201, {}, "Todo Item create Succesfully"))
})

export const todoComplete = asyncHandler(async(req,res)=>{
    const { todoItemId } = req.params

    if(!todoItemId) {
      throw new ApiError(400, "Todo Id is required")
    }

    const todoItem = await TodoItem.findByIdAndUpdate(
      todoItemId,
      {
        $set : {
          isComplete : true
        }
    }, { new : true})

    if(!todoItem){
      throw new ApiError(400 , "todoItem Can't update")
    }

    return res.status(200).json(new ApiResponse(200, {}, "Todo Item update Succesfully"))
})

export const deleteTodoItem = asyncHandler(async(req,res)=> {
    const { todoItemId } = req.params

    if(!todoItemId) {
      throw new ApiError(400, "Todo Id is required")
    }

    await TodoItem.findByIdAndDelete(todoItemId)

    return res.status(200).json(new ApiResponse(200, {}, "Todo Item delete Succesfully"))
})
