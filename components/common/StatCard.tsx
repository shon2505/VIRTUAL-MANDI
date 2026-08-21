import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface StatCardProps {
  label: string;
  value: string | number;
  subtext?: string;
  iconName: keyof typeof Ionicons.glyphMap;
  iconColor?: string;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  onPress?: () => void;
  accentColor?: string;
}

export const StatCard: React.FC<StatCardProps> = ({
  label,
  value,
  subtext,
  iconName,
  iconColor = Colors.primary,
  trend,
  onPress,
  accentColor,
}) => {
  const CardWrapper = onPress ? TouchableOpacity : View;

  return (
    <CardWrapper
      // @ts-ignore
      onPress={onPress}
      activeOpacity={0.7}
      style={[
        styles.card,
        accentColor ? { borderLeftWidth: 4, borderLeftColor: accentColor } : null,
      ]}
    >
      <View style={styles.header}>
        <Text style={styles.label} numberOfLines={1}>
          {label}
        </Text>
        <View
          style={[
            styles.iconWrapper,
            { backgroundColor: `${iconColor}15` },
          ]}
        >
          <Ionicons name={iconName} size={18} color={iconColor} />
        </View>
      </View>

      <Text style={styles.value}>{value}</Text>

      {(subtext || trend) && (
        <View style={styles.footer}>
          {trend && (
            <View style={styles.trendRow}>
              <Ionicons
                name={trend.isPositive ? 'trending-up' : 'trending-down'}
                size={14}
                color={trend.isPositive ? Colors.success : Colors.danger}
              />
              <Text
                style={[
                  styles.trendText,
                  { color: trend.isPositive ? Colors.success : Colors.danger },
                ]}
              >
                {trend.value}
              </Text>
            </View>
          )}
          {subtext && <Text style={styles.subtext}>{subtext}</Text>}
        </View>
      )}
    </CardWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    flex: 1,
    minWidth: 140,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  label: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    flex: 1,
  },
  iconWrapper: {
    width: 32,
    height: 32,
    borderRadius: Radii.sm,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: Spacing.xs,
  },
  value: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginVertical: 2,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginTop: 4,
    flexWrap: 'wrap',
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  trendText: {
    fontSize: 11,
    fontWeight: '700',
  },
  subtext: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
