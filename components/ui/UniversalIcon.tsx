import React from 'react';
import { Platform } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

// For web, we can use lucide-react icons
// For native, we use MaterialIcons as fallback
export interface UniversalIconProps {
  name: IconName;
  size?: number;
  color?: string;
  className?: string; // For Tailwind/NativeWind styling
}

// Icon mapping between different icon sets
type IconName = 
  | 'home'
  | 'calendar'
  | 'user'
  | 'more'
  | 'settings'
  | 'bell'
  | 'activity'
  | 'logout'
  | 'chevron-right'
  | 'chevron-left'
  | 'arrow-left'
  | 'arrow-right'
  | 'plus'
  | 'search'
  | 'heart'
  | 'star'
  | 'bookmark'
  | 'share'
  | 'edit'
  | 'delete'
  | 'check'
  | 'close';

const iconMapping: Record<IconName, string> = {
  home: 'home',
  calendar: 'event',
  user: 'person',
  more: 'more-horiz',
  settings: 'settings',
  bell: 'notifications',
  activity: 'trending-up',
  logout: 'logout',
  'chevron-right': 'chevron-right',
  'chevron-left': 'chevron-left',
  'arrow-left': 'arrow-back',
  'arrow-right': 'arrow-forward',
  plus: 'add',
  search: 'search',
  heart: 'favorite',
  star: 'star',
  bookmark: 'bookmark',
  share: 'share',
  edit: 'edit',
  delete: 'delete',
  check: 'check',
  close: 'close',
};

export function UniversalIcon({ 
  name, 
  size = 24, 
  color = '#000000',
  className 
}: UniversalIconProps) {
  const materialIconName = iconMapping[name];

  if (Platform.OS === 'web') {
    // For web, we can use a more sophisticated approach
    // You can replace this with lucide-react icons if needed
    return (
      <MaterialIcons 
        name={materialIconName as any} 
        size={size} 
        color={color}
        className={className}
      />
    );
  }

  // For React Native (iOS/Android)
  return (
    <MaterialIcons 
      name={materialIconName as any} 
      size={size} 
      color={color} 
    />
  );
}

// Web-specific lucide icons (optional, for better web experience)
export async function LucideIcon({ 
  name, 
  size = 24, 
  color = '#000000',
  className 
}: UniversalIconProps) {
  if (Platform.OS !== 'web') {
    return <UniversalIcon name={name} size={size} color={color} />;
  }

  try {
    // Dynamic import for web-only lucide icons
    const { default: Icon } = await import(`lucide-react`);
    
    const iconComponents: Record<IconName, any> = {
      home: (await import('lucide-react')).Home,
      calendar: (await import('lucide-react')).Calendar,
      user: (await import('lucide-react')).User,
      more: (await import('lucide-react')).MoreHorizontal,
      settings: (await import('lucide-react')).Settings,
      bell: (await import('lucide-react')).Bell,
      activity: (await import('lucide-react')).Activity,
      logout: (await import('lucide-react')).LogOut,
      'chevron-right': (await import('lucide-react')).ChevronRight,
      'chevron-left': (await import('lucide-react')).ChevronLeft,
      'arrow-left': (await import('lucide-react')).ArrowLeft,
      'arrow-right': (await import('lucide-react')).ArrowRight,
      plus: (await import('lucide-react')).Plus,
      search: (await import('lucide-react')).Search,
      heart: (await import('lucide-react')).Heart,
      star: (await import('lucide-react')).Star,
      bookmark: (await import('lucide-react')).Bookmark,
      share: (await import('lucide-react')).Share,
      edit: (await import('lucide-react')).Edit,
      delete: (await import('lucide-react')).Trash,
      check: (await import('lucide-react')).Check,
      close: (await import('lucide-react')).X,
    };

    const IconComponent = iconComponents[name];
    
    if (IconComponent) {
      return React.createElement(IconComponent, {
        size,
        color,
        className
      });
    }
  } catch (error) {
    console.warn(`Failed to load lucide icon for ${name}, falling back to MaterialIcons`);
  }

  // Fallback to MaterialIcons
  return <UniversalIcon name={name} size={size} color={color} className={className} />;
}