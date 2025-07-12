// hooks/useAuth.ts - Fixed version
import { createContext, useContext, useCallback, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import bcrypt from 'bcryptjs';
import type {
  User,
  AuthState,
  LoginCredentials,
  RegisterCredentials,
  EmailVerificationData,
  ForgotPasswordData,
  PasswordResetData,
  AuthResponse,
} from '@/types/auth';

// Constants
const TABLES = {
  USERS: 'users',
  EMAIL_VERIFICATIONS: 'email_verifications',
  PASSWORD_RESETS: 'password_resets',
  USER_ROLES: 'user_roles',
};

const TOKEN_EXPIRY_HOURS = 24;
const VERIFICATION_CODE_LENGTH = 6;

// Helper functions
const generateVerificationCode = (): string => {
  return Math.random().toString().substr(2, VERIFICATION_CODE_LENGTH).padStart(VERIFICATION_CODE_LENGTH, '0');
};

const generateToken = (): string => {
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
};

const handleSupabaseError = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === 'string') return error;
  return 'An unexpected error occurred';
};

// Auth Context Type
interface AuthContextType extends AuthState {
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<AuthResponse>;
  register: (credentials: RegisterCredentials) => Promise<AuthResponse>;
  verifyEmail: (data: EmailVerificationData) => Promise<AuthResponse>;
  resendVerificationCode: (email: string) => Promise<AuthResponse>;
  forgotPassword: (data: ForgotPasswordData) => Promise<AuthResponse>;
  resetPassword: (data: PasswordResetData) => Promise<AuthResponse>;
  logout: () => Promise<void>;
  clearError: () => void;
}

// Create Auth Context
const AuthContext = createContext<AuthContextType | null>(null);

