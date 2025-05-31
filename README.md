## :pushpin: Project Title

&emsp;A web application where the user can "procrastinate" a task from a todo list. Once a task is "procrastinated", two smaller task related to the main task will be generated for the user to complete.

---

## :rocket: Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/CSC105-2024/CSC105-hackathon-G04-Procrastivity.git
   cd CSC105-hackathon-G04-Procrastivity
   ```

---

## :hammer: Frontend - React

### :wrench: Tech Stack

- React
- Axios
- React Router DOM
- Tailwind CSS
- Zod

### :rocket: Getting Started - React Client

1. Navigate to the frontend directory:
   ```bash
   cd Frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. The client will be running on [http://localhost:5173](http://localhost:5173) (or similar, depending on your setup).

---

## :wrench: Backend - Node.js

### :hammer_and_wrench: Tech Stack

- Node.js
- Hono
- MySQL

### :electric_plug: API Endpoints

| Method | Endpoint                     | Description                                                            |
|--------|------------------------------|------------------------------------------------------------------------|
| POST   | `/user/createUser`           | Create an account for a user                                           |
| GET    | `/user/getUser/:id`          | Get all information of a user based on given user id                   |
| PATCH  | `/user/updateUsername`       | Updates a user's username                                              |
| PATCH  | `/user/updateProfilePicture` | Update a user's profile picture                                        |
| PATCH  | `/user/updateXp`             | Updates a user's xp                                                    |
| POST   | `/task/createTask`           | Create a task for a user                                               |
| POST   | `/task/procrastinate`        | "Procrastinate", creates 2 subtask related to the main task for a user |
| PATCH  | `/task/getTask`              | Get all task of a user(with or without filter)                         |
| PATCH  | `/task/updateTask`           | Updates the completion status of a task                                |
| DELTE  | `/task/deleteTask/:id`       | Delete a task based on given task id                                   |
| PATCH  | `/subTask/updateSubTask`     | Updates the completion status of a subtask                             |

### :rocket: Getting Started - Node.js Server

1. Navigate to the backend directory:
   ```bash
   cd Backend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file and configure the following variables:
   ```
   DATABASE_URL='{Your database URL}'
   SHADOW_DATABASE_URL='{Your database URL}'
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

5. The server will be running on [http://localhost:8000](http://localhost:8000)
