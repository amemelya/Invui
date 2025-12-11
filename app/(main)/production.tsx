import { Button } from '@/components/Button';
import { TextInputField } from '@/components/TextInputField';
import { TimePicker } from '@/components/TimePicker';
import { useApp } from '@/context/AppContext';
import { ProductionEntry } from '@/types';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View,
} from 'react-native';

export default function ProductionEntryScreen() {
  const router = useRouter();
  const { appState, addProductionEntry, resetSelection } = useApp();
  
  const [workerName, setWorkerName] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [unitsProduced, setUnitsProduced] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!appState.selectedMachine) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No machine selected</Text>
      </SafeAreaView>
    );
  }

  const handleSubmit = () => {
    // Validation
    if (!workerName.trim()) {
      Alert.alert('Error', 'Please enter worker name');
      return;
    }
    if (!startTime) {
      Alert.alert('Error', 'Please select start time');
      return;
    }
    if (!endTime) {
      Alert.alert('Error', 'Please select end time');
      return;
    }
    if (!unitsProduced.trim() || isNaN(Number(unitsProduced))) {
      Alert.alert('Error', 'Please enter valid units produced');
      return;
    }

    setIsLoading(true);

    // Simulate saving
    setTimeout(() => {
      const entry: ProductionEntry = {
        id: `entry_${Date.now()}`,
        machineId: appState.selectedMachine!.id,
        workerName: workerName.trim(),
        startTime,
        endTime,
        unitsProduced: Number(unitsProduced),
        timestamp: new Date().toISOString(),
      };

      addProductionEntry(entry);
      setIsLoading(false);

      Alert.alert('Success', 'Production entry saved successfully!', [
        {
          text: 'OK',
          onPress: () => {
            // Reset and go back to machine selection
            resetSelection();
            router.back();
          },
        },
      ]);
    }, 500);
  };

  const handleCancel = () => {
    Alert.alert('Cancel', 'Are you sure you want to cancel?', [
      { text: 'No', onPress: () => {} },
      {
        text: 'Yes',
        onPress: () => {
          resetSelection();
          router.back();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <View style={styles.header}>
          <Text style={styles.title}>Production Entry</Text>
          <Text style={styles.subtitle}>
            {appState.selectedMachine.name}
          </Text>
        </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.form}>
          <TextInputField
            label="Worker Name"
            placeholder="Enter worker name"
            value={workerName}
            onChangeText={setWorkerName}
          />

          <TimePicker
            label="Start Time"
            value={startTime}
            onChange={setStartTime}
          />

          <TimePicker
            label="End Time"
            value={endTime}
            onChange={setEndTime}
          />

          <TextInputField
            label="Units Produced"
            placeholder="Enter number of units"
            value={unitsProduced}
            onChangeText={setUnitsProduced}
            keyboardType="decimal-pad"
          />

          <View style={styles.buttonGroup}>
            <Button
              title={isLoading ? 'Submitting...' : 'Submit'}
              onPress={handleSubmit}
              disabled={isLoading}
              variant="primary"
            />
            <Button
              title="Cancel"
              onPress={handleCancel}
              disabled={isLoading}
              variant="danger"
            />
          </View>

          <View style={styles.infoBox}>
            <Text style={styles.infoLabel}>Selected Details:</Text>
            <Text style={styles.infoText}>
              Product: {appState.selectedProduct?.name}
            </Text>
            <Text style={styles.infoText}>
              Process: {appState.selectedProcess?.name}
            </Text>
            <Text style={styles.infoText}>
              Machine: {appState.selectedMachine.name}
            </Text>
          </View>
        </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  keyboardView: {
    flex: 1,
  },
  header: {
    backgroundColor: '#0066CC',
    paddingVertical: 20,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#E6F4FE',
  },
  content: {
    flex: 1,
  },
  form: {
    padding: 16,
  },
  buttonGroup: {
    marginTop: 16,
    gap: 8,
  },
  infoBox: {
    backgroundColor: '#E6F4FE',
    borderRadius: 8,
    padding: 12,
    marginTop: 24,
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0066CC',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 13,
    color: '#333333',
    marginBottom: 4,
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
});
