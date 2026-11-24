# GarrafaYa Bolivia 🇧🇴

> **Sistema Oficial de Monitoreo, Distribución y Trazabilidad de GLP para La Paz y El Alto**  
> *Tarifa Oficial Regulada: Bs. 22.50 (ANH / YPFB)*

---

## Descripción del Proyecto

**GarrafaYa** es una plataforma móvil y web integral diseñada para optimizar y transparentar la cadena de distribución de Gas Licuado de Petróleo (cilindros de 10 kg) en la ciudad de La Paz y El Alto. Permite a los vecinos consultar en tiempo real el paso de los camiones distribuidores, registrar reservas y reclamos, mientras que los conductores y administradores gestionan inventarios, hojas de ruta y balances de planta.

---

## Roles del Sistema

1. **Administrador General (Tamara Franco - `tamfranco63@gmail.com`)**
   - Control de garrafas en planta (balance diario: ingresos, salidas, retornos y stock disponible).
   - Creación y asignación de rutas de distribución con paradas geolocalizadas.
   - Supervisión de la flota de camiones y choferes asignados.
   - Monitoreo de demanda por zonas (Zona Sur, Obrajes, Miraflores, Villa Fátima, San Pedro, etc.).
   - Gestión y resolución de reclamos e incidentes en ruta.

2. **Conductor / Chofer Asignado (Raul Chofer - `pishinraula@gmail.com`)**
   - Notificación de ruta activa en tiempo real estilo PedidosYa.
   - Despacho rápido de cilindros (descuento automático de stock con precio oficial Bs. 22.50).
   - Confirmación de llegada y avance entre paradas programadas.
   - Reporte de incidentes mecánicos, desvíos o bloqueos viales con geolocalización.

3. **Cliente / Vecino (Cliente La Paz - `adsgw46@gmail.com`)**
   - Mapa interactivo en tiempo real con OpenStreetMap y Leaflet.
   - Notificación de proximidad de camión a la zona del usuario.
   - Verificación de precio oficial ratificado por la ANH (Bs. 22.50).
   - Reserva de garrafas en paradas oficiales.
   - Registro de denuncias de sobreprecio o retrasos.
   - Noticias y comunicados oficiales de abastecimiento YPFB / ANH.

---

## Tecnologías Utilizadas

- **Frontend:** React Native / Expo (SDK 58), TypeScript, React Native SVG (vectorial puro, sin emojis).
- **Mapas:** OpenStreetMap + Leaflet (Leaflet 1.9.4 vía Web / WebView).
- **Base de Datos & Backend:** PostgreSQL en la nube administrado mediante Supabase y DBeaver.
- **API REST:** PostgREST / Supabase REST API v1.
- **Compilación Nativa:** Expo Application Services (EAS Build) para Android (`.apk`).

---

## Estructura de la Base de Datos (PostgreSQL en Supabase)

El script SQL completo e idempotente se encuentra en [`supabase_setup.sql`](./supabase_setup.sql).

- `public.profiles`: Perfiles de usuarios con verificación ANH, roles (`admin`, `driver`, `client`), CI, teléfono y contraseñas.
- `public.vehicles`: Registro de camiones (placa, modelo, año, capacidad de garrafas, chofer asignado y estado).
- `public.distribution_routes`: Rutas de distribución con origen (Planta Senkata), destino, camión y coordenadas GPS.
- `public.route_stops`: Paradas intermedias con horarios estimados, tipo de afluencia y orden secuencial.
- `public.plant_cylinder_movements`: Kardex y balance diario de garrafas de planta.
- `public.community_news`: Avisos oficiales y novedades de abastecimiento.
- `public.complaints`: Libro digital de reclamos de los vecinos.
- `public.route_incidents`: Registro de incidentes reportados por conductores en ruta.

---

## Ejecución del Proyecto

### Requisitos Previos
- Node.js (v18+)
- npm o npx

### Instalación de Dependencias
```bash
npm install
```

### Ejecutar en Modo Web
```bash
npx expo start --web
```

### Ejecutar en Celular Android (Expo Go)
```bash
npx expo start
```
Escanea el código QR desde la aplicación **Expo Go** disponible en Google Play Store.

### Generar APK para Instalación Directa
```bash
npm install -g eas-cli
eas login
eas build -p android --profile preview
```

---

## Demostración de Endpoints REST (Postman)

- **Base URL:** `https://icztdflmhdwunbvhvtpo.supabase.co/rest/v1/`
- **Headers obligatorios:**
  - `apikey`: *(Tu Anon Key de Supabase)*
  - `Authorization`: `Bearer (Tu Anon Key de Supabase)`

### Endpoints Principales:
- `GET /rest/v1/profiles?select=*` (Listado de perfiles registrados)
- `GET /rest/v1/vehicles?select=*` (Flota de camiones distribuidores)
- `GET /rest/v1/distribution_routes?select=*,route_stops(*)` (Rutas y paradas)
- `POST /rest/v1/complaints` (Creación de reclamos en tiempo real)
