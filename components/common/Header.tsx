import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, SafeAreaView, Platform, StatusBar } from 'react-native';
import { Colors, Spacing, Radii, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

interface HeaderProps {
  title?: string;
  subtitle?: string;
  showBack?: boolean;
  showRoleToggle?: boolean;
  showNotification?: boolean;
  showCart?: boolean;
  rightAction?: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({
  title,
  subtitle,
  showBack = false,
  showRoleToggle = true,
  showNotification = true,
  showCart = false,
  rightAction,
}) => {
  const router = useRouter();
  const { role, switchRole } = useAuth();
  const { itemCount } = useCart();

  const handleToggleRole = () => {
    const nextRole = role === 'farmer' ? 'buyer' : 'farmer';
    switchRole(nextRole);
    if (nextRole === 'farmer') {
      router.replace('/(farmer)');
    } else {
      router.replace('/(buyer)');
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showBack ? (
            <TouchableOpacity
              onPress={() => router.back()}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={22} color={Colors.textPrimary} />
            </TouchableOpacity>
          ) : null}

          {title ? (
            <View style={styles.titleContainer}>
              <Text style={styles.title} numberOfLines={1}>
                {title}
              </Text>
              {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
            </View>
          ) : (
            <View style={styles.brandContainer}>
              <View style={styles.brandLogo}>
                <Ionicons name="leaf" size={16} color={Colors.surface} />
              </View>
              <View>
                <Text style={styles.brandTitle}>Virtual Mandi</Text>
                <Text style={styles.brandSub}>Direct Farm Sourcing</Text>
              </View>
            </View>
          )}
        </View>

        <View style={styles.rightSection}>
          {showRoleToggle && (
            <TouchableOpacity
              onPress={handleToggleRole}
              style={[
                styles.roleToggleBadge,
                role === 'farmer' ? styles.farmerBadge : styles.buyerBadge,
              ]}
              activeOpacity={0.8}
            >
              <Ionicons
                name={role === 'farmer' ? 'storefront-outline' : 'cart-outline'}
                size={13}
                color={role === 'farmer' ? Colors.primaryDark : '#1E6091'}
              />
              <Text
                style={[
                  styles.roleToggleText,
                  { color: role === 'farmer' ? Colors.primaryDark : '#1E6091' },
                ]}
              >
                {role === 'farmer' ? 'Farmer Mode' : 'Bulk Buyer'}
              </Text>
              <Ionicons
                name="swap-horizontal"
                size={12}
                color={role === 'farmer' ? Colors.primaryDark : '#1E6091'}
                style={{ marginLeft: 3 }}
              />
            </TouchableOpacity>
          )}

          {showCart && role === 'buyer' && (
            <TouchableOpacity
              onPress={() => router.push('/(buyer)/cart')}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="bag-handle-outline" size={22} color={Colors.textPrimary} />
              {itemCount > 0 && (
                <View style={styles.cartBadge}>
                  <Text style={styles.cartBadgeText}>{itemCount}</Text>
                </View>
              )}
            </TouchableOpacity>
          )}

          {showNotification && (
            <TouchableOpacity
              onPress={() => router.push('/notifications')}
              style={styles.iconButton}
              activeOpacity={0.7}
            >
              <Ionicons name="notifications-outline" size={22} color={Colors.textPrimary} />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          )}

          {rightAction}
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: Colors.surface,
    paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    ...Shadows.subtle,
  },
  container: {
    height: 56,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.lg,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  titleContainer: {
    marginLeft: Spacing.xs,
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textMuted,
    marginTop: 1,
  },
  brandContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  brandLogo: {
    width: 28,
    height: 28,
    borderRadius: Radii.sm,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  brandTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.primaryDark,
    letterSpacing: -0.2,
  },
  brandSub: {
    fontSize: 10,
    fontWeight: '500',
    color: Colors.textMuted,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  iconButton: {
    width: 38,
    height: 38,
    borderRadius: Radii.pill,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.surfaceSubtle,
    position: 'relative',
  },
  roleToggleBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: Spacing.sm + 2,
    paddingVertical: 5,
    borderRadius: Radii.pill,
    gap: 4,
    borderWidth: 1,
  },
  farmerBadge: {
    backgroundColor: Colors.primarySubtle,
    borderColor: Colors.primaryAccent,
  },
  buyerBadge: {
    backgroundColor: '#EBF4FB',
    borderColor: '#90CDF4',
  },
  roleToggleText: {
    fontSize: 11,
    fontWeight: '700',
  },
  cartBadge: {
    position: 'absolute',
    top: 4,
    right: 4,
    backgroundColor: Colors.terracotta,
    borderRadius: Radii.pill,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  cartBadgeText: {
    color: '#FFFFFF',
    fontSize: 9,
    fontWeight: '700',
  },
  notifDot: {
    position: 'absolute',
    top: 8,
    right: 9,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: Colors.terracotta,
  },
});
