import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';

interface PremiumInputProps extends TextInputProps {
  label?: string;
  error?: string;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export function PremiumInput({
  label,
  error,
  leftIcon,
  rightIcon,
  onRightIconPress,
  isPassword = false,
  style,
  ...props
}: PremiumInputProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleRightIconPress = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getInputContainerClasses = () => {
    let classes = 'rounded-lg bg-bg-secondary border flex-row items-center px-4 py-3 min-h-[44px]';
    
    if (error) {
      classes += ' border-destructive';
    } else if (isFocused) {
      classes += ' border-primary';
    } else {
      classes += ' border-gray-300';
    }
    
    if (isFocused) {
      classes += ' active:opacity-80'; // Micro-interaction feedback
    }
    
    return classes;
  };

  return (
    <View className="mb-4">
      {label && (
        <Text className="text-sm font-semibold text-text-primary mb-2">
          {label}
        </Text>
      )}
      
      <View className={getInputContainerClasses()}>
        {leftIcon && (
          <View className="mr-3">
            {leftIcon}
          </View>
        )}
        
        <TextInput
          className="flex-1 text-base text-text-primary font-system"
          placeholderTextColor="#8A8A8E" // text-secondary
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          style={style}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <TouchableOpacity 
            onPress={handleRightIconPress} 
            className="ml-3 active:opacity-80"
          >
            {isPassword ? (
              <Text className="text-text-secondary">
                {showPassword ? '👁️' : '👁️‍🗨️'}
              </Text>
            ) : (
              rightIcon
            )}
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-destructive text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}