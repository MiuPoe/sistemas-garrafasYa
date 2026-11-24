import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';
import { IncidentReportModal } from '../../components/organisms/IncidentReportModal';
import { UserProfileModal } from '../../components/organisms/UserProfileModal';

export const DriverHomeScreen: React.FC = () => {
  const {
    currentUser,
    stockRemaining,
    totalDelivered,
    emptyCylinders,
    deductStock,
    routes,
    advanceRouteStop,
    isRouteActive,
    toggleRouteActive,
    driverStatus,
    setDriverStatus,
    finishRoute,
    addIncident,
  } = useApp();

  const [incidentModalVisible, setIncidentModalVisible] = useState<boolean>(false);
  const [profileModalVisible, setProfileModalVisible] = useState<boolean>(false);
  const [showFullStops, setShowFullStops] = useState<boolean>(true);

  // Buscar la ruta asignada al conductor actual (o la primera activa)
  const assignedRoute =
    routes.find(
      (r) =>
        r.conductor_nombre.toLowerCase().includes('raul') ||
        r.conductor_nombre === currentUser.full_name
    ) || routes[0];

  const currentStop =
    assignedRoute?.stops.find((s) => s.estado === 'En curso') ||
    assignedRoute?.stops[1] ||
    assignedRoute?.stops[0];

  const isRouteFinished =
    assignedRoute?.estado === 'Finalizada' || driverStatus === 'Finalizado';

  const handleNextStop = () => {
    advanceRouteStop();
    Alert.alert('Parada Confirmada', 'Se avanzó al siguiente punto de entrega en La Paz.');
  };

  const handleFinishRoute = () => {
    Alert.alert(
      '¿Finalizar Recorrido de Hoy?',
      'Esta acción marcará tu ruta como concluida en Supabase, vaciará el stock activo del camión y lo pondrá en estado de descanso.',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, Finalizar Recorrido',
          style: 'destructive',
          onPress: async () => {
            await finishRoute(assignedRoute?.id);
            Alert.alert(
              'Recorrido Finalizado',
              'Ruta concluida y sincronizada en tiempo real con la administración central de Senkata.'
            );
          },
        },
      ]
    );
  };

  const handleStatusChange = (newStatus: 'En ruta' | 'Próximo a llegar' | 'Finalizado') => {
    if (newStatus === 'Finalizado') {
      handleFinishRoute();
      return;
    }
    setDriverStatus(newStatus);
    Alert.alert('Estado Actualizado', `Tu estado ahora es: ${newStatus}`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Barra de Conductor con acceso directo a Mi Perfil */}
      <View style={styles.driverTopBar}>
        <View style={styles.driverProfileBrief}>
          <View style={styles.driverAvatarBadge}>
            <Text style={styles.driverAvatarText}>
              {currentUser.full_name ? currentUser.full_name.slice(0, 2).toUpperCase() : 'RC'}
            </Text>
          </View>
          <View>
            <Text style={styles.driverNameLabel}>{currentUser.full_name || 'Raul Chofer (Conductor)'}</Text>
            <Text style={styles.driverCodeLabel}>Código: {currentUser.code || 'GY-DRV-012'} • Camión: ABC-1234</Text>
          </View>
        </View>

        <Pressable
          style={styles.driverProfileActionBtn}
          onPress={() => setProfileModalVisible(true)}
        >
          <SvgIcon name="user" size={16} color={Colors.primary} />
          <Text style={styles.driverProfileActionText}>Mi Perfil</Text>
        </Pressable>
      </View>

      {/* ================================================================= */}
      {/* BANNER PRINCIPAL: RUTA ACTIVA VS FINALIZADA */}
      {/* ================================================================= */}
      {isRouteFinished ? (
        <View style={styles.completedBanner}>
          <View style={styles.pedidosYaTop}>
            <View style={[styles.bellPill, { backgroundColor: '#10B981' }]}>
              <SvgIcon name="checkCircle" size={16} color="#FFFFFF" />
              <Text style={styles.bellPillText}>RECORRIDO FINALIZADO</Text>
            </View>
            <Badge label="En Descanso" variant="neutral" size="sm" dot={false} />
          </View>

          <Text style={styles.completedTitle}>
            Recorrido finalizado exitosamente
          </Text>
          <Text style={styles.completedSubtitle}>
            Esperando nueva ruta asignada por la administración central de Senkata.
          </Text>

          <View style={styles.completedSummaryBox}>
            <Text style={styles.completedSummaryTitle}>Resumen de la jornada de hoy:</Text>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>• Ruta:</Text>
              <Text style={styles.summaryItemValue}>{assignedRoute?.nombre_ruta || 'Zona Sur (La Paz)'}</Text>
            </View>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>• Garrafas entregadas hoy:</Text>
              <Text style={styles.summaryItemValue}>{totalDelivered} unidades (Bs. 22.50 c/u)</Text>
            </View>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>• Cilindros vacíos recibidos:</Text>
              <Text style={styles.summaryItemValue}>{emptyCylinders} cilindros</Text>
            </View>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>• Garrafas restantes en camión:</Text>
              <Text style={styles.summaryItemValue}>0 garrafas</Text>
            </View>
            <View style={styles.summaryItemRow}>
              <Text style={styles.summaryItemLabel}>• Estado del camión:</Text>
              <Text style={[styles.summaryItemValue, { color: '#10B981', fontWeight: '700' }]}>Descanso en Base</Text>
            </View>
          </View>
        </View>
      ) : (
        <>
          <View style={styles.pedidosYaBanner}>
            <View style={styles.pedidosYaTop}>
              <View style={styles.bellPill}>
                <SvgIcon name="truck" size={16} color="#FFFFFF" />
                <Text style={styles.bellPillText}>RUTA ASIGNADA ACTIVA</Text>
              </View>
              <Badge
                label={driverStatus}
                variant={
                  driverStatus === 'Próximo a llegar'
                    ? 'warning'
                    : driverStatus === 'En ruta'
                    ? 'success'
                    : 'neutral'
                }
                size="sm"
                dot={true}
              />
            </View>

            <Text style={styles.pedidosYaTitle}>
              ¡Tienes un recorrido de distribución en curso!
            </Text>
            <Text style={styles.pedidosYaSubtitle}>
              {assignedRoute?.nombre_ruta || 'Ruta 1: Zona Sur (Obrajes - Los Pinos)'}
            </Text>

            <View style={styles.originDestCard}>
              <View style={styles.pointRow}>
                <View style={[styles.dot, { backgroundColor: '#10B981' }]} />
                <Text style={styles.pointLabel}>Partida: </Text>
                <Text style={styles.pointValue} numberOfLines={1}>
                  {assignedRoute?.punto_origen || 'Planta Central Senkata (Distribuidora La Paz)'}
                </Text>
              </View>
              <View style={styles.pointDivider} />
              <View style={styles.pointRow}>
                <View style={[styles.dot, { backgroundColor: '#EF4444' }]} />
                <Text style={styles.pointLabel}>Destino: </Text>
                <Text style={styles.pointValue} numberOfLines={1}>
                  {assignedRoute?.punto_destino || 'Calle 15 de Irpavi'}
                </Text>
              </View>
            </View>

            {/* Selector de Estado del Recorrido (Checklist #5) */}
            <Text style={styles.statusChangeLabel}>Cambiar Estado de Recorrido:</Text>
            <View style={styles.statusButtonsRow}>
              <Pressable
                style={[
                  styles.statusBtn,
                  driverStatus === 'En ruta' && styles.statusBtnActive,
                ]}
                onPress={() => handleStatusChange('En ruta')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    driverStatus === 'En ruta' && styles.statusBtnTextActive,
                  ]}
                >
                  En ruta
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusBtn,
                  driverStatus === 'Próximo a llegar' && styles.statusBtnActive,
                ]}
                onPress={() => handleStatusChange('Próximo a llegar')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    driverStatus === 'Próximo a llegar' && styles.statusBtnTextActive,
                  ]}
                >
                  Próximo a llegar
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.statusBtn,
                  driverStatus === 'Finalizado' && styles.statusBtnActive,
                ]}
                onPress={() => handleStatusChange('Finalizado')}
              >
                <Text
                  style={[
                    styles.statusBtnText,
                    driverStatus === 'Finalizado' && styles.statusBtnTextActive,
                  ]}
                >
                  Finalizado
                </Text>
              </Pressable>
            </View>
          </View>

          {/* ================================================================= */}
          {/* PANEL DE CONTROL DE CARGA (VENTA RÁPIDA -1, -2, -5) */}
          {/* ================================================================= */}
          <View style={styles.stockCard}>
            <View style={styles.stockTop}>
              <View>
                <Text style={styles.stockLabel}>GARRAFAS EN CAMIÓN</Text>
                <Text style={styles.stockBigNumber}>{stockRemaining}</Text>
                <Text style={styles.stockSub}>Disponibles para entrega (Bs 22.50)</Text>
              </View>
              <View style={styles.stockStatsRight}>
                <View style={styles.smallStat}>
                  <Text style={styles.smallStatNum}>{totalDelivered}</Text>
                  <Text style={styles.smallStatLabel}>Entregadas</Text>
                </View>
                <View style={styles.smallStat}>
                  <Text style={styles.smallStatNum}>{emptyCylinders}</Text>
                  <Text style={styles.smallStatLabel}>Vacíos rec.</Text>
                </View>
              </View>
            </View>

            <Text style={styles.quickSaleTitle}>VENTA RÁPIDA DE GARRAFAS:</Text>
            <View style={styles.quickSaleRow}>
              <Pressable
                style={styles.quickSaleBtn}
                onPress={() => deductStock(1)}
              >
                <Text style={styles.quickSaleText}>-1 Garrafa</Text>
                <Text style={styles.quickSaleSub}>Bs 22.50</Text>
              </Pressable>

              <Pressable
                style={styles.quickSaleBtn}
                onPress={() => deductStock(2)}
              >
                <Text style={styles.quickSaleText}>-2 Garrafas</Text>
                <Text style={styles.quickSaleSub}>Bs 45.00</Text>
              </Pressable>

              <Pressable
                style={styles.quickSaleBtn}
                onPress={() => deductStock(5)}
              >
                <Text style={styles.quickSaleText}>-5 Garrafas</Text>
                <Text style={styles.quickSaleSub}>Bs 112.50</Text>
              </Pressable>
            </View>

            {/* BOTÓN PROMINENTE: FINALIZAR RECORRIDO DE HOY */}
            <Pressable
              style={styles.finishRouteMainBtn}
              onPress={handleFinishRoute}
            >
              <SvgIcon name="checkCircle" size={18} color="#FFFFFF" />
              <Text style={styles.finishRouteMainBtnText}>
                Finalizar Recorrido de Hoy
              </Text>
            </Pressable>
          </View>

          {/* ================================================================= */}
          {/* PARADA ACTUAL Y HOJA DE RUTA CON HORARIOS ESTIMADOS */}
          {/* ================================================================= */}
          <View style={styles.currentStopCard}>
            <View style={styles.currentStopHeader}>
              <View>
                <Text style={styles.currentStopTag}>PARADA ACTUAL EN CURSO</Text>
                <Text style={styles.currentStopTitle}>
                  {currentStop?.nombre_parada || 'Cruce Av. Petrolera / Obrajes'}
                </Text>
                <Text style={styles.currentStopTime}>
                  Hora estimada: {currentStop?.hora_estimada || '09:15 AM'}
                </Text>
              </View>
              <Badge label="En curso" variant="info" size="sm" dot={true} />
            </View>

            <View style={styles.stopActionsRow}>
              <Pressable style={styles.nextStopBtn} onPress={handleNextStop}>
                <SvgIcon name="checkCircle" size={16} color="#FFFFFF" />
                <Text style={styles.nextStopBtnText}>Llegué a la Parada (Avanzar)</Text>
              </Pressable>

              <Pressable
                style={styles.incidentBtn}
                onPress={() => setIncidentModalVisible(true)}
              >
                <SvgIcon name="alertTriangle" size={16} color={Colors.danger} />
                <Text style={styles.incidentBtnText}>Reportar Falla / Bloqueo</Text>
              </Pressable>
            </View>
          </View>
        </>
      )}

      {/* Lista Desplegable de Todas las Paradas */}
      <View style={styles.allStopsSection}>
        <Pressable
          style={styles.allStopsHeader}
          onPress={() => setShowFullStops((prev) => !prev)}
        >
          <Text style={styles.allStopsTitle}>
            Puntos de Parada Planificados ({assignedRoute?.stops.length || 4})
          </Text>
          <SvgIcon
            name={showFullStops ? 'chevronDown' : 'chevronRight'}
            size={18}
            color={Colors.textSecondary}
          />
        </Pressable>

        {showFullStops && (
          <View style={styles.stopsTimeline}>
            {assignedRoute?.stops.map((stop, idx) => (
              <View key={stop.id} style={styles.stopTimelineItem}>
                <View style={styles.timelineLeft}>
                  <View
                    style={[
                      styles.timelineCircle,
                      stop.estado === 'Completada'
                        ? styles.circleDone
                        : stop.estado === 'En curso'
                        ? styles.circleActive
                        : styles.circlePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.timelineOrder,
                        (stop.estado === 'Completada' || stop.estado === 'En curso') &&
                          styles.timelineOrderWhite,
                      ]}
                    >
                      {stop.orden}
                    </Text>
                  </View>
                  {idx < (assignedRoute?.stops.length || 0) - 1 && (
                    <View style={styles.timelineLine} />
                  )}
                </View>

                <View style={styles.timelineRight}>
                  <View style={styles.timelineTitleRow}>
                    <Text style={styles.timelineStopName}>
                      {stop.nombre_parada}
                    </Text>
                    <Badge
                      label={stop.estado}
                      variant={
                        stop.estado === 'Completada'
                          ? 'neutral'
                          : stop.estado === 'En curso'
                          ? 'success'
                          : 'default'
                      }
                      size="sm"
                    />
                  </View>
                  <Text style={styles.timelineEta}>
                    Horario estimado: {stop.hora_estimada} · {stop.tipo_afluencia}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Modal de Reporte de Incidencias */}
      <IncidentReportModal
        visible={incidentModalVisible}
        onClose={() => setIncidentModalVisible(false)}
        truckPlate={assignedRoute?.vehiculo_placa || 'ABC-1234'}
        driverName={assignedRoute?.conductor_nombre || 'Raul Chofer'}
        onSubmitIncident={addIncident}
      />

      {/* Modal de Perfil y Cerrar Sesión del Conductor */}
      <UserProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Spacing.xxl,
  },
  driverTopBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    marginBottom: Spacing.md,
  },
  driverProfileBrief: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  driverAvatarBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  driverAvatarText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 14,
  },
  driverNameLabel: {
    fontSize: 13,
    fontWeight: '800',
    color: '#0F172A',
  },
  driverCodeLabel: {
    fontSize: 11,
    color: '#64748B',
    marginTop: 1,
  },
  driverProfileActionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: Radius.full,
    borderWidth: 1,
    borderColor: '#C7D2FE',
  },
  driverProfileActionText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.primary,
  },
  pedidosYaBanner: {
    backgroundColor: '#0F172A',
    borderRadius: Radius.xl,
    padding: Spacing.md + 4,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: '#334155',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 4,
  },
  pedidosYaTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs + 2,
  },
  bellPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: Colors.primary,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: Radius.full,
  },
  bellPillText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  pedidosYaTitle: {
    fontSize: 17,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 4,
  },
  pedidosYaSubtitle: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  originDestCard: {
    backgroundColor: '#1E293B',
    borderRadius: Radius.lg,
    padding: Spacing.sm + 4,
    marginTop: Spacing.sm + 2,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pointDivider: {
    height: 1,
    backgroundColor: '#334155',
    marginVertical: 6,
    marginLeft: 14,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  pointLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  pointValue: {
    fontSize: 12,
    fontWeight: '600',
    color: '#F8FAFC',
    flex: 1,
  },
  statusChangeLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: '#CBD5E1',
    marginTop: Spacing.md,
    marginBottom: 6,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 6,
  },
  statusBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: '#334155',
    alignItems: 'center',
  },
  statusBtnActive: {
    backgroundColor: Colors.accentBlue,
  },
  statusBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#94A3B8',
  },
  statusBtnTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  stockCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  stockTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  stockLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  stockBigNumber: {
    fontSize: 32,
    fontWeight: '900',
    color: Colors.primary,
  },
  stockSub: {
    fontSize: 11,
    color: Colors.textSecondary,
  },
  stockStatsRight: {
    flexDirection: 'row',
    gap: 12,
  },
  smallStat: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  smallStatNum: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  smallStatLabel: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quickSaleTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  quickSaleRow: {
    flexDirection: 'row',
    gap: 8,
  },
  quickSaleBtn: {
    flex: 1,
    backgroundColor: '#EFF6FF',
    borderWidth: 1,
    borderColor: '#BFDBFE',
    paddingVertical: 10,
    borderRadius: Radius.lg,
    alignItems: 'center',
  },
  quickSaleText: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  quickSaleSub: {
    fontSize: 10,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  currentStopCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  currentStopHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.md,
  },
  currentStopTag: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentBlue,
    letterSpacing: 0.5,
  },
  currentStopTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  currentStopTime: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  stopActionsRow: {
    flexDirection: 'column',
    gap: 8,
  },
  nextStopBtn: {
    backgroundColor: Colors.success,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    borderRadius: Radius.lg,
    gap: 8,
  },
  nextStopBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  incidentBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 10,
    borderRadius: Radius.lg,
    gap: 8,
  },
  incidentBtnText: {
    color: Colors.danger,
    fontSize: 12,
    fontWeight: '700',
  },
  allStopsSection: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  allStopsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  allStopsTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stopsTimeline: {
    marginTop: Spacing.md,
  },
  stopTimelineItem: {
    flexDirection: 'row',
  },
  timelineLeft: {
    alignItems: 'center',
    width: 28,
  },
  timelineCircle: {
    width: 22,
    height: 22,
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  circleDone: {
    backgroundColor: '#94A3B8',
  },
  circleActive: {
    backgroundColor: Colors.accentBlue,
  },
  circlePending: {
    backgroundColor: '#E2E8F0',
  },
  timelineOrder: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  timelineOrderWhite: {
    color: '#FFFFFF',
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 4,
  },
  timelineRight: {
    flex: 1,
    paddingLeft: 10,
    paddingBottom: Spacing.md,
  },
  timelineTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  timelineStopName: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
    flex: 1,
  },
  timelineEta: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  completedBanner: {
    backgroundColor: '#F0FDF4',
    borderRadius: Radius.xl,
    padding: Spacing.md + 4,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#86EFAC',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  completedTitle: {
    fontSize: 18,
    fontWeight: '900',
    color: '#065F46',
    marginTop: 6,
  },
  completedSubtitle: {
    fontSize: 13,
    color: '#047857',
    marginTop: 4,
    lineHeight: 18,
  },
  completedSummaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    marginTop: Spacing.md,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  completedSummaryTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#065F46',
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  summaryItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  summaryItemLabel: {
    fontSize: 12,
    color: '#374151',
  },
  summaryItemValue: {
    fontSize: 12,
    fontWeight: '700',
    color: '#111827',
  },
  finishRouteMainBtn: {
    backgroundColor: '#DC2626',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 13,
    borderRadius: Radius.lg,
    marginTop: Spacing.md,
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  finishRouteMainBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 0.3,
  },
});
