import { Router } from "express";
import { verifyJWT } from "./../middleware/auth.middleware.js";
import { createTodoItem, deleteTodoItem, todoComplete } from "../controllers/todoItem.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/create-todo-item/:todoId").post(createTodoItem);

router.route("/complete-todo-item/:todoItemId").put(todoComplete);

router.route("/delete-todo-item/:todoItemId").delete(deleteTodoItem);


export default router;
