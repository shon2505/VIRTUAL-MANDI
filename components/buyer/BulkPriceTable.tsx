import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { BulkPriceTier } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface BulkPriceTableProps {
  tiers: BulkPriceTier[];
  selectedQuantity?: number;
  unit?: string;
}

export const BulkPriceTable: React.FC<BulkPriceTableProps> = ({
  tiers,
  selectedQuantity = 0,
  unit = 'kg',
}) => {
  if (!tiers || tiers.length === 0) return null;

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <Ionicons name="pricetags-outline" size={14} color={Colors.primaryDark} />
        <Text style={styles.title}>Tiered Wholesale Volume Pricing</Text>
      </View>

      <View style={styles.table}>
        <View style={styles.tableHead}>
          <Text style={[styles.headCell, { flex: 2 }]}>Order Quantity</Text>
          <Text style={[styles.headCell, { flex: 1.5, textAlign: 'right' }]}>Wholesale Rate</Text>
          <Text style={[styles.headCell, { flex: 1.2, textAlign: 'right' }]}>Savings</Text>
        </View>

        {tiers.map((tier, index) => {
          const isHighest = index === tiers.length - 1;
          const rangeLabel = tier.maxQty
            ? `${tier.minQty.toLocaleString()} – ${tier.maxQty.toLocaleString()} ${unit}`
            : `${tier.minQty.toLocaleString()}+ ${unit}`;

          const isCurrentTier =
            selectedQuantity >= tier.minQty &&
            (!tier.maxQty || selectedQuantity <= tier.maxQty);

          const basePrice = tiers[0].pricePerUnit;
          const discountPct =
            basePrice > tier.pricePerUnit
              ? Math.round(((basePrice - tier.pricePerUnit) / basePrice) * 100)
              : 0;

          return (
            <View
              key={index}
              style={[
                styles.tableRow,
                isCurrentTier && styles.rowActive,
                index === tiers.length - 1 && styles.lastRow,
              ]}
            >
              <View style={[styles.cellContainer, { flex: 2 }]}>
                {isCurrentTier && (
                  <View style={styles.activeDot} />
                )}
                <Text
                  style={[
                    styles.rangeText,
                    isCurrentTier && styles.textActive,
                  ]}
                >
                  {rangeLabel}
                </Text>
              </View>

              <Text
                style={[
                  styles.priceCell,
                  { flex: 1.5 },
                  isCurrentTier && styles.textActive,
                ]}
              >
                ₹{tier.pricePerUnit}/{unit}
              </Text>

              <View style={[styles.savingContainer, { flex: 1.2 }]}>
                {discountPct > 0 ? (
                  <View style={styles.savingBadge}>
                    <Text style={styles.savingText}>Save {discountPct}%</Text>
                  </View>
                ) : (
                  <Text style={styles.baseRateText}>Base</Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: Spacing.sm,
  },
  title: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  table: {
    borderRadius: Radii.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  tableHead: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 8,
    paddingHorizontal: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  headCell: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: Spacing.md,
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  lastRow: {
    borderBottomWidth: 0,
  },
  rowActive: {
    backgroundColor: Colors.primaryWash,
  },
  cellContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primaryAccent,
    marginRight: 6,
  },
  rangeText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  priceCell: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'right',
  },
  textActive: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
  savingContainer: {
    alignItems: 'flex-end',
  },
  savingBadge: {
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  savingText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  baseRateText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
