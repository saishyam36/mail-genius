/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      console.log("Login Success:", tokenResponse);
      setAccessToken(tokenResponse.access_token);
      localStorage.setItem('google_access_token', tokenResponse.access_token);

      (async () => {
        try {
          const userInfoResponse = await axios.get(
            'https://www.googleapis.com/oauth2/v3/userinfo',
            { headers: { Authorization: `Bearer ${tokenResponse.access_token}` } },
          );
          setUser(userInfoResponse.data);
          localStorage.setItem('user_info', JSON.stringify(userInfoResponse.data));
        } catch (error) {
          console.error("Error fetching user info:", error);
          setUser(null);
        }
      })();
    },
    onError: (error) => {
      console.log('Login Failed:', error);
      setAccessToken(null);
      setUser(null);
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  });

  const logout = React.useCallback(() => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_info');
    // Potentially revoke token on Google's side if needed
  }, []);

  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    const storedUser = localStorage.getItem('user_info');

    if (storedToken) {
      setAccessToken(storedToken);
      // Optionally verify token validity with Google here
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const contextValue = React.useMemo(
    () => ({ accessToken, user, login, logout, loading }),
    [accessToken, user, login, logout, loading]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
