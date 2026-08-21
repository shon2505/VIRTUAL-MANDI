import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  StyleProp,
  ViewStyle,
  TextInputProps,
} from 'react-native';
import { Colors, Radii, Spacing } from '../../constants/theme';

interface InputProps extends TextInputProps {
  label?: string;
  helperText?: string;
  error?: string;
  prefix?: string;
  suffix?: string;
  containerStyle?: StyleProp<ViewStyle>;
  required?: boolean;
}

export const Input: React.FC<InputProps> = ({
  label,
  helperText,
  error,
  prefix,
  suffix,
  containerStyle,
  required,
  style,
  ...textInputProps
}) => {
  return (
    <View style={[styles.container, containerStyle]}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {required && <Text style={styles.required}>*</Text>}
        </View>
      )}

      <View
        style={[
          styles.inputContainer,
          error ? styles.inputError : null,
          textInputProps.editable === false ? styles.inputDisabled : null,
        ]}
      >
        {prefix && <Text style={styles.affixText}>{prefix}</Text>}
        <TextInput
          placeholderTextColor={Colors.textMuted}
          style={[styles.input, style]}
          {...textInputProps}
        />
        {suffix && <Text style={styles.affixText}>{suffix}</Text>}
      </View>

      {error ? (
        <Text style={styles.errorText}>{error}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  required: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.danger,
    marginLeft: 3,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radii.md,
    paddingHorizontal: Spacing.md,
    minHeight: 46,
  },
  input: {
    flex: 1,
    fontSize: 14,
    color: Colors.textPrimary,
    paddingVertical: 10,
  },
  affixText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textMuted,
    marginHorizontal: 4,
  },
  inputError: {
    borderColor: Colors.danger,
    backgroundColor: Colors.dangerBg,
  },
  inputDisabled: {
    backgroundColor: Colors.surfaceSubtle,
    opacity: 0.7,
  },
  errorText: {
    fontSize: 11,
    color: Colors.danger,
    marginTop: 4,
  },
  helperText: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 4,
  },
});
