import React, { useEffect, createContext, useContext, useState, ReactNode } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

// Define the type for the AuthContext
interface AuthContextType {
  profile: any;
}

// Create the AuthContext with a default value of null
const AuthContext = createContext<AuthContextType | null>(null);

// Define the props for AuthProvider including children
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { authState, oktaAuth } = useOktaAuth();
  const [profile, setProfile] = useState(null);

  useEffect(() => {
    if (authState && authState.isAuthenticated) {
      const getUserInfo = async () => {
        const userInfo = await oktaAuth.getUser();
        
        // Create or fetch user profile in your database
        try {
          const response = await axios.post('/api/createProfile', {
            userId: userInfo.sub, // Assuming `sub` is the user ID
            email: userInfo.email,
            name: userInfo.name,
            // Add other necessary profile information
          });
          setProfile(response.data);
        } catch (error) {
          console.error('Error creating or fetching user profile:', error);
        }
      };
      
      getUserInfo();
    }
  }, [authState, oktaAuth]);

  return (
    <AuthContext.Provider value={{ profile }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
