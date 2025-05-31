import API from './api';

export const taskService = {
    getAllTasks: async () => {
        const response = await API.get('/tasks');
        return response.data;
    },

    getTaskById: async (id) => {
        const response = await API.get(`/tasks/${id}`);
        return response.data;
    },

    createTask: async (taskData) => {
        const response = await API.post('/tasks', taskData);
        return response.data;
    },

    deleteTask: async (id) => {
        const response = await API.delete('/tasks', {
            data: { taskId: id }
        });
        return response.data;
    },

    completeTask: async (id) => {
        const response = await API.patch('/tasks/complete', {
            taskId: id
        });
        return response.data;
    },

    procrastinateTask: async (id) => {
        const response = await API.patch('/tasks/procrastinate', {
            taskId: id
        });
        return response.data;
    }
};