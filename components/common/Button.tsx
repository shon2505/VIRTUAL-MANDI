import React from 'react';
import {
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
  StyleProp,
} from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'danger' | 'ghost' | 'amber';
  size?: 'sm' | 'md' | 'lg';
  loading?: boolean;
  disabled?: boolean;
  iconName?: keyof typeof Ionicons.glyphMap;
  iconPosition?: 'left' | 'right';
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  fullWidth?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  iconName,
  iconPosition = 'left',
  style,
  textStyle,
  fullWidth = false,
}) => {
  const getContainerStyle = (): ViewStyle => {
    const base: ViewStyle = {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: Radii.md,
      borderWidth: 1,
      borderColor: 'transparent',
    };

    // Sizes
    if (size === 'sm') {
      base.paddingVertical = 8;
      base.paddingHorizontal = Spacing.md;
    } else if (size === 'lg') {
      base.paddingVertical = 16;
      base.paddingHorizontal = Spacing.xxl;
      base.borderRadius = Radii.lg;
    } else {
      base.paddingVertical = 12;
      base.paddingHorizontal = Spacing.xl;
    }

    // Variants
    switch (variant) {
      case 'primary':
        base.backgroundColor = Colors.primary;
        base.borderColor = Colors.primary;
        break;
      case 'secondary':
        base.backgroundColor = Colors.primarySubtle;
        base.borderColor = Colors.primarySubtle;
        break;
      case 'outline':
        base.backgroundColor = 'transparent';
        base.borderColor = Colors.primaryMedium;
        break;
      case 'amber':
        base.backgroundColor = Colors.amber;
        base.borderColor = Colors.amber;
        break;
      case 'danger':
        base.backgroundColor = Colors.danger;
        base.borderColor = Colors.danger;
        break;
      case 'ghost':
        base.backgroundColor = 'transparent';
        base.borderColor = 'transparent';
        break;
    }

    if (disabled) {
      base.opacity = 0.5;
    }

    if (fullWidth) {
      base.width = '100%';
    }

    return base;
  };

  const getTextStyle = (): TextStyle => {
    const base: TextStyle = {
      fontWeight: '600',
      textAlign: 'center',
    };

    if (size === 'sm') {
      base.fontSize = 13;
    } else if (size === 'lg') {
      base.fontSize = 16;
    } else {
      base.fontSize = 14;
    }

    switch (variant) {
      case 'primary':
      case 'danger':
        base.color = Colors.textLight;
        break;
      case 'secondary':
        base.color = Colors.primaryDark;
        break;
      case 'outline':
        base.color = Colors.primaryMedium;
        break;
      case 'amber':
        base.color = '#FFFFFF';
        break;
      case 'ghost':
        base.color = Colors.primaryMedium;
        break;
    }

    return base;
  };

  const iconColor =
    variant === 'primary' || variant === 'danger' || variant === 'amber'
      ? Colors.textLight
      : Colors.primaryDark;

  const iconSize = size === 'sm' ? 16 : size === 'lg' ? 20 : 18;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={onPress}
      disabled={disabled || loading}
      style={[getContainerStyle(), style]}
    >
      {loading ? (
        <ActivityIndicator color={iconColor} size="small" />
      ) : (
        <>
          {iconName && iconPosition === 'left' && (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
              style={{ marginRight: Spacing.sm }}
            />
          )}
          <Text style={[getTextStyle(), textStyle]}>{title}</Text>
          {iconName && iconPosition === 'right' && (
            <Ionicons
              name={iconName}
              size={iconSize}
              color={iconColor}
              style={{ marginLeft: Spacing.sm }}
            />
          )}
        </>
      )}
    </TouchableOpacity>
  );
};
