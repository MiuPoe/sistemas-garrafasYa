import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';

export interface TruckSightingBannerProps {
  onReportPress: () => void;
  recentCount?: number;
  latestComment?: string;
}

export const TruckSightingBanner: React.FC<TruckSightingBannerProps> = ({
  onReportPress,
  recentCount = 2,
  latestComment = 'Visto en Cruce Av. Petrolera hace 5 min',
}) => {
  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.badgeRow}>
          <View style={styles.pulseDot} />
          <Text style={styles.badgeText}>AVISO CIUDADANO COLABORATIVO</Text>
        </View>
        <Badge label={`${recentCount} reportes hoy`} variant="info" size="sm" />
      </View>

      <Text style={styles.heading}>¿Viste pasar el camión repartidor?</Text>
      <Text style={styles.subtitle}>{latestComment}</Text>

      <Pressable
        onPress={onReportPress}
        style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}
      >
        <SvgIcon name="eye" size={16} color={Colors.textInverse} />
        <Text style={styles.actionText}>¡Vi el camión! Avisar a mi zona</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#BFDBFE',
    marginVertical: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentBlue,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentBlue,
    letterSpacing: 0.5,
  },
  heading: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  actionButton: {
    backgroundColor: Colors.accentBlue,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Spacing.sm + 2,
    gap: Spacing.xs,
  },
  actionText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textInverse,
  },
  pressed: {
    opacity: 0.85,
  },
});
