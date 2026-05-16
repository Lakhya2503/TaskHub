import { Router } from "express";
import { verifyJWT } from "./../middleware/auth.middleware.js";
import { deleteTodo, getTodo, todoCreate, updateTodoName } from "../controllers/todo.controller.js";

const router = Router();

router.use(verifyJWT)

router.route("/create-todo").post(todoCreate);

router.route("/update-todo-name/:todoId").put(updateTodoName);

router.route("/delete-todo/:todoId").delete(deleteTodo);

router.route("/fetch-todo").get(getTodo)

export default router;
