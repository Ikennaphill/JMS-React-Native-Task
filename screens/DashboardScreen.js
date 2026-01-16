import React, { useState, useEffect, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    Image,
    ActivityIndicator,
    RefreshControl,
    TouchableOpacity,
    Modal,
    Dimensions,
    Animated,
    ScrollView,
    Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getUserProfile, getProducts } from '../services/api';
import { getToken, removeToken } from '../utils/storage';
import { CommonActions } from '@react-navigation/native';

import CustomAlert from '../components/CustomAlert';

const { width, height } = Dimensions.get('window');

// --- Skeleton Component ---
const SkeletonItem = () => {
    const opacity = useRef(new Animated.Value(0.3)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(opacity, { toValue: 0.7, duration: 800, useNativeDriver: true }),
                Animated.timing(opacity, { toValue: 0.3, duration: 800, useNativeDriver: true }),
            ])
        ).start();
    }, []);

    return (
        <Animated.View style={[styles.skeletonCard, { opacity }]}>
            <View style={styles.skeletonImage} />
            <View style={styles.skeletonTextLarge} />
            <View style={styles.skeletonTextSmall} />
        </Animated.View>
    );
};

export default function DashboardScreen({ navigation }) {
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    const [userProfile, setUserProfile] = useState(null);
    const [products, setProducts] = useState([]);
    const [skip, setSkip] = useState(0);
    const [hasMore, setHasMore] = useState(true);

    // States for Modals
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [detailModalVisible, setDetailModalVisible] = useState(false);
    const [profilePopoverVisible, setProfilePopoverVisible] = useState(false);
    const [logoutAlertVisible, setLogoutAlertVisible] = useState(false);

    const [stats, setStats] = useState({
        totalProducts: 0,
        totalCategories: 0,
        averagePrice: 0,
    });

    useEffect(() => {
        fetchData();
        setupHeader();
    }, [userProfile]);

    const setupHeader = () => {
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity
                    onPress={() => setProfilePopoverVisible(true)}
                    style={styles.headerProfileButton}
                >
                    {userProfile?.image ? (
                        <Image source={{ uri: userProfile.image }} style={styles.headerProfileImage} />
                    ) : (
                        <Ionicons name="person-circle-outline" size={32} color="#2F80ED" />
                    )}
                </TouchableOpacity>
            ),
        });
    };

    const fetchData = async () => {
        const token = await getToken();
        if (!token) {
            navigation.replace('Login');
            return;
        }

        const [profileRes, productsRes] = await Promise.all([
            getUserProfile(token),
            getProducts(0, 10)
        ]);

        if (profileRes.success) setUserProfile(profileRes.data);
        if (productsRes.success) {
            setProducts(productsRes.data.products);
            setSkip(10);
            setHasMore(productsRes.data.products.length < productsRes.data.total);
            calculateStats(productsRes.data.products, productsRes.data.total);
        }
        setLoading(false);
    };

    const calculateStats = (productList, total) => {
        const categories = [...new Set(productList.map(p => p.category))];
        const avgPrice = productList.length > 0 ? productList.reduce((s, p) => s + p.price, 0) / productList.length : 0;
        setStats({ totalProducts: total, totalCategories: categories.length, averagePrice: avgPrice.toFixed(2) });
    };

    const loadMoreProducts = async () => {
        if (loadingMore || !hasMore) return;
        setLoadingMore(true);
        const result = await getProducts(skip, 10);
        if (result.success) {
            setProducts([...products, ...result.data.products]);
            setSkip(skip + 10);
            setHasMore(products.length + result.data.products.length < result.data.total);
        }
        setLoadingMore(false);
    };

    const onRefresh = async () => {
        setRefreshing(true);
        setSkip(0);
        await fetchData();
        setRefreshing(false);
    };

    const handleLogout = async () => {
        setProfilePopoverVisible(false);
        setLogoutAlertVisible(true);
    };

    const confirmLogout = async () => {
        setLogoutAlertVisible(false);
        await removeToken();
        navigation.dispatch(CommonActions.reset({ index: 0, routes: [{ name: 'Login' }] }));
    };

    const renderProduct = ({ item }) => (
        <TouchableOpacity
            style={styles.productCard}
            activeOpacity={0.9}
            onPress={() => {
                setSelectedProduct(item);
                setDetailModalVisible(true);
            }}
        >
            <Image source={{ uri: item.thumbnail }} style={styles.productImage} />
            <View style={styles.productContent}>
                <View style={styles.categoryBadge}>
                    <Text style={styles.categoryText}>{item.category.toUpperCase()}</Text>
                </View>
                <Text style={styles.productTitle} numberOfLines={1}>{item.title}</Text>
                <View style={styles.productPriceRow}>
                    <Text style={styles.productPrice}>${item.price}</Text>
                    <View style={styles.ratingBox}>
                        <Ionicons name="star" size={14} color="#FFD700" />
                        <Text style={styles.ratingText}>{item.rating}</Text>
                    </View>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <View style={styles.mainContainer}>
            <FlatList
                data={loading ? [1, 2, 3, 4] : products}
                renderItem={loading ? () => <SkeletonItem /> : renderProduct}
                keyExtractor={(item, index) => loading ? index.toString() : item.id.toString()}
                numColumns={2}
                contentContainerStyle={styles.listContainer}
                columnWrapperStyle={styles.columnWrapper}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#2F80ED" />}
                onEndReached={loadMoreProducts}
                ListHeaderComponent={
                    <View>
                        <View style={styles.statsScroll}>
                            <View style={[styles.statItem, { backgroundColor: '#2F80ED20' }]}>
                                <Ionicons name="cube" size={24} color="#2F80ED" />
                                <Text style={styles.statVal}>{stats.totalProducts}</Text>
                                <Text style={styles.statLab}>Volumes</Text>
                            </View>
                            <View style={[styles.statItem, { backgroundColor: '#27AE6020' }]}>
                                <Ionicons name="pricetag" size={24} color="#27AE60" />
                                <Text style={styles.statVal}>{stats.totalCategories}</Text>
                                <Text style={styles.statLab}>Tags</Text>
                            </View>
                            <View style={[styles.statItem, { backgroundColor: '#56CCF220' }]}>
                                <Ionicons name="cash" size={24} color="#56CCF2" />
                                <Text style={styles.statVal}>${stats.averagePrice}</Text>
                                <Text style={styles.statLab}>Avg. Val</Text>
                            </View>
                        </View>
                    </View>
                }
            />

            {/* --- Profile Popover Modal --- */}
            <Modal visible={profilePopoverVisible} transparent animationType="fade" onRequestClose={() => setProfilePopoverVisible(false)}>
                <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setProfilePopoverVisible(false)}>
                    <View style={styles.popoverContent}>
                        <View style={styles.popoverHeader}>
                            <Image source={{ uri: userProfile?.image }} style={styles.popoverImage} />
                            <View style={{ flex: 1 }}>
                                <Text style={styles.popoverName} numberOfLines={1}>{userProfile?.firstName} {userProfile?.lastName}</Text>
                                <Text style={styles.popoverEmail} numberOfLines={1}>{userProfile?.email}</Text>
                            </View>
                        </View>
                        <TouchableOpacity style={styles.popoverAction} onPress={handleLogout}>
                            <Ionicons name="log-out-outline" size={20} color="#EB5757" />
                            <Text style={styles.popoverActionText}>Sign Out</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableOpacity>
            </Modal>

            {/* --- Custom Logout Alert --- */}
            <CustomAlert
                visible={logoutAlertVisible}
                title="Logout"
                message="Are you sure you want to sign out from your account?"
                confirmText="Logout"
                cancelText="Cancel"
                type="destructive"
                onConfirm={confirmLogout}
                onCancel={() => setLogoutAlertVisible(false)}
            />

            {/* --- Half-Modal Product Details --- */}
            <Modal visible={detailModalVisible} transparent animationType="slide" onRequestClose={() => setDetailModalVisible(false)}>
                <View style={styles.modalOverlay}>
                    <TouchableOpacity style={{ flex: 1 }} onPress={() => setDetailModalVisible(false)} />
                    <View style={styles.halfModal}>
                        <View style={styles.modalHandle} />
                        <ScrollView showsVerticalScrollIndicator={false}>
                            <Image source={{ uri: selectedProduct?.images[0] }} style={styles.modalHeroImage} />
                            <Text style={styles.modalTitle}>{selectedProduct?.title}</Text>
                            <Text style={styles.modalBrand}>{selectedProduct?.brand || 'Premium Brand'}</Text>
                            <View style={styles.modalPriceRow}>
                                <Text style={styles.modalPrice}>${selectedProduct?.price}</Text>
                                <View style={styles.modalRating}>
                                    <Ionicons name="star" size={18} color="#FFD700" />
                                    <Text style={styles.modalRatingText}>{selectedProduct?.rating}</Text>
                                </View>
                            </View>
                            <Text style={styles.modalDescHeader}>Description</Text>
                            <Text style={styles.modalDesc}>{selectedProduct?.description}</Text>
                            <TouchableOpacity style={styles.buyButton} onPress={() => setDetailModalVisible(false)}>
                                <Text style={styles.buyButtonText}>Add to Workspace</Text>
                            </TouchableOpacity>
                        </ScrollView>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    mainContainer: { flex: 1, backgroundColor: '#0B1220' },
    listContainer: { padding: 16 },
    columnWrapper: { justifyContent: 'space-between' },
    headerProfileButton: { marginRight: 15 },
    headerProfileImage: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#2F80ED' },

    // Stats
    statsScroll: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20 },
    statItem: { flex: 1, marginHorizontal: 5, padding: 15, borderRadius: 16, alignItems: 'center' },
    statVal: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 8 },
    statLab: { color: '#8A94B8', fontSize: 12 },

    productCard: { backgroundColor: '#111A2E', borderRadius: 16, width: (width - 48) / 2, marginBottom: 16, overflow: 'hidden', borderWidth: 1, borderColor: '#1C2740' },
    productImage: { width: '100%', height: 140, backgroundColor: '#1C2740' },
    productContent: { padding: 12 },
    categoryBadge: { backgroundColor: '#2F80ED20', paddingHorizontal: 6, paddingVertical: 2, borderRadius: 4, alignSelf: 'flex-start', marginBottom: 6 },
    categoryText: { color: '#2F80ED', fontSize: 10, fontWeight: '700' },
    productTitle: { color: '#FFFFFF', fontSize: 14, fontWeight: '600', marginBottom: 8 },
    productPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
    productPrice: { color: '#27AE60', fontSize: 16, fontWeight: '700' },
    ratingBox: { flexDirection: 'row', alignItems: 'center' },
    ratingText: { color: '#56CCF2', fontSize: 12, marginLeft: 4 },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' },
    popoverContent: { position: 'absolute', top: 60, right: 16, backgroundColor: '#111A2E', borderRadius: 16, padding: 16, width: 250, borderWidth: 1, borderColor: '#1C2740', elevation: 10 },
    popoverHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
    popoverImage: { width: 44, height: 44, borderRadius: 22, marginRight: 12 },
    popoverName: { color: '#FFFFFF', fontSize: 15, fontWeight: '700', marginBottom: 2 },
    popoverEmail: { color: '#8A94B8', fontSize: 12 },
    popoverAction: { flexDirection: 'row', alignItems: 'center', borderTopWidth: 1, borderTopColor: '#1C2740', paddingTop: 12 },
    popoverActionText: { color: '#EB5757', marginLeft: 10, fontWeight: '600' },

    halfModal: { backgroundColor: '#111A2E', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: height * 0.7, borderWidth: 1, borderColor: '#1C2740' },
    modalHandle: { width: 40, height: 5, backgroundColor: '#1C2740', borderRadius: 3, alignSelf: 'center', marginBottom: 20 },
    modalHeroImage: { width: '100%', height: 250, borderRadius: 20, marginBottom: 20 },
    modalTitle: { color: '#FFFFFF', fontSize: 24, fontWeight: '800' },
    modalBrand: { color: '#2F80ED', fontSize: 14, marginVertical: 4 },
    modalPriceRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginVertical: 15 },
    modalPrice: { color: '#27AE60', fontSize: 28, fontWeight: '800' },
    modalRating: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#1C2740', padding: 8, borderRadius: 10 },
    modalRatingText: { color: '#FFFFFF', marginLeft: 6, fontWeight: '700' },
    modalDescHeader: { color: '#FFFFFF', fontSize: 18, fontWeight: '700', marginTop: 10 },
    modalDesc: { color: '#B0B8D1', fontSize: 15, lineHeight: 22, marginTop: 8 },
    buyButton: { backgroundColor: '#2F80ED', padding: 18, borderRadius: 16, alignItems: 'center', marginTop: 30 },
    buyButtonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '700' },

    skeletonCard: { backgroundColor: '#111A2E', borderRadius: 16, width: (width - 48) / 2, marginBottom: 16, height: 220, padding: 12 },
    skeletonImage: { width: '100%', height: 120, backgroundColor: '#1C2740', borderRadius: 12 },
    skeletonTextLarge: { width: '80%', height: 15, backgroundColor: '#1C2740', borderRadius: 7, marginTop: 15 },
    skeletonTextSmall: { width: '50%', height: 12, backgroundColor: '#1C2740', borderRadius: 6, marginTop: 10 },
});
