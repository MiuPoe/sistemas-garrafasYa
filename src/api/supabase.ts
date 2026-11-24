import { createClient } from '@supabase/supabase-js';
import { UserProfile, FleetVehicle, DistributionRoute, CommunityNews } from '../types';

const supabaseUrl =
  process.env.EXPO_PUBLIC_SUPABASE_URL || 'https://icztdflmhdwunbvhvtpo.supabase.co';
const supabaseAnonKey =
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.dummyKey';

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
});

// Registrar nuevo usuario en Supabase (INSERT INTO public.profiles)
export async function createProfileInSupabase(profile: {
  email: string;
  password?: string;
  full_name: string;
  role: 'client' | 'driver' | 'admin';
  ci: string;
  phone: string;
  zone: string;
  address?: string;
}): Promise<{ profile: UserProfile | null; error?: string }> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .insert({
        email: profile.email.toLowerCase().trim(),
        password: profile.password || '123456',
        full_name: profile.full_name.trim(),
        role: profile.role,
        ci: profile.ci.trim(),
        phone: profile.phone.trim(),
        zone: profile.zone.trim(),
        address: profile.address?.trim() || '',
        code:
          profile.role === 'admin'
            ? 'GY-ADMIN-048'
            : profile.role === 'driver'
            ? 'GY-DRV-012'
            : 'GY-CLI-902',
        is_verified: true,
      })
      .select()
      .single();

    if (error) {
      console.log('Error insert perfil Supabase:', error.message);
      return { profile: null, error: error.message };
    }

    return { profile: data as UserProfile };
  } catch (err: any) {
    console.log('Error conectando a Supabase para registro:', err);
    return { profile: null, error: err?.message || 'Error de conexión' };
  }
}

// Obtener perfil de usuario desde Supabase por Email
export async function getProfileFromSupabase(email: string): Promise<UserProfile | null> {
  try {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('email', email.trim().toLowerCase())
      .single();

    if (error || !data) {
      console.log('Nota Supabase perfil:', error?.message || 'No encontrado en DB');
      return null;
    }

    return {
      id: data.id,
      email: data.email,
      password: data.password,
      full_name: data.full_name,
      role: data.role,
      ci: data.ci || '',
      phone: data.phone || '',
      zone: data.zone || 'Zona Sur - La Paz',
      address: data.address,
      code: data.code,
      is_verified: data.is_verified ?? true,
    };
  } catch (err) {
    console.log('Error conectando a Supabase:', err);
    return null;
  }
}

// Obtener vehículos de la flota desde Supabase
export async function getVehiclesFromSupabase(): Promise<FleetVehicle[] | null> {
  try {
    const { data, error } = await supabase
      .from('vehicles')
      .select('*')
      .order('created_at', { ascending: true });

    if (error || !data || data.length === 0) return null;
    return data as FleetVehicle[];
  } catch {
    return null;
  }
}

// Obtener rutas con paradas desde Supabase
export async function getRoutesFromSupabase(): Promise<DistributionRoute[] | null> {
  try {
    const { data: routesData, error: routesErr } = await supabase
      .from('distribution_routes')
      .select('*, stops:route_stops(*)');

    if (routesErr || !routesData || routesData.length === 0) return null;

    return routesData.map((r: any) => ({
      id: r.id,
      codigo_ruta: r.codigo_ruta,
      nombre_ruta: r.nombre_ruta,
      zona: r.zona,
      vehiculo_placa: r.vehiculo_placa,
      conductor_nombre: r.conductor_nombre,
      hora_salida_programada: r.hora_salida_programada,
      cantidad_garrafas_asignadas: r.cantidad_garrafas_asignadas,
      garrafas_restantes: r.garrafas_restantes,
      cilindros_vacios_recibidos: r.cilindros_vacios_recibidos,
      punto_origen: r.punto_origen,
      punto_destino: r.punto_destino,
      estado: r.estado,
      color: r.color,
      truckLat: r.truck_lat,
      truckLng: r.truck_lng,
      stops: (r.stops || []).sort((a: any, b: any) => a.orden - b.orden),
    }));
  } catch {
    return null;
  }
}

// Actualizar zona del usuario en Supabase
export async function updateUserZoneInSupabase(email: string, zone: string) {
  try {
    const { error } = await supabase
      .from('profiles')
      .update({ zone })
      .eq('email', email.trim().toLowerCase());
    if (error) console.log('Error actualizando zona en Supabase:', error.message);
  } catch (err) {
    console.log('Error conectando a Supabase para actualizar zona:', err);
  }
}

