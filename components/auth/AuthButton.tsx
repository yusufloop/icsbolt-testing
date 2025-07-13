import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';

interface AuthButtonProps {
  title: string;
  onPress: () => void;
  loading?: boolean;
  variant?: 'primary' | 'secondary';
  disabled?: boolean;
  className?: string;
}

export function AuthButton({
  title,
  onPress,
  loading = false,
  variant = 'primary',
  disabled = false,
  className = '',
}: AuthButtonProps) {
  const isDisabled = disabled || loading;

  const getButtonClasses = () => {
    let baseClasses = 'rounded-xl py-4 px-6 items-center justify-center min-h-[52px]';
    
    if (isDisabled) {
      baseClasses += ' bg-gray-300';
    } else {
      switch (variant) {
        case 'primary':
          baseClasses += ' bg-blue-500 active:bg-blue-600';
          break;
        case 'secondary':
          baseClasses += ' bg-gray-100 border border-gray-300 active:bg-gray-200';
          break;
      }
    }
    
    return `${baseClasses} ${className}`;
  };

  const getTextClasses = () => {
    let textClasses = 'text-base font-semibold';
    
    if (isDisabled) {
      textClasses += ' text-gray-500';
    } else {
      switch (variant) {
        case 'primary':
          textClasses += ' text-white';
          break;
        case 'secondary':
          textClasses += ' text-gray-700';
          break;
      }
    }
    
    return textClasses;
  };

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={isDisabled}
      activeOpacity={0.8}
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