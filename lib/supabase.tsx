import { createClient } from '@supabase/supabase-js';
import { Platform } from 'react-native';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

// Clean the URL - remove trailing slash if present
const cleanUrl = supabaseUrl.replace(/\/$/, '');

// Configure headers for self-hosted/ngrok Supabase
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
    // Important: Ensure the flow type is correct
    flowType: 'pkce' as const,
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

export const supabase = createClient(cleanUrl, supabaseAnonKey, options);

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

// Test function to verify connection
export const testSupabaseConnection = async () => {
  try {
    console.log('Testing Supabase connection...');
    console.log('URL:', cleanUrl);
    
    const { data, error } = await supabase
      .from('roles')
      .select('*')
      .limit(1);
    
    if (error) {
      console.error('Connection test failed:', error);
      return false;
    }
    
    console.log('✅ Supabase connection successful');
    return true;
  } catch (err) {
    console.error('❌ Supabase connection failed:', err);
    return false;
  }
};