import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  ScrollView, 
  Platform,
  Dimensions 
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import Animated, { FadeInDown } from 'react-native-reanimated';

interface Invoice {
  id: string;
  description: string;
  status: 'Paid' | 'Overdue';
  statusType: 'success' | 'error';
}

interface BookingStats {
  total: number;
  inTransit: number;
  new: number;
  delivered: number;
}

export default function Dashboard() {
  const [selectedTab, setSelectedTab] = useState('Dashboard');
  
  const invoices: Invoice[] = [
    { id: '#ITEM 2', description: 'PNG - KLG', status: 'Paid', statusType: 'success' },
    { id: '#ITEM 2', description: 'PNG - KLG', status: 'Paid', statusType: 'success' },
    { id: '#ITEM 2', description: 'PNG - KLG', status: 'Overdue', statusType: 'error' },
  ];

  const bookingStats: BookingStats = {
    total: 159,
    inTransit: 64,
    new: 10,
    delivered: 85,
  };

  const quickBookings = [
    { id: '#ITEM 2', status: 'Picked Up' },
    { id: '#ITEM 2', status: 'Picked Up' },
    { id: '#ITEM 2', status: 'Picked Up' },
  ];

  const tabBarItems = [
    { name: 'Dashboard', icon: 'dashboard', label: 'Dashboard' },
    { name: 'Bookings', icon: 'event-note', label: 'Bookings' },
    { name: 'User', icon: 'person', label: 'User' },
    { name: 'More', icon: 'more-horiz', label: 'More' },
  ];

  const StatusBadge = ({ status, type }: { status: string; type: 'success' | 'error' | 'warning' }) => {
    const getBadgeStyle = (type: string) => {
      switch (type) {
        case 'success':
          return 'bg-success';
        case 'error':
          return 'bg-destructive';
        case 'warning':
          return 'bg-warning';
        default:
          return 'bg-gray-500';
      }
    };

    return (
      <View className={`px-3 py-1 rounded-lg ${getBadgeStyle(type)}`}>
        <Text className="text-xs font-medium text-white">
          {status}
        </Text>
      </View>
    );
  };

  const CircularProgress = ({ stats }: { stats: BookingStats }) => {
    const { width } = Dimensions.get('window');
    const size = Math.min(width * 0.4, 160);
    
    return (
      <View className="items-center justify-center" style={{ width: size, height: size }}>
        <View className="absolute items-center justify-center" style={{ width: size, height: size }}>
          {/* Background circle */}
          <View 
            className="rounded-full border-8 border-gray-200"
            style={{ width: size, height: size }}
          />
          
          {/* Progress arcs - simplified visual representation */}
          <View className="absolute items-center justify-center">
            <Text className="text-4xl font-bold text-text-primary">
              {stats.total}
            </Text>
            <Text className="text-sm text-text-secondary mt-1">
              Bookings this year
            </Text>
          </View>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 100 }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-4 py-4 bg-bg-secondary shadow-md">
          <View className="flex-row items-center">
            <MaterialIcons name="star" size={24} color="#0A84FF" />
            <Text className="text-xl font-bold text-text-primary ml-3">
              Dashboard
            </Text>
          </View>
          <Text className="text-sm text-text-secondary">
            9:09
          </Text>
        </View>

        {/* Invoices Section */}
        <Animated.View 
          entering={FadeInDown.delay(100)}
          className="mx-4 mt-6"
        >
          <Text className="text-lg font-bold text-primary mb-4">
            Invoices
          </Text>
          
          <View className="bg-bg-secondary rounded-xl shadow-md border border-gray-100">
            {invoices.map((invoice, index) => (
              <View 
                key={index}
                className={`flex-row items-center justify-between px-4 py-4 ${
                  index !== invoices.length - 1 ? 'border-b border-gray-100' : ''
                }`}
              >
                <View className="flex-1">
                  <Text className="text-text-primary font-semibold">
                    {invoice.id}
                  </Text>
                  <Text className="text-text-secondary text-sm mt-1">
                    {invoice.description}
                  </Text>
                </View>
                
                <StatusBadge 
                  status={invoice.status} 
                  type={invoice.statusType} 
                />
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Booking Summary Section */}
        <Animated.View 
          entering={FadeInDown.delay(200)}
          className="mx-4 mt-8"
        >
          <Text className="text-lg font-bold text-text-primary mb-4">
            Booking Summary
          </Text>
          
          <View className="bg-bg-secondary rounded-xl shadow-md border border-gray-100 p-6">
            <View className="items-center">
              <CircularProgress stats={bookingStats} />
              
              {/* Stats Legend */}
              <View className="flex-row flex-wrap justify-center mt-6 gap-4">
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-primary rounded-full mr-2" />
                  <Text className="text-sm text-text-secondary">
                    In Transit <Text className="font-semibold text-text-primary">{bookingStats.inTransit}</Text>
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-warning rounded-full mr-2" />
                  <Text className="text-sm text-text-secondary">
                    New <Text className="font-semibold text-text-primary">{bookingStats.new}</Text>
                  </Text>
                </View>
                
                <View className="flex-row items-center">
                  <View className="w-3 h-3 bg-info rounded-full mr-2" />
                  <Text className="text-sm text-text-secondary">
                    Delivered <Text className="font-semibold text-text-primary">{bookingStats.delivered}</Text>
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Bookings Section */}
        <Animated.View 
          entering={FadeInDown.delay(300)}
          className="mx-4 mt-8"
        >
          <View className="flex-row gap-4">
            {quickBookings.map((booking, index) => (
              <TouchableOpacity
                key={index}
                className="flex-1 bg-bg-secondary rounded-xl shadow-md border border-gray-100 p-4 active:bg-gray-50"
                activeOpacity={0.7}
              >
                <Text className="text-text-primary font-semibold text-center">
                  {booking.id}
                </Text>
                <Text className="text-warning text-xs text-center mt-2">
                  {booking.status}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      </ScrollView>

    
    </SafeAreaView>
  );
}