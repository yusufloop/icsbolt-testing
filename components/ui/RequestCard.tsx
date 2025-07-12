import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withTiming,
  interpolate,
  Extrapolate
} from 'react-native-reanimated';
import { PremiumCard } from './PremiumCard';
import { PremiumButton } from './PremiumButton';

interface RequestCardProps {
  id: string;
  date: string;
  status: string;
  itemRequested: string;
  priority: string;
  amount?: string;
  company?: string;
  isExpanded: boolean;
  onToggle: () => void;
}

export function RequestCard({
  id,
  date,
  status,
  itemRequested,
  priority,
  amount,
  company,
  isExpanded,
  onToggle,
}: RequestCardProps) {
  const expandedHeight = useSharedValue(0);

  React.useEffect(() => {
    expandedHeight.value = withTiming(isExpanded ? 1 : 0, {
      duration: 300,
    });
  }, [isExpanded]);

  const expandedStyle = useAnimatedStyle(() => {
    const height = interpolate(
      expandedHeight.value,
      [0, 1],
      [0, 120], // Approximate height for expanded content
      Extrapolate.CLAMP
    );

    return {
      height,
      opacity: expandedHeight.value,
    };
  });

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'unsuccessfully':
        return 'text-destructive'; // #FF453A
      case 'successfully':
        return 'text-success'; // #30D158
      case 'pending':
        return 'text-warning'; // #FF9F0A
      default:
        return 'text-primary'; // #0A84FF
    }
  };

  const handleScan = () => {
    console.log('Scan action for', id);
  };

  const handleInfo = () => {
    console.log('Info action for', id);
  };

  const handleResubmit = () => {
    console.log('Resubmit action for', id);
  };

  return (
    <TouchableOpacity
      onPress={onToggle}
      activeOpacity={0.8}
      className="mb-3"
    >
      <PremiumCard>
        {/* Top Row */}
        <View className="flex-row items-center justify-between mb-3">
          <Text className="text-lg font-bold text-text-primary">
            {id}
          </Text>
          <Text className="text-sm text-text-secondary">
            {date}
          </Text>
        </View>

        {/* Standard Details */}
        <View className="space-y-2">
          <View className="flex-row items-center">
            <Text className="text-sm text-text-secondary mr-2">Status</Text>
            <Text className={`text-sm font-medium ${getStatusColor(status)}`}>
              {status}
            </Text>
          </View>
          
          <View className="flex-row items-center">
            <Text className="text-sm text-text-secondary mr-2">Item Requested</Text>
            <Text className="text-sm font-medium text-primary">
              {itemRequested}
            </Text>
          </View>
        </View>

        {/* Expanded Content */}
        <Animated.View style={expandedStyle} className="overflow-hidden">
          <View className="mt-3">
            {/* Additional Details */}
            <View className="space-y-2 mb-3">
              <View className="flex-row items-center">
                <Text className="text-sm text-text-secondary mr-2">Priority</Text>
                <Text className="text-sm font-medium text-text-primary">
                  {priority}
                </Text>
              </View>
              
              {amount && (
                <View className="flex-row items-center">
                  <Text className="text-sm text-text-secondary mr-2">Amount</Text>
                  <Text className="text-sm font-medium text-text-primary">
                    {amount}
                  </Text>
                </View>
              )}
              
              {company && (
                <View className="flex-row items-center">
                  <Text className="text-sm text-text-secondary mr-2">Company</Text>
                  <Text className="text-sm font-medium text-primary">
                    {company}
                  </Text>
                </View>
              )}
            </View>

            {/* Divider */}
            <View className="border-t border-gray-200 mb-3" />

            {/* Actions Row */}
            <View className="flex-row space-x-2">
              {/* Scan Button */}
              <View className="flex-1">
                <PremiumButton
                  title="Scan"
                  onPress={handleScan}
                  variant="secondary"
                  size="sm"
                  icon={
                    <MaterialIcons 
                      name="qr-code-scanner" 
                      size={16} 
                      color="#6B7280" 
                      style={{ marginRight: 4 }}
                    />
                  }
                />
              </View>

              {/* Info Button */}
              <View className="flex-1">
                <PremiumButton
                  title="Info"
                  onPress={handleInfo}
                  variant="secondary"
                  size="sm"
                  icon={
                    <MaterialIcons 
                      name="info" 
                      size={16} 
                      color="#6B7280" 
                      style={{ marginRight: 4 }}
                    />
                  }
                />
              </View>

              {/* Resubmit Button */}
              <View className="flex-1">
                <TouchableOpacity
                  onPress={handleResubmit}
                  className="bg-warning rounded-lg px-3 py-2 min-h-[36px] items-center justify-center flex-row active:opacity-80 active:scale-95"
                >
                  <Text className="text-white text-sm font-semibold">
                    Resubmit
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </Animated.View>
      </PremiumCard>
    </TouchableOpacity>
  );
}