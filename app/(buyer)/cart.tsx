import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useCart } from '../../context/CartContext';
import { Header } from '../../components/common/Header';
import { CartFarmerGroup } from '../../components/buyer/CartFarmerGroup';
import { Button } from '../../components/common/Button';
import { EmptyState } from '../../components/common/EmptyState';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerCartScreen() {
  const router = useRouter();
  const {
    items,
    farmerGroups,
    totalQuantityKg,
    produceSubtotal,
    estimatedFreight,
    mandiCessFee,
    grandTotal,
    updateQuantity,
    removeFromCart,
    clearCart,
  } = useCart();

  const handleCheckout = () => {
    router.push('/(buyer)/checkout');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Procurement Cart"
        subtitle={`${items.length} Farm Batches • ${(totalQuantityKg / 1000).toFixed(2)} Tonnes`}
        showBack={true}
        showRoleToggle={false}
        rightAction={
          items.length > 0 ? (
            <TouchableOpacity onPress={clearCart} style={styles.clearBtn}>
              <Text style={styles.clearBtnText}>Clear</Text>
            </TouchableOpacity>
          ) : null
        }
      />

      {items.length > 0 ? (
        <View style={{ flex: 1 }}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
          >
            {/* ONDC B2B Banner */}
            <View style={styles.ondcBanner}>
              <Ionicons name="shield-checkmark" size={16} color="#1E6091" />
              <Text style={styles.ondcBannerText}>
                Multi-farmer bulk batches grouped by origin Mandi dock for consolidated truck dispatch.
              </Text>
            </View>

            {/* Farm Grouped Batches */}
            {farmerGroups.map(group => (
              <CartFarmerGroup
                key={group.farmerId}
                farmerName={group.farmerName}
                farmName={group.farmName}
                location={group.location}
                items={group.items}
                subtotal={group.subtotal}
                onUpdateQty={updateQuantity}
                onRemoveItem={removeFromCart}
              />
            ))}

            {/* B2B Cost Breakdown Card */}
            <View style={styles.costCard}>
              <Text style={styles.costCardTitle}>B2B Wholesale Price Breakdown</Text>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>Produce Farm Subtotal:</Text>
                <Text style={styles.costVal}>₹{produceSubtotal.toLocaleString()}</Text>
              </View>

              <View style={styles.costRow}>
                <View style={styles.labelWithInfo}>
                  <Text style={styles.costLabel}>Consolidated Mandi Freight:</Text>
                  <Text style={styles.subInfoText}>({totalQuantityKg} kg)</Text>
                </View>
                <Text style={styles.costVal}>₹{estimatedFreight.toLocaleString()}</Text>
              </View>

              <View style={styles.costRow}>
                <View style={styles.labelWithInfo}>
                  <Text style={styles.costLabel}>APMC Market Cess & Platform Fee:</Text>
                  <Text style={styles.subInfoText}>(1.5%)</Text>
                </View>
                <Text style={styles.costVal}>₹{mandiCessFee.toLocaleString()}</Text>
              </View>

              <View style={styles.costRow}>
                <Text style={styles.costLabel}>GST (0% for Fresh Produce):</Text>
                <Text style={[styles.costVal, { color: Colors.success }]}>₹0.00 (Exempt)</Text>
              </View>

              <View style={styles.costDivider} />

              <View style={styles.grandTotalRow}>
                <View>
                  <Text style={styles.grandTotalLabel}>Total Procurement Value</Text>
                  <Text style={styles.taxSub}>All-inclusive destination warehouse price</Text>
                </View>
                <Text style={styles.grandTotalVal}>₹{grandTotal.toLocaleString()}</Text>
              </View>
            </View>
          </ScrollView>

          {/* Floating Checkout Bar */}
          <View style={styles.checkoutBar}>
            <View style={styles.checkoutPriceCol}>
              <Text style={styles.checkoutTotalLabel}>Grand Total</Text>
              <Text style={styles.checkoutTotalPrice}>₹{grandTotal.toLocaleString()}</Text>
            </View>

            <Button
              title="Proceed to B2B Checkout"
              onPress={handleCheckout}
              variant="primary"
              size="lg"
              iconName="arrow-forward"
              iconPosition="right"
              style={styles.checkoutBtn}
            />
          </View>
        </View>
      ) : (
        <EmptyState
          emoji="🛒"
          title="Your Procurement Cart is Empty"
          description="Explore fresh produce directly from verified Indian farmers at wholesale volume pricing."
          actionTitle="Explore Marketplace"
          onActionPress={() => router.push('/(buyer)/discover')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  clearBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  clearBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 110,
  },
  ondcBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    backgroundColor: '#EBF4FB',
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#90CDF4',
  },
  ondcBannerText: {
    fontSize: 12,
    color: '#1E6091',
    flex: 1,
    lineHeight: 16,
  },
  costCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
    gap: Spacing.xs + 2,
    ...Shadows.subtle,
  },
  costCardTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.xs,
  },
  costRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  labelWithInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  costLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  subInfoText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  costVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  costDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: Spacing.xs,
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 2,
  },
  grandTotalLabel: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  taxSub: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  grandTotalVal: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  checkoutBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.elevated,
  },
  checkoutPriceCol: {
    flex: 1,
  },
  checkoutTotalLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  checkoutTotalPrice: {
    fontSize: 19,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  checkoutBtn: {
    flex: 1.4,
  },
});
