import React, { useState, useMemo, useEffect } from 'react';
import { 
  MapPin, 
  AlertTriangle, 
  Ban, 
  CheckCircle2, 
  ShieldAlert, 
  Store, 
  Phone, 
  Navigation, 
  Search, 
  Filter, 
  ZoomIn, 
  ZoomOut, 
  Layers,
  Crosshair,
  Sun,
  Cloud,
  CloudRain,
  CloudSun,
  CloudLightning,
  Wind,
  Droplets,
  Thermometer,
  Gauge,
  ExternalLink,
  RefreshCw,
  Globe,
  Sparkles,
  Map as MapIcon,
  ShieldCheck,
  Compass,
  Satellite,
  Radio,
  ArrowRight,
  Moon
} from 'lucide-react';
import { AffectedStoreLocation } from '../types';

interface PuneRegionMapProps {
  stores: AffectedStoreLocation[];
  currentBatchId?: string;
  isExpiredBatch?: boolean;
  onQuarantineStore?: (storeName: string) => void;
  quarantinedStoreNames?: string[];
  onSelectStore?: (store: AffectedStoreLocation) => void;
}

export interface PuneWeatherData {
  temperature: number;
  humidity: number;
  apparentTemp: number;
  windSpeed: number;
  weatherCode: number;
  isDay: boolean;
  rain: number;
  pressure: number;
  cloudCover: number;
  lastUpdated: string;
}

export const DEFAULT_PUNE_WEATHER: PuneWeatherData = {
  temperature: 26.4,
  humidity: 69,
  apparentTemp: 27.9,
  windSpeed: 17.1,
  weatherCode: 1,
  isDay: true,
  rain: 0,
  pressure: 1010.4,
  cloudCover: 30,
  lastUpdated: '16:30 IST'
};

const PUNE_HOURLY_FORECAST = [
  { time: 'Now', temp: 26.4, pop: 10 },
  { time: '18:00', temp: 25.8, pop: 15 },
  { time: '19:00', temp: 24.6, pop: 20 },
  { time: '20:00', temp: 23.9, pop: 10 },
  { time: '21:00', temp: 23.2, pop: 5 },
  { time: '22:00', temp: 22.8, pop: 5 },
];

const PUNE_MICRO_ZONES_WEATHER = [
  { zone: 'Viman Nagar / Airport Corridor', temp: 26.5, hum: 68, cond: 'Partly Cloudy', status: 'Optimal' },
  { zone: 'Hinjawadi IT Belt / Wakad', temp: 25.9, hum: 71, cond: 'Passing Clouds', status: 'Moderate Hum' },
  { zone: 'PCMC / Chinchwad Industrial', temp: 26.8, hum: 66, cond: 'Dry Breezy', status: 'Optimal' },
  { zone: 'Camp / MG Road Central', temp: 26.2, hum: 70, cond: 'Scattered Clouds', status: 'Optimal' },
  { zone: 'Kothrud / Mutha Valley', temp: 25.6, hum: 73, cond: 'Mild Breeze', status: 'Good' },
];

// Bounding box for Pune Metropolitan Region (MH-12)
const PUNE_BOUNDS = {
  minLat: 18.440,
  maxLat: 18.650,
  minLng: 73.715,
  maxLng: 73.970,
};

// Major Pune Localities & Landmarks for map topography
const PUNE_TOPOGRAPHY_LANDMARKS = [
  { name: 'PCMC / Chinchwad', lat: 18.6279, lng: 73.8009, labelPos: 'top' },
  { name: 'Hinjawadi IT Park', lat: 18.5913, lng: 73.7389, labelPos: 'left' },
  { name: 'Wakad', lat: 18.5985, lng: 73.7660, labelPos: 'top' },
  { name: 'Baner', lat: 18.5590, lng: 73.7868, labelPos: 'left' },
  { name: 'Aundh', lat: 18.5602, lng: 73.8077, labelPos: 'top' },
  { name: 'Shivajinagar', lat: 18.5308, lng: 73.8475, labelPos: 'top' },
  { name: 'Kothrud', lat: 18.5074, lng: 73.8077, labelPos: 'left' },
  { name: 'Deccan Gymkhana', lat: 18.5165, lng: 73.8415, labelPos: 'right' },
  { name: 'Camp / MG Road', lat: 18.5175, lng: 73.8785, labelPos: 'right' },
  { name: 'Koregaon Park', lat: 18.5362, lng: 73.8940, labelPos: 'right' },
  { name: 'Viman Nagar', lat: 18.5626, lng: 73.9168, labelPos: 'right' },
  { name: 'Kharadi IT Belt', lat: 18.5515, lng: 73.9450, labelPos: 'right' },
  { name: 'Hadapsar / Magarpatta', lat: 18.5196, lng: 73.9315, labelPos: 'bottom' },
  { name: 'Swargate / Tilak Rd', lat: 18.5018, lng: 73.8527, labelPos: 'bottom' },
  { name: 'Katraj', lat: 18.4529, lng: 73.8552, labelPos: 'bottom' },
];

