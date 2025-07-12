import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import { RequestCard } from '@/components/ui/RequestCard';
import { PremiumCard } from '@/components/ui/PremiumCard';
import Animated, { FadeInDown } from 'react-native-reanimated';

export default function RequestsScreen() {
  const [expandedCard, setExpandedCard] = useState<string | null>(null);

  const requests = [
    { 
      id: '#ITEM 1', 
      date: '30/10/2019',
      status: 'Unsuccessfully', 
      itemRequested: 'Laptop Repair',
      priority: 'High',
      amount: 'RM 200',
      company: 'Capi Telecom'
    },
    { 
      id: '#ITEM 2', 
      date: '30/10/2019',
      status: 'Successfully', 
      itemRequested: 'Office Supplies',
      priority: 'Medium',
      amount: '$50',
      company: 'Capi Telecom'
    },
    { 
      id: '#ITEM 3', 
      date: '29/10/2019',
      status: 'Successfully', 
      itemRequested: 'Software License',
      priority: 'Low',
      amount: '$150',
      company: 'Tech Solutions'
    },
    { 
      id: '#ITEM 4', 
      date: '28/10/2019',
      status: 'Pending', 
      itemRequested: 'Equipment Maintenance',
      priority: 'High',
      amount: '$300',
      company: 'Service Pro'
    },
    { 
      id: '#ITEM 5', 
      date: '27/10/2019',
      status: 'Successfully', 
      itemRequested: 'Training Materials',
      priority: 'Low',
      amount: '$75',
      company: 'EduTech'
    },
  ];

  const handleCardToggle = (cardId: string) => {
    setExpandedCard(expandedCard === cardId ? null : cardId);
  };

  const handleCreateRequest = () => {
    router.push('/(tabs)/new-request');
  };

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
            My Requests
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

          <TouchableOpacity 
            className="bg-primary rounded-full w-10 h-10 items-center justify-center shadow-md active:opacity-80 active:scale-95"
            onPress={handleCreateRequest}
          >
            <MaterialIcons 
              name="add" 
              size={24} 
              color="#FFFFFF"
            />
          </TouchableOpacity>
        </View>

        {/* Requests List */}
        <View className="px-4">
          {requests.map((request, index) => (
            <Animated.View
              key={request.id}
              entering={FadeInDown.delay(index * 100).duration(300)}
            >
              <RequestCard
                id={request.id}
                date={request.date}
                status={request.status}
                itemRequested={request.itemRequested}
                priority={request.priority}
                amount={request.amount}
                company={request.company}
                isExpanded={expandedCard === request.id}
                onToggle={() => handleCardToggle(request.id)}
              />
            </Animated.View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}