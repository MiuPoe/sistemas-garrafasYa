import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Button } from '../../components/atoms/Button';
import { Input } from '../../components/atoms/Input';
import { Badge } from '../../components/atoms/Badge';
import { useApp } from '../../context/AppContext';

export const OfficialPriceScreen: React.FC = () => {
  const { addComplaint } = useApp();
  const [truckPlate, setTruckPlate] = useState('LPZ-1234');
  const [chargedPrice, setChargedPrice] = useState('25.00');
  const [location, setLocation] = useState('Zona Sur');
  const [details, setDetails] = useState('');

  const handleReportOverprice = () => {
    addComplaint({
      tipo_reclamo: 'Sobreprecio',
      placa_camion: truckPlate,
      zona: location,
      descripcion: `Cobro irregular de Bs. ${chargedPrice} en lugar de la tarifa oficial de Bs. 22.50. ${details}`,
      prioridad: 'Alta',
    });
    Alert.alert(
      'Denuncia Registrada',
      'Tu denuncia por sobreprecio fue enviada a la ANH y al equipo de monitoreo.'
    );
    setDetails('');
  };

  return (
    <View style={styles.container}>
      <View style={styles.heroCard}>
        <View style={styles.officialHeader}>
          <View style={styles.shieldRow}>
            <SvgIcon name="shieldCheck" size={18} color={Colors.success} />
            <Text style={styles.officialTag}>TARIFA OFICIAL REGULADA · ANH / YPFB</Text>
          </View>
          <Badge label="VIGENTE" variant="success" size="sm" />
        </View>

        <View style={styles.priceRow}>
          <Text style={styles.currencySymbol}>Bs.</Text>
          <Text style={styles.priceValue}>22.50</Text>
          <Text style={styles.unitText}>/ garrafa de 10 kg</Text>
        </View>

        <Text style={styles.updateDate}>
          Resolución Administrativa vigente al 15 de Octubre de 2026
        </Text>

        <View style={styles.guaranteeBox}>
          <View style={styles.guaranteeItem}>
            <SvgIcon name="checkCircle" size={14} color={Colors.success} />
            <Text style={styles.guaranteeText}>Precinto termoencogible intacto</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <SvgIcon name="checkCircle" size={14} color={Colors.success} />
            <Text style={styles.guaranteeText}>Peso neto garantizado 10 kg</Text>
          </View>
          <View style={styles.guaranteeItem}>
            <SvgIcon name="checkCircle" size={14} color={Colors.success} />
            <Text style={styles.guaranteeText}>Válvula de seguridad probada</Text>
          </View>
        </View>
      </View>

      <View style={styles.reportCard}>
        <View style={styles.reportHeader}>
          <SvgIcon name="alertTriangle" size={18} color={Colors.danger} />
          <Text style={styles.reportTitle}>¿Te cobraron más de Bs. 22.50?</Text>
        </View>
        <Text style={styles.reportDescription}>
          El cobro mayor al oficial es un delito sancionado por la ANH. Ingresa los
          datos para sancionar al distribuidor.
        </Text>

        <Input
          label="Placa del Camión o Distribuidor"
          value={truckPlate}
          onChangeText={setTruckPlate}
          leftIcon="truck"
        />

        <Input
          label="Monto que te cobraron (Bs.)"
          value={chargedPrice}
          onChangeText={setChargedPrice}
          keyboardType="numeric"
          leftIcon="dollar"
        />

        <Input
          label="Zona o Barrio del cobro"
          value={location}
          onChangeText={setLocation}
          leftIcon="mapPin"
        />

        <Input
          label="Detalles adicionales"
          value={details}
          onChangeText={setDetails}
          placeholder="Ej: El chofer no quiso dar factura ni vuelto..."
          multiline
          numberOfLines={3}
        />

        <Button
          label="Enviar Denuncia de Sobreprecio"
          icon="alertTriangle"
          variant="danger"
          onPress={handleReportOverprice}
          fullWidth
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingBottom: Spacing.xl,
  },
  heroCard: {
    backgroundColor: '#064E3B',
    borderRadius: Radius.xl,
    padding: Spacing.lg,
    marginBottom: Spacing.md,
    borderWidth: 1.5,
    borderColor: '#059669',
  },
  officialHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  shieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  officialTag: {
    fontSize: 10,
    fontWeight: '800',
    color: '#A7F3D0',
    letterSpacing: 0.5,
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    gap: 4,
    marginVertical: Spacing.xs,
  },
  currencySymbol: {
    fontSize: 24,
    fontWeight: '800',
    color: '#FCD34D',
  },
  priceValue: {
    fontSize: 48,
    fontWeight: '900',
    color: '#FFFFFF',
  },
  unitText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#D1FAE5',
    marginLeft: 4,
  },
  updateDate: {
    fontSize: 11,
    color: '#A7F3D0',
    marginBottom: Spacing.md,
  },
  guaranteeBox: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    gap: 6,
  },
  guaranteeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  guaranteeText: {
    fontSize: 12,
    color: '#ECFDF5',
    fontWeight: '600',
  },
  reportCard: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  reportHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: Spacing.xs,
  },
  reportTitle: {
    fontSize: 15,
    fontWeight: '800',
    color: Colors.danger,
  },
  reportDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
    lineHeight: 18,
  },
});
