-- ============================================================================
-- GARRAFAYA BOLIVIA - SCRIPT DEFINITIVO DE BASE DE DATOS (SUPABASE / DBEAVER)
-- ============================================================================
-- Este script borra tablas anteriores conflictivas y las crea desde cero
-- limpias, con todas las columnas necesarias y los datos iniciales listos.
-- ============================================================================

-- 1. LIMPIEZA DE TABLAS ANTERIORES (Evita el error 'column full_name does not exist')
DROP TABLE IF EXISTS public.route_stops CASCADE;
DROP TABLE IF EXISTS public.distribution_routes CASCADE;
DROP TABLE IF EXISTS public.plant_cylinder_movements CASCADE;
DROP TABLE IF EXISTS public.community_news CASCADE;
DROP TABLE IF EXISTS public.complaints CASCADE;
DROP TABLE IF EXISTS public.route_incidents CASCADE;
DROP TABLE IF EXISTS public.gas_reservations CASCADE;
DROP TABLE IF EXISTS public.truck_sightings CASCADE;
DROP TABLE IF EXISTS public.vehicles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;

-- 2. HABILITAR EXTENSIÓN PARA UUID (gen_random_uuid es nativo en Postgres 13+)
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 3. TABLA DE PERFILES DE USUARIO (profiles)
CREATE TABLE public.profiles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    password TEXT DEFAULT '123456',
    full_name TEXT NOT NULL,
    role TEXT NOT NULL CHECK (role IN ('client', 'driver', 'admin')),
    ci TEXT,
    phone TEXT,
    zone TEXT DEFAULT 'Zona Sur - La Paz',
    address TEXT,
    code TEXT,
    is_verified BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. TABLA DE VEHÍCULOS / FLOTA DE CAMIONES (vehicles)
