import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'expo-router';

export const RoleSwitcherBanner: React.FC = () => {
  const { role, switchRole } = useAuth();
  const router = useRouter();

  const handleSwitch = (newRole: 'farmer' | 'buyer') => {
    if (newRole === role) return;
    switchRole(newRole);
    if (newRole === 'farmer') {
      router.replace('/(farmer)');
    } else {
      router.replace('/(buyer)');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.pillTrack}>
        <TouchableOpacity
          style={[styles.segment, role === 'farmer' && styles.segmentActiveFarmer]}
          onPress={() => handleSwitch('farmer')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="leaf"
            size={14}
            color={role === 'farmer' ? Colors.surface : Colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              role === 'farmer' && styles.segmentTextActiveFarmer,
            ]}
          >
            Farmer Mode
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.segment, role === 'buyer' && styles.segmentActiveBuyer]}
          onPress={() => handleSwitch('buyer')}
          activeOpacity={0.8}
        >
          <Ionicons
            name="briefcase"
            size={14}
            color={role === 'buyer' ? Colors.surface : Colors.textMuted}
          />
          <Text
            style={[
              styles.segmentText,
              role === 'buyer' && styles.segmentTextActiveBuyer,
            ]}
          >
            Bulk Buyer Mode
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.background,
  },
  pillTrack: {
    flexDirection: 'row',
    backgroundColor: Colors.borderLight,
    borderRadius: Radii.pill,
    padding: 3,
  },
  segment: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
    borderRadius: Radii.pill,
    gap: 6,
  },
  segmentActiveFarmer: {
    backgroundColor: Colors.primary,
    shadowColor: Colors.primaryDark,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentActiveBuyer: {
    backgroundColor: '#1E6091',
    shadowColor: '#0C3D61',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  segmentTextActiveFarmer: {
    color: Colors.surface,
  },
  segmentTextActiveBuyer: {
    color: Colors.surface,
  },
});
