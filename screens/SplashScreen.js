import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { getToken } from '../utils/storage';

export default function SplashScreen({ navigation }) {
    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        setTimeout(async () => {
            const token = await getToken();

            if (token) {
                navigation.replace('MainTabs');
            } else {
                navigation.replace('Login');
            }
        }, 2000);
    };

    return (
        <View style={styles.container}>
            <View style={styles.logoContainer}>
                <View style={styles.iconCircle}>
                    <Text style={styles.logoIcon}>📊</Text>
                </View>
                <Text style={styles.appName}>JMS Task Manager</Text>
                <Text style={styles.tagline}>Professional Dashboard Solution</Text>
            </View>

            <ActivityIndicator size="large" color="#2F80ED" style={styles.loader} />
            <Text style={styles.loadingText}>Loading your workspace...</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1220',
        justifyContent: 'center',
        alignItems: 'center',
    },
    logoContainer: {
        alignItems: 'center',
        marginBottom: 60,
    },
    iconCircle: {
        width: 100,
        height: 100,
        borderRadius: 50,
        backgroundColor: '#111A2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 24,
        borderWidth: 2,
        borderColor: '#1C2740',
    },
    logoIcon: {
        fontSize: 50,
    },
    appName: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
        letterSpacing: 0.5,
    },
    tagline: {
        fontSize: 15,
        color: '#8A94B8',
    },
    loader: {
        marginTop: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 14,
        color: '#B0B8D1',
    },
});
