import React from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider } from '../context/AuthContext';
import { ListingsProvider } from '../context/ListingsContext';
import { CartProvider } from '../context/CartContext';
import { OrdersProvider } from '../context/OrdersContext';
import { QuotesProvider } from '../context/QuotesContext';
import { Colors } from '../constants/theme';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <ListingsProvider>
          <CartProvider>
            <OrdersProvider>
              <QuotesProvider>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: Colors.background },
                    animation: 'fade',
                  }}
                >
                  <Stack.Screen name="index" />
                  <Stack.Screen name="role-select" />
                  <Stack.Screen name="auth/login" />
                  <Stack.Screen name="auth/register" />
                  <Stack.Screen name="(farmer)" />
                  <Stack.Screen name="(buyer)" />
                  <Stack.Screen
                    name="notifications"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom',
                    }}
                  />
                  <Stack.Screen
                    name="modals/filter-sheet"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom',
                    }}
                  />
                  <Stack.Screen
                    name="(buyer)/quote-request"
                    options={{
                      presentation: 'modal',
                      animation: 'slide_from_bottom',
                    }}
                  />
                  <Stack.Screen
                    name="(buyer)/order-success"
                    options={{
                      animation: 'fade',
                    }}
                  />
                </Stack>
              </QuotesProvider>
            </OrdersProvider>
          </CartProvider>
        </ListingsProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
