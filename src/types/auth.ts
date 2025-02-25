export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  houseName: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: null | {
    id: string;
    email: string;
    firstName: string;
    lastName: string;
    houseName: string;
  };
  login: (data: LoginFormData) => Promise<void>;
  register: (data: RegisterFormData) => Promise<void>;
  logout: () => void;
}
