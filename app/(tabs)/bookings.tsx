import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumStatusBadge } from '@/components/ui/PremiumStatusBadge';
import { PremiumButton } from '@/components/ui/PremiumButton';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function BookingsScreen() {
  const bookings = [
    { id: '#ITEM 2', status: 'In Transit', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'New', statusType: 'info' as const },
    { id: '#ITEM 2', status: 'Picked Up', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'In Transit', statusType: 'warning' as const },
    { id: '#ITEM 2', status: 'Delivered', statusType: 'success' as const },
  ];

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-bg-secondary shadow-md">
          <MaterialIcons 
            name="star" 
            size={24} 
            color="#0A84FF" 
          />
          <Text className="text-2xl font-bold text-text-primary ml-3">
            Bookings
          </Text>
        </View>

        {/* Search Bar */}
        <View className="px-4 pt-6">
          <PremiumCard>
            <View className="flex-row items-center">
              <MaterialIcons 
                name="search" 
                size={20} 
                color="#8A8A8E"
                style={{ marginRight: 12 }}
              />
              <TextInput
                placeholder="Search"
                placeholderTextColor="#8A8A8E"
                className="flex-1 text-base text-text-primary font-system"
              />
            </View>
          </PremiumCard>
        </View>

        {/* Filter Controls */}
        <View className="flex-row items-center justify-between px-4 pt-6 mb-6">
          <View className="flex-row items-center space-x-6">
            <TouchableOpacity className="flex-row items-center py-2 active:opacity-80">
              <MaterialIcons 
                name="sort" 
                size={20} 
                color="#8A8A8E"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-text-secondary font-system">
                Sort
              </Text>
              <MaterialIcons 
                name="keyboard-arrow-down" 
                size={20} 
                color="#8A8A8E"
                style={{ marginLeft: 4 }}
              />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-2 active:opacity-80">
              <MaterialIcons 
                name="filter-list" 
                size={20} 
                color="#8A8A8E"
                style={{ marginRight: 4 }}
              />
              <Text className="text-sm text-text-secondary font-system">
                Filter
              </Text>
              <View className="bg-primary rounded-full w-5 h-5 items-center justify-center ml-2">
                <Text className="text-white text-xs font-semibold">
                  2
                </Text>
              </View>
            </TouchableOpacity>
          </View>

          <TouchableOpacity className="bg-primary rounded-full w-10 h-10 items-center justify-center shadow-md active:opacity-80 active:scale-95">
            <MaterialIcons 
              name="add" 
              size={24} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Bookings List */}
        <View className="px-4 space-y-3">
          {bookings.map((booking, index) => (
            <Animated.View
              key={`${booking.id}-${index}`}
              entering={FadeInDown.delay(index * 100).duration(300)}
            >
              <PremiumCard>
                <View className="flex-row items-center justify-between">
                  <Text className="text-lg font-semibold text-text-primary">
                    {booking.id}
                  </Text>
                  
                  <PremiumStatusBadge
                    status={booking.statusType}
                    text={booking.status}
                    size="sm"
                  />
                </View>
              </PremiumCard>
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}