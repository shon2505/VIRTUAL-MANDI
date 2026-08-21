import React, { useEffect, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Animated,
  SafeAreaView,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { Button } from '../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerOrderSuccessScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    orderId?: string;
    orderNumber?: string;
    grandTotal?: string;
    businessName?: string;
  }>();

  const scaleAnim = useRef(new Animated.Value(0.7)).current;
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 5,
        tension: 40,
        useNativeDriver: true,
      }),
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 700,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, fadeAnim]);

  const handleTrackOrder = () => {
    if (params.orderId) {
      router.replace(`/(buyer)/orders/${params.orderId}` as any);
    } else {
      router.replace('/(buyer)/orders');
    }
  };

  const handleReturnHome = () => {
    router.replace('/(buyer)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Celebration Circle */}
        <View style={styles.celebrationCircle}>
          <Text style={styles.wheatEmoji}>🌾</Text>
        </View>

        <Text style={styles.headline}>Order secured.</Text>
        <Text style={styles.subtitle}>
          Your bulk agricultural procurement order has been locked with 100% ONDC Escrow security.
        </Text>

        {/* The Journey Graphic: Farm -> Virtual Mandi -> Your Business */}
        <View style={styles.journeyBox}>
          <Text style={styles.journeyHeader}>FULFILLMENT PIPELINE IN MOTION</Text>

          <View style={styles.journeyFlow}>
            <View style={styles.journeyNode}>
              <View style={styles.nodeCircle}>
                <Ionicons name="leaf" size={16} color={Colors.primaryDark} />
              </View>
              <Text style={styles.nodeLabel}>Farmer Batch</Text>
              <Text style={styles.nodeSub}>Grading & Packing</Text>
            </View>

            <View style={styles.arrowCol}>
              <Ionicons name="arrow-forward" size={16} color={Colors.primaryAccent} />
            </View>

            <View style={styles.journeyNode}>
              <View style={[styles.nodeCircle, styles.mandiNodeCircle]}>
                <Ionicons name="shield-checkmark" size={16} color="#FFFFFF" />
              </View>
              <Text style={[styles.nodeLabel, styles.mandiLabel]}>Virtual Mandi</Text>
              <Text style={styles.nodeSub}>Escrow Protected</Text>
            </View>

            <View style={styles.arrowCol}>
              <Ionicons name="arrow-forward" size={16} color={Colors.primaryAccent} />
            </View>

            <View style={styles.journeyNode}>
              <View style={styles.nodeCircle}>
                <Ionicons name="business" size={16} color={Colors.primaryDark} />
              </View>
              <Text style={styles.nodeLabel}>Your Business</Text>
              <Text style={styles.nodeSub}>Dock Delivery</Text>
            </View>
          </View>
        </View>

        {/* Order Details Snippet */}
        <View style={styles.detailsCard}>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Order ID:</Text>
            <Text style={styles.detailVal}>{params.orderNumber || 'VM-2026-98240'}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Procurement Total:</Text>
            <Text style={styles.detailVal}>₹{parseInt(params.grandTotal || '25136', 10).toLocaleString()}</Text>
          </View>
          <View style={styles.detailRow}>
            <Text style={styles.detailKey}>Escrow Protection:</Text>
            <Text style={[styles.detailVal, { color: Colors.success }]}>Active (Protected)</Text>
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <Button
            title="Track Order & Live Timeline 🚚"
            onPress={handleTrackOrder}
            variant="primary"
            size="lg"
            fullWidth
            style={{ marginBottom: Spacing.sm }}
          />

          <Button
            title="Return to Marketplace"
            onPress={handleReturnHome}
            variant="ghost"
            size="md"
            fullWidth
          />
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
    paddingVertical: Spacing.xxl,
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  celebrationCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.md,
    ...Shadows.card,
  },
  wheatEmoji: {
    fontSize: 44,
  },
  headline: {
    fontSize: 30,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: Spacing.md,
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    maxWidth: 320,
  },
  journeyBox: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
    marginVertical: Spacing.md,
  },
  journeyHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 1,
    textAlign: 'center',
    marginBottom: Spacing.md,
  },
  journeyFlow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  journeyNode: {
    alignItems: 'center',
    flex: 1,
  },
  nodeCircle: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mandiNodeCircle: {
    backgroundColor: Colors.primary,
  },
  nodeLabel: {
    fontSize: 11,
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
  arrowCol: {
    paddingHorizontal: 2,
    marginBottom: 16,
  },
  detailsCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    width: '100%',
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  detailKey: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  detailVal: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actions: {
    width: '100%',
  },
});
