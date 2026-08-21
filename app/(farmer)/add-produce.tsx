import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useListings } from '../../context/ListingsContext';
import { useAuth } from '../../context/AuthContext';
import { Header } from '../../components/common/Header';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { SuccessModal } from '../../components/feedback/SuccessModal';
import { CATEGORIES, GRADES, UNITS, MANDI_HUBS } from '../../constants/categories';
import { ProduceGrade, ProduceCategory, BulkPriceTier } from '../../types';
import { Ionicons } from '@expo/vector-icons';

type WizardStep = 1 | 2 | 3 | 4 | 5;

const SAMPLE_PHOTO_PRESETS = [
  'https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=800&q=80', // Tomato
  'https://images.unsplash.com/photo-1618512496248-a07fe83aa8cb?auto=format&fit=crop&w=800&q=80', // Onion
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&w=800&q=80', // Turmeric
  'https://images.unsplash.com/photo-1541345023926-55d6e0853f4b?auto=format&fit=crop&w=800&q=80', // Pomegranate
  'https://images.unsplash.com/photo-1574323347407-f5e1ad6d020b?auto=format&fit=crop&w=800&q=80', // Wheat
];

export default function AddProduceScreen() {
  const router = useRouter();
  const { addProduce } = useListings();
  const { farmerProfile } = useAuth();

  const [currentStep, setCurrentStep] = useState<WizardStep>(1);
  const [publishing, setPublishing] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Form State
  // Step 1: Product
  const [name, setName] = useState('Premium Hybrid Red Tomato (Abhinav)');
  const [category, setCategory] = useState<ProduceCategory>('vegetables');
  const [variety, setVariety] = useState('Abhinav F1 Hybrid');
  const [grade, setGrade] = useState<ProduceGrade>('Premium');
  const [qualityDesc, setQualityDesc] = useState('Firm red 85-90mm uniform size, 14-day shelf life, zero pesticide residue report attached.');

  // Step 2: Quantity
  const [totalQuantity, setTotalQuantity] = useState('3000');
  const [unit, setUnit] = useState<'kg' | 'quintal' | 'tonne'>('kg');
  const [minOrderQty, setMinOrderQty] = useState('200');

  // Step 3: Pricing
  const [basePrice, setBasePrice] = useState('28');
  const [isNegotiable, setIsNegotiable] = useState(true);
  const [hasTiers, setHasTiers] = useState(true);
  const [tier2Qty, setTier2Qty] = useState('500');
  const [tier2Price, setTier2Price] = useState('26');
  const [tier3Qty, setTier3Qty] = useState('1000');
  const [tier3Price, setTier3Price] = useState('24');

  // Step 4: Location & Harvest
  const [mandiHub, setMandiHub] = useState('Lasalgaon Mandi Hub');
  const [district, setDistrict] = useState('Nashik');
  const [state, setState] = useState('Maharashtra');
  const [harvestDate, setHarvestDate] = useState('2026-08-12');
  const [availableUntil, setAvailableUntil] = useState('2026-08-25');

  // Step 5: Photos
  const [selectedPhoto, setSelectedPhoto] = useState(SAMPLE_PHOTO_PRESETS[0]);

  const handleNext = () => {
    if (currentStep === 1) {
      if (!name.trim() || !variety.trim()) {
        Alert.alert('Required Fields', 'Please enter produce name and variety.');
        return;
      }
    } else if (currentStep === 2) {
      if (!totalQuantity || parseInt(totalQuantity, 10) <= 0) {
        Alert.alert('Required Quantity', 'Please enter available quantity.');
        return;
      }
    } else if (currentStep === 3) {
      if (!basePrice || parseFloat(basePrice) <= 0) {
        Alert.alert('Required Price', 'Please enter base price per unit.');
        return;
      }
    }
    if (currentStep < 5) {
      setCurrentStep((currentStep + 1) as WizardStep);
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep((currentStep - 1) as WizardStep);
    } else {
      router.back();
    }
  };

  const handlePublish = async () => {
    setPublishing(true);
    try {
      const baseNum = parseFloat(basePrice);
      const totalQtyNum = parseInt(totalQuantity, 10);
      const moqNum = parseInt(minOrderQty, 10) || 100;

      const priceTiers: BulkPriceTier[] = [
        { minQty: moqNum, maxQty: parseInt(tier2Qty, 10) - 1, pricePerUnit: baseNum },
      ];

      if (hasTiers) {
        priceTiers.push({
          minQty: parseInt(tier2Qty, 10),
          maxQty: parseInt(tier3Qty, 10) - 1,
          pricePerUnit: parseFloat(tier2Price),
        });
        priceTiers.push({
          minQty: parseInt(tier3Qty, 10),
          pricePerUnit: parseFloat(tier3Price),
        });
      }

      await addProduce({
        farmerId: farmerProfile?.id || 'farmer_ramesh_1',
        farmer: farmerProfile || ({} as any),
        name,
        category,
        variety,
        grade,
        qualityDescription: qualityDesc,
        images: [selectedPhoto],
        totalQuantity: totalQtyNum,
        availableQuantity: totalQtyNum,
        reservedQuantity: 0,
        soldQuantity: 0,
        unit,
        minOrderQuantity: moqNum,
        basePricePerUnit: baseNum,
        isNegotiable,
        priceTiers,
        harvestDate,
        availableFrom: harvestDate,
        availableUntil,
        location: {
          mandiHub,
          district,
          state,
          distanceKm: 28,
        },
        status: 'active',
        featured: false,
      });

      setShowSuccessModal(true);
    } catch (err) {
      Alert.alert('Error', 'Failed to publish produce. Please try again.');
    } finally {
      setPublishing(false);
    }
  };

  const handleSuccessClose = () => {
    setShowSuccessModal(false);
    router.replace('/(farmer)/listings');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <Header
        title="Add Agricultural Produce"
        subtitle={`Step ${currentStep} of 5: ${
          currentStep === 1
            ? 'Product Specs'
            : currentStep === 2
            ? 'Quantity & Stock'
            : currentStep === 3
            ? 'Wholesale Pricing'
            : currentStep === 4
            ? 'Location & Harvest'
            : 'Photos & Verification'
        }`}
        showBack={true}
        showRoleToggle={false}
      />

      {/* Wizard Progress Bar */}
      <View style={styles.progressContainer}>
        {[1, 2, 3, 4, 5].map(step => (
          <View
            key={step}
            style={[
              styles.progressSegment,
              step <= currentStep && styles.progressSegmentActive,
            ]}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* STEP 1: PRODUCT */}
        {currentStep === 1 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Produce Specifications</Text>
            <Text style={styles.stepSubtitle}>
              Specify your crop details so commercial buyers can identify grade standards.
            </Text>

            <Input
              label="Produce Name / Commodity"
              value={name}
              onChangeText={setName}
              placeholder="e.g. Premium Hybrid Red Tomato"
              required
            />

            <Text style={styles.inputLabel}>Category</Text>
            <View style={styles.categoryChips}>
              {CATEGORIES.filter(c => c.id !== 'all').map(cat => (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setCategory(cat.id as ProduceCategory)}
                  style={[
                    styles.choiceChip,
                    category === cat.id && styles.choiceChipActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.choiceChipText,
                      category === cat.id && styles.choiceChipTextActive,
                    ]}
                  >
                    {cat.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Variety / Hybrid Strain"
              value={variety}
              onChangeText={setVariety}
              placeholder="e.g. Abhinav F1 / Garwa Red"
              required
            />

            <Text style={styles.inputLabel}>Quality Grade Standard</Text>
            <View style={styles.gradeCardsRow}>
              {GRADES.map(g => (
                <TouchableOpacity
                  key={g.id}
                  onPress={() => setGrade(g.id as ProduceGrade)}
                  style={[
                    styles.gradeCard,
                    grade === g.id && styles.gradeCardActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text
                    style={[
                      styles.gradeCardTitle,
                      grade === g.id && styles.gradeCardTitleActive,
                    ]}
                  >
                    {g.label}
                  </Text>
                  <Text style={styles.gradeCardDesc}>{g.desc}</Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label="Quality & Shelf Life Specs"
              value={qualityDesc}
              onChangeText={setQualityDesc}
              placeholder="Describe color, sizing, moisture, shelf life, pesticide status"
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* STEP 2: QUANTITY & MOQ */}
        {currentStep === 2 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Quantity & Minimum Order</Text>
            <Text style={styles.stepSubtitle}>
              Define total batch available for sale and your minimum wholesale order threshold.
            </Text>

            <Input
              label="Available Batch Quantity"
              value={totalQuantity}
              onChangeText={setTotalQuantity}
              placeholder="e.g. 3500"
              keyboardType="number-pad"
              prefix="📦"
              required
            />

            <Text style={styles.inputLabel}>Unit of Measurement</Text>
            <View style={styles.unitPillsRow}>
              {UNITS.map(u => (
                <TouchableOpacity
                  key={u.id}
                  onPress={() => setUnit(u.id as any)}
                  style={[
                    styles.unitPill,
                    unit === u.id && styles.unitPillActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Text
                    style={[
                      styles.unitPillText,
                      unit === u.id && styles.unitPillTextActive,
                    ]}
                  >
                    {u.label}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <Input
              label={`Minimum Order Quantity (MOQ in ${unit})`}
              value={minOrderQty}
              onChangeText={setMinOrderQty}
              placeholder="e.g. 200"
              keyboardType="number-pad"
              helperText="Bulk buyers must purchase at least this quantity per order"
              required
            />
          </View>
        )}

        {/* STEP 3: PRICING & TIERS */}
        {currentStep === 3 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Wholesale Pricing Strategy</Text>
            <Text style={styles.stepSubtitle}>
              Set competitive mandi rates and volume discounts to attract high-volume institutional buyers.
            </Text>

            <Input
              label={`Base Wholesale Rate (₹ / ${unit})`}
              value={basePrice}
              onChangeText={setBasePrice}
              placeholder="e.g. 28"
              keyboardType="numeric"
              prefix="₹"
              required
            />

            <TouchableOpacity
              onPress={() => setIsNegotiable(!isNegotiable)}
              style={styles.checkboxRow}
              activeOpacity={0.8}
            >
              <Ionicons
                name={isNegotiable ? 'checkbox' : 'square-outline'}
                size={22}
                color={isNegotiable ? Colors.primary : Colors.textMuted}
              />
              <View style={{ flex: 1, marginLeft: Spacing.sm }}>
                <Text style={styles.checkboxTitle}>Allow RFQ Bidding & Price Negotiation</Text>
                <Text style={styles.checkboxSubtitle}>
                  Institutional buyers can send bulk quote inquiries for large truckloads (5,000+ kg)
                </Text>
              </View>
            </TouchableOpacity>

            <View style={styles.tierSection}>
              <View style={styles.tierHeader}>
                <Text style={styles.tierTitle}>Volume Tier Discount Matrix</Text>
                <TouchableOpacity onPress={() => setHasTiers(!hasTiers)}>
                  <Text style={styles.tierToggleText}>{hasTiers ? 'Disable Tiers' : 'Enable Tiers'}</Text>
                </TouchableOpacity>
              </View>

              {hasTiers && (
                <View style={styles.tierInputs}>
                  <View style={styles.tierRow}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Tier 2 (Min Qty)"
                        value={tier2Qty}
                        onChangeText={setTier2Qty}
                        keyboardType="numeric"
                        suffix={unit}
                      />
                    </View>
                    <View style={{ width: Spacing.md }} />
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Rate (₹/unit)"
                        value={tier2Price}
                        onChangeText={setTier2Price}
                        keyboardType="numeric"
                        prefix="₹"
                      />
                    </View>
                  </View>

                  <View style={styles.tierRow}>
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Tier 3 (Max Bulk)"
                        value={tier3Qty}
                        onChangeText={setTier3Qty}
                        keyboardType="numeric"
                        suffix={unit}
                      />
                    </View>
                    <View style={{ width: Spacing.md }} />
                    <View style={{ flex: 1 }}>
                      <Input
                        label="Rate (₹/unit)"
                        value={tier3Price}
                        onChangeText={setTier3Price}
                        keyboardType="numeric"
                        prefix="₹"
                      />
                    </View>
                  </View>
                </View>
              )}
            </View>
          </View>
        )}

        {/* STEP 4: LOCATION & HARVEST */}
        {currentStep === 4 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Origin & Harvest Schedule</Text>
            <Text style={styles.stepSubtitle}>
              Truck dispatch dock and shelf-life validity dates.
            </Text>

            <Text style={styles.inputLabel}>Nearest APMC Mandi Logistics Hub</Text>
            <View style={styles.mandiHubList}>
              {MANDI_HUBS.map(hub => (
                <TouchableOpacity
                  key={hub.id}
                  onPress={() => {
                    setMandiHub(hub.name);
                    setDistrict(hub.district);
                    setState(hub.state);
                  }}
                  style={[
                    styles.hubOption,
                    mandiHub === hub.name && styles.hubOptionActive,
                  ]}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name="location-sharp"
                    size={16}
                    color={mandiHub === hub.name ? '#FFFFFF' : Colors.primaryDark}
                  />
                  <Text
                    style={[
                      styles.hubOptionText,
                      mandiHub === hub.name && styles.hubOptionTextActive,
                    ]}
                  >
                    {hub.name} ({hub.district})
                  </Text>
                </TouchableOpacity>
              ))}
            </View>

            <View style={styles.row}>
              <View style={{ flex: 1 }}>
                <Input
                  label="Harvest Date"
                  value={harvestDate}
                  onChangeText={setHarvestDate}
                  placeholder="YYYY-MM-DD"
                  prefix="📅"
                  required
                />
              </View>
              <View style={{ width: Spacing.md }} />
              <View style={{ flex: 1 }}>
                <Input
                  label="Available Until"
                  value={availableUntil}
                  onChangeText={setAvailableUntil}
                  placeholder="YYYY-MM-DD"
                  prefix="📅"
                  required
                />
              </View>
            </View>
          </View>
        )}

        {/* STEP 5: PHOTOS & REVIEW */}
        {currentStep === 5 && (
          <View style={styles.stepContainer}>
            <Text style={styles.stepTitle}>Photos & Review Listing</Text>
            <Text style={styles.stepSubtitle}>
              Select representative high-definition farm produce photos.
            </Text>

            <Text style={styles.inputLabel}>Choose Produce Photo Preset</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.photosRow}>
              {SAMPLE_PHOTO_PRESETS.map((photoUrl, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setSelectedPhoto(photoUrl)}
                  style={[
                    styles.photoThumbnail,
                    selectedPhoto === photoUrl && styles.photoThumbnailActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Image source={{ uri: photoUrl }} style={styles.thumbImg} />
                  {selectedPhoto === photoUrl && (
                    <View style={styles.thumbCheck}>
                      <Ionicons name="checkmark" size={14} color="#FFFFFF" />
                    </View>
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Summary Review Card */}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Listing Summary</Text>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Produce:</Text>
                <Text style={styles.summaryValue}>{name}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Grade & Variety:</Text>
                <Text style={styles.summaryValue}>{grade} • {variety}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Available Batch:</Text>
                <Text style={styles.summaryValue}>{totalQuantity} {unit} (MOQ: {minOrderQty} {unit})</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Wholesale Base:</Text>
                <Text style={styles.summaryValue}>₹{basePrice}/{unit}</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Dispatch Hub:</Text>
                <Text style={styles.summaryValue}>{mandiHub}</Text>
              </View>
            </View>
          </View>
        )}

        {/* Wizard Footer Nav */}
        <View style={styles.wizardFooter}>
          {currentStep > 1 && (
            <Button
              title="Back"
              onPress={handleBack}
              variant="outline"
              size="md"
              style={{ flex: 1 }}
            />
          )}

          {currentStep < 5 ? (
            <Button
              title="Continue"
              onPress={handleNext}
              variant="primary"
              size="md"
              style={{ flex: 2 }}
              iconName="arrow-forward"
              iconPosition="right"
            />
          ) : (
            <Button
              title="Publish to Virtual Mandi 🌾"
              onPress={handlePublish}
              variant="primary"
              size="lg"
              loading={publishing}
              style={{ flex: 2 }}
            />
          )}
        </View>
      </ScrollView>

      {/* Success Modal */}
      <SuccessModal
        visible={showSuccessModal}
        title="Your produce is now live. 🌾"
        subtitle="Commercial buyers across India can now discover, request quotes, and place bulk orders for this batch."
        details={[
          { label: 'Produce', value: name },
          { label: 'Batch Volume', value: `${totalQuantity} ${unit}` },
          { label: 'Base Wholesale', value: `₹${basePrice}/${unit}` },
          { label: 'Dispatch Mandi', value: mandiHub },
        ]}
        primaryBtnTitle="View My Listings"
        onPrimaryPress={handleSuccessClose}
        secondaryBtnTitle="Return to Dashboard"
        onSecondaryPress={() => {
          setShowSuccessModal(false);
          router.replace('/(farmer)');
        }}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressContainer: {
    flexDirection: 'row',
    height: 4,
    backgroundColor: Colors.borderLight,
  },
  progressSegment: {
    flex: 1,
    backgroundColor: Colors.borderLight,
  },
  progressSegmentActive: {
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.lg,
    paddingBottom: Spacing.huge,
  },
  stepContainer: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    ...Shadows.subtle,
  },
  stepTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  stepSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.lg,
    lineHeight: 18,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  categoryChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  choiceChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  choiceChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  choiceChipText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  choiceChipTextActive: {
    color: '#FFFFFF',
  },
  gradeCardsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  gradeCard: {
    flex: 1,
    padding: Spacing.sm,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  gradeCardActive: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primary,
  },
  gradeCardTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gradeCardTitleActive: {
    color: Colors.primaryDark,
  },
  gradeCardDesc: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  unitPillsRow: {
    flexDirection: 'row',
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  unitPill: {
    flex: 1,
    paddingVertical: 9,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  unitPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  unitPillText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  unitPillTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  checkboxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: Spacing.sm,
    marginBottom: Spacing.md,
  },
  checkboxTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  checkboxSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 1,
  },
  tierSection: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: Spacing.xs,
  },
  tierHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  tierTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  tierToggleText: {
    fontSize: 12,
    color: Colors.primaryMedium,
    fontWeight: '600',
  },
  tierInputs: {
    gap: Spacing.xs,
  },
  tierRow: {
    flexDirection: 'row',
  },
  mandiHubList: {
    gap: Spacing.xs,
    marginBottom: Spacing.md,
  },
  hubOption: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
    padding: Spacing.sm + 2,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  hubOptionActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hubOptionText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  hubOptionTextActive: {
    color: '#FFFFFF',
  },
  row: {
    flexDirection: 'row',
  },
  photosRow: {
    flexDirection: 'row',
    marginBottom: Spacing.lg,
  },
  photoThumbnail: {
    width: 80,
    height: 80,
    borderRadius: Radii.md,
    marginRight: Spacing.sm,
    borderWidth: 2,
    borderColor: 'transparent',
    overflow: 'hidden',
    position: 'relative',
  },
  photoThumbnailActive: {
    borderColor: Colors.primary,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  thumbCheck: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.primary,
    borderRadius: Radii.pill,
    width: 18,
    height: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  summaryCard: {
    backgroundColor: Colors.primaryWash,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.primarySubtle,
    gap: Spacing.xs,
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  summaryLabel: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  wizardFooter: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: Spacing.xs,
  },
});
