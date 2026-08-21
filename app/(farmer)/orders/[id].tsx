import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
  Image,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../../constants/theme';
import { useOrders } from '../../../context/OrdersContext';
import { Header } from '../../../components/common/Header';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { OrderTimeline } from '../../../components/buyer/OrderTimeline';
import { Button } from '../../../components/common/Button';
import { Order, OrderStatus } from '../../../types';
import { Ionicons } from '@expo/vector-icons';

export default function FarmerOrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, updateStatus } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      if (!id) return;
      const data = await getOrder(id);
      setOrder(data);
      setLoading(false);
    };
    fetch();
  }, [id, getOrder]);

  if (loading || !order) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Order Details" showBack={true} />
        <View style={styles.centerLoading}>
          <Text style={styles.loadingText}>Loading procurement order...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const primaryItem = order.items[0];

  const handleNextStatusTransition = async (nextStatus: OrderStatus) => {
    setActionLoading(true);
    try {
      const updated = await updateStatus(order.id, nextStatus);
      setOrder(updated);
      Alert.alert('Status Updated', `Order ${order.orderNumber} is now marked as ${nextStatus.replace('_', ' ')}.`);
    } catch (e) {
      Alert.alert('Error', 'Failed to update status.');
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={order.orderNumber}
        subtitle="Farmer Dispatch & Escrow Summary"
        showBack={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Order Card */}
        <View style={styles.orderCard}>
          <View style={styles.cardHeader}>
            <View>
              <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
              <Text style={styles.dateText}>{order.timeline[0]?.timestamp}</Text>
            </View>
            <StatusBadge type="order" value={order.status} size="md" />
          </View>

          {/* Produce Item Details */}
          <View style={styles.itemRow}>
            {primaryItem?.imageUrl && (
              <Image source={{ uri: primaryItem.imageUrl }} style={styles.itemImg} />
            )}
            <View style={styles.itemInfo}>
              <Text style={styles.produceName}>{primaryItem?.produceName}</Text>
              <Text style={styles.gradeVariety}>
                Grade: {primaryItem?.grade} • Variety: {primaryItem?.variety}
              </Text>
              <Text style={styles.quantityLine}>
                Batch Volume: <Text style={styles.bold}>{primaryItem?.quantity} kg</Text> @ ₹{primaryItem?.unitPrice}/kg
              </Text>
            </View>
          </View>

          {/* Financial Breakdown for Farmer */}
          <View style={styles.financeBox}>
            <View style={styles.financeRow}>
              <Text style={styles.financeLabel}>Produce Payout (Gross):</Text>
              <Text style={styles.financeValue}>₹{order.produceSubtotal.toLocaleString()}</Text>
            </View>
            <View style={styles.financeRow}>
              <Text style={styles.financeLabel}>Escrow Security Status:</Text>
              <View style={styles.escrowPill}>
                <Ionicons name="lock-closed" size={11} color={Colors.primaryDark} />
                <Text style={styles.escrowText}>100% Funded in ONDC Escrow</Text>
              </View>
            </View>
            <View style={[styles.financeRow, styles.totalRow]}>
              <Text style={styles.totalLabel}>Net Farmer Settlement:</Text>
              <Text style={styles.totalValue}>₹{order.produceSubtotal.toLocaleString()}</Text>
            </View>
          </View>
        </View>

        {/* Action Controls for Status Transitions */}
        <View style={styles.actionSection}>
          <Text style={styles.sectionHeader}>Fulfillment Actions</Text>

          {order.status === 'new' && (
            <View style={styles.actionRow}>
              <Button
                title="Reject Order"
                onPress={() => handleNextStatusTransition('cancelled')}
                variant="danger"
                size="md"
                style={{ flex: 1 }}
              />
              <Button
                title="Accept Bulk Order ✓"
                onPress={() => handleNextStatusTransition('accepted')}
                variant="primary"
                size="md"
                loading={actionLoading}
                style={{ flex: 2 }}
              />
            </View>
          )}

          {order.status === 'accepted' && (
            <Button
              title="Start Grading & Packing Produce"
              onPress={() => handleNextStatusTransition('preparing')}
              variant="primary"
              size="lg"
              loading={actionLoading}
              iconName="cube"
              fullWidth
            />
          )}

          {order.status === 'preparing' && (
            <Button
              title="Mark Ready for Truck Pickup 🚚"
              onPress={() => handleNextStatusTransition('ready_for_pickup')}
              variant="primary"
              size="lg"
              loading={actionLoading}
              iconName="checkmark-done"
              fullWidth
            />
          )}

          {order.status === 'ready_for_pickup' && (
            <Button
              title="Confirm Truck Loaded & Dispatched"
              onPress={() => handleNextStatusTransition('in_transit')}
              variant="primary"
              size="lg"
              loading={actionLoading}
              iconName="airplane"
              fullWidth
            />
          )}

          {order.status === 'in_transit' && (
            <View style={styles.infoBanner}>
              <Ionicons name="navigate-circle" size={24} color="#1E6091" />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={styles.infoTitle}>Batch In Transit to Warehouse</Text>
                <Text style={styles.infoBody}>
                  Vehicle {order.truckVehicleNumber || 'MH-15-EG-4910'} is en route. Payment releases automatically upon weighment slip.
                </Text>
              </View>
            </View>
          )}

          {order.status === 'delivered' && (
            <View style={[styles.infoBanner, { backgroundColor: Colors.successBg, borderColor: Colors.success }]}>
              <Ionicons name="checkmark-circle" size={24} color={Colors.success} />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={[styles.infoTitle, { color: Colors.primaryDark }]}>
                  Order Completed & Settled
                </Text>
                <Text style={styles.infoBody}>
                  ₹{order.produceSubtotal.toLocaleString()} was released directly to your State Bank of India account.
                </Text>
              </View>
            </View>
          )}
        </View>

        {/* Buyer & Delivery Info */}
        <View style={styles.infoCard}>
          <Text style={styles.cardSectionTitle}>Institutional Buyer Info</Text>
          <View style={styles.buyerRow}>
            <Ionicons name="business" size={16} color={Colors.primaryDark} />
            <Text style={styles.buyerBusiness}>{order.businessName}</Text>
          </View>
          <Text style={styles.buyerContact}>
            Contact: {order.buyerName} • GSTIN: {order.buyerGstin}
          </Text>

          <View style={styles.divider} />

          <Text style={styles.cardSectionTitle}>Delivery Destination</Text>
          <View style={styles.buyerRow}>
            <Ionicons name="location" size={16} color={Colors.terracotta} />
            <Text style={styles.warehouseName}>{order.deliveryWarehouse.label}</Text>
          </View>
          <Text style={styles.warehouseAddress}>
            {order.deliveryWarehouse.address}, {order.deliveryWarehouse.city}, {order.deliveryWarehouse.state}
          </Text>
        </View>

        {/* Visual Lifecycle Timeline */}
        <OrderTimeline timeline={order.timeline} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerLoading: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingText: {
    fontSize: 14,
    color: Colors.textMuted,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  orderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  orderNumberText: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  dateText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
  },
  itemImg: {
    width: 68,
    height: 68,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  itemInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  produceName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gradeVariety: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  quantityLine: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 3,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  financeBox: {
    marginTop: Spacing.md,
    gap: Spacing.xs,
  },
  financeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  financeLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  financeValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  escrowPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  escrowText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: Spacing.xs,
    marginTop: 4,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  actionSection: {
    marginVertical: Spacing.xs,
  },
  sectionHeader: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  actionRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FB',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#90CDF4',
  },
  infoTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E6091',
  },
  infoBody: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  infoCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  cardSectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  buyerBusiness: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  buyerContact: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    marginLeft: 22,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.sm + 2,
  },
  warehouseName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  warehouseAddress: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
    marginLeft: 22,
  },
});
