import { useMemo } from 'react';
import { motion } from 'framer-motion';
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
    case 'high': return '#ef4444';
    case 'medium': return '#f97316';
    case 'low': return '#eab308';
    default: return '#6b7280';
  }
};

const getPriorityFillOpacity = (priority: string) => {
  switch (priority) {
    case 'high': return 0.25;
    case 'medium': return 0.20;
    case 'low': return 0.15;
    default: return 0.1;
  }
};

export default function SearchPriorityMapPage() {
  const { searchZones, evidence, activeCase, cctv014Investigated } = useAppStore();

  const displayZones = useMemo(() => {
    return searchZones.map(zone => {
      if ((zone.id === 'SZ-001' || zone.name.includes('Zone B')) && cctv014Investigated) {
        return { ...zone, probability: 91, priority: 'high' as const };
      }
      return zone;
    }).sort((a, b) => b.probability - a.probability);
  }, [searchZones, cctv014Investigated]);

  // Valid evidence markers with lat/lng
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
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <MapPin className="text-blue-400" />
            Search Area Priority Map
          </h1>
          <p className="text-navy-400 text-xs mt-1">
            Ground search zones prioritized by time, distance, and verified evidence
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="warning-label">Candidate Search Priorities</span>
          <span className="prototype-badge">Leaflet Live View</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 glass-card p-4 rounded-xl relative overflow-hidden">
          <div className="h-[65vh] w-full rounded-lg overflow-hidden">
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
                  pathOptions={{ color: '#3b82f6', weight: 4, opacity: 0.8 }}
                />
              )}

              {/* Hypothesized Path */}
              {hypothesizedPath.length >= 2 && (
                <Polyline
                  positions={hypothesizedPath}
                  pathOptions={{ color: '#a855f7', weight: 3, dashArray: '8, 8', opacity: 0.8 }}
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
                    <div className="p-1 min-w-[200px]">
                      <div className="flex justify-between items-center mb-2">
                        <h3 className="font-bold text-navy-100">{zone.name}</h3>
                        <span className="px-2 py-0.5 rounded text-xs font-bold text-white bg-red-500/80">
                          {zone.probability}%
                        </span>
                      </div>
                      <div className="text-[10px] text-amber-400 font-bold uppercase tracking-wider mb-2">
                        Candidate Search Priority
                      </div>
                      
                      {zone.reasons && zone.reasons.length > 0 && (
                        <div className="mb-2">
                          <strong className="text-xs text-navy-300">Key Reasons:</strong>
                          <ul className="list-disc pl-4 text-xs text-navy-400 mt-1 space-y-1">
                            {zone.reasons.map((r: string, i: number) => (
                              <li key={i}>{r}</li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {zone.recommendations && zone.recommendations.length > 0 && (
                        <div className="mt-2 bg-navy-900/60 p-2 rounded border border-navy-700/50">
                          <strong className="text-xs text-blue-300">Recommended Action:</strong>
                          <p className="text-xs text-navy-300 mt-1">{zone.recommendations[0]}</p>
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
                    <div className="p-1 min-w-[180px]">
                      <div className="text-[10px] text-blue-400 font-mono mb-1">{item.id}</div>
                      <h4 className="font-bold text-navy-100">{item.source}</h4>
                      <p className="text-xs text-navy-300 mt-1">{item.description}</p>
                      <div className="mt-2 inline-block px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-500/20 text-blue-300 border border-blue-500/30">
                        {item.verificationStatus.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                  </Popup>
                </Marker>
              ))}
            </MapContainer>
          </div>
        </div>

        <div className="space-y-6">
          <div className="glass-card p-5 rounded-xl border border-navy-700/50">
            <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
              <Navigation size={18} className="text-accent-blue" />
              Candidate Search Zones
            </h3>

            <div className="space-y-4">
              {displayZones.map((zone, index) => (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  key={zone.id}
                  className="bg-navy-800/50 p-3 rounded-lg border border-navy-700/50 hover:bg-navy-800 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div className="font-medium text-navy-200">{zone.name}</div>
                    <div className={`text-sm font-bold ${
                      zone.priority === 'high' ? 'text-red-400' :
                      zone.priority === 'medium' ? 'text-orange-400' : 'text-yellow-400'
                    }`}>
                      {zone.probability}%
                    </div>
                  </div>
                  <div className="text-xs text-navy-400 line-clamp-2">
                    {zone.reasons && zone.reasons[0]}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="glass-card p-5 rounded-xl border border-navy-700/50">
            <h3 className="text-sm font-semibold text-navy-300 mb-3 flex items-center gap-2">
              <Info size={16} />
              Map Legend
            </h3>

            <div className="space-y-2 text-sm text-navy-400">
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-red-500/30 border border-red-500"></div>
                <span>High Priority Candidate Zone</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-orange-500/30 border border-orange-500"></div>
                <span>Medium Priority Candidate Zone</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-4 h-4 rounded-full bg-yellow-500/30 border border-yellow-500"></div>
                <span>Low Priority Candidate Zone</span>
              </div>
              <div className="h-px bg-navy-700 my-2"></div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 bg-blue-500"></div>
                <span>Confirmed Path</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-6 h-0.5 border-t-2 border-dashed border-purple-500"></div>
                <span>Hypothesized Path</span>
              </div>
            </div>
          </div>

          {activeCase && (
            <div className="glass-card p-5 rounded-xl border border-navy-700/50">
              <h3 className="text-sm font-semibold text-navy-300 mb-2 flex items-center gap-2">
                <ShieldCheck size={16} className="text-emerald-400" />
                Active Subject
              </h3>
              <div className="text-lg font-medium text-white">{activeCase.person.name}</div>
              <div className="text-xs text-navy-400 mt-1 font-mono">Case ID: {activeCase.id}</div>
              <div className="text-xs text-navy-400 mt-1">
                Category: <span className="text-accent-cyan uppercase font-semibold">{activeCase.person.category}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
