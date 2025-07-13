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
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';

export default function SignInScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});

  const { signIn } = useAuth();

  const validateForm = () => {
    const newErrors: { email?: string; password?: string } = {};

    if (!email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!password.trim()) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSignIn = async () => {
    if (!validateForm()) return;

    setLoading(true);
    const { error } = await signIn(email.trim(), password);
    setLoading(false);

    if (error) {
      Alert.alert('Sign In Error', error);
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
                Welcome Back
              </Text>
              <Text className="text-gray-600 text-center">
                Sign in to your account to continue
              </Text>
            </View>

            {/* Form */}
            <View className="bg-white rounded-2xl p-6 shadow-lg">
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
                placeholder="Enter your password"
                secureTextEntry
                error={errors.password}
              />

              <AuthButton
                title="Sign In"
                onPress={handleSignIn}
                loading={loading}
                className="mb-4"
              />

              <View className="flex-row justify-center items-center">
                <Text className="text-gray-600">Don't have an account? </Text>
                <Link href="/(auth)/sign-up" asChild>
                  <TouchableOpacity>
                    <Text className="text-blue-500 font-semibold">Sign up</Text>
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