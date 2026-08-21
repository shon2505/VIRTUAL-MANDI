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

export default function FarmerProfileScreen() {
  const router = useRouter();
  const { farmerProfile, switchRole, logout } = useAuth();

  const handleSwitchToBuyer = async () => {
    await switchRole('buyer');
    router.replace('/(buyer)');
  };

  const handleLogout = async () => {
    await logout();
    router.replace('/role-select');
  };

  return (
    <View style={styles.container}>
      <Header
        title="Farmer Profile"
        subtitle="APMC Registered Agricultural Producer"
        showRoleToggle={true}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <Image
            source={{ uri: farmerProfile?.avatarUrl }}
            style={styles.avatar}
          />
          <Text style={styles.name}>{farmerProfile?.name}</Text>
          <Text style={styles.farmName}>{farmerProfile?.farmName}</Text>

          <View style={styles.badgeRow}>
            <VerificationBadge label="✓ Verified Farmer" size="md" />
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={13} color="#D4A373" />
              <Text style={styles.ratingText}>
                {farmerProfile?.rating} ({farmerProfile?.reviewCount} reviews)
              </Text>
            </View>
          </View>

          <View style={styles.locationRow}>
            <Ionicons name="location-outline" size={14} color={Colors.textMuted} />
            <Text style={styles.locationText}>
              {farmerProfile?.location?.village}, {farmerProfile?.location?.district}, {farmerProfile?.location?.state}
            </Text>
          </View>

          {/* Key Stats Bar */}
          <View style={styles.statsBar}>
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{farmerProfile?.landholdingAcres} Acres</Text>
              <Text style={styles.statLbl}>Farm Landholding</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>{farmerProfile?.completedOrders}</Text>
              <Text style={styles.statLbl}>Completed Dispatches</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statCol}>
              <Text style={styles.statVal}>Since 2023</Text>
              <Text style={styles.statLbl}>Member Since</Text>
            </View>
          </View>
        </View>

        {/* Certifications & Trust */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Certifications & Mandi Compliance</Text>
          <View style={styles.certList}>
            {farmerProfile?.certifications?.map((cert, idx) => (
              <View key={idx} style={styles.certItem}>
                <Ionicons name="shield-checkmark" size={18} color={Colors.primaryDark} />
                <Text style={styles.certText}>{cert}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Bank & Settlement Details */}
        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Bank Account & Direct Settlement</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Holder:</Text>
            <Text style={styles.infoValue}>{farmerProfile?.bankDetails?.accountHolder}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Bank Name:</Text>
            <Text style={styles.infoValue}>{farmerProfile?.bankDetails?.bankName}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Account Number:</Text>
            <Text style={styles.infoValue}>{farmerProfile?.bankDetails?.accountNumberMasked}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>IFSC Code:</Text>
            <Text style={styles.infoValue}>{farmerProfile?.bankDetails?.ifscCode}</Text>
          </View>
        </View>

        {/* Switch Mode & Logout */}
        <View style={styles.actionCard}>
          <TouchableOpacity
            onPress={handleSwitchToBuyer}
            style={styles.switchModeBtn}
            activeOpacity={0.8}
          >
            <Ionicons name="cart-outline" size={20} color="#1E6091" />
            <View style={{ flex: 1 }}>
              <Text style={styles.switchTitle}>Switch to Bulk Buyer Mode</Text>
              <Text style={styles.switchSub}>Explore procurement marketplace as a commercial buyer</Text>
            </View>
            <Ionicons name="swap-horizontal" size={18} color="#1E6091" />
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
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  farmName: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.xs,
    marginVertical: Spacing.sm,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.surfaceSubtle,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 2,
  },
  locationText: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    backgroundColor: Colors.primaryWash,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    width: '100%',
    marginTop: Spacing.lg,
  },
  statCol: {
    alignItems: 'center',
  },
  statVal: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  statLbl: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: Colors.primarySubtle,
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
  sectionTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  certList: {
    gap: Spacing.xs,
  },
  certItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    paddingVertical: 4,
  },
  certText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actionCard: {
    gap: Spacing.sm,
    marginTop: Spacing.xs,
  },
  switchModeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    backgroundColor: '#EBF4FB',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#90CDF4',
  },
  switchTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E6091',
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
