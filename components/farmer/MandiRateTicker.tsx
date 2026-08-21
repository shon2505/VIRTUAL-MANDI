import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { MOCK_MANDI_RATES } from '../../services/mockData';
import { Ionicons } from '@expo/vector-icons';

export const MandiRateTicker: React.FC = () => {
  return (
    <View style={styles.wrapper}>
      <View style={styles.liveTag}>
        <View style={styles.livePulse} />
        <Text style={styles.liveText}>APMC Live</Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {MOCK_MANDI_RATES.map(rate => {
          const isUp = rate.trend === 'up';
          const isDown = rate.trend === 'down';

          return (
            <View key={rate.id} style={styles.tickerCard}>
              <Text style={styles.commodityName}>{rate.commodity}</Text>
              <Text style={styles.mandiName}>{rate.mandi}</Text>

              <View style={styles.priceRow}>
                <Text style={styles.priceText}>
                  ₹{rate.modalPrice}
                  <Text style={styles.quintalUnit}>/qtl</Text>
                </Text>

                <View
                  style={[
                    styles.trendPill,
                    isUp ? styles.trendUp : isDown ? styles.trendDown : styles.trendFlat,
                  ]}
                >
                  <Ionicons
                    name={isUp ? 'arrow-up' : isDown ? 'arrow-down' : 'remove'}
                    size={10}
                    color={isUp ? Colors.success : isDown ? Colors.danger : Colors.textMuted}
                  />
                  <Text
                    style={[
                      styles.trendText,
                      {
                        color: isUp
                          ? Colors.success
                          : isDown
                          ? Colors.danger
                          : Colors.textMuted,
                      },
                    ]}
                  >
                    {Math.abs(rate.priceChange)}%
                  </Text>
                </View>
              </View>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    paddingVertical: Spacing.xs + 2,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveTag: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingLeft: Spacing.md,
    paddingRight: Spacing.sm,
    gap: 4,
    borderRightWidth: 1,
    borderRightColor: Colors.borderLight,
  },
  livePulse: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.terracotta,
  },
  liveText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: Spacing.sm,
    gap: Spacing.sm,
  },
  tickerCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.sm,
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 4,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  commodityName: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  mandiName: {
    fontSize: 9,
    color: Colors.textMuted,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  priceText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  quintalUnit: {
    fontSize: 9,
    fontWeight: '500',
    color: Colors.textMuted,
  },
  trendPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 3,
    paddingVertical: 1,
    borderRadius: 3,
  },
  trendUp: {
    backgroundColor: Colors.successBg,
  },
  trendDown: {
    backgroundColor: Colors.dangerBg,
  },
  trendFlat: {
    backgroundColor: Colors.surface,
  },
  trendText: {
    fontSize: 9,
    fontWeight: '700',
  },
});
