import React, { createContext, useContext } from 'react';
import { Usertoken } from './UserToken';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const userData = Usertoken(); // Get user data using Usertoken function

  return (
    <UserContext.Provider value={userData}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
