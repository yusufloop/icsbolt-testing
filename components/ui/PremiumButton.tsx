import React from 'react';
import { TouchableOpacity, Text, ActivityIndicator, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'destructive' | 'ghost' | 'gradient';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle;
  icon?: React.ReactNode;
}

export function PremiumButton({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  style,
  icon,
}: PremiumButtonProps) {
  const getButtonClasses = () => {
    let baseClasses = 'rounded-lg items-center justify-center flex-row';
    
    // Size classes
    switch (size) {
      case 'sm':
        baseClasses += ' px-3 py-2 min-h-[36px]';
        break;
      case 'lg':
        baseClasses += ' px-6 py-4 min-h-[52px]';
        break;
      default: // md
        baseClasses += ' px-4 py-3 min-h-[44px]';
    }
    
    // Variant classes
    if (disabled || loading) {
      baseClasses += ' opacity-50';
    } else {
      baseClasses += ' active:opacity-80 active:scale-95';
    }
    
    switch (variant) {
      case 'primary':
        baseClasses += ' bg-primary';
        break;
      case 'secondary':
        baseClasses += ' bg-gray-100 border border-gray-300';
        break;
      case 'destructive':
        baseClasses += ' bg-destructive';
        break;
      case 'ghost':
        baseClasses += ' bg-transparent';
        break;
      case 'gradient':
        // Gradient styling handled by LinearGradient component
        break;
    }
    
    return baseClasses;
  };

  const getTextClasses = () => {
    let textClasses = 'font-semibold';
    
    // Size-based text classes
    switch (size) {
      case 'sm':
        textClasses += ' text-sm';
        break;
      case 'lg':
        textClasses += ' text-lg';
        break;
      default: // md
        textClasses += ' text-base';
    }
    
    // Color classes based on variant
    switch (variant) {
      case 'primary':
      case 'destructive':
      case 'gradient':
        textClasses += ' text-white';
        break;
      case 'secondary':
        textClasses += ' text-gray-600';
        break;
      case 'ghost':
        textClasses += ' text-primary';
        break;
    }
    
    return textClasses;
  };

  const renderContent = () => (
    <>
      {loading && (
        <ActivityIndicator 
          size="small" 
          color={variant === 'secondary' || variant === 'ghost' ? '#6B7280' : '#FFFFFF'}
          className="mr-2"
        />
      )}
      {!loading && icon && <>{icon}</>}
      <Text className={getTextClasses()}>
        {title}
      </Text>
    </>
  );

  if (variant === 'gradient') {
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={disabled || loading}
        activeOpacity={0.8}
        style={style}
      >
        <LinearGradient
          colors={['#409CFF', '#0A84FF']} // primary-gradient
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          className={getButtonClasses()}
        >
          {renderContent()}
        </LinearGradient>
      </TouchableOpacity>
    );
  }

  return (
    <TouchableOpacity
      className={getButtonClasses()}
      onPress={onPress}
      disabled={disabled || loading}
      activeOpacity={1}
      style={style}
    >
      {renderContent()}
    </TouchableOpacity>
  );
}