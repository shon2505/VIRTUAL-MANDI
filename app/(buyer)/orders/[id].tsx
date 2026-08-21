import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  SafeAreaView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../../constants/theme';
import { useOrders } from '../../../context/OrdersContext';
import { Header } from '../../../components/common/Header';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { OrderTimeline } from '../../../components/buyer/OrderTimeline';
import { Button } from '../../../components/common/Button';
import { Order } from '../../../types';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerOrderDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getOrder, updateStatus } = useOrders();
  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

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
        <Header title="Tracking Shipment" showBack={true} />
        <View style={styles.centerLoading}>
          <Text style={styles.loadingText}>Loading procurement shipment...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const primaryItem = order.items[0];

  const handleSimulateDelivery = async () => {
    const updated = await updateStatus(
      order.id,
      'delivered',
      'Quality inspection passed. Weighment slip verified at warehouse gate.'
    );
    setOrder(updated);
    Alert.alert(
      'Quality Verified & Delivered ✓',
      'The batch has been received into your cold storage. Escrow funds have been released to the farmer.'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title={order.orderNumber}
        subtitle="Live B2B Logistics & Quality Tracking"
        showBack={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Top Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTop}>
            <View>
              <Text style={styles.orderNumberText}>{order.orderNumber}</Text>
              <Text style={styles.dateText}>Placed: {order.timeline[0]?.timestamp}</Text>
            </View>
            <StatusBadge type="order" value={order.status} size="md" />
          </View>

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
                Volume: <Text style={styles.bold}>{primaryItem?.quantity.toLocaleString()} kg</Text> @ ₹{primaryItem?.unitPrice}/kg
              </Text>
            </View>
          </View>

          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Total Procurement Value:</Text>
            <Text style={styles.totalValue}>₹{order.grandTotal.toLocaleString()}</Text>
          </View>
        </View>

        {/* Quality Inspection Status */}
        <View style={styles.qualityCard}>
          <View style={styles.qualityHeader}>
            <Ionicons name="shield-checkmark" size={18} color={Colors.primaryDark} />
            <Text style={styles.qualityTitle}>ONDC Certified Quality Standard</Text>
          </View>
          <View style={styles.qualityGrid}>
            <View style={styles.qualityCol}>
              <Text style={styles.qualityKey}>Moisture Content:</Text>
              <Text style={styles.qualityVal}>10.4% (Optimal)</Text>
            </View>
            <View style={styles.qualityCol}>
              <Text style={styles.qualityKey}>Visual Sizing:</Text>
              <Text style={styles.qualityVal}>85-90mm (Grade A)</Text>
            </View>
            <View style={styles.qualityCol}>
              <Text style={styles.qualityKey}>Packaging:</Text>
              <Text style={styles.qualityVal}>Plastic Crates</Text>
            </View>
            <View style={styles.qualityCol}>
              <Text style={styles.qualityKey}>Residue Report:</Text>
              <Text style={[styles.qualityVal, { color: Colors.success }]}>NABL Tested ✓</Text>
            </View>
          </View>
        </View>

        {/* Logistics & Driver Details */}
        <View style={styles.logisticsCard}>
          <Text style={styles.cardHeaderTitle}>Carrier & Vehicle Tracking</Text>
          <View style={styles.logisticsRow}>
            <View style={styles.truckIconBox}>
              <Ionicons name="car" size={20} color="#1E6091" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.vehicleNumber}>
                {order.truckVehicleNumber || 'MH-15-EG-4910'} (14-ft Eicher)
              </Text>
              <Text style={styles.driverInfo}>
                Driver: Sachin Jadhav • {order.driverPhone || '+91 97650 99211'}
              </Text>
              <Text style={styles.eWayBill}>
                E-Way Bill: {order.eWayBillNumber || 'EWB-260813-88912'}
              </Text>
            </View>
          </View>

          <View style={styles.destinationBox}>
            <Ionicons name="location" size={16} color={Colors.terracotta} />
            <View style={{ flex: 1 }}>
              <Text style={styles.destLabel}>Delivery Warehouse Hub:</Text>
              <Text style={styles.destText}>
                {order.deliveryWarehouse.label}, {order.deliveryWarehouse.address}
              </Text>
            </View>
          </View>
        </View>

        {/* Interactive 5-stage Lifecycle Timeline */}
        <OrderTimeline timeline={order.timeline} />

        {/* Escrow Release / Confirmation Button */}
        {order.status !== 'delivered' && order.status !== 'cancelled' && (
          <View style={styles.actionsBox}>
            <Button
              title="Confirm Warehouse Receipt & Release Escrow ✓"
              onPress={handleSimulateDelivery}
              variant="primary"
              size="lg"
              fullWidth
            />
          </View>
        )}
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
  summaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  summaryTop: {
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
    marginTop: 1,
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
    width: 64,
    height: 64,
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
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
  },
  totalLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  totalValue: {
    fontSize: 17,
    fontWeight: '800',
    color: '#1E6091',
  },
  qualityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  qualityHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  qualityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  qualityGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    backgroundColor: Colors.primaryWash,
    padding: Spacing.sm + 2,
    borderRadius: Radii.md,
  },
  qualityCol: {
    width: '46%',
  },
  qualityKey: {
    fontSize: 10,
    color: Colors.textSecondary,
  },
  qualityVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  logisticsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  cardHeaderTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  logisticsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  truckIconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.md,
    backgroundColor: '#EBF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  vehicleNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  driverInfo: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  eWayBill: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  destinationBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 6,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: Spacing.sm,
    marginTop: Spacing.md,
  },
  destLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  destText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  actionsBox: {
    marginVertical: Spacing.md,
    marginBottom: Spacing.xxl,
  },
});
