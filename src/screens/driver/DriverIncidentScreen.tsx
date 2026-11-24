import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { IncidentCard } from '../../components/molecules/IncidentCard';
import { IncidentReportModal } from '../../components/organisms/IncidentReportModal';
import { Button } from '../../components/atoms/Button';

export const DriverIncidentScreen: React.FC = () => {
  const { incidents, addIncident, routes } = useApp();
  const [modalVisible, setModalVisible] = useState(false);
  const currentRoute = routes[0];

  return (
    <View style={styles.container}>
      <Button
        label="Reportar Nuevo Bloqueo o Falla"
        icon="alertTriangle"
        variant="danger"
        onPress={() => setModalVisible(true)}
        style={{ marginBottom: Spacing.md }}
        fullWidth
      />

      <Text style={styles.sectionTitle}>ALERTAS E INCIDENTES ACTIVOS EN RUTA</Text>

      {incidents.map((inc) => (
        <IncidentCard key={inc.id} incident={inc} />
      ))}

      <IncidentReportModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        truckPlate={currentRoute?.vehiculo_placa || 'LPZ-1234'}
        driverName={currentRoute?.conductor_nombre || 'Juan Carlos Gómez'}
        onSubmitIncident={addIncident}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
    marginBottom: Spacing.sm,
  },
});
