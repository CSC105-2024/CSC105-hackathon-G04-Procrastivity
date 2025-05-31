import API from './api';

export const subTaskService = {
    getSubTasks: async (taskId) => {
        const response = await API.get(`/tasks/${taskId}/subtasks`);
        return response.data;
    },

    createSubTask: async (taskId, subTaskData) => {
        const response = await API.post('/subtasks', {
            mainTaskId: taskId,
            ...subTaskData
        });
        return response.data;
    },

    deleteSubTask: async (subTaskId) => {
        const response = await API.delete('/subtasks', {
            data: { subTaskId }
        });
        return response.data;
    },

    completeSubTask: async (subTaskId) => {
        const response = await API.patch('/subtasks/complete', {
            subTaskId
        });
        return response.data;
    }
};