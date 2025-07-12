import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

interface PasswordResetFormProps {
  onNavigateToLogin: () => void;
}

export function PasswordResetForm({ onNavigateToLogin }: PasswordResetFormProps) {
  const [formData, setFormData] = useState({
    newPassword: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { updatePassword, loading } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.newPassword.trim()) {
      errors.newPassword = 'New password is required';
    } else if (formData.newPassword.length < 6) {
      errors.newPassword = 'Password must be at least 6 characters';
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
    
    setError(null);
    setSuccessMessage('');
    
    const { error: updateError } = await updatePassword(formData.newPassword);

    if (updateError) {
      setError(updateError.message);
    } else {
      setSuccessMessage('Password updated successfully!');
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
        title="Update Password"
        onPress={handleResetPassword}
        loading={loading}
        style={{ marginBottom: 24 }}
      />
    </AuthCard>
  );
}