// Actualizar stock de garrafas en la ruta en vivo
export async function updateRouteStockInSupabase(
  routeId: string,
  garrafasRestantes: number,
  cilindrosVacios: number
) {
  try {
    const { error } = await supabase
      .from('distribution_routes')
      .update({
        garrafas_restantes: garrafasRestantes,
        cilindros_vacios_recibidos: cilindrosVacios,
      })
      .eq('id', routeId);
    if (error) console.log('Error actualizando stock en Supabase:', error.message);
  } catch (err) {
    console.log('Error conectando a Supabase para stock:', err);
  }
}

// Avanzar parada de la ruta en Supabase
export async function advanceStopInSupabase(
  currentStopId: string,
  nextStopId?: string
) {
  try {
    // 1. Parada actual completada
    await supabase
      .from('route_stops')
      .update({ estado: 'Completada', es_actual: false })
      .eq('id', currentStopId);

    // 2. Siguiente parada en curso
    if (nextStopId) {
      await supabase
        .from('route_stops')
        .update({ estado: 'En curso', es_actual: true })
        .eq('id', nextStopId);
    }
  } catch (err) {
    console.log('Error avanzando parada en Supabase:', err);
  }
}

// Finalizar recorrido del chofer en Supabase (marca ruta como 'Finalizada' y camión en 'Descanso')
export async function finishDriverRouteInSupabase(
  routeId: string,
  vehiclePlaca?: string
) {
  try {
    // 1. Marcar la ruta como Finalizada
    await supabase
      .from('distribution_routes')
      .update({
        estado: 'Finalizada',
        garrafas_restantes: 0,
      })
      .eq('id', routeId);

    // 2. Marcar paradas como completadas
    await supabase
      .from('route_stops')
      .update({ estado: 'Completada', es_actual: false })
      .eq('ruta_id', routeId);

    // 3. Poner el vehículo en Descanso
    if (vehiclePlaca) {
      await supabase
        .from('vehicles')
        .update({ estado: 'Descanso' })
        .eq('placa', vehiclePlaca);
    }
  } catch (err) {
    console.log('Error finalizando ruta en Supabase:', err);
  }
}

// Guardar nuevo reclamo en Supabase
export async function saveComplaintInSupabase(complaint: {
  ticket_code?: string;
  nombre_consumidor: string;
  telefono_contacto: string;
  placa_camion?: string;
  zona: string;
  tipo_reclamo: string;
  descripcion: string;
  prioridad?: string;
}) {
  try {
    const { data, error } = await supabase
      .from('complaints')
      .insert({
        ticket_code: complaint.ticket_code || `REC-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre_consumidor: complaint.nombre_consumidor,
        telefono_contacto: complaint.telefono_contacto,
        placa_camion: complaint.placa_camion || 'ABC-1234',
        zona: complaint.zona || 'Zona Sur',
        tipo_reclamo: complaint.tipo_reclamo,
        descripcion: complaint.descripcion,
        prioridad: complaint.prioridad || 'Alta',
        estado: 'Pendiente',
      })
      .select()
      .single();
    if (error) console.log('Error insertando reclamo en Supabase:', error.message);
    return data;
  } catch (err) {
    console.log('Error conectando para reclamo en Supabase:', err);
    return null;
  }
}

// Guardar nuevo incidente en Supabase
export async function saveIncidentInSupabase(incident: {
  codigo_incidente?: string;
  vehiculo_placa: string;
  conductor_nombre: string;
  tipo_incidente: string;
  descripcion: string;
  lat?: number;
  lng?: number;
}) {
  try {
    const { data, error } = await supabase
      .from('route_incidents')
      .insert({
        codigo_incidente: incident.codigo_incidente || `INC-${Math.floor(100 + Math.random() * 900)}`,
        vehiculo_placa: incident.vehiculo_placa,
        conductor_nombre: incident.conductor_nombre,
        tipo_incidente: incident.tipo_incidente,
        descripcion: incident.descripcion,
        lat: incident.lat,
        lng: incident.lng,
        estado: 'Activo',
      })
      .select()
      .single();
    if (error) console.log('Error insertando incidente en Supabase:', error.message);
    return data;
  } catch (err) {
    console.log('Error conectando para incidente en Supabase:', err);
    return null;
  }
}
