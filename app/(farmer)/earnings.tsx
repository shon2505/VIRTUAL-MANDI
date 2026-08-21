import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { Header } from '../../components/common/Header';
import { StatCard } from '../../components/common/StatCard';
import { EarningsChart } from '../../components/farmer/EarningsChart';
import { MOCK_EARNINGS_STATS } from '../../services/mockData';
import { Ionicons } from '@expo/vector-icons';

export default function FarmerEarningsScreen() {
  const stats = MOCK_EARNINGS_STATS;

  return (
    <View style={styles.container}>
      <Header
        title="Financials & Earnings"
        subtitle="APMC Mandi Escrow Payouts & Settlement Ledger"
        showRoleToggle={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Metric Cards */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricRow}>
            <StatCard
              label="Total Revenue"
              value={`₹${stats.totalRevenue.toLocaleString()}`}
              iconName="wallet"
              iconColor={Colors.primary}
              trend={{ value: '+22.4%', isPositive: true }}
              accentColor={Colors.primary}
            />
            <StatCard
              label="This Month (Aug)"
              value={`₹${stats.thisMonthRevenue.toLocaleString()}`}
              iconName="calendar"
              iconColor={Colors.primaryAccent}
              subtext="Settled in bank"
            />
          </View>

          <View style={styles.metricRow}>
            <StatCard
              label="Pending in Escrow"
              value={`₹${stats.pendingEscrow.toLocaleString()}`}
              iconName="lock-closed"
              iconColor={Colors.amber}
              subtext="Releases upon delivery"
              accentColor={Colors.amber}
            />
            <StatCard
              label="Completed Dispatches"
              value={stats.completedOrdersCount}
              iconName="checkmark-done-circle"
              iconColor={Colors.textSecondary}
              subtext="100% On-time delivery"
            />
          </View>
        </View>

        {/* Bank Account Card */}
        <View style={styles.bankCard}>
          <View style={styles.bankHeader}>
            <View style={styles.bankLogo}>
              <Ionicons name="card" size={18} color="#FFFFFF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.bankName}>State Bank of India</Text>
              <Text style={styles.accountNumber}>•••• •••• •••• 8842 (Agri Savings)</Text>
            </View>
            <View style={styles.verifiedTag}>
              <Ionicons name="checkmark-circle" size={12} color={Colors.primaryDark} />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.bankNote}>
            Direct RTGS / NEFT automatic payout upon warehouse weighment verification.
          </Text>
        </View>

        {/* Visual Monthly Revenue Chart */}
        <EarningsChart
          data={stats.monthlyBreakdown}
          totalEarnings={stats.totalRevenue}
        />

        {/* Transaction History Ledger */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Mandi Settlement Ledger</Text>
          <Text style={styles.sectionSub}>All payments guaranteed by ONDC Escrow</Text>
        </View>

        {stats.transactions.map(tx => {
          const isSettled = tx.status === 'settled';

          return (
            <View key={tx.id} style={styles.txCard}>
              <View style={styles.txTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.txProduce}>{tx.produce}</Text>
                  <Text style={styles.txBuyer}>Buyer: {tx.buyer}</Text>
                </View>
                <Text style={styles.txAmount}>₹{tx.amount.toLocaleString()}</Text>
              </View>

              <View style={styles.txBottom}>
                <View style={styles.txDateRow}>
                  <Ionicons name="time-outline" size={12} color={Colors.textMuted} />
                  <Text style={styles.txDate}>{tx.date}</Text>
                </View>

                <View
                  style={[
                    styles.statusPill,
                    isSettled ? styles.statusSettled : styles.statusEscrow,
                  ]}
                >
                  <Ionicons
                    name={isSettled ? 'checkmark' : 'lock-closed'}
                    size={10}
                    color={isSettled ? Colors.success : Colors.amberDark}
                  />
                  <Text
                    style={[
                      styles.statusPillText,
                      { color: isSettled ? Colors.success : Colors.amberDark },
                    ]}
                  >
                    {isSettled ? 'Settled to Bank' : 'Locked in Escrow'}
                  </Text>
                </View>
              </View>

              <Text style={styles.utrText}>Ref: {tx.payoutRef}</Text>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  metricsGrid: {
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  metricRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  bankCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  bankHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.xs,
  },
  bankLogo: {
    width: 38,
    height: 38,
    borderRadius: Radii.md,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankName: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  accountNumber: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  verifiedTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  verifiedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  bankNote: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
    lineHeight: 15,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  txCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  txTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  txProduce: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  txBuyer: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  txAmount: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  txBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  txDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  txDate: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  statusSettled: {
    backgroundColor: Colors.successBg,
  },
  statusEscrow: {
    backgroundColor: Colors.warningBg,
  },
  statusPillText: {
    fontSize: 10,
    fontWeight: '700',
  },
  utrText: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
