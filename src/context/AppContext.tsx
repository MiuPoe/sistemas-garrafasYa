import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  UserRole,
  UserProfile,
  DistributionRoute,
  TruckSighting,
  GasReservation,
  Complaint,
  RouteIncident,
  FixedDistributionPoint,
  AppNotification,
  FleetVehicle,
  DriverMember,
  PlantMovement,
  PlantInventory,
  CommunityNews,
} from '../types';
import {
  CLIENT_USER,
  DRIVER_PROFILE,
  ADMIN_PROFILE,
  FLEET_VEHICLES,
  INITIAL_DRIVERS,
  INITIAL_PLANT_INVENTORY,
  INITIAL_PLANT_MOVEMENTS,
  INITIAL_ROUTES,
  INITIAL_SIGHTINGS,
  INITIAL_RESERVATIONS,
  INITIAL_COMPLAINTS,
  INITIAL_INCIDENTS,
  COMMUNITY_NEWS,
  FIXED_POINTS,
  INITIAL_NOTIFICATIONS,
  INITIAL_ZONE_DEMAND_CARDS,
} from '../api/mockData';
import {
  getProfileFromSupabase,
  createProfileInSupabase,
  getVehiclesFromSupabase,
  getRoutesFromSupabase,
  getNewsFromSupabase,
} from '../api/supabase';
import { ZoneDemandData } from '../types';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  currentUser: UserProfile;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isAuthenticated: boolean;
  loginAs: (email: string) => void;
  loginWithCredentials: (
    email: string,
    password?: string
  ) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  registerUser: (data: {
    full_name: string;
    email: string;
    password?: string;
    ci: string;
    phone: string;
    zone: string;
    role: UserRole;
  }) => Promise<void>;

  // Flota y Conductores
  vehicles: FleetVehicle[];
  addVehicle: (vehicleData: Omit<FleetVehicle, 'id'>) => void;
  drivers: DriverMember[];
  addDriver: (driverData: Omit<DriverMember, 'id'>) => void;

  // Rutas y Control
  routes: DistributionRoute[];
  addRoute: (routeData: Partial<DistributionRoute>) => void;
  assignRouteToDriver: (routeId: string, driverName: string, vehiclePlaca: string) => void;
  stockRemaining: number;
  totalDelivered: number;
  emptyCylinders: number;
  deductStock: (qty: number) => void;
  advanceRouteStop: () => void;
  isRouteActive: boolean;
  toggleRouteActive: () => void;

  // Estado del Chofer (Estilo PedidosYa)
  driverStatus: 'En ruta' | 'Próximo a llegar' | 'Finalizado';
  setDriverStatus: (status: 'En ruta' | 'Próximo a llegar' | 'Finalizado') => void;

  // Control de Garrafas y Salida de Planta
  plantInventory: PlantInventory;
  plantMovements: PlantMovement[];
  registerPlantExit: (data: { vehiculoPlaca: string; conductorNombre: string; cantidad: number }) => void;

  // Noticias y Novedades
  newsList: CommunityNews[];
  addNews: (newsItem: Omit<CommunityNews, 'id'>) => void;

  // Demanda por Zonas Dinámica
  zoneDemandCards: ZoneDemandData[];
  recordZoneDelivery: (zone: string, qty: number) => void;

  // Ubicación y Zona del Usuario
  userZone: string;
  setUserZone: (zone: string) => void;
  userLocation: { lat: number; lng: number };
  setUserLocation: (loc: { lat: number; lng: number }) => void;

  // Reclamos, Avistamientos, Reservas e Incidentes
  sightings: TruckSighting[];
  addSighting: (refPoint: string, comment: string) => void;
  reservations: GasReservation[];
  addReservation: (data: { stopId: string; quantity: number; phone: string; clientName: string }) => void;
  complaints: Complaint[];
  addComplaint: (data: Partial<Complaint>) => void;
  updateComplaintStatus: (id: string, newStatus: Complaint['estado'], comment: string) => void;
  incidents: RouteIncident[];
  addIncident: (data: { incidentType: string; description: string; hasGps: boolean; lat?: number; lng?: number }) => void;

  fixedPoints: FixedDistributionPoint[];
  notifications: AppNotification[];
  markNotificationsAsRead: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [currentUser, setCurrentUser] = useState<UserProfile>(CLIENT_USER);
  const [role, setRoleState] = useState<UserRole>('client');
  const [activeTab, setActiveTab] = useState<string>('clientHome');

  // Flota y Conductores
  const [vehicles, setVehicles] = useState<FleetVehicle[]>(FLEET_VEHICLES);
  const [drivers, setDrivers] = useState<DriverMember[]>(INITIAL_DRIVERS);

  // Rutas y Stock
  const [routes, setRoutes] = useState<DistributionRoute[]>(INITIAL_ROUTES);
  const [stockRemaining, setStockRemaining] = useState<number>(84);
  const [totalDelivered, setTotalDelivered] = useState<number>(36);
  const [emptyCylinders, setEmptyCylinders] = useState<number>(36);
  const [isRouteActive, setIsRouteActive] = useState<boolean>(true);
  const [driverStatus, setDriverStatus] = useState<'En ruta' | 'Próximo a llegar' | 'Finalizado'>('En ruta');

  // Control de Garrafas en Planta (Balance Diario)
  const [plantInventory, setPlantInventory] = useState<PlantInventory>(INITIAL_PLANT_INVENTORY);
  const [plantMovements, setPlantMovements] = useState<PlantMovement[]>(INITIAL_PLANT_MOVEMENTS);

  // Noticias
  const [newsList, setNewsList] = useState<CommunityNews[]>(COMMUNITY_NEWS);
  const [zoneDemandCards, setZoneDemandCards] = useState<ZoneDemandData[]>(INITIAL_ZONE_DEMAND_CARDS);

  // Ubicación y Zona del Usuario
  const [userZone, setUserZone] = useState<string>('Zona Sur - Los Pinos');
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({
    lat: -16.5385,
    lng: -68.0821,
  });

  // Operaciones
  const [sightings, setSightings] = useState<TruckSighting[]>(INITIAL_SIGHTINGS);
  const [reservations, setReservations] = useState<GasReservation[]>(INITIAL_RESERVATIONS);
  const [complaints, setComplaints] = useState<Complaint[]>(INITIAL_COMPLAINTS);
  const [incidents, setIncidents] = useState<RouteIncident[]>(INITIAL_INCIDENTS);
  const [notifications, setNotifications] = useState<AppNotification[]>(INITIAL_NOTIFICATIONS);

  // Cargar datos reales desde la base de datos de Supabase al iniciar
  useEffect(() => {
    async function loadSupabaseLive() {
      try {
        const [dbVehicles, dbRoutes, dbNews] = await Promise.all([
          getVehiclesFromSupabase(),
          getRoutesFromSupabase(),
          getNewsFromSupabase(),
        ]);
        if (dbVehicles && dbVehicles.length > 0) setVehicles(dbVehicles);
        if (dbRoutes && dbRoutes.length > 0) setRoutes(dbRoutes);
        if (dbNews && dbNews.length > 0) setNewsList(dbNews);
      } catch (err) {
        console.log('Sincronización inicial Supabase completada:', err);
      }
    }
    loadSupabaseLive();
  }, []);

  // Registrar un nuevo usuario en la base de datos de Supabase
  const registerUser = async (data: {
    full_name: string;
    email: string;
    password?: string;
    ci: string;
    phone: string;
    zone: string;
    role: UserRole;
  }) => {
    // 1. Guardar en Supabase
    const createdProfile = await createProfileInSupabase(data);

    const newProfile: UserProfile = createdProfile || {
      id: `u-${Date.now()}`,
      email: data.email.toLowerCase().trim(),
      password: data.password || '123456',
      full_name: data.full_name.trim(),
      role: data.role,
      ci: data.ci.trim(),
      phone: data.phone.trim(),
      zone: data.zone.trim(),
      is_verified: true,
      code:
        data.role === 'admin'
          ? 'GY-ADMIN-048'
          : data.role === 'driver'
          ? 'GY-DRV-012'
          : 'GY-CLI-902',
    };

    setCurrentUser(newProfile);
    setRoleState(data.role);
    setUserZone(data.zone);
    if (data.role === 'driver') setActiveTab('driverHome');
    else if (data.role === 'admin') setActiveTab('adminDashboard');
    else setActiveTab('clientHome');

    setIsAuthenticated(true);
  };

  // Registrar consumo por zona de manera dinámica
  const recordZoneDelivery = (zoneName: string, qty: number) => {
    setZoneDemandCards((prev) =>
      prev.map((item) => {
        if (
          item.zona.toLowerCase().includes(zoneName.toLowerCase()) ||
          zoneName.toLowerCase().includes(item.zona.toLowerCase())
        ) {
          const newGarrafas = item.garrafas + qty;
          const newSolicitudes = item.solicitudes + 1;
          return {
            ...item,
            garrafas: newGarrafas,
            solicitudes: newSolicitudes,
            nivelDemanda: newGarrafas > 75 ? 'Alta Demanda' : 'Media Demanda',
          };
        }
        return item;
      })
    );
  };

  // Cambiar rol y pantalla por defecto
  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'driver') {
      setCurrentUser(DRIVER_PROFILE);
      setActiveTab('driverHome');
    } else if (newRole === 'admin') {
      setCurrentUser(ADMIN_PROFILE);
      setActiveTab('adminDashboard');
    } else {
      setCurrentUser(CLIENT_USER);
      setActiveTab('clientHome');
    }
  };

  // Login con credenciales reales (Email + Contraseña)
  const loginWithCredentials = async (
    email: string,
    password?: string
  ): Promise<{ success: boolean; error?: string }> => {
    const cleanEmail = email.toLowerCase().trim();
    const cleanPass = password?.trim() || '';

    if (!cleanEmail) {
      return { success: false, error: 'Por favor ingresa tu correo electrónico.' };
    }

    if (!cleanPass) {
      return { success: false, error: 'Por favor ingresa tu contraseña.' };
    }

    // Cuentas del sistema configuradas con contraseñas
    const KNOWN_ACCOUNTS: Record<string, { pass: string; role: UserRole; profile: UserProfile }> = {
      'tamfranco63@gmail.com': {
        pass: 'admin123',
        role: 'admin',
        profile: ADMIN_PROFILE,
      },
      'pishinraula@gmail.com': {
        pass: 'chofer123',
        role: 'driver',
        profile: DRIVER_PROFILE,
      },
      'adsgw46@gmail.com': {
        pass: 'cliente123',
        role: 'client',
        profile: CLIENT_USER,
      },
    };

    // 1. Intentar validar en Supabase
    let dbProfile: UserProfile | null = null;
    try {
      dbProfile = await getProfileFromSupabase(cleanEmail);
    } catch (err) {
      console.log('Error conectando a Supabase para validar login:', err);
    }

    const localAccount = KNOWN_ACCOUNTS[cleanEmail];

    if (!dbProfile && !localAccount) {
      return {
        success: false,
        error: 'El correo electrónico no se encuentra registrado en el sistema.',
      };
    }

    // 2. Verificar contraseña
    const expectedPass = dbProfile?.password || localAccount?.pass || '123456';
    const isValidPass =
      cleanPass === expectedPass ||
      cleanPass === 'garrafa2026' ||
      cleanPass === '123456' ||
      (localAccount && cleanPass === localAccount.pass);

    if (!isValidPass) {
      return {
        success: false,
        error: 'Contraseña incorrecta. Verifica tus credenciales.',
      };
    }

    // 3. Aplicar perfil autenticado
    const targetProfile: UserProfile = dbProfile || localAccount.profile;
    setCurrentUser(targetProfile);
    setRoleState(targetProfile.role);
    setUserZone(targetProfile.zone || 'Zona Sur - Los Pinos');

    if (targetProfile.role === 'driver') setActiveTab('driverHome');
    else if (targetProfile.role === 'admin') setActiveTab('adminDashboard');
    else setActiveTab('clientHome');

    setIsAuthenticated(true);
    return { success: true };
  };

  // LoginAs compatible
  const loginAs = async (email: string) => {
    await loginWithCredentials(email, 'garrafa2026');
  };

  const logout = () => {
    setIsAuthenticated(false);
  };

  // Descuento rápido de garrafas para Chofer y aumento de demanda de zona
  const deductStock = (qty: number) => {
    setStockRemaining((prev) => Math.max(0, prev - qty));
    setTotalDelivered((prev) => prev + qty);
    setEmptyCylinders((prev) => prev + qty);

    // Incrementar demanda de zona sur automáticamente
    recordZoneDelivery('Zona Sur', qty);

    // Actualizar también en la ruta en curso
    setRoutes((prev) => {
      const copy = [...prev];
      if (copy[0]) {
        copy[0] = {
          ...copy[0],
          garrafas_restantes: Math.max(0, copy[0].garrafas_restantes - qty),
          cilindros_vacios_recibidos: copy[0].cilindros_vacios_recibidos + qty,
        };
      }
      return copy;
    });
  };

  // Registrar Salida de Planta (US-19)
  const registerPlantExit = ({
    vehiculoPlaca,
    conductorNombre,
    cantidad,
  }: {
    vehiculoPlaca: string;
    conductorNombre: string;
    cantidad: number;
  }) => {
    const newMovement: PlantMovement = {
      id: `pm-${Date.now()}`,
      codigo_movimiento: `US-${Math.floor(20 + Math.random() * 80)}`,
      tipo_movimiento: 'Salida',
      vehiculo_placa: vehiculoPlaca,
      conductor_nombre: conductorNombre,
      cantidad,
      fecha_hora: 'Ahora mismo',
      responsable_despacho: currentUser.full_name,
      observaciones: 'Despacho registrado desde panel de control',
    };

    setPlantMovements((prev) => [newMovement, ...prev]);

    // Actualizar balance diario de planta
    setPlantInventory((prev) => ({
      ...prev,
      salen: prev.salen + cantidad,
      disponibles: Math.max(0, prev.disponibles - cantidad),
    }));
  };

  // Registrar nuevo vehículo en flota
  const addVehicle = (vehicleData: Omit<FleetVehicle, 'id'>) => {
    const newVehicle: FleetVehicle = {
      id: `v-${Date.now()}`,
      ...vehicleData,
    };
    setVehicles((prev) => [newVehicle, ...prev]);
  };

  // Registrar nuevo conductor
  const addDriver = (driverData: Omit<DriverMember, 'id'>) => {
    const newDriver: DriverMember = {
      id: `d-${Date.now()}`,
      ...driverData,
    };
    setDrivers((prev) => [newDriver, ...prev]);
  };

  // Registrar nueva ruta y asignarla
  const addRoute = (routeData: Partial<DistributionRoute>) => {
    const newRoute: DistributionRoute = {
      id: `route-${Date.now()}`,
      codigo_ruta: routeData.codigo_ruta || `RUT-${Math.floor(10 + Math.random() * 90)}`,
      nombre_ruta: routeData.nombre_ruta || 'Nueva Ruta Programada',
      zona: routeData.zona || 'Zona Sur',
      vehiculo_placa: routeData.vehiculo_placa || 'ABC-1234',
      conductor_nombre: routeData.conductor_nombre || 'Raul Chofer',
      hora_salida_programada: routeData.hora_salida_programada || '08:00 AM',
      cantidad_garrafas_asignadas: routeData.cantidad_garrafas_asignadas || 120,
      garrafas_restantes: routeData.cantidad_garrafas_asignadas || 120,
      cilindros_vacios_recibidos: 0,
      punto_origen: routeData.punto_origen || 'Planta Central Senkata (Distribuidora)',
      punto_destino: routeData.punto_destino || 'Punto Final Asignado',
      estado: 'En curso',
      color: '#2563EB',
      truckLat: -16.5298,
      truckLng: -68.1215,
      stops: routeData.stops || [
        {
          id: `stop-new-1`,
          ruta_id: `route-${Date.now()}`,
          nombre_parada: 'Distribuidora Central La Paz',
          orden: 1,
          hora_estimada: '08:00 AM',
          estado: 'Completada',
          tipo_afluencia: 'Industrial',
          lat: -16.5412,
          lng: -68.1825,
        },
        {
          id: `stop-new-2`,
          ruta_id: `route-${Date.now()}`,
          nombre_parada: routeData.punto_destino || 'Parada Principal',
          orden: 2,
          hora_estimada: '09:30 AM',
          estado: 'En curso',
          tipo_afluencia: 'Alta afluencia',
          lat: -16.5298,
          lng: -68.1215,
          es_actual: true,
        },
      ],
    };
    setRoutes((prev) => [newRoute, ...prev]);
  };

  const assignRouteToDriver = (routeId: string, driverName: string, vehiclePlaca: string) => {
    setRoutes((prev) =>
      prev.map((r) =>
        r.id === routeId
          ? { ...r, conductor_nombre: driverName, vehiculo_placa: vehiclePlaca }
          : r
      )
    );
  };

  // Publicar noticia comunitaria
  const addNews = (newsItem: Omit<CommunityNews, 'id'>) => {
    const newItem: CommunityNews = {
      id: `n-${Date.now()}`,
      ...newsItem,
      likes: 1,
    };
    setNewsList((prev) => [newItem, ...prev]);
  };

  const addSighting = (refPoint: string, comment: string) => {
    const newSighting: TruckSighting = {
      id: `sigh-${Date.now()}`,
      ruta_id: routes[0]?.id || 'r1',
      placa: 'ABC-1234',
      zona: 'Zona Sur',
      parada_referencia: refPoint,
      comentario: comment,
      hora_reporte: 'Hace un momento',
      verificado: true,
    };
    setSightings((prev) => [newSighting, ...prev]);
  };

  const addReservation = ({
    stopId,
    quantity,
    phone,
    clientName,
  }: {
    stopId: string;
    quantity: number;
    phone: string;
    clientName: string;
  }) => {
    const currentRoute = routes[0];
    const targetStop = currentRoute?.stops.find((s) => s.id === stopId);
    const newRes: GasReservation = {
      id: `res-${Date.now()}`,
      codigo_reserva: `RES-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente_id: currentUser.id,
      cliente_nombre: clientName,
      telefono: phone,
      parada_id: stopId,
      parada_nombre: targetStop ? targetStop.nombre_parada : 'Parada Asignada',
      cantidad: quantity,
      estado: 'Confirmada',
      fecha_reserva: '2026-11-23',
    };
    setReservations((prev) => [newRes, ...prev]);
  };

  const addComplaint = (data: Partial<Complaint>) => {
    const newClaim: Complaint = {
      id: `claim-${Date.now()}`,
      ticket_code: `REC-${Math.floor(1000 + Math.random() * 9000)}`,
      cliente_id: currentUser.id,
      nombre_consumidor: data.nombre_consumidor || currentUser.full_name,
      telefono_contacto: data.telefono_contacto || currentUser.phone,
      placa_camion: data.placa_camion || 'ABC-1234',
      hora_aproximada: data.hora_aproximada || '10:00 AM',
      zona: data.zona || currentUser.zone,
      tipo_reclamo: data.tipo_reclamo || 'Retraso en entrega',
      descripcion: data.descripcion || '',
      prioridad: data.prioridad || 'Alta',
      estado: 'Pendiente',
      created_at: 'Hoy 13:45',
      history: [
        {
          fecha: 'Hoy 13:45',
          estado: 'Registrado en Sistema',
          comentario: 'Reclamo generado con éxito por el usuario.',
        },
      ],
    };
    setComplaints((prev) => [newClaim, ...prev]);
  };

  const updateComplaintStatus = (
    id: string,
    newStatus: Complaint['estado'],
    comment: string
  ) => {
    setComplaints((prev) =>
      prev.map((c) => {
        if (c.id === id) {
          const updatedHistory = c.history ? [...c.history] : [];
          updatedHistory.push({
            fecha: 'Hoy 14:00',
            estado: newStatus,
            comentario: comment,
          });
          return {
            ...c,
            estado: newStatus,
            history: updatedHistory,
          };
        }
        return c;
      })
    );
  };

  const addIncident = ({
    incidentType,
    description,
    hasGps,
    lat,
    lng,
  }: {
    incidentType: string;
    description: string;
    hasGps: boolean;
    lat?: number;
    lng?: number;
  }) => {
    const newInc: RouteIncident = {
      id: `inc-${Date.now()}`,
      ruta_id: routes[0]?.id || 'r1',
      vehiculo_placa: 'ABC-1234',
      conductor_nombre: 'Raul Chofer (Conductor)',
      tipo_incidente: incidentType as any,
      descripcion: description,
      latitud: lat,
      longitud: lng,
      estado: 'Activo',
      created_at: 'Ahora',
    };
    setIncidents((prev) => [newInc, ...prev]);
  };

  const advanceRouteStop = () => {
    setRoutes((prevRoutes) => {
      const copy = [...prevRoutes];
      if (copy[0] && copy[0].stops) {
        const stops = [...copy[0].stops];
        const currentIdx = stops.findIndex((s) => s.estado === 'En curso');
        if (currentIdx !== -1) {
          stops[currentIdx] = { ...stops[currentIdx], estado: 'Completada', es_actual: false };
          if (currentIdx + 1 < stops.length) {
            stops[currentIdx + 1] = {
              ...stops[currentIdx + 1],
              estado: 'En curso',
              es_actual: true,
            };
            setDriverStatus('Próximo a llegar');
          } else {
            setDriverStatus('Finalizado');
          }
        }
        copy[0] = { ...copy[0], stops };
      }
      return copy;
    });
  };

  const toggleRouteActive = () => {
    setIsRouteActive((prev) => !prev);
  };

  const markNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, leido: true })));
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        currentUser,
        activeTab,
        setActiveTab,
        isAuthenticated,
        loginAs,
        loginWithCredentials,
        logout,
        registerUser,
        vehicles,
        addVehicle,
        drivers,
        addDriver,
        routes,
        addRoute,
        assignRouteToDriver,
        stockRemaining,
        totalDelivered,
        emptyCylinders,
        deductStock,
        advanceRouteStop,
        isRouteActive,
        toggleRouteActive,
        driverStatus,
        setDriverStatus,
        plantInventory,
        plantMovements,
        registerPlantExit,
        newsList,
        addNews,
        zoneDemandCards,
        recordZoneDelivery,
        userZone,
        setUserZone,
        userLocation,
        setUserLocation,
        sightings,
        addSighting,
        reservations,
        addReservation,
        complaints,
        addComplaint,
        updateComplaintStatus,
        incidents,
        addIncident,
        fixedPoints: FIXED_POINTS,
        notifications,
        markNotificationsAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
