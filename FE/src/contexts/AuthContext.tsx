import React, {
    createContext,
    useState,
    useEffect,
    useContext,
    ReactNode,
  } from 'react';
  import { User, AuthContextType } from '@/types/Auth';
  
  const AuthContext = createContext<AuthContextType | undefined>(undefined);
  
  export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
  
    useEffect(() => {
      const initializeAuth = async () => {
        const access_token = localStorage.getItem('access_token');
        const refresh_token = localStorage.getItem('refresh_token');
        if (access_token ) {
          // TODO: 验证token的有效性
          setUser({ access_token });
        }
        setLoading(false);
      };
  
      initializeAuth();
    }, []);
  
    const login = async (user: User) => {
      localStorage.setItem('access_token', user.access_token);
      localStorage.setItem('refresh_token', user.refresh_token??"");
      setUser(user);
    };
  
    const logout = () => {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      setUser(null);
    };
  
    return (
      <AuthContext.Provider value={{ user, login, logout, loading }}>
        {children}
      </AuthContext.Provider>
    );
  };
  
  export const useAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (context === undefined) {
      throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
  };