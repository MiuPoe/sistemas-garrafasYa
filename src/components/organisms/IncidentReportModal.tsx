import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export interface IncidentReportModalProps {
  visible: boolean;
  onClose: () => void;
  truckPlate: string;
  driverName: string;
  onSubmitIncident: (data: {
    incidentType: string;
    description: string;
    hasGps: boolean;
    lat?: number;
    lng?: number;
  }) => void;
}

export const IncidentReportModal: React.FC<IncidentReportModalProps> = ({
  visible,
  onClose,
  truckPlate,
  driverName,
  onSubmitIncident,
}) => {
  const [incidentType, setIncidentType] = useState('Bloqueo / Marcha');
  const [description, setDescription] = useState('');
  const [useGps, setUseGps] = useState(true);

  const incidentTypes = [
    'Bloqueo / Marcha',
    'Falla Mecánica',
    'Desvío Vial',
    'Falta de Combustible',
    'Accidente Menor',
  ];

  const handleSend = () => {
    onSubmitIncident({
      incidentType,
      description: description || 'Incidente reportado en ruta.',
      hasGps: useGps,
      lat: useGps ? -16.5321 : undefined,
      lng: useGps ? -68.0874 : undefined,
    });
    setDescription('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SvgIcon name="alertTriangle" size={20} color={Colors.danger} />
              <Text style={styles.title}>Reportar Incidente en Ruta</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <SvgIcon name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.truckInfoBox}>
              <SvgIcon name="truck" size={16} color={Colors.mustard} />
              <Text style={styles.truckInfoText}>
                Camión: {truckPlate} • Chofer: {driverName}
              </Text>
            </View>

            <Text style={styles.sectionLabel}>TIPO DE INCIDENTE</Text>
            <View style={styles.typesGrid}>
              {incidentTypes.map((type) => {
                const isSelected = incidentType === type;
                return (
                  <Pressable
                    key={type}
                    style={[styles.typeChip, isSelected && styles.typeChipSelected]}
                    onPress={() => setIncidentType(type)}
                  >
                    <Text
                      style={[
                        styles.typeChipText,
                        isSelected && styles.typeChipTextSelected,
                      ]}
                    >
                      {type}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Pressable
              style={[styles.gpsToggleCard, useGps && styles.gpsToggleActive]}
              onPress={() => setUseGps(!useGps)}
            >
              <View style={styles.gpsRow}>
                <SvgIcon
                  name="location"
                  size={18}
                  color={useGps ? Colors.accentBlue : Colors.textMuted}
                />
                <View style={styles.gpsTextColumn}>
                  <Text style={styles.gpsTitle}>Usar mi ubicación actual</Text>
                  <Text style={styles.gpsSubtitle}>
                    {useGps
                      ? 'Geotag activo: Lat -16.5321, Lng -68.0874'
                      : 'Sin coordenadas satelitales'}
                  </Text>
                </View>
              </View>
              <View style={[styles.checkbox, useGps && styles.checkboxActive]}>
                {useGps && <SvgIcon name="check" size={12} color={Colors.textInverse} />}
              </View>
            </Pressable>

            <Input
              label="Descripción detallada de la situación"
              value={description}
              onChangeText={setDescription}
              placeholder="Explica qué ocurrió, vía afectada o ayuda requerida..."
              multiline
              numberOfLines={4}
            />
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label="Transmitir Alerta a Monitoreo"
              icon="alertTriangle"
              variant="danger"
              onPress={handleSend}
              fullWidth
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.65)',
    justifyContent: 'flex-end',
  },
  container: {
    backgroundColor: Colors.surface,
    borderTopLeftRadius: Radius.xl,
    borderTopRightRadius: Radius.xl,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  body: {
    padding: Spacing.md,
  },
  truckInfoBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: Colors.mustardLight,
    padding: Spacing.sm,
    borderRadius: Radius.md,
    marginBottom: Spacing.md,
  },
  truckInfoText: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.mustardDark,
  },
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
  },
  typesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  typeChip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.border,
    paddingVertical: 7,
    paddingHorizontal: 12,
    borderRadius: Radius.md,
  },
  typeChipSelected: {
    borderColor: Colors.danger,
    backgroundColor: '#FEF2F2',
  },
  typeChipText: {
    fontSize: 12,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  typeChipTextSelected: {
    color: Colors.danger,
    fontWeight: '800',
  },
  gpsToggleCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: Spacing.sm + 2,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    backgroundColor: Colors.surfaceSubtle,
    marginBottom: Spacing.md,
  },
  gpsToggleActive: {
    borderColor: Colors.accentBlue,
    backgroundColor: '#EFF6FF',
  },
  gpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  gpsTextColumn: {
    flex: 1,
  },
  gpsTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  gpsSubtitle: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkboxActive: {
    backgroundColor: Colors.accentBlue,
    borderColor: Colors.accentBlue,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
