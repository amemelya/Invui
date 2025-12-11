import { Stack } from 'expo-router';

export default function MainLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        animationEnabled: true,
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="process" />
      <Stack.Screen name="machine" />
      <Stack.Screen name="production" />
    </Stack>
  );
}
