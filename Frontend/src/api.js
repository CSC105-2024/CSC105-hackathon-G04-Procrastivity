const API_BASE = "http://localhost:8000";

async function apiRequest(path, method = "GET", body = null) {
    const options = {
        method,
        headers: {
            "Content-Type": "application/json",
        },
        credentials: "include",
    };
    if (body) {
        options.body = JSON.stringify(body);
    }
    const res = await fetch(`${API_BASE}${path}`, options);
    if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.msg || "API request failed");
    }
    return res.json();
}

export const createUser = (data) => apiRequest("/user/createUser", "POST", data);
export const getUser = (userId) => apiRequest(`/user/getUser?userId=${userId}`, "GET");
export const updateUsername = (data) => apiRequest("/user/updateUsername", "PATCH", data);
export const updateProfilePicture = (data) => apiRequest("/user/updateProfilePicture", "PATCH", data);
export const updateXp = (data) => apiRequest("/user/updateXp", "PATCH", data);

export const createTask = (data) => apiRequest("/task/createTask", "POST", data);
export const getTask = (data) => apiRequest("/task/getTask", "PATCH", data);
export const updateTask = (data) => apiRequest("/task/updateTask", "PATCH", data);
export const procrastinateTask = (data) => apiRequest("/task/procrastinate", "POST", data);
export const deleteTask = (data) => apiRequest("/task/deleteTask", "DELETE", data);

export const updateSubTask = (data) => apiRequest("/subTask/updateSubTask", "PATCH", data);
