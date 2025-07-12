import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { PasswordResetForm } from '@/components/auth/PasswordResetForm';

export default function ResetPasswordScreen() {
  const navigateToLogin = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <PasswordResetForm
          onNavigateToLogin={navigateToLogin}
        />
      </View>
    </SafeAreaView>
  );
}