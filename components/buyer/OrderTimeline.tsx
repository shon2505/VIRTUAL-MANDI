import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { OrderTimelineEvent } from '../../types';
import { Ionicons } from '@expo/vector-icons';

interface OrderTimelineProps {
  timeline: OrderTimelineEvent[];
}

export const OrderTimeline: React.FC<OrderTimelineProps> = ({ timeline }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Procurement Lifecycle Timeline</Text>

      <View style={styles.list}>
        {timeline.map((event, index) => {
          const isLast = index === timeline.length - 1;
          const isCompleted = event.completed;
          const isCurrent = event.current;

          return (
            <View key={index} style={styles.timelineRow}>
              <View style={styles.indicatorCol}>
                <View
                  style={[
                    styles.node,
                    isCompleted
                      ? styles.nodeCompleted
                      : isCurrent
                      ? styles.nodeCurrent
                      : styles.nodePending,
                  ]}
                >
                  {isCompleted ? (
                    <Ionicons name="checkmark" size={12} color="#FFFFFF" />
                  ) : isCurrent ? (
                    <View style={styles.currentPulse} />
                  ) : (
                    <View style={styles.pendingDot} />
                  )}
                </View>
                {!isLast && (
                  <View
                    style={[
                      styles.line,
                      isCompleted ? styles.lineCompleted : styles.linePending,
                    ]}
                  />
                )}
              </View>

              <View style={styles.contentCol}>
                <View style={styles.eventHeader}>
                  <Text
                    style={[
                      styles.eventTitle,
                      isCurrent && styles.eventTitleCurrent,
                      !isCompleted && !isCurrent && styles.eventTitlePending,
                    ]}
                  >
                    {event.title}
                  </Text>
                  <Text style={styles.timestamp}>{event.timestamp}</Text>
                </View>

                {event.description ? (
                  <Text style={styles.description}>{event.description}</Text>
                ) : null}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.md,
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: Spacing.lg,
  },
  list: {
    paddingLeft: Spacing.xs,
  },
  timelineRow: {
    flexDirection: 'row',
    minHeight: 56,
  },
  indicatorCol: {
    alignItems: 'center',
    width: 28,
  },
  node: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 1,
  },
  nodeCompleted: {
    backgroundColor: Colors.primaryMedium,
  },
  nodeCurrent: {
    backgroundColor: Colors.amber,
  },
  nodePending: {
    backgroundColor: Colors.borderLight,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  currentPulse: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#FFFFFF',
  },
  pendingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.textMuted,
  },
  line: {
    width: 2,
    flex: 1,
    marginVertical: 2,
  },
  lineCompleted: {
    backgroundColor: Colors.primaryMedium,
  },
  linePending: {
    backgroundColor: Colors.borderLight,
  },
  contentCol: {
    flex: 1,
    marginLeft: Spacing.md,
    paddingBottom: Spacing.lg,
  },
  eventHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: Spacing.xs,
  },
  eventTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  eventTitleCurrent: {
    color: Colors.amberDark,
  },
  eventTitlePending: {
    color: Colors.textMuted,
  },
  timestamp: {
    fontSize: 10,
    color: Colors.textMuted,
    fontWeight: '500',
  },
  description: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 3,
    lineHeight: 16,
  },
});
