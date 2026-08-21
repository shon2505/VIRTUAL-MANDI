import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress: () => void;
  iconName?: keyof typeof Ionicons.glyphMap;
  badge?: number | string;
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Chip: React.FC<ChipProps> = ({
  label,
  selected = false,
  onPress,
  iconName,
  badge,
  size = 'md',
  style,
}) => {
  const isSmall = size === 'sm';

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.chip,
        isSmall ? styles.chipSm : styles.chipMd,
        selected ? styles.chipSelected : styles.chipUnselected,
        style,
      ]}
    >
      {iconName && (
        <Ionicons
          name={iconName}
          size={isSmall ? 14 : 16}
          color={selected ? Colors.surface : Colors.textSecondary}
          style={{ marginRight: 5 }}
        />
      )}
      <Text
        style={[
          styles.label,
          isSmall ? styles.labelSm : styles.labelMd,
          selected ? styles.labelSelected : styles.labelUnselected,
        ]}
      >
        {label}
      </Text>
      {badge !== undefined && (
        <Text
          style={[
            styles.badge,
            selected ? styles.badgeSelected : styles.badgeUnselected,
          ]}
        >
          {badge}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.pill,
    borderWidth: 1,
  },
  chipSm: {
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
  },
  chipMd: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
  },
  chipSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipUnselected: {
    backgroundColor: Colors.surface,
    borderColor: Colors.border,
  },
  label: {
    fontWeight: '600',
  },
  labelSm: {
    fontSize: 12,
  },
  labelMd: {
    fontSize: 13,
  },
  labelSelected: {
    color: Colors.surface,
  },
  labelUnselected: {
    color: Colors.textSecondary,
  },
  badge: {
    marginLeft: 6,
    fontSize: 10,
    fontWeight: '700',
    paddingHorizontal: 5,
    paddingVertical: 1,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  badgeSelected: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    color: Colors.surface,
  },
  badgeUnselected: {
    backgroundColor: Colors.surfaceSubtle,
    color: Colors.textMuted,
  },
});
