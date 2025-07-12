import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '@/hooks/useAuth';

export function Dashboard() {
  const { user, logout, isLoading } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  const stats = [
    { label: 'Projects', value: '12', icon: 'briefcase', color: '#3b82f6' },
    { label: 'Tasks', value: '48', icon: 'checkmark-circle', color: '#10b981' },
    { label: 'Notifications', value: '3', icon: 'notifications', color: '#f59e0b' },
  ];

  const quickActions = [
    { label: 'Profile Settings', icon: 'person', color: '#6366f1' },
    { label: 'App Settings', icon: 'settings', color: '#8b5cf6' },
    { label: 'Notifications', icon: 'notifications', color: '#06b6d4' },
  ];

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView 
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          paddingBottom: Platform.OS === 'ios' ? 100 : 80
        }}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-6 py-4 bg-white shadow-sm">
          <View className="flex-1">
            <Text className="text-gray-500 text-sm font-inter-regular">
              Welcome back,
            </Text>
            <Text className="text-gray-900 text-xl font-inter-bold mt-1">
              {user?.first_name} {user?.last_name}
            </Text>
          </View>
          
          <TouchableOpacity 
            className="p-2 rounded-lg bg-gray-100 active:bg-gray-200"
            onPress={handleLogout}
            disabled={isLoading}
          >
            <Ionicons name="log-out" size={20} color="#6b7280" />
          </TouchableOpacity>
        </View>

        {/* User Info Card */}
        <View className="mx-6 mt-4 p-4 bg-white rounded-xl shadow-sm border border-gray-200">
          <View className="flex-row items-center">
            {/* Avatar */}
            <View className="w-16 h-16 bg-blue-500 rounded-full items-center justify-center">
              <Text className="text-white text-xl font-inter-bold">
                {user?.first_name?.[0]}{user?.last_name?.[0]}
              </Text>
            </View>
            
            {/* User Details */}
            <View className="flex-1 ml-4">
              <Text className="text-gray-900 text-lg font-inter-semibold">
                {user?.first_name} {user?.last_name}
              </Text>
              <Text className="text-gray-500 text-sm font-inter-regular mt-1">
                {user?.email}
              </Text>
              <View className="flex-row items-center mt-2">
                <View className="w-2 h-2 bg-green-500 rounded-full mr-2" />
                <Text className="text-green-600 text-xs font-inter-regular">
                  {user?.email_verified ? 'Verified' : 'Unverified'}
                </Text>
              </View>
            </View>
          </View>
        </View>

        {/* Stats Grid */}
        <View className="mx-6 mt-6">
          <Text className="text-gray-900 text-lg font-inter-semibold mb-4">
            Overview
          </Text>
          
          <View className="flex-row flex-wrap -mx-2">
            {stats.map((stat, index) => (
              <View key={index} className="w-1/3 px-2 mb-4">
                <View className="bg-white p-4 rounded-xl shadow-sm border border-gray-200">
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mb-3"
                    style={{ backgroundColor: stat.color + '20' }}
                  >
                    <Ionicons 
                      name={stat.icon as any} 
                      size={20} 
                      color={stat.color} 
                    />
                  </View>
                  
                  <Text className="text-2xl font-inter-bold text-gray-900">
                    {stat.value}
                  </Text>
                  <Text className="text-gray-500 text-xs font-inter-regular mt-1">
                    {stat.label}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* Quick Actions */}
        <View className="mx-6 mt-6">
          <Text className="text-gray-900 text-lg font-inter-semibold mb-4">
            Quick Actions
          </Text>
          
          <View className="space-y-3">
            {quickActions.map((action, index) => (
              <TouchableOpacity
                key={index}
                className="bg-white p-4 rounded-xl shadow-sm border border-gray-200 active:bg-gray-50"
              >
                <View className="flex-row items-center">
                  <View 
                    className="w-10 h-10 rounded-lg items-center justify-center mr-4"
                    style={{ backgroundColor: action.color + '20' }}
                  >
                    <Ionicons 
                      name={action.icon as any} 
                      size={20} 
                      color={action.color} 
                    />
                  </View>
                  
                  <Text className="flex-1 text-gray-900 font-inter-semibold">
                    {action.label}
                  </Text>
                  
                  <Ionicons 
                    name="chevron-forward" 
                    size={16} 
                    color="#9ca3af" 
                  />
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}