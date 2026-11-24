import React from 'react';
import {
  View,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  StyleProp,
  ViewStyle,
  Platform,
} from 'react-native';
import { StatusBar } from 'expo-status-bar';
import { Colors } from '../../theme/colors';
import { HeaderBar, HeaderBarProps } from '../organisms/HeaderBar';
import { BottomNavBar } from '../organisms/BottomNavBar';
import { UserProfileModal } from '../organisms/UserProfileModal';
import { UserRole } from '../../types';
import { useApp } from '../../context/AppContext';

export interface ScreenContainerProps {
  children: React.ReactNode;
  role: UserRole;
  currentRole: UserRole;
  onSelectRole: (role: UserRole) => void;
  activeTab: string;
  onTabPress: (tabId: string) => void;
  headerProps?: Partial<HeaderBarProps>;
  scrollable?: boolean;
  style?: StyleProp<ViewStyle>;
  contentContainerStyle?: StyleProp<ViewStyle>;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({
  children,
  role,
  currentRole,
  onSelectRole,
  activeTab,
  onTabPress,
  headerProps,
  scrollable = true,
  style,
  contentContainerStyle,
}) => {
  const { currentUser } = useApp();
  const [isProfileOpen, setIsProfileOpen] = React.useState<boolean>(false);

  const appContent = (
    <SafeAreaView style={[styles.safeArea, style]}>
      <StatusBar style="light" />

      <HeaderBar
        role={role}
        userName={currentUser?.full_name || (role === 'driver' ? 'Raul Chofer' : role === 'admin' ? 'Tamara Franco' : 'Cliente Vecino')}
        onProfilePress={() => setIsProfileOpen(true)}
        {...headerProps}
      />

      <View style={styles.body}>
        {scrollable ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={[styles.scrollContent, contentContainerStyle]}
            showsVerticalScrollIndicator={false}
          >
            {children}
          </ScrollView>
        ) : (
          <View style={[styles.staticContent, contentContainerStyle]}>{children}</View>
        )}
      </View>

      <BottomNavBar
        role={role}
        activeTab={activeTab}
        onTabPress={onTabPress}
      />

      {/* Modal Universal de Perfil de Usuario con Cerrar Sesión */}
      <UserProfileModal
        visible={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />
    </SafeAreaView>
  );

  // En entorno Web desktop, centramos la aplicación en un marco móvil de smartphone
  if (Platform.OS === 'web') {
    return (
      <View style={styles.webDesktopWrapper}>
        <View style={styles.webPhoneFrame}>{appContent}</View>
      </View>
    );
  }

  return appContent;
};

const styles = StyleSheet.create({
  webDesktopWrapper: {
    flex: 1,
    backgroundColor: '#070C18',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100%',
  },
  webPhoneFrame: {
    width: '100%',
    maxWidth: 460,
    height: '100%',
    maxHeight: 920,
    backgroundColor: Colors.primary,
    borderRadius: 24,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#1E293B',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.5,
    shadowRadius: 20,
    elevation: 12,
  },
  safeArea: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  body: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 24,
  },
  staticContent: {
    flex: 1,
  },
});
