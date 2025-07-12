import React from 'react';
import { View, Text } from 'react-native';

interface InvoiceItemProps {
  id: string;
  route: string;
  status: string;
  statusColor: string;
}

export function InvoiceItem({ id, route, status, statusColor }: InvoiceItemProps) {
  return (
    <View className="flex-row justify-between items-center py-3">
      <View className="flex-1">
        <Text className="font-semibold text-gray-900 text-base">{id}</Text>
      </View>
      <View className="flex-1 items-center">
        <Text className="text-gray-600 text-sm">{route}</Text>
      </View>
      <View className="flex-1 items-end">
        <Text className={`font-medium text-sm ${statusColor}`}>{status}</Text>
      </View>
    </View>
  );
}