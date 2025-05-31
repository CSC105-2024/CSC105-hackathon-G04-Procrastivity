import React from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { Zap } from "lucide-react";
import { Outlet } from "react-router-dom";

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  const isProfilePage = location.pathname === "/profile";

  return (
      <>
        <div className="flex items-center justify-between px-5 bg-white z-10 relative lg:mx-10">
          <div className="flex items-center mt-10">
            <Zap className="h-8 w-8 text-primary mt-1.5 transition-transform hover:rotate-[-15deg]" />
            <h1 className="text-4xl ml-1 font-bold">Procrastivity</h1>
          </div>

          <div
              onClick={() => navigate(isProfilePage ? "/" : "/profile")}
              className="group cursor-pointer p-2 rounded-full bg-white hover:shadow-md transition-shadow mt-10 flex items-center justify-center"
              title={isProfilePage ? "Go Home" : "Go to Profile"}
          >
            {isProfilePage ? (
                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="24" height="24" viewBox="0 0 24 24">
                  <path d="M 12 2.0996094 L 1 12 L 4 12 L 4 21 L 10 21 L 10 14 L 14 14 L 14 21 L 20 21 L 20 12 L 23 12 L 12 2.0996094 z"></path>
                </svg>
            ) : (
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-primary"
                >
                  <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                  <circle cx="12" cy="7" r="4"></circle>
                </svg>
            )}
          </div>
        </div>
        <div className="h-6 mt-3 w-full shadow-xl bg-white"></div>
        <Outlet />
      </>
  );
}

export default App;
