export type UserRole = 'client' | 'driver' | 'admin';

export interface UserProfile {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  role: UserRole;
  ci: string;
  phone: string;
  zone: string;
  address?: string;
  code?: string;
  is_verified?: boolean;
}

export interface RouteStop {
  id: string;
  ruta_id: string;
  nombre_parada: string;
  orden: number;
  hora_estimada: string;
  estado: 'Completada' | 'En curso' | 'Pendiente';
  tipo_afluencia: 'Alta afluencia' | 'Residencial' | 'Comercial' | 'Industrial';
  lat: number;
  lng: number;
  notas?: string;
  es_actual?: boolean;
}

export interface DistributionRoute {
  id: string;
  codigo_ruta: string;
  nombre_ruta: string;
  zona: string;
  vehiculo_placa: string;
  conductor_nombre: string;
  hora_salida_programada: string;
  cantidad_garrafas_asignadas: number;
  garrafas_restantes: number;
  cilindros_vacios_recibidos: number;
  punto_origen: string;
  punto_destino?: string;
  estado: 'Programada' | 'En curso' | 'Finalizada';
  color?: string;
  truckLat?: number;
  truckLng?: number;
  stops: RouteStop[];
}

export interface GasReservation {
  id: string;
  codigo_reserva: string;
  cliente_id: string;
  cliente_nombre: string;
  telefono: string;
  parada_id: string;
  parada_nombre: string;
  cantidad: number;
  estado: 'Pendiente' | 'Confirmada' | 'Entregada' | 'Cancelada';
  fecha_reserva: string;
}

export interface TruckSighting {
  id: string;
  ruta_id: string;
  placa: string;
  zona: string;
  parada_referencia: string;
  comentario: string;
  hora_reporte: string;
  verificado: boolean;
}

export interface FixedDistributionPoint {
  id: string;
  nombre: string;
  direccion: string;
  zona: string;
  horario_atencion: string;
  stock_disponible: number;
  lat: number;
  lng: number;
}

export interface Complaint {
  id: string;
  ticket_code: string;
  cliente_id: string;
  nombre_consumidor: string;
  telefono_contacto: string;
  placa_camion: string;
  hora_aproximada: string;
  zona: string;
  tipo_reclamo: 'Retraso en entrega' | 'Sobreprecio' | 'Mala atención' | 'Cilindro defectuoso' | 'No pasó por la parada';
  descripcion: string;
  prioridad: 'Alta' | 'Media' | 'Baja';
  estado: 'Pendiente' | 'En revisión' | 'Resuelto';
  created_at: string;
  history?: Array<{
    fecha: string;
    estado: string;
    comentario: string;
  }>;
}

export interface RouteIncident {
  id: string;
  ruta_id: string;
  vehiculo_placa: string;
  conductor_nombre: string;
  tipo_incidente: 'Bloqueo / Marcha' | 'Falla Mecánica' | 'Desvío Vial' | 'Falta de Combustible' | 'Accidente Menor';
  descripcion: string;
  latitud?: number;
  longitud?: number;
  estado: 'Activo' | 'En atención' | 'Resuelto';
  created_at: string;
}

export interface CommunityNews {
  id: string;
  titulo: string;
  fecha: string;
  resumen: string;
  categoria: 'Aviso Oficial' | 'Cronograma' | 'Seguridad' | 'Vecinal';
  autor?: string;
  likes?: number;
}

export interface AppNotification {
  id: string;
  titulo: string;
  mensaje: string;
  hora: string;
  grupo: 'Hoy' | 'Ayer';
  leido: boolean;
  tipo: 'camion' | 'reserva' | 'alerta';
}

export interface FleetVehicle {
  id: string;
  placa: string;
  modelo: string;
  anio: number;
  capacidad_garrafas: number;
  estado: 'En ruta' | 'Operativo' | 'Descanso' | 'En Mantenimiento';
  chofer_asignado?: string;
}

export interface DriverMember {
  id: string;
  nombre: string;
  email: string;
  ci: string;
  telefono: string;
  categoria_licencia: string;
  vehiculo_asignado?: string;
  estado: 'Activo' | 'En ruta' | 'Descanso';
}

export interface PlantMovement {
  id: string;
  codigo_movimiento: string;
  tipo_movimiento: 'Ingreso' | 'Salida' | 'Retorno';
  vehiculo_placa?: string;
  conductor_nombre?: string;
  cantidad: number;
  fecha_hora: string;
  responsable_despacho: string;
  observaciones?: string;
}

export interface PlantInventory {
  ingresan: number;
  salen: number;
  retornan: number;
  disponibles: number;
}

export interface ZoneDemandStat {
  zona: string;
  garrafas_demandadas: number;
  porcentaje: number;
  tendencia: 'up' | 'down' | 'stable';
}

export interface ZoneDemandData {
  zona: string;
  solicitudes: number;
  garrafas: number;
  camiones: number;
  nivelDemanda: 'Alta Demanda' | 'Media Demanda' | 'Baja Demanda';
}
