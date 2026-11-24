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
}): Promise<UserProfile | null> {
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
      return null;
    }

    return data as UserProfile;
  } catch (err) {
    console.log('Error conectando a Supabase para registro:', err);
    return null;
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

// Obtener noticias oficiales desde Supabase
export async function getNewsFromSupabase(): Promise<CommunityNews[] | null> {
  try {
    const { data, error } = await supabase
      .from('community_news')
      .select('*')
      .order('created_at', { ascending: false });

    if (error || !data || data.length === 0) return null;
    return data as CommunityNews[];
  } catch {
    return null;
  }
}
