import React, { useState } from 'react';
import {
  Modal,
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Button } from '../atoms/Button';
import { Input } from '../atoms/Input';
import { RouteStop } from '../../types';

export interface ReservationModalProps {
  visible: boolean;
  onClose: () => void;
  stops: RouteStop[];
  onSubmitReservation: (data: {
    stopId: string;
    quantity: number;
    phone: string;
    clientName: string;
  }) => void;
  defaultClientName?: string;
  defaultPhone?: string;
}

export const ReservationModal: React.FC<ReservationModalProps> = ({
  visible,
  onClose,
  stops,
  onSubmitReservation,
  defaultClientName = 'María López',
  defaultPhone = '71234567',
}) => {
  const [selectedStopId, setSelectedStopId] = useState<string>(
    stops[1]?.id || stops[0]?.id || ''
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [phone, setPhone] = useState<string>(defaultPhone);
  const [clientName, setClientName] = useState<string>(defaultClientName);

  const priceTotal = (quantity * 22.5).toFixed(2);

  const handleConfirm = () => {
    onSubmitReservation({
      stopId: selectedStopId,
      quantity,
      phone,
      clientName,
    });
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.overlay}>
        <View style={styles.container}>
          <View style={styles.header}>
            <View style={styles.headerTitleRow}>
              <SvgIcon name="cylinder" size={20} color={Colors.accentBlue} />
              <Text style={styles.title}>Reservar Garrafa de Gas</Text>
            </View>
            <Pressable onPress={onClose} hitSlop={8}>
              <SvgIcon name="close" size={20} color={Colors.textMuted} />
            </Pressable>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            <Text style={styles.sectionLabel}>SELECCIONA TU PARADA DE ENTREGA</Text>
            {stops.map((stop) => {
              const isSelected = selectedStopId === stop.id;
              return (
                <Pressable
                  key={stop.id}
                  style={[styles.stopOption, isSelected && styles.stopOptionSelected]}
                  onPress={() => setSelectedStopId(stop.id)}
                >
                  <View style={styles.stopRadio}>
                    {isSelected && <View style={styles.stopRadioInner} />}
                  </View>
                  <View style={styles.stopInfo}>
                    <Text
                      style={[styles.stopName, isSelected && styles.stopNameSelected]}
                    >
                      {stop.nombre_parada}
                    </Text>
                    <Text style={styles.stopTime}>
                      Hora estimada de paso: {stop.hora_estimada}
                    </Text>
                  </View>
                </Pressable>
              );
            })}

            <Text style={[styles.sectionLabel, { marginTop: Spacing.md }]}>
              CANTIDAD DE CILINDROS (10 KG)
            </Text>
            <View style={styles.quantityRow}>
              <Pressable
                style={[styles.qtyBtn, quantity <= 1 && styles.qtyBtnDisabled]}
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                disabled={quantity <= 1}
              >
                <Text style={styles.qtyBtnText}>-</Text>
              </Pressable>
              <View style={styles.qtyDisplay}>
                <Text style={styles.qtyDisplayText}>{quantity}</Text>
                <Text style={styles.qtyUnit}>Garrafa(s)</Text>
              </View>
              <Pressable
                style={[styles.qtyBtn, quantity >= 5 && styles.qtyBtnDisabled]}
                onPress={() => setQuantity(Math.min(5, quantity + 1))}
                disabled={quantity >= 5}
              >
                <Text style={styles.qtyBtnText}>+</Text>
              </Pressable>
            </View>

            <Input
              label="Nombre del Solicitante"
              value={clientName}
              onChangeText={setClientName}
              leftIcon="user"
            />

            <Input
              label="Teléfono de Contacto"
              value={phone}
              onChangeText={setPhone}
              keyboardType="phone-pad"
              leftIcon="phone"
            />

            <View style={styles.summaryBox}>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Tarifa Oficial ANH (x1):</Text>
                <Text style={styles.summaryValue}>Bs. 22.50</Text>
              </View>
              <View style={styles.summaryRow}>
                <Text style={styles.summaryLabel}>Total a pagar al recibir:</Text>
                <Text style={styles.summaryTotal}>Bs. {priceTotal}</Text>
              </View>
              <Text style={styles.note}>
                * Recuerde entregar su cilindro vacío en buen estado al conductor.
              </Text>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              label={`Confirmar Reserva (Bs. ${priceTotal})`}
              icon="check"
              onPress={handleConfirm}
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
  sectionLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
  },
  stopOption: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.sm,
    borderRadius: Radius.md,
    borderWidth: 1.5,
    borderColor: Colors.border,
    marginBottom: Spacing.xs,
    backgroundColor: Colors.surfaceSubtle,
  },
  stopOptionSelected: {
    borderColor: Colors.accentBlue,
    backgroundColor: '#EFF6FF',
  },
  stopRadio: {
    width: 18,
    height: 18,
    borderRadius: 9,
    borderWidth: 2,
    borderColor: Colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: Spacing.sm,
  },
  stopRadioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.accentBlue,
  },
  stopInfo: {
    flex: 1,
  },
  stopName: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  stopNameSelected: {
    fontWeight: '800',
    color: Colors.accentBlue,
  },
  stopTime: {
    fontSize: 11,
    color: Colors.textMuted,
    marginTop: 2,
  },
  quantityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: Spacing.md,
    marginVertical: Spacing.sm,
  },
  qtyBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: Colors.surfaceSubtle,
    borderWidth: 1.5,
    borderColor: Colors.borderStrong,
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyBtnDisabled: {
    opacity: 0.4,
  },
  qtyBtnText: {
    fontSize: 22,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  qtyDisplay: {
    alignItems: 'center',
    minWidth: 90,
  },
  qtyDisplayText: {
    fontSize: 26,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  qtyUnit: {
    fontSize: 12,
    color: Colors.textMuted,
  },
  summaryBox: {
    backgroundColor: Colors.surfaceSubtle,
    borderRadius: Radius.md,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
    marginTop: Spacing.xs,
    marginBottom: Spacing.md,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  summaryLabel: {
    fontSize: 13,
    color: Colors.textSecondary,
  },
  summaryValue: {
    fontSize: 13,
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  summaryTotal: {
    fontSize: 16,
    fontWeight: '800',
    color: Colors.success,
  },
  note: {
    fontSize: 11,
    color: Colors.textMuted,
    fontStyle: 'italic',
    marginTop: 6,
  },
  footer: {
    padding: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
});
