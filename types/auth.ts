export interface User {
  user_id: string;
  email: string;
  name?: string;
  first_name: string;
  last_name: string;
  email_verified: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  last_login_at?: string;
  failed_login_attempts: number;
  locked_until?: string;
}

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  session: any;
}

export interface LoginCredentials {
  email: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterCredentials {
  email: string;
  password: string;
  confirmPassword: string;
  first_name: string;
  last_name: string;
}

export interface EmailVerificationData {
  email: string;
  verification_code: string;
}

export interface ForgotPasswordData {
  email: string;
}

export interface PasswordResetData {
  reset_token: string;
  new_password: string;
  confirm_password: string;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

export interface EmailVerification {
  id: string;
  user_id: string;
  email: string;
  verification_code: string;
  verification_token: string;
  expires_at: string;
  verified_at?: string;
  attempts: number;
  created_at: string;
}

export interface PasswordReset {
  id: string;
  user_id: string;
  email: string;
  reset_token: string;
  reset_code: string;
  expires_at: string;
  used_at?: string;
  attempts: number;
  ip_address?: string;
  created_at: string;
}

export interface Role {
  role_id: number;
  role_name: string;
}

export interface UserRole {
  user_id: string;
  role_id: number;
  role?: Role;
}