CREATE TABLE public.vehicles (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    placa TEXT UNIQUE NOT NULL,
    modelo TEXT NOT NULL,
    anio INTEGER DEFAULT 2023,
    capacidad_garrafas INTEGER NOT NULL DEFAULT 120,
    estado TEXT NOT NULL DEFAULT 'Operativo' CHECK (estado IN ('En ruta', 'Operativo', 'Descanso', 'En Mantenimiento')),
    chofer_asignado TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. TABLA DE RUTAS DE DISTRIBUCIÓN (distribution_routes)
CREATE TABLE public.distribution_routes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_ruta TEXT UNIQUE NOT NULL,
    nombre_ruta TEXT NOT NULL,
    zona TEXT NOT NULL,
    vehiculo_placa TEXT,
    conductor_nombre TEXT,
    hora_salida_programada TEXT NOT NULL,
    cantidad_garrafas_asignadas INTEGER NOT NULL DEFAULT 120,
    garrafas_restantes INTEGER NOT NULL DEFAULT 120,
    cilindros_vacios_recibidos INTEGER NOT NULL DEFAULT 0,
    punto_origen TEXT NOT NULL DEFAULT 'Planta Central Senkata (Distribuidora de Gas La Paz)',
    punto_destino TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'En curso' CHECK (estado IN ('Programada', 'En curso', 'Finalizada')),
    color TEXT DEFAULT '#2563EB',
    truck_lat DOUBLE PRECISION DEFAULT -16.5298,
    truck_lng DOUBLE PRECISION DEFAULT -68.1215,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 6. TABLA DE PARADAS DE RUTA (route_stops)
CREATE TABLE public.route_stops (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruta_id UUID REFERENCES public.distribution_routes(id) ON DELETE CASCADE,
    nombre_parada TEXT NOT NULL,
    orden INTEGER NOT NULL,
    hora_estimada TEXT NOT NULL,
    estado TEXT NOT NULL DEFAULT 'Pendiente' CHECK (estado IN ('Completada', 'En curso', 'Pendiente')),
    tipo_afluencia TEXT DEFAULT 'Residencial',
    lat DOUBLE PRECISION NOT NULL,
    lng DOUBLE PRECISION NOT NULL,
    notas TEXT,
    es_actual BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 7. TABLA DE CONTROL DE GARRAFAS EN PLANTA (plant_cylinder_movements)
CREATE TABLE public.plant_cylinder_movements (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_movimiento TEXT UNIQUE NOT NULL,
    tipo_movimiento TEXT NOT NULL CHECK (tipo_movimiento IN ('Ingreso', 'Salida', 'Retorno')),
    vehiculo_placa TEXT,
    conductor_nombre TEXT,
    cantidad INTEGER NOT NULL,
    responsable_despacho TEXT DEFAULT 'Administrador General',
    fecha_hora TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    observaciones TEXT
);

-- 8. TABLA DE NOTICIAS Y NOVEDADES (community_news)
CREATE TABLE public.community_news (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    titulo TEXT NOT NULL,
    fecha TEXT NOT NULL,
    resumen TEXT NOT NULL,
    categoria TEXT NOT NULL CHECK (categoria IN ('Aviso Oficial', 'Cronograma', 'Seguridad', 'Vecinal')),
    autor TEXT DEFAULT 'ANH / YPFB',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 9. TABLA DE RECLAMOS (complaints)
CREATE TABLE public.complaints (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_code TEXT UNIQUE NOT NULL,
    nombre_consumidor TEXT NOT NULL,
    telefono_contacto TEXT NOT NULL,
    placa_camion TEXT,
    hora_aproximada TEXT,
    zona TEXT NOT NULL,
    tipo_reclamo TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    prioridad TEXT DEFAULT 'Alta',
    estado TEXT DEFAULT 'Pendiente' CHECK (estado IN ('Pendiente', 'En revisión', 'Resuelto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 10. TABLA DE INCIDENCIAS VIALES (route_incidents)
CREATE TABLE public.route_incidents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ruta_id UUID REFERENCES public.distribution_routes(id) ON DELETE SET NULL,
    vehiculo_placa TEXT NOT NULL,
    conductor_nombre TEXT NOT NULL,
    tipo_incidente TEXT NOT NULL,
    descripcion TEXT NOT NULL,
    latitud DOUBLE PRECISION,
    longitud DOUBLE PRECISION,
    estado TEXT DEFAULT 'Activo' CHECK (estado IN ('Activo', 'En atención', 'Resuelto')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 11. TABLA DE RESERVAS VECINALES (gas_reservations)
CREATE TABLE public.gas_reservations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    codigo_reserva TEXT UNIQUE NOT NULL,
    cliente_nombre TEXT NOT NULL,
    telefono TEXT NOT NULL,
    parada_nombre TEXT NOT NULL,
    cantidad INTEGER NOT NULL DEFAULT 1,
    estado TEXT DEFAULT 'Confirmada' CHECK (estado IN ('Pendiente', 'Confirmada', 'Entregada', 'Cancelada')),
    fecha_reserva TEXT NOT NULL DEFAULT '2026-11-23',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ============================================================================
-- POLÍTICAS DE ACCESO: PERMITIR ACCESO PÚBLICO (DESHABILITAR RLS PARA PRUEBAS)
-- ============================================================================
ALTER TABLE public.profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.distribution_routes DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_stops DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.plant_cylinder_movements DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.community_news DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.complaints DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.route_incidents DISABLE ROW LEVEL SECURITY;
ALTER TABLE public.gas_reservations DISABLE ROW LEVEL SECURITY;

-- ============================================================================
-- PRIVILEGIOS PARA LA CLAVE ANON / PUBLIC DE SUPABASE
-- ============================================================================
GRANT USAGE ON SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL SEQUENCES IN SCHEMA public TO anon, authenticated, service_role;
GRANT ALL ON ALL ROUTINES IN SCHEMA public TO anon, authenticated, service_role;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO anon, authenticated, service_role;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON ROUTINES TO anon, authenticated, service_role;

-- ============================================================================
-- INSERCIÓN DE DATOS INICIALES (TUS 3 CUENTAS DE GMAIL Y FLOTA REAL)
-- ============================================================================

-- 1. Tus 3 Cuentas solicitadas con contraseñas
INSERT INTO public.profiles (email, password, full_name, role, ci, phone, zone, code, is_verified)
VALUES 
    ('tamfranco63@gmail.com', 'admin123', 'Tamara Franco (Admin General)', 'admin', '3344556 LP', '70123456', 'Central La Paz', 'GY-ADMIN-048', TRUE),
    ('pishinraula@gmail.com', 'chofer123', 'Raul Chofer (Conductor)', 'driver', '4588921 LP', '76543210', 'Zona Sur - La Paz', 'GY-DRV-012', TRUE),
    ('adsgw46@gmail.com', 'cliente123', 'Cliente Vecino (La Paz)', 'client', '8765432 LP', '71234567', 'Zona Sur - Los Pinos', 'GY-CLI-902', TRUE);

-- 2. Flota de Camiones de las Capturas
INSERT INTO public.vehicles (placa, modelo, anio, capacidad_garrafas, estado, chofer_asignado)
VALUES
    ('ABC-1234', 'Toyota Dyna', 2022, 120, 'En ruta', 'Raul Chofer (Conductor)'),
    ('XYZ-5678', 'Hino 300', 2021, 100, 'En ruta', 'Luis Fernández'),
    ('LPZ-2026', 'Isuzu NKR', 2024, 140, 'Descanso', 'Mario Rojas'),
    ('LPZ-1234', 'Volvo FL280', 2023, 180, 'En ruta', 'Juan Carlos Gómez');

-- 3. Balance de Garrafas en Planta (300 Ingresan, 128 Salen, 42 Retornan, 245 Disponibles)
INSERT INTO public.plant_cylinder_movements (codigo_movimiento, tipo_movimiento, vehiculo_placa, conductor_nombre, cantidad, responsable_despacho, observaciones)
VALUES
    ('MOV-001', 'Ingreso', NULL, NULL, 300, 'Superintendencia Senkata', 'Carga inicial de cilindros llenos YPFB'),
    ('MOV-002', 'Salida', 'ABC-1234', 'Raul Chofer', 45, 'Tamara Franco', 'Despacho matutino Ruta Sur'),
    ('MOV-003', 'Salida', 'XYZ-5678', 'Luis Fernández', 40, 'Tamara Franco', 'Despacho matutino Ruta Norte'),
    ('MOV-004', 'Salida', 'LPZ-1234', 'Juan Carlos Gómez', 43, 'Tamara Franco', 'Despacho matutino Ruta Central'),
    ('MOV-005', 'Retorno', 'LPZ-2026', 'Mario Rojas', 42, 'Tamara Franco', 'Retorno de cilindros vacíos para recalificación');

-- 4. Rutas en La Paz
INSERT INTO public.distribution_routes (id, codigo_ruta, nombre_ruta, zona, vehiculo_placa, conductor_nombre, hora_salida_programada, cantidad_garrafas_asignadas, garrafas_restantes, cilindros_vacios_recibidos, punto_origen, punto_destino, estado, color, truck_lat, truck_lng)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'RUT-SUR-01', 'Ruta 1: Zona Sur (Obrajes - Los Pinos - Irpavi)', 'Zona Sur', 'ABC-1234', 'Raul Chofer (Conductor)', '08:00 AM', 120, 84, 36, 'Planta Central Senkata (Distribuidora de Gas La Paz)', 'Calle 15 de Irpavi', 'En curso', '#2563EB', -16.5298, -68.1215),
    ('e0000000-0000-0000-0000-000000000002', 'RUT-NOR-02', 'Ruta 2: Zona Norte (Miraflores - Villa Fátima)', 'Zona Norte', 'XYZ-5678', 'Luis Fernández', '08:30 AM', 100, 68, 32, 'Planta Central Senkata (Distribuidora de Gas La Paz)', 'Plaza del Maestro Villa Fátima', 'En curso', '#059669', -16.4880, -68.1250);

-- 5. Paradas de la Ruta 1 en La Paz
INSERT INTO public.route_stops (ruta_id, nombre_parada, orden, hora_estimada, estado, tipo_afluencia, lat, lng, notas, es_actual)
VALUES
    ('e0000000-0000-0000-0000-000000000001', 'Planta Central Senkata (Punto de Partida)', 1, '08:00 AM', 'Completada', 'Industrial', -16.5412, -68.1825, 'Salida de planta y precintado ANH', FALSE),
    ('e0000000-0000-0000-0000-000000000001', 'Cruce Av. Petrolera / Obrajes Calle 14', 2, '09:15 AM', 'En curso', 'Alta afluencia', -16.5298, -68.1215, 'Camión en este punto', TRUE),
    ('e0000000-0000-0000-0000-000000000001', 'Condominio Los Pinos / Plaza Central', 3, '10:00 AM', 'Pendiente', 'Residencial', -16.5385, -68.0821, 'Parada con pre-reservas', FALSE),
    ('e0000000-0000-0000-0000-000000000001', 'Calle 15 de Irpavi (Parada Final)', 4, '11:15 AM', 'Pendiente', 'Residencial', -16.5210, -68.0750, 'Cierre de recorrido', FALSE);

-- 6. Noticias y Novedades del Servicio
INSERT INTO public.community_news (titulo, fecha, resumen, categoria, autor)
VALUES
    ('Precio Oficial de Garrafa de GLP 10 kg ratificado en Bs. 22.50', 'Hoy 07:00 AM', 'La ANH y YPFB recuerdan que la tarifa oficial no puede ser alterada bajo ninguna circunstancia.', 'Aviso Oficial', 'ANH / YPFB Bolivia'),
    ('Refuerzo de Abastecimiento con 6 Camiones en La Paz y El Alto', 'Hoy 08:30 AM', 'Distribuidora Central despacha flota ampliada para atender demanda en zonas altas y laderas.', 'Aviso Oficial', 'Planta Senkata YPFB'),
    ('Camión pasando por Obrajes Calle 12 y Av. Hernando Siles', 'Hace 25 min', 'Vecinos confirman distribución normal en la zona sur con stock suficiente.', 'Vecinal', 'Junta Vecinal Los Pinos');

-- 7. Reclamos Registrados
INSERT INTO public.complaints (ticket_code, nombre_consumidor, telefono_contacto, placa_camion, hora_aproximada, zona, tipo_reclamo, descripcion, prioridad, estado)
VALUES
    ('REC-9821', 'Cliente Vecino (La Paz)', '71234567', 'ABC-1234', '12:30 PM', 'Zona Sur', 'Retraso en entrega', 'El camión se demoró en la parada de Los Pinos por congestión vial.', 'Alta', 'Pendiente'),
    ('REC-9820', 'Pedro Álvarez', '78912345', 'XYZ-5678', '10:00 AM', 'Zona Norte', 'Sobreprecio', 'Intento de cobro de Bs 25 en vez de Bs 22.50 oficial.', 'Alta', 'En revisión');
