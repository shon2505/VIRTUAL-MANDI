import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { ProduceGrade, ListingStatus, OrderStatus } from '../../types';

interface StatusBadgeProps {
  type: 'grade' | 'listing' | 'order' | 'custom';
  value: ProduceGrade | ListingStatus | OrderStatus | string;
  customLabel?: string;
  size?: 'sm' | 'md';
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  type,
  value,
  customLabel,
  size = 'sm',
}) => {
  let bgColor = Colors.surfaceSubtle;
  let textColor = Colors.textSecondary;
  let label = customLabel || value;

  if (type === 'grade') {
    switch (value) {
      case 'Premium':
        bgColor = Colors.gradePremiumBg;
        textColor = Colors.gradePremium;
        label = 'Grade Premium';
        break;
      case 'A':
        bgColor = Colors.gradeABg;
        textColor = Colors.gradeA;
        label = 'Grade A';
        break;
      case 'B':
        bgColor = Colors.gradeBBg;
        textColor = Colors.gradeB;
        label = 'Grade B';
        break;
    }
  } else if (type === 'listing') {
    switch (value) {
      case 'active':
        bgColor = Colors.successBg;
        textColor = Colors.success;
        label = '● Active';
        break;
      case 'paused':
        bgColor = Colors.warningBg;
        textColor = Colors.warning;
        label = '❚❚ Paused';
        break;
      case 'sold_out':
        bgColor = Colors.dangerBg;
        textColor = Colors.danger;
        label = '✕ Sold Out';
        break;
      case 'draft':
        bgColor = Colors.surfaceSubtle;
        textColor = Colors.textMuted;
        label = '✎ Draft';
        break;
    }
  } else if (type === 'order') {
    switch (value) {
      case 'new':
        bgColor = Colors.infoBg;
        textColor = Colors.info;
        label = 'New Order';
        break;
      case 'accepted':
        bgColor = Colors.primarySubtle;
        textColor = Colors.primaryDark;
        label = 'Accepted';
        break;
      case 'preparing':
        bgColor = '#FEF5E7';
        textColor = '#B07D46';
        label = 'Preparing Crates';
        break;
      case 'ready_for_pickup':
        bgColor = '#EBF4FB';
        textColor = '#1E6091';
        label = 'Ready for Pickup';
        break;
      case 'in_transit':
        bgColor = '#EBF8FF';
        textColor = '#2B6CB0';
        label = 'In Transit 🚚';
        break;
      case 'delivered':
        bgColor = Colors.successBg;
        textColor = Colors.success;
        label = 'Delivered ✓';
        break;
      case 'cancelled':
        bgColor = Colors.dangerBg;
        textColor = Colors.danger;
        label = 'Cancelled';
        break;
    }
  }

  const isSmall = size === 'sm';

  return (
    <View
      style={[
        styles.badge,
        { backgroundColor: bgColor },
        isSmall ? styles.badgeSm : styles.badgeMd,
      ]}
    >
      <Text
        style={[
          styles.badgeText,
          { color: textColor },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  badge: {
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeSm: {
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeMd: {
    paddingHorizontal: 12,
    paddingVertical: 5,
  },
  badgeText: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});
