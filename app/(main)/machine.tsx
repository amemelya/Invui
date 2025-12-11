import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import { useApp } from '@/context/AppContext';
import { Machine } from '@/types';
import { mockMachines } from '@/utils/mockData';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function MachineSelectionScreen() {
  const router = useRouter();
  const { appState, setSelectedMachine } = useApp();

  if (!appState.selectedProcess) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No process selected</Text>
      </SafeAreaView>
    );
  }

  const machines = mockMachines[appState.selectedProcess.id] || [];

  const handleSelectMachine = (machine: Machine) => {
    setSelectedMachine(machine);
    router.push({
      pathname: '/(main)/production',
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Machine</Text>
        <Text style={styles.subtitle}>
          {appState.selectedProcess.name}
        </Text>
      </View>

      <FlatList
        data={machines}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            description={item.description}
            onPress={() => handleSelectMachine(item)}
            icon="memory"
          />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        style={styles.list}
      />

      <View style={styles.footer}>
        <Button title="Back" onPress={handleBack} variant="secondary" />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
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
  list: {
    flex: 1,
    marginTop: 12,
  },
  footer: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E8E8E8',
  },
  errorText: {
    fontSize: 16,
    color: '#FF3B30',
    textAlign: 'center',
    marginTop: 20,
  },
});
