import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';
import { Ionicons } from '@expo/vector-icons';

interface QuantitySelectorProps {
  quantity: number;
  minQuantity: number;
  maxQuantity: number;
  step?: number;
  onChange: (qty: number) => void;
  unit?: 'kg' | 'quintal' | 'tonne';
}

export const QuantitySelector: React.FC<QuantitySelectorProps> = ({
  quantity,
  minQuantity,
  maxQuantity,
  step = 50,
  onChange,
  unit = 'kg',
}) => {
  const [activeUnit, setActiveUnit] = useState<'kg' | 'quintal' | 'tonne'>('kg');

  const handleDecrease = () => {
    const next = Math.max(minQuantity, quantity - step);
    onChange(next);
  };

  const handleIncrease = () => {
    const next = Math.min(maxQuantity, quantity + step);
    onChange(next);
  };

  const handleTextChange = (text: string) => {
    const numeric = parseInt(text.replace(/[^0-9]/g, ''), 10);
    if (!isNaN(numeric)) {
      onChange(Math.min(maxQuantity, numeric));
    } else {
      onChange(minQuantity);
    }
  };

  const convertDisplay = (qtyInKg: number) => {
    if (activeUnit === 'tonne') {
      return (qtyInKg / 1000).toFixed(2);
    } else if (activeUnit === 'quintal') {
      return (qtyInKg / 100).toFixed(1);
    }
    return qtyInKg.toString();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Select Procurement Quantity</Text>
        <View style={styles.unitToggle}>
          {(['kg', 'quintal', 'tonne'] as const).map(u => (
            <TouchableOpacity
              key={u}
              onPress={() => setActiveUnit(u)}
              style={[styles.unitBtn, activeUnit === u && styles.unitBtnActive]}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.unitText,
                  activeUnit === u && styles.unitTextActive,
                ]}
              >
                {u}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.controlsRow}>
        <TouchableOpacity
          onPress={handleDecrease}
          disabled={quantity <= minQuantity}
          style={[styles.stepperBtn, quantity <= minQuantity && styles.btnDisabled]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="remove"
            size={20}
            color={quantity <= minQuantity ? Colors.textMuted : Colors.primaryDark}
          />
        </TouchableOpacity>

        <View style={styles.inputBox}>
          <TextInput
            value={quantity.toString()}
            onChangeText={handleTextChange}
            keyboardType="number-pad"
            style={styles.input}
          />
          <Text style={styles.unitLabel}>kg</Text>
        </View>

        <TouchableOpacity
          onPress={handleIncrease}
          disabled={quantity >= maxQuantity}
          style={[styles.stepperBtn, quantity >= maxQuantity && styles.btnDisabled]}
          activeOpacity={0.7}
        >
          <Ionicons
            name="add"
            size={20}
            color={quantity >= maxQuantity ? Colors.textMuted : Colors.primaryDark}
          />
        </TouchableOpacity>
      </View>

      <View style={styles.helperRow}>
        <Text style={styles.helperText}>
          Min order: <Text style={styles.bold}>{minQuantity.toLocaleString()} kg</Text>
        </Text>
        <Text style={styles.helperText}>
          Equiv: <Text style={styles.bold}>{(quantity / 100).toFixed(1)} qtl</Text> /{' '}
          <Text style={styles.bold}>{(quantity / 1000).toFixed(2)} tonnes</Text>
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radii.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginVertical: Spacing.xs,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  label: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  unitToggle: {
    flexDirection: 'row',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radii.pill,
    padding: 2,
  },
  unitBtn: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: Radii.pill,
  },
  unitBtnActive: {
    backgroundColor: Colors.primary,
  },
  unitText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
  },
  unitTextActive: {
    color: Colors.surface,
  },
  controlsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.md,
  },
  stepperBtn: {
    width: 46,
    height: 46,
    borderRadius: Radii.md,
    backgroundColor: Colors.surfaceSubtle,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  btnDisabled: {
    opacity: 0.4,
  },
  inputBox: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 46,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
  },
  input: {
    fontSize: 20,
    fontWeight: '700',
    color: Colors.primaryDark,
    textAlign: 'center',
    paddingVertical: 0,
    minWidth: 80,
  },
  unitLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginLeft: 4,
  },
  helperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: Spacing.sm,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  bold: {
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});
