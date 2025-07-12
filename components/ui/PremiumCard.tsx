import React from 'react';
import { View, ViewStyle } from 'react-native';

interface PremiumCardProps {
  children: React.ReactNode;
  variant?: 'default' | 'glass';
  style?: ViewStyle;
}

export function PremiumCard({
  children,
  variant = 'default',
  style,
}: PremiumCardProps) {
  const getCardClasses = () => {
    let baseClasses = 'rounded-lg p-4'; // As specified: rounded-lg, p-4 internal padding
    
    switch (variant) {
      case 'default':
        baseClasses += ' bg-bg-secondary shadow-md'; // bg-secondary with shadow-md
        break;
      case 'glass':
        baseClasses += ' bg-white/80 backdrop-blur-lg border border-white/20'; // Glassmorphism
        break;
    }
    
    return baseClasses;
  };

  return (
    <View className={getCardClasses()} style={style}>
      {children}
    </View>
  );
}