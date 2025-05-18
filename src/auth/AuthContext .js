// src/auth/AuthContext.jsx
import React, { createContext, useContext, useState } from 'react';

const AuthContext = createContext();
export const useAuth = () => useContext(AuthContext);

export function AuthContext({ children }) {
  const [user, setUser] = useState(false);
  const login = () => setUser(true);
  const logout = () => setUser(false);
  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
