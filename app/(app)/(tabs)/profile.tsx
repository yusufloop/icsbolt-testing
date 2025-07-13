import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { useAuth } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import type { Profile } from '@/types/auth';

export default function ProfileScreen() {
  const { user, signOut } = useAuth();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchProfile();
    }
  }, [user]);

  const fetchProfile = async () => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user?.id)
        .single();

      if (error) {
        console.error('Error fetching profile:', error);
      } else {
        setProfile(data);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    Alert.alert(
      'Sign Out',
      'Are you sure you want to sign out?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Out',
          style: 'destructive',
          onPress: async () => {
            await signOut();
          },
        },
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50 items-center justify-center">
        <Text className="text-gray-600">Loading profile...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        {/* Header */}
        <View className="bg-white px-6 py-8 shadow-sm">
          <Text className="text-3xl font-bold text-gray-900 mb-2">
            Profile
          </Text>
          <Text className="text-gray-600">
            Manage your account settings
          </Text>
        </View>

        {/* Profile Info */}
        <View className="p-6">
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <View className="items-center mb-6">
              <View className="w-20 h-20 bg-blue-500 rounded-full items-center justify-center mb-4">
                <Text className="text-white text-2xl font-bold">
                  {profile?.full_name?.charAt(0)?.toUpperCase() || user?.email?.charAt(0)?.toUpperCase()}
                </Text>
              </View>
              <Text className="text-xl font-semibold text-gray-900">
                {profile?.full_name || 'User'}
              </Text>
              <Text className="text-gray-600">
                {user?.email}
              </Text>
            </View>

            <View className="space-y-4">
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Full Name</Text>
                <Text className="text-gray-900 font-medium">
                  {profile?.full_name || 'Not set'}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Email</Text>
                <Text className="text-gray-900 font-medium">
                  {user?.email}
                </Text>
              </View>
              <View className="flex-row items-center justify-between py-3 border-b border-gray-100">
                <Text className="text-gray-600">Member Since</Text>
                <Text className="text-gray-900 font-medium">
                  {user?.created_at ? new Date(user.created_at).toLocaleDateString() : 'Unknown'}
                </Text>
              </View>
            </View>
          </View>

          {/* Actions */}
          <View className="bg-white rounded-2xl p-6 shadow-lg mb-6">
            <Text className="text-xl font-semibold text-gray-900 mb-4">
              Account Actions
            </Text>
            
            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
              <MaterialIcons name="edit" size={24} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">Edit Profile</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
              <MaterialIcons name="security" size={24} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">Security Settings</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4 border-b border-gray-100">
              <MaterialIcons name="notifications" size={24} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">Notifications</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center py-4">
              <MaterialIcons name="help" size={24} color="#6b7280" />
              <Text className="text-gray-900 ml-3 flex-1">Help & Support</Text>
              <MaterialIcons name="chevron-right" size={24} color="#6b7280" />
            </TouchableOpacity>
          </View>

          {/* Sign Out */}
          <TouchableOpacity
            onPress={handleSignOut}
            className="bg-red-500 rounded-2xl p-4 shadow-lg"
          >
            <View className="flex-row items-center justify-center">
              <MaterialIcons name="logout" size={24} color="white" />
              <Text className="text-white font-semibold ml-2">Sign Out</Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}