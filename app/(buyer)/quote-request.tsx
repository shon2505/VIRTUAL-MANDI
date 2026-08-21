import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useQuotes } from '../../context/QuotesContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { GRADES, MANDI_HUBS } from '../../constants/categories';
import { ProduceGrade, ProduceCategory } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function QuoteRequestScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{
    produceName?: string;
    category?: string;
    variety?: string;
    grade?: string;
    suggestedRate?: string;
  }>();

  const { submitRFQ } = useQuotes();
  const { buyerProfile } = useAuth();

  const [produceName, setProduceName] = useState(
    params.produceName || 'Lasalgaon Grade A Red Onion'
  );
  const [category, setCategory] = useState<ProduceCategory>(
    (params.category as ProduceCategory) || 'vegetables'
  );
  const [variety, setVariety] = useState(params.variety || 'Garwa Red');
  const [gradeRequired, setGradeRequired] = useState<ProduceGrade>(
    (params.grade as ProduceGrade) || 'A'
  );
  const [targetQuantityKg, setTargetQuantityKg] = useState('5000');
  const [targetPricePerKg, setTargetPricePerKg] = useState(
    params.suggestedRate || '20.0'
  );
  const [deliveryWarehouse, setDeliveryWarehouse] = useState(
    'Pune Central Cold Hub (Bhosari MIDC)'
  );
  const [targetDeliveryDate, setTargetDeliveryDate] = useState('2026-08-18');
  const [specialRequirements, setSpecialRequirements] = useState(
    'Packed in 50kg red ventilated mesh bags. Moisture below 12%.'
  );
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    const qtyNum = parseInt(targetQuantityKg, 10);
    const priceNum = parseFloat(targetPricePerKg);

    if (!produceName.trim()) {
      Alert.alert('Required', 'Please specify produce name.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum <= 0) {
      Alert.alert('Required', 'Please enter valid target bulk quantity (kg).');
      return;
    }

    setSubmitting(true);
    try {
      await submitRFQ({
        buyerId: buyerProfile?.id || 'buyer_mahafresh_1',
        buyerName: buyerProfile?.name || 'Vikramaditya Rao',
        businessName: buyerProfile?.businessName || 'MahaFresh Wholesale Ltd',
        buyerLocation: deliveryWarehouse,
        produceName,
        category,
        variety,
        gradeRequired,
        targetQuantityKg: qtyNum,
        targetPricePerKg: isNaN(priceNum) ? undefined : priceNum,
        deliveryWarehouse,
        targetDeliveryDate,
        specialRequirements,
      });

      Alert.alert(
        'RFQ Broadcasted! 🌾',
        `Your request for ${qtyNum.toLocaleString()} kg of ${produceName} has been broadcasted to verified farmers in the region. Farmers will submit offers shortly.`,
        [
          {
            text: 'Track RFQ Quotes',
            onPress: () => router.replace('/(buyer)/quotes'),
          },
        ]
      );
    } catch (e) {
      Alert.alert('Error', 'Failed to submit RFQ.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Request Bulk Quote (RFQ)"
        subtitle="Broadcast inquiry for wholesale volume deals"
        showBack={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.banner}>
          <Ionicons name="sparkles" size={20} color="#FFFFFF" />
          <View style={{ flex: 1 }}>
            <Text style={styles.bannerTitle}>Institutional Volume Inquiries</Text>
            <Text style={styles.bannerSub}>
              Farmers compete with customized wholesale bids tailored to your delivery date and warehouse dock.
            </Text>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Produce Requirements</Text>

          <Input
            label="Produce Name / Commodity"
            value={produceName}
            onChangeText={setProduceName}
            placeholder="e.g. Grade A Red Onion"
            required
          />

          <Input
            label="Variety / Hybrid (Optional)"
            value={variety}
            onChangeText={setVariety}
            placeholder="e.g. Garwa Red"
          />

          <Text style={styles.inputLabel}>Grade Specification</Text>
          <View style={styles.gradeRow}>
            {GRADES.map(g => (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGradeRequired(g.id as ProduceGrade)}
                style={[
                  styles.gradeChip,
                  gradeRequired === g.id && styles.gradeChipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.gradeChipText,
                    gradeRequired === g.id && styles.gradeChipTextActive,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Input
                label="Required Volume (kg)"
                value={targetQuantityKg}
                onChangeText={setTargetQuantityKg}
                keyboardType="numeric"
                prefix="📦"
                helperText={`= ${(parseInt(targetQuantityKg, 10) || 0) / 1000} Tonnes`}
                required
              />
            </View>
            <View style={{ width: Spacing.md }} />
            <View style={{ flex: 1 }}>
              <Input
                label="Target Rate (₹/kg)"
                value={targetPricePerKg}
                onChangeText={setTargetPricePerKg}
                keyboardType="numeric"
                prefix="₹"
                helperText="Expected wholesale rate"
              />
            </View>
          </View>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>Logistics & Destination Warehouse</Text>

          <Input
            label="Destination Cold Storage / Warehouse Hub"
            value={deliveryWarehouse}
            onChangeText={setDeliveryWarehouse}
            placeholder="Warehouse address"
            prefix="📍"
            required
          />

          <Input
            label="Target Delivery Date"
            value={targetDeliveryDate}
            onChangeText={setTargetDeliveryDate}
            placeholder="YYYY-MM-DD"
            prefix="📅"
            required
          />

          <Input
            label="Packaging & Handling Instructions"
            value={specialRequirements}
            onChangeText={setSpecialRequirements}
            placeholder="e.g. 50kg ventilated mesh bags, palletized crates"
            multiline
            numberOfLines={2}
          />
        </View>

        <Button
          title="Broadcast RFQ to Verified Farmers 🌾"
          onPress={handleSubmit}
          variant="primary"
          size="lg"
          loading={submitting}
          fullWidth
          style={{ marginTop: Spacing.xs, marginBottom: Spacing.xxl }}
        />
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
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  banner: {
    backgroundColor: '#1E6091',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    marginBottom: Spacing.md,
  },
  bannerTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  bannerSub: {
    fontSize: 11,
    color: '#EBF4FB',
    marginTop: 2,
    lineHeight: 15,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    ...Shadows.subtle,
  },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  gradeRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  gradeChip: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  gradeChipActive: {
    backgroundColor: '#1E6091',
    borderColor: '#1E6091',
  },
  gradeChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  gradeChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  row: {
    flexDirection: 'row',
  },
});
