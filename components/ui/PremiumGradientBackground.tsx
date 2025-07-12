import React from 'react';
import { StyleSheet, ViewStyle } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface PremiumGradientBackgroundProps {
  children: React.ReactNode;
  variant?: 'primary' | 'background';
  style?: ViewStyle;
}

export function PremiumGradientBackground({
  children,
  variant = 'background',
  style,
}: PremiumGradientBackgroundProps) {
  const getGradientConfig = () => {
    switch (variant) {
      case 'primary':
        // primary-gradient: Diagonal (bg-gradient-to-br), from lighter-blue (#409CFF) to primary-blue (#0A84FF)
        return {
          colors: ['#409CFF', '#0A84FF'],
          start: { x: 0, y: 0 },
          end: { x: 1, y: 1 },
        };
      case 'background':
        // background-gradient: Vertical (bg-gradient-to-b), from white to bg-primary (#F2F2F7)
        return {
          colors: ['#FFFFFF', '#F2F2F7'],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        };
      default:
        return {
          colors: ['#FFFFFF', '#F2F2F7'],
          start: { x: 0, y: 0 },
          end: { x: 0, y: 1 },
        };
    }
  };

  const gradientConfig = getGradientConfig();

  return (
    <LinearGradient
      colors={gradientConfig.colors}
      start={gradientConfig.start}
      end={gradientConfig.end}
      style={[styles.container, style]}
    >
      {children}
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});