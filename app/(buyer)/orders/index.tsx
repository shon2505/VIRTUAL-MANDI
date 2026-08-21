import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../../constants/theme';
import { useOrders } from '../../../context/OrdersContext';
import { Header } from '../../../components/common/Header';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { EmptyState } from '../../../components/common/EmptyState';
import { Ionicons } from '@expo/vector-icons';

type OrderFilter = 'all' | 'active' | 'completed' | 'cancelled';

export default function BuyerOrdersListScreen() {
  const router = useRouter();
  const { buyerOrders } = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');

  const filteredOrders = buyerOrders.filter(o => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'active') {
      return o.status !== 'delivered' && o.status !== 'cancelled';
    }
    return o.status === activeFilter;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Procurement Orders"
        subtitle={`${buyerOrders.length} Commercial Shipments Tracked`}
        showRoleToggle={true}
        showCart={true}
      />

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        {(
          [
            { id: 'all', label: 'All Orders', count: buyerOrders.length },
            { id: 'active', label: 'Active Shipments', count: buyerOrders.filter(o => o.status !== 'delivered' && o.status !== 'cancelled').length },
            { id: 'completed', label: 'Completed', count: buyerOrders.filter(o => o.status === 'delivered').length },
          ] as const
        ).map(tab => (
          <TouchableOpacity
            key={tab.id}
            onPress={() => setActiveFilter(tab.id as OrderFilter)}
            style={[
              styles.tabItem,
              activeFilter === tab.id && styles.tabItemActive,
            ]}
            activeOpacity={0.7}
          >
            <Text
              style={[
                styles.tabText,
                activeFilter === tab.id && styles.tabTextActive,
              ]}
            >
              {tab.label}
            </Text>
            <View
              style={[
                styles.tabBadge,
                activeFilter === tab.id ? styles.tabBadgeActive : styles.tabBadgeInactive,
              ]}
            >
              <Text
                style={[
                  styles.tabBadgeText,
                  activeFilter === tab.id && styles.tabBadgeTextActive,
                ]}
              >
                {tab.count}
              </Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => {
            const primaryItem = order.items[0];

            return (
              <TouchableOpacity
                key={order.id}
                onPress={() => router.push(`/(buyer)/orders/${order.id}` as any)}
                style={styles.orderCard}
                activeOpacity={0.8}
              >
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.orderNumber}>{order.orderNumber}</Text>
                    <Text style={styles.timestamp}>{order.timeline[0]?.timestamp}</Text>
                  </View>
                  <StatusBadge type="order" value={order.status} size="sm" />
                </View>

                <View style={styles.itemRow}>
                  {primaryItem?.imageUrl ? (
                    <Image
                      source={{ uri: primaryItem.imageUrl }}
                      style={styles.itemImg}
                      resizeMode="cover"
                    />
                  ) : (
                    <View style={[styles.itemImg, styles.placeholderImg]}>
                      <Ionicons name="leaf" size={24} color={Colors.primaryAccent} />
                    </View>
                  )}

                  <View style={styles.itemInfo}>
                    <Text style={styles.produceName} numberOfLines={1}>
                      {primaryItem?.produceName}
                    </Text>
                    <Text style={styles.quantityLine}>
                      Volume: <Text style={styles.bold}>{primaryItem?.quantity} kg</Text> • Grade {primaryItem?.grade}
                    </Text>
                    <View style={styles.farmerLine}>
                      <Ionicons name="storefront-outline" size={12} color={Colors.textMuted} />
                      <Text style={styles.farmerText} numberOfLines={1}>
                        {order.farmerName} ({order.farmerLocation})
                      </Text>
                    </View>
                  </View>
                </View>

                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.totalLabel}>Total Value</Text>
                    <Text style={styles.totalAmount}>₹{order.grandTotal.toLocaleString()}</Text>
                  </View>

                  <View style={styles.trackBtn}>
                    <Text style={styles.trackBtnText}>Track Shipment</Text>
                    <Ionicons name="chevron-forward" size={14} color="#1E6091" />
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        ) : (
          <EmptyState
            emoji="📦"
            title="Your procurement journey starts here."
            description="Explore fresh produce directly from verified farmers at transparent wholesale rates."
            actionTitle="Explore Produce"
            onActionPress={() => router.push('/(buyer)/discover')}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabItem: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 5,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabItemActive: {
    backgroundColor: '#1E6091',
    borderColor: '#1E6091',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  tabBadgeInactive: {
    backgroundColor: Colors.borderLight,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.md + 2,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  itemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  itemImg: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  placeholderImg: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  produceName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quantityLine: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  farmerLine: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  farmerText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  totalLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E6091',
    marginTop: 1,
  },
  trackBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trackBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E6091',
  },
});
