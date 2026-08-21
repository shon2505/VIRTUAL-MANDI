import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useListings } from '../../context/ListingsContext';
import { Header } from '../../components/common/Header';
import { InventoryProgressBar } from '../../components/farmer/InventoryProgressBar';
import { StatCard } from '../../components/common/StatCard';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { StatusBadge } from '../../components/common/StatusBadge';
import { ProduceListing } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function FarmerInventoryScreen() {
  const { farmerListings, updateProduce } = useListings();

  // Stock Adjust Modal
  const [selectedListing, setSelectedListing] = useState<ProduceListing | null>(null);
  const [newAvailable, setNewAvailable] = useState('');
  const [newReserved, setNewReserved] = useState('');

  const totalStockKg = farmerListings.reduce((sum, l) => sum + l.totalQuantity, 0);
  const availableStockKg = farmerListings.reduce((sum, l) => sum + l.availableQuantity, 0);
  const reservedStockKg = farmerListings.reduce((sum, l) => sum + l.reservedQuantity, 0);
  const soldStockKg = farmerListings.reduce((sum, l) => sum + l.soldQuantity, 0);

  const handleOpenAdjust = (listing: ProduceListing) => {
    setSelectedListing(listing);
    setNewAvailable(listing.availableQuantity.toString());
    setNewReserved(listing.reservedQuantity.toString());
  };

  const handleSaveStock = async () => {
    if (!selectedListing) return;
    const availNum = parseInt(newAvailable, 10);
    const resNum = parseInt(newReserved, 10);

    if (isNaN(availNum) || availNum < 0 || isNaN(resNum) || resNum < 0) {
      Alert.alert('Invalid Quantities', 'Please enter valid non-negative quantities.');
      return;
    }

    const newTotal = availNum + resNum + selectedListing.soldQuantity;

    await updateProduce(selectedListing.id, {
      availableQuantity: availNum,
      reservedQuantity: resNum,
      totalQuantity: newTotal,
      status: availNum === 0 ? 'sold_out' : selectedListing.status === 'sold_out' ? 'active' : selectedListing.status,
    });

    setSelectedListing(null);
  };

  return (
    <View style={styles.container}>
      <Header
        title="Inventory Warehouse"
        subtitle="Live Stock Allocation & Reservation Engine"
        showRoleToggle={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Global Inventory Summary Cards */}
        <View style={styles.summaryGrid}>
          <View style={styles.summaryRow}>
            <StatCard
              label="Total Mandi Stock"
              value={`${(totalStockKg / 1000).toFixed(1)} Tonnes`}
              iconName="cube"
              iconColor={Colors.primary}
              subtext={`${totalStockKg.toLocaleString()} kg overall`}
            />
            <StatCard
              label="Available for Sale"
              value={`${(availableStockKg / 1000).toFixed(1)} T`}
              iconName="checkmark-circle"
              iconColor={Colors.primaryAccent}
              subtext={`${availableStockKg.toLocaleString()} kg ready`}
              accentColor={Colors.primaryAccent}
            />
          </View>

          <View style={styles.summaryRow}>
            <StatCard
              label="Reserved in Orders"
              value={`${(reservedStockKg / 1000).toFixed(1)} T`}
              iconName="time"
              iconColor={Colors.amber}
              subtext={`${reservedStockKg.toLocaleString()} kg locked in escrow`}
              accentColor={Colors.amber}
            />
            <StatCard
              label="Sold & Dispatched"
              value={`${(soldStockKg / 1000).toFixed(1)} T`}
              iconName="bag-check"
              iconColor={Colors.textSecondary}
              subtext={`${soldStockKg.toLocaleString()} kg completed`}
            />
          </View>
        </View>

        {/* Global Bar */}
        <View style={styles.macroCard}>
          <Text style={styles.macroTitle}>Overall Stock Allocation Breakdown</Text>
          <InventoryProgressBar
            total={totalStockKg}
            available={availableStockKg}
            reserved={reservedStockKg}
            sold={soldStockKg}
            unit="kg"
          />
        </View>

        {/* Inventory Item Breakdown List */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Commodity Stock Breakdown</Text>
          <Text style={styles.sectionSubtitle}>
            Tap any crop to adjust stock levels or reserve batches
          </Text>
        </View>

        {farmerListings.map(listing => {
          const availPct =
            listing.totalQuantity > 0
              ? Math.round((listing.availableQuantity / listing.totalQuantity) * 100)
              : 0;

          return (
            <TouchableOpacity
              key={listing.id}
              style={styles.itemCard}
              onPress={() => handleOpenAdjust(listing)}
              activeOpacity={0.8}
            >
              <View style={styles.itemHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {listing.name}
                  </Text>
                  <Text style={styles.itemVariety}>
                    {listing.variety} • Grade {listing.grade}
                  </Text>
                </View>
                <StatusBadge type="listing" value={listing.status} size="sm" />
              </View>

              <View style={styles.metricsBox}>
                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Total Capacity</Text>
                  <Text style={styles.metricVal}>
                    {listing.totalQuantity.toLocaleString()} {listing.unit}
                  </Text>
                </View>
                <View style={styles.metricDivider} />

                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Available</Text>
                  <Text style={[styles.metricVal, { color: Colors.primaryAccent }]}>
                    {listing.availableQuantity.toLocaleString()} {listing.unit}
                  </Text>
                </View>
                <View style={styles.metricDivider} />

                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Reserved</Text>
                  <Text style={[styles.metricVal, { color: Colors.amberDark }]}>
                    {listing.reservedQuantity.toLocaleString()} {listing.unit}
                  </Text>
                </View>
                <View style={styles.metricDivider} />

                <View style={styles.metricCol}>
                  <Text style={styles.metricLabel}>Dispatched</Text>
                  <Text style={styles.metricVal}>
                    {listing.soldQuantity.toLocaleString()} {listing.unit}
                  </Text>
                </View>
              </View>

              <View style={styles.barWrap}>
                <InventoryProgressBar
                  total={listing.totalQuantity}
                  available={listing.availableQuantity}
                  reserved={listing.reservedQuantity}
                  sold={listing.soldQuantity}
                  unit={listing.unit}
                  showLabels={false}
                />
              </View>

              <View style={styles.itemFooter}>
                <Text style={styles.stockAlertText}>
                  {availPct <= 20
                    ? '⚠️ Low available stock warning'
                    : `✓ ${availPct}% of batch available for bidding`}
                </Text>
                <View style={styles.adjustLink}>
                  <Text style={styles.adjustLinkText}>Adjust Batch</Text>
                  <Ionicons name="create-outline" size={13} color={Colors.primaryMedium} />
                </View>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Adjust Modal */}
      {selectedListing && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.modalTitle}>Adjust Stock Allocation</Text>
                  <Text style={styles.modalSub} numberOfLines={1}>
                    {selectedListing.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setSelectedListing(null)}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Input
                label={`Available for Sale (${selectedListing.unit})`}
                value={newAvailable}
                onChangeText={setNewAvailable}
                keyboardType="numeric"
                helperText="Quantity visible to bulk buyers on the open Mandi"
                required
              />

              <Input
                label={`Reserved for Pending Orders (${selectedListing.unit})`}
                value={newReserved}
                onChangeText={setNewReserved}
                keyboardType="numeric"
                helperText="Hold quantity for active bulk quote negotiations"
                required
              />

              <View style={styles.calcBox}>
                <Text style={styles.calcText}>
                  Dispatched (Historical): {selectedListing.soldQuantity} {selectedListing.unit}
                </Text>
                <Text style={styles.calcTotal}>
                  New Total Capacity: {(parseInt(newAvailable, 10) || 0) + (parseInt(newReserved, 10) || 0) + selectedListing.soldQuantity} {selectedListing.unit}
                </Text>
              </View>

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setSelectedListing(null)}
                  variant="ghost"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Save Stock"
                  onPress={handleSaveStock}
                  variant="primary"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
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
  summaryGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  macroCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  macroTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  itemCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  itemName: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  itemVariety: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  metricsBox: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    paddingHorizontal: Spacing.xs,
    marginVertical: Spacing.xs,
  },
  metricCol: {
    flex: 1,
    alignItems: 'center',
  },
  metricLabel: {
    fontSize: 9,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  metricVal: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  metricDivider: {
    width: 1,
    height: 20,
    backgroundColor: Colors.border,
  },
  barWrap: {
    marginTop: Spacing.sm,
  },
  itemFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  stockAlertText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  adjustLink: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  adjustLinkText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryMedium,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 28, 21, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    ...Shadows.popover,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
  },
  closeBtn: {
    padding: 4,
  },
  calcBox: {
    backgroundColor: Colors.primaryWash,
    padding: Spacing.md,
    borderRadius: Radii.md,
    marginBottom: Spacing.md,
    gap: 2,
  },
  calcText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  calcTotal: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
});
