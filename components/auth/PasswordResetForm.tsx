import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

interface PasswordResetFormProps {
  resetToken: string;
  onNavigateToLogin: () => void;
}

export function PasswordResetForm({ resetToken, onNavigateToLogin }: PasswordResetFormProps) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { resetPassword, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 8) {
      errors.newPassword = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.newPassword)) {
      errors.newPassword = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.newPassword !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleResetPassword = async () => {
    if (!validateForm()) return;
    
    const result = await resetPassword({
      reset_token: resetToken,
      new_password: formData.newPassword,
      confirm_password: formData.confirmPassword,
    });

    if (result.success) {
      setSuccessMessage(result.message || '');
      setTimeout(() => {
        onNavigateToLogin();
      }, 2000);
    }
  };

  const updateField = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (fieldErrors[field]) {
      setFieldErrors(prev => ({ ...prev, [field]: '' }));
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
        <View className="w-20 h-20 bg-green-100 rounded-full items-center justify-center mb-4">
          <Ionicons name="shield-checkmark" size={40} color="#10b981" />
        </View>
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
          New Password
        </Text>
        <Text className="text-gray-600 text-center font-inter-regular">
          Enter your new password below
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <AuthInput
        label="New Password"
        value={formData.newPassword}
        onChangeText={(value) => updateField('newPassword', value)}
        placeholder="Enter new password"
        isPassword
        leftIcon="lock-closed"
        error={fieldErrors.newPassword}
      />

      <AuthInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        placeholder="Confirm new password"
        isPassword
        leftIcon="lock-closed"
        error={fieldErrors.confirmPassword}
      />

      <AuthButton
        title="Reset Password"
        onPress={handleResetPassword}
        loading={isLoading}
        style={{ marginBottom: 24 }}
      />
    </AuthCard>
  );
}