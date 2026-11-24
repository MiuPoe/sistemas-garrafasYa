import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';

export const AdminRoutesScreen: React.FC = () => {
  const { routes, addRoute, vehicles, drivers } = useApp();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [routeName, setRouteName] = useState<string>('');
  const [zone, setZone] = useState<string>('Zona Sur');
  const [origin, setOrigin] = useState<string>('Planta Central Senkata (Distribuidora de Gas La Paz)');
  const [destination, setDestination] = useState<string>('');
  const [departureTime, setDepartureTime] = useState<string>('08:30 AM');
  const [gasQty, setGasQty] = useState<string>('120');
  const [selectedTruck, setSelectedTruck] = useState<string>(vehicles[0]?.placa || 'ABC-1234');
  const [selectedDriver, setSelectedDriver] = useState<string>(drivers[0]?.nombre || 'Raul Chofer');

  // Paradas intermedias personalizables
  const [routeStopsList, setRouteStopsList] = useState<Array<{ name: string; time: string }>>([
    { name: 'Cruce Av. Petrolera / Obrajes', time: '09:15 AM' },
    { name: 'Condominio Los Pinos / Cancha', time: '10:00 AM' },
  ]);
  const [newStopInput, setNewStopInput] = useState<string>('');
  const [newStopTimeInput, setNewStopTimeInput] = useState<string>('10:45 AM');

  const handleAddStop = () => {
    if (!newStopInput.trim()) {
      Alert.alert('Parada Requerida', 'Ingrese el nombre del punto o parada intermedia.');
      return;
    }
    setRouteStopsList((prev) => [
      ...prev,
      { name: newStopInput.trim(), time: newStopTimeInput.trim() || '10:00 AM' },
    ]);
    setNewStopInput('');
  };

  const handleRemoveStop = (idx: number) => {
    setRouteStopsList((prev) => prev.filter((_, i) => i !== idx));
  };

  const handleCreateRoute = () => {
    if (!routeName.trim() || !destination.trim()) {
      Alert.alert('Datos incompletos', 'Ingrese el nombre de la ruta y el punto de destino.');
      return;
    }

    const generatedStops = [
      {
        id: `stop-${Date.now()}-0`,
        ruta_id: `r-${Date.now()}`,
        nombre_parada: origin,
        orden: 1,
        hora_estimada: departureTime,
        estado: 'Completada' as const,
        tipo_afluencia: 'Industrial' as const,
        lat: -16.5412,
        lng: -68.1825,
      },
      ...routeStopsList.map((s, idx) => ({
        id: `stop-${Date.now()}-${idx + 1}`,
        ruta_id: `r-${Date.now()}`,
        nombre_parada: s.name,
        orden: idx + 2,
        hora_estimada: s.time,
        estado: (idx === 0 ? 'En curso' : 'Pendiente') as 'En curso' | 'Pendiente',
        tipo_afluencia: 'Alta afluencia' as const,
        lat: -16.5298 + idx * -0.005,
        lng: -68.1215 + idx * 0.02,
        es_actual: idx === 0,
      })),
      {
        id: `stop-${Date.now()}-last`,
        ruta_id: `r-${Date.now()}`,
        nombre_parada: destination.trim(),
        orden: routeStopsList.length + 2,
        hora_estimada: '11:45 AM',
        estado: 'Pendiente' as const,
        tipo_afluencia: 'Residencial' as const,
        lat: -16.521,
        lng: -68.075,
      },
    ];

    addRoute({
      nombre_ruta: routeName.trim(),
      zona: zone,
      punto_origen: origin,
      punto_destino: destination.trim(),
      hora_salida_programada: departureTime,
      cantidad_garrafas_asignadas: parseInt(gasQty, 10) || 120,
      vehiculo_placa: selectedTruck,
      conductor_nombre: selectedDriver,
      stops: generatedStops,
    });

    setRouteName('');
    setDestination('');
    setModalVisible(false);
    Alert.alert(
      'Ruta Creada con Éxito',
      `Ruta asignada a ${selectedDriver} con ${generatedStops.length} paradas planificadas.`
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado con Botón + Nueva Ruta */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.mainTitle}>Rutas de Distribución</Text>
          <Text style={styles.subtitle}>Planificación y asignación a choferes</Text>
        </View>
        <Pressable
          style={styles.newRouteBtn}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.newRouteBtnText}>+ Nueva Ruta</Text>
        </Pressable>
      </View>

      {/* Lista de Rutas */}
      {routes.map((route) => (
        <View key={route.id} style={styles.routeCard}>
          <View style={styles.headerTop}>
            <View style={{ flex: 1 }}>
              <View style={styles.codeRow}>
                <Text style={styles.routeCode}>{route.codigo_ruta}</Text>
                <Text style={styles.zoneTag}>· {route.zona}</Text>
              </View>
              <Text style={styles.routeName}>{route.nombre_ruta}</Text>
            </View>
            <Badge
              label={route.estado}
              variant={route.estado === 'En curso' ? 'success' : 'neutral'}
              size="sm"
              dot={route.estado === 'En curso'}
            />
          </View>

          <View style={styles.routePointsBox}>
            <View style={styles.pointRow}>
              <View style={[styles.dot, { backgroundColor: Colors.primary }]} />
              <Text style={styles.pointLabel}>Origen: </Text>
              <Text style={styles.pointValue} numberOfLines={1}>
                {route.punto_origen}
              </Text>
            </View>
            <View style={styles.pointRow}>
              <View style={[styles.dot, { backgroundColor: Colors.accentBlue }]} />
              <Text style={styles.pointLabel}>Destino: </Text>
              <Text style={styles.pointValue} numberOfLines={1}>
                {route.punto_destino || 'Calle 15 de Irpavi'}
              </Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoItem}>
              <SvgIcon name="truck" size={14} color={Colors.accentBlue} />
              <Text style={styles.infoText}>{route.vehiculo_placa}</Text>
            </View>
            <View style={styles.infoItem}>
              <SvgIcon name="user" size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{route.conductor_nombre}</Text>
            </View>
            <View style={styles.infoItem}>
              <SvgIcon name="clock" size={14} color={Colors.textMuted} />
              <Text style={styles.infoText}>{route.hora_salida_programada}</Text>
            </View>
          </View>

          <View style={styles.stopsPreview}>
            <Text style={styles.stopsCount}>
              {route.stops.length} paradas con horario estimado:
            </Text>
            {route.stops.map((s) => (
              <View key={s.id} style={styles.stopPill}>
                <Text style={styles.stopPillOrder}>{s.orden}.</Text>
                <Text style={styles.stopPillName} numberOfLines={1}>
                  {s.nombre_parada}
                </Text>
                <Text style={styles.stopPillTime}>{s.hora_estimada}</Text>
                {s.estado === 'En curso' && (
                  <Badge label="Aquí" variant="info" size="sm" />
                )}
              </View>
            ))}
          </View>
        </View>
      ))}

      {/* Modal para Crear y Asignar Ruta */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Crear y Asignar Nueva Ruta</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <SvgIcon name="close" size={20} color={Colors.textSecondary} />
              </Pressable>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.inputLabel}>Nombre de la Ruta</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Ruta 3: San Pedro - Sopocachi"
                placeholderTextColor={Colors.textMuted}
                value={routeName}
                onChangeText={setRouteName}
              />

              <View style={styles.inputRow}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Zona de La Paz</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="Zona Sur / El Alto"
                    placeholderTextColor={Colors.textMuted}
                    value={zone}
                    onChangeText={setZone}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.inputLabel}>Hora de Salida</Text>
                  <TextInput
                    style={styles.textInput}
                    placeholder="08:30 AM"
                    placeholderTextColor={Colors.textMuted}
                    value={departureTime}
                    onChangeText={setDepartureTime}
                  />
                </View>
              </View>

              <Text style={styles.inputLabel}>Punto de Partida (Origen)</Text>
              <TextInput
                style={styles.textInput}
                value={origin}
                onChangeText={setOrigin}
              />

              <Text style={styles.inputLabel}>Punto de Destino Final</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. Plaza Abaroa / Calle 21 Calacoto"
                placeholderTextColor={Colors.textMuted}
                value={destination}
                onChangeText={setDestination}
              />

              <Text style={styles.inputLabel}>Camión Asignado</Text>
              <View style={styles.chipsRow}>
                {vehicles.map((v) => (
                  <Pressable
                    key={v.id}
                    style={[
                      styles.chip,
                      selectedTruck === v.placa && styles.chipActive,
                    ]}
                    onPress={() => setSelectedTruck(v.placa)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedTruck === v.placa && styles.chipTextActive,
                      ]}
                    >
                      {v.placa} ({v.modelo})
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.inputLabel, { marginTop: Spacing.sm }]}>
                Conductor Asignado
              </Text>
              <View style={styles.chipsRow}>
                {drivers.map((d) => (
                  <Pressable
                    key={d.id}
                    style={[
                      styles.chip,
                      selectedDriver === d.nombre && styles.chipActive,
                    ]}
                    onPress={() => setSelectedDriver(d.nombre)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        selectedDriver === d.nombre && styles.chipTextActive,
                      ]}
                    >
                      {d.nombre}
                    </Text>
                  </Pressable>
                ))}
              </View>

              <Text style={[styles.inputLabel, { marginTop: Spacing.sm }]}>
                Garrafas Asignadas
              </Text>
              <TextInput
                style={styles.textInput}
                placeholder="120"
                keyboardType="numeric"
                placeholderTextColor={Colors.textMuted}
                value={gasQty}
                onChangeText={setGasQty}
              />

              {/* SECCIÓN DE PARADAS INTERMEDIAS DE LA RUTA */}
              <View style={styles.stopsConfigBox}>
                <Text style={styles.stopsConfigTitle}>
                  Paradas y Puntos de Distribución ({routeStopsList.length})
                </Text>
                <Text style={styles.stopsConfigSubtitle}>
                  Agrega las paradas intermedias por donde pasará el camión y sus horarios estimados:
                </Text>

                {routeStopsList.map((stop, idx) => (
                  <View key={idx} style={styles.stopConfigItem}>
                    <View style={{ flex: 1 }}>
                      <Text style={styles.stopConfigName}>
                        {idx + 1}. {stop.name}
                      </Text>
                      <Text style={styles.stopConfigTime}>
                        Hora aprox: {stop.time}
                      </Text>
                    </View>
                    <Pressable
                      style={styles.removeStopBtn}
                      onPress={() => handleRemoveStop(idx)}
                    >
                      <SvgIcon name="close" size={14} color={Colors.danger} />
                    </Pressable>
                  </View>
                ))}

                {/* Formulario para agregar nueva parada */}
                <View style={styles.addStopForm}>
                  <TextInput
                    style={[styles.textInput, { flex: 2 }]}
                    placeholder="Nombre parada (ej. Cruce Petrolera)"
                    placeholderTextColor={Colors.textMuted}
                    value={newStopInput}
                    onChangeText={setNewStopInput}
                  />
                  <TextInput
                    style={[styles.textInput, { flex: 1 }]}
                    placeholder="10:00 AM"
                    placeholderTextColor={Colors.textMuted}
                    value={newStopTimeInput}
                    onChangeText={setNewStopTimeInput}
                  />
                  <Pressable style={styles.addStopBtn} onPress={handleAddStop}>
                    <SvgIcon name="plus" size={16} color="#FFFFFF" />
                  </Pressable>
                </View>
              </View>

              <Pressable
                style={styles.saveRouteBtn}
                onPress={handleCreateRoute}
              >
                <Text style={styles.saveRouteBtnText}>
                  Guardar y Asignar Ruta
                </Text>
              </Pressable>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: Spacing.xxl,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
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
  },
  newRouteBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md + 2,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  newRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  routeCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: Spacing.xs,
  },
  codeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeCode: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  zoneTag: {
    fontSize: 11,
    color: Colors.textMuted,
  },
  routeName: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginTop: 2,
  },
  routePointsBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.md,
    padding: Spacing.sm + 2,
    marginVertical: Spacing.xs + 2,
    gap: 4,
  },
  pointRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  pointLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  pointValue: {
    fontSize: 11,
    color: Colors.textPrimary,
    flex: 1,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: Spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  infoText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  stopsPreview: {
    marginTop: Spacing.sm,
  },
  stopsCount: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 4,
  },
  stopPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
    gap: 6,
  },
  stopPillOrder: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    width: 14,
  },
  stopPillName: {
    fontSize: 12,
    color: Colors.textPrimary,
    flex: 1,
  },
  stopPillTime: {
    fontSize: 11,
    color: Colors.textMuted,
    fontWeight: '600',
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
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  inputLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 4,
    marginTop: 8,
  },
  textInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 9,
    fontSize: 14,
    color: Colors.textPrimary,
  },
  inputRow: {
    flexDirection: 'row',
    gap: Spacing.sm,
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 4,
  },
  chip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.full,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  chipText: {
    fontSize: 12,
    color: Colors.textPrimary,
    fontWeight: '600',
  },
  chipTextActive: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  saveRouteBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  saveRouteBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  stopsConfigBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.md,
  },
  stopsConfigTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  stopsConfigSubtitle: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 2,
    marginBottom: Spacing.sm,
  },
  stopConfigItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: 6,
  },
  stopConfigName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stopConfigTime: {
    fontSize: 11,
    color: Colors.accentBlue,
    marginTop: 1,
  },
  removeStopBtn: {
    padding: 6,
  },
  addStopForm: {
    flexDirection: 'row',
    gap: 6,
    marginTop: 8,
    alignItems: 'center',
  },
  addStopBtn: {
    backgroundColor: Colors.accentBlue,
    width: 38,
    height: 38,
    borderRadius: Radius.md,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
