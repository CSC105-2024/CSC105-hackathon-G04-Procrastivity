import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL;

const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, 
});

export const login = async (username, password) => {
  const res = await api.post('/user/login', { username, password });
  return res.data;
};

export const register = async (username, password) => {
  // Provide a default profile picture (can be a placeholder URL or base64 string)
  const defaultProfilePicture = "https://ui-avatars.com/api/?name=" + encodeURIComponent(username);
  const res = await api.post('/user/createUser', { username, password, profilePicture: defaultProfilePicture });
  return res.data;
};

export const getProfile = async (userId) => {
  const res = await api.get(`/user/getUser?userId=${userId}`);
  return res.data;
};

export const logout = async () => {
  // No backend call needed, just clear state on frontend
  return { success: true };
};

export const getTasks = async (userId, category) => {
  let body = {};
  if(category) {
    body = {
      userId: userId,
      category: category,
    };
  }
  else {
    body = {
      userId: userId,
    }
  }

  const res = await api.patch('/task/getTask', body);
  return res.data;
};

export const createTask = async (task) => {
  const res = await api.post('/task/createTask', task);
  return res.data;
};

export const updateTask = async (taskId, data) => {
  const res = await api.patch('/task/updateTask', { taskId, ...data });
  return res.data;
};

export const procrastinateTask = async (taskId) => {
  const res = await api.post('/task/procrastinate', { taskId });
  return res.data;
};

export const deleteTask = async (taskId) => {
  const res = await api.delete('/task/deleteTask', { data: { taskId } });
  return res.data;
};

export const updateSubTask = async (subTaskId, data) => {
  const res = await api.patch(`/subTask/updateSubTask`, { subTaskId, ...data });
  return res.data;
};

export default api;

