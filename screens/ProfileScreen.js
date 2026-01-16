import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    ActivityIndicator,
    Alert,
    ScrollView,
    Modal,
    Dimensions,
    Animated,
    RefreshControl,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile } from '../services/api';
import { getToken, removeToken } from '../utils/storage';
import { CommonActions } from '@react-navigation/native';

import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');

const SkeletonProfile = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.6, duration: 1000, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 1000, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={{ opacity, padding: 20 }}>
            <View style={styles.skeletonHeader} />
            <View style={styles.skeletonCard} />
            <View style={styles.skeletonCard} />
        </Animated.View>
    );
};

export default function ProfileScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [userProfile, setUserProfile] = useState(null);
    const [imageModalVisible, setImageModalVisible] = useState(false);
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    useEffect(() => {
        fetchProfile();
        setupHeader();
    }, [userProfile]);

    const setupHeader = () => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={handleLogout} style={styles.headerLogout}>
                    <Ionicons name="log-out-outline" size={24} color="#EB5757" />
                </TouchableOpacity>
            ),
        });
    };

    const fetchProfile = async () => {
        const token = await getToken();
        if (!token) {
            navigation.replace('Login');
            return;
        }
        const result = await getUserProfile(token);
        if (result.success) setUserProfile(result.data);
        setLoading(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchProfile();
        setRefreshing(false);
    };

    const handleLogout = () => {
        setLogoutAlertVisible(true);
    };

    const confirmLogout = async () => {
        setLogoutAlertVisible(false);
        await removeToken();
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    };

    if (loading) return <View style={styles.mainContainer}><SkeletonProfile /></View>;

    return (
        <View style={styles.mainContainer}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F80ED" />}
            >
                <View style={styles.profileHeader}>
                    <TouchableOpacity activeOpacity={0.8} onPress={() => setImageModalVisible(true)}>
                        <LinearGradientBorder>
                            <Image source={{ uri: userProfile?.image }} style={styles.profileImage} />
                        </LinearGradientBorder>
                    </TouchableOpacity>
                    <Text style={styles.nameText}>{userProfile?.firstName} {userProfile?.lastName}</Text>
                    <Text style={styles.roleTag}>{userProfile?.role?.toUpperCase() || 'EXECUTIVE'}</Text>

                    <View style={styles.statsRow}>
                        <View style={styles.statBox}>
                            <Text style={styles.statNum}>{userProfile?.age}</Text>
                            <Text style={styles.statLabel}>Age</Text>
                        </View>
                        <View style={[styles.statBox, styles.statDivider]}>
                            <Text style={styles.statNum}>{userProfile?.bloodGroup}</Text>
                            <Text style={styles.statLabel}>Group</Text>
                        </View>
                        <View style={styles.statBox}>
                            <Text style={styles.statNum}>{userProfile?.gender[0].toUpperCase()}</Text>
                            <Text style={styles.statLabel}>Sex</Text>
                        </View>
                    </View>
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Contact Directory</Text>
                    <InfoItem icon="mail-outline" label="Official Email" value={userProfile?.email} color="#2F80ED" />
                    <InfoItem icon="call-outline" label="Mobile Connection" value={userProfile?.phone} color="#27AE60" />
                    <InfoItem icon="calendar-outline" label="Anniversary" value={userProfile?.birthDate} color="#56CCF2" />
                </View>

                <View style={styles.infoSection}>
                    <Text style={styles.sectionTitle}>Physical Attributes</Text>
                    <InfoItem icon="eye-outline" label="Eye Condition" value={userProfile?.eyeColor} color="#9B51E0" />
                    <InfoItem icon="body-outline" label="Height" value={`${userProfile?.height} cm`} color="#F2994A" />
                    <InfoItem icon="fitness-outline" label="Weight" value={`${userProfile?.weight} kg`} color="#EB5757" />
                </View>
            </ScrollView>

            {/* Custom Logout Alert */}
            <CustomAlert
                visible={logoutAlertVisible}
                title="Sign Out"
                message="Are you sure you want to log out from the application?"
                confirmText="Logout"
                cancelText="Cancel"
                type="destructive"
                onConfirm={confirmLogout}
                onCancel={() => setLogoutAlertVisible(false)}
            />

            {/* Full Screen Image Modal */}
            <Modal visible={imageModalVisible} transparent animationType="fade" onRequestClose={() => setImageModalVisible(false)}>
                <View style={styles.fullImageContainer}>
                    <TouchableOpacity style={styles.closeImage} onPress={() => setImageModalVisible(false)}>
                        <Ionicons name="close" size={32} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Image source={{ uri: userProfile?.image }} style={styles.fullscreenImage} resizeMode="contain" />
                </View>
            </Modal>
        </View>
    );
}

const InfoItem = ({ icon, label, value, color }) => (
    <View style={styles.infoItem}>
        <View style={[styles.iconBox, { backgroundColor: color + '15' }]}>
            <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.itemContent}>
            <Text style={styles.itemLabel}>{label}</Text>
            <Text style={styles.itemValue}>{value}</Text>
        </View>
    </View>
);


const LinearGradientBorder = ({ children }) => (
    <View style={styles.imageBorder}>
        {children}
    </View>
);

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#0B1220' },
    scrollContent: { paddingBottom: 40 },
    headerLogout: { marginRight: 15 },

    profileHeader: { alignItems: 'center', paddingTop: 30, paddingBottom: 20 },
    imageBorder: { padding: 4, borderRadius: 60, backgroundColor: '#2F80ED' },
    profileImage: { width: 110, height: 110, borderRadius: 55, borderWidth: 4, borderColor: '#0B1220' },
    nameText: { color: '#FFFFFF', fontSize: 24, fontWeight: '800', marginTop: 15 },
    roleTag: { color: '#2F80ED', fontSize: 12, fontWeight: '700', letterSpacing: 1, marginTop: 5 },

    statsRow: { flexDirection: 'row', backgroundColor: '#111A2E', borderRadius: 20, marginTop: 25, paddingVertical: 15, width: width * 0.85, borderWidth: 1, borderColor: '#1C2740' },
    statBox: { flex: 1, alignItems: 'center' },
    statDivider: { borderLeftWidth: 1, borderRightWidth: 1, borderColor: '#1C2740' },
    statNum: { color: '#FFFFFF', fontSize: 18, fontWeight: '800' },
    statLabel: { color: '#8A94B8', fontSize: 11, marginTop: 2 },

    infoSection: { marginTop: 25, paddingHorizontal: 20 },
    sectionTitle: { color: '#8A94B8', fontSize: 13, fontWeight: '700', marginBottom: 15, textTransform: 'uppercase' },
    infoItem: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#111A2E', padding: 16, borderRadius: 16, marginBottom: 12, borderWidth: 1, borderColor: '#1C2740' },
    iconBox: { width: 44, height: 44, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginRight: 15 },
    itemContent: { flex: 1 },
    itemLabel: { color: '#8A94B8', fontSize: 12 },
    itemValue: { color: '#FFFFFF', fontSize: 16, fontWeight: '600', marginTop: 2 },

    // Modals
    fullImageContainer: { flex: 1, backgroundColor: '#000000', justifyContent: 'center', alignItems: 'center' },
    fullscreenImage: { width: width, height: width },
    closeImage: { position: 'absolute', top: 50, right: 20, zIndex: 10 },

    skeletonHeader: { width: 100, height: 100, borderRadius: 50, backgroundColor: '#111A2E', alignSelf: 'center', marginBottom: 20 },
    skeletonCard: { width: '100%', height: 80, borderRadius: 16, backgroundColor: '#111A2E', marginBottom: 15 },
});
