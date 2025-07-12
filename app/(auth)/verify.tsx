import React from 'react';
import { View, SafeAreaView } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { EmailVerificationForm } from '@/components/auth/EmailVerificationForm';

export default function VerifyScreen() {
  const { email } = useLocalSearchParams<{ email: string }>();

  const navigateToLogin = () => {
    router.replace('/(auth)');
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <View style={{ flex: 1 }}>
        <EmailVerificationForm
          email={email || ''}
          onNavigateToLogin={navigateToLogin}
        />
      </View>
    </SafeAreaView>
  );
}
