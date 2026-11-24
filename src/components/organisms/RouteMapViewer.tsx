import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Platform } from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Radius, Spacing } from '../../theme/colors';
import { SvgIcon } from '../atoms/SvgIcon';
import { Badge } from '../atoms/Badge';
import { RouteStop } from '../../types';

export interface RouteMapViewerProps {
  selectedZone?: string;
  onSelectStop?: (stop: RouteStop) => void;
  stockCount?: number;
}

export const RouteMapViewer: React.FC<RouteMapViewerProps> = ({
  stockCount = 184,
}) => {
  const [activeZone, setActiveZone] = useState<string>('Zona Sur');

  const stopsSur = [
    { name: '1. Planta Senkata (Inicio)', lat: -16.5412, lng: -68.1825, time: '08:00 AM', status: 'Completada' },
    { name: '2. Cruce Av. Petrolera', lat: -16.5298, lng: -68.1215, time: '09:15 AM', status: 'En curso' },
    { name: '3. Condominio Los Pinos', lat: -16.5385, lng: -68.0821, time: '10:00 AM', status: 'Pendiente' },
    { name: '4. Mercado El Morro', lat: -16.531, lng: -68.069, time: '10:45 AM', status: 'Pendiente' },
    { name: '5. Calle 15 de Irpavi (Fin)', lat: -16.5245, lng: -68.081, time: '11:30 AM', status: 'Pendiente' },
  ];

  const stopsNorte = [
    { name: '1. Plaza del Maestro (V. Fátima)', lat: -16.4815, lng: -68.118, time: '08:30 AM', status: 'Completada' },
    { name: '2. Monumento Busch (Miraflores)', lat: -16.495, lng: -68.1225, time: '09:30 AM', status: 'En curso' },
    { name: '3. Estadio Hernando Siles', lat: -16.499, lng: -68.1255, time: '10:15 AM', status: 'Pendiente' },
  ];

  const currentStops = activeZone === 'Zona Norte' ? stopsNorte : stopsSur;
  const currentPlate = activeZone === 'Zona Norte' ? 'ABC-1234' : 'LPZ-1234';
  const truckLocation = activeZone === 'Zona Norte' ? [-16.495, -68.1225] : [-16.5298, -68.1215];

  const leafletHTML = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
      <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
      <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
      <style>
        body, html, #map { margin: 0; padding: 0; height: 100%; width: 100%; background: #e2e8f0; }
        .truck-marker {
          background: #B45309;
          color: white;
          font-weight: 800;
          font-size: 11px;
          padding: 4px 8px;
          border-radius: 12px;
          border: 2px solid white;
          box-shadow: 0 2px 6px rgba(0,0,0,0.4);
          text-align: center;
          white-space: nowrap;
        }
        .stop-marker {
          background: #1F2D52;
          color: white;
          font-weight: 700;
          font-size: 11px;
          width: 24px;
          height: 24px;
          border-radius: 12px;
          border: 2px solid white;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 4px rgba(0,0,0,0.3);
        }
        .stop-current { background: #D97706; transform: scale(1.15); }
      </style>
    </head>
    <body>
      <div id="map"></div>
      <script>
        var map = L.map('map', { zoomControl: false }).setView([${truckLocation[0]}, ${truckLocation[1]}], 13);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
          maxZoom: 18,
          attribution: '© OpenStreetMap'
        }).addTo(map);

        var stops = ${JSON.stringify(currentStops)};
        var latlngs = [];

        stops.forEach(function(s, idx) {
          var pt = [s.lat, s.lng];
          latlngs.push(pt);
          var isCurrent = s.status === 'En curso';
          var customIcon = L.divIcon({
            className: 'custom-pin',
            html: '<div class="stop-marker ' + (isCurrent ? 'stop-current' : '') + '">' + (idx + 1) + '</div>',
            iconSize: [24, 24],
            iconAnchor: [12, 12]
          });
          L.marker(pt, { icon: customIcon }).addTo(map).bindPopup('<b>' + s.name + '</b><br>Hora estimada: ' + s.time);
        });

        L.polyline(latlngs, {
          color: '${activeZone === 'Zona Norte' ? '#EA580C' : '#2563EB'}',
          weight: 5,
          opacity: 0.85,
          dashArray: '8, 6'
        }).addTo(map);

        var truckIcon = L.divIcon({
          className: 'truck-pin',
          html: '<div class="truck-marker">CAMIÓN ' + '${currentPlate}' + ' (' + '${stockCount}' + ')</div>',
          iconSize: [110, 24],
          iconAnchor: [55, 12]
        });
        L.marker([${truckLocation[0]}, ${truckLocation[1]}], { icon: truckIcon }).addTo(map).bindPopup('<b>Camión Repartidor en Ruta</b><br>${currentPlate} - Quedan ${stockCount} garrafas');

        map.fitBounds(L.latLngBounds(latlngs), { padding: [30, 30] });
      </script>
    </body>
    </html>
  `;

  return (
    <View style={styles.container}>
      <View style={styles.topSelector}>
        <View style={styles.headerInfo}>
          <SvgIcon name="map" size={16} color={Colors.accentBlue} />
          <Text style={styles.headerTitle}>Mapa en Tiempo Real (La Paz y El Alto)</Text>
        </View>
        <View style={styles.zoneButtons}>
          <Pressable
            style={[styles.zoneChip, activeZone === 'Zona Sur' && styles.zoneChipActive]}
            onPress={() => setActiveZone('Zona Sur')}
          >
            <Text style={[styles.zoneText, activeZone === 'Zona Sur' && styles.zoneTextActive]}>
              Zona Sur (LPZ-1234)
            </Text>
          </Pressable>

          <Pressable
            style={[styles.zoneChip, activeZone === 'Zona Norte' && styles.zoneChipActive]}
            onPress={() => setActiveZone('Zona Norte')}
          >
            <Text style={[styles.zoneText, activeZone === 'Zona Norte' && styles.zoneTextActive]}>
              Zona Norte (ABC-1234)
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={styles.mapFrame}>
        {Platform.OS === 'web' ? (
          // @ts-ignore - En entorno web renderizamos iframe nativo para Leaflet OpenStreetMap
          <iframe
            srcDoc={leafletHTML}
            style={{ width: '100%', height: '100%', border: 'none' }}
            title="Mapa en Tiempo Real La Paz"
          />
        ) : (
          <WebView
            originWhitelist={['*']}
            source={{ html: leafletHTML }}
            style={styles.webview}
            javaScriptEnabled={true}
            domStorageEnabled={true}
          />
        )}
        <View style={styles.truckBadge}>
          <SvgIcon name="truck" size={14} color={Colors.textInverse} />
          <Text style={styles.truckBadgeText}>
            {currentPlate} · {stockCount} garrafas restantes
          </Text>
        </View>
      </View>

      <View style={styles.stopsList}>
        <Text style={styles.stopsHeader}>ITINERARIO Y HORAS APROXIMADAS DE PASO</Text>
        {currentStops.map((stop, idx) => (
          <View key={idx} style={[styles.stopRow, stop.status === 'En curso' && styles.stopRowCurrent]}>
            <View style={styles.orderBadge}>
              <Text style={styles.orderText}>{idx + 1}</Text>
            </View>
            <View style={styles.stopDetails}>
              <Text style={styles.stopName}>{stop.name}</Text>
              <Text style={styles.stopTime}>Paso estimado: {stop.time}</Text>
            </View>
            <Badge
              label={stop.status}
              variant={stop.status === 'Completada' ? 'success' : stop.status === 'En curso' ? 'warning' : 'neutral'}
              size="sm"
            />
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surface,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
    marginBottom: Spacing.md,
  },
  topSelector: {
    padding: Spacing.sm,
    backgroundColor: Colors.surfaceSubtle,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 6,
  },
  headerTitle: {
    fontSize: 13,
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  zoneButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  zoneChip: {
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
    backgroundColor: Colors.surface,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  zoneChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  zoneText: {
    fontSize: 11,
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  zoneTextActive: {
    color: Colors.textInverse,
    fontWeight: '800',
  },
  mapFrame: {
    height: 250,
    width: '100%',
    position: 'relative',
  },
  webview: {
    flex: 1,
  },
  truckBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: 'rgba(15, 23, 42, 0.9)',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingVertical: 5,
    paddingHorizontal: 10,
    borderRadius: Radius.pill,
  },
  truckBadgeText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '700',
  },
  stopsList: {
    padding: Spacing.sm,
  },
  stopsHeader: {
    fontSize: 10,
    fontWeight: '800',
    color: Colors.textMuted,
    letterSpacing: 0.6,
    marginBottom: Spacing.xs,
  },
  stopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    gap: 8,
  },
  stopRowCurrent: {
    backgroundColor: '#FFFBEB',
    borderRadius: Radius.sm,
    paddingHorizontal: 4,
  },
  orderBadge: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  orderText: {
    color: Colors.textInverse,
    fontSize: 11,
    fontWeight: '800',
  },
  stopDetails: {
    flex: 1,
  },
  stopName: {
    fontSize: 12,
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  stopTime: {
    fontSize: 11,
    color: Colors.textMuted,
  },
});
