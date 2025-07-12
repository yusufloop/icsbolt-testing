import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { AuthCard } from './AuthCard';
import { AuthInput } from './AuthInput';
import { AuthButton } from './AuthButton';
import { ErrorMessage } from './ErrorMessage';
import { SuccessMessage } from './SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

interface RegisterFormProps {
  onNavigateToLogin: () => void;
  onNavigateToVerification: (email: string) => void;
}

export function RegisterForm({ onNavigateToLogin, onNavigateToVerification }: RegisterFormProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [fieldErrors, setFieldErrors] = useState<{ [key: string]: string }>({});
  const [successMessage, setSuccessMessage] = useState('');
  
  const { register, isLoading, error } = useAuth();

  const validateForm = () => {
    const errors: { [key: string]: string } = {};
    
    if (!formData.firstName.trim()) {
      errors.firstName = 'First name is required';
    }
    
    if (!formData.lastName.trim()) {
      errors.lastName = 'Last name is required';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      errors.email = 'Please enter a valid email';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    } else if (formData.password.length < 8) {
      errors.password = 'Password must be at least 8 characters';
    } else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(formData.password)) {
      errors.password = 'Password must contain uppercase, lowercase, and number';
    }
    
    if (!formData.confirmPassword.trim()) {
      errors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      errors.confirmPassword = 'Passwords do not match';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleRegister = async () => {
    if (!validateForm()) return;
    
    const result = await register({
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      email: formData.email.trim(),
      password: formData.password,
      confirmPassword: formData.confirmPassword,
    });

    if (result.success) {
      setSuccessMessage(result.message || '');
      setTimeout(() => {
        onNavigateToVerification(formData.email);
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
      <View className="items-center mb-8">
        <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
          Create Account
        </Text>
        <Text className="text-gray-600 text-center font-inter-regular">
          Sign up to get started
        </Text>
      </View>

      {error && <ErrorMessage message={error} />}
      {successMessage && <SuccessMessage message={successMessage} />}

      <View className="flex-row space-x-3 mb-5">
        <View className="flex-1">
          <AuthInput
            label="First Name"
            value={formData.firstName}
            onChangeText={(value) => updateField('firstName', value)}
            placeholder="First name"
            leftIcon="person"
            error={fieldErrors.firstName}
          />
        </View>
        <View className="flex-1">
          <AuthInput
            label="Last Name"
            value={formData.lastName}
            onChangeText={(value) => updateField('lastName', value)}
            placeholder="Last name"
            leftIcon="person"
            error={fieldErrors.lastName}
          />
        </View>
      </View>

      <AuthInput
        label="Email"
        value={formData.email}
        onChangeText={(value) => updateField('email', value)}
        placeholder="Enter your email"
        keyboardType="email-address"
        autoCapitalize="none"
        leftIcon="mail"
        error={fieldErrors.email}
      />

      <AuthInput
        label="Password"
        value={formData.password}
        onChangeText={(value) => updateField('password', value)}
        placeholder="Create a password"
        isPassword
        leftIcon="lock-closed"
        error={fieldErrors.password}
      />

      <AuthInput
        label="Confirm Password"
        value={formData.confirmPassword}
        onChangeText={(value) => updateField('confirmPassword', value)}
        placeholder="Confirm your password"
        isPassword
        leftIcon="lock-closed"
        error={fieldErrors.confirmPassword}
      />

      <AuthButton
        title="Create Account"
        onPress={handleRegister}
        loading={isLoading}
        style={{ marginBottom: 24 }}
      />

      <View className="flex-row justify-center items-center">
        <Text className="text-gray-600 font-inter-regular">Already have an account? </Text>
        <TouchableOpacity onPress={onNavigateToLogin}>
          <Text className="text-blue-500 font-semibold font-inter-semibold">Sign in</Text>
        </TouchableOpacity>
      </View>
    </AuthCard>
  );
}