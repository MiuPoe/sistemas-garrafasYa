import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Button } from '../atoms/Button';
import { Badge } from '../atoms/Badge';
import { Input } from '../atoms/Input';
import { Complaint } from '../../types';

export interface ClaimDetailModalProps {
  visible: boolean;
  onClose: () => void;
  claim: Complaint | null;
  onUpdateStatus?: (claimId: string, newStatus: Complaint['estado'], comment: string) => void;
  isAdmin?: boolean;
}

export const ClaimDetailModal: React.FC<ClaimDetailModalProps> = ({
  visible,
  onClose,
  claim,
  onUpdateStatus,
  isAdmin = false,
}) => {
  const [newComment, setNewComment] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<Complaint['estado']>(
    claim?.estado || 'En revisión'
  );

  if (!claim) return null;

  const handleSaveStatus = () => {
    if (onUpdateStatus) {
      onUpdateStatus(
        claim.id,
        selectedStatus,
        newComment || `Estado actualizado a ${selectedStatus}`
      );
    }
    setNewComment('');
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SvgIcon name="fileText" size={20} color={Colors.accentBlue} />
              <Text style={styles.title}>Reclamo #{claim.ticket_code}</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <SvgIcon name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <View style={styles.statusRow}>
              <Badge
                label={`Prioridad: ${claim.prioridad}`}
                variant={claim.prioridad === 'Alta' ? 'danger' : 'warning'}
              />
              <Badge
                label={`Estado: ${claim.estado}`}
                variant={
                  claim.estado === 'Resuelto'
                    ? 'success'
                    : claim.estado === 'En revisión'
                    ? 'warning'
                    : 'danger'
                }
              />
            </View>

            <Text style={styles.claimType}>{claim.tipo_reclamo}</Text>
            <Text style={styles.description}>{claim.descripcion}</Text>

            <View style={styles.infoCard}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Consumidor:</Text>
                <Text style={styles.infoVal}>{claim.nombre_consumidor}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Teléfono:</Text>
                <Text style={styles.infoVal}>{claim.telefono_contacto}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Placa de Camión:</Text>
                <Text style={styles.infoVal}>{claim.placa_camion || 'No reportada'}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Zona:</Text>
                <Text style={styles.infoVal}>{claim.zona}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Hora Aprox:</Text>
                <Text style={styles.infoVal}>{claim.hora_aproximada}</Text>
              </View>
            </View>

            <Text style={styles.sectionTitle}>HISTORIAL DE ATENCIÓN</Text>
            {claim.history && claim.history.length > 0 ? (
              claim.history.map((item, idx) => (
                <View key={idx} style={styles.historyItem}>
                  <View style={styles.historyDot} />
                  <View style={styles.historyContent}>
                    <Text style={styles.historyState}>{item.estado}</Text>
                    <Text style={styles.historyComment}>{item.comentario}</Text>
                    <Text style={styles.historyTime}>{item.fecha}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={styles.noHistory}>Sin actualizaciones previas.</Text>
            )}

            {isAdmin && (
              <View style={styles.adminSection}>
                <Text style={styles.sectionTitle}>GESTIONAR ESTADO DEL TICKET</Text>
                <View style={styles.statusButtonsRow}>
                  {(['Pendiente', 'En revisión', 'Resuelto'] as const).map((st) => (
                    <Pressable
                      key={st}
                      style={[
                        styles.stBtn,
                        selectedStatus === st && styles.stBtnActive,
                      ]}
                      onPress={() => setSelectedStatus(st)}
                    >
                      <Text
                        style={[
                          styles.stBtnText,
                          selectedStatus === st && styles.stBtnTextActive,
                        ]}
                      >
                        {st}
                      </Text>
                    </Pressable>
                  ))}
                </View>

                <Input
                  label="Nota o resolución de soporte"
                  value={newComment}
                  onChangeText={setNewComment}
                  placeholder="Detalla las acciones tomadas o descargo del chofer..."
                  multiline
                  numberOfLines={2}
                />
              </View>
            )}
          </ScrollView>

          <View style={styles.footer}>
            {isAdmin ? (
              <Button
                label="Actualizar Ticket de Reclamo"
                icon="check"
                onPress={handleSaveStatus}
                fullWidth
              />
            ) : (
              <Button
                label="Cerrar Detalle"
                variant="outline"
                onPress={onClose}
                fullWidth
              />
            )}
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
  statusRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.sm,
  },
  claimType: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: 4,
  },
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    lineHeight: 18,
    marginBottom: Spacing.md,
  },
  infoCard: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  infoVal: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
    marginTop: Spacing.xs,
  },
  historyItem: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: Spacing.sm,
  },
  historyDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentBlue,
    marginTop: 5,
  },
  historyContent: {
    flex: 1,
  },
  historyState: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  historyComment: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginTop: 2,
  },
  historyTime: {
    fontSize: 10,
    color: Colors.textMuted,
    marginTop: 2,
  },
  noHistory: {
    fontSize: 12,
    color: Colors.textMuted,
    fontStyle: 'italic',
  },
  adminSection: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  statusButtonsRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: Spacing.md,
  },
  stBtn: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: Radius.md,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  stBtnActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  stBtnText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textSecondary,
  },
  stBtnTextActive: {
    color: Colors.textInverse,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
