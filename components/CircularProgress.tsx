import React from 'react';
import { View, Text } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface CircularProgressProps {
  size: number;
  strokeWidth: number;
  progress: number;
  centerText: string;
  centerSubtext: string;
}

export function CircularProgress({ 
  size, 
  strokeWidth, 
  progress, 
  centerText, 
  centerSubtext 
}: CircularProgressProps) {
  return (
    <View className="items-center justify-center" style={{ width: size, height: size }}>
      {/* Simple circular representation using nested views */}
      <View 
        className="absolute border-8 border-gray-200 rounded-full"
        style={{ 
          width: size, 
          height: size,
        }}
      />
      <View 
        className="absolute border-8 border-blue-500 rounded-full"
        style={{ 
          width: size, 
          height: size,
          borderTopColor: '#3b82f6',
          borderRightColor: '#3b82f6',
          borderBottomColor: '#f59e0b',
          borderLeftColor: '#f59e0b',
        }}
      />
      
      {/* Center content */}
      <View className="absolute items-center">
        <Text className="text-3xl font-bold text-gray-900">{centerText}</Text>
        <Text className="text-sm text-gray-600 text-center">{centerSubtext}</Text>
      </View>
    </View>
  );
}