import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';

export interface QuickDeductButtonsProps {
  onDeduct: (count: number) => void;
  disabled?: boolean;
}

export const QuickDeductButtons: React.FC<QuickDeductButtonsProps> = ({
  onDeduct,
  disabled = false,
}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>REGISTRAR ENTREGA RÁPIDA</Text>
      <View style={styles.buttonsRow}>
        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.primaryAction,
            pressed && styles.pressed,
            disabled && styles.disabled,
          ]}
          onPress={() => onDeduct(1)}
          disabled={disabled}
        >
          <View style={styles.iconCircle}>
            <SvgIcon name="cylinder" size={16} color={Colors.mustard} />
          </View>
          <Text style={styles.qtyText}>-1 Garrafa</Text>
          <Text style={styles.priceText}>Bs 22.50 (10 kg)</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryAction,
            pressed && styles.pressed,
            disabled && styles.disabled,
          ]}
          onPress={() => onDeduct(2)}
          disabled={disabled}
        >
          <Text style={styles.qtyText}>-2 Garrafas</Text>
          <Text style={styles.priceText}>Bs 45.00 · Doble</Text>
        </Pressable>

        <Pressable
          style={({ pressed }) => [
            styles.button,
            styles.secondaryAction,
            pressed && styles.pressed,
            disabled && styles.disabled,
          ]}
          onPress={() => onDeduct(5)}
          disabled={disabled}
        >
          <Text style={styles.qtyText}>-5 Garrafas</Text>
          <Text style={styles.priceText}>Bs 112.50 · Mayor</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.xs,
  },
  buttonsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  button: {
    flex: 1,
    borderRadius: Radius.md,
    paddingVertical: Spacing.sm + 2,
    paddingHorizontal: Spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
  },
  primaryAction: {
    backgroundColor: '#FFFBEB',
    borderColor: Colors.mustard,
  },
  secondaryAction: {
    backgroundColor: Colors.surface,
    borderColor: Colors.borderStrong,
  },
  iconCircle: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.mustardLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 4,
  },
  qtyText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  priceText: {
    fontSize: 10,
    fontWeight: '600',
    color: Colors.textMuted,
    marginTop: 2,
    textAlign: 'center',
  },
  pressed: {
    opacity: 0.8,
    transform: [{ scale: 0.97 }],
  },
  disabled: {
    opacity: 0.4,
  },
});
