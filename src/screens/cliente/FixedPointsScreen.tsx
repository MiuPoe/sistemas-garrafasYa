import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';

export const FixedPointsScreen: React.FC = () => {
  const { fixedPoints } = useApp();

  return (
    <View style={styles.container}>
      <View style={styles.infoBanner}>
        <SvgIcon name="info" size={16} color={Colors.accentBlue} />
        <Text style={styles.infoBannerText}>
          Si el camión repartidor ya pasó o necesitas gas con urgencia, puedes
          acudir directamente a cualquiera de los puntos autorizados de venta.
        </Text>
      </View>

      <Text style={styles.sectionTitle}>PUNTOS FIJOS Y DEPÓSITOS DE DISTRIBUCIÓN</Text>

      {fixedPoints.map((point) => (
        <View key={point.id} style={styles.card}>
          <View style={styles.topRow}>
            <Text style={styles.name}>{point.nombre}</Text>
            <Badge
              label={`${point.stock_disponible} garrafas`}
              variant={point.stock_disponible > 50 ? 'success' : 'warning'}
              size="sm"
            />
          </View>

          <View style={styles.infoRow}>
            <SvgIcon name="mapPin" size={14} color={Colors.textMuted} />
            <Text style={styles.infoText}>{point.direccion}</Text>
          </View>

          <View style={styles.infoRow}>
            <SvgIcon name="clock" size={14} color={Colors.textMuted} />
            <Text style={styles.infoText}>{point.horario_atencion}</Text>
          </View>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  infoBanner: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#EFF6FF',
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#BFDBFE',
    marginBottom: Spacing.md,
  },
  infoBannerText: {
    flex: 1,
    fontSize: 12,
    color: Colors.accentBlue,
    lineHeight: 18,
    fontWeight: '500',
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  topRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  name: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
    marginRight: Spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  infoText: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
});
