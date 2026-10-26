import React from 'react';
import { View, Platform } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { NavigationContainer } from '@react-navigation/native';
import { RootNavigator } from './src/navigation/RootNavigator';
import { Colors } from './src/theme/colors';

export default function App() {
  const isWeb = Platform.OS === 'web';

  return (
    <SafeAreaProvider style={{ backgroundColor: isWeb ? '#05070A' : Colors.background }}>
      <View
        style={{
          flex: 1,
          backgroundColor: isWeb ? '#05070A' : Colors.background,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <View
          style={{
            flex: 1,
            width: '100%',
            maxWidth: isWeb ? 480 : undefined,
            backgroundColor: Colors.background,
            borderLeftWidth: isWeb ? 1 : 0,
            borderRightWidth: isWeb ? 1 : 0,
            borderColor: Colors.border,
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOffset: { width: 0, height: 8 },
            shadowOpacity: 0.6,
            shadowRadius: 24,
          }}
        >
          <NavigationContainer
            theme={{
              dark: true,
              colors: {
                primary: Colors.primary,
                background: Colors.background,
                card: Colors.surface,
                text: Colors.textPrimary,
                border: Colors.border,
                notification: Colors.fire,
              },
              fonts: {
                regular: { fontFamily: 'System', fontWeight: '400' },
                medium: { fontFamily: 'System', fontWeight: '600' },
                bold: { fontFamily: 'System', fontWeight: '700' },
                heavy: { fontFamily: 'System', fontWeight: '900' },
              },
            }}
          >
            <StatusBar style="light" />
            <RootNavigator />
          </NavigationContainer>
        </View>
      </View>
    </SafeAreaProvider>
  );
}
