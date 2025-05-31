import React, { createContext, useContext, useEffect, useState } from 'react';
import { getProfile, logout as apiLogout } from '../services/api';

const UserContext = createContext();

export const useUser = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        // Try to get userId from localStorage or session (if you store it after login)
        const storedUser = JSON.parse(localStorage.getItem('user'));
        const userId = storedUser?.userId;
        if (!userId) throw new Error('No userId');
        const res = await getProfile(userId);
        if (res.success) setUser(res.data);
      } catch (e) {
        setUser(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const logout = async () => {
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <UserContext.Provider value={{ user, setUser, loading, logout }}>
      {children}
    </UserContext.Provider>
  );
};

