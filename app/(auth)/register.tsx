import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterScreen() {
  const navigateToLogin = () => {
    router.back();
  };

  const navigateToVerification = (email: string) => {
    router.push({
      pathname: '/(auth)/verify',
      params: { email }
    });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <RegisterForm
          onNavigateToLogin={navigateToLogin}
          onNavigateToVerification={navigateToVerification}
        />
      </View>
    </SafeAreaView>
  );
}