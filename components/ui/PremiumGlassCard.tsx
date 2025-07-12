import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { BlurView } from 'expo-blur';

interface PremiumGlassCardProps {
  children: React.ReactNode;
  intensity?: number;
  style?: ViewStyle;
}

export function PremiumGlassCard({
  children,
  intensity = 80,
  style,
}: PremiumGlassCardProps) {
  return (
    <View style={[styles.container, style]}>
      <BlurView
        intensity={intensity}
        tint="light"
        style={styles.blurContainer}
      >
        <View className="p-4 rounded-lg">
          {children}
        </View>
      </BlurView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: 12, // rounded-lg
    overflow: 'hidden',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Semi-transparent background
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.2)', // Semi-transparent border
  },
  
  blurContainer: {
    flex: 1,
  },
});