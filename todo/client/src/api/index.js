import apiClient from "../utils/apiClient";

// ==========================================
// AUTH API
// ==========================================

export const registerAdmin = (data) => {
  return apiClient.post("/auth/register", data)
};

export const commonLogin = (data) => {
  return apiClient.post("/auth/login", data);
};

export const loggedOutUser = () => {
  return apiClient.get("/auth/logout");
};

export const currentUser = () => {
  return apiClient.get("/auth/get-me");
};

export const updateUserProfile = (data) => {
  return apiClient.put("/auth/update-profile", data);
};

export const changeCurrentPassword = (data) => {
  return apiClient.put("/auth/change-password", data);
};

export const updateUserAvatar = (formData) => {
  return apiClient.put("/auth/update-avatar", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

// ==========================================
// TODO API
// ==========================================

export const createTodo = (data) => {
  return apiClient.post("/todo/create-todo", data);
};

export const updateTodoName = (todoId, data) => {
  return apiClient.put(`/todo/update-todo-name/${todoId}`, data);
};

export const deleteTodo = (todoId) => {
  return apiClient.delete(`/todo/delete-todo/${todoId}`);
};

export const fetchTodos = () => {
  return apiClient.get("/todo/fetch-todo");
};

// ==========================================
// TODO ITEM API
// ==========================================

export const createTodoItem = (todoId, data) => {
  return apiClient.post(`/todo-item/create-todo-item/${todoId}`, data);
};

export const completeTodoItem = (todoItemId) => {
  return apiClient.put(`/todo-item/complete-todo-item/${todoItemId}`);
};

export const deleteTodoItem = (todoItemId) => {
  return apiClient.delete(`/todo-item/delete-todo-item/${todoItemId}`);
};
