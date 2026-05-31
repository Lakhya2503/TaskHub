
import { model, Schema } from 'mongoose';
import { todoType, todoTypeEnum } from '../utils/constants.js';

const todoSchema = new Schema(
  {
      title : {
        type : String,
        required : true,
        trim : true
      },
      userId : {
        type : Schema.Types.ObjectId,
        ref : "User"
      },
      isComplete : {
        type : Boolean,
        default : false
      },
      typeOfTodo : {
        type : String,
        default : todoType.OTHER ,
        enum : todoTypeEnum
      }
  }, {
    timestamps : true
  }
)

export const Todo = model("Todo", todoSchema)
