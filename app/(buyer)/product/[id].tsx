import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  Alert,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../../constants/theme';
import { useListings } from '../../../context/ListingsContext';
import { useCart } from '../../../context/CartContext';
import { Header } from '../../../components/common/Header';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { VerificationBadge } from '../../../components/common/VerificationBadge';
import { BulkPriceTable } from '../../../components/buyer/BulkPriceTable';
import { QuantitySelector } from '../../../components/buyer/QuantitySelector';
import { FarmerProfileSnippet } from '../../../components/buyer/FarmerProfileSnippet';
import { Button } from '../../../components/common/Button';
import { ProduceListing } from '../../../types';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerProductDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { getProduceById } = useListings();
  const { addToCart, getItemPriceForQty } = useCart();

  const [produce, setProduce] = useState<ProduceListing | null>(null);
  const [selectedQty, setSelectedQty] = useState(500);
  const [activeImageIndex, setActiveImageIndex] = useState(0);

  useEffect(() => {
    if (id) {
      const found = getProduceById(id);
      if (found) {
        setProduce(found);
        setSelectedQty(Math.max(found.minOrderQuantity, 500));
      }
    }
  }, [id, getProduceById]);

  if (!produce) {
    return (
      <SafeAreaView style={styles.container}>
        <Header title="Produce Details" showBack={true} />
        <View style={styles.centerBox}>
          <Text style={styles.errorText}>Produce listing not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  const currentTierPrice = getItemPriceForQty(produce, selectedQty);
  const totalItemCost = selectedQty * currentTierPrice;

  const handleAddToCart = () => {
    addToCart(produce, selectedQty);
    Alert.alert(
      'Added to Procurement Cart 🛒',
      `${selectedQty} kg of ${produce.name} added at ₹${currentTierPrice}/kg (Total: ₹${totalItemCost.toLocaleString()}).`,
      [
        { text: 'Keep Exploring', style: 'cancel' },
        { text: 'Go to Cart', onPress: () => router.push('/(buyer)/cart') },
      ]
    );
  };

  const handleDirectBuy = () => {
    addToCart(produce, selectedQty);
    router.push('/(buyer)/cart');
  };

  const handleRequestQuote = () => {
    router.push({
      pathname: '/(buyer)/quote-request',
      params: {
        produceId: produce.id,
        produceName: produce.name,
        category: produce.category,
        variety: produce.variety,
        grade: produce.grade,
        suggestedRate: currentTierPrice.toString(),
      },
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Wholesale Batch Specification"
        showBack={true}
        showCart={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Produce Images Gallery */}
        <View style={styles.imageGallery}>
          <Image
            source={{ uri: produce.images[activeImageIndex] || produce.images[0] }}
            style={styles.mainImage}
            resizeMode="cover"
          />

          <View style={styles.badgeOverlay}>
            <StatusBadge type="grade" value={produce.grade} size="md" />
            <View style={styles.mandiTag}>
              <Ionicons name="location" size={12} color="#FFFFFF" />
              <Text style={styles.mandiTagText}>{produce.location.mandiHub}</Text>
            </View>
          </View>

          {/* Thumbnails if multiple images */}
          {produce.images.length > 1 && (
            <View style={styles.thumbRow}>
              {produce.images.map((img, idx) => (
                <TouchableOpacity
                  key={idx}
                  onPress={() => setActiveImageIndex(idx)}
                  style={[
                    styles.thumb,
                    activeImageIndex === idx && styles.thumbActive,
                  ]}
                >
                  <Image source={{ uri: img }} style={styles.thumbImg} />
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Title & Core B2B Specs */}
        <View style={styles.detailsCard}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{produce.name}</Text>
            <View style={styles.verifiedRow}>
              <VerificationBadge label="Verified Harvest" size="sm" />
            </View>
          </View>

          <View style={styles.priceContainer}>
            <View>
              <Text style={styles.priceLabel}>Wholesale Base Price</Text>
              <View style={styles.priceRow}>
                <Text style={styles.priceValue}>₹{produce.basePricePerUnit}</Text>
                <Text style={styles.unitText}>/{produce.unit}</Text>
              </View>
            </View>

            <View style={styles.stockBox}>
              <Text style={styles.stockLabel}>Available Stock</Text>
              <Text style={styles.stockValue}>
                {produce.availableQuantity.toLocaleString()} {produce.unit}
              </Text>
              <Text style={styles.moqText}>
                MOQ: {produce.minOrderQuantity} {produce.unit}
              </Text>
            </View>
          </View>

          {/* Produce Information Table */}
          <View style={styles.infoTable}>
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableKey}>Grade Standard:</Text>
              <Text style={styles.infoTableVal}>{produce.grade} (Commercial Wholesale)</Text>
            </View>
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableKey}>Variety / Strain:</Text>
              <Text style={styles.infoTableVal}>{produce.variety}</Text>
            </View>
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableKey}>Harvest Date:</Text>
              <Text style={styles.infoTableVal}>{produce.harvestDate} (Fresh harvest)</Text>
            </View>
            <View style={styles.infoTableRow}>
              <Text style={styles.infoTableKey}>Farm Location:</Text>
              <Text style={styles.infoTableVal}>
                {produce.location.district}, {produce.location.state} ({produce.location.distanceKm} km away)
              </Text>
            </View>
          </View>

          <Text style={styles.descTitle}>Quality & Handling Description</Text>
          <Text style={styles.descText}>{produce.qualityDescription}</Text>
        </View>

        {/* Tiered Wholesale Pricing Matrix */}
        <BulkPriceTable
          tiers={produce.priceTiers}
          selectedQuantity={selectedQty}
          unit={produce.unit}
        />

        {/* Bulk Quantity Selector */}
        <QuantitySelector
          quantity={selectedQty}
          minQuantity={produce.minOrderQuantity}
          maxQuantity={produce.availableQuantity}
          step={50}
          onChange={setSelectedQty}
          unit={produce.unit}
        />

        {/* Live Calculation Preview */}
        <View style={styles.calcSummaryCard}>
          <View style={styles.calcSummaryRow}>
            <Text style={styles.calcSummaryLabel}>
              {selectedQty} kg @ ₹{currentTierPrice}/kg:
            </Text>
            <Text style={styles.calcSummaryTotal}>₹{totalItemCost.toLocaleString()}</Text>
          </View>
          <Text style={styles.calcSummarySub}>
            Includes farm gate grading & plastic crate loading. Freight calculated at checkout.
          </Text>
        </View>

        {/* Verified Farmer Seller Card */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Direct Farmer & Farm Profile</Text>
        </View>
        <FarmerProfileSnippet farmer={produce.farmer} />

        {/* Logistics & Dispatch Estimate */}
        <View style={styles.logisticsCard}>
          <View style={styles.logisticsHeader}>
            <Ionicons name="car" size={18} color="#1E6091" />
            <Text style={styles.logisticsTitle}>ONDC Agri Logistics & Mandi Pickup</Text>
          </View>
          <Text style={styles.logisticsText}>
            Direct dispatch from {produce.location.mandiHub} via ventilated 14-ft truck. Estimated transit: 4–6 hours to Pune/Mumbai warehousing zones.
          </Text>
        </View>
      </ScrollView>

      {/* Floating Bottom Action Bar */}
      <View style={styles.floatingBottomBar}>
        <View style={styles.floatingPriceCol}>
          <Text style={styles.floatingTotalLabel}>Total ({selectedQty} kg)</Text>
          <Text style={styles.floatingTotalPrice}>₹{totalItemCost.toLocaleString()}</Text>
          <Text style={styles.floatingRateText}>@ ₹{currentTierPrice}/kg</Text>
        </View>

        <View style={styles.floatingActionsRow}>
          {produce.isNegotiable && (
            <Button
              title="Request Quote"
              onPress={handleRequestQuote}
              variant="outline"
              size="md"
              style={styles.quoteBtn}
            />
          )}

          <Button
            title="Procure Now"
            onPress={handleDirectBuy}
            variant="primary"
            size="md"
            iconName="bag-handle"
            style={styles.buyBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerBox: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.danger,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: 110,
  },
  imageGallery: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    overflow: 'hidden',
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.card,
  },
  mainImage: {
    width: '100%',
    height: 230,
    backgroundColor: Colors.surfaceSubtle,
  },
  badgeOverlay: {
    position: 'absolute',
    top: Spacing.md,
    left: Spacing.md,
    flexDirection: 'row',
    gap: Spacing.xs,
  },
  mandiTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: 'rgba(8, 28, 21, 0.75)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  mandiTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  thumbRow: {
    flexDirection: 'row',
    padding: Spacing.sm,
    gap: Spacing.xs,
    backgroundColor: Colors.surface,
  },
  thumb: {
    width: 48,
    height: 48,
    borderRadius: Radii.sm,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  thumbActive: {
    borderColor: Colors.primary,
  },
  thumbImg: {
    width: '100%',
    height: '100%',
  },
  detailsCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
    ...Shadows.subtle,
  },
  topRow: {
    marginBottom: Spacing.sm,
  },
  name: {
    fontSize: 20,
    fontWeight: '800',
    color: Colors.textPrimary,
    lineHeight: 25,
  },
  verifiedRow: {
    marginTop: 4,
  },
  priceContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceSubtle,
    padding: Spacing.md,
    borderRadius: Radii.lg,
    marginVertical: Spacing.sm,
  },
  priceLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: 2,
  },
  priceValue: {
    fontSize: 24,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
  },
  stockBox: {
    alignItems: 'flex-end',
  },
  stockLabel: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  stockValue: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  moqText: {
    fontSize: 11,
    color: Colors.amberDark,
    fontWeight: '600',
    marginTop: 1,
  },
  infoTable: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: Spacing.sm,
    marginVertical: Spacing.sm,
    gap: 6,
  },
  infoTableRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoTableKey: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  infoTableVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  descTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: Spacing.xs,
    marginBottom: 4,
  },
  descText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
  },
  calcSummaryCard: {
    backgroundColor: Colors.primaryWash,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginVertical: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.primarySubtle,
  },
  calcSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  calcSummaryLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.primaryDark,
  },
  calcSummaryTotal: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  calcSummarySub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  sectionHeader: {
    marginTop: Spacing.md,
    marginBottom: Spacing.xs,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  logisticsCard: {
    backgroundColor: '#EBF4FB',
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: '#90CDF4',
    marginVertical: Spacing.sm,
  },
  logisticsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 4,
  },
  logisticsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E6091',
  },
  logisticsText: {
    fontSize: 11,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  floatingBottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    ...Shadows.elevated,
  },
  floatingPriceCol: {
    flex: 1,
  },
  floatingTotalLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    textTransform: 'uppercase',
    fontWeight: '600',
  },
  floatingTotalPrice: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.primaryDark,
  },
  floatingRateText: {
    fontSize: 10,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  floatingActionsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
    flex: 1.6,
    justifyContent: 'flex-end',
  },
  quoteBtn: {
    paddingHorizontal: 12,
  },
  buyBtn: {
    paddingHorizontal: 16,
  },
});
