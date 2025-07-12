import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { ForgotPasswordForm } from '@/components/auth/ForgotPasswordForm';

export default function ForgotPasswordScreen() {
  const navigateToLogin = () => {
    router.back();
  };

  const navigateToPasswordReset = (token: string) => {
    router.push({
      pathname: '/(auth)/reset-password',
      params: { token }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <ForgotPasswordForm
          onNavigateToLogin={navigateToLogin}
          onNavigateToPasswordReset={navigateToPasswordReset}
        />
      </View>
    </SafeAreaView>
  );
}
