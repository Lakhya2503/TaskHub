import { model, Schema } from 'mongoose';

const todoItemSchema = new Schema(
  {
      context : {
        type : String,
        required : true,
        trim : true
      },
      todoId : {
        type : Schema.Types.ObjectId,
        ref : "Todo"
      },
      isComplete : {
        type : Boolean,
        default : false
      },
  }, {
    timestamps : true
  }
)

export const TodoItem = model("TodoItem", todoItemSchema)
