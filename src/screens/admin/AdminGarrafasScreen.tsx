import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  ScrollView,
  Alert,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';

export const AdminGarrafasScreen: React.FC = () => {
  const {
    plantInventory,
    vehicles,
    plantMovements,
    registerPlantExit,
  } = useApp();

  const [selectedTruck, setSelectedTruck] = useState<string>('LPZ-2026 (Mario Rojas)');
  const [selectedPlaca, setSelectedPlaca] = useState<string>('LPZ-2026');
  const [selectedDriver, setSelectedDriver] = useState<string>('Mario Rojas');
  const [quantity, setQuantity] = useState<string>('45');
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const handleSelectTruck = (v: { placa: string; chofer_asignado?: string }) => {
    setSelectedPlaca(v.placa);
    setSelectedDriver(v.chofer_asignado || 'Sin asignar');
    setSelectedTruck(`${v.placa} (${v.chofer_asignado || 'Sin asignar'})`);
    setShowDropdown(false);
  };

  const handleRegisterExit = () => {
    const qty = parseInt(quantity, 10);
    if (isNaN(qty) || qty <= 0) {
      Alert.alert('Error', 'Ingrese una cantidad válida de garrafas.');
      return;
    }

    if (qty > plantInventory.disponibles) {
      Alert.alert('Stock insuficiente', `Solo hay ${plantInventory.disponibles} garrafas disponibles.`);
      return;
    }

    registerPlantExit({
      vehiculoPlaca: selectedPlaca,
      conductorNombre: selectedDriver,
      cantidad: qty,
    });

    setSuccessMsg(`¡Salida US-${Math.floor(20 + Math.random() * 80)} registrada! Se despacharon ${qty} garrafas.`);
    setTimeout(() => setSuccessMsg(null), 4000);
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Título de Cabecera */}
      <View style={styles.header}>
        <Text style={styles.mainTitle}>Control de Garrafas</Text>
        <Text style={styles.subtitle}>Balance diario de planta y salidas</Text>
      </View>

      {/* Grid de 4 Métricas (Ingresan, Salen, Retornan, Disponibles) */}
      <View style={styles.metricsGrid}>
        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Ingresan</Text>
          <Text style={[styles.metricValue, { color: Colors.primary }]}>
            {plantInventory.ingresan}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Salen</Text>
          <Text style={[styles.metricValue, { color: Colors.accentBlue }]}>
            {plantInventory.salen}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Retornan</Text>
          <Text style={[styles.metricValue, { color: Colors.success }]}>
            {plantInventory.retornan}
          </Text>
        </View>

        <View style={styles.metricCard}>
          <Text style={styles.metricLabel}>Disponibles</Text>
          <Text style={[styles.metricValue, { color: Colors.textPrimary }]}>
            {plantInventory.disponibles}
          </Text>
        </View>
      </View>

      {/* Formulario: Registrar Salida de Planta */}
      <View style={styles.formCard}>
        <Text style={styles.formTitle}>Registrar Salida de Planta (US-19)</Text>

        {successMsg && (
          <View style={styles.successBanner}>
            <SvgIcon name="checkCircle" size={16} color={Colors.success} />
            <Text style={styles.successBannerText}>{successMsg}</Text>
          </View>
        )}

        <Text style={styles.fieldLabel}>Camión de distribución</Text>
        <Pressable
          style={styles.dropdownSelector}
          onPress={() => setShowDropdown((prev) => !prev)}
        >
          <Text style={styles.dropdownSelectedText}>{selectedTruck}</Text>
          <SvgIcon name="chevronDown" size={18} color={Colors.textSecondary} />
        </Pressable>

        {showDropdown && (
          <View style={styles.dropdownList}>
            {vehicles.map((v) => (
              <Pressable
                key={v.id}
                style={styles.dropdownItem}
                onPress={() => handleSelectTruck(v)}
              >
                <Text style={styles.dropdownItemText}>
                  {v.placa} ({v.chofer_asignado || 'Sin chofer'})
                </Text>
                <Badge
                  label={v.estado}
                  variant={v.estado === 'En ruta' ? 'info' : 'success'}
                  size="sm"
                />
              </Pressable>
            ))}
          </View>
        )}

        <Text style={[styles.fieldLabel, { marginTop: Spacing.md }]}>
          Cantidad de garrafas despachadas
        </Text>
        <TextInput
          style={styles.input}
          keyboardType="numeric"
          value={quantity}
          onChangeText={setQuantity}
          placeholder="Ej. 45"
          placeholderTextColor={Colors.textMuted}
        />

        <Pressable style={styles.submitButton} onPress={handleRegisterExit}>
          <Text style={styles.submitButtonText}>Registrar Salida</Text>
        </Pressable>
      </View>

      {/* Historial de Movimientos Recientes */}
      <View style={styles.historySection}>
        <Text style={styles.historyTitle}>MOVIMIENTOS RECIENTES EN PLANTA</Text>
        {plantMovements.map((m) => (
          <View key={m.id} style={styles.historyItem}>
            <View style={styles.historyLeft}>
              <View
                style={[
                  styles.iconCircle,
                  {
                    backgroundColor:
                      m.tipo_movimiento === 'Salida'
                        ? '#EFF6FF'
                        : m.tipo_movimiento === 'Retorno'
                        ? '#ECFDF5'
                        : '#FEF3C7',
                  },
                ]}
              >
                <SvgIcon
                  name={m.tipo_movimiento === 'Salida' ? 'truck' : 'refresh'}
                  size={16}
                  color={
                    m.tipo_movimiento === 'Salida'
                      ? Colors.accentBlue
                      : m.tipo_movimiento === 'Retorno'
                      ? Colors.success
                      : Colors.mustard
                  }
                />
              </View>
              <View>
                <Text style={styles.historyCode}>
                  {m.codigo_movimiento} · {m.tipo_movimiento}
                </Text>
                <Text style={styles.historySub}>
                  {m.vehiculo_placa ? `${m.vehiculo_placa} (${m.conductor_nombre})` : 'Planta Central'}
                </Text>
              </View>
            </View>
            <View style={styles.historyRight}>
              <Text
                style={[
                  styles.historyQty,
                  {
                    color:
                      m.tipo_movimiento === 'Salida'
                        ? Colors.danger
                        : Colors.success,
                  },
                ]}
              >
                {m.tipo_movimiento === 'Salida' ? `-${m.cantidad}` : `+${m.cantidad}`}
              </Text>
              <Text style={styles.historyTime}>{m.fecha_hora}</Text>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
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
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  metricCard: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.lg,
    paddingHorizontal: Spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  metricLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  metricValue: {
    fontSize: 28,
    fontWeight: '900',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.lg,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 3,
  },
  formTitle: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.md,
  },
  successBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#ECFDF5',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  successBannerText: {
    fontSize: 12,
    color: Colors.success,
    fontWeight: '700',
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  dropdownSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 12,
  },
  dropdownSelectedText: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  dropdownList: {
    marginTop: 4,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    overflow: 'hidden',
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  dropdownItemText: {
    fontSize: 13,
    color: Colors.textPrimary,
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: Radius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: 10,
    fontSize: 15,
    color: Colors.textPrimary,
  },
  submitButton: {
    backgroundColor: Colors.primary,
    borderRadius: Radius.md,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: Spacing.lg,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '800',
  },
  historySection: {
    paddingBottom: Spacing.xxl,
  },
  historyTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
  historyItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surface,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
  },
  historyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  iconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCode: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historySub: {
    fontSize: 11,
    color: Colors.textSecondary,
    marginTop: 1,
  },
  historyRight: {
    alignItems: 'flex-end',
  },
  historyQty: {
    fontSize: 15,
    fontWeight: '800',
  },
  historyTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
});
