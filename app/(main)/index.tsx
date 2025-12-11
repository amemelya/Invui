import { Button } from '@/components/Button';
import { ListItem } from '@/components/ListItem';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/types';
import { mockProducts } from '@/utils/mockData';
import { useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native';

export default function ProductSelectionScreen() {
  const router = useRouter();
  const { setSelectedProduct } = useApp();
  const { logout } = useAuth();

  const handleSelectProduct = (product: Product) => {
    setSelectedProduct(product);
    router.push({
      pathname: '/(main)/process',
    });
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', onPress: () => {} },
      {
        text: 'Logout',
        onPress: () => logout(),
        style: 'destructive',
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Select Product</Text>
          <Text style={styles.subtitle}>Choose a product to start production entry</Text>
        </View>
        <Button
          title="Logout"
          onPress={handleLogout}
          variant="danger"
          style={styles.logoutButton}
        />
      </View>

      <FlatList
        data={mockProducts}
        renderItem={({ item }) => (
          <ListItem
            title={item.name}
            description={item.description}
            onPress={() => handleSelectProduct(item)}
            icon="build"
          />
        )}
        keyExtractor={(item) => item.id}
        scrollEnabled={true}
        style={styles.list}
      />
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
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
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
  logoutButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    marginVertical: 0,
  },
  list: {
    flex: 1,
    marginTop: 12,
  },
});
