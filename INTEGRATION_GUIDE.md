# INVUI Integration Guide

## Replacing Mock Data with Real API Calls

### Current Implementation
The app currently uses mock data from `utils/mockData.ts`. Here's how to replace it with real API calls.

## Step 1: Create API Service

Create `utils/api.ts`:

```typescript
import axios, { AxiosInstance } from 'axios';

const API_BASE_URL = 'https://your-api.com/api';

const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
axiosInstance.interceptors.request.use((config) => {
  // Get token from secure storage or context
  // const token = await getAuthToken();
  // if (token) {
  //   config.headers.Authorization = `Bearer ${token}`;
  // }
  return config;
});

export const apiService = {
  // Products
  async getProducts(): Promise<Product[]> {
    try {
      const response = await axiosInstance.get('/products');
      return response.data;
    } catch (error) {
      console.error('Error fetching products:', error);
      throw error;
    }
  },

  // Processes
  async getProcesses(productId: string): Promise<Process[]> {
    try {
      const response = await axiosInstance.get(`/products/${productId}/processes`);
      return response.data;
    } catch (error) {
      console.error('Error fetching processes:', error);
      throw error;
    }
  },

  // Machines
  async getMachines(processId: string): Promise<Machine[]> {
    try {
      const response = await axiosInstance.get(`/processes/${processId}/machines`);
      return response.data;
    } catch (error) {
      console.error('Error fetching machines:', error);
      throw error;
    }
  },

  // Save Production Entry
  async saveProductionEntry(entry: ProductionEntry): Promise<ProductionEntry> {
    try {
      const response = await axiosInstance.post('/production-entries', entry);
      return response.data;
    } catch (error) {
      console.error('Error saving production entry:', error);
      throw error;
    }
  },

  // Get Production Entries
  async getProductionEntries(machineId?: string): Promise<ProductionEntry[]> {
    try {
      const params = machineId ? { machineId } : {};
      const response = await axiosInstance.get('/production-entries', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching entries:', error);
      throw error;
    }
  },

  // Login
  async login(username: string, password: string): Promise<{ token: string; user: any }> {
    try {
      const response = await axiosInstance.post('/auth/login', { username, password });
      return response.data;
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  },
};
```

## Step 2: Update AuthContext

Modify `context/AuthContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { AuthState } from '@/types';
import { apiService } from '@/utils/api';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface AuthContextType {
  authState: AuthState;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [authState, setAuthState] = useState<AuthState>({
    isLoggedIn: false,
  });
  const [loading, setLoading] = useState(false);

  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    try {
      const { token, user } = await apiService.login(username, password);
      
      // Store token securely
      await AsyncStorage.setItem('authToken', token);
      
      setAuthState({
        isLoggedIn: true,
        user: {
          role: user.role || 'worker',
          name: user.name,
        },
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    try {
      await AsyncStorage.removeItem('authToken');
      setAuthState({ isLoggedIn: false });
    } catch (error) {
      console.error('Logout error:', error);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ authState, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
```

## Step 3: Update AppContext with API Calls

Modify `context/AppContext.tsx`:

```typescript
import React, { createContext, useContext, useState, useCallback } from 'react';
import { Product, Process, Machine, ProductionEntry, AppState } from '@/types';
import { apiService } from '@/utils/api';

interface AppContextType {
  appState: AppState;
  setSelectedProduct: (product: Product) => Promise<void>;
  setSelectedProcess: (process: Process) => Promise<void>;
  setSelectedMachine: (machine: Machine) => void;
  addProductionEntry: (entry: ProductionEntry) => Promise<void>;
  resetSelection: () => void;
  loading: boolean;
  error: string | null;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [appState, setAppState] = useState<AppState>({
    entries: [],
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const setSelectedProduct = useCallback(async (product: Product) => {
    setLoading(true);
    try {
      setAppState((prev) => ({
        ...prev,
        selectedProduct: product,
        selectedProcess: undefined,
        selectedMachine: undefined,
      }));
    } catch (err) {
      setError('Error selecting product');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setSelectedProcess = useCallback(async (process: Process) => {
    setLoading(true);
    try {
      setAppState((prev) => ({
        ...prev,
        selectedProcess: process,
        selectedMachine: undefined,
      }));
    } catch (err) {
      setError('Error selecting process');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  const setSelectedMachine = useCallback((machine: Machine) => {
    setAppState((prev) => ({
      ...prev,
      selectedMachine: machine,
    }));
  }, []);

  const addProductionEntry = useCallback(async (entry: ProductionEntry) => {
    setLoading(true);
    try {
      const savedEntry = await apiService.saveProductionEntry(entry);
      setAppState((prev) => ({
        ...prev,
        entries: [...prev.entries, savedEntry],
      }));
    } catch (err) {
      setError('Error saving production entry');
      console.error(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const resetSelection = useCallback(() => {
    setAppState((prev) => ({
      ...prev,
      selectedProcess: undefined,
      selectedMachine: undefined,
    }));
    setError(null);
  }, []);

  return (
    <AppContext.Provider
      value={{
        appState,
        setSelectedProduct,
        setSelectedProcess,
        setSelectedMachine,
        addProductionEntry,
        resetSelection,
        loading,
        error,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}
```

