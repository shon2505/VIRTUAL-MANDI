import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';

interface MonthlyData {
  month: string;
  amount: number;
}

interface EarningsChartProps {
  data: MonthlyData[];
  totalEarnings: number;
}

export const EarningsChart: React.FC<EarningsChartProps> = ({ data, totalEarnings }) => {
  const maxAmount = Math.max(...data.map(d => d.amount), 1);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Revenue Trend</Text>
          <Text style={styles.subtitle}>Last 6 Months (Direct Mandi Settlements)</Text>
        </View>
        <Text style={styles.totalBadge}>₹{totalEarnings.toLocaleString()}</Text>
      </View>

      <View style={styles.chartContainer}>
        {data.map((item, index) => {
          const heightPct = Math.round((item.amount / maxAmount) * 100);
          const isLatest = index === data.length - 1;

          return (
            <View key={item.month} style={styles.barColumn}>
              <Text style={styles.barValue}>₹{(item.amount / 1000).toFixed(0)}k</Text>
              <View style={styles.barTrack}>
                <View
                  style={[
                    styles.barFill,
                    { height: `${heightPct}%` },
                    isLatest ? styles.barFillLatest : styles.barFillDefault,
                  ]}
                />
              </View>
              <Text style={[styles.monthLabel, isLatest && styles.monthLabelLatest]}>
                {item.month}
              </Text>
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
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  totalBadge: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    overflow: 'hidden',
  },
  chartContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: 140,
    paddingTop: Spacing.md,
  },
  barColumn: {
    alignItems: 'center',
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  barValue: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  barTrack: {
    width: 22,
    height: 90,
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.pill,
    justifyContent: 'flex-end',
    overflow: 'hidden',
  },
  barFill: {
    width: '100%',
    borderRadius: Radii.pill,
  },
  barFillDefault: {
    backgroundColor: Colors.primaryMedium,
  },
  barFillLatest: {
    backgroundColor: Colors.primaryAccent,
  },
  monthLabel: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 6,
  },
  monthLabelLatest: {
    color: Colors.primaryDark,
    fontWeight: '700',
  },
});
