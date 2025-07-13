// hooks/useAuth.tsx - Complete fixed version
import { emailService } from "@/lib/emailService";
import { supabase } from "@/lib/supabase";
import type {
  AuthResponse,
  AuthState,
  EmailVerificationData,
  ForgotPasswordData,
  LoginCredentials,
  PasswordResetData,
  RegisterCredentials,
} from "@/types/auth";
import * as Crypto from 'expo-crypto';
import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";

// Constants
const TABLES = {
  USERS: "users",
  EMAIL_VERIFICATIONS: "email_verifications",
  PASSWORD_RESETS: "password_resets",
  USER_ROLES: "user_roles",
};

const TOKEN_EXPIRY_HOURS = 24;
const VERIFICATION_CODE_LENGTH = 6;

// Helper functions
const generateVerificationCode = (): string => {
  return Math.random()
    .toString()
    .substr(2, VERIFICATION_CODE_LENGTH)
    .padStart(VERIFICATION_CODE_LENGTH, "0");
};

const generateToken = (): string => {
  return (
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15)
  );
};

// Helper function to hash password using expo-crypto
const hashPassword = async (password: string): Promise<string> => {
  // Generate a salt using random bytes
  const salt = await Crypto.getRandomBytesAsync(16);
  const saltHex = Array.from(salt, byte => byte.toString(16).padStart(2, '0')).join('');
  
  // Create password + salt combination
  const passwordWithSalt = password + saltHex;
  
  // Hash using SHA-256
  const hash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    passwordWithSalt
  );
  
  // Return salt + hash combined
  return saltHex + ':' + hash;
};

// Helper function to verify password
const verifyPassword = async (password: string, storedHash: string): Promise<boolean> => {
  const [salt, hash] = storedHash.split(':');
  const passwordWithSalt = password + salt;
  
  const computedHash = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    passwordWithSalt
  );
  
  return computedHash === hash;
};

