import React from 'react';
import { View, Text } from 'react-native';

interface BookingCardProps {
  id: string;
  status: string;
}

export function BookingCard({ id, status }: BookingCardProps) {
  return (
    <View className="flex-1 bg-white rounded-xl p-4 shadow-sm">
      <Text className="font-semibold text-gray-900 text-center mb-2">{id}</Text>
      <Text className="text-orange-500 text-sm text-center font-medium">{status}</Text>
    </View>
  );
}