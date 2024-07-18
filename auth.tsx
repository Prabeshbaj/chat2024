import React, { useEffect, createContext, useContext, useState } from 'react';
import { useOktaAuth } from '@okta/okta-react';
import axios from 'axios';

const AuthContext = createContext(null);

export const AuthProvider: React.FC = ({ children }) => {
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
