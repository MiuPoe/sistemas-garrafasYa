import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge, BadgeVariant } from '../atoms/Badge';
import { Complaint } from '../../types';

export interface ClaimCardProps {
  claim: Complaint;
  onPress?: () => void;
}

export const ClaimCard: React.FC<ClaimCardProps> = ({ claim, onPress }) => {
  const getStatusVariant = (status: string): BadgeVariant => {
    switch (status) {
      case 'Resuelto':
        return 'success';
      case 'En revisión':
        return 'warning';
      default:
        return 'danger';
    }
  };

  const getPriorityVariant = (priority: string): BadgeVariant => {
    switch (priority) {
      case 'Alta':
        return 'danger';
      case 'Media':
        return 'warning';
      default:
        return 'neutral';
    }
  };

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.headerRow}>
        <View style={styles.codeContainer}>
          <SvgIcon name="fileText" size={14} color={Colors.accentBlue} />
          <Text style={styles.codeText}>{claim.ticket_code}</Text>
        </View>
        <View style={styles.badgeRow}>
          <Badge
            label={claim.prioridad}
            variant={getPriorityVariant(claim.prioridad)}
            size="sm"
          />
          <Badge
            label={claim.estado}
            variant={getStatusVariant(claim.estado)}
            size="sm"
          />
        </View>
      </View>

      <Text style={styles.reasonText}>{claim.tipo_reclamo}</Text>
      <Text style={styles.descriptionText} numberOfLines={2}>
        {claim.descripcion}
      </Text>

      <View style={styles.footerRow}>
        <View style={styles.metaItem}>
          <SvgIcon name="user" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{claim.nombre_consumidor}</Text>
        </View>
        <View style={styles.metaItem}>
          <SvgIcon name="truck" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{claim.placa_camion || 'Sin placa'}</Text>
        </View>
        <View style={styles.metaItem}>
          <SvgIcon name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{claim.created_at}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  codeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  codeText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 6,
  },
  reasonText: {
    fontSize: 15,
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  descriptionText: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.xs + 2,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  pressed: {
    opacity: 0.85,
  },
});
