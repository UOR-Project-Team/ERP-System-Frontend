import React, { createContext, useContext, useState } from 'react';
import { Usertoken } from './token.userToken';

const UserContext = createContext(null);

export const UserProvider = ({ children }) => {
  const initialUserData = Usertoken(); // Get initial user data using Usertoken function
  const [userTokenData, setUserTokenData] = useState(initialUserData);

  const updateUserToken = () => {
    const newUserData = Usertoken();
    setUserTokenData(newUserData);
  };

  return (
    <UserContext.Provider value={{ userTokenData, updateUserToken }}>
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
