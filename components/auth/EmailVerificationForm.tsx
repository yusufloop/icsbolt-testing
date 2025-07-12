import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

interface EmailVerificationFormProps {
  email: string;
  onNavigateToLogin: () => void;
}

export function EmailVerificationForm({ email, onNavigateToLogin }: EmailVerificationFormProps) {
  const [code, setCode] = useState('');
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  const [resendLoading, setResendLoading] = useState(false);
  
  const { verifyEmail, resendVerificationCode, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!code.trim()) {
      errors.code = 'Verification code is required';
    } else if (code.length !== 6) {
      errors.code = 'Verification code must be 6 characters';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleVerifyEmail = async () => {
    if (!validateForm()) return;
    
    const result = await verifyEmail({ 
      email, 
      verification_code: code.trim().toUpperCase() 
    });

    if (result.success) {
      setSuccessMessage(result.message || '');
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    }
  };

  const handleResendCode = async () => {
    setResendLoading(true);
    const result = await resendVerificationCode(email);
    setResendLoading(false);
    
    if (result.success) {
      setSuccessMessage('New verification code sent!');
      // In development, show the code in console
      if (result.data?.verificationCode) {
        console.log('🔑 New verification code:', result.data.verificationCode);
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
        <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="mail" size={40} color="#3b82f6" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
          Verify Your Email
        </Text>
        <Text className="text-gray-600 text-center font-inter-regular">
          We've sent a verification code to{'\n'}
          <Text className="font-semibold text-blue-500 font-inter-semibold">{email}</Text>
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <AuthInput
        label="Verification Code"
        value={code}
        onChangeText={setCode}
        placeholder="Enter 6-digit code"
        autoCapitalize="characters"
        maxLength={6}
        leftIcon="key"
        error={fieldErrors.code}
      />

      <AuthButton
        title="Verify Email"
        onPress={handleVerifyEmail}
        loading={isLoading}
        style={{ marginBottom: 24 }}
      />

      <View className="flex-row justify-center items-center">
        <Text className="text-gray-600 font-inter-regular">Didn't receive the code? </Text>
        <TouchableOpacity onPress={handleResendCode} disabled={resendLoading}>
          <Text className="text-blue-500 font-semibold font-inter-semibold">
            {resendLoading ? 'Sending...' : 'Resend'}
          </Text>
        </TouchableOpacity>
      </View>
    </AuthCard>
  );
}