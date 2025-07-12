import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  leftIcon?: keyof typeof Ionicons.glyphMap;
  rightIcon?: keyof typeof Ionicons.glyphMap;
  onRightIconPress?: () => void;
  isPassword?: boolean;
}

export function AuthInput({ 
  label, 
  error, 
  leftIcon, 
  rightIcon, 
  onRightIconPress,
  isPassword = false,
  ...props 
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleRightIconPress = () => {
    if (isPassword) {
      togglePasswordVisibility();
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = (): keyof typeof Ionicons.glyphMap => {
    if (isPassword) {
      return showPassword ? 'eye-off' : 'eye';
    }
    return rightIcon || 'chevron-forward';
  };

  return (
    <View className="mb-5">
      <Text className="text-sm font-semibold text-gray-700 mb-2 font-inter-semibold">
        {label}
      </Text>
      
      <View className={`
        flex-row items-center bg-white border rounded-xl px-4 py-3
        ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-200'}
        ${isFocused ? 'shadow-sm' : ''}
      `}>
        {leftIcon && (
          <Ionicons 
            name={leftIcon} 
            size={20} 
            color={error ? '#ef4444' : isFocused ? '#3b82f6' : '#9ca3af'} 
            style={{ marginRight: 12 }}
          />
        )}
        
        <TextInput
          className="flex-1 text-base text-gray-900 font-inter-regular"
          placeholderTextColor="#9ca3af"
          secureTextEntry={isPassword && !showPassword}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <TouchableOpacity onPress={handleRightIconPress} className="ml-2">
            <Ionicons 
              name={getRightIconName()} 
              size={20} 
              color={error ? '#ef4444' : '#9ca3af'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1 font-inter-regular">
          {error}
        </Text>
      )}
    </View>
  );
}