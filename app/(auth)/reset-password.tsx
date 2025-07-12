import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default function ResetPasswordScreen() {
  const { token } = useLocalSearchParams<{ token: string }>();

  const navigateToLogin = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <PasswordResetForm
          resetToken={token || ''}
          onNavigateToLogin={navigateToLogin}
        />
      </View>
    </SafeAreaView>
  );
}