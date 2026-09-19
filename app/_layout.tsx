import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { QueryClientProvider } from '@tanstack/react-query';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Wordmark } from '@/components/brand/Wordmark';
import { ToastHost } from '@/components/feedback/ToastHost';
import { useStoresHydrated } from '@/hooks/useHydration';
import { queryClient } from '@/lib/queryClient';
import { selectIsSignedIn, useAuthStore } from '@/store/authStore';
import { colors } from '@/theme';

export default function RootLayout() {
  const hydrated = useStoresHydrated();
  const isSignedIn = useAuthStore(selectIsSignedIn);

  return (
    <GestureHandlerRootView style={styles.root}>
      <SafeAreaProvider>
        <QueryClientProvider client={queryClient}>
          <StatusBar style="dark" />
          {hydrated ? (
            <Stack
              screenOptions={{
                headerShown: false,
                animation: 'slide_from_right',
                contentStyle: { backgroundColor: colors.background },
              }}
            >
              <Stack.Protected guard={isSignedIn}>
                <Stack.Screen name="(tabs)" options={{ animation: 'fade' }} />
                <Stack.Screen name="books/[id]" />
                <Stack.Screen name="cart" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="checkout" />
                <Stack.Screen
                  name="confirmation/[id]"
                  options={{ animation: 'fade', gestureEnabled: false }}
                />
                <Stack.Screen name="orders/[id]" />
                <Stack.Screen name="create-post" options={{ animation: 'slide_from_bottom' }} />
                <Stack.Screen name="clubs/[id]" />
                <Stack.Screen name="addresses" />
                <Stack.Screen name="payments" />
                <Stack.Screen name="notifications" />
                <Stack.Screen name="settings" />
              </Stack.Protected>
              <Stack.Protected guard={!isSignedIn}>
                <Stack.Screen name="(auth)" options={{ animation: 'fade' }} />
              </Stack.Protected>
            </Stack>
          ) : (
            <View style={styles.splash}>
              <Wordmark size="lg" />
            </View>
          )}
          <ToastHost />
        </QueryClientProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.background },
  splash: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
  },
});
