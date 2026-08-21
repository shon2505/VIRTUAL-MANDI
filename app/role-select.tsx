import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/common/Button';

export default function RoleSelectScreen() {
  const router = useRouter();
  const { setRole } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'farmer' | 'buyer'>('farmer');

  const handleContinue = async () => {
    await setRole(selectedRole);
    if (selectedRole === 'farmer') {
      router.replace('/(farmer)');
    } else {
      router.replace('/(buyer)');
    }
  };

  const handleLoginPress = () => {
    router.push({
      pathname: '/auth/login',
      params: { defaultRole: selectedRole },
    });
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <Text style={styles.stepIndicator}>Step 1 of 2</Text>
        </View>

        <View style={styles.headlineSection}>
          <Text style={styles.headline}>
            How will you use{'\n'}Virtual Mandi?
          </Text>
          <Text style={styles.subheadline}>
            Select your account type to access purpose-built tools for agricultural trade.
          </Text>
        </View>

        {/* Role Option 1: Farmer */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedRole('farmer')}
          style={[
            styles.roleCard,
            selectedRole === 'farmer' && styles.roleCardActiveFarmer,
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.roleIconCircle,
                selectedRole === 'farmer' && styles.iconCircleActiveFarmer,
              ]}
            >
              <Ionicons
                name="leaf"
                size={28}
                color={selectedRole === 'farmer' ? '#FFFFFF' : Colors.primaryDark}
              />
            </View>

            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedRole === 'farmer' && styles.radioOuterActiveFarmer,
                ]}
              >
                {selectedRole === 'farmer' && (
                  <View style={styles.radioInnerFarmer} />
                )}
              </View>
            </View>
          </View>

          <Text style={styles.roleTitle}>Farmer / Producer</Text>
          <Text style={styles.roleTagline}>
            Sell your produce directly to bulk businesses & retail chains.
          </Text>

          <View style={styles.perksList}>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primaryAccent} />
              <Text style={styles.perkText}>Set your own wholesale prices & MOQ</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primaryAccent} />
              <Text style={styles.perkText}>Zero middleman commission • 100% Escrow security</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color={Colors.primaryAccent} />
              <Text style={styles.perkText}>Direct truck pickup from farm gate / Mandi dock</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Role Option 2: Bulk Buyer */}
        <TouchableOpacity
          activeOpacity={0.9}
          onPress={() => setSelectedRole('buyer')}
          style={[
            styles.roleCard,
            selectedRole === 'buyer' && styles.roleCardActiveBuyer,
          ]}
        >
          <View style={styles.cardHeader}>
            <View
              style={[
                styles.roleIconCircle,
                selectedRole === 'buyer' && styles.iconCircleActiveBuyer,
              ]}
            >
              <Ionicons
                name="business"
                size={28}
                color={selectedRole === 'buyer' ? '#FFFFFF' : '#1E6091'}
              />
            </View>

            <View style={styles.radioContainer}>
              <View
                style={[
                  styles.radioOuter,
                  selectedRole === 'buyer' && styles.radioOuterActiveBuyer,
                ]}
              >
                {selectedRole === 'buyer' && (
                  <View style={styles.radioInnerBuyer} />
                )}
              </View>
            </View>
          </View>

          <Text style={styles.roleTitle}>Bulk Buyer / Business</Text>
          <Text style={styles.roleTagline}>
            Source fresh, graded produce directly from verified farms.
          </Text>

          <View style={styles.perksList}>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color="#1E6091" />
              <Text style={styles.perkText}>Tiered wholesale volume discounts</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color="#1E6091" />
              <Text style={styles.perkText}>Custom RFQs for bulk truckloads (5,000+ kg)</Text>
            </View>
            <View style={styles.perkRow}>
              <Ionicons name="checkmark-circle" size={16} color="#1E6091" />
              <Text style={styles.perkText}>ONDC verified quality inspection & cold transit</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Continue CTA */}
        <View style={styles.footerSection}>
          <Button
            title={`Enter as ${selectedRole === 'farmer' ? 'Farmer' : 'Bulk Buyer'}`}
            onPress={handleContinue}
            variant={selectedRole === 'farmer' ? 'primary' : 'secondary'}
            size="lg"
            fullWidth
            iconName="arrow-forward"
            iconPosition="right"
          />

          <TouchableOpacity
            onPress={handleLoginPress}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>
              Already have an account? <Text style={styles.loginLinkBold}>Sign In</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.lg,
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  stepIndicator: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  headlineSection: {
    marginBottom: Spacing.xl,
  },
  headline: {
    fontSize: 26,
    lineHeight: 32,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  subheadline: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
  roleCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    borderWidth: 2,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  roleCardActiveFarmer: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryWash,
    ...Shadows.card,
  },
  roleCardActiveBuyer: {
    borderColor: '#1E6091',
    backgroundColor: '#F0F7FC',
    ...Shadows.card,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  roleIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconCircleActiveFarmer: {
    backgroundColor: Colors.primary,
  },
  iconCircleActiveBuyer: {
    backgroundColor: '#1E6091',
  },
  radioContainer: {
    padding: 4,
  },
  radioOuter: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioOuterActiveFarmer: {
    borderColor: Colors.primary,
  },
  radioOuterActiveBuyer: {
    borderColor: '#1E6091',
  },
  radioInnerFarmer: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.primary,
  },
  radioInnerBuyer: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#1E6091',
  },
  roleTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  roleTagline: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  perksList: {
    gap: 8,
    paddingTop: Spacing.sm,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  perkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  perkText: {
    fontSize: 12,
    fontWeight: '500',
    color: Colors.textPrimary,
    flex: 1,
  },
  footerSection: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xxl,
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: Spacing.md,
  },
  loginLinkText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  loginLinkBold: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
