export interface User {
  access_token: string;
  refresh_token: string;
  username?: string;
  }
  
  export interface AuthContextType {
    user: User | null;
    login: (user: User) => Promise<void>;
    logout: () => void;
    loading: boolean;
  }