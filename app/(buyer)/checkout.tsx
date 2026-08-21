import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { useOrders } from '../../context/OrdersContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerCheckoutScreen() {
  const router = useRouter();
  const {
    items,
    farmerGroups,
    produceSubtotal,
    estimatedFreight,
    mandiCessFee,
    grandTotal,
    clearCart,
  } = useCart();
  const { createOrderFromCart } = useOrders();
  const { buyerProfile } = useAuth();

  const [selectedWarehouseId, setSelectedWarehouseId] = useState('wh_pune_central');
  const [dispatchType, setDispatchType] = useState<'ondc_logistics' | 'mandi_pickup'>('ondc_logistics');
  const [paymentMethod, setPaymentMethod] = useState<'ondc_escrow' | 'rtgs_neft' | 'pay_on_delivery_inspection'>('ondc_escrow');
  const [poNumber, setPoNumber] = useState('PO-2026-MH981');
  const [submitting, setSubmitting] = useState(false);

  const selectedWarehouse =
    buyerProfile?.warehouses?.find(w => w.id === selectedWarehouseId) ||
    buyerProfile?.warehouses?.[0] || {
      id: 'wh_default',
      label: 'Pune Central Cold Hub',
      address: 'Plot 42, Sector 10, Bhosari MIDC',
      city: 'Pune',
      state: 'Maharashtra',
      pincode: '411026',
      isPrimary: true,
    };

  const handlePlaceOrder = async () => {
    if (items.length === 0) {
      Alert.alert('Cart Empty', 'Please add produce to your procurement cart before checkout.');
      return;
    }

    setSubmitting(true);
    try {
      // First farmer in group for the order batch
      const primaryFarmer = items[0].produce.farmer;

      const createdOrder = await createOrderFromCart({
        farmerId: primaryFarmer.id,
        farmerName: primaryFarmer.name,
        farmerPhone: primaryFarmer.phone,
        farmerLocation: `${items[0].produce.location.mandiHub}, ${items[0].produce.location.district}`,
        buyerId: buyerProfile?.id || 'buyer_mahafresh_1',
        buyerName: buyerProfile?.name || 'Vikramaditya Rao',
        businessName: buyerProfile?.businessName || 'MahaFresh Wholesale Ltd',
        buyerGstin: buyerProfile?.gstin || '27AABCM8921R1Z8',
        deliveryWarehouse: {
          label: selectedWarehouse.label,
          address: selectedWarehouse.address,
          city: selectedWarehouse.city,
          state: selectedWarehouse.state,
        },
        dispatchType,
        paymentMethod,
        paymentStatus: paymentMethod === 'ondc_escrow' ? 'paid_escrow' : 'pending',
        items: items.map(item => ({
          listingId: item.listingId,
          produceName: item.produce.name,
          variety: item.produce.variety,
          grade: item.produce.grade,
          quantity: item.quantity,
          unitPrice: item.selectedTierPrice,
          totalPrice: item.quantity * item.selectedTierPrice,
          imageUrl: item.produce.images[0],
        })),
        produceSubtotal,
        logisticsFee: estimatedFreight,
        mandiCessPlatformFee: mandiCessFee,
        gstAmount: 0,
        grandTotal,
        status: 'new',
      });

      clearCart();

      router.replace({
        pathname: '/(buyer)/order-success',
        params: {
          orderId: createdOrder.id,
          orderNumber: createdOrder.orderNumber,
          grandTotal: grandTotal.toString(),
          businessName: buyerProfile?.businessName || 'Your Business',
        },
      });
    } catch (e) {
      Alert.alert('Error', 'Failed to place bulk procurement order.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="B2B Bulk Procurement Checkout"
        subtitle="ONDC Escrow & GST Invoice Generation"
        showBack={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 1: Delivery Location */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="location" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>1. Delivery Destination Warehouse</Text>
          </View>

          {buyerProfile?.warehouses?.map(wh => (
            <TouchableOpacity
              key={wh.id}
              onPress={() => setSelectedWarehouseId(wh.id)}
              style={[
                styles.whOption,
                selectedWarehouseId === wh.id && styles.whOptionActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.whRadio}>
                {selectedWarehouseId === wh.id && <View style={styles.whRadioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.whLabelRow}>
                  <Text style={styles.whLabel}>{wh.label}</Text>
                  {wh.isPrimary && (
                    <View style={styles.primaryWhTag}>
                      <Text style={styles.primaryWhText}>Primary Hub</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.whAddress}>
                  {wh.address}, {wh.city}, {wh.state} - {wh.pincode}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 2: Dispatch & Logistics Mode */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="car" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>2. Logistics & Dispatch Mode</Text>
          </View>

          <TouchableOpacity
            onPress={() => setDispatchType('ondc_logistics')}
            style={[
              styles.dispatchOption,
              dispatchType === 'ondc_logistics' && styles.dispatchActive,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="shield-checkmark" size={20} color={Colors.primaryDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.dispatchTitle}>ONDC Agri Logistics Truck (Recommended)</Text>
              <Text style={styles.dispatchSub}>
                Direct pickup from farm gate/Mandi to your dock. Live GPS tracking & weight receipt.
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => setDispatchType('mandi_pickup')}
            style={[
              styles.dispatchOption,
              dispatchType === 'mandi_pickup' && styles.dispatchActive,
            ]}
            activeOpacity={0.8}
          >
            <Ionicons name="storefront" size={20} color={Colors.textSecondary} />
            <View style={{ flex: 1 }}>
              <Text style={styles.dispatchTitle}>Self Fleet Pickup at Mandi Dock</Text>
              <Text style={styles.dispatchSub}>
                Your truck collects the batch directly from the APMC loading yard.
              </Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Section 3: B2B Payment & Escrow */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="card" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>3. B2B Payment & Escrow Terms</Text>
          </View>

          {[
            {
              id: 'ondc_escrow',
              title: 'ONDC Smart Agri Escrow (100% Safe)',
              sub: 'Funds locked in RBI-regulated escrow. Released to farmer only after quality inspection at your warehouse gate.',
              badge: 'Most Popular',
            },
            {
              id: 'rtgs_neft',
              title: 'Corporate Bank Wire (RTGS / NEFT)',
              sub: '3-Day credit settlement window under institutional buyer agreement.',
            },
            {
              id: 'pay_on_delivery_inspection',
              title: 'Pay Upon Weighment & Inspection',
              sub: 'Instant digital settlement after moisture and grade verification.',
            },
          ].map(p => (
            <TouchableOpacity
              key={p.id}
              onPress={() => setPaymentMethod(p.id as any)}
              style={[
                styles.payOption,
                paymentMethod === p.id && styles.payOptionActive,
              ]}
              activeOpacity={0.8}
            >
              <View style={styles.whRadio}>
                {paymentMethod === p.id && <View style={styles.whRadioInner} />}
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.payTitleRow}>
                  <Text style={styles.payTitle}>{p.title}</Text>
                  {p.badge && (
                    <View style={styles.popularBadge}>
                      <Text style={styles.popularText}>{p.badge}</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.paySub}>{p.sub}</Text>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Section 4: Buyer Business Info & GST */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Ionicons name="document-text" size={18} color={Colors.primaryDark} />
            <Text style={styles.cardTitle}>4. Business Tax Invoice Details</Text>
          </View>

          <View style={styles.gstBox}>
            <View style={styles.gstRow}>
              <Text style={styles.gstKey}>B2B Entity:</Text>
              <Text style={styles.gstVal}>{buyerProfile?.businessName}</Text>
            </View>
            <View style={styles.gstRow}>
              <Text style={styles.gstKey}>GSTIN:</Text>
              <Text style={styles.gstVal}>{buyerProfile?.gstin}</Text>
            </View>
          </View>

          <Input
            label="Purchase Order / Internal Job Ref (Optional)"
            value={poNumber}
            onChangeText={setPoNumber}
            placeholder="e.g. PO-2026-AUG-441"
          />
        </View>

        {/* Final Total Summary */}
        <View style={styles.totalCard}>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Grand Total Payable:</Text>
            <Text style={styles.totalVal}>₹{grandTotal.toLocaleString()}</Text>
          </View>
          <Text style={styles.escrowGuaranteeText}>
            🛡️ 100% Escrow Protected: Funds will remain safely locked until your quality team approves the produce.
          </Text>
        </View>

        <Button
          title={`Confirm & Place Bulk Order (₹${grandTotal.toLocaleString()}) 🌾`}
          onPress={handlePlaceOrder}
          variant="primary"
          size="lg"
          loading={submitting}
          fullWidth
          style={{ marginBottom: Spacing.huge }}
        />
      </ScrollView>
    </SafeAreaView>
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
  card: {
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
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  whOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xs,
  },
  whOptionActive: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primary,
  },
  whRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 2,
  },
  whRadioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  whLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  primaryWhTag: {
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  primaryWhText: {
    fontSize: 9,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  whAddress: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  dispatchOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xs,
  },
  dispatchActive: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primary,
  },
  dispatchTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  dispatchSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  payOption: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginBottom: Spacing.xs,
  },
  payOptionActive: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primary,
  },
  payTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  payTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  popularBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  popularText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  paySub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    lineHeight: 15,
  },
  gstBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    gap: 4,
  },
  gstRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  gstKey: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  gstVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  totalCard: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  totalVal: {
    fontSize: 22,
    fontWeight: '800',
    color: '#52B788',
  },
  escrowGuaranteeText: {
    fontSize: 11,
    color: Colors.textInverseMuted,
    marginTop: Spacing.sm,
    lineHeight: 16,
  },
});
