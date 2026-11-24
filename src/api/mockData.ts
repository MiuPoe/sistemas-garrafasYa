import {
  DistributionRoute,
  FixedDistributionPoint,
  Complaint,
  RouteIncident,
  CommunityNews,
  AppNotification,
  UserProfile,
  GasReservation,
  TruckSighting,
  FleetVehicle,
  DriverMember,
  PlantMovement,
  PlantInventory,
  ZoneDemandStat,
  ZoneDemandData,
} from '../types';

// Cuentas oficiales solicitadas por el usuario
export const CLIENT_USER: UserProfile = {
  id: 'c0000000-0000-0000-0000-000000000004',
  email: 'adsgw46@gmail.com',
  full_name: 'Cliente Vecino (La Paz)',
  role: 'client',
  ci: '8765432 LP',
  phone: '71234567',
  zone: 'Zona Sur - Los Pinos',
  address: 'Calle 25 de Los Pinos, Edif. Illimani #4B',
  code: 'GY-CLI-902',
  is_verified: true,
};

export const DRIVER_PROFILE: UserProfile = {
  id: 'b0000000-0000-0000-0000-000000000002',
  email: 'pishinraula@gmail.com',
  full_name: 'Raul Chofer (Conductor)',
  role: 'driver',
  ci: '4588921 LP',
  phone: '76543210',
  zone: 'Zona Sur - La Paz',
  code: 'GY-DRV-012',
  is_verified: true,
};

export const ADMIN_PROFILE: UserProfile = {
  id: 'a0000000-0000-0000-0000-000000000001',
  email: 'tamfranco63@gmail.com',
  full_name: 'Tamara Franco (Admin General)',
  role: 'admin',
  ci: '3344556 LP',
  phone: '70123456',
  zone: 'Central La Paz',
  code: 'GY-ADMIN-048',
  is_verified: true,
};

export const INITIAL_USER = CLIENT_USER;

// Flota de vehículos exacta de las capturas
export const FLEET_VEHICLES: FleetVehicle[] = [
  {
    id: 'v-1',
    placa: 'ABC-1234',
    modelo: 'Toyota Dyna',
    anio: 2022,
    capacidad_garrafas: 120,
    estado: 'En ruta',
    chofer_asignado: 'Raul Chofer (Conductor)',
  },
  {
    id: 'v-2',
    placa: 'XYZ-5678',
    modelo: 'Hino 300',
    anio: 2021,
    capacidad_garrafas: 100,
    estado: 'En ruta',
    chofer_asignado: 'Luis Fernández',
  },
  {
    id: 'v-3',
    placa: 'LPZ-2026',
    modelo: 'Isuzu NKR',
    anio: 2024,
    capacidad_garrafas: 140,
    estado: 'Descanso',
    chofer_asignado: 'Mario Rojas',
  },
  {
    id: 'v-4',
    placa: 'LPZ-1234',
    modelo: 'Volvo FL280',
    anio: 2023,
    capacidad_garrafas: 180,
    estado: 'En ruta',
    chofer_asignado: 'Juan Carlos Gómez',
  },
];

// Conductores registrados
export const INITIAL_DRIVERS: DriverMember[] = [
  {
    id: 'd-1',
    nombre: 'Raul Chofer (Conductor)',
    email: 'pishinraula@gmail.com',
    ci: '4588921 LP',
    telefono: '76543210',
    categoria_licencia: 'Profesional Categoría C',
    vehiculo_asignado: 'ABC-1234',
    estado: 'En ruta',
  },
  {
    id: 'd-2',
    nombre: 'Luis Fernández',
    email: 'l.fernandez@garrafasya.bo',
    ci: '5129843 LP',
    telefono: '72345678',
    categoria_licencia: 'Profesional Categoría C',
    vehiculo_asignado: 'XYZ-5678',
    estado: 'En ruta',
  },
  {
    id: 'd-3',
    nombre: 'Mario Rojas',
    email: 'm.rojas@garrafasya.bo',
    ci: '3920192 LP',
    telefono: '73456789',
    categoria_licencia: 'Profesional Categoría B',
    vehiculo_asignado: 'LPZ-2026',
    estado: 'Descanso',
  },
  {
    id: 'd-4',
    nombre: 'Juan Carlos Gómez',
    email: 'j.gomez@garrafasya.bo',
    ci: '4938210 LP',
    telefono: '74567890',
    categoria_licencia: 'Profesional Categoría C',
    vehiculo_asignado: 'LPZ-1234',
    estado: 'En ruta',
  },
];

