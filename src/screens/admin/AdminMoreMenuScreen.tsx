import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';
import { SYSTEM_USERS } from '../../api/mockData';

export const AdminMoreMenuScreen: React.FC = () => {
  const {
    currentUser,
    setActiveTab,
    complaints,
    incidents,
    vehicles,
    drivers,
    zoneDemandCards,
    logout,
  } = useApp();

  const [activeSection, setActiveSection] = useState<
    'menu' | 'users' | 'driversFleet' | 'demand' | 'reports' | 'profile'
  >('menu');

  const [demandTimeframe, setDemandTimeframe] = useState<'Hoy' | 'Semana' | 'Mes'>('Hoy');
  const [fleetSubTab, setFleetSubTab] = useState<'CONDUCTORES' | 'VEHÍCULOS'>('CONDUCTORES');
  const [userSearch, setUserSearch] = useState<string>('');

  const pendingComplaints = complaints.filter((c) => c.estado === 'Pendiente').length;
  const activeIncidents = incidents.filter((i) => i.estado === 'Activo').length;

  // Filtrado de usuarios en vista Gestión de Usuarios
  const filteredUsers = SYSTEM_USERS.filter(
    (u) =>
      u.name.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.role.toLowerCase().includes(userSearch.toLowerCase()) ||
      u.phone.includes(userSearch)
  );

  // =========================================================================
  // SUBVISTA: DEMANDA POR ZONAS (Imagen 7)
  // =========================================================================
  if (activeSection === 'demand') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeaderRow}>
          <Pressable onPress={() => setActiveSection('menu')} style={styles.backBtn}>
            <SvgIcon name="chevronLeft" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeaderTitle}>Demanda por Zonas</Text>
            <Text style={styles.subHeaderSubtitle}>Análisis y planificación de stock</Text>
          </View>
        </View>

        {/* Selector de Pestañas: Hoy | Semana | Mes */}
        <View style={styles.segmentedBar}>
          {(['Hoy', 'Semana', 'Mes'] as const).map((t) => (
            <Pressable
              key={t}
              style={[
                styles.segmentedBtn,
                demandTimeframe === t && styles.segmentedBtnActive,
              ]}
              onPress={() => setDemandTimeframe(t)}
            >
              <Text
                style={[
                  styles.segmentedText,
                  demandTimeframe === t && styles.segmentedTextActive,
                ]}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Tarjetas de Demanda por Zonas */}
        {zoneDemandCards.map((card, idx) => {
          const isHigh = card.nivelDemanda === 'Alta Demanda';
          return (
            <View key={idx} style={styles.demandZoneCard}>
              <View style={styles.demandCardTop}>
                <Text style={styles.demandZoneName}>{card.zona}</Text>
                <Badge
                  label={card.nivelDemanda}
                  variant={isHigh ? 'danger' : 'warning'}
                  size="sm"
                />
              </View>

              <View style={styles.demandMetricsRow}>
                <Text style={styles.demandMetricText}>
                  <Text style={styles.demandMetricLabel}>Solicitudes: </Text>
                  <Text style={styles.demandMetricValue}>{card.solicitudes}</Text>
                </Text>

                <Text style={styles.demandMetricText}>
                  <Text style={styles.demandMetricLabel}>Garrafas: </Text>
                  <Text style={styles.demandMetricValue}>{card.garrafas}</Text>
                </Text>

                <Text style={styles.demandMetricText}>
                  <Text style={styles.demandMetricLabel}>Camiones: </Text>
                  <Text style={styles.demandMetricValue}>{card.camiones}</Text>
                </Text>
              </View>
            </View>
          );
        })}
      </ScrollView>
    );
  }

  // =========================================================================
  // SUBVISTA: GESTIÓN DE USUARIOS (Imagen 8)
  // =========================================================================
  if (activeSection === 'users') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeaderRow}>
          <Pressable onPress={() => setActiveSection('menu')} style={styles.backBtn}>
            <SvgIcon name="chevronLeft" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeaderTitle}>Gestión de Usuarios</Text>
            <Text style={styles.subHeaderSubtitle}>Control de acceso de personal</Text>
          </View>
          <Pressable
            style={styles.newActionBtn}
            onPress={() => Alert.alert('Nuevo Usuario', 'Formulario para invitar o crear usuario.')}
          >
            <Text style={styles.newActionBtnText}>+ Nuevo</Text>
          </Pressable>
        </View>

        {/* Buscador de Usuarios */}
        <View style={styles.searchBox}>
          <TextInput
            style={styles.searchInput}
            placeholder="Buscar usuario..."
            placeholderTextColor={Colors.textMuted}
            value={userSearch}
            onChangeText={setUserSearch}
          />
        </View>

        {/* Lista de Usuarios */}
        {filteredUsers.map((u) => (
          <View key={u.id} style={styles.userListItem}>
            <View style={styles.userItemTop}>
              <View>
                <Text style={styles.userItemName}>{u.name}</Text>
                <Text style={styles.userItemPhone}>{u.phone}</Text>
              </View>
              <View style={styles.userItemBadgeBox}>
                <Badge
                  label={u.role}
                  variant={
                    u.role === 'Administrador'
                      ? 'info'
                      : u.role === 'Conductor'
                      ? 'success'
                      : 'warning'
                  }
                  size="sm"
                />
                <Text style={styles.userStatusDot}>
                  • {u.status}
                </Text>
              </View>
            </View>

            <View style={styles.userActionsRow}>
              <Pressable
                style={styles.userActionBtn}
                onPress={() => Alert.alert('Ver Usuario', `${u.name}\n${u.email}\nRol: ${u.role}`)}
              >
                <Text style={styles.actionBtnTextBlue}>Ver</Text>
              </Pressable>
              <Pressable
                style={styles.userActionBtn}
                onPress={() => Alert.alert('Editar', `Modificar permisos de ${u.name}`)}
              >
                <Text style={styles.actionBtnTextBlue}>Editar</Text>
              </Pressable>
              <Pressable
                style={styles.userActionBtn}
                onPress={() => Alert.alert('Eliminar', `¿Deseas revocar acceso a ${u.name}?`)}
              >
                <Text style={styles.actionBtnTextRed}>Eliminar</Text>
              </Pressable>
            </View>
          </View>
        ))}
      </ScrollView>
    );
  }

  // =========================================================================
  // SUBVISTA: CONDUCTORES Y FLOTA (Imagen 9)
  // =========================================================================
  if (activeSection === 'driversFleet') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeaderRow}>
          <Pressable onPress={() => setActiveSection('menu')} style={styles.backBtn}>
            <SvgIcon name="chevronLeft" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeaderTitle}>Conductores y Flota</Text>
            <Text style={styles.subHeaderSubtitle}>Control de personal en ruta</Text>
          </View>
        </View>

        {/* Pestañas: CONDUCTORES | VEHÍCULOS */}
        <View style={styles.fleetTabsBar}>
          <Pressable
            style={[
              styles.fleetTabBtn,
              fleetSubTab === 'CONDUCTORES' && styles.fleetTabBtnActive,
            ]}
            onPress={() => setFleetSubTab('CONDUCTORES')}
          >
            <Text
              style={[
                styles.fleetTabBtnText,
                fleetSubTab === 'CONDUCTORES' && styles.fleetTabBtnTextActive,
              ]}
            >
              CONDUCTORES
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.fleetTabBtn,
              fleetSubTab === 'VEHÍCULOS' && styles.fleetTabBtnActive,
            ]}
            onPress={() => setFleetSubTab('VEHÍCULOS')}
          >
            <Text
              style={[
                styles.fleetTabBtnText,
                fleetSubTab === 'VEHÍCULOS' && styles.fleetTabBtnTextActive,
              ]}
            >
              VEHÍCULOS
            </Text>
          </Pressable>
        </View>

        {fleetSubTab === 'CONDUCTORES' ? (
          <View>
            {drivers.map((drv) => (
              <View key={drv.id} style={styles.driverCard}>
                <View style={styles.driverCardTop}>
                  <Text style={styles.driverName}>{drv.nombre}</Text>
                  <Badge
                    label={drv.estado === 'Activo' ? 'Disponible' : drv.estado}
                    variant={drv.estado === 'Activo' ? 'success' : 'neutral'}
                    size="sm"
                  />
                </View>

                <Text style={styles.driverCi}>CI: {drv.ci}</Text>
                <Text style={styles.driverField}>
                  Licencia: {drv.categoria_licencia}
                </Text>
                <Text style={styles.driverField}>
                  Vehículo: <Text style={styles.boldText}>{drv.vehiculo_asignado || 'Sin asignar'}</Text>
                </Text>

                <View style={styles.driverButtonsRow}>
                  <Pressable
                    style={styles.driverActionBtn}
                    onPress={() => Alert.alert('Detalle Conductor', `${drv.nombre}\nCI: ${drv.ci}\nTel: ${drv.telefono}`)}
                  >
                    <Text style={styles.actionBtnTextBlue}>Ver</Text>
                  </Pressable>
                  <Pressable
                    style={styles.driverActionBtn}
                    onPress={() => Alert.alert('Editar Conductor', `Editar información de ${drv.nombre}`)}
                  >
                    <Text style={styles.actionBtnTextBlue}>Editar</Text>
                  </Pressable>
                </View>
              </View>
            ))}

            <Pressable
              style={styles.registerDriverBottomBtn}
              onPress={() => setActiveTab('adminFleet')}
            >
              <Text style={styles.registerDriverBottomBtnText}>
                + Registrar conductor
              </Text>
            </Pressable>
          </View>
        ) : (
          <View>
            {vehicles.map((v) => (
              <View key={v.id} style={styles.driverCard}>
                <View style={styles.driverCardTop}>
                  <Text style={styles.driverName}>{v.placa}</Text>
                  <Badge
                    label={v.estado}
                    variant={v.estado === 'En ruta' ? 'success' : 'neutral'}
                    size="sm"
                  />
                </View>
                <Text style={styles.driverCi}>{v.modelo} · {v.anio}</Text>
                <Text style={styles.driverField}>Capacidad: {v.capacidad_garrafas} garrafas</Text>
                <Text style={styles.driverField}>Chofer: {v.chofer_asignado || 'Sin asignar'}</Text>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    );
  }

  // =========================================================================
  // SUBVISTA: MI PERFIL DE ADMINISTRADOR
  // =========================================================================
  if (activeSection === 'profile') {
    return (
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={styles.subHeaderRow}>
          <Pressable onPress={() => setActiveSection('menu')} style={styles.backBtn}>
            <SvgIcon name="chevronLeft" size={20} color={Colors.textPrimary} />
          </Pressable>
          <View style={{ flex: 1 }}>
            <Text style={styles.subHeaderTitle}>Mi Perfil</Text>
            <Text style={styles.subHeaderSubtitle}>Credenciales de administración</Text>
          </View>
        </View>

        <View style={styles.profileDetailCard}>
          <View style={styles.profileAvatarLarge}>
            <Text style={styles.profileInitialsLarge}>TF</Text>
          </View>

          <Text style={styles.profileNameLarge}>{currentUser.full_name}</Text>
          <Text style={styles.profileEmailLarge}>{currentUser.email}</Text>
          <Badge label={currentUser.code || 'GY-ADMIN-048'} variant="info" size="md" />

          <View style={styles.profileInfoList}>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Cédula de Identidad:</Text>
              <Text style={styles.profileVal}>{currentUser.ci}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Teléfono Celular:</Text>
              <Text style={styles.profileVal}>{currentUser.phone}</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Rol Asignado:</Text>
              <Text style={styles.profileVal}>Administrador General</Text>
            </View>
            <View style={styles.profileRow}>
              <Text style={styles.profileLabel}>Base Operativa:</Text>
              <Text style={styles.profileVal}>Central La Paz (Planta Senkata)</Text>
            </View>
          </View>

          <Pressable style={styles.logoutButtonLarge} onPress={logout}>
            <Text style={styles.logoutButtonLargeText}>Cerrar Sesión</Text>
          </Pressable>
        </View>
      </ScrollView>
    );
  }

  // =========================================================================
  // PANTALLA PRINCIPAL: MÁS OPCIONES (Imagen 5 y 6)
  // =========================================================================
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      <Text style={styles.mainTitle}>Más opciones</Text>
      <Text style={styles.subtitle}>GarrafaYa Administración</Text>

      <View style={styles.menuOptionsList}>
        {/* 1. Usuarios */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveSection('users')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <SvgIcon name="user" size={18} color={Colors.accentBlue} />
            </View>
            <Text style={styles.optionTitle}>Usuarios</Text>
          </View>
          <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
        </Pressable>

        {/* 2. Conductores y Vehículos */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveSection('driversFleet')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#ECFDF5' }]}>
              <SvgIcon name="truck" size={18} color={Colors.success} />
            </View>
            <Text style={styles.optionTitle}>Conductores y Vehículos</Text>
          </View>
          <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
        </Pressable>

        {/* 3. Demanda por Zonas */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveSection('demand')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#F5F3FF' }]}>
              <SvgIcon name="location" size={18} color="#7C3AED" />
            </View>
            <Text style={styles.optionTitle}>Demanda por Zonas</Text>
          </View>
          <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
        </Pressable>

        {/* 4. Reclamos (con badge de 3) */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveTab('adminClaims')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#FEF2F2' }]}>
              <SvgIcon name="fileText" size={18} color={Colors.danger} />
            </View>
            <Text style={styles.optionTitle}>Reclamos</Text>
          </View>
          <View style={styles.badgeArrowRow}>
            <View style={styles.redNumberBadge}>
              <Text style={styles.redNumberText}>{pendingComplaints || 3}</Text>
            </View>
            <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
          </View>
        </Pressable>

        {/* 5. Reportes */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveSection('reports')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#EFF6FF' }]}>
              <SvgIcon name="barChart" size={18} color={Colors.accentBlue} />
            </View>
            <Text style={styles.optionTitle}>Reportes</Text>
          </View>
          <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
        </Pressable>

        {/* 6. Incidencias (con badge de 2) */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveTab('driverIncidents')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#FEF2F2' }]}>
              <SvgIcon name="alertTriangle" size={18} color={Colors.danger} />
            </View>
            <Text style={styles.optionTitle}>Incidencias</Text>
          </View>
          <View style={styles.badgeArrowRow}>
            <View style={styles.redNumberBadge}>
              <Text style={styles.redNumberText}>{activeIncidents || 2}</Text>
            </View>
            <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
          </View>
        </Pressable>

        {/* 7. Mi Perfil */}
        <Pressable
          style={styles.menuOptionItem}
          onPress={() => setActiveSection('profile')}
        >
          <View style={styles.optionLeft}>
            <View style={[styles.optionIconBox, { backgroundColor: '#F1F5F9' }]}>
              <SvgIcon name="user" size={18} color={Colors.textSecondary} />
            </View>
            <View>
              <Text style={styles.optionTitle}>Mi Perfil</Text>
              <Text style={styles.optionSub}>
                {currentUser.full_name} · Administrador General
              </Text>
            </View>
          </View>
          <SvgIcon name="chevronRight" size={16} color={Colors.textMuted} />
        </Pressable>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Spacing.xxl,
  },
  mainTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.lg,
  },
  menuOptionsList: {
    gap: 10,
  },
  menuOptionItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    paddingVertical: 14,
    paddingHorizontal: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.03,
    shadowRadius: 2,
    elevation: 1,
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  optionIconBox: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  optionSub: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  badgeArrowRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  redNumberBadge: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#DC2626',
    alignItems: 'center',
    justifyContent: 'center',
  },
  redNumberText: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: '800',
  },
  subHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: Spacing.md,
  },
  backBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  subHeaderTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subHeaderSubtitle: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  segmentedBar: {
    flexDirection: 'row',
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  segmentedBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  segmentedBtnActive: {
    backgroundColor: '#1E293B',
  },
  segmentedText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  segmentedTextActive: {
    color: '#FFFFFF',
  },
  demandZoneCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm + 2,
  },
  demandCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  demandZoneName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  demandMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 4,
  },
  demandMetricText: {
    fontSize: 12,
  },
  demandMetricLabel: {
    color: Colors.textMuted,
  },
  demandMetricValue: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  newActionBtn: {
    backgroundColor: '#0F172A',
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: Radius.full,
  },
  newActionBtnText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '800',
  },
  searchBox: {
    marginBottom: Spacing.md,
  },
  searchInput: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 13,
    color: Colors.textPrimary,
  },
  userListItem: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  userItemTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.sm,
  },
  userItemName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  userItemPhone: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  userItemBadgeBox: {
    alignItems: 'flex-end',
  },
  userStatusDot: {
    fontSize: 10,
    color: Colors.success,
    fontWeight: '700',
    marginTop: 2,
  },
  userActionsRow: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    gap: 8,
  },
  userActionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.md,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
  },
  actionBtnTextBlue: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.accentBlue,
  },
  actionBtnTextRed: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.danger,
  },
  fleetTabsBar: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  fleetTabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  fleetTabBtnActive: {
    backgroundColor: '#0F172A',
  },
  fleetTabBtnText: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textSecondary,
  },
  fleetTabBtnTextActive: {
    color: '#FFFFFF',
  },
  driverCard: {
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.xl,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm,
  },
  driverCardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  driverName: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  driverCi: {
    fontSize: 11,
    color: Colors.textMuted,
    marginBottom: 6,
  },
  driverField: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: 2,
  },
  boldText: {
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  driverButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
  },
  driverActionBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  registerDriverBottomBtn: {
    backgroundColor: '#0F172A',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  registerDriverBottomBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  profileDetailCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xxl,
    padding: Spacing.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  profileAvatarLarge: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Spacing.sm,
  },
  profileInitialsLarge: {
    fontSize: 24,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  profileNameLarge: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  profileEmailLarge: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs + 2,
  },
  profileInfoList: {
    width: '100%',
    marginTop: Spacing.lg,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: Spacing.md,
    gap: 8,
  },
  profileRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  profileLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  profileVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  logoutButtonLarge: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FECACA',
    borderRadius: Radius.lg,
    paddingVertical: 12,
    width: '100%',
    alignItems: 'center',
    marginTop: Spacing.xl,
  },
  logoutButtonLargeText: {
    color: Colors.danger,
    fontSize: 13,
    fontWeight: '800',
  },
});
