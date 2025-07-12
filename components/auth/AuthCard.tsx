import React from 'react';
import { View } from 'react-native';

interface AuthCardProps {
  children: React.ReactNode;
}

export function AuthCard({ children }: AuthCardProps) {
  return (
    <View className="bg-white rounded-2xl p-8 shadow-lg">
      {children}
    </View>
  );
}