// Inventario de Garrafas en Planta (Imagen 1)
export const INITIAL_PLANT_INVENTORY: PlantInventory = {
  ingresan: 300,
  salen: 128,
  retornan: 42,
  disponibles: 245,
};

// Historial de Movimientos de Planta
export const INITIAL_PLANT_MOVEMENTS: PlantMovement[] = [
  {
    id: 'pm-1',
    codigo_movimiento: 'US-19',
    tipo_movimiento: 'Salida',
    vehiculo_placa: 'LPZ-2026',
    conductor_nombre: 'Mario Rojas',
    cantidad: 45,
    fecha_hora: 'Hoy 09:30 AM',
    responsable_despacho: 'Tamara Franco (Admin)',
    observaciones: 'Despacho matutino Ruta Los Pinos',
  },
  {
    id: 'pm-2',
    codigo_movimiento: 'US-18',
    tipo_movimiento: 'Salida',
    vehiculo_placa: 'ABC-1234',
    conductor_nombre: 'Raul Chofer',
    cantidad: 45,
    fecha_hora: 'Hoy 08:15 AM',
    responsable_despacho: 'Tamara Franco (Admin)',
    observaciones: 'Salida programada Obrajes',
  },
  {
    id: 'pm-3',
    codigo_movimiento: 'UR-04',
    tipo_movimiento: 'Retorno',
    vehiculo_placa: 'XYZ-5678',
    conductor_nombre: 'Luis Fernández',
    cantidad: 42,
    fecha_hora: 'Hoy 08:00 AM',
    responsable_despacho: 'Tamara Franco (Admin)',
    observaciones: 'Cilindros vacíos para recarga',
  },
];

// Rutas de distribución con coordenadas reales en La Paz
export const INITIAL_ROUTES: DistributionRoute[] = [
  {
    id: 'e0000000-0000-0000-0000-000000000001',
    codigo_ruta: 'RUT-SUR-01',
    nombre_ruta: 'Ruta 1: Zona Sur (Obrajes - Los Pinos - Irpavi)',
    zona: 'Zona Sur',
    vehiculo_placa: 'ABC-1234',
    conductor_nombre: 'Raul Chofer (Conductor)',
    hora_salida_programada: '08:00 AM',
    cantidad_garrafas_asignadas: 120,
    garrafas_restantes: 84,
    cilindros_vacios_recibidos: 36,
    punto_origen: 'Planta Central Senkata (Distribuidora de Gas)',
    punto_destino: 'Calle 15 de Irpavi',
    estado: 'En curso',
    color: '#2563EB',
    truckLat: -16.5298,
    truckLng: -68.1215,
    stops: [
      {
        id: 'stop-1',
        ruta_id: 'e0000000-0000-0000-0000-000000000001',
        nombre_parada: 'Planta Central Senkata (Distribuidora)',
        orden: 1,
        hora_estimada: '08:00 AM',
        estado: 'Completada',
        tipo_afluencia: 'Industrial',
        lat: -16.5412,
        lng: -68.1825,
        notas: 'Salida de planta con precinto de seguridad ANH verificado',
      },
      {
        id: 'stop-2',
        ruta_id: 'e0000000-0000-0000-0000-000000000001',
        nombre_parada: 'Cruce Av. Petrolera / Obrajes Calle 14',
        orden: 2,
        hora_estimada: '09:15 AM',
        estado: 'En curso',
        tipo_afluencia: 'Alta afluencia',
        lat: -16.5298,
        lng: -68.1215,
        notas: 'Camión distribuyendo en este punto en tiempo real',
        es_actual: true,
      },
      {
        id: 'stop-3',
        ruta_id: 'e0000000-0000-0000-0000-000000000001',
        nombre_parada: 'Condominio Los Pinos / Plaza Central',
        orden: 3,
        hora_estimada: '10:00 AM',
        estado: 'Pendiente',
        tipo_afluencia: 'Residencial',
        lat: -16.5385,
        lng: -68.0821,
        notas: 'Parada vecinal programada con pre-reservas',
      },
      {
        id: 'stop-4',
        ruta_id: 'e0000000-0000-0000-0000-000000000001',
        nombre_parada: 'Calle 15 de Irpavi (Parada Final)',
        orden: 4,
        hora_estimada: '11:15 AM',
        estado: 'Pendiente',
        tipo_afluencia: 'Residencial',
        lat: -16.521,
        lng: -68.075,
        notas: 'Punto de cierre y consolidación de cilindros vacíos',
      },
    ],
  },
  {
    id: 'e0000000-0000-0000-0000-000000000002',
    codigo_ruta: 'RUT-NOR-02',
    nombre_ruta: 'Ruta 2: Zona Norte (Miraflores - Villa Fátima)',
    zona: 'Zona Norte',
    vehiculo_placa: 'XYZ-5678',
    conductor_nombre: 'Luis Fernández',
    hora_salida_programada: '08:30 AM',
    cantidad_garrafas_asignadas: 100,
    garrafas_restantes: 68,
    cilindros_vacios_recibidos: 32,
    punto_origen: 'Planta Central Senkata (Distribuidora de Gas)',
    punto_destino: 'Plaza del Maestro Villa Fátima',
    estado: 'En curso',
    color: '#059669',
    truckLat: -16.488,
    truckLng: -68.125,
    stops: [
      {
        id: 'stop-n1',
        ruta_id: 'e0000000-0000-0000-0000-000000000002',
        nombre_parada: 'Distribuidora Central La Paz',
        orden: 1,
        hora_estimada: '08:30 AM',
        estado: 'Completada',
        tipo_afluencia: 'Industrial',
        lat: -16.5412,
        lng: -68.1825,
      },
      {
        id: 'stop-n2',
        ruta_id: 'e0000000-0000-0000-0000-000000000002',
        nombre_parada: 'Plaza Triangular / Miraflores',
        orden: 2,
        hora_estimada: '09:45 AM',
        estado: 'En curso',
        tipo_afluencia: 'Alta afluencia',
        lat: -16.4998,
        lng: -68.1225,
        es_actual: true,
      },
      {
        id: 'stop-n3',
        ruta_id: 'e0000000-0000-0000-0000-000000000002',
        nombre_parada: 'Plaza del Maestro / Villa Fátima',
        orden: 3,
        hora_estimada: '10:45 AM',
        estado: 'Pendiente',
        tipo_afluencia: 'Comercial',
        lat: -16.4815,
        lng: -68.118,
      },
    ],
  },
];