## Step 4: Update Screens to Fetch Data

Update `app/(main)/index.tsx`:

```typescript
import React, { useEffect, useState } from 'react';
import { StyleSheet, View, Text, FlatList, Alert, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useApp } from '@/context/AppContext';
import { useAuth } from '@/context/AuthContext';
import { ListItem } from '@/components/ListItem';
import { Button } from '@/components/Button';
import { apiService } from '@/utils/api';
import { Product } from '@/types';

export default function ProductSelectionScreen() {
  const router = useRouter();
  const { setSelectedProduct } = useApp();
  const { logout } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const data = await apiService.getProducts();
      setProducts(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectProduct = async (product: Product) => {
    await setSelectedProduct(product);
    router.push({ pathname: '/(main)/process' });
  };

  if (loading) {
    return (
      <View style={[styles.container, styles.centerContent]}>
        <ActivityIndicator size="large" color="#0066CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {/* ... rest of the component ... */}
    </View>
  );
}
```

## Backend API Endpoints Required

```
POST   /auth/login                    - User login
GET    /products                      - Get all products
GET    /products/:id/processes        - Get processes for product
GET    /processes/:id/machines        - Get machines for process
POST   /production-entries            - Save production entry
GET    /production-entries            - Get production entries
GET    /production-entries?machineId= - Filter by machine
```

## Data Models for Backend

```typescript
// User
{
  id: string;
  username: string;
  name: string;
  role: 'admin' | 'worker' | 'manager';
  createdAt: string;
}

// Product
{
  id: string;
  name: string;
  description: string;
  createdAt: string;
}

// Process
{
  id: string;
  productId: string;
  name: string;
  description: string;
  createdAt: string;
}

// Machine
{
  id: string;
  processId: string;
  name: string;
  description: string;
  createdAt: string;
}

// ProductionEntry
{
  id: string;
  machineId: string;
  workerName: string;
  startTime: string;
  endTime: string;
  unitsProduced: number;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}
```

## Installation of Required Packages

```bash
npm install axios @react-native-async-storage/async-storage
npm install -D @types/axios
```

## Security Considerations

1. **Store Auth Token Securely**
   ```bash
   npm install @react-native-community/hooks expo-secure-store
   ```

2. **Environment Variables**
   Create `.env`:
   ```
   EXPO_PUBLIC_API_BASE_URL=https://your-api.com/api
   EXPO_PUBLIC_API_TIMEOUT=10000
   ```

3. **Token Refresh**
   Implement automatic token refresh mechanism

4. **SSL Pinning**
   Use axios interceptors or native modules for production

## Testing API Integration

Use Postman or Insomnia to test endpoints:

1. Test login endpoint
2. Test product fetch
3. Test process fetch
4. Test machine fetch
5. Test production entry creation

## Error Handling

```typescript
// Example error handling in screens
try {
  await apiService.getProducts();
} catch (error) {
  if (error.response?.status === 401) {
    // Unauthorized - logout user
    logout();
  } else if (error.response?.status === 500) {
    // Server error
    Alert.alert('Server Error', 'Please try again later');
  } else if (error.code === 'ECONNABORTED') {
    // Timeout
    Alert.alert('Timeout', 'Request took too long');
  } else {
    // Unknown error
    Alert.alert('Error', error.message);
  }
}
```

## Caching Strategy

```typescript
// Simple caching mechanism
const cache = new Map<string, { data: any; timestamp: number }>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

async function getCachedProducts() {
  const cached = cache.get('products');
  if (cached && Date.now() - cached.timestamp < CACHE_DURATION) {
    return cached.data;
  }
  
  const data = await apiService.getProducts();
  cache.set('products', { data, timestamp: Date.now() });
  return data;
}
```

## Next Steps

1. Set up your backend API with required endpoints
2. Install required packages
3. Update configuration with your API base URL
4. Implement secure token storage
5. Test each endpoint in isolation
6. Integrate with screens one by one
7. Implement error handling and loading states
8. Add offline support with local storage
