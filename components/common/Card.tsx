import React from 'react';
import { View, StyleSheet, TouchableOpacity, StyleProp, ViewStyle } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  variant?: 'elevated' | 'outlined' | 'flat';
  padding?: 'none' | 'sm' | 'md' | 'lg';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  style,
  variant = 'outlined',
  padding = 'md',
}) => {
  const CardComponent = onPress ? TouchableOpacity : View;

  const getPaddingStyle = () => {
    switch (padding) {
      case 'none':
        return { padding: 0 };
      case 'sm':
        return { padding: Spacing.sm };
      case 'lg':
        return { padding: Spacing.xl };
      case 'md':
      default:
        return { padding: Spacing.lg };
    }
  };

  const getVariantStyle = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: Colors.surface,
          borderWidth: 0,
          ...Shadows.card,
        };
      case 'flat':
        return {
          backgroundColor: Colors.surfaceSubtle,
          borderWidth: 0,
        };
      case 'outlined':
      default:
        return {
          backgroundColor: Colors.surface,
          borderWidth: 1,
          borderColor: Colors.border,
          ...Shadows.subtle,
        };
    }
  };

  return (
    <CardComponent
      // @ts-ignore
      onPress={onPress}
      activeOpacity={0.8}
      style={[styles.card, getVariantStyle(), getPaddingStyle(), style]}
    >
      {children}
    </CardComponent>
  );
};

const styles = StyleSheet.create({
  card: {
    borderRadius: Radii.lg,
    overflow: 'hidden',
  },
});
