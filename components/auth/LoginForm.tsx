import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { useAuth } from '@/hooks/useAuth';

interface LoginFormProps {
  onNavigateToRegister: () => void;
  onNavigateToForgotPassword: () => void;
  onNavigateToVerification: (email: string) => void;
}

export function LoginForm({ 
  onNavigateToRegister, 
  onNavigateToForgotPassword,
  onNavigateToVerification 
}: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  
  const { login, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!password.trim()) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleLogin = async () => {
    if (!validateForm()) return;
    
    const result = await login({ 
      email: email.trim(), 
      password,
      rememberMe 
    });

    if (!result.success && result.data?.requiresVerification) {
      onNavigateToVerification(email.trim());
    }
  };

  const updateField = (field: string, value: string) => {
    if (field === 'email') setEmail(value);
    if (field === 'password') setPassword(value);
    
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  return (
    <AuthCard>
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
          Welcome Back
        </Text>
        <Text className="text-gray-600 text-center font-inter-regular">
          Sign in to your account
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}

      <AuthInput
        label="Email"
        value={email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail"
        error={fieldErrors.email}
      />

      <AuthInput
        label="Password"
        value={password}
        onChangeText={(value) => updateField('password', value)}
        placeholder="Enter your password"
        isPassword
        leftIcon="lock-closed"
        error={fieldErrors.password}
      />

      <View className="flex-row items-center justify-between mb-6">
        <TouchableOpacity 
          className="flex-row items-center"
          onPress={() => setRememberMe(!rememberMe)}
        >
          <View className={`w-5 h-5 rounded border-2 mr-2 items-center justify-center ${
            rememberMe ? 'bg-blue-500 border-blue-500' : 'border-gray-300'
          }`}>
            {rememberMe && (
              <Text className="text-white text-xs">✓</Text>
            )}
          </View>
          <Text className="text-sm text-gray-600 font-inter-regular">Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={onNavigateToForgotPassword}>
          <Text className="text-sm text-blue-500 font-inter-regular">
            Forgot password?
          </Text>
        </TouchableOpacity>
      </View>

      <AuthButton
        title="Sign In"
        onPress={handleLogin}
        loading={isLoading}
        style={{ marginBottom: 24 }}
      />

      <View className="flex-row justify-center items-center">
        <Text className="text-gray-600 font-inter-regular">Don't have an account? </Text>
        <TouchableOpacity onPress={onNavigateToRegister}>
          <Text className="text-blue-500 font-semibold font-inter-semibold">Sign up</Text>
        </TouchableOpacity>
      </View>
    </AuthCard>
  );
}