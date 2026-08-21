import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';

interface InventoryProgressBarProps {
  total: number;
  available: number;
  reserved: number;
  sold: number;
  unit?: string;
  showLabels?: boolean;
}

export const InventoryProgressBar: React.FC<InventoryProgressBarProps> = ({
  total,
  available,
  reserved,
  sold,
  unit = 'kg',
  showLabels = true,
}) => {
  const safeTotal = total > 0 ? total : 1;
  const availablePct = Math.min(100, Math.max(0, (available / safeTotal) * 100));
  const reservedPct = Math.min(100, Math.max(0, (reserved / safeTotal) * 100));
  const soldPct = Math.min(100, Math.max(0, (sold / safeTotal) * 100));

  return (
    <View style={styles.container}>
      <View style={styles.barContainer}>
        {availablePct > 0 && (
          <View style={[styles.segment, { width: `${availablePct}%`, backgroundColor: Colors.primaryAccent }]} />
        )}
        {reservedPct > 0 && (
          <View style={[styles.segment, { width: `${reservedPct}%`, backgroundColor: Colors.amber }]} />
        )}
        {soldPct > 0 && (
          <View style={[styles.segment, { width: `${soldPct}%`, backgroundColor: Colors.textMuted }]} />
        )}
      </View>

      {showLabels && (
        <View style={styles.labelsRow}>
          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: Colors.primaryAccent }]} />
            <Text style={styles.labelText}>
              Available: <Text style={styles.bold}>{available.toLocaleString()} {unit}</Text>
            </Text>
          </View>

          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: Colors.amber }]} />
            <Text style={styles.labelText}>
              Reserved: <Text style={styles.bold}>{reserved.toLocaleString()} {unit}</Text>
            </Text>
          </View>

          <View style={styles.labelItem}>
            <View style={[styles.dot, { backgroundColor: Colors.textMuted }]} />
            <Text style={styles.labelText}>
              Sold: <Text style={styles.bold}>{sold.toLocaleString()} {unit}</Text>
            </Text>
          </View>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.xs,
  },
  barContainer: {
    height: 10,
    borderRadius: Radii.pill,
    backgroundColor: Colors.borderLight,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  segment: {
    height: '100%',
  },
  labelsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: Spacing.sm,
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  labelItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  dot: {
    width: 7,
    height: 7,
    borderRadius: 4,
  },
  labelText: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
