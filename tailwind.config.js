/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./constants/**/*.{js,jsx,ts,tsx}",
    "./hooks/**/*.{js,jsx,ts,tsx}",
    "./utils/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // Primary Action Color
        primary: '#0A84FF',
        'primary-light': '#409CFF', // For gradients
        
        // Destructive Color
        destructive: '#FF453A',
        
        // Background Colors
        'bg-primary': '#F2F2F7',
        'bg-secondary': '#FFFFFF',
        
        // Text Colors
        'text-primary': '#1C1C1E',
        'text-secondary': '#8A8A8E',
        'text-tertiary': '#AEAEB2',
        
        // Status Colors
        success: '#30D158',
        warning: '#FF9F0A',
        info: '#FFD60A',
        
        // Additional semantic colors for better component support
        gray: {
          50: '#F9FAFB',
          100: '#F3F4F6',
          200: '#E5E7EB',
          300: '#D1D5DB',
          400: '#9CA3AF',
          500: '#6B7280',
          600: '#4B5563',
          700: '#374151',
          800: '#1F2937',
          900: '#111827',
        },
      },
      
      fontFamily: {
        // Native system font stack
        'system': ['-apple-system', 'BlinkMacSystemFont', 'San Francisco', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      
      fontSize: {
        // Typography scale as specified
        'xs': ['12px', { lineHeight: '16px' }],
        'sm': ['14px', { lineHeight: '20px' }], // Caption
        'base': ['16px', { lineHeight: '28px' }], // Body with leading-relaxed
        'lg': ['18px', { lineHeight: '28px' }], // H2
        'xl': ['20px', { lineHeight: '28px' }],
        '2xl': ['24px', { lineHeight: '32px' }], // H1
        '3xl': ['30px', { lineHeight: '36px' }],
        '4xl': ['36px', { lineHeight: '40px' }],
      },
      
      spacing: {
        // 4px grid system
        '0.5': '2px',  // 0.5 unit
        '1': '4px',    // 1 unit
        '2': '8px',    // 2 units
        '3': '12px',   // 3 units
        '4': '16px',   // 4 units (p-4)
        '5': '20px',   // 5 units
        '6': '24px',   // 6 units
        '8': '32px',   // 8 units
        '10': '40px',  // 10 units
        '12': '48px',  // 12 units
        '16': '64px',  // 16 units
        '20': '80px',  // 20 units
        '24': '96px',  // 24 units
      },
      
      borderRadius: {
        // Consistent rounded corners
        'lg': '12px', // Primary border radius for buttons/inputs/cards
        'xl': '16px',
        '2xl': '20px',
      },
      
      boxShadow: {
        // Card shadows
        'md': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
      },
      
      backdropBlur: {
        'lg': '16px', // For glassmorphism
      },
      
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'scale-press': 'scalePress 0.1s ease-out',
      },
      
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        scalePress: {
          '0%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(0.95)' },
          '100%': { transform: 'scale(1)' },
        },
      },
    },
  },
  plugins: [],
}