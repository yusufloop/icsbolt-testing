import type { User as SupabaseUser, Session } from '@supabase/supabase-js';

// Extend Supabase User type with our custom fields
export interface User extends SupabaseUser {
  // Supabase auth.users already includes:
  // - id: string
  // - email: string
  // - email_confirmed_at: string | null
  // - created_at: string
  // - updated_at: string
  // - user_metadata: any
  // - app_metadata: any
}

export interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
}

// Keep these for backward compatibility if needed
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

export interface AuthResponse {
  success: boolean;
  message?: string;
  error?: string;
  data?: any;
}

// Optional: Profile table for additional user data
export interface Profile {
  id: string; // References auth.users(id)
  first_name?: string;
  last_name?: string;
  avatar_url?: string;
  website?: string;
  created_at: string;
  updated_at: string;
}