import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  TextInput,
  ScrollView,
  Alert,
  Platform,
} from 'react-native';
import Svg, { Rect, Path, Circle } from 'react-native-svg';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { useApp } from '../../context/AppContext';
import { SvgIcon } from '../../components/atoms/SvgIcon';
import { Badge } from '../../components/atoms/Badge';
import { UserRole } from '../../types';

// Ilustración vectorial limpia del camión de distribución (Fiel a la Imagen 3)
const WelcomeTruckSvg: React.FC = () => (
  <Svg width={180} height={120} viewBox="0 0 180 120">
    {/* Sombra suave inferior */}
    <Rect x="20" y="98" width="140" height="10" rx="5" fill="#E0E7FF" opacity={0.6} />

    {/* Caja / Carga Amarilla */}
    <Rect x="78" y="22" width="76" height="58" rx="8" fill="#FBBF24" />
    <Rect x="78" y="22" width="76" height="12" rx="4" fill="#F59E0B" />

    {/* Chasis Inferior Naranja / Rojo */}
    <Rect x="24" y="66" width="130" height="16" rx="4" fill="#EA580C" />

    {/* Cabina Celeste */}
    <Path
      d="M26 66 L26 40 C26 34 30 30 36 30 L58 30 C64 30 68 34 68 40 L68 66 Z"
      fill="#60A5FA"
    />
    {/* Ventana de la cabina */}
    <Path
      d="M32 40 C32 36 35 34 39 34 L54 34 C58 34 60 36 60 40 L60 52 L32 52 Z"
      fill="#E0F2FE"
    />

    {/* Parachoques y luces */}
    <Rect x="20" y="70" width="8" height="10" rx="2" fill="#CBD5E1" />
    <Circle cx="24" cy="62" r="3" fill="#FEF08A" />

    {/* Rueda Delantera */}
    <Circle cx="50" cy="84" r="14" fill="#312E81" />
    <Circle cx="50" cy="84" r="7" fill="#C7D2FE" />
    <Circle cx="50" cy="84" r="3" fill="#312E81" />

    {/* Rueda Trasera */}
    <Circle cx="128" cy="84" r="14" fill="#312E81" />
    <Circle cx="128" cy="84" r="7" fill="#C7D2FE" />
    <Circle cx="128" cy="84" r="3" fill="#312E81" />
  </Svg>
);

