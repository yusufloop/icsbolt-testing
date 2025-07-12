import React, { useState } from 'react';
import { 
  View, 
  Text, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { MaterialIcons } from '@expo/vector-icons';
import { PremiumCard } from '@/components/ui/PremiumCard';
import { PremiumButton } from '@/components/ui/PremiumButton';
import { PremiumInput } from '@/components/ui/PremiumInput';
import { PremiumGradientBackground } from '@/components/ui/PremiumGradientBackground';
import * as DocumentPicker from 'expo-document-picker';
import DateTimePicker from '@react-native-community/datetimepicker';

interface FormData {
  itemRequested: string;
  quantity: string;
  reasonForRequest: string;
  phoneNo: string;
  dateNeededBy: Date | null;
  priority: 'High' | 'Medium' | 'Low' | null;
  chargeToDepartment: string;
  attachments: any[];
}

export default function NewRequestScreen() {
  const [formData, setFormData] = useState<FormData>({
    itemRequested: '',
    quantity: '',
    reasonForRequest: '',
    phoneNo: '',
    dateNeededBy: null,
    priority: null,
    chargeToDepartment: '',
    attachments: [],
  });

  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showPriorityPicker, setShowPriorityPicker] = useState(false);
  const [showDepartmentPicker, setShowDepartmentPicker] = useState(false);

  const priorities = ['High', 'Medium', 'Low'];
  const departments = ['Design Department', 'Engineering', 'Marketing', 'Sales', 'HR', 'Finance'];

  const handleBack = () => {
    router.back();
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setFormData(prev => ({ ...prev, dateNeededBy: selectedDate }));
    }
  };

  const handlePrioritySelect = (priority: 'High' | 'Medium' | 'Low') => {
    setFormData(prev => ({ ...prev, priority }));
    setShowPriorityPicker(false);
  };

  const handleDepartmentSelect = (department: string) => {
    setFormData(prev => ({ ...prev, chargeToDepartment: department }));
    setShowDepartmentPicker(false);
  };

  const handleFileUpload = async () => {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: '*/*',
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets[0]) {
        setFormData(prev => ({
          ...prev,
          attachments: [...prev.attachments, result.assets[0]]
        }));
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to pick file');
    }
  };

  const handleConfirm = () => {
    // Validate required fields
    if (!formData.itemRequested.trim()) {
      Alert.alert('Error', 'Item Requested is required');
      return;
    }

    // Submit form logic here
    Alert.alert('Success', 'Request submitted successfully!', [
      { text: 'OK', onPress: () => router.back() }
    ]);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'High':
        return '#FF453A'; // destructive
      case 'Medium':
        return '#FF9F0A'; // warning
      case 'Low':
        return '#30D158'; // success
      default:
        return '#8A8A8E'; // text-secondary
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    });
  };

  return (
    <SafeAreaView className="flex-1 bg-bg-primary">
      <KeyboardAvoidingView 
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View className="flex-row items-center px-4 py-4 bg-bg-secondary shadow-md">
          <TouchableOpacity 
            onPress={handleBack}
            className="mr-3 p-2 active:opacity-80"
          >
            <MaterialIcons name="arrow-back" size={24} color="#1C1C1E" />
          </TouchableOpacity>
          
          <Text className="text-2xl font-bold text-text-primary">
            New Requests
          </Text>
        </View>

        {/* Description */}
        <View className="px-4 py-3">
          <Text className="text-sm text-text-secondary">
            Fill in the information below for requests
          </Text>
        </View>

        {/* Form Content */}
        <ScrollView 
          className="flex-1 px-4"
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 120 }}
        >
          {/* Item Requested */}
          <View className="mb-4">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Item Requested
            </Text>
            <PremiumCard>
              <TextInput
                value={formData.itemRequested}
                onChangeText={(text) => setFormData(prev => ({ ...prev, itemRequested: text }))}
                placeholder="Enter item requested"
                placeholderTextColor="#8A8A8E"
                className="text-base text-text-primary"
              />
            </PremiumCard>
          </View>

          {/* Quantity */}
          <View className="mb-4">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Quantity
            </Text>
            <View className="w-24">
              <PremiumCard>
                <TextInput
                  value={formData.quantity}
                  onChangeText={(text) => setFormData(prev => ({ ...prev, quantity: text }))}
                  placeholder="20"
                  placeholderTextColor="#8A8A8E"
                  keyboardType="numeric"
                  className="text-base text-text-primary"
                />
              </PremiumCard>
            </View>
          </View>

          {/* Reason for Request */}
          <View className="mb-4">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Reason for Request
            </Text>
            <PremiumCard>
              <TextInput
                value={formData.reasonForRequest}
                onChangeText={(text) => setFormData(prev => ({ ...prev, reasonForRequest: text }))}
                placeholder="Enter reason for request"
                placeholderTextColor="#8A8A8E"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                className="text-base text-text-primary min-h-[80px]"
              />
            </PremiumCard>
          </View>

          {/* Phone No */}
          <View className="mb-4">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Phone No
            </Text>
            <PremiumCard>
              <TextInput
                value={formData.phoneNo}
                onChangeText={(text) => setFormData(prev => ({ ...prev, phoneNo: text }))}
                placeholder="Enter phone number"
                placeholderTextColor="#8A8A8E"
                keyboardType="phone-pad"
                className="text-base text-text-primary"
              />
            </PremiumCard>
          </View>

          {/* Date and Priority Row */}
          <View className="flex-row space-x-3 mb-4">
            {/* Date Needed By */}
            <View className="flex-1">
              <Text className="text-sm text-text-secondary mb-2 font-semibold">
                Date Needed By
              </Text>
              <TouchableOpacity
                onPress={() => setShowDatePicker(true)}
                className="active:opacity-80"
              >
                <PremiumCard>
                  <View className="flex-row items-center justify-between">
                    <Text className={`text-base ${formData.dateNeededBy ? 'text-text-primary' : 'text-text-secondary'}`}>
                      {formData.dateNeededBy ? formatDate(formData.dateNeededBy) : 'Select date'}
                    </Text>
                    <MaterialIcons name="chevron-right" size={20} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>

            {/* Priority */}
            <View className="flex-1">
              <Text className="text-sm text-text-secondary mb-2 font-semibold">
                Priority
              </Text>
              <TouchableOpacity
                onPress={() => setShowPriorityPicker(true)}
                className="active:opacity-80"
              >
                <PremiumCard>
                  <View className="flex-row items-center justify-between">
                    {formData.priority ? (
                      <View 
                        className="px-3 py-1 rounded-lg"
                        style={{ backgroundColor: getPriorityColor(formData.priority) + '20' }}
                      >
                        <Text 
                          className="text-sm font-semibold"
                          style={{ color: getPriorityColor(formData.priority) }}
                        >
                          {formData.priority}
                        </Text>
                      </View>
                    ) : (
                      <Text className="text-base text-text-secondary">
                        Select priority
                      </Text>
                    )}
                    <MaterialIcons name="chevron-right" size={20} color="#8A8A8E" />
                  </View>
                </PremiumCard>
              </TouchableOpacity>
            </View>
          </View>

          {/* Charge To Department */}
          <View className="mb-4">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Charge To Department
            </Text>
            <TouchableOpacity
              onPress={() => setShowDepartmentPicker(true)}
              className="active:opacity-80"
            >
              <PremiumCard>
                <View className="flex-row items-center justify-between">
                  <Text className={`text-base ${formData.chargeToDepartment ? 'text-text-primary' : 'text-text-secondary'}`}>
                    {formData.chargeToDepartment || 'Select department'}
                  </Text>
                  <View className="flex-row">
                    <MaterialIcons name="keyboard-arrow-up" size={16} color="#8A8A8E" />
                    <MaterialIcons name="keyboard-arrow-down" size={16} color="#8A8A8E" />
                  </View>
                </View>
              </PremiumCard>
            </TouchableOpacity>
          </View>

          {/* Attachments / Link */}
          <View className="mb-6">
            <Text className="text-sm text-text-secondary mb-2 font-semibold">
              Attachments / Link
            </Text>
            <TouchableOpacity
              onPress={handleFileUpload}
              className="active:opacity-80"
            >
              <View className="border border-gray-300 border-dashed rounded-lg p-4 items-center justify-center min-h-[60px]">
                <MaterialIcons name="cloud-upload" size={24} color="#8A8A8E" />
                <Text className="text-sm text-text-secondary mt-2">
                  Upload file
                </Text>
              </View>
            </TouchableOpacity>
            
            {/* Show attached files */}
            {formData.attachments.map((file, index) => (
              <View key={index} className="mt-2">
                <PremiumCard>
                  <View className="flex-row items-center">
                    <MaterialIcons name="attach-file" size={16} color="#0A84FF" />
                    <Text className="text-sm text-text-primary ml-2 flex-1">
                      {file.name}
                    </Text>
                  </View>
                </PremiumCard>
              </View>
            ))}
          </View>
        </ScrollView>

        {/* Sticky Confirm Button */}
        <View className="absolute bottom-0 left-0 right-0 bg-bg-secondary border-t border-gray-200 p-4">
          <PremiumButton
            title="Confirm"
            onPress={handleConfirm}
            variant="gradient"
            size="lg"
          />
        </View>

        {/* Date Picker Modal */}
        {showDatePicker && (
          <DateTimePicker
            value={formData.dateNeededBy || new Date()}
            mode="date"
            display="default"
            onChange={handleDateChange}
            minimumDate={new Date()}
          />
        )}

        {/* Priority Picker Modal */}
        {showPriorityPicker && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-bg-secondary rounded-lg p-4 mx-8 w-64">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Select Priority
              </Text>
              {priorities.map((priority) => (
                <TouchableOpacity
                  key={priority}
                  onPress={() => handlePrioritySelect(priority as any)}
                  className="py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"
                >
                  <Text 
                    className="text-base font-medium text-center"
                    style={{ color: getPriorityColor(priority) }}
                  >
                    {priority}
                  </Text>
                </TouchableOpacity>
              ))}
              <TouchableOpacity
                onPress={() => setShowPriorityPicker(false)}
                className="mt-4 py-2 active:opacity-80"
              >
                <Text className="text-base text-text-secondary text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Department Picker Modal */}
        {showDepartmentPicker && (
          <View className="absolute inset-0 bg-black/50 items-center justify-center">
            <View className="bg-bg-secondary rounded-lg p-4 mx-8 max-w-xs">
              <Text className="text-lg font-semibold text-text-primary mb-4 text-center">
                Select Department
              </Text>
              <ScrollView className="max-h-64">
                {departments.map((department) => (
                  <TouchableOpacity
                    key={department}
                    onPress={() => handleDepartmentSelect(department)}
                    className="py-3 border-b border-gray-200 last:border-b-0 active:opacity-80"
                  >
                    <Text className="text-base text-text-primary text-center">
                      {department}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <TouchableOpacity
                onPress={() => setShowDepartmentPicker(false)}
                className="mt-4 py-2 active:opacity-80"
              >
                <Text className="text-base text-text-secondary text-center">
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}