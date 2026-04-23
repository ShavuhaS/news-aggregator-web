import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents, useMap } from 'react-leaflet';
import L from 'leaflet';
import { Button } from '@/components/ui/button';
import { LocateFixed } from 'lucide-react';

import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

const DefaultIcon = L.icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

function MapEvents({ onLocationSelect }: { onLocationSelect: (lat: number, lon: number) => void }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });
  return null;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center);
  }, [center, map]);
  return null;
}

interface NearbyMapProps {
  lat: number;
  lon: number;
  dist: number;
  onLocationSelect: (lat: number, lon: number) => void;
  onUserLocate: () => void;
}

export function NearbyMap({ lat, lon, dist, onLocationSelect, onUserLocate }: NearbyMapProps) {
  return (
    <div className="h-[400px] lg:h-[500px] rounded-3xl overflow-hidden border-2 border-muted shadow-inner relative z-0">
      <MapContainer center={[lat, lon]} zoom={10} style={{ height: '100%', width: '100%' }}>
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={[lat, lon]} />
        <MapEvents onLocationSelect={onLocationSelect} />
        <Marker position={[lat, lon]} />
        <Circle 
          center={[lat, lon]} 
          radius={dist * 1000} 
          pathOptions={{ fillColor: 'hsl(var(--primary))', fillOpacity: 0.1, color: 'hsl(var(--primary))', weight: 1 }} 
        />
      </MapContainer>
      
      <Button 
        variant="secondary" 
        size="sm" 
        onClick={onUserLocate}
        className="absolute bottom-4 right-4 z-[1000] shadow-xl font-bold uppercase text-[10px] tracking-widest gap-2 bg-background/90 backdrop-blur"
      >
        <LocateFixed className="h-4 w-4" />
        Моя локація
      </Button>
    </div>
  );
}
