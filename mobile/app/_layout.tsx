import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';
import Toast from "react-native-toast-message";

import { useColorScheme } from '@/hooks/use-color-scheme';

export const unstable_settings = {
  anchor: '(tabs)',
};

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
   <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>

  <Stack>

    <Stack.Screen
      name="splash"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="(tabs)"
      options={{ headerShown: false }}
    />
    <Stack.Screen
      name="admin"
      options={{
      headerShown: false,
      }}
/>
    <Stack.Screen
      name="login"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="register"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="staff-login"
      options={{ headerShown: false }}
    />

    <Stack.Screen
      name="modal"
      options={{
        presentation: "modal",
        title: "Modal",
      }}
    />
    <Stack.Screen
  name="staff/cashier"
  options={{
    headerShown: false,
  }}
/>
    <Stack.Screen
  name="forgot-password"
  options={{
    headerShown: false,
  }}
/>
<Stack.Screen
  name="scanner"
  options={{
    headerShown: false,
  }}
/>

  </Stack>

  <StatusBar style="auto" />

  <Toast />

</ThemeProvider>
  );
}