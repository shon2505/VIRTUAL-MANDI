import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useListings } from '../../context/ListingsContext';
import { useOrders } from '../../context/OrdersContext';
import { Header } from '../../components/common/Header';
import { RoleSwitcherBanner } from '../../components/common/RoleSwitcherBanner';
import { StatCard } from '../../components/common/StatCard';
import { FarmerListingCard } from '../../components/farmer/FarmerListingCard';
import { FarmerOrderCard } from '../../components/farmer/FarmerOrderCard';
import { MandiRateTicker } from '../../components/farmer/MandiRateTicker';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Ionicons } from '@expo/vector-icons';
import { EmptyState } from '../../components/common/EmptyState';

export default function FarmerDashboard() {
  const router = useRouter();
  const { farmerProfile } = useAuth();
  const { farmerListings, refreshListings, isLoading: listingsLoading, updateProduce } = useListings();
  const { farmerOrders, loadOrders, isLoading: ordersLoading, updateStatus } = useOrders();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await Promise.all([refreshListings(), loadOrders()]);
    setRefreshing(false);
  };

  const totalAvailableStockKg = farmerListings.reduce((sum, l) => sum + l.availableQuantity, 0);
  const activeListingsCount = farmerListings.filter(l => l.status === 'active').length;
  const pendingOrdersCount = farmerOrders.filter(o => o.status === 'new' || o.status === 'preparing').length;

  const handleToggleListingStatus = (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateProduce(id, { status: nextStatus });
  };

  return (
    <View style={styles.container}>
      <Header
        title={`Namaste, ${farmerProfile?.name || 'Ramesh'} 👋`}
        subtitle={farmerProfile?.farmName || 'Patil Agro Fresh Farms'}
        showRoleToggle={true}
        showNotification={true}
      />

      <RoleSwitcherBanner />
      <MandiRateTicker />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[Colors.primary]}
          />
        }
      >
        {/* Verification Status Card */}
        <View style={styles.verifiedCard}>
          <View style={styles.verifiedLeft}>
            <View style={styles.badgeRow}>
              <VerificationBadge label="Verified Farmer" size="md" />
              <View style={styles.hubBadge}>
                <Ionicons name="location" size={12} color={Colors.primaryDark} />
                <Text style={styles.hubText}>Lasalgaon Mandi Hub</Text>
              </View>
            </View>
            <Text style={styles.verifiedSub}>
              APMC direct settlement active • Rating: ⭐ 4.9 (112 reviews)
            </Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/(farmer)/add-produce')}
            style={styles.addProduceBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="add" size={18} color="#FFFFFF" />
            <Text style={styles.addProduceText}>Add Produce</Text>
          </TouchableOpacity>
        </View>

        {/* Overview Stats */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Overview</Text>
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/earnings')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>View Financials</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.statsGrid}>
          <View style={styles.statsRow}>
            <StatCard
              label="Monthly Sales"
              value="₹78,200"
              iconName="wallet-outline"
              iconColor={Colors.primary}
              trend={{ value: '+14%', isPositive: true }}
              onPress={() => router.push('/(farmer)/earnings')}
            />
            <StatCard
              label="Active Produce"
              value={activeListingsCount}
              iconName="leaf-outline"
              iconColor={Colors.primaryAccent}
              subtext="Ready for bulk bids"
              onPress={() => router.push('/(farmer)/listings')}
            />
          </View>

          <View style={styles.statsRow}>
            <StatCard
              label="Pending Orders"
              value={pendingOrdersCount}
              iconName="receipt-outline"
              iconColor={Colors.terracotta}
              subtext="Action required"
              accentColor={Colors.terracotta}
              onPress={() => router.push('/(farmer)/orders')}
            />
            <StatCard
              label="Available Stock"
              value={`${(totalAvailableStockKg / 1000).toFixed(1)} T`}
              iconName="cube-outline"
              iconColor={Colors.amber}
              subtext={`${totalAvailableStockKg.toLocaleString()} kg total`}
              onPress={() => router.push('/(farmer)/inventory')}
            />
          </View>
        </View>

        {/* Action Alert Banner if there are new orders */}
        {farmerOrders.some(o => o.status === 'new') && (
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/orders')}
            style={styles.alertBanner}
            activeOpacity={0.8}
          >
            <View style={styles.alertIcon}>
              <Ionicons name="alert-circle" size={20} color="#FFFFFF" />
            </View>
            <View style={styles.alertContent}>
              <Text style={styles.alertTitle}>New Bulk Procurement Order Received</Text>
              <Text style={styles.alertBody}>
                Apex Fresh Agro Retail placed 500 kg Tomato order (₹14,000).
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color={Colors.textPrimary} />
          </TouchableOpacity>
        )}

        {/* Recent Active Listings */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Your Listings</Text>
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/listings')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>See All ({farmerListings.length})</Text>
          </TouchableOpacity>
        </View>

        {farmerListings.length > 0 ? (
          farmerListings.slice(0, 3).map(listing => (
            <FarmerListingCard
              key={listing.id}
              listing={listing}
              onToggleStatus={() => handleToggleListingStatus(listing.id, listing.status)}
              onEdit={() => router.push('/(farmer)/add-produce')}
              onPress={() => router.push('/(farmer)/listings')}
            />
          ))
        ) : (
          <EmptyState
            emoji="🌾"
            title="Your Mandi is waiting."
            description="Add your first produce listing and start selling directly to businesses."
            actionTitle="+ Add Produce"
            onActionPress={() => router.push('/(farmer)/add-produce')}
          />
        )}

        {/* Pending Orders Section */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.md }]}>
          <Text style={styles.sectionTitle}>Recent Bulk Orders</Text>
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/orders')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>Manage Orders</Text>
          </TouchableOpacity>
        </View>

        {farmerOrders.slice(0, 2).map(order => (
          <FarmerOrderCard
            key={order.id}
            order={order}
            onPress={() => router.push(`/(farmer)/orders/${order.id}` as any)}
            onStatusTransition={(orderId, nextStatus) => updateStatus(orderId, nextStatus)}
          />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  verifiedCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.sm,
    ...Shadows.subtle,
  },
  verifiedLeft: {
    flex: 1,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
    flexWrap: 'wrap',
  },
  hubBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.pill,
    gap: 2,
  },
  hubText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  verifiedSub: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  addProduceBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    borderRadius: Radii.md,
  },
  addProduceText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    marginTop: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
  statsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  statsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  alertBanner: {
    backgroundColor: '#FEF5E7',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.amber,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  alertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.amberDark,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertContent: {
    flex: 1,
  },
  alertTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  alertBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
