import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../components/common/Button';

export default function SplashScreen() {
  const router = useRouter();
  const { role } = useAuth();

  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.85)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 900,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 6,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start();
  }, [fadeAnim, slideAnim, scaleAnim]);

  const handleGetStarted = () => {
    router.push('/role-select');
  };

  const handleDirectDemo = (selectedRole: 'farmer' | 'buyer') => {
    if (selectedRole === 'farmer') {
      router.replace('/(farmer)');
    } else {
      router.replace('/(buyer)');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }, { scale: scaleAnim }],
          },
        ]}
      >
        {/* Brand Icon Header */}
        <View style={styles.logoContainer}>
          <View style={styles.iconCircle}>
            <Ionicons name="leaf" size={40} color="#FFFFFF" />
          </View>
          <View style={styles.ondcBadge}>
            <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
            <Text style={styles.ondcText}>ONDC Agri-Network Enabled</Text>
          </View>
        </View>

        {/* Title & Tagline */}
        <View style={styles.textContainer}>
          <Text style={styles.title}>Virtual Mandi</Text>
          <Text style={styles.headline}>
            Direct from farms.{'\n'}Built for bulk buying.
          </Text>
          <Text style={styles.subtitle}>
            A modern B2B agricultural marketplace connecting verified Indian farmers directly with commercial bulk buyers.
          </Text>
        </View>

        {/* Journey Graphic Card */}
        <View style={styles.journeyCard}>
          <Text style={styles.journeyHeading}>THE PROCUREMENT PIPELINE</Text>
          <View style={styles.pipelineRow}>
            <View style={styles.node}>
              <View style={styles.nodeIcon}>
                <Ionicons name="leaf-outline" size={18} color={Colors.primaryDark} />
              </View>
              <Text style={styles.nodeLabel}>Farmer</Text>
              <Text style={styles.nodeSub}>Harvest & Grade</Text>
            </View>

            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={14} color={Colors.primaryAccent} />
            </View>

            <View style={styles.node}>
              <View style={[styles.nodeIcon, styles.mandiNode]}>
                <Ionicons name="storefront" size={18} color="#FFFFFF" />
              </View>
              <Text style={[styles.nodeLabel, styles.mandiLabel]}>Virtual Mandi</Text>
              <Text style={styles.nodeSub}>Escrow & Logistics</Text>
            </View>

            <View style={styles.arrow}>
              <Ionicons name="arrow-forward" size={14} color={Colors.primaryAccent} />
            </View>

            <View style={styles.node}>
              <View style={styles.nodeIcon}>
                <Ionicons name="business-outline" size={18} color={Colors.primaryDark} />
              </View>
              <Text style={styles.nodeLabel}>Bulk Buyer</Text>
              <Text style={styles.nodeSub}>Wholesale / Retail</Text>
            </View>
          </View>
        </View>

        {/* Action Buttons */}
        <View style={styles.footerActions}>
          <Button
            title="Get Started • Select Role"
            onPress={handleGetStarted}
            variant="primary"
            size="lg"
            iconName="arrow-forward"
            iconPosition="right"
            fullWidth
            style={{ marginBottom: Spacing.md }}
          />

          <View style={styles.quickEntryRow}>
            <Text style={styles.quickEntryLabel}>Fast Demo Entry:</Text>
            <View style={styles.quickButtons}>
              <TouchableOpacity
                onPress={() => handleDirectDemo('farmer')}
                style={styles.quickBtn}
                activeOpacity={0.7}
              >
                <Ionicons name="leaf" size={14} color={Colors.primaryDark} />
                <Text style={styles.quickBtnText}>Farmer App</Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => handleDirectDemo('buyer')}
                style={[styles.quickBtn, styles.quickBtnBuyer]}
                activeOpacity={0.7}
              >
                <Ionicons name="cart" size={14} color="#1E6091" />
                <Text style={[styles.quickBtnText, { color: '#1E6091' }]}>Bulk Buyer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.lg,
    justifyContent: 'space-between',
  },
  logoContainer: {
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.elevated,
  },
  ondcBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primaryMedium,
    paddingHorizontal: Spacing.md,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    marginTop: Spacing.md,
    gap: 5,
  },
  ondcText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.3,
  },
  textContainer: {
    alignItems: 'center',
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
    textTransform: 'uppercase',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  headline: {
    fontSize: 28,
    lineHeight: 34,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.sm,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  journeyCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  journeyHeading: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  pipelineRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  node: {
    alignItems: 'center',
    flex: 1,
  },
  nodeIcon: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  mandiNode: {
    backgroundColor: Colors.primary,
  },
  nodeLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  mandiLabel: {
    color: Colors.primaryDark,
  },
  nodeSub: {
    fontSize: 9,
    color: Colors.textMuted,
    textAlign: 'center',
    marginTop: 1,
  },
  arrow: {
    paddingHorizontal: 2,
    marginBottom: 16,
  },
  footerActions: {
    width: '100%',
  },
  quickEntryRow: {
    alignItems: 'center',
    gap: Spacing.xs,
  },
  quickEntryLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  quickButtons: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  quickBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.primarySubtle,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    borderWidth: 1,
    borderColor: Colors.primaryAccent,
  },
  quickBtnBuyer: {
    backgroundColor: '#EBF4FB',
    borderColor: '#90CDF4',
  },
  quickBtnText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
});
