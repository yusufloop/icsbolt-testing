import React, { useState } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { AuthCard } from '@/components/auth/AuthCard';
import { AuthButton } from '@/components/auth/AuthButton';
import { ErrorMessage } from '@/components/auth/ErrorMessage';
import { SuccessMessage } from '@/components/auth/SuccessMessage';
import { useAuth } from '@/hooks/useAuth';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();
  const [error, setError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState('');
  
  const { resendConfirmation, loading } = useAuth();

  const navigateToLogin = () => {
    router.replace('/(auth)');
  };

  const handleResendConfirmation = async () => {
    if (!email) return;
    
    setError(null);
    setSuccessMessage('');
    
    const { error: resendError } = await resendConfirmation(email);
    
    if (resendError) {
      setError(resendError.message);
    } else {
      setSuccessMessage('Confirmation email sent! Please check your inbox.');
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1, justifyContent: 'center', padding: 24 }}>
        <AuthCard>
          <TouchableOpacity 
            className="flex-row items-center mb-6"
            onPress={navigateToLogin}
          >
            <Ionicons name="arrow-back" size={20} color="#6b7280" />
            <Text className="text-gray-500 ml-2 font-inter-regular">Back to login</Text>
          </TouchableOpacity>

          <View className="items-center mb-8">
            <View className="w-20 h-20 bg-blue-100 rounded-full items-center justify-center mb-4">
              <Ionicons name="mail" size={40} color="#3b82f6" />
            </View>
            <Text className="text-3xl font-bold text-gray-900 mb-2 font-inter-bold">
              Check Your Email
            </Text>
            <Text className="text-gray-600 text-center font-inter-regular">
              We've sent a confirmation link to{'\n'}
              <Text className="font-semibold text-blue-500 font-inter-semibold">{email}</Text>
            </Text>
          </View>

          {error && <ErrorMessage message={error} />}
          {successMessage && <SuccessMessage message={successMessage} />}

          <View className="mb-6">
            <Text className="text-gray-600 text-center font-inter-regular mb-4">
              Click the link in your email to verify your account. Once verified, you can sign in.
            </Text>
          </View>

          <AuthButton
            title="Resend Confirmation"
            onPress={handleResendConfirmation}
            loading={loading}
            variant="secondary"
            style={{ marginBottom: 24 }}
          />

          <TouchableOpacity 
            className="items-center"
            onPress={navigateToLogin}
          >
            <Text className="text-blue-500 font-semibold font-inter-semibold">
              Return to Login
            </Text>
          </TouchableOpacity>
        </AuthCard>
      </View>
    </SafeAreaView>
  );
}