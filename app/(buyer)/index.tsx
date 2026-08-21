import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { useAuth } from '../../context/AuthContext';
import { useListings } from '../../context/ListingsContext';
import { Header } from '../../components/common/Header';
import { RoleSwitcherBanner } from '../../components/common/RoleSwitcherBanner';
import { SearchBar } from '../../components/common/SearchBar';
import { CategoryCard } from '../../components/buyer/CategoryCard';
import { BulkProductCard } from '../../components/buyer/BulkProductCard';
import { MandiRateTicker } from '../../components/farmer/MandiRateTicker';
import { CATEGORIES } from '../../constants/categories';
import { ProduceCategory } from '../../types';
import { Ionicons } from '@expo/vector-icons';

export default function BuyerHomeScreen() {
  const router = useRouter();
  const { buyerProfile } = useAuth();
  const { listings, setFilter, refreshListings, isLoading } = useListings();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<ProduceCategory>('all');
  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshListings();
    setRefreshing(false);
  };

  const handleSearchSubmit = (text: string) => {
    setSearchQuery(text);
    setFilter({ searchQuery: text });
  };

  const handleCategorySelect = (catId: ProduceCategory) => {
    setSelectedCategory(catId);
    setFilter({ category: catId });
  };

  const featuredDeals = listings.filter(item => item.status === 'active');

  return (
    <View style={styles.container}>
      <Header
        title={`Good morning, ${buyerProfile?.name?.split(' ')[0] || 'Vikram'} 👋`}
        subtitle={buyerProfile?.businessName || 'MahaFresh Wholesale Ltd'}
        showRoleToggle={true}
        showCart={true}
        showNotification={true}
      />

      <RoleSwitcherBanner />
      <MandiRateTicker />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#1E6091']}
          />
        }
      >
        {/* Search Bar */}
        <View style={styles.searchSection}>
          <SearchBar
            value={searchQuery}
            onChangeText={handleSearchSubmit}
            placeholder="Search tomato, lasalgaon onion, grade A..."
            onFilterPress={() => router.push('/modals/filter-sheet')}
          />
        </View>

        {/* B2B Procurement Banner */}
        <View style={styles.heroBanner}>
          <View style={styles.heroLeft}>
            <View style={styles.ondcTag}>
              <Ionicons name="shield-checkmark" size={12} color="#FFFFFF" />
              <Text style={styles.ondcTagText}>ONDC Direct Farm Network</Text>
            </View>
            <Text style={styles.heroTitle}>Direct Farm Sourcing at Wholesale Rates</Text>
            <Text style={styles.heroSub}>
              Zero intermediaries • Guaranteed batch quality • APMC mandi pickup or warehouse dispatch
            </Text>
            <TouchableOpacity
              onPress={() => router.push('/(buyer)/quote-request')}
              style={styles.heroRfqBtn}
              activeOpacity={0.8}
            >
              <Ionicons name="document-text" size={14} color="#1E6091" />
              <Text style={styles.heroRfqText}>Request Bulk Quote (RFQ)</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Categories Carousel */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Browse Produce Categories</Text>
          <TouchableOpacity
            onPress={() => router.push('/(buyer)/discover')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>View All</Text>
          </TouchableOpacity>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryRow}
        >
          {CATEGORIES.map(category => (
            <CategoryCard
              key={category.id}
              category={category}
              isSelected={selectedCategory === category.id}
              onPress={() => handleCategorySelect(category.id as ProduceCategory)}
            />
          ))}
        </ScrollView>

        {/* Bulk Deals Section */}
        <View style={[styles.sectionHeader, { marginTop: Spacing.lg }]}>
          <View>
            <Text style={styles.sectionTitle}>Verified Bulk Deals</Text>
            <Text style={styles.sectionSubtitle}>
              Fresh harvested produce ready for immediate dispatch
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => router.push('/(buyer)/discover')}
            activeOpacity={0.7}
          >
            <Text style={styles.sectionLink}>Filter ({featuredDeals.length})</Text>
          </TouchableOpacity>
        </View>

        {featuredDeals.map(produce => (
          <BulkProductCard key={produce.id} produce={produce} />
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
  searchSection: {
    marginBottom: Spacing.md,
  },
  heroBanner: {
    backgroundColor: Colors.primaryDark,
    borderRadius: Radii.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.lg,
    ...Shadows.card,
  },
  heroLeft: {
    gap: Spacing.xs,
  },
  ondcTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  ondcTagText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '700',
  },
  heroTitle: {
    fontSize: 18,
    lineHeight: 23,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 2,
  },
  heroSub: {
    fontSize: 12,
    color: Colors.textInverseMuted,
    lineHeight: 17,
  },
  heroRfqBtn: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: Spacing.md,
    paddingVertical: 8,
    borderRadius: Radii.md,
    marginTop: Spacing.xs,
  },
  heroRfqText: {
    color: '#1E6091',
    fontSize: 12,
    fontWeight: '700',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  sectionLink: {
    fontSize: 12,
    fontWeight: '700',
    color: '#1E6091',
  },
  categoryRow: {
    paddingVertical: Spacing.xs,
  },
});
