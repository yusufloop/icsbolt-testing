import React from 'react';
import { View, ActivityIndicator } from 'react-native';

interface LoadingSpinnerProps {
  size?: 'small' | 'large';
  color?: string;
}

export function LoadingSpinner({ 
  size = 'large', 
  color = '#3b82f6' 
}: LoadingSpinnerProps) {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50">
      <ActivityIndicator size={size} color={color} />
    </View>
  );
}