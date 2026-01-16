import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    StyleSheet,
    ActivityIndicator,
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from 'react-native';
import { loginUser } from '../services/api';
import { saveToken } from '../utils/storage';

export default function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateInputs = () => {
        const newErrors = {};

        if (!username.trim()) {
            newErrors.username = 'Username is required';
        }

        if (!password.trim()) {
            newErrors.password = 'Password is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleLogin = async () => {
        setErrors({});

        if (!validateInputs()) {
            return;
        }

        setLoading(true);
        const result = await loginUser(username, password);
        setLoading(false);

        if (result.success) {
            await saveToken(result.data.accessToken);
            navigation.replace('MainTabs');
        } else {
            Alert.alert('Login Failed', result.message);
        }
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.container}
        >
            <ScrollView
                contentContainerStyle={styles.scrollContainer}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <View style={styles.iconCircle}>
                        <Text style={styles.headerIcon}>🔐</Text>
                    </View>
                    <Text style={styles.title}>Welcome Back</Text>
                    <Text style={styles.subtitle}>Sign in to continue</Text>
                </View>

                <View style={styles.form}>
                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Username</Text>
                        <TextInput
                            style={[styles.input, errors.username && styles.inputError]}
                            placeholder="Enter your username"
                            placeholderTextColor="#8A94B8"
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        {errors.username && (
                            <Text style={styles.errorText}>{errors.username}</Text>
                        )}
                    </View>

                    <View style={styles.inputContainer}>
                        <Text style={styles.label}>Password</Text>
                        <TextInput
                            style={[styles.input, errors.password && styles.inputError]}
                            placeholder="Enter your password"
                            placeholderTextColor="#8A94B8"
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                            editable={!loading}
                        />
                        {errors.password && (
                            <Text style={styles.errorText}>{errors.password}</Text>
                        )}
                    </View>

                    <View style={styles.infoCard}>
                        <Text style={styles.infoTitle}>Test Credentials</Text>
                        <Text style={styles.infoText}>Username: emilys</Text>
                        <Text style={styles.infoText}>Password: emilyspass</Text>
                    </View>

                    <TouchableOpacity
                        style={[styles.button, loading && styles.buttonDisabled]}
                        onPress={handleLogin}
                        disabled={loading}
                    >
                        {loading ? (
                            <ActivityIndicator color="#FFFFFF" />
                        ) : (
                            <Text style={styles.buttonText}>Sign In</Text>
                        )}
                    </TouchableOpacity>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#0B1220',
    },
    scrollContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        padding: 20,
    },
    header: {
        alignItems: 'center',
        marginBottom: 40,
    },
    iconCircle: {
        width: 80,
        height: 80,
        borderRadius: 40,
        backgroundColor: '#111A2E',
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 20,
        borderWidth: 2,
        borderColor: '#1C2740',
    },
    headerIcon: {
        fontSize: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 15,
        color: '#B0B8D1',
    },
    form: {
        width: '100%',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        fontWeight: '600',
        color: '#B0B8D1',
        marginBottom: 8,
    },
    input: {
        backgroundColor: '#111A2E',
        borderWidth: 1,
        borderColor: '#1C2740',
        borderRadius: 12,
        padding: 16,
        fontSize: 16,
        color: '#FFFFFF',
    },
    inputError: {
        borderColor: '#EB5757',
    },
    errorText: {
        color: '#EB5757',
        fontSize: 13,
        marginTop: 6,
    },
    infoCard: {
        backgroundColor: '#111A2E',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
        borderWidth: 1,
        borderColor: '#1C2740',
    },
    infoTitle: {
        fontSize: 14,
        color: '#56CCF2',
        fontWeight: '600',
        marginBottom: 8,
    },
    infoText: {
        fontSize: 13,
        color: '#B0B8D1',
        marginBottom: 4,
    },
    button: {
        backgroundColor: '#2F80ED',
        padding: 16,
        borderRadius: 12,
        alignItems: 'center',
        shadowColor: '#2F80ED',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.3,
        shadowRadius: 8,
        elevation: 4,
    },
    buttonDisabled: {
        backgroundColor: '#1C2740',
        shadowOpacity: 0,
        elevation: 0,
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '700',
    },
});
