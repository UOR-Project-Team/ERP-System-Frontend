import React, { createContext, useContext, useState } from 'react';
import { Usertoken } from './token.userToken';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const initialUserData = Usertoken(); // Get initial user data using Usertoken function
  const [userData, setUserData] = useState(initialUserData);

  const updateUser = (newUserData) => {
    setUserData(newUserData);
  };

  return (
    <UserContext.Provider value={{ userData, updateUser }}>
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
