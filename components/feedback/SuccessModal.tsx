import React from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import { Colors, Radii, Spacing, Shadows } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';
import { Button } from '../common/Button';

interface SuccessModalProps {
  visible: boolean;
  title: string;
  subtitle: string;
  details?: { label: string; value: string }[];
  primaryBtnTitle: string;
  onPrimaryPress: () => void;
  secondaryBtnTitle?: string;
  onSecondaryPress?: () => void;
  showJourneyGraphic?: boolean;
}

export const SuccessModal: React.FC<SuccessModalProps> = ({
  visible,
  title,
  subtitle,
  details,
  primaryBtnTitle,
  onPrimaryPress,
  secondaryBtnTitle,
  onSecondaryPress,
  showJourneyGraphic = false,
}) => {
  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Animated celebration icon */}
          <View style={styles.iconCircle}>
            <Text style={styles.wheatEmoji}>🌾</Text>
          </View>

          <Text style={styles.title}>{title}</Text>
          <Text style={styles.subtitle}>{subtitle}</Text>

          {showJourneyGraphic && (
            <View style={styles.journeyContainer}>
              <View style={styles.journeyStep}>
                <View style={styles.stepCircle}>
                  <Ionicons name="leaf" size={14} color={Colors.primary} />
                </View>
                <Text style={styles.stepLabel}>Farm</Text>
              </View>

              <View style={styles.journeyLine}>
                <Ionicons name="arrow-forward" size={12} color={Colors.primaryMedium} />
              </View>

              <View style={styles.journeyStep}>
                <View style={[styles.stepCircle, styles.mandiCircle]}>
                  <Ionicons name="shield-checkmark" size={14} color="#FFFFFF" />
                </View>
                <Text style={styles.stepLabel}>Virtual Mandi</Text>
              </View>

              <View style={styles.journeyLine}>
                <Ionicons name="arrow-forward" size={12} color={Colors.primaryMedium} />
              </View>

              <View style={styles.journeyStep}>
                <View style={styles.stepCircle}>
                  <Ionicons name="business" size={14} color={Colors.primary} />
                </View>
                <Text style={styles.stepLabel}>Your Business</Text>
              </View>
            </View>
          )}

          {details && details.length > 0 && (
            <View style={styles.detailsBox}>
              {details.map((item, index) => (
                <View key={index} style={styles.detailRow}>
                  <Text style={styles.detailLabel}>{item.label}</Text>
                  <Text style={styles.detailValue}>{item.value}</Text>
                </View>
              ))}
            </View>
          )}

          <View style={styles.btnRow}>
            <Button
              title={primaryBtnTitle}
              onPress={onPrimaryPress}
              variant="primary"
              size="lg"
              fullWidth
              style={{ marginBottom: secondaryBtnTitle ? Spacing.sm : 0 }}
            />

            {secondaryBtnTitle && onSecondaryPress && (
              <Button
                title={secondaryBtnTitle}
                onPress={onSecondaryPress}
                variant="ghost"
                size="md"
                fullWidth
              />
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(8, 28, 21, 0.75)',
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
  },
  modalCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.xxl,
    padding: Spacing.xxl,
    width: '100%',
    maxWidth: 380,
    alignItems: 'center',
    ...Shadows.popover,
  },
  iconCircle: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.lg,
  },
  wheatEmoji: {
    fontSize: 40,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: Spacing.xs,
  },
  subtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: Spacing.lg,
  },
  journeyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.lg,
    paddingVertical: Spacing.md,
    paddingHorizontal: Spacing.md,
    width: '100%',
    marginBottom: Spacing.lg,
  },
  journeyStep: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primarySubtle,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 4,
  },
  mandiCircle: {
    backgroundColor: Colors.primary,
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  journeyLine: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 2,
    marginBottom: 14,
  },
  detailsBox: {
    width: '100%',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.md,
    padding: Spacing.md,
    marginBottom: Spacing.lg,
    gap: Spacing.xs,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  detailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  btnRow: {
    width: '100%',
  },
});
