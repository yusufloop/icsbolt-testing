import { useAuth } from '@/lib/auth';
import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { AuthButton } from './AuthButton';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';

interface ForgotPasswordFormProps {
  onNavigateToLogin: () => void;
  onNavigateToPasswordReset: (resetToken: string) => void;
}

export function ForgotPasswordForm({ 
  onNavigateToLogin, 
  onNavigateToPasswordReset 
}: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { forgotPassword, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleForgotPassword = async () => {
    if (!validateForm()) return;
    
    const result = await forgotPassword({ email: email.trim() });
    
    if (result.success) {
      setSuccessMessage(result.message || '');
      // In development, show the reset token in console
      if (result.data?.resetToken) {
        console.log('🔗 Reset token:', result.data.resetToken);
        console.log('🔑 Reset code:', result.data.resetCode);
        // Auto-navigate to reset form in development
        setTimeout(() => {
          onNavigateToPasswordReset(result.data.resetToken);
        }, 3000);
      }
    }
  };

  return (
    <AuthCard>
      <TouchableOpacity 
        className="flex-row items-center mb-6"
        onPress={onNavigateToLogin}
      >
        <Ionicons name="arrow-back" size={20} color="#6b7280" />
        <Text className="text-gray-500 ml-2 font-inter-regular">Back to login</Text>
      </TouchableOpacity>

      <View className="items-center mb-8">
        <View className="w-20 h-20 bg-orange-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="lock-closed" size={40} color="#f59e0b" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
          Reset Password
        </Text>
        <Text className="text-gray-600 text-center font-inter-regular">
          Enter your email address and we'll send you a link to reset your password
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <AuthInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail"
        error={fieldErrors.email}
      />

      <AuthButton
        title="Send Reset Link"
        onPress={handleForgotPassword}
        loading={isLoading}
        style={{ marginBottom: 24 }}
      />

      {successMessage && (
        <TouchableOpacity 
          className="items-center"
          onPress={onNavigateToLogin}
        >
          <Text className="text-blue-500 font-semibold font-inter-semibold">
            Return to Login
          </Text>
        </TouchableOpacity>
      )}
    </AuthCard>
  );
}