const handleSupabaseError = (error: any): string => {
  if (error?.message) return error.message;
  if (typeof error === "string") return error;
  return "An unexpected error occurred";
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
        const {
          data: { session },
          error: sessionError,
        } = await supabase.auth.getSession();

        if (sessionError) {
          console.error("Session error:", sessionError);
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return;
        }

        if (session?.user) {
          // Fetch user data from our users table
          const { data: userData, error: userError } = await supabase
            .from(TABLES.USERS)
            .select("*")
            .eq("user_id", session.user.id)
            .single();

          if (userData && !userError) {
            setAuthState({
              user: userData,
              isLoading: false,
              isAuthenticated: true,
              session,
            });
          } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
          }
        } else {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
        }
      } catch (err) {
        console.error("Auth initialization error:", err);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
      }
    };

    initializeAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          const { data: userData } = await supabase
            .from(TABLES.USERS)
            .select('*')
            .eq('user_id', session.user.id)
            .single();

          if (userData) {
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

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Register function
  const register = useCallback(
    async (credentials: RegisterCredentials): Promise<AuthResponse> => {
      if (credentials.password !== credentials.confirmPassword) {
        return { success: false, error: "Passwords do not match" };
      }

      setAuthState((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      try {
        // Check if user already exists
        const { data: existingUser } = await supabase
          .from(TABLES.USERS)
          .select("email, email_verified")
          .eq("email", credentials.email.toLowerCase())
          .single();

        if (existingUser) {
          if (existingUser.email_verified) {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            return {
              success: false,
              error: "An account with this email already exists.",
            };
          } else {
            setAuthState((prev) => ({ ...prev, isLoading: false }));
            return {
              success: false,
              error: "An account with this email exists but is not verified. Please check your email.",
            };
          }
        }

        // Hash password using expo-crypto
        const passwordHash = await hashPassword(credentials.password);

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
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: handleSupabaseError(userError) };
        }

        // Generate verification code and token
        const verificationCode = generateVerificationCode();
        const verificationToken = generateToken();
        const expiresAt = new Date(
          Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
        );

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
          console.error("Verification record error:", verificationError);
        }

        // Send verification email
        await emailService.sendVerificationEmail(
          credentials.email,
          verificationCode,
          `${credentials.first_name} ${credentials.last_name}`
        );

        console.log("📧 Verification email would be sent to:", credentials.email);
        console.log("🔑 Verification code:", verificationCode);

        setAuthState((prev) => ({ ...prev, isLoading: false }));

        return {
          success: true,
          message: "Registration successful! Please check your email for verification code.",
          data: { requiresVerification: true, email: credentials.email },
        };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // Login function
  const login = useCallback(
    async (credentials: LoginCredentials): Promise<AuthResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      try {
        // Get user from your custom table
        const { data: userData, error: userError } = await supabase
          .from(TABLES.USERS)
          .select('*')
          .eq('email', credentials.email.toLowerCase())
          .single();

        if (userError || !userData) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: "Invalid email or password" };
        }

        // Check if account is locked
        if (userData.locked_until && new Date(userData.locked_until) > new Date()) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { 
            success: false, 
            error: "Account is temporarily locked. Please try again later." 
          };
        }

        // Verify password using expo-crypto
        const isPasswordValid = await verifyPassword(credentials.password, userData.password_hash);

        if (!isPasswordValid) {
          // Increment failed attempts
          const newFailedAttempts = userData.failed_login_attempts + 1;
          const shouldLock = newFailedAttempts >= 5;
          
          await supabase
            .from(TABLES.USERS)
            .update({
              failed_login_attempts: newFailedAttempts,
              locked_until: shouldLock ? 
                new Date(Date.now() + 30 * 60 * 1000).toISOString() : // Lock for 30 minutes
                null,
              updated_at: new Date().toISOString(),
            })
            .eq('user_id', userData.user_id);

          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { 
            success: false, 
            error: shouldLock ? 
              "Too many failed attempts. Account locked for 30 minutes." :
              "Invalid email or password" 
          };
        }

        // Check if email is verified
        if (!userData.email_verified) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return {
            success: false,
            error: "Please verify your email before logging in.",
            data: { requiresVerification: true, email: userData.email },
          };
        }

        // Check if account is active
        if (!userData.is_active) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: "Account is deactivated" };
        }

        // Reset failed attempts and update last login
        await supabase
          .from(TABLES.USERS)
          .update({
            last_login_at: new Date().toISOString(),
            failed_login_attempts: 0,
            locked_until: null,
            updated_at: new Date().toISOString(),
          })
          .eq('user_id', userData.user_id);

        // Create a custom session
        const sessionToken = await Crypto.digestStringAsync(
          Crypto.CryptoDigestAlgorithm.SHA256,
          userData.user_id + Date.now().toString()
        );

        setAuthState({
          user: userData,
          isLoading: false,
          isAuthenticated: true,
          session: { token: sessionToken, user: userData },
        });

        return { success: true, message: "Login successful!" };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  // Verify email function
  const verifyEmail = useCallback(
    async (data: EmailVerificationData): Promise<AuthResponse> => {
      setAuthState((prev) => ({ ...prev, isLoading: true }));
      setError(null);

      try {
        // Verify the code
        const { data: verification, error: verificationError } = await supabase
          .from(TABLES.EMAIL_VERIFICATIONS)
          .select('*')
          .eq('email', data.email.toLowerCase())
          .eq('verification_code', data.verification_code.toUpperCase())
          .is('verified_at', null)
          .gte('expires_at', new Date().toISOString())
          .single();

        if (verificationError || !verification) {
          setAuthState((prev) => ({ ...prev, isLoading: false }));
          return { success: false, error: "Invalid or expired verification code" };
        }

        // Mark verification as used
        await supabase
          .from(TABLES.EMAIL_VERIFICATIONS)
          .update({ verified_at: new Date().toISOString() })
          .eq('id', verification.id);

        // Update user as verified
        await supabase
          .from(TABLES.USERS)
          .update({ 
            email_verified: true,
            updated_at: new Date().toISOString()
          })
          .eq('user_id', verification.user_id);

        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: true, message: "Email verified successfully!" };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        setAuthState((prev) => ({ ...prev, isLoading: false }));
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const resendVerificationCode = useCallback(
    async (email: string): Promise<AuthResponse> => {
      setError(null);

      try {
        const verificationCode = generateVerificationCode();
        const verificationToken = generateToken();
        const expiresAt = new Date(
          Date.now() + TOKEN_EXPIRY_HOURS * 60 * 60 * 1000
        );

        // Get user data
        const { data: userData } = await supabase
          .from(TABLES.USERS)
          .select('user_id, first_name, last_name')
          .eq('email', email.toLowerCase())
          .single();

        if (!userData) {
          return { success: false, error: "User not found" };
        }

        // Create new verification record
        const { error: verificationError } = await supabase
          .from(TABLES.EMAIL_VERIFICATIONS)
          .insert({
            user_id: userData.user_id,
            email: email.toLowerCase(),
            verification_code: verificationCode,
            verification_token: verificationToken,
            expires_at: expiresAt.toISOString(),
            attempts: 0,
            created_at: new Date().toISOString(),
          });

        if (verificationError) {
          return { success: false, error: handleSupabaseError(verificationError) };
        }

        // Send new verification email
        await emailService.sendVerificationEmail(
          email,
          verificationCode,
          `${userData.first_name} ${userData.last_name}`
        );

        return { success: true, message: "Verification code sent!" };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const forgotPassword = useCallback(
    async (data: ForgotPasswordData): Promise<AuthResponse> => {
      setError(null);

      try {
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
          redirectTo: 'your-app://reset-password', // Configure this URL
        });

        if (error) {
          return { success: false, error: handleSupabaseError(error) };
        }

        return { 
          success: true, 
          message: "Password reset instructions sent to your email!" 
        };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const resetPassword = useCallback(
    async (data: PasswordResetData): Promise<AuthResponse> => {
      setError(null);

      try {
        const { error } = await supabase.auth.updateUser({
          password: data.new_password
        });

        if (error) {
          return { success: false, error: handleSupabaseError(error) };
        }

        return { success: true, message: "Password updated successfully!" };
      } catch (err) {
        const errorMessage = handleSupabaseError(err);
        setError(errorMessage);
        return { success: false, error: errorMessage };
      }
    },
    []
  );

  const logout = useCallback(async () => {
    setAuthState({
      user: null,
      isLoading: false,
      isAuthenticated: false,
      session: null,
    });
    setError(null);
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
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}