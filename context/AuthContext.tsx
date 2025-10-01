import React, { createContext, useContext, useState, useEffect } from 'react';
import { signIn, signOut, getCurrentUser, fetchAuthSession, fetchUserAttributes } from 'aws-amplify/auth';

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  user: any | null;
  token: string | null;
  login: (username: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  isAuthenticated: false,
  isLoading: true,
  user: null,
  token: null,
  login: async () => {},
  logout: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    checkAuthState();
  }, []);

  const checkAuthState = async () => {
    try {
      setIsLoading(true);
      const currentUser = await getCurrentUser();

      if (currentUser) {
        console.log('User authenticated:', currentUser.username);

        // Get user attributes including email
        let userEmail = '';
        try {
          const attributes = await fetchUserAttributes();
          userEmail = attributes.email || '';
        } catch (attrError) {
          console.error('Error fetching user attributes:', attrError);
        }

        setIsAuthenticated(true);
        setUser({
          username: currentUser.username || 'User',
          email: userEmail,
        });

        // Get the auth token
        try {
          const session = await fetchAuthSession();
          const authToken = session.tokens?.idToken?.toString();
          setToken(authToken || null);
          console.log('Valid token obtained');
        } catch (tokenError) {
          console.error('Error getting token:', tokenError);
          setToken(null);
        }
      } else {
        console.log('No authenticated user found');
        setIsAuthenticated(false);
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      // This is expected when user is not authenticated
      console.log('Not authenticated (expected):', error.name);
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (username: string, password: string) => {
    try {
      setIsLoading(true);

      // Check if already signed in
      try {
        const currentUser = await getCurrentUser();
        if (currentUser) {
          console.log('User already authenticated');
          await checkAuthState();
          return;
        }
      } catch (e) {
        // Not signed in, continue with login
      }

      await signIn({ username, password });
      await checkAuthState();
    } catch (error) {
      console.error('Error signing in:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoading(true);
      await signOut();
      setIsAuthenticated(false);
      setUser(null);
      setToken(null);
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        isLoading,
        user,
        token,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
