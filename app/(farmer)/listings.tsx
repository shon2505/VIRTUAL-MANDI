import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useListings } from '../../context/ListingsContext';
import { Header } from '../../components/common/Header';
import { FarmerListingCard } from '../../components/farmer/FarmerListingCard';
import { EmptyState } from '../../components/common/EmptyState';
import { Input } from '../../components/common/Input';
import { Button } from '../../components/common/Button';
import { ProduceListing, ListingStatus } from '../../types';
import { Ionicons } from '@expo/vector-icons';

type ListingTab = 'all' | 'active' | 'paused' | 'sold_out';

export default function FarmerListingsScreen() {
  const router = useRouter();
  const { farmerListings, updateProduce } = useListings();
  const [activeTab, setActiveTab] = useState<ListingTab>('all');

  // Quick edit modal state
  const [editingListing, setEditingListing] = useState<ProduceListing | null>(null);
  const [editPrice, setEditPrice] = useState('');
  const [editQty, setEditQty] = useState('');

  const filteredListings = farmerListings.filter(item => {
    if (activeTab === 'all') return true;
    return item.status === activeTab;
  });

  const handleOpenEdit = (listing: ProduceListing) => {
    setEditingListing(listing);
    setEditPrice(listing.basePricePerUnit.toString());
    setEditQty(listing.availableQuantity.toString());
  };

  const handleSaveEdit = async () => {
    if (!editingListing) return;
    const priceNum = parseFloat(editPrice);
    const qtyNum = parseInt(editQty, 10);

    if (isNaN(priceNum) || priceNum <= 0) {
      Alert.alert('Invalid Price', 'Please enter a valid price per unit.');
      return;
    }
    if (isNaN(qtyNum) || qtyNum < 0) {
      Alert.alert('Invalid Quantity', 'Please enter a valid available quantity.');
      return;
    }

    await updateProduce(editingListing.id, {
      basePricePerUnit: priceNum,
      availableQuantity: qtyNum,
      status: qtyNum === 0 ? 'sold_out' : editingListing.status === 'sold_out' ? 'active' : editingListing.status,
    });

    setEditingListing(null);
  };

  const handleToggleStatus = (id: string, currentStatus: ListingStatus) => {
    const nextStatus: ListingStatus = currentStatus === 'active' ? 'paused' : 'active';
    updateProduce(id, { status: nextStatus });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Produce Listings"
        subtitle={`${farmerListings.length} Total Batches`}
        showRoleToggle={true}
        rightAction={
          <TouchableOpacity
            onPress={() => router.push('/(farmer)/add-produce')}
            style={styles.addIconBtn}
            activeOpacity={0.7}
          >
            <Ionicons name="add" size={22} color="#FFFFFF" />
          </TouchableOpacity>
        }
      />

      {/* Filter Tabs */}
      <View style={styles.tabsWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabsContainer}
        >
          {(
            [
              { id: 'all', label: 'All Listings', count: farmerListings.length },
              { id: 'active', label: 'Active', count: farmerListings.filter(l => l.status === 'active').length },
              { id: 'paused', label: 'Paused', count: farmerListings.filter(l => l.status === 'paused').length },
              { id: 'sold_out', label: 'Sold Out', count: farmerListings.filter(l => l.status === 'sold_out').length },
            ] as const
          ).map(tab => (
            <TouchableOpacity
              key={tab.id}
              onPress={() => setActiveTab(tab.id)}
              style={[
                styles.tabItem,
                activeTab === tab.id && styles.tabItemActive,
              ]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.tabText,
                  activeTab === tab.id && styles.tabTextActive,
                ]}
              >
                {tab.label}
              </Text>
              <View
                style={[
                  styles.tabBadge,
                  activeTab === tab.id ? styles.tabBadgeActive : styles.tabBadgeInactive,
                ]}
              >
                <Text
                  style={[
                    styles.tabBadgeText,
                    activeTab === tab.id && styles.tabBadgeTextActive,
                  ]}
                >
                  {tab.count}
                </Text>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Listings List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredListings.length > 0 ? (
          filteredListings.map(listing => (
            <FarmerListingCard
              key={listing.id}
              listing={listing}
              onToggleStatus={() => handleToggleStatus(listing.id, listing.status)}
              onEdit={() => handleOpenEdit(listing)}
            />
          ))
        ) : (
          <EmptyState
            emoji="🌾"
            title={activeTab === 'all' ? 'Your Mandi is waiting.' : `No ${activeTab} listings`}
            description={
              activeTab === 'all'
                ? 'Add your first produce listing and start selling directly to bulk businesses.'
                : `You do not have any produce listings under ${activeTab}.`
            }
            actionTitle="+ Add Produce"
            onActionPress={() => router.push('/(farmer)/add-produce')}
          />
        )}
      </ScrollView>

      {/* Quick Edit Price & Stock Modal */}
      {editingListing && (
        <Modal visible={true} transparent animationType="fade">
          <View style={styles.modalOverlay}>
            <View style={styles.modalCard}>
              <View style={styles.modalHeader}>
                <View>
                  <Text style={styles.modalTitle}>Quick Update Listing</Text>
                  <Text style={styles.modalSubtitle} numberOfLines={1}>
                    {editingListing.name}
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => setEditingListing(null)}
                  style={styles.closeBtn}
                >
                  <Ionicons name="close" size={20} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              <Input
                label={`Base Wholesale Price (₹ / ${editingListing.unit})`}
                value={editPrice}
                onChangeText={setEditPrice}
                keyboardType="numeric"
                prefix="₹"
                required
              />

              <Input
                label={`Available Inventory (${editingListing.unit})`}
                value={editQty}
                onChangeText={setEditQty}
                keyboardType="numeric"
                helperText={`Total capacity: ${editingListing.totalQuantity} ${editingListing.unit} (${editingListing.reservedQuantity} kg reserved)`}
                required
              />

              <View style={styles.modalActions}>
                <Button
                  title="Cancel"
                  onPress={() => setEditingListing(null)}
                  variant="ghost"
                  style={{ flex: 1 }}
                />
                <Button
                  title="Save Updates"
                  onPress={handleSaveEdit}
                  variant="primary"
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  addIconBtn: {
    width: 36,
    height: 36,
    borderRadius: Radii.pill,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    ...Shadows.subtle,
  },
  tabsWrapper: {
    backgroundColor: Colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  tabsContainer: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    gap: Spacing.sm,
  },
  tabItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: Spacing.md,
    paddingVertical: 7,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tabItemActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  tabText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  tabBadge: {
    paddingHorizontal: 6,
    paddingVertical: 1,
    borderRadius: Radii.pill,
  },
  tabBadgeInactive: {
    backgroundColor: Colors.borderLight,
  },
  tabBadgeActive: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
  },
  tabBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  tabBadgeTextActive: {
    color: '#FFFFFF',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 28, 21, 0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xl,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 380,
    ...Shadows.popover,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 2,
    maxWidth: 240,
  },
  closeBtn: {
    padding: 4,
  },
  modalActions: {
    flexDirection: 'row',
    gap: Spacing.sm,
    marginTop: Spacing.sm,
  },
});
