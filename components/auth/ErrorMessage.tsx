import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface ErrorMessageProps {
  message: string;
}

export function ErrorMessage({ message }: ErrorMessageProps) {
  return (
    <View className="flex-row items-center bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
      <Ionicons name="alert-circle" size={16} color="#ef4444" />
      <Text className="text-red-600 text-sm ml-2 flex-1 font-inter-regular">
        {message}
      </Text>
    </View>
  );
}