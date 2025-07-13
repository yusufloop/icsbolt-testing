import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '@/lib/auth';

export default function HomeScreen() {
  const { user } = useAuth();

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 shadow-sm">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Welcome Back!
          </Text>
          <Text className="text-gray-600">
            Hello {user?.user_metadata?.full_name || user?.email}
          </Text>
        </View>

        {/* Content */}
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Dashboard
            </Text>
            <Text className="text-gray-600 leading-relaxed">
              This is your main dashboard. You can add your app's main content here.
            </Text>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Quick Actions
            </Text>
            <View className="space-y-3">
              <View className="bg-blue-50 p-4 rounded-xl">
                <Text className="text-blue-900 font-medium">Action 1</Text>
                <Text className="text-blue-700 text-sm">Description for action 1</Text>
              </View>
              <View className="bg-green-50 p-4 rounded-xl">
                <Text className="text-green-900 font-medium">Action 2</Text>
                <Text className="text-green-700 text-sm">Description for action 2</Text>
              </View>
              <View className="bg-purple-50 p-4 rounded-xl">
                <Text className="text-purple-900 font-medium">Action 3</Text>
                <Text className="text-purple-700 text-sm">Description for action 3</Text>
              </View>
            </View>
          </View>

          <View className="bg-white rounded-2xl p-6 shadow-lg">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Recent Activity
            </Text>
            <Text className="text-gray-600">
              No recent activity to show.
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}