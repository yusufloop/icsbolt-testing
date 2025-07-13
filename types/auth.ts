export interface Profile {
  id: string;
  full_name: string;
  email: string;
  avatar_url?: string;
  created_at: string;
  updated_at: string;
}

export interface AuthError {
  message: string;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface SignUpData {
  email: string;
  password: string;
  fullName: string;
}