export const INITIAL_SIGHTINGS: TruckSighting[] = [
  {
    id: 'sigh-1',
    ruta_id: 'e0000000-0000-0000-0000-000000000001',
    placa: 'ABC-1234',
    zona: 'Zona Sur',
    parada_referencia: 'Obrajes Calle 14',
    comentario: 'Camión repartiendo con campana activa, hay fila de 4 personas',
    hora_reporte: 'Hace 8 min',
    verificado: true,
  },
  {
    id: 'sigh-2',
    ruta_id: 'e0000000-0000-0000-0000-000000000001',
    placa: 'ABC-1234',
    zona: 'Zona Sur',
    parada_referencia: 'Av. Roma altura Campo Ferial',
    comentario: 'Subiendo hacia Los Pinos sin demora aparente',
    hora_reporte: 'Hace 22 min',
    verificado: true,
  },
];

export const INITIAL_RESERVATIONS: GasReservation[] = [
  {
    id: 'res-1',
    codigo_reserva: 'RES-0419',
    cliente_id: 'c0000000-0000-0000-0000-000000000004',
    cliente_nombre: 'Cliente Vecino (La Paz)',
    telefono: '71234567',
    parada_id: 'stop-3',
    parada_nombre: 'Condominio Los Pinos / Plaza Central',
    cantidad: 1,
    estado: 'Confirmada',
    fecha_reserva: '2026-11-23',
  },
];

export const FIXED_POINTS: FixedDistributionPoint[] = [
  {
    id: 'fp-1',
    nombre: 'Depósito Central Senkata (YPFB)',
    direccion: 'Av. 6 de Marzo Km 8, El Alto',
    zona: 'El Alto Central',
    horario_atencion: '07:00 - 19:00',
    stock_disponible: 350,
    lat: -16.5412,
    lng: -68.1825,
  },
  {
    id: 'fp-2',
    nombre: 'Distribuidora Autorizada Sur',
    direccion: 'Calle 16 de Obrajes (frente al puente)',
    zona: 'Zona Sur',
    horario_atencion: '08:00 - 18:30',
    stock_disponible: 120,
    lat: -16.5298,
    lng: -68.089,
  },
  {
    id: 'fp-3',
    nombre: 'Estación de Servicio Villa Fátima',
    direccion: 'Plaza del Maestro esq. Av. Las Américas',
    zona: 'Zona Norte',
    horario_atencion: '07:30 - 20:00',
    stock_disponible: 85,
    lat: -16.4815,
    lng: -68.118,
  },
];