export const PuneRegionMap: React.FC<PuneRegionMapProps> = ({
  stores,
  currentBatchId = 'LAY-EXP-2025-09',
  isExpiredBatch = true,
  onQuarantineStore,
  quarantinedStoreNames = [],
  onSelectStore
}) => {
  const [selectedStore, setSelectedStore] = useState<AffectedStoreLocation | null>(stores[0] || null);
  const [selectedZone, setSelectedZone] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'violating' | 'quarantined'>('all');
  const [mapSearch, setMapSearch] = useState<string>('');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [showContainmentZones, setShowContainmentZones] = useState<boolean>(true);
  const [hoveredStore, setHoveredStore] = useState<AffectedStoreLocation | null>(null);

  // New: Map Mode (Radar vs Google Maps vs OpenWeather)
  const [mapMode, setMapMode] = useState<'radar' | 'google' | 'weather'>('radar');
  const [googleMapType, setGoogleMapType] = useState<'m' | 'k'>('m'); // m = street, k = satellite
  const [mapTheme, setMapTheme] = useState<'light' | 'dark'>('light'); // White cartographic GIS vs Dark radar
  const [weather, setWeather] = useState<PuneWeatherData>(DEFAULT_PUNE_WEATHER);
  const [isWeatherLoading, setIsWeatherLoading] = useState<boolean>(false);
  const [isWeatherDrawerOpen, setIsWeatherDrawerOpen] = useState<boolean>(false);

  // Live Open-Meteo / OpenWeather API fetch for Pune (MH-12)
  const fetchLiveWeather = async () => {
    setIsWeatherLoading(true);
    try {
      const res = await fetch(
        'https://api.open-meteo.com/v1/forecast?latitude=18.5204&longitude=73.8567&current=temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,rain,weather_code,cloud_cover,pressure_msl,wind_speed_10m&timezone=Asia%2FKolkata'
      );
      if (res.ok) {
        const data = await res.json();
        if (data.current) {
          setWeather({
            temperature: Math.round(data.current.temperature_2m * 10) / 10,
            humidity: data.current.relative_humidity_2m,
            apparentTemp: Math.round(data.current.apparent_temperature * 10) / 10,
            windSpeed: Math.round(data.current.wind_speed_10m * 10) / 10,
            weatherCode: data.current.weather_code,
            isDay: Boolean(data.current.is_day),
            rain: data.current.rain || 0,
            pressure: Math.round(data.current.pressure_msl),
            cloudCover: data.current.cloud_cover,
            lastUpdated: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) + ' IST'
          });
        }
      }
    } catch (e) {
      console.warn('Live weather fetch fallback active', e);
    } finally {
      setIsWeatherLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveWeather();
    const interval = setInterval(fetchLiveWeather, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  const getWeatherInfo = (code: number) => {
    if (code === 0) return { text: 'Clear Sky', icon: Sun, color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' };
    if (code === 1 || code === 2) return { text: 'Partly Cloudy', icon: CloudSun, color: 'text-cyan-300', badge: 'bg-cyan-500/20 text-cyan-300' };
    if (code === 3) return { text: 'Overcast', icon: Cloud, color: 'text-slate-300', badge: 'bg-slate-500/20 text-slate-300' };
    if (code >= 51 && code <= 67) return { text: 'Passing Showers', icon: CloudRain, color: 'text-blue-400', badge: 'bg-blue-500/20 text-blue-300' };
    if (code >= 80 && code <= 82) return { text: 'Heavy Downpour', icon: CloudRain, color: 'text-indigo-400', badge: 'bg-indigo-500/20 text-indigo-300' };
    if (code >= 95) return { text: 'Thunderstorm Warning', icon: CloudLightning, color: 'text-amber-400', badge: 'bg-amber-500/20 text-amber-300' };
    return { text: 'Partly Cloudy', icon: CloudSun, color: 'text-teal-300', badge: 'bg-teal-500/20 text-teal-300' };
  };

  // SVG dimensions
  const svgWidth = 920;
  const svgHeight = 620;
  const padding = 55;

  // Coordinate projection from Lat/Lng to SVG Canvas
  const projectCoords = (lat: number, lng: number) => {
    const x = padding + ((lng - PUNE_BOUNDS.minLng) / (PUNE_BOUNDS.maxLng - PUNE_BOUNDS.minLng)) * (svgWidth - 2 * padding);
    const y = svgHeight - padding - ((lat - PUNE_BOUNDS.minLat) / (PUNE_BOUNDS.maxLat - PUNE_BOUNDS.minLat)) * (svgHeight - 2 * padding);
    return { x, y };
  };

  // Filtered stores
  const filteredStores = useMemo(() => {
    return stores.filter((store) => {
      const isQ = store.status === 'quarantined' || quarantinedStoreNames.includes(store.storeName);
      
      // Status filter
      if (statusFilter === 'violating' && isQ) return false;
      if (statusFilter === 'quarantined' && !isQ) return false;

      // Zone filter
      if (selectedZone !== 'all') {
        const area = (store.areaDistrict || '').toLowerCase() + ' ' + (store.locality || '').toLowerCase() + ' ' + store.storeAddress.toLowerCase();
        if (selectedZone === 'north_pcmc' && !area.includes('chinchwad') && !area.includes('pcmc') && !area.includes('nigdi')) return false;
        if (selectedZone === 'west_hinjawadi' && !area.includes('hinjawadi') && !area.includes('wakad') && !area.includes('baner')) return false;
        if (selectedZone === 'east_viman' && !area.includes('viman') && !area.includes('kharadi') && !area.includes('nagar rd')) return false;
        if (selectedZone === 'central_camp' && !area.includes('camp') && !area.includes('koregaon') && !area.includes('shivajinagar')) return false;
        if (selectedZone === 'south_kothrud' && !area.includes('kothrud') && !area.includes('swargate') && !area.includes('hadapsar')) return false;
      }

      // Search query
      if (mapSearch.trim()) {
        const q = mapSearch.toLowerCase();
        const matches = 
          store.storeName.toLowerCase().includes(q) ||
          store.storeAddress.toLowerCase().includes(q) ||
          (store.locality && store.locality.toLowerCase().includes(q)) ||
          store.areaDistrict.toLowerCase().includes(q);
        if (!matches) return false;
      }

      return true;
    });
  }, [stores, quarantinedStoreNames, statusFilter, selectedZone, mapSearch]);

  const activeViolatingCount = stores.filter(
    s => s.status !== 'quarantined' && !quarantinedStoreNames.includes(s.storeName)
  ).length;

  const quarantinedCount = stores.filter(
    s => s.status === 'quarantined' || quarantinedStoreNames.includes(s.storeName)
  ).length;

  const totalShelfRiskUnits = stores.reduce(
    (sum, s) => sum + (quarantinedStoreNames.includes(s.storeName) || s.status === 'quarantined' ? 0 : s.remainingUnits), 
    0
  );

  const handleStoreClick = (store: AffectedStoreLocation) => {
    setSelectedStore(store);
    if (onSelectStore) onSelectStore(store);
  };

  return (
    <div className="space-y-4 rounded-2xl bg-white border border-slate-300 shadow-sm p-5 animate-in fade-in">
      {/* Pune Region Top Header Banner */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-rose-600 animate-ping" />
            <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
              <span>Pune Region (MH-12) Enforcement & Surveillance Map</span>
              <span className="px-2.5 py-0.5 text-xs font-mono font-black rounded-full bg-rose-100 text-rose-800 border border-rose-300">
                ACTIVE RECALL SURVEILLANCE
              </span>
            </h3>
          </div>
          <p className="text-xs text-slate-600 font-medium mt-1">
            Geospatial surveillance grid across Pune Metropolitan Area locating retail stores selling non-compliant batch <strong className="font-mono text-blue-900">{currentBatchId}</strong>.
          </p>
        </div>

        {/* Live Counters */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs">
            <span className="text-slate-500 font-bold block text-[10px] uppercase">Mapped Stores</span>
            <span className="font-black text-slate-900 text-sm">{stores.length} Outlets</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-rose-50 border border-rose-300 text-xs">
            <span className="text-rose-700 font-bold block text-[10px] uppercase">Active on Shelf</span>
            <span className="font-black text-rose-700 text-sm">{activeViolatingCount} Stores ({totalShelfRiskUnits} units)</span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-emerald-50 border border-emerald-300 text-xs">
            <span className="text-emerald-700 font-bold block text-[10px] uppercase">Quarantined</span>
            <span className="font-black text-emerald-800 text-sm">{quarantinedCount} Outlets</span>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs">
        {/* Search */}
        <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-lg border border-slate-300 w-full md:w-64">
          <Search size={14} className="text-slate-400" />
          <input 
            type="text"
            placeholder="Search Pune stores or areas..."
            value={mapSearch}
            onChange={(e) => setMapSearch(e.target.value)}
            className="w-full bg-transparent text-xs text-slate-800 placeholder-slate-400 focus:outline-none"
          />
          {mapSearch && (
            <button onClick={() => setMapSearch('')} className="text-[10px] text-slate-400 hover:text-black">✕</button>
          )}
        </div>

        {/* Zone Selector */}
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="text-slate-500 font-bold text-[11px] mr-1 flex items-center gap-1">
            <Filter size={12} /> Zone:
          </span>
          {[
            { id: 'all', label: 'All Pune (MH-12)' },
            { id: 'east_viman', label: 'Viman Nagar / Kharadi' },
            { id: 'west_hinjawadi', label: 'Hinjawadi / Baner' },
            { id: 'north_pcmc', label: 'PCMC / Chinchwad' },
            { id: 'central_camp', label: 'Camp / Koregaon' },
            { id: 'south_kothrud', label: 'Kothrud / Swargate' },
          ].map((z) => (
            <button
              key={z.id}
              onClick={() => setSelectedZone(z.id)}
              className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-colors ${
                selectedZone === z.id 
                  ? 'bg-blue-600 text-white shadow-2xs' 
                  : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
              }`}
            >
              {z.label}
            </button>
          ))}
        </div>

        {/* Status Filter & Map Toggles */}
        <div className="flex items-center gap-2">
          <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-2 py-1 rounded text-[11px] font-bold ${
                statusFilter === 'all' ? 'bg-slate-800 text-white' : 'text-slate-600 hover:text-black'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setStatusFilter('violating')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                statusFilter === 'violating' ? 'bg-rose-600 text-white' : 'text-rose-700 hover:text-rose-900'
              }`}
            >
              <AlertTriangle size={11} /> Violating
            </button>
            <button
              onClick={() => setStatusFilter('quarantined')}
              className={`px-2 py-1 rounded text-[11px] font-bold flex items-center gap-1 ${
                statusFilter === 'quarantined' ? 'bg-emerald-600 text-white' : 'text-emerald-700 hover:text-emerald-900'
              }`}
            >
              <CheckCircle2 size={11} /> Quarantined
            </button>
          </div>

          <button
            onClick={() => setShowContainmentZones(!showContainmentZones)}
            className={`p-1.5 rounded-lg border text-xs font-bold flex items-center gap-1 ${
              showContainmentZones 
                ? 'bg-amber-100 border-amber-300 text-amber-900' 
                : 'bg-white border-slate-300 text-slate-600'
            }`}
            title="Toggle Containment Rings"
          >
            <Layers size={14} />
          </button>

          <div className="flex items-center border border-slate-300 rounded-lg bg-white overflow-hidden">
            <button 
              onClick={() => setZoomLevel(prev => Math.min(prev + 0.15, 1.5))}
              className="p-1 hover:bg-slate-100 text-slate-700"
              title="Zoom In"
            >
              <ZoomIn size={14} />
            </button>
            <button 
              onClick={() => setZoomLevel(1)}
              className="px-1.5 py-0.5 text-[10px] font-mono font-bold text-slate-600 border-x border-slate-200 hover:bg-slate-100"
              title="Reset Zoom"
            >
              {Math.round(zoomLevel * 100)}%
            </button>
            <button 
              onClick={() => setZoomLevel(prev => Math.max(prev - 0.15, 0.85))}
              className="p-1 hover:bg-slate-100 text-slate-700"
              title="Zoom Out"
            >
              <ZoomOut size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Interactive Map & Details Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
        {/* Pune Map Canvas Area (col-span-8) */}
        <div className={`lg:col-span-8 relative ${mapTheme === 'light' ? 'bg-white border-slate-300 shadow-sm' : 'bg-slate-950 border-slate-800 shadow-inner'} rounded-2xl border overflow-hidden min-h-[500px] transition-colors duration-200`}>
          {/* Top Floating Map Controls, Mode Selector & OpenWeather Live Pill */}
          <div className="absolute top-3 left-3 right-3 z-30 flex flex-wrap items-center justify-between gap-2 pointer-events-auto">
            {/* Left: Unit & Grid Info */}
            <div className={`px-3 py-2 rounded-xl border backdrop-blur-md shadow-md ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 text-slate-900' : 'bg-slate-900/90 border-slate-700/80 text-white'}`}>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black bg-blue-600 text-white">
                  MH-12 PUNE DIVISION
                </span>
                <span className={`text-xs font-bold ${mapTheme === 'light' ? 'text-slate-800' : 'text-slate-200'}`}>Enforcement Map Grid</span>
              </div>
              <div className={`text-[10px] font-mono mt-0.5 ${mapTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                Perimeter: 18.45°N - 18.64°N | 73.72°E - 73.96°E
              </div>
            </div>

            {/* Center: Mode Selector Toggle (Tactical Radar vs Google Maps vs OpenWeather) */}
            <div className={`flex items-center backdrop-blur-md p-1 rounded-xl border shadow-md text-xs ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 text-slate-700' : 'bg-slate-900/90 border-slate-700 text-slate-300'}`}>
              <button
                type="button"
                onClick={() => setMapMode('radar')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapMode === 'radar' 
                    ? 'bg-blue-600 text-white shadow-xs' 
                    : mapTheme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Tactical Vector Radar Grid"
              >
                <Crosshair size={13} />
                <span>Tactical Radar</span>
              </button>

              <button
                type="button"
                onClick={() => setMapMode('google')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapMode === 'google' 
                    ? 'bg-emerald-600 text-white shadow-xs' 
                    : mapTheme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="Real Google Maps Satellite & Street View"
              >
                <Globe size={13} />
                <span>Real Google Maps</span>
              </button>

              <button
                type="button"
                onClick={() => setMapMode('weather')}
                className={`px-3 py-1.5 rounded-lg font-black transition-all flex items-center gap-1.5 cursor-pointer ${
                  mapMode === 'weather' 
                    ? 'bg-cyan-600 text-white shadow-xs' 
                    : mapTheme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100' : 'text-slate-300 hover:text-white hover:bg-slate-800'
                }`}
                title="OpenWeather Live Meteorological Station"
              >
                <CloudSun size={13} />
                <span>OpenWeather App</span>
              </button>
            </div>

            {/* Right: Real OpenWeather Live Badge */}
            {/* Right: Theme Switcher & Real OpenWeather Live Badge */}
            <div className="flex items-center gap-1.5">
              {/* White / Dark Mode Switcher */}
              <button
                type="button"
                onClick={() => setMapTheme(mapTheme === 'light' ? 'dark' : 'light')}
                className={`px-3 py-2 rounded-xl border backdrop-blur-md shadow-md text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer ${
                  mapTheme === 'light' 
                    ? 'bg-white/95 border-slate-300 text-slate-800 hover:bg-slate-100 ring-1 ring-slate-200' 
                    : 'bg-slate-900/90 border-slate-700 text-slate-200 hover:bg-slate-800'
                }`}
                title={mapTheme === 'light' ? 'Switch to Dark Radar Map' : 'Switch to White Cartographic Map'}
              >
                {mapTheme === 'light' ? (
                  <>
                    <Sun size={14} className="text-amber-500" />
                    <span className="font-mono text-[11px] font-black text-slate-900">WHITE MAP</span>
                  </>
                ) : (
                  <>
                    <Moon size={14} className="text-indigo-400" />
                    <span className="font-mono text-[11px] font-bold text-slate-300">DARK MAP</span>
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={() => setMapMode(mapMode === 'weather' ? 'radar' : 'weather')}
                className={`px-3 py-2 rounded-xl border backdrop-blur-md shadow-md flex items-center gap-2 cursor-pointer transition-all group ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 hover:border-cyan-500 text-slate-800 hover:bg-slate-50' : 'bg-slate-900/90 border-slate-700 hover:border-cyan-500 text-white hover:bg-slate-800'}`}
                title="Click to view OpenWeather App & Inspection Advisory"
              >
                {(() => {
                  const info = getWeatherInfo(weather.weatherCode);
                  const Icon = info.icon;
                  return (
                    <>
                      <Icon size={16} className={`${info.color} group-hover:scale-110 transition-transform`} />
                      <div className="text-left leading-tight">
                        <div className="flex items-center gap-1.5 text-xs font-black">
                          <span className={mapTheme === 'light' ? 'text-slate-900 font-mono' : 'text-white font-mono'}>{weather.temperature}°C</span>
                          <span className="text-slate-400 text-[10px]">•</span>
                          <span className={mapTheme === 'light' ? 'text-cyan-700 text-[11px] font-bold' : 'text-cyan-300 text-[11px] font-bold'}>{info.text}</span>
                        </div>
                        <div className={`text-[9px] font-mono ${mapTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                          Hum: <strong className="text-slate-200">{weather.humidity}%</strong> | Wind: <strong className="text-slate-200">{weather.windSpeed}km/h</strong>
                        </div>
                      </div>
                    </>
                  );
                })()}
              </button>

              <button
                type="button"
                onClick={fetchLiveWeather}
                disabled={isWeatherLoading}
                className={`p-2.5 rounded-xl border backdrop-blur-md transition-all cursor-pointer shadow-md disabled:opacity-50 ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 hover:border-slate-400 text-slate-700 hover:text-slate-900' : 'bg-slate-900/90 border-slate-700 hover:border-slate-500 text-slate-300 hover:text-white'}`}
                title="Refresh Live Weather from Station"
              >
                <RefreshCw size={13} className={isWeatherLoading ? 'animate-spin text-cyan-400' : ''} />
              </button>
            </div>
          </div>

          {/* Mode 1: Tactical Radar Map View */}
          {mapMode === 'radar' && (
            <>
              {/* Quick Legend in bottom right */}
              <div className={`absolute bottom-3 right-3 z-10 backdrop-blur-md p-2.5 rounded-xl border text-[11px] space-y-1.5 pointer-events-none shadow-xl ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/90 border-slate-700/80 text-white'}`}>
                <div className={`text-[10px] font-mono font-bold uppercase tracking-wider ${mapTheme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Map Legend</div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-rose-500 border border-white flex-shrink-0 animate-pulse" />
                  <span className={mapTheme === 'light' ? 'text-rose-700 font-bold' : 'text-rose-300 font-bold'}>Violating Store (On Shelf)</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-emerald-500 border border-white flex-shrink-0" />
                  <span className={mapTheme === 'light' ? 'text-emerald-700 font-bold' : 'text-emerald-300 font-bold'}>Quarantined / Notice Served</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-cyan-400 rounded-full flex-shrink-0" />
                  <span className={mapTheme === 'light' ? 'text-cyan-700 font-bold' : 'text-cyan-300 font-bold'}>Mula & Mutha Rivers</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-1 bg-amber-400/80 border-t border-dashed border-amber-300 flex-shrink-0" />
                  <span className={mapTheme === 'light' ? 'text-amber-800 font-bold' : 'text-amber-200 font-bold'}>Containment Perimeter</span>
                </div>
              </div>

          {/* SVG Map Canvas */}
          <div className="w-full h-full overflow-hidden flex items-center justify-center p-2">
            <svg 
              viewBox={`0 0 ${svgWidth} ${svgHeight}`} 
              className="w-full h-auto transition-transform duration-300 ease-out select-none"
              style={{ transform: `scale(${zoomLevel})` }}
            >
              <defs>
                {/* Background Grid Pattern */}
                <pattern id="puneGrid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke={mapTheme === 'light' ? '#e2e8f0' : '#1e293b'} strokeWidth="0.75" />
                </pattern>

                {/* Radar sweep glow */}
                <radialGradient id="radarGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#ef4444" stopOpacity="0.4" />
                  <stop offset="70%" stopColor="#ef4444" stopOpacity="0.1" />
                  <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
                </radialGradient>

                <radialGradient id="vimanGlow" cx="50%" cy="50%" r="50%">
                  <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.35" />
                  <stop offset="100%" stopColor="#f59e0b" stopOpacity="0" />
                </radialGradient>

                {/* Store Pin Filter Shadow */}
                <filter id="pinShadow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#000" floodOpacity="0.6" />
                </filter>
              </defs>

              {/* Base Background Grid */}
              <rect width={svgWidth} height={svgHeight} fill={mapTheme === 'light' ? '#ffffff' : '#090d16'} />
              <rect width={svgWidth} height={svgHeight} fill="url(#puneGrid)" opacity={mapTheme === 'light' ? 0.9 : 0.7} />

              {/* Administrative Boundary Outline of Pune Metropolitan District (MH-12) */}
              <path
                d="M 120 70 C 260 40, 420 50, 600 65 C 750 80, 830 160, 850 280 C 865 390, 810 520, 690 570 C 560 610, 420 590, 260 560 C 130 530, 80 430, 75 310 C 70 190, 85 95, 120 70 Z"
                fill={mapTheme === 'light' ? '#f8fafc' : '#0e1726'}
                stroke={mapTheme === 'light' ? '#94a3b8' : '#334155'}
                strokeWidth="2.5"
                strokeDasharray="6,4"
              />

              {/* Sub-District / Zone Patches */}
              {/* PCMC & Chinchwad Zone (North) */}
              <path
                d="M 230 65 C 330 60, 450 75, 480 140 C 470 180, 360 200, 260 190 C 190 180, 180 110, 230 65 Z"
                fill={mapTheme === 'light' ? '#e0f2fe' : '#1e293b'}
                opacity={mapTheme === 'light' ? 0.6 : 0.35}
                stroke="#0284c7"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text x="310" y="115" fill={mapTheme === 'light' ? '#0369a1' : '#38bdf8'} opacity={0.9} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                PCMC / CHINCHWAD ZONE
              </text>

              {/* Hinjawadi IT Hub (West) */}
              <path
                d="M 90 200 C 180 190, 240 230, 230 300 C 180 340, 110 320, 90 270 Z"
                fill={mapTheme === 'light' ? '#f3e8ff' : '#1e293b'}
                opacity={mapTheme === 'light' ? 0.6 : 0.35}
                stroke="#9333ea"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text x="115" y="260" fill={mapTheme === 'light' ? '#7e22ce' : '#c084fc'} opacity={0.9} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                HINJAWADI TECH BELT
              </text>

              {/* Viman Nagar & Kharadi (East) */}
              <path
                d="M 680 190 C 800 180, 840 260, 810 330 C 730 350, 660 300, 670 230 Z"
                fill={mapTheme === 'light' ? '#fef3c7' : '#1e293b'}
                opacity={mapTheme === 'light' ? 0.6 : 0.35}
                stroke="#d97706"
                strokeWidth="1"
                strokeDasharray="3,3"
              />
              <text x="705" y="235" fill={mapTheme === 'light' ? '#b45309' : '#f59e0b'} opacity={0.9} fontSize="11" fontWeight="bold" fontFamily="sans-serif">
                VIMAN NAGAR / KHARADI SECTOR
              </text>

              {/* Mula River & Mutha River Paths (Iconic Pune River Network) */}
              {/* Mula River from Wakad / Aundh through Khadki to Sangam */}
              <path
                d="M 120 220 C 220 230, 280 250, 360 260 C 420 270, 470 280, 520 295"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Mutha River from Kothrud / Karve Rd to Sangam */}
              <path
                d="M 280 480 C 340 440, 390 390, 440 350 C 480 320, 500 305, 520 295"
                fill="none"
                stroke="#0284c7"
                strokeWidth="4"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* Confluent Mula-Mutha flowing towards Mundhwa & Hadapsar */}
              <path
                d="M 520 295 C 580 290, 640 310, 720 330 C 780 345, 830 360, 860 370"
                fill="none"
                stroke="#0284c7"
                strokeWidth="5"
                strokeLinecap="round"
                opacity="0.85"
              />
              {/* River Labels */}
              <text x="240" y="240" fill={mapTheme === 'light' ? '#0369a1' : '#38bdf8'} fontSize="10" fontStyle="italic" fontWeight="bold" opacity={0.85}>Mula River</text>
              <text x="360" y="420" fill={mapTheme === 'light' ? '#0369a1' : '#38bdf8'} fontSize="10" fontStyle="italic" fontWeight="bold" opacity={0.85}>Mutha River</text>
              <text x="580" y="285" fill={mapTheme === 'light' ? '#0369a1' : '#38bdf8'} fontSize="10" fontStyle="italic" fontWeight="bold" opacity={0.85}>Sangam (Mula-Mutha Confluence)</text>

              {/* Major Pune Arterial Highways */}
              {/* NH-48 / Western Bypass (Wakad - Baner - Chandani Chowk - Katraj) */}
              <path
                d="M 190 140 L 220 220 L 260 320 L 290 430 L 370 540"
                fill="none"
                stroke={mapTheme === 'light' ? '#94a3b8' : '#475569'}
                strokeWidth="2.5"
                strokeDasharray="4,2"
                opacity={mapTheme === 'light' ? 0.8 : 0.6}
              />
              <text x="230" y="360" fill={mapTheme === 'light' ? '#475569' : '#94a3b8'} fontSize="9" fontWeight="bold">NH-48 Western Bypass</text>

              {/* Old Mumbai-Pune Highway */}
              <path
                d="M 260 80 L 320 150 L 400 230 L 470 290"
                fill="none"
                stroke="#475569"
                strokeWidth="2.5"
                opacity="0.6"
              />
              <text x="330" y="180" fill={mapTheme === 'light' ? '#475569' : '#94a3b8'} fontSize="9" fontWeight="bold">Old Mumbai-Pune Hwy</text>

              {/* Pune-Ahmednagar Road (Yerawada - Viman Nagar) */}
              <path
                d="M 530 280 L 650 250 L 760 220 L 850 190"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                opacity="0.6"
              />
              <text x="660" y="225" fill={mapTheme === 'light' ? '#475569' : '#94a3b8'} fontSize="9" fontWeight="bold">Pune-Nagar Road</text>

              {/* Pune-Solapur Road (Camp - Hadapsar) */}
              <path
                d="M 520 330 L 630 380 L 740 430 L 830 470"
                fill="none"
                stroke="#475569"
                strokeWidth="2"
                opacity="0.6"
              />
              <text x="640" y="415" fill={mapTheme === 'light' ? '#475569' : '#94a3b8'} fontSize="9" fontWeight="bold">Pune-Solapur Road</text>

              {/* Topography Landmark Labels */}
              {PUNE_TOPOGRAPHY_LANDMARKS.map((lm, idx) => {
                const { x, y } = projectCoords(lm.lat, lm.lng);
                return (
                  <g key={idx} className="pointer-events-none select-none">
                    <circle cx={x} cy={y} r="2.5" fill="#64748b" opacity="0.8" />
                    <text 
                      x={lm.labelPos === 'right' ? x + 6 : lm.labelPos === 'left' ? x - 6 : x}
                      y={lm.labelPos === 'top' ? y - 6 : lm.labelPos === 'bottom' ? y + 12 : y + 3}
                      textAnchor={lm.labelPos === 'right' ? 'start' : lm.labelPos === 'left' ? 'end' : 'middle'}
                      fill={mapTheme === 'light' ? '#1e293b' : '#94a3b8'}
                      fontSize="10"
                      fontWeight="600"
                      fontFamily="sans-serif"
                    >
                      {lm.name}
                    </text>
                  </g>
                );
              })}

              {/* Containment Zone Circles around High-Risk Clusters */}
              {showContainmentZones && (
                <>
                  {/* Viman Nagar Cluster Containment Ring (Origin Discovery Site) */}
                  <g className="pointer-events-none">
                    <circle cx="735" cy="245" r="80" fill="url(#radarGlow)" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
                    <circle cx="735" cy="245" r="45" fill="none" stroke="#ef4444" strokeWidth="1" strokeDasharray="3,3" opacity="0.5" />
                    <text x="735" y="155" fill={mapTheme === 'light' ? '#b91c1c' : '#fca5a5'} fontSize="10" fontWeight="bold" textAnchor="middle">
                      CONTAINMENT ZONE 1 (Viman Nagar & Nagar Rd)
                    </text>
                  </g>

                  {/* Baner-Hinjawadi Cluster Containment Ring */}
                  <g className="pointer-events-none">
                    <circle cx="240" cy="265" r="65" fill="url(#vimanGlow)" stroke="#f59e0b" strokeWidth="1.5" strokeDasharray="5,3" opacity="0.8" />
                    <text x="240" y="190" fill={mapTheme === 'light' ? '#b45309' : '#fde68a'} fontSize="10" fontWeight="bold" textAnchor="middle">
                      CONTAINMENT ZONE 2 (Baner-Hinjawadi Corridor)
                    </text>
                  </g>
                </>
              )}

              {/* Render Stores Pins */}
              {filteredStores.map((store, idx) => {
                const lat = store.lat || 18.5204;
                const lng = store.lng || 73.8567;
                const { x, y } = projectCoords(lat, lng);
                const isSelected = selectedStore?.storeName === store.storeName;
                const isQuarantined = store.status === 'quarantined' || quarantinedStoreNames.includes(store.storeName);

                return (
                  <g 
                    key={idx}
                    onClick={() => handleStoreClick(store)}
                    onMouseEnter={() => setHoveredStore(store)}
                    onMouseLeave={() => setHoveredStore(null)}
                    className="cursor-pointer transition-all duration-200"
                    filter="url(#pinShadow)"
                  >
                    {/* Animated Pulsing Radar Rings for Active Violation Stores */}
                    {!isQuarantined && (
                      <>
                        <circle cx={x} cy={y} r="18" fill="none" stroke="#ef4444" strokeWidth="1.5" opacity="0.7">
                          <animate attributeName="r" values="12;28" dur="2s" repeatCount="indefinite" />
                          <animate attributeName="opacity" values="0.8;0" dur="2s" repeatCount="indefinite" />
                        </circle>
                        <circle cx={x} cy={y} r="8" fill="#ef4444" opacity="0.25" />
                      </>
                    )}

                    {/* Selected Store Target Reticle */}
                    {isSelected && (
                      <g className="pointer-events-none">
                        <circle cx={x} cy={y} r="22" fill="none" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4,2">
                          <animateTransform attributeName="transform" type="rotate" from={`0 ${x} ${y}`} to={`360 ${x} ${y}`} dur="8s" repeatCount="indefinite" />
                        </circle>
                        <line x1={x - 26} y1={y} x2={x + 26} y2={y} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
                        <line x1={x} y1={y - 26} x2={x} y2={y + 26} stroke="#38bdf8" strokeWidth="1" strokeDasharray="2,2" opacity="0.8" />
                      </g>
                    )}

                    {/* Pin Shape */}
                    <g transform={`translate(${x}, ${y})`}>
                      <path
                        d="M 0 0 C -9 -14 -12 -22 0 -32 C 12 -22 9 -14 0 0 Z"
                        fill={isQuarantined ? '#10b981' : isSelected ? '#38bdf8' : '#ef4444'}
                        stroke="#ffffff"
                        strokeWidth="1.5"
                      />
                      {/* Inner Pin Icon / Dot */}
                      <circle cx="0" cy="-18" r="5.5" fill="#ffffff" />
                      <circle 
                        cx="0" 
                        cy="-18" 
                        r="3.5" 
                        fill={isQuarantined ? '#047857' : isSelected ? '#0369a1' : '#b91c1c'} 
                      />
                    </g>

                    {/* Store Name Badge on Map */}
                    <g transform={`translate(${x}, ${y - 36})`}>
                      <rect 
                        x="-55" 
                        y="-16" 
                        width="110" 
                        height="18" 
                        rx="5" 
                        fill={isSelected ? '#0284c7' : isQuarantined ? (mapTheme === 'light' ? '#ecfdf5' : '#065f46') : (mapTheme === 'light' ? '#ffffff' : '#1e293b')} 
                        stroke={isSelected ? '#0284c7' : isQuarantined ? '#10b981' : (mapTheme === 'light' ? '#cbd5e1' : '#475569')}
                        strokeWidth="1"
                        opacity="0.95"
                      />
                      <text 
                        x="0" 
                        y="-4" 
                        textAnchor="middle" 
                        fill={isSelected ? '#ffffff' : isQuarantined ? (mapTheme === 'light' ? '#047857' : '#ffffff') : (mapTheme === 'light' ? '#0f172a' : '#ffffff')} 
                        fontSize="9.5" 
                        fontWeight="bold" 
                        fontFamily="sans-serif"
                      >
                        {store.storeName.length > 15 ? store.storeName.slice(0, 14) + '...' : store.storeName}
                      </text>
                    </g>

                    {/* Shelf units badge */}
                    <g transform={`translate(${x + 10}, ${y - 12})`}>
                      <circle cx="0" cy="0" r="8" fill={isQuarantined ? '#059669' : '#dc2626'} stroke="#fff" strokeWidth="1" />
                      <text x="0" y="3" textAnchor="middle" fill="#fff" fontSize="8" fontWeight="bold" fontFamily="monospace">
                        {store.remainingUnits}
                      </text>
                    </g>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Hover Tooltip Card */}
          {hoveredStore && (
            <div className={`absolute top-16 left-3 z-20 p-3 rounded-xl shadow-2xl max-w-xs pointer-events-none animate-in fade-in border ${mapTheme === 'light' ? 'bg-white/98 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'}`}>
              <div className="flex items-center justify-between gap-2">
                <span className={`font-bold text-xs ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{hoveredStore.storeName}</span>
                <span className={`px-1.5 py-0.5 rounded text-[9px] font-mono font-bold ${
                  hoveredStore.status === 'quarantined' || quarantinedStoreNames.includes(hoveredStore.storeName)
                    ? 'bg-emerald-900 text-emerald-300'
                    : 'bg-rose-900 text-rose-300'
                }`}>
                  {hoveredStore.status === 'quarantined' || quarantinedStoreNames.includes(hoveredStore.storeName) ? 'QUARANTINED' : 'VIOLATION ACTIVE'}
                </span>
              </div>
              <p className={`text-[11px] mt-1 ${mapTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{hoveredStore.storeAddress}</p>
              <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-1 border-t ${mapTheme === 'light' ? 'border-slate-200 text-slate-500' : 'border-slate-700 text-slate-400'}`}>
                <span>Received: <strong>{hoveredStore.receivedUnits}</strong></span>
                <span className="text-rose-400 font-bold">On Shelf: <strong>{hoveredStore.remainingUnits}</strong></span>
              </div>
            </div>
          )}
          </>
        )}

          {/* Mode 2: REAL GOOGLE MAPS (Street & Satellite) */}
          {mapMode === 'google' && (
            <div className={`w-full h-full min-h-[520px] flex flex-col pt-18 relative ${mapTheme === 'light' ? 'bg-white text-slate-900' : 'bg-slate-900 text-white'}`}>
              {/* Sub-bar for Google Maps: Store Picker Pills & Map Type */}
              <div className={`px-4 py-2.5 flex flex-wrap items-center justify-between gap-2 z-20 border-b ${mapTheme === 'light' ? 'bg-white/95 border-slate-200 text-slate-800' : 'bg-slate-900/95 border-slate-800 text-white'}`}>
                <div className="flex items-center gap-2 overflow-x-auto max-w-2xl py-0.5">
                  <span className="text-[10px] font-mono font-bold text-slate-400 uppercase shrink-0 flex items-center gap-1">
                    <MapPin size={11} className="text-emerald-400" /> Fly to Outlet:
                  </span>
                  {stores.map((s, idx) => {
                    const isSelected = selectedStore?.storeName === s.storeName;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSelectedStore(s);
                          if (onSelectStore) onSelectStore(s);
                        }}
                        className={`px-2.5 py-1 rounded-lg text-xs font-bold shrink-0 transition-all cursor-pointer flex items-center gap-1.5 ${
                          isSelected
                            ? 'bg-blue-600 text-white shadow-xs ring-1 ring-blue-400'
                            : mapTheme === 'light' ? 'bg-slate-100 text-slate-700 hover:bg-slate-200 border border-slate-300' : 'bg-slate-800 text-slate-300 hover:bg-slate-700 hover:text-white border border-slate-700'
                        }`}
                      >
                        <Store size={11} className={isSelected ? 'text-white' : 'text-slate-400'} />
                        <span>{s.storeName.length > 16 ? s.storeName.slice(0, 15) + '...' : s.storeName}</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2">
                  <div className={`flex items-center rounded-lg p-0.5 border text-xs ${mapTheme === 'light' ? 'bg-slate-100 border-slate-300 text-slate-700' : 'bg-slate-800 border-slate-700 text-slate-300'}`}>
                    <button
                      type="button"
                      onClick={() => setGoogleMapType('m')}
                      className={`px-2.5 py-1 rounded font-bold transition-all ${
                        googleMapType === 'm' 
                          ? 'bg-blue-600 text-white' 
                          : mapTheme === 'light' 
                            ? 'text-slate-600 hover:text-slate-900' 
                            : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      Street Map
                    </button>
                    <button
                      type="button"
                      onClick={() => setGoogleMapType('k')}
                      className={`px-2.5 py-1 rounded font-bold transition-all flex items-center gap-1 ${
                        googleMapType === 'k' 
                          ? 'bg-blue-600 text-white' 
                          : mapTheme === 'light' 
                            ? 'text-slate-600 hover:text-slate-900' 
                            : 'text-slate-400 hover:text-white'
                      }`}
                    >
                      <Satellite size={11} />
                      Satellite
                    </button>
                  </div>

                  {selectedStore && (
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat || 18.5204},${selectedStore.lng || 73.8567}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1 shadow-xs transition-all cursor-pointer"
                      title="Open turn-by-turn navigation in Google Maps app"
                    >
                      <Navigation size={12} />
                      <span>Open in Google Maps App</span>
                      <ExternalLink size={10} />
                    </a>
                  )}
                </div>
              </div>

              {/* Live Google Maps Iframe */}
              <div className="flex-1 w-full h-full relative min-h-[440px]">
                <iframe
                  title="Google Maps Pune Live Enforcement View"
                  src={`https://maps.google.com/maps?q=${
                    selectedStore 
                      ? `${selectedStore.lat || 18.5204},${selectedStore.lng || 73.8567}` 
                      : '18.5204,73.8567'
                  }&t=${googleMapType}&z=${selectedStore ? 15 : 12}&output=embed`}
                  className="w-full h-full absolute inset-0 border-0"
                  loading="lazy"
                  allowFullScreen
                />

                {/* Floating Info Pill on Google Maps */}
                {selectedStore && (
                  <div className={`absolute bottom-3 left-3 z-10 backdrop-blur-md px-4 py-3 rounded-xl border shadow-xl max-w-sm ${mapTheme === 'light' ? 'bg-white/95 border-slate-300 text-slate-900' : 'bg-slate-900/95 border-slate-700 text-white'}`}>
                    <div className="flex items-center gap-2">
                      <Store size={15} className="text-blue-400" />
                      <span className={`font-black text-xs ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{selectedStore.storeName}</span>
                    </div>
                    <p className={`text-[11px] mt-0.5 leading-snug ${mapTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>{selectedStore.storeAddress}</p>
                    <div className={`flex items-center justify-between text-[10px] font-mono mt-2 pt-1 border-t ${mapTheme === 'light' ? 'border-slate-200 text-slate-500' : 'border-slate-800 text-slate-400'}`}>
                      <span>GPS: {selectedStore.lat?.toFixed(4)}°N, {selectedStore.lng?.toFixed(4)}°E</span>
                      <span className="text-rose-400 font-bold">{selectedStore.remainingUnits} units on shelf</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Mode 3: REAL OPENWEATHER APP & RADAR */}
          {mapMode === 'weather' && (
            <div className={`w-full h-full min-h-[520px] p-5 pt-20 space-y-4 overflow-y-auto ${mapTheme === 'light' ? 'bg-slate-50 text-slate-900' : 'bg-slate-950 text-white'}`}>
              {/* OpenWeather Main Weather Banner */}
              <div className={`p-5 rounded-2xl border shadow-lg relative overflow-hidden ${mapTheme === 'light' ? 'bg-gradient-to-r from-blue-100/90 via-sky-100/80 to-indigo-100/90 border-blue-200 text-slate-900' : 'bg-gradient-to-r from-blue-900/70 via-indigo-900/60 to-slate-900 border-blue-700/50 text-white'}`}>
                <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-black uppercase bg-cyan-500 text-slate-950 tracking-wider">
                        OpenWeather Station Live
                      </span>
                      <span className="text-[10px] font-mono text-cyan-200">
                        Pune MH-12 • Coordinates: 18.5204° N, 73.8567° E
                      </span>
                    </div>
                    <div className="flex items-baseline gap-3 mt-2">
                      <h2 className={`text-4xl font-black font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.temperature}°C</h2>
                      <span className={`text-sm font-bold ${mapTheme === 'light' ? 'text-slate-700' : 'text-slate-300'}`}>Feels like {weather.apparentTemp}°C</span>
                      <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-cyan-900/80 text-cyan-200 border border-cyan-700">
                        {getWeatherInfo(weather.weatherCode).text}
                      </span>
                    </div>
                    <p className={`text-xs mt-1 ${mapTheme === 'light' ? 'text-slate-600' : 'text-slate-300'}`}>

                      Real-time meteorological conditions for Pune Circle field enforcement squad and storage surveillance.
                    </p>
                  </div>

                  <div className="flex items-center gap-3 shrink-0">
                    <div className={`p-3 backdrop-blur-md rounded-xl border text-right ${mapTheme === 'light' ? 'bg-white/80 border-slate-200 text-slate-900' : 'bg-white/10 border-white/15 text-white'}`}>
                      <span className="text-[10px] font-mono uppercase text-cyan-300 block">Station Sync</span>
                      <span className={`text-xs font-bold font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.lastUpdated}</span>
                      <span className="text-[10px] text-emerald-400 block mt-0.5 font-bold">● Live Telemetry Active</span>
                    </div>
                    <button
                      type="button"
                      onClick={fetchLiveWeather}
                      className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold transition-all shadow-sm active:scale-95 cursor-pointer"
                      title="Force refresh live weather"
                    >
                      <RefreshCw size={16} className={isWeatherLoading ? 'animate-spin' : ''} />
                    </button>
                  </div>
                </div>

                {/* Atmospheric Dials Strip */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 mt-4 pt-4 border-t border-blue-800/60 text-xs">
                  <div className={`p-2.5 rounded-xl border ${mapTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-700/60'}`}>
                    <div className="flex items-center justify-between text-cyan-300 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase">Relative Humidity</span>
                      <Droplets size={13} />
                    </div>
                    <span className={`text-lg font-black font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.humidity}%</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Moisture Saturation</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${mapTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-700/60'}`}>
                    <div className="flex items-center justify-between text-cyan-300 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase">Wind Velocity</span>
                      <Wind size={13} />
                    </div>
                    <span className={`text-lg font-black font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.windSpeed} km/h</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Westerlies (W-SW)</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${mapTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-700/60'}`}>
                    <div className="flex items-center justify-between text-cyan-300 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase">Barometric Pressure</span>
                      <Gauge size={13} />
                    </div>
                    <span className={`text-lg font-black font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.pressure} hPa</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Calibrated Baseline</span>
                  </div>

                  <div className={`p-2.5 rounded-xl border ${mapTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900/60 border-slate-700/60'}`}>
                    <div className="flex items-center justify-between text-cyan-300 mb-1">
                      <span className="text-[10px] font-mono font-bold uppercase">Precipitation / Rain</span>
                      <CloudRain size={13} />
                    </div>
                    <span className={`text-lg font-black font-mono ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{weather.rain} mm/h</span>
                    <span className="text-[10px] text-slate-400 block mt-0.5">Cloud Cover {weather.cloudCover}%</span>
                  </div>
                </div>
              </div>

              {/* Legal Metrology Enforcement Weather Advisory Banner */}
              <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-700/60 text-xs space-y-2">
                <div className="flex items-center gap-2">
                  <ShieldCheck size={16} className="text-amber-400" />
                  <h4 className="font-black text-amber-200 uppercase tracking-wider text-[11px]">
                    Legal Metrology Field Inspection & Verification Advisory (MH-12 Circle)
                  </h4>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1 text-slate-200">
                  <div className="p-3 rounded-xl bg-black/30 border border-amber-800/40">
                    <span className="text-amber-300 font-bold block text-[11px]">Weighing Balance Calibration (Rule 11)</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {weather.humidity > 65 
                        ? `Current relative humidity (${weather.humidity}%) in Pune triggers moisture sorption risks on open dry goods (flour, pulses, tea). Officers must perform tare calibration on certified electronic balances prior to formal seizure weight recording.`
                        : `Atmospheric humidity (${weather.humidity}%) is within standard laboratory tolerances (≤65%). Electronic scales exhibit minimal environmental drift.`}
                    </p>
                  </div>
                  <div className="p-3 rounded-xl bg-black/30 border border-amber-800/40">
                    <span className="text-amber-300 font-bold block text-[11px]">Field Squad Transit & Storage Conditions</span>
                    <p className="text-[11px] text-slate-300 mt-1 leading-relaxed">
                      {weather.rain > 0 
                        ? `Rain active in Pune corridors. Seizure squads must seal seized retail inventory in waterproof bags to preserve barcode / QR label integrity.`
                        : `Road transit optimal across Old Mumbai-Pune Hwy, Nagar Rd, and Katraj bypass. Rapid response seizure squads report no weather-related transit delays.`}
                    </p>
                  </div>
                </div>
              </div>

              {/* Hourly Forecast Bar */}
              <div className={`p-4 rounded-2xl border space-y-2 ${mapTheme === 'light' ? 'bg-white border-slate-200 shadow-xs' : 'bg-slate-900 border-slate-800'}`}>
                <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  6-Hour Pune Weather Progression (OpenWeather Forecast)
                </h4>
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
                  {PUNE_HOURLY_FORECAST.map((h, i) => (
                    <div key={i} className={`p-2.5 rounded-xl border text-center ${mapTheme === 'light' ? 'bg-slate-50 border-slate-200 text-slate-800' : 'bg-slate-800/60 border-slate-700/60 text-white'}`}>
                      <span className="text-[10px] font-mono text-slate-400 block">{h.time}</span>
                      <span className={`text-base font-black font-mono mt-1 block ${mapTheme === 'light' ? 'text-slate-900' : 'text-white'}`}>{h.temp}°C</span>
                      <span className="text-[10px] text-cyan-400 font-bold block mt-0.5">{h.pop}% Rain</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Micro-Climate Zones across Pune */}
              <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-2">
                <h4 className="text-[11px] font-mono font-bold uppercase text-slate-400">
                  Zonal Micro-Climates across Pune Retail Containment Sectors
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2">
                  {PUNE_MICRO_ZONES_WEATHER.map((z, idx) => (
                    <div key={idx} className="p-3 rounded-xl bg-slate-800/40 border border-slate-700/50 flex items-center justify-between">
                      <div>
                        <span className="font-bold text-xs text-white block">{z.zone}</span>
                        <span className="text-[11px] text-slate-400">{z.cond} • Hum {z.hum}%</span>
                      </div>
                      <div className="text-right">
                        <span className="text-sm font-black font-mono text-white block">{z.temp}°C</span>
                        <span className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {z.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Selected Store Inspector Drawer (col-span-4) */}
        <div className="lg:col-span-4 flex flex-col justify-between p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
          {selectedStore ? (
            <div className="space-y-4">
              {/* Header & Status */}
              <div>
                <div className="flex items-center justify-between">
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase bg-blue-100 text-blue-900 border border-blue-200">
                    Pune Outlet Dossier
                  </span>
                  {(selectedStore.status === 'quarantined' || quarantinedStoreNames.includes(selectedStore.storeName)) ? (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                      <CheckCircle2 size={11} /> QUARANTINE ORDERED
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-100 text-rose-900 border border-rose-300 flex items-center gap-1 animate-pulse">
                      <AlertTriangle size={11} /> UNLAWFUL SHELF SALE
                    </span>
                  )}
                </div>

                <h4 className="text-base font-black text-slate-900 mt-2 flex items-center gap-1.5">
                  <Store size={18} className="text-blue-700 flex-shrink-0" />
                  <span>{selectedStore.storeName}</span>
                </h4>
                <p className="text-xs text-slate-600 font-medium flex items-start gap-1 mt-1">
                  <MapPin size={13} className="text-slate-400 flex-shrink-0 mt-0.5" />
                  <span>{selectedStore.storeAddress}</span>
                </p>
              </div>

              {/* Coordinates & Zone Info */}
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">Zonal Sector</span>
                  <span className="font-bold text-slate-900 text-xs">{selectedStore.areaDistrict}</span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">{selectedStore.locality || 'MH-12 Circle'}</span>
                </div>
                <div className="p-2.5 bg-white rounded-xl border border-slate-200">
                  <span className="text-slate-500 font-bold block text-[10px] uppercase">GPS Coordinates</span>
                  <span className="font-mono font-bold text-blue-900 text-xs">
                    {selectedStore.lat ? selectedStore.lat.toFixed(4) : '18.5204'}°N, {selectedStore.lng ? selectedStore.lng.toFixed(4) : '73.8567'}°E
                  </span>
                  <span className="text-slate-500 text-[10px] block mt-0.5">Verified by FEO</span>
                </div>
              </div>

              {/* Specific Violation Description Box */}
              <div className="p-3 bg-rose-50 rounded-xl border border-rose-200 text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-rose-900 font-bold">
                  <ShieldAlert size={14} className="text-rose-600" />
                  <span>Detected Metrology Offence:</span>
                </div>
                <p className="text-rose-950 font-semibold leading-tight">
                  {selectedStore.violationSummary || 
                    (isExpiredBatch 
                      ? `Retail offering of expired Batch ${currentBatchId}. Product expired past mandatory use-by date.` 
                      : `Packaged commodity statutory declaration violation under Legal Metrology Rules.`)}
                </p>
              </div>

              {/* Stock Breakdown */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 space-y-2">
                <span className="text-[11px] font-bold text-slate-700 block uppercase">Inventory Custody Status</span>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Stock Invoiced:</span>
                  <span className="font-bold text-slate-900">{selectedStore.receivedUnits} units</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Discovered on Shelf:</span>
                  <span className="font-black text-rose-700 text-sm">{selectedStore.remainingUnits} units</span>
                </div>
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="text-slate-600">Delivery Date:</span>
                  <span className="font-medium text-slate-800">{selectedStore.deliveryDate}</span>
                </div>
                {selectedStore.seizureNoticeNo && (
                  <div className="flex items-center justify-between text-xs font-mono pt-1 border-t border-slate-100">
                    <span className="text-slate-500">Notice ID:</span>
                    <span className="font-bold text-emerald-800">{selectedStore.seizureNoticeNo}</span>
                  </div>
                )}
              </div>

              {/* Store Micro-Weather & Calibration Advisory Pill */}
              <div className="p-2.5 bg-cyan-50/70 rounded-xl border border-cyan-200 text-xs flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CloudSun size={15} className="text-cyan-700" />
                  <div>
                    <span className="text-[10px] text-cyan-900 font-bold uppercase block">Local Atmosphere</span>
                    <span className="font-bold text-slate-800 text-[11px]">{weather.temperature}°C • {weather.humidity}% Hum</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setMapMode('weather')}
                  className="px-2 py-1 bg-cyan-600 hover:bg-cyan-700 text-white rounded-lg text-[10px] font-bold transition-colors cursor-pointer"
                >
                  View Advisory
                </button>
              </div>

              {/* Contact Person */}
              <div className="p-3 bg-white rounded-xl border border-slate-200 text-xs flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-slate-500 font-bold uppercase block">Store In-Charge</span>
                  <span className="font-bold text-slate-900">{selectedStore.contactPerson}</span>
                </div>
                <a 
                  href={`tel:${selectedStore.phone}`}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-50 text-blue-700 hover:bg-blue-100 font-mono font-bold flex items-center gap-1 transition-colors"
                >
                  <Phone size={12} />
                  <span>{selectedStore.phone}</span>
                </a>
              </div>
            </div>
          ) : (
            <div className="p-8 text-center text-slate-500">
              <Crosshair size={32} className="mx-auto text-slate-400 mb-2" />
              <p className="font-bold text-xs text-slate-700">Select any pin on the map to inspect outlet details</p>
            </div>
          )}

          {/* Action Buttons for Selected Store */}
          {selectedStore && (
            <div className="pt-2 border-t border-slate-200 space-y-2">
              {!(selectedStore.status === 'quarantined' || quarantinedStoreNames.includes(selectedStore.storeName)) ? (
                <button
                  onClick={() => onQuarantineStore && onQuarantineStore(selectedStore.storeName)}
                  className="w-full py-2.5 px-4 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-sm flex items-center justify-center gap-2 transition-all active:scale-98 cursor-pointer"
                >
                  <Ban size={14} />
                  <span>Order Immediate Quarantine for {selectedStore.storeName}</span>
                </button>
              ) : (
                <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-bold text-center flex items-center justify-center gap-1.5">
                  <CheckCircle2 size={15} className="text-emerald-600" />
                  <span>Seizure Directive Served & Shelf Stock Quarantined</span>
                </div>
              )}

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${selectedStore.lat || 18.5204},${selectedStore.lng || 73.8567}`}
                target="_blank"
                rel="noreferrer"
                className="w-full py-2 px-3 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-800 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
              >
                <Navigation size={13} className="text-blue-600" />
                <span>Open in GPS Navigation (FEO Dispatch)</span>
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
