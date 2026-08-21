import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { CartItem } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Ionicons } from '@expo/vector-icons';

interface CartFarmerGroupProps {
  farmerName: string;
  farmName: string;
  location: string;
  items: CartItem[];
  subtotal: number;
  onUpdateQty: (listingId: string, qty: number) => void;
  onRemoveItem: (listingId: string) => void;
}

export const CartFarmerGroup: React.FC<CartFarmerGroupProps> = ({
  farmerName,
  farmName,
  location,
  items,
  subtotal,
  onUpdateQty,
  onRemoveItem,
}) => {
  return (
    <View style={styles.groupContainer}>
      <View style={styles.groupHeader}>
        <View style={styles.farmTitleRow}>
          <Ionicons name="storefront" size={16} color={Colors.primaryDark} />
          <Text style={styles.farmName}>{farmName}</Text>
          <VerificationBadge label="Verified" size="sm" />
        </View>
        <Text style={styles.locationText}>{location}</Text>
      </View>

      <View style={styles.itemsList}>
        {items.map(item => {
          const produce = item.produce;
          const lineTotal = item.quantity * item.selectedTierPrice;

          return (
            <View key={item.listingId} style={styles.itemRow}>
              <Image
                source={{ uri: produce.images[0] }}
                style={styles.itemImage}
                resizeMode="cover"
              />

              <View style={styles.itemDetails}>
                <View style={styles.itemNameRow}>
                  <Text style={styles.itemName} numberOfLines={1}>
                    {produce.name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => onRemoveItem(item.listingId)}
                    style={styles.removeBtn}
                  >
                    <Ionicons name="trash-outline" size={16} color={Colors.danger} />
                  </TouchableOpacity>
                </View>

                <Text style={styles.gradeText}>
                  Grade: {produce.grade} • Variety: {produce.variety}
                </Text>

                <View style={styles.priceRow}>
                  <Text style={styles.tierRate}>
                    ₹{item.selectedTierPrice}/{produce.unit}
                  </Text>
                  <Text style={styles.lineTotal}>₹{lineTotal.toLocaleString()}</Text>
                </View>

                {/* Bulk Stepper */}
                <View style={styles.stepperContainer}>
                  <TouchableOpacity
                    onPress={() => onUpdateQty(item.listingId, item.quantity - 50)}
                    style={styles.stepBtn}
                  >
                    <Ionicons name="remove" size={14} color={Colors.primaryDark} />
                  </TouchableOpacity>

                  <Text style={styles.qtyText}>{item.quantity} kg</Text>

                  <TouchableOpacity
                    onPress={() => onUpdateQty(item.listingId, item.quantity + 50)}
                    style={styles.stepBtn}
                  >
                    <Ionicons name="add" size={14} color={Colors.primaryDark} />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      <View style={styles.groupFooter}>
        <Text style={styles.subtotalLabel}>Farm Batch Subtotal:</Text>
        <Text style={styles.subtotalValue}>₹{subtotal.toLocaleString()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  groupContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.subtle,
  },
  groupHeader: {
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  farmTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  farmName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  itemsList: {
    padding: Spacing.md,
    gap: Spacing.md,
  },
  itemRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  itemImage: {
    width: 72,
    height: 72,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  itemDetails: {
    flex: 1,
  },
  itemNameRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  itemName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  removeBtn: {
    padding: 2,
  },
  gradeText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  priceRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'baseline',
    marginTop: 4,
  },
  tierRate: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  lineTotal: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  stepperContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.pill,
    padding: 2,
    marginTop: 6,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepBtn: {
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    paddingHorizontal: Spacing.sm,
  },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm + 2,
    backgroundColor: Colors.primaryWash,
  },
  subtotalLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  subtotalValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
});
