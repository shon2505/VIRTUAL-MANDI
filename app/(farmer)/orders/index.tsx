import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing } from '../../../constants/theme';
import { useOrders } from '../../../context/OrdersContext';
import { Header } from '../../../components/common/Header';
import { FarmerOrderCard } from '../../../components/farmer/FarmerOrderCard';
import { EmptyState } from '../../../components/common/EmptyState';
import { OrderStatus } from '../../../types';

type OrderFilter = 'all' | 'new' | 'preparing' | 'in_transit' | 'delivered';

export default function FarmerOrdersListScreen() {
  const router = useRouter();
  const { farmerOrders, updateStatus } = useOrders();
  const [activeFilter, setActiveFilter] = useState<OrderFilter>('all');

  const filteredOrders = farmerOrders.filter(order => {
    if (activeFilter === 'all') return true;
    if (activeFilter === 'preparing') {
      return order.status === 'accepted' || order.status === 'preparing' || order.status === 'ready_for_pickup';
    }
    return order.status === activeFilter;
  });

  return (
    <View style={styles.container}>
      <Header
        title="Procurement Orders"
        subtitle={`${farmerOrders.length} Total Bulk Inquiries & Dispatches`}
        showRoleToggle={true}
      />

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {(
            [
              { id: 'all', label: 'All Orders', count: farmerOrders.length },
              { id: 'new', label: 'New Action', count: farmerOrders.filter(o => o.status === 'new').length },
              { id: 'preparing', label: 'In Packing', count: farmerOrders.filter(o => o.status === 'accepted' || o.status === 'preparing' || o.status === 'ready_for_pickup').length },
              { id: 'in_transit', label: 'In Transit', count: farmerOrders.filter(o => o.status === 'in_transit').length },
              { id: 'delivered', label: 'Delivered', count: farmerOrders.filter(o => o.status === 'delivered').length },
            ] as const
          ).map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveFilter(tab.id)}
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
        </ScrollView>
      </View>

      {/* Orders List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredOrders.length > 0 ? (
          filteredOrders.map(order => (
            <FarmerOrderCard
              key={order.id}
              order={order}
              onPress={() => router.push(`/(farmer)/orders/${order.id}` as any)}
              onStatusTransition={(orderId, nextStatus) => updateStatus(orderId, nextStatus)}
            />
          ))
        ) : (
          <EmptyState
            emoji="📦"
            title="No orders found"
            description="When bulk buyers place wholesale procurement orders for your listings, they will appear here."
            actionTitle="View Listings"
            onActionPress={() => router.push('/(farmer)/listings')}
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
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 6,
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
    fontSize: 10,
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
});
