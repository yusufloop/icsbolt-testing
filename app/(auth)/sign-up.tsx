import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link } from 'expo-router';
import { useAuth } from '@/lib/auth';
import { AuthInput } from '@/components/auth/AuthInput';
import { AuthButton } from '@/components/auth/AuthButton';

export default function SignUpScreen() {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const { signUp } = useAuth();

  const validateForm = () => {
    const newErrors: {
      fullName?: string;
      email?: string;
      password?: string;
      confirmPassword?: string;
    } = {};

    if (!fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signUp(email.trim(), password, fullName.trim());
    setLoading(false);

    if (error) {
      Alert.alert('Sign Up Error', error);
    } else {
      Alert.alert(
        'Success',
        'Account created successfully! Please check your email to verify your account.',
        [{ text: 'OK' }]
      );
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          className="flex-1"
          contentContainerStyle={{ flexGrow: 1, justifyContent: 'center', padding: 24 }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          <View className="max-w-sm w-full mx-auto">
            {/* Header */}
            <View className="items-center mb-8">
              <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-2xl font-bold">A</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-2">
                Create Account
              </Text>
              <Text className="text-gray-600 text-center">
                Sign up to get started with your account
              </Text>
            </View>

            {/* Form */}
            <View className="bg-white rounded-2xl p-6 shadow-lg">
              <AuthInput
                label="Full Name"
                value={fullName}
                onChangeText={setFullName}
                placeholder="Enter your full name"
                error={errors.fullName}
              />

              <AuthInput
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                error={errors.email}
              />

              <AuthInput
                label="Password"
                value={password}
                onChangeText={setPassword}
                placeholder="Create a password"
                secureTextEntry
                error={errors.password}
              />

              <AuthInput
                label="Confirm Password"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                placeholder="Confirm your password"
                secureTextEntry
                error={errors.confirmPassword}
              />

              <AuthButton
                title="Create Account"
                onPress={handleSignUp}
                loading={loading}
                className="mb-4"
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600">Already have an account? </Text>
                <Link href="/(auth)/sign-in" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-500 font-semibold">Sign in</Text>
                  </TouchableOpacity>
                </Link>
              </View>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}