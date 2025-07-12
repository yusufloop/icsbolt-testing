import React from 'react';
import { View, Text, ViewStyle } from 'react-native';

interface PremiumStatusBadgeProps {
  status: 'success' | 'warning' | 'info' | 'error' | 'neutral';
  text: string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export function PremiumStatusBadge({
  status,
  text,
  size = 'md',
  style,
}: PremiumStatusBadgeProps) {
  const getBadgeClasses = () => {
    let baseClasses = 'rounded-lg items-center justify-center';
    
    // Size classes
    if (size === 'sm') {
      baseClasses += ' px-2 py-1';
    } else {
      baseClasses += ' px-3 py-2';
    }
    
    // Status color classes
    switch (status) {
      case 'success':
        baseClasses += ' bg-success/20'; // 20% opacity background
        break;
      case 'warning':
        baseClasses += ' bg-warning/20';
        break;
      case 'info':
        baseClasses += ' bg-info/20';
        break;
      case 'error':
        baseClasses += ' bg-destructive/20';
        break;
      case 'neutral':
      default:
        baseClasses += ' bg-gray-200';
        break;
    }
    
    return baseClasses;
  };

  const getTextClasses = () => {
    let textClasses = 'font-medium';
    
    // Size classes
    if (size === 'sm') {
      textClasses += ' text-xs';
    } else {
      textClasses += ' text-sm';
    }
    
    // Status text color classes
    switch (status) {
      case 'success':
        textClasses += ' text-success';
        break;
      case 'warning':
        textClasses += ' text-warning';
        break;
      case 'info':
        textClasses += ' text-info';
        break;
      case 'error':
        textClasses += ' text-destructive';
        break;
      case 'neutral':
      default:
        textClasses += ' text-text-secondary';
        break;
    }
    
    return textClasses;
  };

  return (
    <View className={getBadgeClasses()} style={style}>
      <Text className={getTextClasses()}>
        {text}
      </Text>
    </View>
  );
}