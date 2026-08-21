import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface VerificationBadgeProps {
  label?: string;
  size?: 'sm' | 'md';
  variant?: 'farmer' | 'ondc' | 'buyer';
}

export const VerificationBadge: React.FC<VerificationBadgeProps> = ({
  label = 'Verified Farmer',
  size = 'sm',
  variant = 'farmer',
}) => {
  const isSmall = size === 'sm';

  let iconName: keyof typeof Ionicons.glyphMap = 'checkmark-circle';
  let bgColor = Colors.verifiedBadgeBg;
  let textColor = Colors.verifiedBadge;

  if (variant === 'ondc') {
    iconName = 'shield-checkmark';
    bgColor = Colors.ondcBadgeBg;
    textColor = Colors.ondcBadge;
  } else if (variant === 'buyer') {
    iconName = 'checkmark-circle';
    bgColor = '#EBF4FB';
    textColor = '#1E6091';
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: bgColor },
        isSmall ? styles.containerSm : styles.containerMd,
      ]}
    >
      <Ionicons
        name={iconName}
        size={isSmall ? 12 : 14}
        color={textColor}
        style={{ marginRight: 3 }}
      />
      <Text
        style={[
          styles.text,
          { color: textColor },
          isSmall ? styles.textSm : styles.textMd,
        ]}
      >
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: Radii.pill,
    alignSelf: 'flex-start',
  },
  containerSm: {
    paddingHorizontal: 7,
    paddingVertical: 2.5,
  },
  containerMd: {
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  text: {
    fontWeight: '700',
  },
  textSm: {
    fontSize: 11,
  },
  textMd: {
    fontSize: 12,
  },
});
