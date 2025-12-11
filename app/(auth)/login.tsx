import { Button } from '@/components/Button';
import { TextInputField } from '@/components/TextInputField';
import { useAuth } from '@/context/AuthContext';
import React, { useState } from 'react';
import {
    Alert,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    View
} from 'react-native';

export default function LoginScreen() {
  const { login } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = async () => {
    if (!username.trim() || !password.trim()) {
      Alert.alert('Error', 'Please enter both username and password');
      return;
    }

    setIsLoading(true);
    // Simulate network delay
    setTimeout(() => {
      if (login(username, password)) {
        setUsername('');
        setPassword('');
      } else {
        Alert.alert('Login Failed', 'Invalid credentials. Try admin/admin');
      }
      setIsLoading(false);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>INVUI</Text>
          <Text style={styles.subtitle}>Production Tracking System</Text>
        </View>

        <View style={styles.form}>
          <TextInputField
            label="Username"
            placeholder="Enter username"
            value={username}
            onChangeText={setUsername}
          />

          <TextInputField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChangeText={setPassword}
          />

          <Text style={styles.hint}>
            Demo credentials: admin / admin
          </Text>

          <Button
            title={isLoading ? 'Logging in...' : 'Login'}
            onPress={handleLogin}
            disabled={isLoading}
            variant="primary"
          />
        </View>
      </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 16,
    paddingTop: 60,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: '700',
    color: '#0066CC',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#666666',
  },
  form: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    paddingTop: 24,
  },
  hint: {
    fontSize: 12,
    color: '#999999',
    marginTop: 8,
    marginBottom: 16,
  },
});
