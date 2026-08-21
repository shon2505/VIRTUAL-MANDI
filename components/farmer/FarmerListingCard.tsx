import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { ProduceListing } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { InventoryProgressBar } from './InventoryProgressBar';
import { Ionicons } from '@expo/vector-icons';

interface FarmerListingCardProps {
  listing: ProduceListing;
  onEdit?: () => void;
  onToggleStatus?: () => void;
  onPress?: () => void;
}

export const FarmerListingCard: React.FC<FarmerListingCardProps> = ({
  listing,
  onEdit,
  onToggleStatus,
  onPress,
}) => {
  const isSoldOut = listing.status === 'sold_out' || listing.availableQuantity === 0;
  const isPaused = listing.status === 'paused';

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.topRow}>
        <Image
          source={{ uri: listing.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />

        <View style={styles.details}>
          <View style={styles.badgeRow}>
            <StatusBadge type="grade" value={listing.grade} size="sm" />
            <StatusBadge type="listing" value={listing.status} size="sm" />
          </View>

          <Text style={styles.name} numberOfLines={2}>
            {listing.name}
          </Text>

          <Text style={styles.variety}>
            Variety: <Text style={styles.bold}>{listing.variety}</Text>
          </Text>

          <View style={styles.priceRow}>
            <Text style={styles.price}>
              ₹{listing.basePricePerUnit}
              <Text style={styles.unit}>/{listing.unit}</Text>
            </Text>
            <Text style={styles.moq}>
              MOQ: {listing.minOrderQuantity} {listing.unit}
            </Text>
          </View>
        </View>
      </View>

      {/* Stock Progress Bar */}
      <View style={styles.inventorySection}>
        <InventoryProgressBar
          total={listing.totalQuantity}
          available={listing.availableQuantity}
          reserved={listing.reservedQuantity}
          sold={listing.soldQuantity}
          unit={listing.unit}
        />
      </View>

      {/* Footer Actions */}
      <View style={styles.footer}>
        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
          <Text style={styles.locationText} numberOfLines={1}>
            {listing.location.mandiHub}, {listing.location.district}
          </Text>
        </View>

        <View style={styles.actionButtons}>
          {onToggleStatus && (
            <TouchableOpacity
              onPress={onToggleStatus}
              style={[
                styles.actionBtn,
                isPaused ? styles.resumeBtn : styles.pauseBtn,
              ]}
              activeOpacity={0.7}
            >
              <Ionicons
                name={isPaused ? 'play-outline' : 'pause-outline'}
                size={14}
                color={isPaused ? Colors.success : Colors.warning}
              />
              <Text
                style={[
                  styles.actionBtnText,
                  { color: isPaused ? Colors.success : Colors.warning },
                ]}
              >
                {isPaused ? 'Resume' : 'Pause'}
              </Text>
            </TouchableOpacity>
          )}

          {onEdit && (
            <TouchableOpacity
              onPress={onEdit}
              style={[styles.actionBtn, styles.editBtn]}
              activeOpacity={0.7}
            >
              <Ionicons name="create-outline" size={14} color={Colors.primaryDark} />
              <Text style={[styles.actionBtnText, { color: Colors.primaryDark }]}>
                Edit
              </Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  image: {
    width: 96,
    height: 96,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  details: {
    flex: 1,
    justifyContent: 'space-between',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginBottom: 4,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 19,
  },
  variety: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  price: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  unit: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  moq: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  inventorySection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm + 2,
    paddingTop: Spacing.xs,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    flex: 1,
    marginRight: Spacing.sm,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  pauseBtn: {
    backgroundColor: Colors.warningBg,
    borderColor: Colors.warning,
  },
  resumeBtn: {
    backgroundColor: Colors.successBg,
    borderColor: Colors.success,
  },
  editBtn: {
    backgroundColor: Colors.surfaceSubtle,
    borderColor: Colors.border,
  },
  actionBtnText: {
    fontSize: 11,
    fontWeight: '700',
  },
});
