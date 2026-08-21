import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { CategoryItem } from '../../constants/categories';
import { Ionicons } from '@expo/vector-icons';

interface CategoryCardProps {
  category: CategoryItem;
  isSelected?: boolean;
  onPress: () => void;
}

export const CategoryCard: React.FC<CategoryCardProps> = ({
  category,
  isSelected = false,
  onPress,
}) => {
  const getIconName = (name: string): keyof typeof Ionicons.glyphMap => {
    switch (name) {
      case 'vegetables':
        return 'nutrition-outline';
      case 'fruits':
        return 'sunny-outline';
      case 'grains':
        return 'disc-outline';
      case 'pulses':
        return 'layers-outline';
      case 'spices':
        return 'flame-outline';
      case 'all':
      default:
        return 'grid-outline';
    }
  };

  return (
    <TouchableOpacity
      activeOpacity={0.75}
      onPress={onPress}
      style={[
        styles.card,
        isSelected && styles.cardSelected,
      ]}
    >
      <View
        style={[
          styles.iconBox,
          isSelected ? styles.iconBoxSelected : styles.iconBoxDefault,
        ]}
      >
        <Ionicons
          name={getIconName(category.id)}
          size={20}
          color={isSelected ? '#FFFFFF' : Colors.primaryDark}
        />
      </View>
      <Text
        style={[
          styles.name,
          isSelected && styles.nameSelected,
        ]}
        numberOfLines={1}
      >
        {category.name}
      </Text>
      <Text style={styles.count}>{category.itemCount} listings</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    width: 120,
    marginRight: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
    ...Shadows.subtle,
  },
  cardSelected: {
    borderColor: Colors.primary,
    backgroundColor: Colors.primaryWash,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  iconBoxDefault: {
    backgroundColor: Colors.primarySubtle,
  },
  iconBoxSelected: {
    backgroundColor: Colors.primary,
  },
  name: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  nameSelected: {
    color: Colors.primaryDark,
  },
  count: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
