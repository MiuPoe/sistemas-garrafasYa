import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  ScrollView,
  Platform,
} from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { useApp } from '../../context/AppContext';

export interface UserProfileModalProps {
  visible: boolean;
  onClose: () => void;
}

export const UserProfileModal: React.FC<UserProfileModalProps> = ({
  visible,
  onClose,
}) => {
  const { currentUser, role, logout } = useApp();

  const handleLogout = () => {
    onClose();
    logout();
  };

  const getRoleTitle = () => {
    switch (role) {
      case 'admin':
        return 'Administrador General';
      case 'driver':
        return 'Conductor Asignado';
      default:
        return 'Cliente Vecino (La Paz)';
    }
  };

  const getInitials = (name: string) => {
    if (!name) return 'GY';
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return (parts[0][0] + parts[1][0]).toUpperCase();
    }
    return name.slice(0, 2).toUpperCase();
  };

  const initials = getInitials(currentUser?.full_name || 'Usuario');

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <View style={styles.headerIcon}>
                <SvgIcon name="user" size={20} color={Colors.primary} />
              </View>
              <Text style={styles.headerTitle}>Mi Perfil</Text>
            </View>
            <Pressable onPress={onClose} style={styles.closeBtn}>
              <SvgIcon name="close" size={22} color={Colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
            {/* Tarjeta de Avatar y Rol */}
            <View style={styles.profileHeaderCard}>
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{initials}</Text>
              </View>
              <Text style={styles.userName}>{currentUser?.full_name || 'Usuario'}</Text>
              <Text style={styles.userEmail}>{currentUser?.email}</Text>
              <View style={styles.badgeRow}>
                <Badge
                  label={getRoleTitle()}
                  variant={role === 'admin' ? 'info' : role === 'driver' ? 'mustard' : 'success'}
                  size="md"
                />
                <Badge
                  label={currentUser?.is_verified ? 'Verificado ANH' : 'En Validación'}
                  variant="success"
                  size="sm"
                />
              </View>
            </View>

            {/* Información Detallada */}
            <View style={styles.infoSection}>
              <Text style={styles.sectionHeading}>DATOS OFICIALES DE LA CUENTA</Text>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <SvgIcon name="shieldCheck" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Código de Identificación</Text>
                  <Text style={styles.infoValue}>{currentUser?.code || 'GY-CLI-902'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <SvgIcon name="fileText" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Carnet de Identidad (CI)</Text>
                  <Text style={styles.infoValue}>{currentUser?.ci || '3344556 LP'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <SvgIcon name="phone" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Teléfono / WhatsApp</Text>
                  <Text style={styles.infoValue}>{currentUser?.phone || '70123456'}</Text>
                </View>
              </View>

              <View style={styles.infoRow}>
                <View style={styles.infoIconBox}>
                  <SvgIcon name="mapPin" size={18} color={Colors.primary} />
                </View>
                <View style={styles.infoCol}>
                  <Text style={styles.infoLabel}>Zona de La Paz</Text>
                  <Text style={styles.infoValue}>{currentUser?.zone || 'Zona Sur - Los Pinos'}</Text>
                </View>
              </View>

              {role === 'driver' && (
                <View style={styles.infoRow}>
                  <View style={styles.infoIconBox}>
                    <SvgIcon name="truck" size={18} color="#D97706" />
                  </View>
                  <View style={styles.infoCol}>
                    <Text style={styles.infoLabel}>Camión Asignado</Text>
                    <Text style={styles.infoValue}>ABC-1234 (Toyota Dyna - 120 garrafas)</Text>
                  </View>
                </View>
              )}
            </View>

            {/* Aviso ANH */}
            <View style={styles.anhBox}>
              <SvgIcon name="info" size={16} color={Colors.primary} />
              <Text style={styles.anhText}>
                Cuenta autorizada para el sistema de control y distribución de GLP en La Paz y El Alto (Tarifa oficial Bs. 22.50).
              </Text>
            </View>

            {/* Botón de Cerrar Sesión */}
            <Pressable style={styles.logoutBtn} onPress={handleLogout}>
              <SvgIcon name="logout" size={20} color="#FFFFFF" />
              <Text style={styles.logoutBtnText}>Cerrar Sesión</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.md,
  },
  container: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.xl,
    width: '100%',
    maxWidth: 440,
    maxHeight: '90%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.lg,
    paddingVertical: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  closeBtn: {
    padding: Spacing.xs,
  },
  content: {
    padding: Spacing.lg,
    gap: Spacing.lg,
  },
  profileHeaderCard: {
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    borderRadius: Radius.lg,
    padding: Spacing.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  avatarCircle: {
    width: 72,
    height: 72,
    borderRadius: 36,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: Spacing.sm,
    shadowColor: Colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 26,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  userName: {
    fontSize: 19,
    fontWeight: '800',
    color: '#0F172A',
    marginBottom: 2,
    textAlign: 'center',
  },
  userEmail: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: Spacing.sm,
  },
  badgeRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
    marginTop: 4,
  },
  infoSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: Radius.lg,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    padding: Spacing.md,
    gap: 12,
  },
  sectionHeading: {
    fontSize: 11,
    fontWeight: '800',
    color: '#94A3B8',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  infoIconBox: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: '#F1F5F9',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    color: '#64748B',
    fontWeight: '600',
  },
  infoValue: {
    fontSize: 14,
    color: '#0F172A',
    fontWeight: '700',
    marginTop: 1,
  },
  anhBox: {
    flexDirection: 'row',
    gap: 8,
    backgroundColor: '#EFF6FF',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#BFDBFE',
  },
  anhText: {
    fontSize: 12,
    color: '#1E40AF',
    flex: 1,
    lineHeight: 16,
  },
  logoutBtn: {
    flexDirection: 'row',
    backgroundColor: '#DC2626',
    borderRadius: Radius.lg,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#DC2626',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 3,
  },
  logoutBtnText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '700',
  },
});