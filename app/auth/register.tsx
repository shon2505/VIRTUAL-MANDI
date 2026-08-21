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
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';
import { UserRole } from '../../types';

export default function RegisterScreen() {
  const router = useRouter();
  const { login } = useAuth();

  const [role, setRole] = useState<UserRole>('farmer');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [businessOrFarmName, setBusinessOrFarmName] = useState('');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [gstinOrKisanId, setGstinOrKisanId] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    setLoading(true);
    try {
      await login(phone || '+91 98220 45123', role);
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

          <View style={styles.header}>
            <Text style={styles.title}>Register Account</Text>
            <Text style={styles.subtitle}>
              Join India's direct farm-to-business ONDC network
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
                Farmer / Producer
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

          <View style={styles.formCard}>
            <Input
              label="Full Name / Authorized Signatory"
              value={fullName}
              onChangeText={setFullName}
              placeholder="e.g. Ramesh Baliram Patil"
              required
            />

            <Input
              label="Mobile Number"
              value={phone}
              onChangeText={setPhone}
              placeholder="+91 98XXX XXXXX"
              keyboardType="phone-pad"
              prefix="📱"
              required
            />

            <Input
              label={role === 'farmer' ? 'Farm / Nursery Name' : 'Company / Business Name'}
              value={businessOrFarmName}
              onChangeText={setBusinessOrFarmName}
              placeholder={role === 'farmer' ? 'e.g. Patil Agro Fresh Farms' : 'e.g. MahaFresh Wholesale Ltd'}
              required
            />

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Mandi District"
                  value={district}
                  onChangeText={setDistrict}
                  placeholder="e.g. Nashik"
                  required
                />
              </View>
              <View style={{ width: Spacing.md }} />
              <View style={{ flex: 1 }}>
                <Input
                  label="State"
                  value={state}
                  onChangeText={setState}
                  placeholder="e.g. Maharashtra"
                  required
                />
              </View>
            </View>

            <Input
              label={role === 'farmer' ? 'Kisan Credit Card / PM-Kisan ID (Optional)' : 'GSTIN / Business Registration'}
              value={gstinOrKisanId}
              onChangeText={setGstinOrKisanId}
              placeholder={role === 'farmer' ? 'KCC-98214-MH' : '27AABCM8921R1Z8'}
              helperText="For instant verified trust badge"
            />

            <Button
              title={`Create ${role === 'farmer' ? 'Farmer' : 'Buyer'} Account`}
              onPress={handleRegister}
              variant="primary"
              size="lg"
              loading={loading}
              fullWidth
              style={{ marginTop: Spacing.sm }}
            />
          </View>

          <TouchableOpacity
            onPress={() => router.push('/auth/login')}
            style={styles.loginLink}
            activeOpacity={0.7}
          >
            <Text style={styles.loginLinkText}>
              Already registered? <Text style={styles.loginLinkBold}>Sign In</Text>
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
  header: {
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
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
  row: {
    flexDirection: 'row',
  },
  loginLink: {
    alignItems: 'center',
    paddingVertical: Spacing.xl,
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
