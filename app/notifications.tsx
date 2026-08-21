import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Radii, Spacing, Shadows } from '../constants/theme';
import { useAuth } from '../context/AuthContext';
import { Header } from '../components/common/Header';
import { MOCK_NOTIFICATIONS } from '../services/mockData';
import { NotificationItem } from '../types';
import { Ionicons } from '@expo/vector-icons';

export default function NotificationsScreen() {
  const router = useRouter();
  const { role } = useAuth();
  const [notifications, setNotifications] = useState<NotificationItem[]>(MOCK_NOTIFICATIONS);

  const filteredNotifs = notifications.filter(
    n => n.targetRole === 'all' || n.targetRole === role
  );

  const handlePressNotif = (notif: NotificationItem) => {
    // Mark as read
    setNotifications(prev =>
      prev.map(item => (item.id === notif.id ? { ...item, read: true } : item))
    );
    if (notif.actionRoute) {
      router.push(notif.actionRoute as any);
    }
  };

  const getIcon = (type: NotificationItem['type']) => {
    switch (type) {
      case 'order':
        return { icon: 'receipt', color: Colors.primary };
      case 'quote':
        return { icon: 'pricetag', color: '#1E6091' };
      case 'payment':
        return { icon: 'wallet', color: Colors.primaryDark };
      case 'delivery':
        return { icon: 'car', color: Colors.terracotta };
      default:
        return { icon: 'notifications', color: Colors.primaryMedium };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Header
        title="Notifications Hub"
        subtitle={`Live Alerts for ${role === 'farmer' ? 'Farmer Mode' : 'Bulk Buyer'}`}
        showBack={true}
        showRoleToggle={false}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {filteredNotifs.map(item => {
          const { icon, color } = getIcon(item.type);

          return (
            <TouchableOpacity
              key={item.id}
              onPress={() => handlePressNotif(item)}
              style={[
                styles.notifCard,
                !item.read && styles.notifUnread,
              ]}
              activeOpacity={0.8}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: `${color}15` },
                ]}
              >
                <Ionicons name={icon as any} size={20} color={color} />
              </View>

              <View style={styles.notifContent}>
                <View style={styles.notifHeader}>
                  <Text style={styles.notifTitle} numberOfLines={1}>
                    {item.title}
                  </Text>
                  <Text style={styles.notifTime}>{item.timestamp}</Text>
                </View>

                <Text style={styles.notifBody}>{item.body}</Text>
              </View>

              {!item.read && <View style={styles.unreadDot} />}
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
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
  notifCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    marginBottom: Spacing.sm,
    borderWidth: 1,
    borderColor: Colors.border,
    position: 'relative',
    ...Shadows.subtle,
  },
  notifUnread: {
    backgroundColor: Colors.primaryWash,
    borderColor: Colors.primarySubtle,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: Radii.md,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: Spacing.md,
  },
  notifContent: {
    flex: 1,
  },
  notifHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 3,
  },
  notifTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.xs,
  },
  notifTime: {
    fontSize: 10,
    color: Colors.textMuted,
  },
  notifBody: {
    fontSize: 12,
    color: Colors.textSecondary,
    lineHeight: 16,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.terracotta,
    position: 'absolute',
    top: 10,
    right: 10,
  },
});
