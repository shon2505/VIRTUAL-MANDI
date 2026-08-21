import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { useListings } from '../../context/ListingsContext';
import { Header } from '../../components/common/Header';
import { SearchBar } from '../../components/common/SearchBar';
import { BulkProductCard } from '../../components/buyer/BulkProductCard';
import { Chip } from '../../components/common/Chip';
import { EmptyState } from '../../components/common/EmptyState';
import { CATEGORIES } from '../../constants/categories';
import { ProduceCategory } from '../../types';

export default function BuyerDiscoverScreen() {
  const router = useRouter();
  const { listings, activeFilter, setFilter, resetFilter } = useListings();
  const [searchQuery, setSearchQuery] = useState(activeFilter.searchQuery || '');

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    setFilter({ searchQuery: text });
  };

  const handleCategorySelect = (cat: ProduceCategory) => {
    setFilter({ category: cat });
  };

  const handleSortChange = (sortBy: any) => {
    setFilter({ sortBy });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Discover Produce"
        subtitle={`${listings.length} Wholesale Batches Available`}
        showRoleToggle={true}
        showCart={true}
      />

      {/* Search Header */}
      <View style={styles.searchContainer}>
        <SearchBar
          value={searchQuery}
          onChangeText={handleSearch}
          placeholder="Search onion, wheat, tomato, nashik..."
          onFilterPress={() => router.push('/modals/filter-sheet')}
          hasActiveFilters={
            activeFilter.category !== 'all' ||
            activeFilter.grade !== undefined ||
            activeFilter.verifiedOnly === true
          }
        />

        {/* Category Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoryChips}
        >
          {CATEGORIES.map(cat => (
            <Chip
              key={cat.id}
              label={cat.name}
              selected={(activeFilter.category || 'all') === cat.id}
              onPress={() => handleCategorySelect(cat.id as ProduceCategory)}
              size="sm"
            />
          ))}
        </ScrollView>

        {/* Sort Chips */}
        <View style={styles.sortRow}>
          <Text style={styles.sortLabel}>Sort By:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortChips}>
            {[
              { id: 'price_asc', label: 'Price: Low to High' },
              { id: 'quantity_desc', label: 'Highest Volume' },
              { id: 'distance', label: 'Nearest Mandi' },
              { id: 'rating', label: 'Top Rated Farmer' },
            ].map(sort => (
              <TouchableOpacity
                key={sort.id}
                onPress={() => handleSortChange(sort.id)}
                style={[
                  styles.sortBtn,
                  activeFilter.sortBy === sort.id && styles.sortBtnActive,
                ]}
                activeOpacity={0.7}
              >
                <Text
                  style={[
                    styles.sortBtnText,
                    activeFilter.sortBy === sort.id && styles.sortBtnTextActive,
                  ]}
                >
                  {sort.label}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>

      {/* Results List */}
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {listings.length > 0 ? (
          listings.map(produce => (
            <BulkProductCard key={produce.id} produce={produce} />
          ))
        ) : (
          <EmptyState
            emoji="🔍"
            title="No matching produce found"
            description="Try changing your search terms, removing filters, or browsing other categories."
            actionTitle="Reset Filters"
            onActionPress={resetFilter}
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
  searchContainer: {
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.sm,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: Spacing.sm,
  },
  categoryChips: {
    gap: Spacing.xs,
    paddingVertical: 2,
  },
  sortRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  sortLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    textTransform: 'uppercase',
  },
  sortChips: {
    gap: Spacing.xs,
  },
  sortBtn: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: Radii.pill,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sortBtnActive: {
    backgroundColor: '#1E6091',
    borderColor: '#1E6091',
  },
  sortBtnText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  sortBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    paddingBottom: Spacing.huge,
  },
});
