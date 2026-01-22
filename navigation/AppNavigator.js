import React from 'react';
import { NavigationContainer, DefaultTheme } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
/* Importing the React App Screens*/
import SplashScreen from '../screens/SplashScreen';
import LoginScreen from '../screens/LoginScreen';
import DashboardScreen from '../screens/DashboardScreen';
import ProfileScreen from '../screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const ProfessionalTheme = {
    ...DefaultTheme,
    colors: {
        ...DefaultTheme.colors,
        primary: '#2F80ED',
        background: '#0B1220',
        card: '#111A2E',
        text: '#FFFFFF',
        border: '#1C2740',
        notification: '#2F80ED',
    },
};

function MainTabs() {
    return (
        <Tab.Navigator
            screenOptions={({ route }) => ({
                tabBarActiveTintColor: '#2F80ED',
                tabBarInactiveTintColor: '#8A94B8',
                tabBarStyle: {
                    backgroundColor: '#111A2E',
                    borderTopWidth: 1,
                    borderTopColor: '#1C2740',
                    height: 65,
                    paddingBottom: 10,
                    paddingTop: 10,
                },
                tabBarLabelStyle: {
                    fontSize: 12,
                    fontWeight: '700',
                },
                headerStyle: {
                    backgroundColor: '#111A2E',
                    borderBottomWidth: 1,
                    borderBottomColor: '#1C2740',
                    elevation: 0,
                    shadowOpacity: 0,
                },
                headerTintColor: '#FFFFFF',
                headerTitleStyle: {
                    fontWeight: '800',
                    fontSize: 20,
                    letterSpacing: 0.5,
                },
                tabBarIcon: ({ focused, color, size }) => {
                    let iconName;
                    if (route.name === 'Dashboard') {
                        iconName = focused ? 'grid' : 'grid-outline';
                    } else if (route.name === 'Profile') {
                        iconName = focused ? 'person' : 'person-outline';
                    }
                    return <Ionicons name={iconName} size={size} color={color} />;
                },
            })}
        >
            <Tab.Screen
                name="Dashboard"
                component={DashboardScreen}
                options={{
                    headerTitle: 'Dashboard',
                }}
            />
            <Tab.Screen
                name="Profile"
                component={ProfileScreen}
                options={{
                    headerTitle: 'Profile',
                }}
            />
        </Tab.Navigator>
    );
}

export default function AppNavigator() {
    return (
        <NavigationContainer theme={ProfessionalTheme}>
            <Stack.Navigator
                screenOptions={{
                    headerShown: false,
                    contentStyle: { backgroundColor: '#0B1220' },
                }}
            >
                <Stack.Screen name="Splash" component={SplashScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="MainTabs" component={MainTabs} />
            </Stack.Navigator>
        </NavigationContainer>
    );
}
