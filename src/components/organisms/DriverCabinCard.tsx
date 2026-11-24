import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { QuickDeductButtons } from '../molecules/QuickDeductButtons';

export interface DriverCabinCardProps {
  truckPlate: string;
  driverName: string;
  isRouteActive: boolean;
  stockRemaining: number;
  totalDelivered: number;
  emptyCylinders: number;
  capacity: number;
  currentStopStep: number;
  totalStopSteps: number;
  currentStopName: string;
  currentStopEstimatedTime: string;
  currentStopNote?: string;
  onStartRoute: () => void;
  onFinishRoute: () => void;
  onDeductStock: (qty: number) => void;
  onNextStop: () => void;
  onReportIncident: () => void;
}

export const DriverCabinCard: React.FC<DriverCabinCardProps> = ({
  truckPlate = 'LPZ-1234',
  driverName = 'Juan Carlos Gómez',
  isRouteActive = true,
  stockRemaining = 184,
  totalDelivered = 42,
  emptyCylinders = 42,
  capacity = 226,
  currentStopStep = 2,
  totalStopSteps = 5,
  currentStopName = 'Cruce Av. Petrolera / Plaza Central',
  currentStopEstimatedTime = '09:15 AM',
  currentStopNote = 'Punto de alta afluencia · Camión Aquí Ahora',
  onStartRoute,
  onFinishRoute,
  onDeductStock,
  onNextStop,
  onReportIncident,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.mustardHeader}>
        <View style={styles.headerTop}>
          <View>
            <Text style={styles.headerTitle}>Panel de Conductor</Text>
            <Text style={styles.headerSubtitle}>
              Camión: {truckPlate} • {driverName}
            </Text>
          </View>
          <Badge
            label={isRouteActive ? 'EN RUTA' : 'DETENIDO'}
            variant={isRouteActive ? 'success' : 'neutral'}
            size="sm"
            dot
          />
        </View>

        <View style={styles.controlsRow}>
          <Pressable
            style={[
              styles.controlBtn,
              isRouteActive ? styles.activeRouteBtn : styles.startRouteBtn,
            ]}
            onPress={onStartRoute}
          >
            <SvgIcon name="play" size={14} color={Colors.textInverse} />
            <Text style={styles.controlBtnText}>
              {isRouteActive ? 'Recorrido en Curso' : 'Iniciar Recorrido'}
            </Text>
          </Pressable>

          <Pressable
            style={[styles.controlBtn, styles.finishRouteBtn]}
            onPress={onFinishRoute}
          >
            <SvgIcon name="square" size={14} color={Colors.textInverse} />
            <Text style={styles.controlBtnText}>Finalizar Recorrido</Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.stockCard}>
        <View style={styles.stockCardHeader}>
          <Text style={styles.stockCardTitle}>CARGA DISPONIBLE EN CAMIÓN</Text>
          <View style={styles.cylinderBadge}>
            <SvgIcon name="cylinder" size={16} color={Colors.mustard} />
          </View>
        </View>

        <View style={styles.metricRow}>
          <View>
            <Text style={styles.bigNumber}>{stockRemaining}</Text>
            <Text style={styles.bigNumberLabel}>garrafas restantes</Text>
          </View>

          <View style={styles.salesSummaryBox}>
            <Text style={styles.salesSummaryTitle}>Entregas Hoy</Text>
            <Text style={styles.salesSummaryValue}>{totalDelivered} vendidas</Text>
            <Text style={styles.salesSummaryBs}>
              Bs. {(totalDelivered * 22.5).toFixed(2)}
            </Text>
          </View>
        </View>

        <QuickDeductButtons onDeduct={onDeductStock} disabled={stockRemaining <= 0} />

        <View style={styles.cylinderBar}>
          <View style={styles.cylinderBarItem}>
            <Text style={styles.cylinderBarLabel}>Cilindros vacíos recibidos:</Text>
            <Text style={styles.cylinderBarValue}>{emptyCylinders}</Text>
          </View>
          <View style={styles.cylinderBarItem}>
            <Text style={styles.cylinderBarLabel}>Capacidad máxima:</Text>
            <Text style={styles.cylinderBarValue}>{capacity}</Text>
          </View>
        </View>
      </View>

      <View style={styles.currentStopCard}>
        <View style={styles.stopCardHeader}>
          <Text style={styles.stopCardStep}>
            HOJA DE RUTA: PARADA ACTUAL (Paso {currentStopStep} de {totalStopSteps})
          </Text>
          <View style={styles.timePill}>
            <SvgIcon name="clock" size={12} color={Colors.mustardDark} />
            <Text style={styles.timePillText}>{currentStopEstimatedTime}</Text>
          </View>
        </View>

        <Text style={styles.stopCardName}>{currentStopName}</Text>
        {currentStopNote ? (
          <Text style={styles.stopCardNote}>{currentStopNote}</Text>
        ) : null}

        <View style={styles.stopCardActions}>
          <Pressable
            style={({ pressed }) => [styles.nextStopBtn, pressed && styles.pressed]}
            onPress={onNextStop}
          >
            <SvgIcon name="checkCircle" size={16} color={Colors.textInverse} />
            <Text style={styles.nextStopText}>Confirmar Parada y Avanzar</Text>
          </Pressable>
        </View>
      </View>

      <Pressable
        style={({ pressed }) => [styles.incidentButton, pressed && styles.pressed]}
        onPress={onReportIncident}
      >
        <SvgIcon name="alertTriangle" size={16} color={Colors.danger} />
        <Text style={styles.incidentButtonText}>Reportar Incidente o Bloqueo Vial</Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: Spacing.md,
  },
  mustardHeader: {
    backgroundColor: Colors.mustard,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textInverse,
    letterSpacing: -0.3,
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#FEF3C7',
    marginTop: 2,
    fontWeight: '500',
  },
  controlsRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  controlBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 10,
    borderRadius: Radius.md,
  },
  startRouteBtn: {
    backgroundColor: Colors.success,
  },
  activeRouteBtn: {
    backgroundColor: '#047857',
  },
  finishRouteBtn: {
    backgroundColor: '#78350F',
  },
  controlBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  stockCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  stockCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  stockCardTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  cylinderBadge: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.mustardLight,
    justifyContent: 'center',
    alignItems: 'center',
  },
  metricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: Spacing.xs,
  },
  bigNumber: {
    fontSize: 42,
    fontWeight: '900',
    color: Colors.textPrimary,
    lineHeight: 46,
  },
  bigNumberLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  salesSummaryBox: {
    backgroundColor: Colors.surfaceSubtle,
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  salesSummaryTitle: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
  },
  salesSummaryValue: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.success,
  },
  salesSummaryBs: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cylinderBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginTop: Spacing.xs,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  cylinderBarItem: {
    flexDirection: 'row',
    gap: 4,
    alignItems: 'center',
  },
  cylinderBarLabel: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  cylinderBarValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  currentStopCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#FDE68A',
    marginBottom: Spacing.sm,
  },
  stopCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  stopCardStep: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.mustardDark,
    letterSpacing: 0.5,
  },
  timePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.mustardLight,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: Radius.pill,
  },
  timePillText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.mustardDark,
  },
  stopCardName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stopCardNote: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 4,
  },
  stopCardActions: {
    marginTop: Spacing.sm,
  },
  nextStopBtn: {
    backgroundColor: Colors.mustard,
    borderRadius: Radius.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    gap: 6,
  },
  nextStopText: {
    color: Colors.textInverse,
    fontSize: 13,
    fontWeight: '700',
  },
  incidentButton: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.danger,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 11,
    gap: 6,
  },
  incidentButtonText: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.danger,
  },
  pressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
});
