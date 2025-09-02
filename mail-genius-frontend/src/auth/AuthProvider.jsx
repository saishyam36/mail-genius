/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useState, useEffect, useContext, useRef } from 'react';
import { useGoogleLogin } from '@react-oauth/google';
import axios from 'axios';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [accessToken, setAccessToken] = useState(null);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const accessTokenTimerRef = useRef(null);

  const clearAccessTokenTimer = () => {
    if (accessTokenTimerRef.current) {
      clearTimeout(accessTokenTimerRef.current);
      accessTokenTimerRef.current = null;
    }
  };

  const isTokenExpired = React.useCallback((token) => {
    if (!token) return true;

    // Check if the token exists in localStorage
    const storedToken = localStorage.getItem('google_access_token');
    if (!storedToken) return true;

    // Get the expiration time from localStorage
    const storedExpiration = localStorage.getItem('google_access_token_expiration');

    if (!storedExpiration) return false; // Assume not expired if no expiration time

    const expirationDate = new Date(parseInt(storedExpiration));
    const now = new Date();

    console.log('Token expiration check:', { expirationDate, now, isExpired: expirationDate <= now });

    return expirationDate <= now;
  }, []);

  const logout = React.useCallback(() => {
    setAccessToken(null);
    setUser(null);
    localStorage.removeItem('google_access_token');
    localStorage.removeItem('user_info');
    clearAccessTokenTimer(); // Clear timer on logout
    // Potentially revoke token on Google's side if needed
  }, []);

  const setAccessTokenWithExpiration = (token, expiresIn) => {
    setAccessToken(token);
    localStorage.setItem('google_access_token', token);

    // Store the expiration time in localStorage
    const expirationTime = new Date().getTime() + expiresIn * 1000;
    localStorage.setItem('google_access_token_expiration', expirationTime.toString());

    clearAccessTokenTimer(); // Clear any existing timer

    // Set a new timer to remove the token when it expires
    accessTokenTimerRef.current = setTimeout(() => {
      console.log('Access token expired. Logging out.');
      logout();
    }, expiresIn * 1000); // expiresIn is in seconds, convert to milliseconds
  };

  const login = useGoogleLogin({
    onSuccess: (tokenResponse) => {
      setAccessTokenWithExpiration(tokenResponse.access_token, tokenResponse.expires_in);
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
      clearAccessTokenTimer(); // Clear timer on login failure
    },
    scope: 'https://www.googleapis.com/auth/gmail.readonly https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/userinfo.profile',
  });

  useEffect(() => {
    const storedToken = localStorage.getItem('google_access_token');
    const storedUser = localStorage.getItem('user_info');

    if (storedToken) {
      // If a token is stored, we assume it's still valid for now.
      // In a real app, you might store the expiration time along with the token
      // and use it to set the timer here. For now, the token will be
      // considered valid until an API call fails or manual logout.
      setAccessToken(storedToken);
    }
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);

    return () => {
      clearAccessTokenTimer(); // Cleanup timer on component unmount
    };
  }, []);

  const contextValue = React.useMemo(
    () => ({ accessToken, user, login, logout, loading, isTokenExpired }),
    [accessToken, user, login, logout, loading, isTokenExpired]
  );

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
