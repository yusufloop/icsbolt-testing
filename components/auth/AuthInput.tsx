import React, { useState } from 'react';
import { View, TextInput, Text, TouchableOpacity, TextInputProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface AuthInputProps extends TextInputProps {
  label: string;
  error?: string;
  rightIcon?: keyof typeof MaterialIcons.glyphMap;
  onRightIconPress?: () => void;
}

export function AuthInput({
  label,
  error,
  rightIcon,
  onRightIconPress,
  secureTextEntry,
  ...props
}: AuthInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const isPassword = secureTextEntry;
  const actualSecureTextEntry = isPassword ? !showPassword : false;

  const handleRightIconPress = () => {
    if (isPassword) {
      setShowPassword(!showPassword);
    } else if (onRightIconPress) {
      onRightIconPress();
    }
  };

  const getRightIconName = (): keyof typeof MaterialIcons.glyphMap => {
    if (isPassword) {
      return showPassword ? 'visibility-off' : 'visibility';
    }
    return rightIcon || 'chevron-right';
  };

  return (
    <View className="mb-4">
      <Text className="text-sm font-semibold text-gray-700 mb-2">
        {label}
      </Text>
      
      <View className={`
        flex-row items-center bg-gray-50 border rounded-xl px-4 py-3
        ${error ? 'border-red-500' : isFocused ? 'border-blue-500' : 'border-gray-200'}
      `}>
        <TextInput
          className="flex-1 text-base text-gray-900"
          placeholderTextColor="#9ca3af"
          secureTextEntry={actualSecureTextEntry}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          {...props}
        />
        
        {(rightIcon || isPassword) && (
          <TouchableOpacity 
            onPress={handleRightIconPress} 
            className="ml-2 p-1"
          >
            <MaterialIcons 
              name={getRightIconName()} 
              size={20} 
              color={error ? '#ef4444' : '#9ca3af'} 
            />
          </TouchableOpacity>
        )}
      </View>
      
      {error && (
        <Text className="text-red-500 text-sm mt-1">
          {error}
        </Text>
      )}
    </View>
  );
}