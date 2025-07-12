/**
 * Premium Design System - "Effortless Premium"
 * Inspired by Apple's Human Interface Guidelines
 * 
 * Core Philosophy: Clean, intuitive, and high-quality through meticulous use of space, typography, and subtle interactions
 */

export const DesignSystem = {
  // 1. Color Palette - The Foundation
  colors: {
    // Primary Actions
    primary: {
      50: '#E6F3FF',
      100: '#CCE7FF',
      200: '#99CFFF',
      300: '#66B7FF',
      400: '#409CFF', // Lighter version for gradients
      500: '#0A84FF', // Primary Action Blue
      600: '#0066CC',
      700: '#004C99',
      800: '#003366',
      900: '#001A33',
    },
    
    // Destructive/Urgent
    destructive: {
      50: '#FFE6E6',
      100: '#FFCCCC',
      200: '#FF9999',
      300: '#FF6666',
      400: '#FF4D4D',
      500: '#FF453A', // Destructive Red
      600: '#CC3629',
      700: '#99281F',
      800: '#661A14',
      900: '#330D0A',
    },
    
    // Backgrounds
    background: {
      primary: '#F2F2F7',   // Main app background (off-white grey)
      secondary: '#FFFFFF',  // Content containers and cards (pure white)
      tertiary: '#F8F9FA',   // Alternative light background
    },
    
    // Text Colors
    text: {
      primary: '#1C1C1E',    // Near-black for headings and primary content
      secondary: '#8A8A8E',  // Medium grey for subheadings and descriptions
      tertiary: '#AEAEB2',   // Light grey for disabled states and metadata
      inverse: '#FFFFFF',    // White text for dark backgrounds
    },
    
    // Semantic Status Colors
    status: {
      success: '#30D158',    // Vibrant Green
      warning: '#FF9F0A',    // Warm Orange
      info: '#FFD60A',       // Bright Yellow
      error: '#FF453A',      // Same as destructive
    },
    
    // Border Colors
    border: {
      light: '#E5E5EA',      // Light borders
      medium: '#D1D1D6',     // Medium borders
      dark: '#8E8E93',       // Dark borders
    },
    
    // Overlay Colors
    overlay: {
      light: 'rgba(0, 0, 0, 0.1)',
      medium: 'rgba(0, 0, 0, 0.3)',
      dark: 'rgba(0, 0, 0, 0.6)',
      glass: 'rgba(255, 255, 255, 0.8)', // For glassmorphism
    },
  },
  
  // 2. Spacing & Layout (4px grid system)
  spacing: {
    xs: 4,    // 1 unit
    sm: 8,    // 2 units
    md: 12,   // 3 units
    lg: 16,   // 4 units
    xl: 20,   // 5 units
    '2xl': 24, // 6 units
    '3xl': 32, // 8 units
    '4xl': 40, // 10 units
    '5xl': 48, // 12 units
    '6xl': 64, // 16 units
  },
  
  // Screen padding constants
  layout: {
    screenPadding: 16,     // px-4
    screenPaddingLarge: 24, // px-6
    cardPadding: 16,       // p-4
    sectionSpacing: 24,    // gap-6
  },
  
  // 3. Typography Scale
  typography: {
    // Font sizes (in pixels)
    sizes: {
      xs: 12,
      sm: 14,
      base: 16,
      lg: 18,
      xl: 20,
      '2xl': 24,
      '3xl': 30,
      '4xl': 36,
      '5xl': 48,
    },
    
    // Font weights
    weights: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
    
    // Line heights
    lineHeights: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  
  // 4. Component Styling
  components: {
    // Border radius
    borderRadius: {
      sm: 6,
      md: 8,
      lg: 12,
      xl: 16,
      '2xl': 20,
      full: 9999,
    },
    
    // Shadows
    shadows: {
      sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 1,
      },
      md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 3,
      },
      lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.15,
        shadowRadius: 12,
        elevation: 5,
      },
      xl: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.2,
        shadowRadius: 16,
        elevation: 8,
      },
    },
    
    // Icon sizes
    iconSizes: {
      xs: 16,
      sm: 20,
      md: 24,
      lg: 28,
      xl: 32,
    },
  },
  
  // 5. Animation & Motion
  animation: {
    // Duration (in milliseconds)
    duration: {
      fast: 150,
      normal: 250,
      slow: 350,
    },
    
    // Easing curves
    easing: {
      easeOut: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)',
      easeIn: 'cubic-bezier(0.55, 0.06, 0.68, 0.19)',
      easeInOut: 'cubic-bezier(0.42, 0, 0.58, 1)',
    },
    
    // Scale values for press states
    pressScale: 0.96,
    
    // Opacity values
    opacity: {
      disabled: 0.4,
      pressed: 0.8,
      overlay: 0.6,
    },
  },
  
  // 6. Gradients & Effects
  gradients: {
    // Primary Action Gradient (for important CTAs)
    primaryAction: {
      colors: ['#409CFF', '#0A84FF'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    
    // Decorative Background Gradient (subtle depth)
    decorativeBackground: {
      colors: ['#FFFFFF', '#F2F2F7'],
      start: { x: 0, y: 0 },
      end: { x: 0, y: 1 },
    },
    
    // Highlight Gradient (for special features)
    highlight: {
      colors: ['#8B5CF6', '#EC4899'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
    
    // Success Gradient
    success: {
      colors: ['#10B981', '#059669'],
      start: { x: 0, y: 0 },
      end: { x: 1, y: 1 },
    },
  },
  
  // Glassmorphism effect
  glassmorphism: {
    background: 'rgba(255, 255, 255, 0.8)',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    // Note: backdrop-blur would be implemented via CSS or native blur
  },
} as const;

// Type definitions for better TypeScript support
export type ColorPalette = typeof DesignSystem.colors;
export type SpacingScale = typeof DesignSystem.spacing;
export type TypographyScale = typeof DesignSystem.typography;
export type ComponentStyles = typeof DesignSystem.components;
export type AnimationConfig = typeof DesignSystem.animation;
export type GradientConfig = typeof DesignSystem.gradients;