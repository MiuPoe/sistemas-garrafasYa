import React from 'react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AppProvider, useApp } from './src/context/AppContext';
import { ScreenContainer } from './src/components/templates/ScreenContainer';

// Auth Screen
import { LoginScreen } from './src/screens/auth/LoginScreen';

// Client Screens
import { ClientHomeScreen } from './src/screens/cliente/ClientHomeScreen';
import { OfficialPriceScreen } from './src/screens/cliente/OfficialPriceScreen';
import { FixedPointsScreen } from './src/screens/cliente/FixedPointsScreen';
import { CommunityNewsScreen } from './src/screens/cliente/CommunityNewsScreen';
import { ClientClaimsScreen } from './src/screens/cliente/ClientClaimsScreen';

// Driver Screens
import { DriverHomeScreen } from './src/screens/driver/DriverHomeScreen';
import { DriverRouteScreen } from './src/screens/driver/DriverRouteScreen';
import { DriverIncidentScreen } from './src/screens/driver/DriverIncidentScreen';

// Admin Screens
import { AdminDashboardScreen } from './src/screens/admin/AdminDashboardScreen';
import { AdminFleetScreen } from './src/screens/admin/AdminFleetScreen';
import { AdminRoutesScreen } from './src/screens/admin/AdminRoutesScreen';
import { AdminGarrafasScreen } from './src/screens/admin/AdminGarrafasScreen';
import { AdminMoreMenuScreen } from './src/screens/admin/AdminMoreMenuScreen';
import { AdminClaimsScreen } from './src/screens/admin/AdminClaimsScreen';

const MainNavigator: React.FC = () => {
  const { role, setRole, activeTab, setActiveTab, isAuthenticated } = useApp();

  // Si no está autenticado, muestra la pantalla de Login con Google y selección de cuenta
  if (!isAuthenticated) {
    return <LoginScreen />;
  }

  const renderContent = () => {
    // Rol Conductor (Chofer)
    if (role === 'driver') {
      switch (activeTab) {
        case 'driverRoute':
          return <DriverRouteScreen />;
        case 'driverIncidents':
          return <DriverIncidentScreen />;
        default:
          return <DriverHomeScreen />;
      }
    }

    // Rol Administrador General
    if (role === 'admin') {
      switch (activeTab) {
        case 'adminFleet':
          return <AdminFleetScreen />;
        case 'adminRoutes':
          return <AdminRoutesScreen />;
        case 'adminGarrafas':
          return <AdminGarrafasScreen />;
        case 'adminMore':
          return <AdminMoreMenuScreen />;
        case 'adminClaims':
          return <AdminClaimsScreen />;
        default:
          return <AdminDashboardScreen />;
      }
    }

    // Rol Cliente / Vecino
    switch (activeTab) {
      case 'officialPrice':
        return <OfficialPriceScreen />;
      case 'fixedPoints':
        return <FixedPointsScreen />;
      case 'clientNews':
        return <CommunityNewsScreen />;
      case 'clientClaims':
        return <ClientClaimsScreen />;
      default:
        return <ClientHomeScreen />;
    }
  };

  return (
    <ScreenContainer
      role={role}
      currentRole={role}
      onSelectRole={setRole}
      activeTab={activeTab}
      onTabPress={setActiveTab}
    >
      {renderContent()}
    </ScreenContainer>
  );
};

export default function App() {
  return (
    <SafeAreaProvider>
      <AppProvider>
        <MainNavigator />
      </AppProvider>
    </SafeAreaProvider>
  );
}
