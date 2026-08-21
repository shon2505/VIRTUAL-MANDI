import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { ProduceListing } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { VerificationBadge } from '../common/VerificationBadge';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

interface BulkProductCardProps {
  produce: ProduceListing;
  onAddToCart?: () => void;
}

export const BulkProductCard: React.FC<BulkProductCardProps> = ({
  produce,
  onAddToCart,
}) => {
  const router = useRouter();

  const handlePress = () => {
    router.push(`/(buyer)/product/${produce.id}` as any);
  };

  const lowestTierPrice =
    produce.priceTiers && produce.priceTiers.length > 0
      ? Math.min(...produce.priceTiers.map(t => t.pricePerUnit))
      : produce.basePricePerUnit;

  const hasBulkDiscount = lowestTierPrice < produce.basePricePerUnit;

  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={handlePress}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: produce.images[0] }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgeOverlay}>
          <StatusBadge type="grade" value={produce.grade} size="sm" />
        </View>

        {produce.featured && (
          <View style={styles.featuredBadge}>
            <Ionicons name="sparkles" size={10} color="#FFFFFF" />
            <Text style={styles.featuredText}>Featured Deal</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.farmerRow}>
          <VerificationBadge
            label={produce.farmer.name}
            size="sm"
            variant="farmer"
          />
          <View style={styles.ratingRow}>
            <Ionicons name="star" size={12} color="#D4A373" />
            <Text style={styles.ratingText}>{produce.farmer.rating}</Text>
          </View>
        </View>

        <Text style={styles.name} numberOfLines={2}>
          {produce.name}
        </Text>

        <Text style={styles.variety} numberOfLines={1}>
          Variety: {produce.variety}
        </Text>

        <View style={styles.statsGrid}>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Available</Text>
            <Text style={styles.statValue}>
              {produce.availableQuantity.toLocaleString()} {produce.unit}
            </Text>
          </View>
          <View style={styles.statItem}>
            <Text style={styles.statLabel}>Min Order (MOQ)</Text>
            <Text style={styles.statValue}>
              {produce.minOrderQuantity.toLocaleString()} {produce.unit}
            </Text>
          </View>
        </View>

        <View style={styles.footer}>
          <View>
            <View style={styles.priceContainer}>
              <Text style={styles.price}>₹{lowestTierPrice}</Text>
              <Text style={styles.unit}>/{produce.unit}</Text>
              {hasBulkDiscount && (
                <Text style={styles.bulkTag}>Bulk Tier</Text>
              )}
            </View>
            <View style={styles.locationRow}>
              <Ionicons name="location-outline" size={12} color={Colors.textMuted} />
              <Text style={styles.locationText} numberOfLines={1}>
                {produce.location.district} ({produce.location.distanceKm} km)
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.actionBtn}
            onPress={handlePress}
            activeOpacity={0.8}
          >
            <Text style={styles.actionBtnText}>Procure</Text>
            <Ionicons name="arrow-forward" size={14} color="#FFFFFF" />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    overflow: 'hidden',
    ...Shadows.card,
  },
  imageContainer: {
    width: '100%',
    height: 160,
    position: 'relative',
    backgroundColor: Colors.surfaceSubtle,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.sm,
    left: Spacing.sm,
  },
  featuredBadge: {
    position: 'absolute',
    top: Spacing.sm,
    right: Spacing.sm,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
  },
  featuredText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  content: {
    padding: Spacing.md + 2,
  },
  farmerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  ratingText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: 21,
  },
  variety: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  statsGrid: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.md,
  },
  statItem: {
    flex: 1,
  },
  statLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  statValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 1,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: Spacing.xs,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
  },
  price: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  unit: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  bulkTag: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: 4,
    marginLeft: 6,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 2,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.lg,
    paddingVertical: 10,
    borderRadius: Radii.md,
  },
  actionBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '700',
  },
});
