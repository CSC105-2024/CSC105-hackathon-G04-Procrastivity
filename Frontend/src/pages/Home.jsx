import React, { useState, useRef, useEffect } from "react";
import { GiPodium } from "react-icons/gi";
import { FaCheckCircle, FaRegClock, FaTrophy } from "react-icons/fa";
import { useUser } from '../contexts/UserContext';
import { getTasks, createTask, updateTask, deleteTask, updateSubTask, procrastinateTask } from '../services/api';
import { useNavigate } from "react-router-dom";

const Home = () => {
    const { user, loading, refreshUser } = useUser();
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const navigate = useNavigate ? useNavigate() : () => {};
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [expandedTaskId, setExpandedTaskId] = useState(null);
    const [taskList, setTaskList] = useState([]);
    const [showCreateTaskModal, setShowCreateTaskModal] = useState(false);
    const [newTask, setNewTask] = useState({ title: '', category: '', dueDate: '' });
    const dropdownRef = useRef(null);
    const categories = ["work", "personal", "study", "errands", "health", "finance"];

    useEffect(() => {
        document.title = "Procrastivity - Home";
        if (user) {
            getTasks(user.userId, selectedCategory);
        }
    }, [])

    useEffect(() => {
        if (!loading && !user) navigate('/login');
    }, [user, loading, navigate]);

    useEffect(() => {
        if (user) {
            console.log(selectedCategory);
            getTasks(user.userId, selectedCategory).then(res => {
                console.log(res.data)
                setTaskList(res.data);
            })

        }
    }, [user, selectedCategory]);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const handleProcrastinate = async (taskId) => {
        await procrastinateTask(taskId);
        // Refetch tasks from backend to get new subtasks
        if (user) {
            const res = await getTasks(user.userId, selectedCategory);
            if (res.success) setTaskList(res.data);
            await refreshUser();
        }
        setExpandedTaskId(taskId);
    };

    const toggleMainTaskComplete = async (taskId) => {
        const task = taskList.find(t => t.taskId === taskId);
        await updateTask(taskId, { completed: !task.completed });
        if (user) {
            const res = await getTasks(user.userId, selectedCategory);
            if (res.success) setTaskList(res.data);
            await refreshUser();
        }
    };

    const toggleSubtaskComplete = async (taskId, subTaskId) => {
        const task = taskList.find(t => t.taskId === taskId);
        const sub = task.subTask.find(s => s.subTaskId === subTaskId);
        await updateSubTask(subTaskId, { completed: !sub.completed });
        setTaskList(prev => prev.map(t => t.taskId === taskId ? { ...t, subTask: t.subTask.map(s => s.subTaskId === subTaskId ? { ...s, completed: !s.completed } : s) } : t));
        await refreshUser();
    };

    const handleCreateTask = async (e) => {
        e.preventDefault();
        const res = await createTask({ ...newTask, userId: user.userId });
        if (res.success) {
            setTaskList(prev => [...prev, res.data]);
            setShowCreateTaskModal(false);
            setNewTask({ title: '', category: '', dueDate: '' });
        }
    };

    const handleDeleteTask = async (taskId) => {
        await deleteTask(taskId);
        if (user) {
            const res = await getTasks(user.userId, selectedCategory);
            if (res.success) setTaskList(res.data);
        }
    };

    return (
        <>
            {/* Top Controls */}
            <div className="flex justify-between items-center mt-5 mx-5 relative lg:mt-10 lg:px-85" >
                <button
                    onClick={() => setShowCreateTaskModal(true)}
                    className="px-[25px] py-[12px] rounded-[4px] cursor-pointer text-[13px] uppercase tracking-[1.5px] transition-all duration-300 ease-in-out font-normal border border-black text-black hover:bg-black hover:text-white lg:ml-5"
                >
                    Add new Task
                </button>
                {showCreateTaskModal && (
                    <div className="fixed inset-0 flex justify-center items-center z-50"
                         style={{
                                 backgroundColor: 'rgba(0,0,0,0.3)', // a slight dark overlay to improve contrast
                                 backdropFilter: 'blur(8px)',       // blur effect on the background
                                 WebkitBackdropFilter: 'blur(8px)', // for Safari support
                             }}>
                        <div className="bg-white p-6 rounded-xl shadow-lg w-[90%] max-w-md relative">
                            <button
                                onClick={() => setShowCreateTaskModal(false)}
                                className="absolute top-4 right-4 text-xl font-bold text-gray-700 hover:text-black"
                            >
                                ×
                            </button>
                            <h2 className="text-2xl font-semibold mb-2">Create New Task</h2>
                            <p className="text-sm text-gray-600 mb-4">What’s the next thing you want to procrastinate on (productively)?</p>

                            <input
                                type="text"
                                placeholder="e.g., Write an essay"
                                className="w-full border px-3 py-2 rounded mb-3"
                                value={newTask.title}
                                onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                            />
                            <select
                                className="w-full border px-3 py-2 rounded mb-3"
                                value={newTask.category}
                                onChange={(e) => setNewTask({ ...newTask, category: e.target.value })}
                            >
                                <option>Select a category</option>
                                {categories.map((category) => (
                                    <option key={category}>{category}</option>
                                ))}
                            </select>
                            <input
                                type="date"
                                className="w-full border px-3 py-2 rounded mb-5"
                                value={newTask.dueDate}
                                onChange={(e) => setNewTask({ ...newTask, dueDate: e.target.value })}
                            />
                            <button
                                className="w-full bg-black text-white py-2 rounded hover:bg-gray-900 transition"
                                onClick={handleCreateTask}
                            >
                                Add Task
                            </button>
                        </div>
                    </div>
                )}

                <div className="flex items-center gap-1" ref={dropdownRef}>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        className="h-7 w-7 text-black transition-transform group-hover:rotate-[-15deg]"
                    >
                        <path d="M0 0h24v24H0z" fill="none" />
                        <path d="M14 14v6l-4 2v-8L4 5V3h16v2l-6 9zM6.404 5L12 13.394 17.596 5H6.404z" />
                    </svg>
                    <button
                        type="button"
                        onClick={() => setIsDropdownOpen((prev) => !prev)}
                        className="inline-flex justify-center rounded-md border border-gray-300 bg-white pl-3 pr-2 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
                        aria-haspopup="true"
                        aria-expanded={isDropdownOpen}
                    >
                        {selectedCategory || "Select Category"}
                        <svg
                            className={`ml-2 -mr-1 h-5 w-5 transition-transform duration-200 ${isDropdownOpen ? "rotate-180" : ""}`}
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                    </button>

                    {isDropdownOpen && (
                        <div className="absolute right-0 mt-68.5 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50 lg:mr-84">
                            <div className="py-1">
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setIsDropdownOpen(false);
                                    }}
                                    className="block w-full px-4 py-2 text-left text-red-600 hover:bg-gray-100 text-sm font-semibold"
                                >
                                    Reset Filter
                                </button>
                                <hr className="my-1" />
                                {categories.map((category) => (
                                    <button
                                        key={category}
                                        onClick={() => {
                                            setSelectedCategory(category);
                                            setIsDropdownOpen(false);
                                        }}
                                        className="block w-full px-4 py-2 text-left text-gray-700 hover:bg-gray-100 text-sm"
                                    >
                                        {category}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex justify-center flex-row">
                {/* Sidebar */}
                <div className="hidden lg:flex mt-10 w-[max-content] h-[max-content]">
                    <div className="w-80 ml-10 px-10 p-6 bg-white rounded-3xl shadow-xl border">
                        <div className="flex items-center mb-4 space-x-2">
                            <GiPodium className="text-xl" />
                            <h2 className="text-xl font-semibold">Your progress</h2>
                        </div>
                        <div className="space-y-4">
                            <div className="flex items-center justify-between p-3 bg-red-50 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <FaTrophy className="text-yellow-500" />
                                    <span>XP points</span>
                                </div>
                                <span className="font-semibold">{user?.currentXp}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-gray-100 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <FaTrophy className="text-black" />
                                    <span>Current rank</span>
                                </div>
                                <span className="font-semibold">{user?.rank}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-green-50 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <FaCheckCircle className="text-green-500" />
                                    <span>Tasks Completed</span>
                                </div>
                                <span className="font-semibold">{user?.taskCompleted}</span>
                            </div>
                            <div className="flex items-center justify-between p-3 bg-rose-50 rounded-xl">
                                <div className="flex items-center space-x-2">
                                    <FaRegClock className="text-rose-500" />
                                    <span>Tasks Procrastinated</span>
                                </div>
                                <span className="font-semibold">{user?.taskProcrastinated}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-col gap-4 mt-10.25 ml-5 mr-5">
                    {taskList.map((task) => (
                        <div key={task.taskId}>
                            {/* Main Task */}
                            <div className="p-5 border rounded-xl shadow-sm bg-white w-88 lg:w-200">
                                <div className="flex justify-between items-start mb-3">
                                    <h2 className="text-xl font-semibold">{task.title}</h2>
                                    {!task.procrastinated && (
                                        <button
                                            onClick={() => handleProcrastinate(task.taskId)}
                                            className="flex items-center gap-1 px-3 py-1 text-sm font-medium text-gray-700 border rounded-full shadow-sm hover:bg-gray-100"
                                        >
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                strokeWidth={2}
                                                stroke="currentColor"
                                                className="w-4 h-4"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    d="M13 10V3L4 14h7v7l9-11h-7z"
                                                />
                                            </svg>
                                            Procrastinate
                                        </button>
                                    )}
                                </div>

                                <div className="flex items-center gap-2 mb-2">
                                    <input
                                        type="checkbox"
                                        checked={task.completed}
                                        readOnly
                                        className="w-4 h-4"
                                    />
                                    <span className={`text-gray-700 font-medium ${task.completed ? 'text-green-600' : ''}`}>
                                        {task.completed ? "Complete" : "Pending..."}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-500 mb-4">
                                    Due in: {task.dueIn} days
                                </p>

                                <div className="flex gap-3 justify-end">
                                    <button
                                        onClick={() => toggleMainTaskComplete(task.taskId)}
                                        className={`px-4 py-2 rounded-full text-white text-sm font-medium transition ${
                                            task.completed ? "bg-gray-400 hover:bg-gray-500" : "bg-green-500 hover:bg-green-600"
                                        }`}
                                    >
                                        {task.completed ? "Undo" : "Complete"}
                                    </button>


                                    <button
                                        className="px-4 py-2 rounded-full bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition flex items-center gap-1"
                                        onClick={() => handleDeleteTask(task.taskId)}
                                    >
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            className="w-4 h-4"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth="2"
                                                d="M6 18L18 6M6 6l12 12"
                                            />
                                        </svg>
                                        Delete
                                    </button>
                                </div>
                            </div>

                            {/* Subtasks */}
                            {task.procrastinated && task.subTask?.map((sub) => (
                                <div
                                    key={sub.subTaskId}
                                    className="ml-10 mt-4 p-4 border rounded-lg shadow bg-gray-50 max-w-md flex flex-col justify-between lg:ml-80"
                                >
                                    <div>
                                        <h3 className="text-md font-semibold mb-2">{sub.title.trim()}</h3>
                                        <div className="flex items-center gap-2 mb-2">
                                            <input
                                                type="checkbox"
                                                checked={sub.completed}
                                                readOnly
                                                className="w-4 h-4"
                                            />
                                            <span className={`text-sm ${sub.completed ? "text-green-600 font-medium" : "text-gray-700"}`}>
                                                {sub.completed ? "Complete" : "Pending..."}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="flex justify-end mt-4">
                                        <button
                                            onClick={() => toggleSubtaskComplete(task.taskId, sub.subTaskId)}
                                            className={`px-4 py-1 rounded-full text-white text-sm font-medium transition ${
                                                sub.completed ? "bg-gray-400 hover:bg-gray-500" : "bg-green-500 hover:bg-green-600"
                                            }`}
                                        >
                                            {sub.completed ? "Undo" : "Complete"}
                                        </button>
                                    </div>
                                </div>
                            ))}

                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default Home;
