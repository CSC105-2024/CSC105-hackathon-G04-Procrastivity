import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import './index.css'
import App from './App.jsx'
import Profile from "./pages/Profile.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import { UserProvider } from './contexts/UserContext.jsx';

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        children: [
            {
                path: "/",
                element: <Home/>,
            },

            {
                path: "Profile/",
                element: <Profile/>,
            },

        ],
    },

    {
        path: "Login/",
        element: <Login/>,
    },

    {
        path: "Register/",
        element: <Register/>,
    },

])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <UserProvider>
      <RouterProvider router={router} />
    </UserProvider>
  </StrictMode>,
)
