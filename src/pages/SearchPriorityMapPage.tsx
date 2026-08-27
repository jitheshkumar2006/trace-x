import { useMemo } from 'react';
import { useAppStore } from '../store/useStore';
import { MapContainer, TileLayer, Circle, Popup, Polyline, Marker } from 'react-leaflet';
import { MapPin, Navigation, Info, ShieldCheck } from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix Leaflet marker icons
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const getPriorityColor = (priority: string) => {
  switch (priority) {
    case 'high': return '#EF4444';
    case 'medium': return '#F59E0B';
    case 'low': return '#4a5c75';
    default: return '#334358';
  }
};

const getPriorityFillOpacity = (priority: string) => {
  switch (priority) {
    case 'high': return 0.3;
    case 'medium': return 0.2;
    case 'low': return 0.15;
    default: return 0.1;
  }
};

export default function SearchPriorityMapPage() {
  const { searchZones, evidence, activeCase, cctv014Investigated } = useAppStore();
  const personName = activeCase?.person.name || 'the subject';

  const displayZones = useMemo(() => {
    return searchZones.map(zone => {
      if ((zone.id === 'SZ-001' || zone.name.includes('Zone B')) && cctv014Investigated) {
        return { ...zone, probability: 91, priority: 'high' as const };
      }
      return zone;
    }).sort((a, b) => b.probability - a.probability);
  }, [searchZones, cctv014Investigated]);

  const evidenceLocations = useMemo(() => {
    return evidence.filter(e => e.latitude && e.longitude);
  }, [evidence]);

  const sortedEvidence = useMemo(() => {
    return [...evidenceLocations].sort((a, b) => {
      return new Date(a.timestamp || 0).getTime() - new Date(b.timestamp || 0).getTime();
    });
  }, [evidenceLocations]);

  const pathCoordinates: [number, number][] = sortedEvidence.map(e => [e.latitude, e.longitude]);
  const confirmedPath = pathCoordinates.slice(0, Math.min(3, pathCoordinates.length));
  const hypothesizedPath = pathCoordinates.slice(Math.max(0, pathCoordinates.length - 2));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#1D2733] pb-4">
        <div>
          <h1 className="text-2xl font-extrabold text-[#E6EDF3] tracking-tight font-mono flex items-center gap-2">
            <MapPin className="text-sky-400 w-6 h-6" />
            SEARCH PRIORITY MAP
          </h1>
          <p className="text-xs text-[#8B98A8] mt-0.5 font-mono">
            GEOSPATIAL TRAJECTORY MATRIX & CANDIDATE SEARCH PRIORITY ZONES FOR <span className="text-white font-semibold">{personName.toUpperCase()}</span>
          </p>
        </div>

        <span className="prototype-badge font-mono">
          OPERATIONAL GEOSPATIAL MAP
        </span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Map Container */}
        <div className="lg:col-span-2 glass-card p-4 rounded-xl relative overflow-hidden bg-[#080B10]">
          <div className="h-[65vh] w-full rounded-lg overflow-hidden relative border border-[#1D2733]">
            <MapContainer
              center={[13.0827, 80.2707]}
              zoom={13}
              style={{ height: '100%', width: '100%' }}
              scrollWheelZoom={true}
            >
              <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />

              {/* Confirmed Movement Path */}
              {confirmedPath.length >= 2 && (
                <Polyline
                  positions={confirmedPath}
                  pathOptions={{ color: '#38BDF8', weight: 4, opacity: 0.9 }}
                />
              )}

              {/* Hypothesized Path */}
              {hypothesizedPath.length >= 2 && (
                <Polyline
                  positions={hypothesizedPath}
                  pathOptions={{ color: '#F59E0B', weight: 3, dashArray: '8, 8', opacity: 0.8 }}
                />
              )}

              {/* Search Zones */}
              {displayZones.map((zone) => (
                <Circle
                  key={zone.id}
                  center={zone.center}
                  radius={zone.radius || 800}
                  pathOptions={{
                    color: getPriorityColor(zone.priority),
                    fillColor: getPriorityColor(zone.priority),
                    fillOpacity: getPriorityFillOpacity(zone.priority),
                    weight: 2
                  }}
                >
                  <Popup>
                    <div className="p-1 min-w-[200px] font-mono text-xs">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-white text-sm">{zone.name}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-red-600">
                          {zone.probability}%
                        </span>
                      </div>
                      <div className="text-[10px] text-sky-400 font-bold uppercase tracking-wider mb-2">
                        CANDIDATE SEARCH PRIORITY
                      </div>
                      
                      {zone.reasons && zone.reasons.length > 0 && (
                        <div className="mb-2">
                          <strong className="text-[#8B98A8]">Key Reason:</strong>
                          <p className="text-white text-xs mt-0.5">{zone.reasons[0]}</p>
                        </div>
                      )}
                    </div>
                  </Popup>
                </Circle>
              ))}

              {/* Evidence Markers */}
              {evidenceLocations.map((item) => (
                <Marker
                  key={item.id}
                  position={[item.latitude, item.longitude]}
                  title={`[${item.id}] ${item.source}`}
                >
                  <Popup>
                    <div className="p-1 min-w-[180px] font-mono text-xs">
                      <div className="text-[10px] text-sky-400 mb-1">{item.id}</div>
                      <h4 className="font-bold text-white">{item.source}</h4>
                      <p className="text-[#8B98A8] text-[11px] mt-1">{item.description}</p>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>

            {/* Floating Intelligence Card on Map */}
            <div className="absolute top-4 right-4 z-[1000] bg-[#0D1219]/90 backdrop-blur-md p-3 rounded-lg border border-[#1D2733] text-xs font-mono max-w-[240px] space-y-1.5 shadow-xl">
              <div className="flex items-center justify-between text-white font-bold">
                <span>ZONE B</span>
                <span className="text-red-400">{cctv014Investigated ? '91%' : '78%'}</span>
              </div>
              <div className="text-[10px] text-sky-400 uppercase font-semibold">SEARCH PRIORITY: HIGH</div>
              <div className="text-[#8B98A8] text-[11px]">
                Multiple correlated evidence sources indicate movement toward transit corridor.
              </div>
            </div>
          </div>
        </div>

        {/* Side Panel: Zones & Operational Map Overlay Legend */}
        <div className="space-y-6">
          {/* Operational Overlay Legend */}
          <div className="glass-card p-5 space-y-3 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1D2733] flex items-center gap-2">
              <Info className="w-4 h-4 text-sky-400" />
              OPERATIONAL OVERLAY LEGEND
            </h3>

            <div className="space-y-2 text-xs text-[#8B98A8]">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#22C55E]"></span> CONFIRMED</span>
                <span className="text-emerald-400 text-[10px]">VERIFIED SPOT</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-2.5 h-2.5 rounded-full bg-[#38BDF8]"></span> POTENTIAL</span>
                <span className="text-sky-400 text-[10px]">LEAD CANDIDATE</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-4 h-0.5 border-t border-dashed border-[#F59E0B]"></span> EVIDENCE GAP</span>
                <span className="text-amber-400 text-[10px]">UNCERTAIN PATH</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-2"><span className="w-4 h-2 bg-red-500/40 border border-red-500 rounded-sm"></span> SEARCH PRIORITY</span>
                <span className="text-red-400 text-[10px]">HIGH DENSITY</span>
              </div>
            </div>
          </div>

          {/* Candidate Search Zones List */}
          <div className="glass-card p-5 space-y-3 font-mono">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1D2733] flex items-center gap-2">
              <Navigation className="w-4 h-4 text-sky-400" />
              CANDIDATE SEARCH ZONES
            </h3>

            <div className="space-y-3">
              {displayZones.map((zone) => (
                <div
                  key={zone.id}
                  className="bg-[#080B10] p-3 rounded-lg border border-[#1D2733] space-y-1"
                >
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-white text-xs">{zone.name}</span>
                    <span className={`text-xs font-bold ${
                      zone.priority === 'high' ? 'text-red-400' :
                      zone.priority === 'medium' ? 'text-amber-400' : 'text-[#8B98A8]'
                    }`}>
                      {zone.probability}%
                    </span>
                  </div>
                  <p className="text-[11px] text-[#8B98A8] font-sans">
                    {zone.reasons && zone.reasons[0]}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {activeCase && (
            <div className="glass-card p-5 font-mono space-y-2">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider pb-2 border-b border-[#1D2733] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                ACTIVE SUBJECT PROFILE
              </h3>
              <div className="text-sm font-bold text-white">{activeCase.person.name}</div>
              <div className="text-xs text-[#8B98A8]">CASE ID: <span className="text-sky-400">{activeCase.id}</span></div>
              <div className="text-xs text-[#8B98A8]">
                CATEGORY: <span className="text-sky-400 uppercase">{activeCase.person.category}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
