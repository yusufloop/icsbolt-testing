import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SuccessMessageProps {
  message: string;
}

export function SuccessMessage({ message }: SuccessMessageProps) {
  return (
    <View className="flex-row items-center bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
      <Text className="text-green-600 text-sm ml-2 flex-1 font-inter-regular">
        {message}
      </Text>
    </View>
  );
}