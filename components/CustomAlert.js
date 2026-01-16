import React from 'react';
import { Modal, View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const CustomAlert = ({ visible, title, message, onConfirm, onCancel, confirmText = 'Confirm', cancelText = 'Cancel', type = 'default' }) => {
    return (
        <Modal
            visible={visible}
            transparent
            animationType="fade"
            onRequestClose={onCancel}
        >
            <View style={styles.overlay}>
                <View style={styles.alertBox}>
                    <Text style={styles.title}>{title}</Text>
                    <Text style={styles.message}>{message}</Text>

                    <View style={styles.buttonContainer}>
                        {onCancel && (
                            <TouchableOpacity style={styles.buttonSecondary} onPress={onCancel}>
                                <Text style={styles.buttonTextSecondary}>{cancelText}</Text>
                            </TouchableOpacity>
                        )}

                        <TouchableOpacity
                            style={[
                                styles.buttonPrimary,
                                type === 'destructive' ? { backgroundColor: '#EB5757' } : { backgroundColor: '#2F80ED' }
                            ]}
                            onPress={onConfirm}
                        >
                            <Text style={styles.buttonTextPrimary}>{confirmText}</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    alertBox: {
        width: width * 0.85,
        backgroundColor: '#111A2E',
        borderRadius: 20,
        padding: 24,
        borderWidth: 1,
        borderColor: '#1C2740',
        elevation: 10,
    },
    title: {
        color: '#FFFFFF',
        fontSize: 20,
        fontWeight: '800',
        marginBottom: 12,
    },
    message: {
        color: '#B0B8D1',
        fontSize: 16,
        lineHeight: 24,
        marginBottom: 24,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    buttonPrimary: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
        marginLeft: 12,
    },
    buttonSecondary: {
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 12,
    },
    buttonTextPrimary: {
        color: '#FFFFFF',
        fontWeight: '700',
        fontSize: 15,
    },
    buttonTextSecondary: {
        color: '#8A94B8',
        fontWeight: '600',
        fontSize: 15,
    },
});

export default CustomAlert;
