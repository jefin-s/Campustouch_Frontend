import React, { createContext, useContext, useState, useEffect } from 'react';
import { setAccessToken, getAccessToken } from '../services/api';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const decodeToken = (token) => {
    try {
      if (!token || typeof token !== 'string') return null;
      const base64Url = token.split('.')[1];
      if (!base64Url) return null;
      
      let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      // Add padding if necessary
      while (base64.length % 4 !== 0) {
        base64 += '=';
      }
      
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split('')
          .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
          .join('')
      );
      return JSON.parse(jsonPayload);
    } catch (e) {
      console.error('JWT Decode Error:', e);
      return null;
    }
  };

  const loginUser = (token, rolesFromApi) => {
    if (!token) return null;
    
    setAccessToken(token);
    const decoded = decodeToken(token);
    
    // Determine the role
    let role = null;
    
    // 1. Try from API response roles array
    if (rolesFromApi && Array.isArray(rolesFromApi) && rolesFromApi.length > 0) {
      role = rolesFromApi[0];
    } 
    // 2. Try from API response role string
    else if (rolesFromApi && typeof rolesFromApi === 'string') {
      role = rolesFromApi;
    }
    // 3. Try from decoded JWT claims
    else if (decoded) {
      const roleClaims = [
        "http://schemas.microsoft.com/ws/2008/06/identity/claims/role",
        "role",
        "roles"
      ];
      
      for (const claim of roleClaims) {
        if (decoded[claim]) {
          const claimValue = decoded[claim];
          role = Array.isArray(claimValue) ? claimValue[0] : claimValue;
          break;
        }
      }
    }
    
    const userData = {
      ...(decoded || {}),
      role: role || 'Unknown'
    };
    
    setUser(userData);
    return userData;
  };

  const logoutUser = () => {
    setAccessToken(null);
    setUser(null);
  };

  useEffect(() => {
    const token = getAccessToken();
    if (token) {
      loginUser(token);
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, loginUser, logoutUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
