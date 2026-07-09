import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

import { AuthProvider } from '@/src/context/AuthContext';

export default function RootLayout() {

  const colorScheme = useColorScheme();

  return (
    <AuthProvider>

      <ThemeProvider
        value={colorScheme === 'dark'
          ? DarkTheme
          : DefaultTheme
        }
      >

        <Stack screenOptions={{ headerShown: false }}>

          <Stack.Screen name="(auth)" />

          <Stack.Screen name="(tabs)" />

          <Stack.Screen name="(role)" />

          <Stack.Screen name="(chat)/messages/[id]" />

          <Stack.Screen name="(admin)/panel" />

          <Stack.Screen
            name="modal"
            options={{ presentation: 'modal' }}
          />

        </Stack>

        <StatusBar style="auto" />

      </ThemeProvider>

    </AuthProvider>
  );
}