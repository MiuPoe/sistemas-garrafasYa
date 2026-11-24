import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { StopTimelineItem } from '../../components/molecules/StopTimelineItem';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';

export const DriverRouteScreen: React.FC = () => {
  const { routes, advanceRouteStop } = useApp();
  const currentRoute = routes[0];

  return (
    <View style={styles.container}>
      <View style={styles.routeHeaderCard}>
        <View style={styles.topRow}>
          <Text style={styles.codeText}>{currentRoute?.codigo_ruta}</Text>
          <Badge label="Hoja de Ruta Oficial" variant="mustard" size="sm" />
        </View>
        <Text style={styles.routeName}>{currentRoute?.nombre_ruta}</Text>
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <SvgIcon name="truck" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>{currentRoute?.vehiculo_placa}</Text>
          </View>
          <View style={styles.metaItem}>
            <SvgIcon name="clock" size={14} color={Colors.textMuted} />
            <Text style={styles.metaText}>Salida: {currentRoute?.hora_salida_programada}</Text>
          </View>
        </View>
      </View>

      <Text style={styles.sectionTitle}>PUNTOS Y PARADAS OBLIGATORIAS DE CONTROL</Text>

      {currentRoute?.stops.map((stop, idx) => (
        <StopTimelineItem
          key={stop.id}
          stop={stop}
          isFirst={idx === 0}
          isLast={idx === (currentRoute.stops.length - 1)}
          actionLabel={stop.estado === 'En curso' ? 'Marcar Parada Completada' : undefined}
          onActionPress={stop.estado === 'En curso' ? advanceRouteStop : undefined}
        />
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  routeHeaderCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  codeText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.mustardDark,
    letterSpacing: 0.5,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.xs,
  },
  metaRow: {
    flexDirection: 'row',
    gap: Spacing.md,
    marginTop: 4,
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  metaText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
});
