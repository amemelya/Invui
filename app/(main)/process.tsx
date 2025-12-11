import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import { useApp } from '@/context/AppContext';
import { Process } from '@/types';
import { mockProcesses } from '@/utils/mockData';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProcessSelectionScreen() {
  const router = useRouter();
  const { appState, setSelectedProcess } = useApp();

  if (!appState.selectedProduct) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.errorText}>No product selected</Text>
      </SafeAreaView>
    );
  }

  const processes = mockProcesses[appState.selectedProduct.id] || [];

  const handleSelectProcess = (process: Process) => {
    setSelectedProcess(process);
    router.push({
      pathname: '/(main)/machine',
    });
  };

  const handleBack = () => {
    router.back();
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Select Process</Text>
        <Text style={styles.subtitle}>
          {appState.selectedProduct.name}
        </Text>
      </View>

      <FlatList
        data={processes}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            description={item.description}
            onPress={() => handleSelectProcess(item)}
            icon="settings"
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