export const INITIAL_COMPLAINTS: Complaint[] = [
  {
    id: 'f0000000-0000-0000-0000-000000000001',
    ticket_code: 'REC-9821',
    cliente_id: 'c0000000-0000-0000-0000-000000000004',
    nombre_consumidor: 'Cliente Vecino (La Paz)',
    telefono_contacto: '71234567',
    placa_camion: 'ABC-1234',
    hora_aproximada: '12:30 PM',
    zona: 'Zona Norte',
    tipo_reclamo: 'Retraso en entrega',
    descripcion:
      'El pedido fue programado con promesa de entrega en 2 horas. Siendo las 12:30 PM el camión aún no ha reportado su llegada a la Zona Norte Sector 2.',
    prioridad: 'Alta',
    estado: 'Pendiente',
    created_at: '2026-11-23 12:45',
    history: [
      {
        fecha: '2026-11-23 12:45',
        estado: 'Registrado en Sistema',
        comentario: 'Reclamo recibido desde la app móvil',
      },
      {
        fecha: '2026-11-23 13:10',
        estado: 'En revisión por Soporte',
        comentario: 'Verificando con chofer Raul Chofer y monitoreo de ruta',
      },
    ],
  },
  {
    id: 'f0000000-0000-0000-0000-000000000002',
    ticket_code: 'REC-9820',
    cliente_id: 'user-02',
    nombre_consumidor: 'Pedro Álvarez',
    telefono_contacto: '78912345',
    placa_camion: 'XYZ-5678',
    hora_aproximada: '10:00 AM',
    zona: 'Zona Sur',
    tipo_reclamo: 'Sobreprecio',
    descripcion: 'Cobro de Bs 25 en vez de la tarifa oficial de Bs 22.50.',
    prioridad: 'Alta',
    estado: 'En revisión',
    created_at: '2026-11-23 10:15',
  },
];

export const INITIAL_INCIDENTS: RouteIncident[] = [
  {
    id: 'inc-1',
    ruta_id: 'e0000000-0000-0000-0000-000000000001',
    vehiculo_placa: 'ABC-1234',
    conductor_nombre: 'Raul Chofer (Conductor)',
    tipo_incidente: 'Bloqueo / Marcha',
    descripcion:
      'Paso cerrado temporalmente en Av. Costanera altura Calle 8. Tomando desvío hacia Av. Roma.',
    latitud: -16.5321,
    longitud: -68.0874,
    estado: 'Activo',
    created_at: '09:20 AM',
  },
  {
    id: 'inc-2',
    ruta_id: 'e0000000-0000-0000-0000-000000000002',
    vehiculo_placa: 'XYZ-5678',
    conductor_nombre: 'Luis Fernández',
    tipo_incidente: 'Falla Mecánica',
    descripcion: 'Pinchadura de llanta trasera derecha. Asistencia técnica en camino.',
    latitud: -16.4912,
    longitud: -68.1256,
    estado: 'En atención',
    created_at: '08:45 AM',
  },
];

// Noticias y Novedades (Imagen 14)
export const COMMUNITY_NEWS: CommunityNews[] = [
  {
    id: 'n-1',
    titulo: 'Precio Oficial de Garrafa de GLP 10 kg se mantiene en Bs 22.50',
    fecha: 'Hoy 07:00 AM',
    resumen:
      'La Agencia Nacional de Hidrocarburos (ANH) y YPFB ratifican la vigencia irrestricta de la tarifa solidaria en todo el departamento de La Paz. Prohibido el sobreprecio.',
    categoria: 'Aviso Oficial',
    autor: 'ANH / YPFB Bolivia',
    likes: 48,
  },
  {
    id: 'n-2',
    titulo: 'Refuerzo de Abastecimiento con 6 Camiones en La Paz y El Alto',
    fecha: 'Hoy 08:30 AM',
    resumen:
      'Distribuidora Central despacha flota ampliada para atender demanda en zonas altas, laderas y Zona Sur para garantizar stock pleno.',
    categoria: 'Aviso Oficial',
    autor: 'Planta Senkata YPFB',
    likes: 35,
  },
  {
    id: 'n-3',
    titulo: 'Camión pasando por Obrajes Calle 12 y Av. Hernando Siles',
    fecha: 'Hace 25 min',
    resumen:
      'Vecinos confirman distribución normal en la zona sur con stock suficiente y atención ágil.',
    categoria: 'Vecinal',
    autor: 'Junta Vecinal Los Pinos',
    likes: 19,
  },
  {
    id: 'n-4',
    titulo: 'Verificación de Precinto Amarillo Termoencogible',
    fecha: 'Ayer 15:00',
    resumen:
      'Recuerde exigir que el precinto de seguridad esté 100% intacto con el sello de garantía YPFB antes de recibir el cilindro.',
    categoria: 'Seguridad',
    autor: 'Superintendencia de Seguridad Industrial',
    likes: 27,
  },
];

