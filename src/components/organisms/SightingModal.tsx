import React, { useState } from 'react';
import { Modal, View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';

export interface SightingModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmitSighting: (data: {
    referencePoint: string;
    comment: string;
  }) => void;
}

export const SightingModal: React.FC<SightingModalProps> = ({
  visible,
  onClose,
  onSubmitSighting,
}) => {
  const [referencePoint, setReferencePoint] = useState('Cruce Av. Petrolera');
  const [comment, setComment] = useState('El camión acaba de llegar tocando bocina.');

  const quickTips = [
    'Acaba de llegar tocando bocina',
    'Avanzando lento, mucha afluencia',
    'Ya salió rumbo a la siguiente parada',
  ];

  const handleSend = () => {
    onSubmitSighting({
      referencePoint,
      comment,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SvgIcon name="eye" size={20} color={Colors.accentBlue} />
              <Text style={styles.title}>¡Vi el Camión! Avisar a la Zona</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <SvgIcon name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <View style={styles.body}>
            <Text style={styles.description}>
              Tu reporte ayuda a que tus vecinos sepan cuándo salir con sus garrafas
              sin esperar en vano en la calle.
            </Text>

            <Input
              label="Lugar o Esquina donde lo viste"
              value={referencePoint}
              onChangeText={setReferencePoint}
              leftIcon="mapPin"
              placeholder="Ej: Calle 16 de Obrajes"
            />

            <Input
              label="Comentario adicional"
              value={comment}
              onChangeText={setComment}
              multiline
              numberOfLines={3}
              placeholder="Detalles útiles para la comunidad..."
            />

            <Text style={styles.quickLabel}>OPCIONES RÁPIDAS:</Text>
            <View style={styles.quickChips}>
              {quickTips.map((tip, idx) => (
                <Pressable
                  key={idx}
                  style={styles.chip}
                  onPress={() => setComment(tip)}
                >
                  <Text style={styles.chipText}>{tip}</Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.footer}>
            <Button
              label="Publicar Aviso a la Comunidad"
              icon="check"
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
  description: {
    fontSize: 13,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
  quickLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    marginBottom: Spacing.xs,
  },
  quickChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: Spacing.md,
  },
  chip: {
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1,
    borderColor: Colors.border,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  chipText: {
    fontSize: 11,
    color: Colors.textSecondary,
    fontWeight: '600',
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
