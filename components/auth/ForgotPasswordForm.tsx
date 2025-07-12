import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

interface ForgotPasswordFormProps {
  onNavigateToLogin: () => void;
}

export function ForgotPasswordForm({ onNavigateToLogin }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { resetPassword, loading } = useAuth();

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
    
    setError(null);
    setSuccessMessage('');
    
    const { error: resetError } = await resetPassword(email.trim());
    
    if (resetError) {
      setError(resetError.message);
    } else {
      setSuccessMessage('Password reset instructions have been sent to your email.');
    }
  };

  const updateField = (value: string) => {
    setEmail(value);
    if (fieldErrors.email) {
      setFieldErrors(prev => ({ ...prev, email: '' }));
    }
    if (error) {
      setError(null);
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
        onChangeText={updateField}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail"
        error={fieldErrors.email}
      />

      <AuthButton
        title="Send Reset Link"
        onPress={handleForgotPassword}
        loading={loading}
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