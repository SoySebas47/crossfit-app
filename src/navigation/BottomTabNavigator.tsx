import React from 'react';
import { StyleSheet, Platform } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {
  Flame,
  Dumbbell,
  History,
  Timer,
  BookOpen,
  Home,
} from 'lucide-react-native';
import { BottomTabParamList } from './types';
import { Colors } from '../theme/colors';
import { HomeScreen } from '../screens/HomeScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { HistoryScreen } from '../screens/HistoryScreen';
import { RestScreen } from '../screens/RestScreen';
import { ExercisesScreen } from '../screens/ExercisesScreen';

const Tab = createBottomTabNavigator<BottomTabParamList>();

export const BottomTabNavigator: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Inicio"
      screenOptions={{
        headerShown: false,
        tabBarStyle: styles.tabBar,
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textMuted,
        tabBarLabelStyle: styles.tabBarLabel,
        tabBarItemStyle: [
          styles.tabBarItem,
          Platform.OS === 'web' ? ({ cursor: 'pointer' } as any) : undefined,
        ],
      }}
    >
      <Tab.Screen
        name="Inicio"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Inicio',
          tabBarIcon: ({ color, size, focused }) => (
            <Home size={size || 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Entrenar"
        component={WorkoutScreen}
        options={{
          tabBarLabel: 'Entrenar',
          tabBarIcon: ({ color, size, focused }) => (
            <Dumbbell size={size || 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Historial"
        component={HistoryScreen}
        options={{
          tabBarLabel: 'Historial',
          tabBarIcon: ({ color, size, focused }) => (
            <History size={size || 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Descanso"
        component={RestScreen}
        options={{
          tabBarLabel: 'Descanso',
          tabBarIcon: ({ color, size, focused }) => (
            <Timer size={size || 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />

      <Tab.Screen
        name="Ejercicios"
        component={ExercisesScreen}
        options={{
          tabBarLabel: 'Ejercicios',
          tabBarIcon: ({ color, size, focused }) => (
            <BookOpen size={size || 22} color={color} strokeWidth={focused ? 2.5 : 2} />
          ),
        }}
      />
    </Tab.Navigator>
  );
};

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.tabBar,
    borderTopColor: Colors.tabBarBorder,
    borderTopWidth: 1,
    height: 64,
    paddingBottom: 8,
    paddingTop: 8,
  },
  tabBarLabel: {
    fontSize: 11,
    fontWeight: '700',
    marginTop: 2,
  },
  tabBarItem: {
    paddingVertical: 2,
  },
});