export const INITIAL_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'notif-1',
    titulo: '¡Camión cerca de tu zona!',
    mensaje: 'El camión ABC-1234 (Raul Chofer) se encuentra a menos de 4 cuadras en Cruce Av. Petrolera.',
    hora: '09:18 AM',
    grupo: 'Hoy',
    leido: false,
    tipo: 'camion',
  },
  {
    id: 'notif-2',
    titulo: 'Reserva Confirmada',
    mensaje: 'Tu reserva #RES-0419 de 1 garrafa está reservada para la Parada 3 (Los Pinos).',
    hora: '08:30 AM',
    grupo: 'Hoy',
    leido: false,
    tipo: 'reserva',
  },
  {
    id: 'notif-3',
    titulo: 'Desvío de Tráfico Reportado',
    mensaje: 'El camión tomará desvío temporal por Av. Roma. Retraso estimado: 10 min.',
    hora: 'Ayer 16:40',
    grupo: 'Ayer',
    leido: true,
    tipo: 'alerta',
  },
];

// Demandas por Zonas según Captura 7 (Hoy / Semana / Mes)
export const INITIAL_ZONE_DEMAND_CARDS: ZoneDemandData[] = [
  {
    zona: 'Zona Norte',
    solicitudes: 45,
    garrafas: 90,
    camiones: 2,
    nivelDemanda: 'Alta Demanda',
  },
  {
    zona: 'Zona Central',
    solicitudes: 52,
    garrafas: 104,
    camiones: 3,
    nivelDemanda: 'Alta Demanda',
  },
  {
    zona: 'Zona Sur',
    solicitudes: 28,
    garrafas: 56,
    camiones: 1,
    nivelDemanda: 'Media Demanda',
  },
];

// Estadísticas de demanda por zonas (para Admin > Más > Demanda por Zonas)
export const ZONE_DEMAND_STATS: ZoneDemandStat[] = [
  { zona: 'Zona Sur (Obrajes, Calacoto, Los Pinos)', garrafas_demandadas: 184, porcentaje: 38, tendencia: 'up' },
  { zona: 'El Alto Central & Senkata', garrafas_demandadas: 142, porcentaje: 29, tendencia: 'up' },
  { zona: 'Zona Norte & Villa Fátima', garrafas_demandadas: 96, porcentaje: 20, tendencia: 'stable' },
  { zona: 'Centro & San Pedro', garrafas_demandadas: 62, porcentaje: 13, tendencia: 'down' },
];

export const SYSTEM_USERS = [
  { id: 'u-1', name: 'Alejandro Silva', role: 'Administrador', phone: '+591 712 34567', email: 'a.silva@garrafasya.bo', status: 'Activo' },
  { id: 'u-2', name: 'Juan Carlos Gómez', role: 'Conductor', phone: '+591 765 43210', email: 'j.gomez@distribuidoragas.bo', status: 'Activo' },
  { id: 'u-3', name: 'Patricia Beltrán', role: 'Distribuidor', phone: '+591 701 88990', email: 'p.beltran@garrafasya.bo', status: 'Activo' },
  { id: 'u-4', name: 'Roberto Ramos', role: 'Personal autorizado', phone: '+591 611 22334', email: 'r.ramos@gmail.com', status: 'Inactivo' },
  { id: 'u-5', name: 'Tamara Franco', role: 'Administrador General', phone: '+591 701 23456', email: 'tamfranco63@gmail.com', status: 'Activo' },
  { id: 'u-6', name: 'Raul Chofer', role: 'Conductor', phone: '+591 765 43210', email: 'pishinraula@gmail.com', status: 'Activo' },
  { id: 'u-7', name: 'Cliente Vecino', role: 'Cliente Vecinal', phone: '+591 712 34567', email: 'adsgw46@gmail.com', status: 'Activo' },
];
