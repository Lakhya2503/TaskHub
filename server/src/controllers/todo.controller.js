
import asyncHandler from './../utils/asyncHandler.js';
import ApiResponse from './../utils/ApiResponse.js';
import { Todo } from './../models/todo.model.js';
import ApiError from './../utils/ApiError.js';
import { todoType } from '../utils/constants.js';

export const todoCreate = asyncHandler(async(req,res)=>{

  const { title, typeOfTodo } = req.body

  const todoData = {}

  if(!title) {
    throw new ApiError(400, "title is required")
  }

    if(typeOfTodo) {
      todoData.typeOfTodo = typeOfTodo
    } else {
      todoData.typeOfTodo = todoType.OTHER
    }

    const todo = await Todo.create({
        userId : req.user._id,
        title : title ,
        isComplete : false ,
        typeOfTodo : todoData.typeOfTodo
    })

    if(!todo){
      throw new ApiError(400 , "Todo Can't Create")
    }

  return res.status(201).json(new ApiResponse(201, todo, "Todo Create successfully"))
})

export const updateTodoName = asyncHandler(async(req,res)=>{

    const { title } = req.body
    const { todoId } = req.params

    if(!todoId) {
      throw new ApiError(400, "Todo Id Required")
    }

  const updateData = {}

  if(title) updateData.title = title

  if(!updateData.title) {
    throw new ApiError(400, "Todo Title required")
  }


  const  todoNameUpdate = await Todo.findByIdAndUpdate( todoId, {
    $set  : updateData
  } , {new : true})


  return res.status(200).json(new ApiResponse(200 , todoNameUpdate , "Todo Name Update Successfully"))
})

export const isCompleteTodo = asyncHandler(async(req,res)=>{

    const { todoId } = req.params

    if(!todoId) {
      throw new ApiError(400, "Todo Id Required")
    }

  const todo = await Todo.findByIdAndUpdate(
    todoId,
      {
          $set : { "Todo.isComplete" : true }
      }, { new : true }
  )

  return res.status(200).json(new ApiResponse(200, todo , "Todo Completed Successfully"))
})

export const deleteTodo = asyncHandler(async(req,res)=>{

   const { todoId } = req.params

    if(!todoId) {
      throw new ApiError(400, "Todo Id Required")
    }

    await Todo.findByIdAndDelete(todoId)

  return res.status(200).json(new ApiResponse(200, {} , "Todo Delete Successfully"))
})

export const getTodo = asyncHandler(async(req,res)=>{

    const todos = await Todo.aggregate(
    [
                {
                  $match: {
                      userId : req.user._id
                  },
                },
                {
                  $lookup: {
                    from: "todoitems",
                    localField: "_id",
                    foreignField: "todoId",
                    as: "todos"
                  }
                }
              ]
      )

    return res.status(200).json(new ApiResponse(200, todos, "Fetch todo Succesfully"))
})
