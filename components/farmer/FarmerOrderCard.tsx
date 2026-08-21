import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { Order, OrderStatus } from '../../types';
import { StatusBadge } from '../common/StatusBadge';
import { Button } from '../common/Button';
import { Ionicons } from '@expo/vector-icons';

interface FarmerOrderCardProps {
  order: Order;
  onPress: () => void;
  onStatusTransition?: (orderId: string, nextStatus: OrderStatus) => void;
}

export const FarmerOrderCard: React.FC<FarmerOrderCardProps> = ({
  order,
  onPress,
  onStatusTransition,
}) => {
  const primaryItem = order.items[0];

  const getNextAction = (): { label: string; nextStatus: OrderStatus; icon: keyof typeof Ionicons.glyphMap } | null => {
    switch (order.status) {
      case 'new':
        return { label: 'Accept Order', nextStatus: 'accepted', icon: 'checkmark-circle-outline' };
      case 'accepted':
        return { label: 'Start Packing', nextStatus: 'preparing', icon: 'cube-outline' };
      case 'preparing':
        return { label: 'Ready for Pickup', nextStatus: 'ready_for_pickup', icon: 'checkmark-done-outline' };
      default:
        return null;
    }
  };

  const nextAction = getNextAction();

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.header}>
        <View>
          <Text style={styles.orderNumber}>{order.orderNumber}</Text>
          <Text style={styles.timestamp}>{order.timeline[0]?.timestamp || 'Recent'}</Text>
        </View>
        <StatusBadge type="order" value={order.status} size="sm" />
      </View>

      <View style={styles.contentRow}>
        {primaryItem?.imageUrl ? (
          <Image
            source={{ uri: primaryItem.imageUrl }}
            style={styles.itemImage}
            resizeMode="cover"
          />
        ) : (
          <View style={[styles.itemImage, styles.placeholderImage]}>
            <Ionicons name="leaf" size={24} color={Colors.primaryAccent} />
          </View>
        )}

        <View style={styles.itemInfo}>
          <Text style={styles.produceName} numberOfLines={1}>
            {primaryItem?.produceName}
          </Text>
          <Text style={styles.quantityText}>
            Quantity: <Text style={styles.bold}>{primaryItem?.quantity} kg</Text> @ ₹{primaryItem?.unitPrice}/kg
          </Text>
          <View style={styles.buyerRow}>
            <Ionicons name="business-outline" size={13} color={Colors.textMuted} />
            <Text style={styles.buyerName} numberOfLines={1}>
              {order.businessName}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.footer}>
        <View>
          <Text style={styles.payoutLabel}>Farmer Payout</Text>
          <Text style={styles.payoutAmount}>₹{order.produceSubtotal.toLocaleString()}</Text>
        </View>

        <View style={styles.actions}>
          {nextAction && onStatusTransition ? (
            <Button
              title={nextAction.label}
              iconName={nextAction.icon}
              size="sm"
              variant={order.status === 'new' ? 'primary' : 'outline'}
              onPress={() => onStatusTransition(order.id, nextAction.nextStatus)}
            />
          ) : (
            <TouchableOpacity
              onPress={onPress}
              style={styles.viewDetailBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.viewDetailText}>View Timeline</Text>
              <Ionicons name="chevron-forward" size={14} color={Colors.primaryMedium} />
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  orderNumber: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  contentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    paddingVertical: Spacing.xs,
  },
  itemImage: {
    width: 64,
    height: 64,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
  },
  placeholderImage: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  itemInfo: {
    flex: 1,
  },
  produceName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  quantityText: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  buyerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 4,
  },
  buyerName: {
    fontSize: 12,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.md,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  payoutLabel: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  payoutAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginTop: 1,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewDetailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  viewDetailText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.primaryMedium,
  },
});
