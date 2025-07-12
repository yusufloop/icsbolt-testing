import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router } from 'expo-router';
import { LoginForm } from '@/components/auth/LoginForm';
import { useAuth } from '@/hooks/useAuth';
import { useEffect } from 'react';

export default function AuthScreen() {
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/(tabs)');
    }
  }, [isAuthenticated]);

  const navigateToRegister = () => {
    router.push('/(auth)/register');
  };

  const navigateToForgotPassword = () => {
    router.push('/(auth)/forgot-password');
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
        <LoginForm
          onNavigateToRegister={navigateToRegister}
          onNavigateToForgotPassword={navigateToForgotPassword}
          onNavigateToVerification={navigateToVerification}
        />
      </View>
    </SafeAreaView>
  );
}