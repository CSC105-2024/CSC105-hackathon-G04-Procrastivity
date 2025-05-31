import { useState, useEffect } from 'react';
import { taskService } from '../services/taskService';
import { useApp } from '../context/AppContext';

export const useTasks = () => {
    // @ts-ignore
    const { tasks, setTasks } = useApp();
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // @ts-ignore
    const fetchTasks = async () => {
        setLoading(true);
        try {
            const data = await taskService.getAllTasks();
            setTasks(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (title, dueDate) => {
        try {
            const today = new Date();
            today.setHours(0, 0, 0, 0);
            const due = new Date(dueDate);
            due.setHours(0, 0, 0, 0);
            // @ts-ignore
            const dueIn = Math.ceil((due - today) / (1000 * 60 * 60 * 24));

            const newTask = await taskService.createTask({
                title,
                dueDate: due.getDate(),
                dueIn
            });
            await fetchTasks(); // Refresh tasks
            return newTask;
        } catch (err) {
            setError(err.message);
            throw err;
        }
    };

    // @ts-ignore
    const completeTask = async (taskId) => {
        try {
            await taskService.completeTask(taskId);
            await fetchTasks(); // Refresh tasks
        } catch (err) {
            setError(err.message);
        }
    };

    // @ts-ignore
    const procrastinateTask = async (taskId) => {
        try {
            await taskService.procrastinateTask(taskId);
            await fetchTasks(); // Refresh tasks
        } catch (err) {
            setError(err.message);
        }
    };

    // @ts-ignore
    const deleteTask = async (taskId) => {
        try {
            await taskService.deleteTask(taskId);
            await fetchTasks(); // Refresh tasks
        } catch (err) {
            setError(err.message);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, []);

    return {
        tasks,
        loading,
        error,
        refetch: fetchTasks,
        createTask,
        completeTask,
        procrastinateTask,
        deleteTask
    };
};