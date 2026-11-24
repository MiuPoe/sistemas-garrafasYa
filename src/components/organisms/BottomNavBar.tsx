import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Colors, Spacing } from '../../theme/colors';
import { SvgIcon, SvgIconName } from '../atoms/SvgIcon';
import { UserRole } from '../../types';

export interface TabItem {
  id: string;
  label: string;
  icon: SvgIconName;
}

export interface BottomNavBarProps {
  role: UserRole;
  activeTab: string;
  onTabPress: (tabId: string) => void;
}

export const BottomNavBar: React.FC<BottomNavBarProps> = ({
  role,
  activeTab,
  onTabPress,
}) => {
  const getTabsForRole = (): TabItem[] => {
    switch (role) {
      case 'driver':
        return [
          { id: 'driverHome', label: 'Cabina', icon: 'truck' },
          { id: 'driverRoute', label: 'Ruta & Paradas', icon: 'map' },
          { id: 'driverIncidents', label: 'Incidentes', icon: 'alertTriangle' },
        ];
      case 'admin':
        return [
          { id: 'adminDashboard', label: 'Inicio', icon: 'home' },
          { id: 'adminFleet', label: 'Camiones', icon: 'truck' },
          { id: 'adminRoutes', label: 'Rutas', icon: 'map' },
          { id: 'adminGarrafas', label: 'Garrafas', icon: 'cylinder' },
          { id: 'adminMore', label: 'Más', icon: 'moreHorizontal' },
        ];
      default:
        return [
          { id: 'clientHome', label: 'Inicio', icon: 'map' },
          { id: 'officialPrice', label: 'Bs 22.50', icon: 'dollar' },
          { id: 'fixedPoints', label: 'Puntos Fijos', icon: 'mapPin' },
          { id: 'clientNews', label: 'Noticias', icon: 'newspaper' },
          { id: 'clientClaims', label: 'Reclamos', icon: 'alertTriangle' },
        ];
    }
  };

  const tabs = getTabsForRole();

  return (
    <View style={styles.container}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        const tintColor = isActive
          ? role === 'driver'
            ? Colors.mustard
            : Colors.accentBlue
          : Colors.textMuted;

        return (
          <Pressable
            key={tab.id}
            style={styles.tabItem}
            onPress={() => onTabPress(tab.id)}
          >
            <SvgIcon name={tab.icon} size={20} color={tintColor} />
            <Text
              style={[
                styles.tabLabel,
                { color: tintColor },
                isActive && styles.activeTabLabel,
              ]}
              numberOfLines={1}
            >
              {tab.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.surface,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingVertical: 8,
    paddingHorizontal: Spacing.xs,
    justifyContent: 'space-around',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 8,
  },
  tabItem: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  tabLabel: {
    fontSize: 10,
    marginTop: 3,
    fontWeight: '600',
  },
  activeTabLabel: {
    fontWeight: '800',
  },
});
