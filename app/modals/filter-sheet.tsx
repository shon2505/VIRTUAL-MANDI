import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useListings } from '../../context/ListingsContext';
import { Header } from '../../components/common/Header';
import { Button } from '../../components/common/Button';
import { CATEGORIES, GRADES } from '../../constants/categories';
import { ProduceCategory, ProduceGrade } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function FilterSheetModal() {
  const router = useRouter();
  const { activeFilter, setFilter, resetFilter } = useListings();

  const [category, setCategory] = useState<ProduceCategory>(
    activeFilter.category || 'all'
  );
  const [grade, setGrade] = useState<ProduceGrade | undefined>(
    activeFilter.grade
  );
  const [minQuantity, setMinQuantity] = useState<number | undefined>(
    activeFilter.minQuantity
  );
  const [maxDistanceKm, setMaxDistanceKm] = useState<number | undefined>(
    activeFilter.maxDistanceKm
  );
  const [verifiedOnly, setVerifiedOnly] = useState<boolean>(
    activeFilter.verifiedOnly || false
  );
  const [sortBy, setSortBy] = useState<any>(
    activeFilter.sortBy || 'price_asc'
  );

  const handleApply = () => {
    setFilter({
      category,
      grade,
      minQuantity,
      maxDistanceKm,
      verifiedOnly,
      sortBy,
    });
    router.back();
  };

  const handleReset = () => {
    resetFilter();
    setCategory('all');
    setGrade(undefined);
    setMinQuantity(undefined);
    setMaxDistanceKm(undefined);
    setVerifiedOnly(false);
    setSortBy('price_asc');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Filter Wholesale Produce"
        subtitle="Refine marketplace search"
        showBack={true}
        showRoleToggle={false}
        rightAction={
          <TouchableOpacity onPress={handleReset} style={styles.resetBtn}>
            <Text style={styles.resetText}>Reset All</Text>
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Produce Category</Text>
          <View style={styles.chipsWrap}>
            {CATEGORIES.map(cat => (
              <TouchableOpacity
                key={cat.id}
                onPress={() => setCategory(cat.id as ProduceCategory)}
                style={[
                  styles.chip,
                  category === cat.id && styles.chipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    category === cat.id && styles.chipTextActive,
                  ]}
                >
                  {cat.name}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quality Grade Standard */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Quality Grade Standard</Text>
          <View style={styles.chipsWrap}>
            <TouchableOpacity
              onPress={() => setGrade(undefined)}
              style={[
                styles.chip,
                grade === undefined && styles.chipActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.chipText,
                  grade === undefined && styles.chipTextActive,
                ]}
              >
                All Grades
              </Text>
            </TouchableOpacity>

            {GRADES.map(g => (
              <TouchableOpacity
                key={g.id}
                onPress={() => setGrade(g.id as ProduceGrade)}
                style={[
                  styles.chip,
                  grade === g.id && styles.chipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    grade === g.id && styles.chipTextActive,
                  ]}
                >
                  {g.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity Volume Brackets */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Batch Quantity Available</Text>
          <View style={styles.chipsWrap}>
            {[
              { label: 'Any Quantity', val: undefined },
              { label: '500+ kg', val: 500 },
              { label: '1,000+ kg (1 Tonne)', val: 1000 },
              { label: '5,000+ kg (Full Truckload)', val: 5000 },
            ].map((q, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setMinQuantity(q.val)}
                style={[
                  styles.chip,
                  minQuantity === q.val && styles.chipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    minQuantity === q.val && styles.chipTextActive,
                  ]}
                >
                  {q.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Distance Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Mandi Origin Distance</Text>
          <View style={styles.chipsWrap}>
            {[
              { label: 'All Regions', val: undefined },
              { label: 'Within 50 km (Nearby)', val: 50 },
              { label: 'Within 100 km', val: 100 },
              { label: 'Within 250 km', val: 250 },
            ].map((d, idx) => (
              <TouchableOpacity
                key={idx}
                onPress={() => setMaxDistanceKm(d.val)}
                style={[
                  styles.chip,
                  maxDistanceKm === d.val && styles.chipActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.chipText,
                    maxDistanceKm === d.val && styles.chipTextActive,
                  ]}
                >
                  {d.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Verified Farmer Toggle */}
        <View style={styles.section}>
          <TouchableOpacity
            onPress={() => setVerifiedOnly(!verifiedOnly)}
            style={styles.toggleRow}
            activeOpacity={0.8}
          >
            <Ionicons
              name={verifiedOnly ? 'checkbox' : 'square-outline'}
              size={22}
              color={verifiedOnly ? Colors.primary : Colors.textMuted}
            />
            <View style={{ flex: 1, marginLeft: Spacing.sm }}>
              <Text style={styles.toggleTitle}>✓ Verified Farmers Only</Text>
              <Text style={styles.toggleSub}>
                Show only APMC-registered producers with verified KYC and landholding
              </Text>
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Footer */}
      <View style={styles.modalFooter}>
        <Button
          title="Apply Filters"
          onPress={handleApply}
          variant="primary"
          size="lg"
          fullWidth
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  resetBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  resetText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 90,
  },
  section: {
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
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: Spacing.sm,
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
  },
  chip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
  },
  toggleTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  toggleSub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  modalFooter: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    ...Shadows.elevated,
  },
});