export const LoginScreen: React.FC = () => {
  const { loginWithCredentials, registerUser } = useApp();

  // Estados de navegación: 'splash' (Img 1) -> 'welcome' (Img 3) -> 'login' (Img 2) -> 'register'
  const [screenStep, setScreenStep] = useState<'splash' | 'welcome' | 'login' | 'register'>('splash');

  // Campos de Iniciar Sesión (Img 2)
  const [loginEmail, setLoginEmail] = useState<string>('');
  const [loginPassword, setLoginPassword] = useState<string>('');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loginLoading, setLoginLoading] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Campos de Crear Cuenta
  const [regName, setRegName] = useState<string>('');
  const [regEmail, setRegEmail] = useState<string>('');
  const [regPassword, setRegPassword] = useState<string>('');
  const [regCi, setRegCi] = useState<string>('');
  const [regPhone, setRegPhone] = useState<string>('');
  const [regZone, setRegZone] = useState<string>('Zona Sur - Los Pinos');
  const [regRole, setRegRole] = useState<UserRole>('client');
  const [regLoading, setRegLoading] = useState<boolean>(false);

  // Manejar Login
  const handleLoginSubmit = async () => {
    setErrorMessage(null);
    if (!loginEmail.trim()) {
      setErrorMessage('Por favor ingresa tu correo electrónico.');
      return;
    }
    if (!loginPassword) {
      setErrorMessage('Por favor ingresa tu contraseña.');
      return;
    }

    setLoginLoading(true);
    try {
      const res = await loginWithCredentials(loginEmail.trim(), loginPassword);
      if (!res.success) {
        setErrorMessage(res.error || 'Credenciales inválidas.');
      }
    } catch {
      setErrorMessage('Error al verificar credenciales.');
    } finally {
      setLoginLoading(false);
    }
  };

  // Manejar Registro
  const handleRegisterSubmit = async () => {
    if (!regName.trim() || !regEmail.trim() || !regPassword.trim() || !regCi.trim()) {
      Alert.alert('Datos requeridos', 'Por favor llena nombre, correo, contraseña y CI.');
      return;
    }

    setRegLoading(true);
    try {
      await registerUser({
        full_name: regName.trim(),
        email: regEmail.trim(),
        password: regPassword.trim(),
        ci: regCi.trim(),
        phone: regPhone.trim() || '71234567',
        zone: regZone,
        role: regRole,
      });
      Alert.alert('¡Cuenta Creada!', `Bienvenido a GarrafaYa, ${regName}.`);
    } catch {
      Alert.alert('Error', 'No se pudo registrar la cuenta.');
    } finally {
      setRegLoading(false);
    }
  };

  // =========================================================================
  // VISTA 1: SPLASH SCREEN (Fiel a la Imagen 1)
  // =========================================================================
  if (screenStep === 'splash') {
    const splashContent = (
      <Pressable style={styles.splashContainer} onPress={() => setScreenStep('welcome')}>
        <View style={styles.splashCenter}>
          {/* Ícono amarillo cuadrado redondeado con cilindro */}
          <View style={styles.splashYellowIcon}>
            <SvgIcon name="cylinder" size={44} color="#1E254A" />
          </View>
          <Text style={styles.splashTitle}>GarrafaYa</Text>
          <Text style={styles.splashSubtitle}>
            Tu garrafa más cerca, justo cuando la necesitás.
          </Text>
        </View>

        <View style={styles.splashBottomPrompt}>
          <Text style={styles.splashPromptText}>Toca en cualquier parte para continuar</Text>
        </View>
      </Pressable>
    );

    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDesktopWrapper}>
          <View style={styles.webPhoneFrame}>{splashContent}</View>
        </View>
      );
    }
    return splashContent;
  }

  // =========================================================================
  // VISTA 2: BIENVENIDA / ONBOARDING (Fiel a la Imagen 3)
  // =========================================================================
  if (screenStep === 'welcome') {
    const welcomeContent = (
      <View style={styles.welcomeContainer}>
        {/* Encabezado superior: Logo "Garrafa Ya" */}
        <View style={styles.welcomeHeader}>
          <View style={styles.welcomeMiniIcon}>
            <SvgIcon name="cylinder" size={16} color="#1E254A" />
          </View>
          <Text style={styles.welcomeBrand}>
            Garrafa <Text style={{ color: '#2563EB' }}>Ya</Text>
          </Text>
        </View>

        {/* Tarjeta con ilustración del camión */}
        <View style={styles.welcomeIllustrationCard}>
          <WelcomeTruckSvg />
        </View>

        {/* Texto descriptivo */}
        <View style={styles.welcomeContent}>
          <Text style={styles.welcomeTitle}>Encontrá la garrafa que viene hacia vos</Text>
          <Text style={styles.welcomeSubtitle}>
            Ingresá para ver repartidores cercanos, disponibilidad y tiempos de llegada en tu zona.
          </Text>
        </View>

        {/* Acciones inferiores */}
        <View style={styles.welcomeActions}>
          <Pressable
            style={styles.welcomePrimaryBtn}
            onPress={() => setScreenStep('login')}
          >
            <Text style={styles.welcomePrimaryBtnText}>Iniciar sesión</Text>
          </Pressable>

          <Text style={styles.privacyText}>
            Al continuar, aceptás nuestros Términos y Política de privacidad.
          </Text>
        </View>
      </View>
    );

    if (Platform.OS === 'web') {
      return (
        <View style={styles.webDesktopWrapper}>
          <View style={styles.webPhoneFrame}>{welcomeContent}</View>
        </View>
      );
    }
    return welcomeContent;
  }

  // =========================================================================
  // VISTA 3: INICIAR SESIÓN (Fiel a la Imagen 2) Y CREAR CUENTA
  // =========================================================================
  const authFormContent = (
    <ScrollView
      style={styles.authContainer}
      contentContainerStyle={styles.authScrollContent}
      showsVerticalScrollIndicator={false}
    >
      {/* Botón de volver a la pantalla de bienvenida */}
      <Pressable
        style={styles.backBtn}
        onPress={() => setScreenStep(screenStep === 'register' ? 'login' : 'welcome')}
      >
        <SvgIcon name="chevronLeft" size={20} color="#64748B" />
        <Text style={styles.backBtnText}>Volver</Text>
      </Pressable>

      {/* Título de Marca GarrafaYa */}
      <View style={styles.authHeader}>
        <Text style={styles.authTitle}>GarrafaYa</Text>
        <Text style={styles.authSubtitle}>
          {screenStep === 'login' ? 'Pide tus garrafas de forma fácil' : 'Crea tu cuenta oficial en La Paz'}
        </Text>
      </View>

      {/* MENSAJE DE ERROR SI EXISTE */}
      {errorMessage && (
        <View style={styles.errorBanner}>
          <SvgIcon name="alertTriangle" size={16} color="#DC2626" />
          <Text style={styles.errorBannerText}>{errorMessage}</Text>
        </View>
      )}

      {/* FORMULARIO DE INICIAR SESIÓN (IMAGEN 2) */}
      {screenStep === 'login' ? (
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico</Text>
            <TextInput
              style={styles.textInput}
              placeholder="tu@correo.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={loginEmail}
              onChangeText={(t) => {
                setLoginEmail(t);
                setErrorMessage(null);
              }}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <View style={styles.passwordContainer}>
              <TextInput
                style={styles.passwordInput}
                placeholder="••••••••"
                placeholderTextColor="#94A3B8"
                secureTextEntry={!showPassword}
                value={loginPassword}
                onChangeText={(t) => {
                  setLoginPassword(t);
                  setErrorMessage(null);
                }}
              />
              <Pressable
                style={styles.eyeBtn}
                onPress={() => setShowPassword(!showPassword)}
              >
                <SvgIcon name="eye" size={18} color="#64748B" />
              </Pressable>
            </View>
          </View>

          {/* Botón Principal: Iniciar sesión */}
          <Pressable
            style={[styles.primaryNavyBtn, loginLoading && { opacity: 0.7 }]}
            onPress={handleLoginSubmit}
            disabled={loginLoading}
          >
            <Text style={styles.primaryNavyBtnText}>
              {loginLoading ? 'Iniciando sesión...' : 'Iniciar sesión'}
            </Text>
          </Pressable>

          {/* Botón Secundario: Crear cuenta */}
          <Pressable
            style={styles.secondaryOutlinedBtn}
            onPress={() => {
              setErrorMessage(null);
              setScreenStep('register');
            }}
          >
            <Text style={styles.secondaryOutlinedBtnText}>Crear cuenta</Text>
          </Pressable>
        </View>
      ) : (
        /* FORMULARIO DE CREAR CUENTA */
        <View style={styles.formCard}>
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Nombre y Apellidos</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Ej. Juan Pérez"
              placeholderTextColor="#94A3B8"
              value={regName}
              onChangeText={setRegName}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Correo electrónico (Gmail)</Text>
            <TextInput
              style={styles.textInput}
              placeholder="tu@gmail.com"
              placeholderTextColor="#94A3B8"
              autoCapitalize="none"
              keyboardType="email-address"
              value={regEmail}
              onChangeText={setRegEmail}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Contraseña</Text>
            <TextInput
              style={styles.textInput}
              placeholder="Crea una contraseña segura"
              placeholderTextColor="#94A3B8"
              secureTextEntry
              value={regPassword}
              onChangeText={setRegPassword}
            />
          </View>

          <View style={styles.inputRow}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Carnet de Identidad</Text>
              <TextInput
                style={styles.textInput}
                placeholder="Ej. 8765432 LP"
                placeholderTextColor="#94A3B8"
                value={regCi}
                onChangeText={setRegCi}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.inputLabel}>Teléfono / WhatsApp</Text>
              <TextInput
                style={styles.textInput}
                placeholder="71234567"
                placeholderTextColor="#94A3B8"
                keyboardType="phone-pad"
                value={regPhone}
                onChangeText={setRegPhone}
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Zona de La Paz</Text>
            <View style={styles.zoneSelectorRow}>
              {['Zona Sur - Los Pinos', 'Obrajes', 'Miraflores', 'San Pedro', 'Villa Fátima', 'El Alto'].map((z) => (
                <Pressable
                  key={z}
                  style={[styles.zoneChip, regZone === z && styles.zoneChipActive]}
                  onPress={() => setRegZone(z)}
                >
                  <Text style={[styles.zoneChipText, regZone === z && styles.zoneChipTextActive]}>
                    {z}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>Tipo de Cuenta (Rol)</Text>
            <View style={styles.roleSelectorRow}>
              <Pressable
                style={[styles.roleSelectBtn, regRole === 'client' && styles.roleSelectBtnActive]}
                onPress={() => setRegRole('client')}
              >
                <Text style={[styles.roleSelectBtnText, regRole === 'client' && styles.roleSelectBtnTextActive]}>
                  Cliente (Vecino)
                </Text>
              </Pressable>

              <Pressable
                style={[styles.roleSelectBtn, regRole === 'driver' && styles.roleSelectBtnActive]}
                onPress={() => setRegRole('driver')}
              >
                <Text style={[styles.roleSelectBtnText, regRole === 'driver' && styles.roleSelectBtnTextActive]}>
                  Chofer (Distribuidor)
                </Text>
              </Pressable>

              <Pressable
                style={[styles.roleSelectBtn, regRole === 'admin' && styles.roleSelectBtnActive]}
                onPress={() => setRegRole('admin')}
              >
                <Text style={[styles.roleSelectBtnText, regRole === 'admin' && styles.roleSelectBtnTextActive]}>
                  Administrador
                </Text>
              </Pressable>
            </View>
          </View>

          {/* Botón de Confirmar Registro */}
          <Pressable
            style={[styles.primaryNavyBtn, regLoading && { opacity: 0.7 }]}
            onPress={handleRegisterSubmit}
            disabled={regLoading}
          >
            <Text style={styles.primaryNavyBtnText}>
              {regLoading ? 'Registrando en base de datos...' : 'Registrarme e Iniciar Sesión'}
            </Text>
          </Pressable>

          <Pressable
            style={styles.secondaryOutlinedBtn}
            onPress={() => setScreenStep('login')}
          >
            <Text style={styles.secondaryOutlinedBtnText}>Ya tengo cuenta (Iniciar sesión)</Text>
          </Pressable>
        </View>
      )}
    </ScrollView>
  );

  if (Platform.OS === 'web') {
    return (
      <View style={styles.webDesktopWrapper}>
        <View style={styles.webPhoneFrame}>{authFormContent}</View>
      </View>
    );
  }

  return authFormContent;
};

const styles = StyleSheet.create({
  // Envoltorio para vista Web de escritorio centrado tipo Smartphone
  webDesktopWrapper: {
    flex: 1,
    backgroundColor: '#070C18',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: '100vh',
  },
  webPhoneFrame: {
    width: '100%',
    maxWidth: 440,
    height: '100vh',
    maxHeight: 880,
    backgroundColor: '#FFFFFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.45,
    shadowRadius: 28,
    elevation: 20,
    borderRadius: Platform.OS === 'web' ? 24 : 0,
    overflow: 'hidden',
  },

  // =========================================================================
  // ESTILOS SPLASH SCREEN (IMAGEN 1)
  // =========================================================================
  splashContainer: {
    flex: 1,
    backgroundColor: '#3B5AFE',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: Spacing.xl,
  },
  splashCenter: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
  },
  splashYellowIcon: {
    width: 96,
    height: 96,
    borderRadius: 26,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 8,
  },
  splashTitle: {
    fontSize: 34,
    fontWeight: '800',
    color: '#FFFFFF',
    marginTop: 22,
    letterSpacing: -0.5,
  },
  splashSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.88)',
    textAlign: 'center',
    marginTop: 10,
    lineHeight: 24,
    maxWidth: 290,
  },
  splashBottomPrompt: {
    paddingBottom: Spacing.xl,
  },
  splashPromptText: {
    fontSize: 13,
    color: 'rgba(255, 255, 255, 0.6)',
    letterSpacing: 0.2,
  },

  // =========================================================================
  // ESTILOS BIENVENIDA (IMAGEN 3)
  // =========================================================================
  welcomeContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.xl,
    paddingBottom: Spacing.lg,
    justifyContent: 'space-between',
  },
  welcomeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  welcomeMiniIcon: {
    width: 28,
    height: 28,
    borderRadius: 8,
    backgroundColor: '#FBBF24',
    justifyContent: 'center',
    alignItems: 'center',
  },
  welcomeBrand: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  welcomeIllustrationCard: {
    backgroundColor: '#EEF2FF',
    borderRadius: 24,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: Spacing.md,
  },
  welcomeContent: {
    marginVertical: Spacing.md,
  },
  welcomeTitle: {
    fontSize: 27,
    fontWeight: '800',
    color: '#1E254A',
    lineHeight: 33,
    letterSpacing: -0.5,
  },
  welcomeSubtitle: {
    fontSize: 15,
    color: '#64748B',
    lineHeight: 22,
    marginTop: 10,
  },
  welcomeActions: {
    gap: 12,
  },
  welcomePrimaryBtn: {
    backgroundColor: '#1E254A',
    borderRadius: 12,
    height: 52,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#1E254A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  welcomePrimaryBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  privacyText: {
    fontSize: 11,
    color: '#94A3B8',
    textAlign: 'center',
    lineHeight: 16,
  },

  // =========================================================================
  // ESTILOS FORMULARIO LOGIN (IMAGEN 2) Y REGISTRO
  // =========================================================================
  authContainer: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  authScrollContent: {
    paddingHorizontal: Spacing.lg,
    paddingTop: Spacing.lg,
    paddingBottom: Spacing.xl,
  },
  backBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    marginBottom: Spacing.md,
    paddingVertical: 4,
  },
  backBtnText: {
    fontSize: 14,
    color: '#64748B',
    fontWeight: '600',
  },
  authHeader: {
    alignItems: 'center',
    marginBottom: Spacing.lg,
  },
  authTitle: {
    fontSize: 32,
    fontWeight: '800',
    color: '#2563EB',
    letterSpacing: -0.5,
  },
  authSubtitle: {
    fontSize: 15,
    color: '#64748B',
    marginTop: 4,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#FEE2E2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    borderRadius: Radius.md,
    padding: Spacing.sm,
    marginBottom: Spacing.md,
  },
  errorBannerText: {
    color: '#DC2626',
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
  formCard: {
    gap: 16,
  },
  inputGroup: {
    gap: 6,
  },
  inputRow: {
    flexDirection: 'row',
    gap: 12,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E254A',
  },
  textInput: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: Spacing.md,
    fontSize: 15,
    color: '#0F172A',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    height: 48,
    paddingHorizontal: Spacing.md,
  },
  passwordInput: {
    flex: 1,
    fontSize: 15,
    color: '#0F172A',
  },
  eyeBtn: {
    padding: Spacing.xs,
  },
  primaryNavyBtn: {
    backgroundColor: '#1E254A',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#1E254A',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 3,
  },
  primaryNavyBtnText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  secondaryOutlinedBtn: {
    backgroundColor: '#FFFFFF',
    borderWidth: 1.5,
    borderColor: '#1E254A',
    borderRadius: 12,
    height: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondaryOutlinedBtnText: {
    color: '#1E254A',
    fontSize: 16,
    fontWeight: '700',
  },
  zoneSelectorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  zoneChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  zoneChipActive: {
    backgroundColor: '#2563EB',
    borderColor: '#2563EB',
  },
  zoneChipText: {
    fontSize: 12,
    color: '#475569',
    fontWeight: '600',
  },
  zoneChipTextActive: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  roleSelectorRow: {
    flexDirection: 'row',
    gap: 8,
  },
  roleSelectBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: Radius.md,
    backgroundColor: '#F1F5F9',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  roleSelectBtnActive: {
    backgroundColor: '#1E254A',
    borderColor: '#1E254A',
  },
  roleSelectBtnText: {
    fontSize: 11,
    color: '#475569',
    fontWeight: '700',
    textAlign: 'center',
  },
  roleSelectBtnTextActive: {
    color: '#FFFFFF',
  },
});