import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../../types';

export default function LoginScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ defaultRole?: string }>();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>(
    (params.defaultRole as UserRole) || 'buyer'
  );
  const [identifier, setIdentifier] = useState('+91 98220 45123');
  const [otp, setOtp] = useState('8842');
  const [loading, setLoading] = useState(false);

  const handleFastFill = (demoRole: UserRole) => {
    setRole(demoRole);
    if (demoRole === 'farmer') {
      setIdentifier('+91 98220 45123 (Ramesh Patil - Farmer)');
      setOtp('8842');
    } else {
      setIdentifier('+91 98450 78210 (MahaFresh Wholesale - Buyer)');
      setOtp('1920');
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      await login(identifier, role);
      if (role === 'farmer') {
        router.replace('/(farmer)');
      } else {
        router.replace('/(buyer)');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity
            onPress={() => router.back()}
            style={styles.backBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>

          <View style={styles.brandHeader}>
            <View style={styles.logoBadge}>
              <Ionicons name="leaf" size={24} color="#FFFFFF" />
            </View>
            <Text style={styles.title}>Sign in to Virtual Mandi</Text>
            <Text style={styles.subtitle}>
              B2B Agricultural Procurement & Direct Farm Trading
            </Text>
          </View>

          {/* Role Pill Switcher */}
          <View style={styles.roleToggle}>
            <TouchableOpacity
              onPress={() => setRole('farmer')}
              style={[styles.roleOption, role === 'farmer' && styles.roleOptionActiveFarmer]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="leaf"
                size={16}
                color={role === 'farmer' ? '#FFFFFF' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'farmer' && styles.roleOptionTextActive,
                ]}
              >
                Farmer Account
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setRole('buyer')}
              style={[styles.roleOption, role === 'buyer' && styles.roleOptionActiveBuyer]}
              activeOpacity={0.8}
            >
              <Ionicons
                name="business"
                size={16}
                color={role === 'buyer' ? '#FFFFFF' : Colors.textMuted}
              />
              <Text
                style={[
                  styles.roleOptionText,
                  role === 'buyer' && styles.roleOptionTextActive,
                ]}
              >
                Bulk Buyer
              </Text>
            </TouchableOpacity>
          </View>

          {/* Form */}
          <View style={styles.formCard}>
            <Input
              label={role === 'farmer' ? 'Mobile Number / Kisan ID' : 'Business Phone / GSTIN'}
              value={identifier}
              onChangeText={setIdentifier}
              placeholder="+91 Mobile number"
              keyboardType="phone-pad"
              prefix="📱"
              required
            />

            <Input
              label="OTP Verification Code"
              value={otp}
              onChangeText={setOtp}
              placeholder="Enter 4-digit code"
              keyboardType="number-pad"
              prefix="🔒"
              helperText="Demo test OTP is prefilled"
              required
            />

            <Button
              title={`Sign In as ${role === 'farmer' ? 'Farmer' : 'Bulk Buyer'}`}
              onPress={handleSignIn}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          {/* Demo Pre-fill helpers */}
          <View style={styles.demoSection}>
            <Text style={styles.demoTitle}>DEMO ONE-TAP LOGIN:</Text>
            <View style={styles.demoButtons}>
              <TouchableOpacity
                onPress={() => handleFastFill('farmer')}
                style={styles.demoBtn}
                activeOpacity={0.7}
              >
                <Text style={styles.demoBtnText}>🌾 Login as Farmer (Ramesh)</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleFastFill('buyer')}
                style={[styles.demoBtn, styles.demoBtnBuyer]}
                activeOpacity={0.7}
              >
                <Text style={[styles.demoBtnText, { color: '#1E6091' }]}>
                  🏢 Login as Buyer (MahaFresh)
                </Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/register')}
            style={styles.registerLink}
            activeOpacity={0.7}
          >
            <Text style={styles.registerLinkText}>
              New to Virtual Mandi? <Text style={styles.registerLinkBold}>Create Account</Text>
            </Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
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
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
  },
  brandHeader: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  logoBadge: {
    width: 52,
    height: 52,
    borderRadius: Radii.lg,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  roleToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.pill,
    padding: 4,
    marginBottom: Spacing.lg,
  },
  roleOption: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radii.pill,
    gap: 6,
  },
  roleOptionActiveFarmer: {
    backgroundColor: Colors.primary,
  },
  roleOptionActiveBuyer: {
    backgroundColor: '#1E6091',
  },
  roleOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  roleOptionTextActive: {
    color: '#FFFFFF',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  demoSection: {
    marginTop: Spacing.xl,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  demoTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
  },
  demoButtons: {
    width: '100%',
    gap: Spacing.xs,
  },
  demoBtn: {
    backgroundColor: Colors.primarySubtle,
    paddingVertical: 10,
    borderRadius: Radii.md,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
  },
  demoBtnBuyer: {
    backgroundColor: '#EBF4FB',
    borderColor: '#90CDF4',
  },
  demoBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  registerLink: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
  },
  registerLinkText: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  registerLinkBold: {
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
