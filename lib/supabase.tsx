import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Configure headers for self-hosted Supabase
const headers: Record<string, string> = {
  'Content-Type': 'application/json',
};

// Add ngrok headers for development
if (process.env.EXPO_PUBLIC_NGROK_SKIP_WARNING === 'true') {
  headers['ngrok-skip-browser-warning'] = 'true';
}

// Platform-specific configurations
const options = {
  auth: {
    storage: Platform.select({
      web: undefined, // Use default localStorage on web
      default: undefined, // Use AsyncStorage on mobile (handled by Supabase)
    }),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: Platform.OS === 'web',
  },
  global: {
    headers,
  },
  db: {
    schema: 'public',
  },
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
};

export const supabase = createClient(supabaseUrl, supabaseAnonKey, options);

// Helper function to handle Supabase errors
export const handleSupabaseError = (error: any): string => {
  if (error?.message) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  return 'An unexpected error occurred';
};

// Database table names
export const TABLES = {
  USERS: 'users',
  EMAIL_VERIFICATIONS: 'email_verifications',
  PASSWORD_RESETS: 'password_resets',
  ROLES: 'roles',
  USER_ROLES: 'user_roles',
} as const;