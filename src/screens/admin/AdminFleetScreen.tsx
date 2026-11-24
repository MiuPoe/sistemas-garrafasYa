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

export const AdminFleetScreen: React.FC = () => {
  const { vehicles, addVehicle, drivers, addDriver } = useApp();

  const [modalVisible, setModalVisible] = useState<boolean>(false);
  const [registerType, setRegisterType] = useState<'truck' | 'driver'>('truck');

  // Estado para nuevo camión
  const [placa, setPlaca] = useState<string>('');
  const [modelo, setModelo] = useState<string>('');
  const [anio, setAnio] = useState<string>('2024');
  const [capacidad, setCapacidad] = useState<string>('120');
  const [chofer, setChofer] = useState<string>('');

  // Estado para nuevo conductor
  const [driverName, setDriverName] = useState<string>('');
  const [driverEmail, setDriverEmail] = useState<string>('');
  const [driverCi, setDriverCi] = useState<string>('');
  const [driverPhone, setDriverPhone] = useState<string>('');
  const [driverLicense, setDriverLicense] = useState<string>('Profesional C');
  const [driverVehicle, setDriverVehicle] = useState<string>('');

  const handleSaveTruck = () => {
    if (!placa.trim() || !modelo.trim()) {
      Alert.alert('Datos requeridos', 'Ingrese placa y modelo del vehículo.');
      return;
    }

    addVehicle({
      placa: placa.toUpperCase().trim(),
      modelo: modelo.trim(),
      anio: parseInt(anio, 10) || 2024,
      capacidad_garrafas: parseInt(capacidad, 10) || 120,
      estado: 'Operativo',
      chofer_asignado: chofer.trim() || undefined,
    });

    setPlaca('');
    setModelo('');
    setChofer('');
    setModalVisible(false);
    Alert.alert('Éxito', `Camión ${placa.toUpperCase()} registrado correctamente.`);
  };

  const handleSaveDriver = () => {
    if (!driverName.trim() || !driverCi.trim()) {
      Alert.alert('Datos requeridos', 'Ingrese nombre completo y CI del conductor.');
      return;
    }

    addDriver({
      nombre: driverName.trim(),
      email: driverEmail.trim() || `${driverName.toLowerCase().replace(/\s+/g, '.')}@garrafasya.bo`,
      ci: driverCi.trim(),
      telefono: driverPhone.trim() || '70000000',
      categoria_licencia: driverLicense,
      vehiculo_asignado: driverVehicle.trim() || undefined,
      estado: 'Activo',
    });

    setDriverName('');
    setDriverEmail('');
    setDriverCi('');
    setDriverPhone('');
    setModalVisible(false);
    Alert.alert('Éxito', `Conductor ${driverName} registrado y habilitado.`);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado Principal con Botón + Registrar */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.title}>Flota de Camiones</Text>
          <Text style={styles.subtitle}>Control de vehículos de distribución</Text>
        </View>
        <Pressable
          style={styles.registerButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.registerButtonText}>+ Registrar</Text>
        </Pressable>
      </View>

      {/* Lista de Tarjetas de Camiones */}
      {vehicles.map((v) => {
        const isEnRuta = v.estado === 'En ruta';
        return (
          <View key={v.id} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={styles.leftCol}>
                <View style={styles.iconBox}>
                  <SvgIcon name="truck" size={18} color={Colors.accentBlue} />
                </View>
                <View>
                  <Text style={styles.plate}>{v.placa}</Text>
                  <Text style={styles.model}>
                    {v.modelo} · {v.anio}
                  </Text>
                </View>
              </View>
              <Badge
                label={v.estado}
                variant={isEnRuta ? 'success' : 'default'}
                size="sm"
              />
            </View>

            <View style={styles.cardDivider} />

            <View style={styles.cardBottom}>
              <View style={styles.bottomInfo}>
                <Text style={styles.label}>Chofer: </Text>
                <Text style={styles.value}>
                  {v.chofer_asignado || 'Sin asignar'}
                </Text>
              </View>
              <View style={styles.bottomInfo}>
                <Text style={styles.label}>Capacidad: </Text>
                <Text style={styles.value}>{v.capacidad_garrafas} garrafas</Text>
              </View>
            </View>
          </View>
        );
      })}

      {/* Modal de Registro de Camión o Conductor */}
      <Modal
        visible={modalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Nuevo Registro de Flota</Text>
              <Pressable onPress={() => setModalVisible(false)}>
                <SvgIcon name="close" size={20} color={Colors.textSecondary} />
              </Pressable>
            </View>

            {/* Pestañas: Camión vs Conductor */}
            <View style={styles.tabSelector}>
              <Pressable
                style={[
                  styles.tabBtn,
                  registerType === 'truck' && styles.tabBtnActive,
                ]}
                onPress={() => setRegisterType('truck')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    registerType === 'truck' && styles.tabBtnTextActive,
                  ]}
                >
                  Registrar Camión
                </Text>
              </Pressable>

              <Pressable
                style={[
                  styles.tabBtn,
                  registerType === 'driver' && styles.tabBtnActive,
                ]}
                onPress={() => setRegisterType('driver')}
              >
                <Text
                  style={[
                    styles.tabBtnText,
                    registerType === 'driver' && styles.tabBtnTextActive,
                  ]}
                >
                  Registrar Chofer
                </Text>
              </Pressable>
            </View>

            {registerType === 'truck' ? (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Placa del Vehículo</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. LPZ-4567"
                  placeholderTextColor={Colors.textMuted}
                  value={placa}
                  onChangeText={setPlaca}
                />

                <Text style={styles.inputLabel}>Marca y Modelo</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. Toyota Dyna / Hino 300"
                  placeholderTextColor={Colors.textMuted}
                  value={modelo}
                  onChangeText={setModelo}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Año</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="2024"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textMuted}
                      value={anio}
                      onChangeText={setAnio}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Capacidad (Garrafas)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="120"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textMuted}
                      value={capacidad}
                      onChangeText={setCapacidad}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Chofer Asignado</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. Raul Chofer"
                  placeholderTextColor={Colors.textMuted}
                  value={chofer}
                  onChangeText={setChofer}
                />

                <Pressable
                  style={styles.submitModalBtn}
                  onPress={handleSaveTruck}
                >
                  <Text style={styles.submitModalBtnText}>Guardar Camión</Text>
                </Pressable>
              </ScrollView>
            ) : (
              <ScrollView showsVerticalScrollIndicator={false}>
                <Text style={styles.inputLabel}>Nombre Completo</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Ej. Raul Chofer"
                  placeholderTextColor={Colors.textMuted}
                  value={driverName}
                  onChangeText={setDriverName}
                />

                <Text style={styles.inputLabel}>Correo Gmail / Institucional</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="pishinraula@gmail.com"
                  placeholderTextColor={Colors.textMuted}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={driverEmail}
                  onChangeText={setDriverEmail}
                />

                <View style={styles.inputRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Cédula de Identidad (CI)</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="4588921 LP"
                      placeholderTextColor={Colors.textMuted}
                      value={driverCi}
                      onChangeText={setDriverCi}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.inputLabel}>Teléfono Celular</Text>
                    <TextInput
                      style={styles.textInput}
                      placeholder="76543210"
                      keyboardType="phone-pad"
                      placeholderTextColor={Colors.textMuted}
                      value={driverPhone}
                      onChangeText={setDriverPhone}
                    />
                  </View>
                </View>

                <Text style={styles.inputLabel}>Categoría de Licencia</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="Profesional Categoría C"
                  placeholderTextColor={Colors.textMuted}
                  value={driverLicense}
                  onChangeText={setDriverLicense}
                />

                <Text style={styles.inputLabel}>Asignar a Camión (Placa)</Text>
                <TextInput
                  style={styles.textInput}
                  placeholder="ABC-1234"
                  placeholderTextColor={Colors.textMuted}
                  value={driverVehicle}
                  onChangeText={setDriverVehicle}
                />

                <Pressable
                  style={styles.submitModalBtn}
                  onPress={handleSaveDriver}
                >
                  <Text style={styles.submitModalBtnText}>Guardar Conductor</Text>
                </Pressable>
              </ScrollView>
            )}
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  subtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  registerButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: Spacing.md + 4,
    paddingVertical: 10,
    borderRadius: Radius.full,
  },
  registerButtonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '800',
  },
  card: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.md + 2,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.sm + 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  leftCol: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EFF6FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  plate: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  model: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  cardDivider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: Spacing.sm + 2,
  },
  cardBottom: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bottomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  label: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  value: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
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
  tabSelector: {
    flexDirection: 'row',
    backgroundColor: '#F1F5F9',
    borderRadius: Radius.lg,
    padding: 3,
    marginBottom: Spacing.md,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: Radius.md,
  },
  tabBtnActive: {
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabBtnText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tabBtnTextActive: {
    color: Colors.primary,
    fontWeight: '800',
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
  submitModalBtn: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: Spacing.lg,
    marginBottom: Spacing.md,
  },
  submitModalBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
});
