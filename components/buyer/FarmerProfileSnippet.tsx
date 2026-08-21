import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { FarmerProfile } from '../../types';
import { VerificationBadge } from '../common/VerificationBadge';
import { Ionicons } from '@expo/vector-icons';

interface FarmerProfileSnippetProps {
  farmer: FarmerProfile;
  onPress?: () => void;
}

export const FarmerProfileSnippet: React.FC<FarmerProfileSnippetProps> = ({
  farmer,
  onPress,
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.container}
    >
      <View style={styles.topRow}>
        <Image
          source={{ uri: farmer.avatarUrl }}
          style={styles.avatar}
          resizeMode="cover"
        />

        <View style={styles.details}>
          <View style={styles.nameRow}>
            <Text style={styles.name} numberOfLines={1}>
              {farmer.farmName}
            </Text>
            {farmer.isVerified && (
              <VerificationBadge label="Verified Farmer" size="sm" />
            )}
          </View>

          <Text style={styles.farmerOwner}>Farmer: {farmer.name}</Text>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.locationText}>
              {farmer.location.village}, {farmer.location.district}, {farmer.location.state}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricItem}>
          <View style={styles.ratingBox}>
            <Ionicons name="star" size={12} color="#D4A373" />
            <Text style={styles.ratingText}>{farmer.rating}</Text>
          </View>
          <Text style={styles.metricLabel}>{farmer.reviewCount} Reviews</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{farmer.completedOrders}</Text>
          <Text style={styles.metricLabel}>Bulk Dispatches</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.metricItem}>
          <Text style={styles.metricValue}>{farmer.landholdingAcres} Acres</Text>
          <Text style={styles.metricLabel}>Farm Size</Text>
        </View>
      </View>

      {farmer.certifications && farmer.certifications.length > 0 && (
        <View style={styles.certRow}>
          {farmer.certifications.map((cert, idx) => (
            <View key={idx} style={styles.certBadge}>
              <Ionicons name="ribbon-outline" size={11} color={Colors.primaryDark} />
              <Text style={styles.certText}>{cert}</Text>
            </View>
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.sm,
    ...Shadows.subtle,
  },
  topRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    alignItems: 'center',
  },
  avatar: {
    width: 52,
    height: 52,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
  },
  details: {
    flex: 1,
  },
  nameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.xs,
  },
  name: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  farmerOwner: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    marginTop: 3,
  },
  locationText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    paddingVertical: Spacing.sm,
    marginTop: Spacing.md,
  },
  metricItem: {
    alignItems: 'center',
  },
  ratingBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
  },
  ratingText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricValue: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  metricLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 1,
  },
  divider: {
    width: 1,
    height: 22,
    backgroundColor: Colors.border,
  },
  certRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginTop: Spacing.sm,
  },
  certBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  certText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.primaryDark,
  },
});
