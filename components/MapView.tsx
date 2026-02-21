
import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { HistoryItem, AppTheme, AppLanguage, TRANSLATIONS } from '../types';
import { IconChevronDown } from './Icons';

interface MapViewProps {
  history: HistoryItem[];
  onClose: () => void;
  theme: AppTheme;
  language: AppLanguage;
}

export const MapView: React.FC<MapViewProps> = ({ history, onClose, theme, language }) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language].map;

  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    // Filter items with location
    const locations = history.filter(item => item.location);
    const defaultCenter: [number, number] = locations.length > 0 
        ? [locations[0].location!.lat, locations[0].location!.lng] 
        : [39.9042, 116.4074]; // Default to Beijing

    // Initialize Map
    const map = L.map(mapContainerRef.current, {
        center: defaultCenter,
        zoom: 13,
        zoomControl: false,
        attributionControl: false
    });

    // Dark/Light Tiles
    const tileUrl = isDark 
        ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png' 
        : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
    
    L.tileLayer(tileUrl, {
        maxZoom: 19,
        subdomains: 'abcd',
    }).addTo(map);

    // Custom Icon
    const createIcon = (thumbnail?: string) => {
        if (thumbnail) {
             return L.divIcon({
                className: 'custom-pin',
                html: `<div style="width: 48px; height: 48px; border-radius: 50%; border: 3px solid white; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.5); background: #333;">
                         <img src="${thumbnail}" style="width: 100%; height: 100%; object-fit: cover;" />
                       </div>
                       <div style="position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 0; height: 0; border-left: 8px solid transparent; border-right: 8px solid transparent; border-top: 10px solid white;"></div>`,
                iconSize: [48, 56],
                iconAnchor: [24, 56],
                popupAnchor: [0, -60]
            });
        }
        return L.divIcon({
            className: 'custom-pin',
            html: `<div style="width: 24px; height: 24px; border-radius: 50%; background: #4F46E5; border: 2px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.5);"></div>`,
            iconSize: [24, 24],
            iconAnchor: [12, 12],
            popupAnchor: [0, -12]
        });
    };

    // Add Markers
    locations.forEach(item => {
        if (item.location) {
            const marker = L.marker([item.location.lat, item.location.lng], {
                icon: createIcon(item.thumbnail)
            }).addTo(map);

            const popupContent = `
                <div class="text-sm font-sans">
                    <h3 class="font-bold text-base mb-1">${item.title}</h3>
                    <p class="text-gray-300 line-clamp-2">${item.essence}</p>
                    ${item.mapUri ? `<a href="${item.mapUri}" target="_blank" class="block mt-2 text-blue-400 underline">${t.openMaps}</a>` : ''}
                </div>
            `;
            marker.bindPopup(popupContent);
        }
    });
    
    // Fit bounds if multiple locations
    if (locations.length > 1) {
        const group = L.featureGroup(locations.map(item => L.marker([item.location!.lat, item.location!.lng])));
        map.fitBounds(group.getBounds(), { padding: [50, 50] });
    }

    mapInstanceRef.current = map;

    return () => {
        if (mapInstanceRef.current) {
            mapInstanceRef.current.remove();
            mapInstanceRef.current = null;
        }
    };
  }, [theme, language]); // Re-init if theme or language changes

  return (
    <div className="absolute inset-0 z-30 bg-black animate-fade-in flex flex-col">
        {/* Header - Z-index increased to 2000 to sit above Leaflet controls */}
        <div className={`pt-12 px-6 pb-4 flex items-center justify-between z-[2000] ${isDark ? 'bg-black/60' : 'bg-white/80'} backdrop-blur-md absolute top-0 inset-x-0`}>
            <h1 className={`text-2xl font-light tracking-wide ${isDark ? 'text-white' : 'text-gray-900'}`}>{t.title}</h1>
            <button 
                onClick={onClose} 
                className={`p-2 rounded-full ${isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-black/5 hover:bg-black/10 text-gray-900'}`}
            >
                <IconChevronDown className="w-6 h-6" />
            </button>
        </div>
        
        <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
};
