import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary' | 'ghost';
  disabled?: boolean;
  style?: ViewStyle;
}

export function AuthButton({ 
  title, 
  onPress, 
  loading = false, 
  variant = 'primary',
  disabled = false,
  style,
}: AuthButtonProps) {
  const getButtonClasses = () => {
    const baseClasses = 'rounded-xl py-4 px-6 items-center justify-center min-h-[52px]';
    
    if (disabled || loading) {
      return `${baseClasses} bg-gray-300`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} bg-blue-500 active:bg-blue-600`;
      case 'secondary':
        return `${baseClasses} bg-gray-100 border border-gray-300 active:bg-gray-200`;
      case 'ghost':
        return `${baseClasses} bg-transparent active:bg-gray-100`;
      default:
        return `${baseClasses} bg-blue-500 active:bg-blue-600`;
    }
  };

  const getTextClasses = () => {
    const baseClasses = 'text-base font-semibold font-inter-semibold';
    
    if (disabled || loading) {
      return `${baseClasses} text-gray-500`;
    }
    
    switch (variant) {
      case 'primary':
        return `${baseClasses} text-white`;
      case 'secondary':
        return `${baseClasses} text-gray-700`;
      case 'ghost':
        return `${baseClasses} text-blue-500`;
      default:
        return `${baseClasses} text-white`;
    }
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={0.8}
      style={style}
    >
      {loading ? (
        <ActivityIndicator 
          color={variant === 'primary' ? '#ffffff' : '#3b82f6'} 
          size="small" 
        />
      ) : (
        <Text className={getTextClasses()}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
}