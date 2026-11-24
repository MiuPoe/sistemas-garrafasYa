import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  Modal,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { RouteMapViewer } from '../../components/organisms/RouteMapViewer';
import { StopTimelineItem } from '../../components/molecules/StopTimelineItem';
import { TruckSightingBanner } from '../../components/molecules/TruckSightingBanner';
import { ReservationModal } from '../../components/organisms/ReservationModal';
import { SightingModal } from '../../components/organisms/SightingModal';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';
import { UserProfileModal } from '../../components/organisms/UserProfileModal';

export const ClientHomeScreen: React.FC = () => {
  const {
    routes,
    stockRemaining,
    sightings,
    addReservation,
    addSighting,
    userZone,
    setUserZone,
    currentUser,
    logout,
  } = useApp();

  const currentRoute = routes[0];
  const [reservationModalVisible, setReservationModalVisible] = useState(false);
  const [sightingModalVisible, setSightingModalVisible] = useState(false);
  const [zoneModalVisible, setZoneModalVisible] = useState(false);
  const [profileModalVisible, setProfileModalVisible] = useState(false);

  const availableZones = [
    'Zona Sur - Los Pinos',
    'Zona Sur - Obrajes / Calacoto',
    'Zona Norte - Miraflores',
    'Zona Norte - Villa Fátima',
    'El Alto - Senkata / 6 de Marzo',
    'Centro - San Pedro / Sopocachi',
  ];

  const handleSelectZone = (newZone: string) => {
    setUserZone(newZone);
    setZoneModalVisible(false);
    Alert.alert('Zona Actualizada', `Ubicación configurada en: ${newZone}`);
  };

  return (
    <View style={styles.container}>
      {/* Barra Superior con Mi Perfil y Selector de Zona */}
      <View style={styles.topClientHeader}>
        <View style={styles.zoneConfigBar}>
          <View style={styles.zoneLeft}>
            <SvgIcon name="location" size={16} color={Colors.accentBlue} />
            <View>
              <Text style={styles.zoneConfigLabel}>Mi zona de entrega (La Paz):</Text>
              <Text style={styles.zoneConfigValue}>{userZone}</Text>
            </View>
          </View>
          <Pressable
            style={styles.changeZoneBtn}
            onPress={() => setZoneModalVisible(true)}
          >
            <Text style={styles.changeZoneBtnText}>Cambiar</Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.clientProfileBtn}
          onPress={() => setProfileModalVisible(true)}
        >
          <SvgIcon name="user" size={16} color={Colors.accentBlue} />
          <Text style={styles.clientProfileBtnText}>Mi Perfil</Text>
        </Pressable>
      </View>

      {/* Alerta de Camión Próximo (Checklist #3) */}
      <View style={styles.proximityAlertBanner}>
        <View style={styles.alertIconBox}>
          <SvgIcon name="bell" size={16} color="#FFFFFF" />
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.alertTitle}>¡Camión de Gas Próximo a tu Zona!</Text>
          <Text style={styles.alertSub}>
            Camión ABC-1234 a aprox. 3 cuadras con 84 garrafas disponibles.
          </Text>
        </View>
      </View>

      {/* Mapa con Calles Reales de La Paz (Leaflet / OpenStreetMap) */}
      <RouteMapViewer stockCount={stockRemaining} />

      {/* Banner de Reporte Colaborativo "¡Vi el Camión!" */}
      <TruckSightingBanner
        onReportPress={() => setSightingModalVisible(true)}
        recentCount={sightings.length}
        latestComment={
          sightings[0]
            ? `${sightings[0].parada_referencia}: ${sightings[0].comentario}`
            : 'Camión en ruta sin demoras reportadas'
        }
      />

      {/* Tarjeta Resumen de la Ruta Activa */}
      <View style={styles.routeSummaryCard}>
        <View style={styles.routeHeader}>
          <View>
            <Text style={styles.routeCode}>{currentRoute?.codigo_ruta}</Text>
            <Text style={styles.routeName}>{currentRoute?.nombre_ruta}</Text>
          </View>
          <Badge label="En curso" variant="success" dot />
        </View>

        <View style={styles.driverInfoRow}>
          <View style={styles.driverItem}>
            <SvgIcon name="truck" size={14} color={Colors.textMuted} />
            <Text style={styles.driverText}>{currentRoute?.vehiculo_placa}</Text>
          </View>
          <View style={styles.driverItem}>
            <SvgIcon name="user" size={14} color={Colors.textMuted} />
            <Text style={styles.driverText}>{currentRoute?.conductor_nombre}</Text>
          </View>
          <View style={styles.driverItem}>
            <SvgIcon name="cylinder" size={14} color={Colors.mustard} />
            <Text style={styles.stockText}>{stockRemaining} restantes</Text>
          </View>
        </View>
      </View>

      {/* Cronograma de Paradas Programadas con Horarios */}
      <View style={styles.timelineSection}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>CRONOGRAMA DE PARADAS PROGRAMADAS</Text>
          <Text style={styles.sectionSubtitle}>Horarios aproximados de paso en La Paz</Text>
        </View>

        {currentRoute?.stops.map((stop, idx) => (
          <StopTimelineItem
            key={stop.id}
            stop={stop}
            isFirst={idx === 0}
            isLast={idx === (currentRoute.stops.length - 1)}
            actionLabel={stop.estado !== 'Completada' ? 'Reservar garrafa' : undefined}
            onActionPress={() => setReservationModalVisible(true)}
          />
        ))}
      </View>

      {/* Modal de Reserva de Garrafa */}
      {currentRoute && (
        <ReservationModal
          visible={reservationModalVisible}
          onClose={() => setReservationModalVisible(false)}
          stops={currentRoute.stops}
          onSubmitReservation={addReservation}
        />
      )}

      {/* Modal de Reporte Ciudadano Colaborativo */}
      <SightingModal
        visible={sightingModalVisible}
        onClose={() => setSightingModalVisible(false)}
        onSubmitSighting={({ referencePoint, comment }) =>
          addSighting(referencePoint, comment)
        }
      />

      {/* Modal de Configuración de Zona del Usuario (Checklist #7) */}
      <Modal
        visible={zoneModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setZoneModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Configurar mi Zona</Text>
              <Pressable onPress={() => setZoneModalVisible(false)}>
                <SvgIcon name="close" size={20} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <Text style={styles.modalSubtitle}>
              Selecciona tu zona habitual en La Paz o El Alto para recibir notificaciones cuando el camión repartidor esté cerca.
            </Text>

            <View style={styles.zoneList}>
              {availableZones.map((z) => (
                <Pressable
                  key={z}
                  style={[
                    styles.zoneItem,
                    userZone === z && styles.zoneItemActive,
                  ]}
                  onPress={() => handleSelectZone(z)}
                >
                  <Text
                    style={[
                      styles.zoneItemText,
                      userZone === z && styles.zoneItemTextActive,
                    ]}
                  >
                    {z}
                  </Text>
                  {userZone === z && (
                    <SvgIcon name="check" size={16} color={Colors.accentBlue} />
                  )}
                </Pressable>
              ))}
            </View>
          </View>
        </View>
      </Modal>

      {/* Modal de Mi Perfil (Cliente) */}
      <UserProfileModal
        visible={profileModalVisible}
        onClose={() => setProfileModalVisible(false)}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  zoneConfigBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  zoneLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  zoneConfigLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  zoneConfigValue: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  changeZoneBtn: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
  },
  changeZoneBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  proximityAlertBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF3C7',
    borderWidth: 1,
    borderColor: '#FCD34D',
    borderRadius: Radius.lg,
    padding: Spacing.sm + 2,
    marginBottom: Spacing.sm,
    gap: 10,
  },
  alertIconBox: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.mustard,
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertTitle: {
    fontSize: 12,
    fontWeight: '800',
    color: '#92400E',
  },
  alertSub: {
    fontSize: 11,
    color: '#B45309',
    marginTop: 1,
  },
  routeSummaryCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  routeCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentBlue,
    letterSpacing: 0.5,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  driverInfoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.sm,
  },
  driverItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  driverText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stockText: {
    fontSize: 12,
    fontWeight: '800',
    color: Colors.mustardDark,
  },
  timelineSection: {
    marginTop: Spacing.xs,
  },
  sectionHeader: {
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  sectionSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xxl,
    borderTopRightRadius: Radius.xxl,
    padding: Spacing.lg,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  modalSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  zoneList: {
    gap: 8,
    marginBottom: Spacing.lg,
  },
  zoneItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  zoneItemActive: {
    borderColor: Colors.accentBlue,
    backgroundColor: '#EFF6FF',
  },
  zoneItemText: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  zoneItemTextActive: {
    color: Colors.accentBlue,
    fontWeight: '800',
  },
  topClientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  clientProfileBtn: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: Radius.lg,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 2,
  },
  clientProfileBtnText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  clientProfileBox: {
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  clientAvatarBox: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.accentBlue,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  clientAvatarInitials: {
    fontSize: 22,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  clientProfileFullName: {
    fontSize: 17,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  clientProfileEmail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  clientDetailsList: {
    width: '100%',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    padding: Spacing.md,
    marginTop: Spacing.md,
    gap: 8,
  },
  clientDetailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 2,
  },
  clientDetailLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  clientDetailValue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  clientLogoutBtn: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.lg,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.lg,
  },
  clientLogoutBtnText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});
