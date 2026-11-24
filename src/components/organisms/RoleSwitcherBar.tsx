import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { UserRole } from '../../types';

export interface RoleSwitcherBarProps {
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
}

export const RoleSwitcherBar: React.FC<RoleSwitcherBarProps> = ({
  currentRole,
  onSelectRole,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.labelRow}>
        <SvgIcon name="layers" size={13} color={Colors.textMuted} />
        <Text style={styles.labelText}>VISTA DE ROL:</Text>
      </View>
      <View style={styles.tabsRow}>
        <Pressable
          style={[styles.tab, currentRole === 'client' && styles.activeTabClient]}
          onPress={() => onSelectRole('client')}
        >
          <SvgIcon
            name="user"
            size={13}
            color={currentRole === 'client' ? Colors.textInverse : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              currentRole === 'client' && styles.activeTabText,
            ]}
          >
            Vecino
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, currentRole === 'driver' && styles.activeTabDriver]}
          onPress={() => onSelectRole('driver')}
        >
          <SvgIcon
            name="truck"
            size={13}
            color={currentRole === 'driver' ? Colors.textInverse : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              currentRole === 'driver' && styles.activeTabText,
            ]}
          >
            Chofer
          </Text>
        </Pressable>

        <Pressable
          style={[styles.tab, currentRole === 'admin' && styles.activeTabAdmin]}
          onPress={() => onSelectRole('admin')}
        >
          <SvgIcon
            name="barChart"
            size={13}
            color={currentRole === 'admin' ? Colors.textInverse : Colors.textMuted}
          />
          <Text
            style={[
              styles.tabText,
              currentRole === 'admin' && styles.activeTabText,
            ]}
          >
            Admin
          </Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#0F172A',
    paddingVertical: 6,
    paddingHorizontal: Spacing.md,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  labelText: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.5,
  },
  tabsRow: {
    flexDirection: 'row',
    gap: 4,
    backgroundColor: '#1E293B',
    padding: 2,
    borderRadius: Radius.sm,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: Radius.xs,
  },
  activeTabClient: {
    backgroundColor: Colors.accentBlue,
  },
  activeTabDriver: {
    backgroundColor: Colors.mustard,
  },
  activeTabAdmin: {
    backgroundColor: '#334155',
  },
  tabText: {
    fontSize: 11,
    fontWeight: '700',
    color: Colors.textMuted,
  },
  activeTabText: {
    color: Colors.textInverse,
  },
});
