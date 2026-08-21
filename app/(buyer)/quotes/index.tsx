import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../../constants/theme';
import { useQuotes } from '../../../context/QuotesContext';
import { Header } from '../../../components/common/Header';
import { EmptyState } from '../../../components/common/EmptyState';
import { StatusBadge } from '../../../components/common/StatusBadge';
import { Button } from '../../../components/common/Button';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerQuotesListScreen() {
  const router = useRouter();
  const { quotes, acceptOffer } = useQuotes();

  return (
    <View style={styles.container}>
      <Header
        title="Wholesale RFQs & Quotes"
        subtitle="Direct Bidding & Price Negotiation"
        showRoleToggle={true}
        showCart={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(buyer)/quote-request')}
            style={styles.addBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {quotes.length > 0 ? (
          quotes.map(rfq => {
            const hasOffers = rfq.responses && rfq.responses.length > 0;
            const bestOffer = hasOffers
              ? [...rfq.responses].sort((a, b) => a.offeredPricePerKg - b.offeredPricePerKg)[0]
              : null;

            return (
              <View key={rfq.id} style={styles.rfqCard}>
                <View style={styles.cardHeader}>
                  <View>
                    <Text style={styles.rfqNumber}>{rfq.rfqNumber}</Text>
                    <Text style={styles.timestamp}>{rfq.createdAt.split('T')[0]}</Text>
                  </View>
                  <View
                    style={[
                      styles.statusTag,
                      rfq.status === 'responded'
                        ? styles.statusResponded
                        : styles.statusPending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusTagText,
                        {
                          color:
                            rfq.status === 'responded' ? Colors.success : Colors.amberDark,
                        },
                      ]}
                    >
                      {rfq.status === 'responded'
                        ? `✓ ${rfq.responses.length} Farmer Bids`
                        : 'Awaiting Bids'}
                    </Text>
                  </View>
                </View>

                <Text style={styles.produceTitle}>{rfq.produceName}</Text>
                <Text style={styles.specsLine}>
                  Required Volume: <Text style={styles.bold}>{rfq.targetQuantityKg.toLocaleString()} kg</Text> • Grade {rfq.gradeRequired}
                </Text>
                <Text style={styles.locationLine}>
                  Destination: {rfq.deliveryWarehouse} (By {rfq.targetDeliveryDate})
                </Text>

                {/* Farmer Responses Accordion/Cards */}
                {hasOffers && (
                  <View style={styles.offersBox}>
                    <Text style={styles.offersTitle}>RECEIVED FARMER OFFERS</Text>
                    {rfq.responses.map(resp => (
                      <View key={resp.id} style={styles.offerItem}>
                        <View style={styles.offerLeft}>
                          <Text style={styles.farmerName}>{resp.farmerName}</Text>
                          <Text style={styles.farmerLoc}>{resp.farmerLocation}</Text>
                          <Text style={styles.farmerOfferQty}>
                            Supply: {resp.offeredQuantityKg.toLocaleString()} kg from {resp.availableFromDate}
                          </Text>
                        </View>

                        <View style={styles.offerRight}>
                          <Text style={styles.offeredRate}>₹{resp.offeredPricePerKg}/kg</Text>
                          {resp.status === 'accepted' ? (
                            <View style={styles.acceptedPill}>
                              <Ionicons name="checkmark-circle" size={12} color={Colors.success} />
                              <Text style={styles.acceptedText}>Accepted</Text>
                            </View>
                          ) : (
                            <TouchableOpacity
                              onPress={() => {
                                acceptOffer(rfq.id, resp.id);
                                Alert.alert('Offer Accepted', `Accepted ${resp.farmerName}'s bid of ₹${resp.offeredPricePerKg}/kg.`);
                              }}
                              style={styles.acceptBtn}
                              activeOpacity={0.7}
                            >
                              <Text style={styles.acceptBtnText}>Accept Bid</Text>
                            </TouchableOpacity>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                )}

                <View style={styles.cardFooter}>
                  <TouchableOpacity
                    onPress={() => router.push('/(buyer)/quote-request')}
                    style={styles.reRfqBtn}
                    activeOpacity={0.7}
                  >
                    <Ionicons name="repeat" size={14} color="#1E6091" />
                    <Text style={styles.reRfqText}>New Inquiry</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        ) : (
          <EmptyState
            emoji="📝"
            title="No Quote Inquiries Active"
            description="Broadcast customized RFQs to farmers for volume discounts on large truckloads (5,000+ kg)."
            actionTitle="+ Create Bulk RFQ"
            onActionPress={() => router.push('/(buyer)/quote-request')}
          />
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    backgroundColor: '#1E6091',
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  rfqCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    ...Shadows.subtle,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  rfqNumber: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  timestamp: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  statusTag: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  statusResponded: {
    backgroundColor: Colors.successBg,
  },
  statusPending: {
    backgroundColor: Colors.warningBg,
  },
  statusTagText: {
    fontSize: 10,
    fontWeight: '700',
  },
  produceTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginTop: 4,
  },
  specsLine: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  locationLine: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  offersBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: Spacing.sm,
  },
  offersTitle: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  offerItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderRadius: Radii.md,
    padding: Spacing.sm + 2,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  offerLeft: {
    flex: 1,
  },
  farmerName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  farmerLoc: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  farmerOfferQty: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  offerRight: {
    alignItems: 'flex-end',
    marginLeft: Spacing.sm,
  },
  offeredRate: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.primaryDark,
    marginBottom: 4,
  },
  acceptBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: Radii.pill,
  },
  acceptBtnText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '700',
  },
  acceptedPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 3,
    backgroundColor: Colors.successBg,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radii.pill,
  },
  acceptedText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.success,
  },
  cardFooter: {
    marginTop: Spacing.sm,
    paddingTop: Spacing.xs,
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    alignItems: 'flex-end',
  },
  reRfqBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reRfqText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E6091',
  },
});
