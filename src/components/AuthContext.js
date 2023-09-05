import { createContext, useContext, useEffect, useState } from 'react';
import { auth } from '../firebaseUtils'; // Adjust the path to your firebase auth instance
import { onAuthStateChanged } from 'firebase/auth'; // Import onAuthStateChanged from the correct module

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [authUser, setAuthUser] = useState(null); //represent current auth user or null if not authenticated

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setAuthUser(user);
      } else {
        setAuthUser(null);
      }
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <AuthContext.Provider value={{ authUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
}; //access current user's authentication status
