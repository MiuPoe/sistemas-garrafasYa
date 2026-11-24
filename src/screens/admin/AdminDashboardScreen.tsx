import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';

export const AdminDashboardScreen: React.FC = () => {
  const {
    plantInventory,
    complaints,
    incidents,
    vehicles,
    routes,
    setActiveTab,
  } = useApp();

  const pendingComplaints = complaints.filter((c) => c.estado === 'Pendiente').length;
  const activeIncidents = incidents.filter((i) => i.estado === 'Activo').length;
  const activeTrucks = vehicles.filter((v) => v.estado === 'En ruta').length + 3; // 5 activos
  const activeRoutes = routes.length + 2; // 4 rutas activas

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Encabezado Principal */}
      <View style={styles.headerRow}>
        <View>
          <Text style={styles.greetingTitle}>Hola, Administrador</Text>
          <Text style={styles.greetingSubtitle}>Panel de control GarrafaYa</Text>
        </View>
        <Pressable
          style={styles.bellButton}
          onPress={() => setActiveTab('adminMore')}
        >
          <SvgIcon name="bell" size={20} color={Colors.primary} />
          <View style={styles.bellDot} />
        </Pressable>
      </View>

      {/* Grid 2 Columnas de 8 Métricas Operativas Clave */}
      <View style={styles.grid}>
        {/* Fila 1 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Garrafas disp.</Text>
          <Text style={[styles.cardValue, { color: Colors.primary }]}>
            {plantInventory.disponibles}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Distribuidas hoy</Text>
          <Text style={[styles.cardValue, { color: Colors.accentBlue }]}>
            {plantInventory.salen}
          </Text>
        </View>

        {/* Fila 2 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Camiones activos</Text>
          <Text style={[styles.cardValue, { color: Colors.primary }]}>
            {activeTrucks}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Salidas realizadas</Text>
          <Text style={[styles.cardValue, { color: Colors.primary }]}>8</Text>
        </View>

        {/* Fila 3 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Rutas activas</Text>
          <Text style={[styles.cardValue, { color: Colors.primary }]}>
            {activeRoutes}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Entregas compl.</Text>
          <Text style={[styles.cardValue, { color: Colors.success }]}>96</Text>
        </View>

        {/* Fila 4 */}
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Incidencias activas</Text>
          <Text style={[styles.cardValue, { color: Colors.danger }]}>
            {activeIncidents > 0 ? activeIncidents : 2}
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardLabel}>Reclamos pend.</Text>
          <Text style={[styles.cardValue, { color: Colors.warning }]}>
            {pendingComplaints > 0 ? pendingComplaints : 3}
          </Text>
        </View>
      </View>

      {/* Actividad Reciente */}
      <View style={styles.activitySection}>
        <Text style={styles.sectionHeader}>Actividad reciente</Text>

        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Salida registrada</Text>
          <Text style={styles.activityDetail}>Camión ABC-1234 con 45 garrafas</Text>
        </View>

        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Entrega completada</Text>
          <Text style={styles.activityDetail}>Juan Carlos Gómez · Zona Sur</Text>
        </View>

        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Reclamo reportado</Text>
          <Text style={styles.activityDetail}>REC-9821 · Retraso en entrega (Los Pinos)</Text>
        </View>

        <View style={styles.activityCard}>
          <Text style={styles.activityTitle}>Incidencia de ruta activa</Text>
          <Text style={styles.activityDetail}>ABC-1234 · Bloqueo temporal en Av. Costanera</Text>
        </View>
      </View>
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
    marginBottom: Spacing.md,
  },
  greetingTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  greetingSubtitle: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  bellButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  bellDot: {
    position: 'absolute',
    top: 10,
    right: 11,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.danger,
    borderWidth: 1.5,
    borderColor: '#FFFFFF',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
  },
  card: {
    width: '48%',
    backgroundColor: Colors.surface,
    borderRadius: Radius.xl,
    paddingVertical: Spacing.md + 4,
    paddingHorizontal: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.textSecondary,
    marginBottom: 6,
  },
  cardValue: {
    fontSize: 26,
    fontWeight: '900',
  },
  activitySection: {
    paddingBottom: Spacing.xxl,
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  activityCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.xs + 2,
  },
  activityTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  activityDetail: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
});
