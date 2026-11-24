import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { RouteIncident } from '../../types';

export interface IncidentCardProps {
  incident: RouteIncident;
  onPress?: () => void;
}

export const IncidentCard: React.FC<IncidentCardProps> = ({ incident, onPress }) => {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.topRow}>
        <View style={styles.titleRow}>
          <SvgIcon name="alertTriangle" size={16} color={Colors.danger} />
          <Text style={styles.typeText}>{incident.tipo_incidente}</Text>
        </View>
        <Badge
          label={incident.estado}
          variant={incident.estado === 'Activo' ? 'danger' : 'warning'}
          size="sm"
          dot={incident.estado === 'Activo'}
        />
      </View>

      <Text style={styles.description}>{incident.descripcion}</Text>

      <View style={styles.footer}>
        <View style={styles.metaRow}>
          <SvgIcon name="truck" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{incident.vehiculo_placa}</Text>
        </View>
        <View style={styles.metaRow}>
          <SvgIcon name="user" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{incident.conductor_nombre}</Text>
        </View>
        <View style={styles.metaRow}>
          <SvgIcon name="clock" size={12} color={Colors.textMuted} />
          <Text style={styles.metaText}>{incident.created_at}</Text>
        </View>
      </View>
    </Pressable>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFF7ED',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FED7AA',
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: '800',
    color: '#9A3412',
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.sm,
  },
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: '#FDBA74',
    paddingTop: Spacing.xs,
  },
  metaRow: {
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
