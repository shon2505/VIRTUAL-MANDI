import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { VerificationBadge } from '../../components/common/VerificationBadge';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerProfileScreen() {
  const router = useRouter();
  const { buyerProfile, switchRole, logout } = useAuth();

  const handleSwitchToFarmer = async () => {
    await switchRole('farmer');
    router.replace('/(farmer)');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/role-select');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Business Profile"
        subtitle="Institutional Buyer & Procurement Account"
        showRoleToggle={true}
        showCart={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Business Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: buyerProfile?.avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{buyerProfile?.businessName}</Text>
          <Text style={styles.typeText}>{buyerProfile?.businessType} • {buyerProfile?.name}</Text>

          <View style={styles.badgeRow}>
            <VerificationBadge label="✓ Verified Enterprise Buyer" size="md" variant="buyer" />
          </View>

          {/* Volume Stats */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>
                {(buyerProfile?.typicalMonthlyVolumeKg / 1000).toFixed(0)} Tonnes
              </Text>
              <Text style={styles.statLbl}>Monthly Volume</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{buyerProfile?.completedProcurements}</Text>
              <Text style={styles.statLbl}>Orders Received</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>Tier 1</Text>
              <Text style={styles.statLbl}>ONDC Rating</Text>
            </View>
          </View>
        </View>

        {/* GSTIN & Tax Entity */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Business Registration & GST</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>GSTIN:</Text>
            <Text style={styles.infoVal}>{buyerProfile?.gstin}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Entity Category:</Text>
            <Text style={styles.infoVal}>{buyerProfile?.businessType}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoKey}>Payment Settlement:</Text>
            <Text style={styles.infoVal}>{buyerProfile?.preferredPaymentTerms}</Text>
          </View>
        </View>

        {/* Warehouse Network */}
        <View style={styles.sectionCard}>
          <View style={styles.warehouseHeader}>
            <Text style={styles.sectionTitle}>Destination Warehouse Hubs</Text>
            <TouchableOpacity onPress={() => Alert.alert('Add Warehouse', 'Warehouse registration modal.')}>
              <Text style={styles.addWhLink}>+ Add Hub</Text>
            </TouchableOpacity>
          </View>

          {buyerProfile?.warehouses?.map(wh => (
            <View key={wh.id} style={styles.whItem}>
              <View style={styles.whIconBox}>
                <Ionicons name="business" size={16} color="#1E6091" />
              </View>
              <View style={{ flex: 1 }}>
                <View style={styles.whRow}>
                  <Text style={styles.whLabel}>{wh.label}</Text>
                  {wh.isPrimary && (
                    <View style={styles.primaryPill}>
                      <Text style={styles.primaryPillText}>Primary</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.whAddress}>
                  {wh.address}, {wh.city}, {wh.state} ({wh.pincode})
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Switch to Farmer Mode & Logout */}
        <View style={styles.actionCard}>
          <TouchableOpacity
            onPress={handleSwitchToFarmer}
            style={styles.switchModeBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="leaf-outline" size={20} color={Colors.primaryDark} />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Switch to Farmer Mode</Text>
              <Text style={styles.switchSub}>List agricultural produce and manage inventory as a farmer</Text>
            </View>
            <Ionicons name="swap-horizontal" size={18} color={Colors.primaryDark} />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={handleLogout}
            style={styles.logoutBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="log-out-outline" size={18} color={Colors.danger} />
            <Text style={styles.logoutText}>Sign Out of Virtual Mandi</Text>
          </TouchableOpacity>
        </View>
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
  profileCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    alignItems: 'center',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.surfaceSubtle,
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  typeText: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    marginVertical: Spacing.sm,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: '#EBF4FB',
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    width: '100%',
    marginTop: Spacing.md,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#1E6091',
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: '#90CDF4',
  },
  sectionCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  warehouseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  addWhLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E6091',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoKey: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  whItem: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingVertical: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    alignItems: 'center',
  },
  whIconBox: {
    width: 36,
    height: 36,
    borderRadius: Radii.md,
    backgroundColor: '#EBF4FB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  whRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  whLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  primaryPill: {
    backgroundColor: '#EBF4FB',
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  primaryPillText: {
    fontSize: 9,
    fontWeight: '700',
    color: '#1E6091',
  },
  whAddress: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  actionCard: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: Colors.primaryWash,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  switchSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingVertical: Spacing.md,
  },
  logoutText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
  },
});
