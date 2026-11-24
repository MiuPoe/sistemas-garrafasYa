import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { ClaimCard } from '../../components/molecules/ClaimCard';
import { ClaimDetailModal } from '../../components/organisms/ClaimDetailModal';
import { Input } from '../../components/atoms/Input';
import { Button } from '../../components/atoms/Button';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Complaint } from '../../types';

export const ClientClaimsScreen: React.FC = () => {
  const { complaints, addComplaint } = useApp();
  const [selectedClaim, setSelectedClaim] = useState<Complaint | null>(null);
  const [showNewForm, setShowNewForm] = useState(false);

  const [motive, setMotive] = useState<'Retraso en entrega' | 'Sobreprecio' | 'Mala atención' | 'Cilindro defectuoso' | 'No pasó por la parada'>('Retraso en entrega');
  const [plate, setPlate] = useState('ABC-1234');
  const [approxTime, setApproxTime] = useState('12:30 PM');
  const [zone, setZone] = useState('Zona Norte');
  const [description, setDescription] = useState('');

  const motives = [
    'Retraso en entrega',
    'Sobreprecio',
    'No pasó por la parada',
    'Cilindro defectuoso',
    'Mala atención',
  ] as const;

  const handleSubmit = () => {
    addComplaint({
      tipo_reclamo: motive,
      placa_camion: plate,
      hora_aproximada: approxTime,
      zona: zone,
      descripcion: description || 'Reclamo generado por el vecino.',
      prioridad: motive === 'Sobreprecio' || motive === 'Cilindro defectuoso' ? 'Alta' : 'Media',
    });
    setDescription('');
    setShowNewForm(false);
  };

  return (
    <View style={styles.container}>
      <View style={styles.topBar}>
        <Text style={styles.sectionTitle}>CENTRO DE ATENCIÓN Y RECLAMOS</Text>
        <Pressable
          style={styles.newClaimBtn}
          onPress={() => setShowNewForm(!showNewForm)}
        >
          <SvgIcon
            name={showNewForm ? 'close' : 'plus'}
            size={14}
            color={Colors.textInverse}
          />
          <Text style={styles.newClaimBtnText}>
            {showNewForm ? 'Cancelar' : 'Nuevo Reclamo'}
          </Text>
        </Pressable>
      </View>

      {showNewForm && (
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Registrar Ticket de Reclamo</Text>

          <Text style={styles.fieldLabel}>MOTIVO DEL RECLAMO</Text>
          <View style={styles.motivesGrid}>
            {motives.map((m) => {
              const isSelected = motive === m;
              return (
                <Pressable
                  key={m}
                  style={[styles.motiveChip, isSelected && styles.motiveChipSelected]}
                  onPress={() => setMotive(m)}
                >
                  <Text
                    style={[
                      styles.motiveChipText,
                      isSelected && styles.motiveChipTextSelected,
                    ]}
                  >
                    {m}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          <Input
            label="Placa del Camión (opcional)"
            value={plate}
            onChangeText={setPlate}
            leftIcon="truck"
          />

          <View style={styles.formRow}>
            <View style={{ flex: 1, marginRight: 8 }}>
              <Input
                label="Hora Aprox."
                value={approxTime}
                onChangeText={setApproxTime}
                leftIcon="clock"
              />
            </View>
            <View style={{ flex: 1 }}>
              <Input
                label="Zona o Barrio"
                value={zone}
                onChangeText={setZone}
                leftIcon="mapPin"
              />
            </View>
          </View>

          <Input
            label="Detalle de lo ocurrido"
            value={description}
            onChangeText={setDescription}
            placeholder="Describe brevemente el incidente o problema..."
            multiline
            numberOfLines={3}
          />

          <Button
            label="Enviar Ticket a Soporte"
            icon="check"
            onPress={handleSubmit}
            fullWidth
          />
        </View>
      )}

      <Text style={[styles.sectionTitle, { marginTop: Spacing.md }]}>
        TUS TICKETS REGISTRADOS ({complaints.length})
      </Text>

      {complaints.map((c) => (
        <ClaimCard
          key={c.id}
          claim={c}
          onPress={() => setSelectedClaim(c)}
        />
      ))}

      <ClaimDetailModal
        visible={!!selectedClaim}
        onClose={() => setSelectedClaim(null)}
        claim={selectedClaim}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.8,
  },
  newClaimBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: Colors.accentBlue,
    paddingVertical: 6,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },
  newClaimBtnText: {
    color: Colors.textInverse,
    fontSize: 12,
    fontWeight: '700',
  },
  formCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  formTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: Spacing.sm,
  },
  fieldLabel: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
    marginBottom: 6,
  },
  motivesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  motiveChip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.md,
  },
  motiveChipSelected: {
    backgroundColor: '#EFF6FF',
    borderColor: Colors.accentBlue,
  },
  motiveChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  motiveChipTextSelected: {
    color: Colors.accentBlue,
    fontWeight: '800',
  },
  formRow: {
    flexDirection: 'row',
  },
});
