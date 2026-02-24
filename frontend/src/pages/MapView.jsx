import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import api from '../api/axios';
import { FiMap } from 'react-icons/fi';

// Fix for default Leaflet marker icons issue in React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
    popupAnchor: [1, -34],
    shadowSize: [41, 41]
});
L.Marker.prototype.options.icon = DefaultIcon;

const MapView = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAlerts = async () => {
            try {
                const res = await api.get('/alerts');
                // Filter out alerts with invalid coordinates
                const validAlerts = res.data.filter(a => a.latitude != null && a.longitude != null);
                setAlerts(validAlerts);
            } catch (error) {
                console.error('Failed to fetch alerts for map', error);
            } finally {
                setLoading(false);
            }
        };
        fetchAlerts();
    }, []);

    // Calculate center of the map based on data (or fallback)
    const defaultCenter = [40.7128, -74.0060]; // e.g. New York
    let centerPosition = defaultCenter;

    if (alerts.length > 0) {
        const sumLat = alerts.reduce((sum, a) => sum + parseFloat(a.latitude), 0);
        const sumLng = alerts.reduce((sum, a) => sum + parseFloat(a.longitude), 0);
        centerPosition = [sumLat / alerts.length, sumLng / alerts.length];
    }

    return (
        <div className="p-8 h-[calc(100vh-64px)] flex flex-col">
            <div className="mb-6 flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiMap /> Alert Map
                    </h2>
                    <p className="text-gray-500 mt-2">Geographic overview of all currently reported alerts.</p>
                </div>
            </div>

            <div className="flex-1 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden relative">
                {loading ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-50/50 z-10 backdrop-blur-sm">
                        <p className="text-gray-500 font-medium">Loading Map Data...</p>
                    </div>
                ) : null}

                <MapContainer
                    center={centerPosition}
                    zoom={alerts.length > 0 ? 10 : 4}
                    style={{ height: '100%', width: '100%', zIndex: 0 }}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {alerts.map(alert => (
                        <Marker key={alert.id} position={[alert.latitude, alert.longitude]}>
                            <Popup>
                                <div className="p-1 max-w-[200px]">
                                    <h3 className="font-semibold text-gray-900 mb-1">{alert.title}</h3>
                                    <div className={`inline-block px-2 py-0.5 text-[10px] rounded-full font-medium mb-2 ${alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                                            alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {alert.severity} ({alert.status})
                                    </div>
                                    <p className="text-xs text-gray-600 line-clamp-3">{alert.description}</p>
                                </div>
                            </Popup>
                        </Marker>
                    ))}
                </MapContainer>
            </div>
        </div>
    );
};

export default MapView;
