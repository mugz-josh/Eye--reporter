import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { storage } from '@/utils/storage';

interface User {
  id: string;
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  is_admin: boolean;
  created_at: string;
  updated_at: string;
}

interface UserContextType {
  user: User | null;
  setUser: (user: User | null) => void;
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};

interface UserProviderProps {
  children: ReactNode;
}

export const UserProvider: React.FC<UserProviderProps> = ({ children }) => {
  const [user, setUserState] = useState<User | null>(null);

  useEffect(() => {
    const currentUser = storage.getCurrentUser();
    setUserState(currentUser);
  }, []);

  const setUser = (newUser: User | null) => {
    setUserState(newUser);
    if (newUser) {
      storage.setCurrentUser(newUser);
    } else {
      storage.clearCurrentUser();
    }
  };

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