// Auth Provider Component
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isLoading: true,
    isAuthenticated: false,
    session: null,
  });
  const [error, setError] = useState<string | null>(null);

  // Initialize auth state
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Session error:', error);
          setAuthState(prev => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          // Fetch user data from our users table
          const { data: userData, error: userError } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (userData && !userError) {
            setAuthState({
              user: userData,
              isLoading: false,
              isAuthenticated: true,
              session,
            });
          } else {
            setAuthState(prev => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState(prev => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setAuthState(prev => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        console.log('Auth state changed:', event);
        
        if (event === 'SIGNED_IN' && session?.user) {
          // Fetch user data
          const { data: userData, error: userError } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (userData && !userError) {
            setAuthState({
              user: userData,
              isLoading: false,
              isAuthenticated: true,
              session,
            });
          }
        } else if (event === 'SIGNED_OUT') {
          setAuthState({
            user: null,
            isLoading: false,
            isAuthenticated: false,
            session: null,
          });
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = useCallback(async (credentials: LoginCredentials): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find user by email
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', credentials.email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if user is locked
      if (user.locked_until && new Date(user.locked_until) > new Date()) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Account is temporarily locked. Please try again later.');
        return { success: false, error: 'Account is temporarily locked. Please try again later.' };
      }

      // Verify password
      const isValidPassword = await bcrypt.compare(credentials.password, user.password_hash);
      
      if (!isValidPassword) {
        // Increment failed attempts
        const failedAttempts = user.failed_login_attempts + 1;
        const lockUntil = failedAttempts >= 5 ? new Date(Date.now() + 30 * 60 * 1000) : null; // 30 min lock

        await supabase
          .from(TABLES.USERS)
          .update({
            failed_login_attempts: failedAttempts,
            locked_until: lockUntil?.toISOString(),
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', user.user_id);

        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid email or password');
        return { success: false, error: 'Invalid email or password' };
      }

      // Check if email is verified
      if (!user.email_verified) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Please verify your email before logging in');
        return { 
          success: false, 
          error: 'Please verify your email before logging in',
          data: { requiresVerification: true }
        };
      }

      // Create Supabase session
      const { data: authData, error: signInError } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (signInError) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError(handleSupabaseError(signInError));
        return { success: false, error: handleSupabaseError(signInError) };
      }

      // Reset failed attempts and update last login
      await supabase
        .from(TABLES.USERS)
        .update({
          failed_login_attempts: 0,
          locked_until: null,
          last_login_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', user.user_id);

      console.log('✅ User logged in:', user.email);

      setAuthState({
        user,
        isLoading: false,
        isAuthenticated: true,
        session: authData.session,
      });

      return { success: true, message: 'Login successful!' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const register = useCallback(async (credentials: RegisterCredentials): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate passwords match
      if (credentials.password !== credentials.confirmPassword) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Passwords do not match');
        return { success: false, error: 'Passwords do not match' };
      }

      // Check if user already exists
      const { data: existingUser, error: checkError } = await supabase
        .from(TABLES.USERS)
        .select('user_id, email_verified')
        .eq('email', credentials.email.toLowerCase())
        .single();

      if (existingUser && !checkError) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        if (existingUser.email_verified) {
          setError('An account with this email already exists');
          return { success: false, error: 'An account with this email already exists' };
        } else {
          setError('An account with this email exists but is not verified. Please check your email.');
          return { success: false, error: 'An account with this email exists but is not verified. Please check your email.' };
        }
      }

      // Hash password
      const saltRounds = 12;
      const passwordHash = await bcrypt.hash(credentials.password, saltRounds);

      // Create user in our users table
      const { data: newUser, error: userError } = await supabase
        .from(TABLES.USERS)
        .insert({
          email: credentials.email.toLowerCase(),
          password_hash: passwordHash,
          first_name: credentials.first_name,
          last_name: credentials.last_name,
          email_verified: false,
          is_active: true,
          failed_login_attempts: 0,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (userError) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        return { success: false, error: handleSupabaseError(userError) };
      }

      // Generate verification code and token
      const verificationCode = generateVerificationCode();
      const verificationToken = generateToken();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create email verification record
      const { error: verificationError } = await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .insert({
          user_id: newUser.user_id,
          email: credentials.email.toLowerCase(),
          verification_code: verificationCode,
          verification_token: verificationToken,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      if (verificationError) {
        console.error('Verification record error:', verificationError);
      }

      console.log('📧 Verification email would be sent to:', credentials.email);
      console.log('🔑 Verification code:', verificationCode);

      setAuthState(prev => ({ ...prev, isLoading: false }));

      return { 
        success: true, 
        message: 'Registration successful! Please check your email for verification code.',
        data: { 
          email: credentials.email,
          verificationCode, // In production, this would be sent via email
          userId: newUser.user_id 
        }
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const verifyEmail = useCallback(async (data: EmailVerificationData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find verification record
      const { data: verification, error: verificationError } = await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .select('*')
        .eq('email', data.email.toLowerCase())
        .eq('verification_code', data.verification_code.toUpperCase())
        .is('verified_at', null)
        .single();

      if (verificationError || !verification) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid verification code');
        return { success: false, error: 'Invalid verification code' };
      }

      // Check if code has expired
      const now = new Date();
      const expiresAt = new Date(verification.expires_at);
      if (now > expiresAt) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Verification code has expired');
        return { success: false, error: 'Verification code has expired' };
      }

      // Mark verification as completed
      await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .update({
          verified_at: new Date().toISOString(),
        })
        .eq('id', verification.id);

      // Update user as verified
      await supabase
        .from(TABLES.USERS)
        .update({
          email_verified: true,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', verification.user_id);

      console.log('✅ Email verified for:', data.email);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Email verified successfully!' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resendVerificationCode = useCallback(async (email: string): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find user
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('User not found');
        return { success: false, error: 'User not found' };
      }

      if (user.email_verified) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Email is already verified');
        return { success: false, error: 'Email is already verified' };
      }

      // Generate new verification code
      const verificationCode = generateVerificationCode();
      const verificationToken = generateToken();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create new verification record
      await supabase
        .from(TABLES.EMAIL_VERIFICATIONS)
        .insert({
          user_id: user.user_id,
          email: email.toLowerCase(),
          verification_code: verificationCode,
          verification_token: verificationToken,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      console.log('📧 New verification code sent to:', email);
      console.log('🔑 New verification code:', verificationCode);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: true, 
        message: 'New verification code sent!',
        data: { verificationCode } // In production, this would be sent via email
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const forgotPassword = useCallback(async (data: ForgotPasswordData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Find user
      const { data: user, error: userError } = await supabase
        .from(TABLES.USERS)
        .select('*')
        .eq('email', data.email.toLowerCase())
        .single();

      if (userError || !user) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        // For security, don't reveal if email exists
        return { success: true, message: 'If an account with this email exists, a password reset link has been sent.' };
      }

      // Generate reset token
      const resetToken = generateToken();
      const resetCode = generateVerificationCode();
      const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000);

      // Create password reset record
      await supabase
        .from(TABLES.PASSWORD_RESETS)
        .insert({
          user_id: user.user_id,
          email: data.email.toLowerCase(),
          reset_token: resetToken,
          reset_code: resetCode,
          expires_at: expiresAt.toISOString(),
          attempts: 0,
          created_at: new Date().toISOString(),
        });

      console.log('📧 Password reset email would be sent to:', data.email);
      console.log('🔑 Reset token:', resetToken);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { 
        success: true, 
        message: 'Password reset instructions have been sent to your email.',
        data: { resetToken } // In production, this would be sent via email
      };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const resetPassword = useCallback(async (data: PasswordResetData): Promise<AuthResponse> => {
    setError(null);
    setAuthState(prev => ({ ...prev, isLoading: true }));

    try {
      // Validate passwords match
      if (data.new_password !== data.confirm_password) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Passwords do not match');
        return { success: false, error: 'Passwords do not match' };
      }

      // Find reset record
      const { data: resetRecord, error: resetError } = await supabase
        .from(TABLES.PASSWORD_RESETS)
        .select('*')
        .eq('reset_token', data.reset_token)
        .is('used_at', null)
        .single();

      if (resetError || !resetRecord) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Invalid or expired reset token');
        return { success: false, error: 'Invalid or expired reset token' };
      }

      // Check if token has expired
      const now = new Date();
      const expiresAt = new Date(resetRecord.expires_at);
      if (now > expiresAt) {
        setAuthState(prev => ({ ...prev, isLoading: false }));
        setError('Reset token has expired');
        return { success: false, error: 'Reset token has expired' };
      }

      // Hash new password
      const saltRounds = 12;
      const newPasswordHash = await bcrypt.hash(data.new_password, saltRounds);

      // Update user password
      await supabase
        .from(TABLES.USERS)
        .update({
          password_hash: newPasswordHash,
          failed_login_attempts: 0,
          locked_until: null,
          updated_at: new Date().toISOString(),
        })
        .eq('user_id', resetRecord.user_id);

      // Mark reset token as used
      await supabase
        .from(TABLES.PASSWORD_RESETS)
        .update({
          used_at: new Date().toISOString(),
        })
        .eq('id', resetRecord.id);

      console.log('✅ Password reset for:', resetRecord.email);

      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: true, message: 'Password reset successfully!' };

    } catch (err) {
      const errorMessage = handleSupabaseError(err);
      setError(errorMessage);
      setAuthState(prev => ({ ...prev, isLoading: false }));
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    setAuthState(prev => ({ ...prev, isLoading: true }));
    
    try {
      const { error } = await supabase.auth.signOut();
      
      if (error) {
        console.error('Logout error:', error);
      }
      
      console.log('👋 User logged out');
      
      setAuthState({
        user: null,
        isLoading: false,
        isAuthenticated: false,
        session: null,
      });
      
      setError(null);
    } catch (err) {
      console.error('Logout error:', err);
      setAuthState(prev => ({ ...prev, isLoading: false }));
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
  }, []);

  const contextValue: AuthContextType = {
    ...authState,
    error,
    login,
    register,
    verifyEmail,
    resendVerificationCode,
    forgotPassword,
    resetPassword,
    logout,
    clearError,
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// Hook to use auth context
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}