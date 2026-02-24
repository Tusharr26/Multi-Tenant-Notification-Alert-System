import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { FiFilter, FiCheck, FiUserPlus } from 'react-icons/fi';

const AlertList = () => {
    const [alerts, setAlerts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [severityFilter, setSeverityFilter] = useState('');
    const { user } = useAuth();

    const fetchAlerts = async () => {
        try {
            setLoading(true);
            const res = await api.get(`/alerts${severityFilter ? `?severity=${severityFilter}` : ''}`);
            setAlerts(res.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAlerts();
    }, [severityFilter]);

    const updateStatus = async (id, status) => {
        try {
            await api.patch(`/alerts/${id}/status?status=${status}`);
            fetchAlerts();
        } catch (error) {
            console.error('Failed to update status', error);
        }
    };

    const assignAlert = async (id) => {
        try {
            await api.patch(`/alerts/${id}/assign?userId=${user.id}`);
            fetchAlerts();
        } catch (error) {
            console.error('Failed to assign alert', error);
        }
    };

    return (
        <div className="p-8">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-gray-900">Manage Alerts</h2>
                <div className="flex items-center gap-4">
                    <label className="text-sm font-medium text-gray-700">Filter by Severity:</label>
                    <select
                        value={severityFilter}
                        onChange={(e) => setSeverityFilter(e.target.value)}
                        className="border-gray-300 rounded-md shadow-sm p-2 bg-white text-gray-700"
                    >
                        <option value="">All</option>
                        <option value="High">High</option>
                        <option value="Medium">Medium</option>
                        <option value="Low">Low</option>
                    </select>
                </div>
            </div>

            {loading ? (
                <div className="text-center text-gray-500 py-10">Loading alerts...</div>
            ) : (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                    <ul className="divide-y divide-gray-200">
                        {alerts.map((alert, idx) => (
                            <motion.li
                                key={alert.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                whileHover={{ x: 5, backgroundColor: '#f9fafb' }}
                                transition={{ delay: idx * 0.05, type: 'spring', stiffness: 300, damping: 20 }}
                                className="p-6 transition-colors"
                            >
                                <div className="flex items-center justify-between">
                                    <div>
                                        <div className="flex items-center gap-3">
                                            <h3 className="text-lg font-semibold text-gray-900">{alert.title}</h3>
                                            <span className={`px-3 py-1 text-xs rounded-full font-medium ${alert.severity === 'High' ? 'bg-red-100 text-red-800' :
                                                alert.severity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                                                    'bg-blue-100 text-blue-800'
                                                }`}>
                                                {alert.severity}
                                            </span>
                                            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-1 rounded-md">
                                                {alert.status}
                                            </span>
                                        </div>
                                        <p className="text-sm text-gray-500 mt-2">{alert.description}</p>
                                        <p className="text-xs text-gray-400 mt-1">
                                            Reported at: {new Date(alert.timestamp).toLocaleString()} | Type: {alert.type}
                                        </p>
                                        {alert.assignedToName && (
                                            <p className="text-xs font-semibold text-indigo-600 mt-1">
                                                Assigned to: {alert.assignedToName}
                                            </p>
                                        )}
                                    </div>

                                    <div className="flex gap-2">
                                        {alert.status !== 'Closed' && user.role !== 'USER' && (
                                            <button
                                                onClick={() => updateStatus(alert.id, 'Closed')}
                                                className="flex items-center gap-1 px-3 py-2 bg-green-50 text-green-700 rounded-md hover:bg-green-100 transition text-sm font-medium"
                                            >
                                                <FiCheck /> Close
                                            </button>
                                        )}

                                        {!alert.assignedToId && ['TENANT_ADMIN', 'SUPER_ADMIN'].includes(user.role) && (
                                            <button
                                                onClick={() => assignAlert(alert.id)}
                                                className="flex items-center gap-1 px-3 py-2 bg-indigo-50 text-indigo-700 rounded-md hover:bg-indigo-100 transition text-sm font-medium"
                                            >
                                                <FiUserPlus /> Assign to Me
                                            </button>
                                        )}
                                    </div>
                                </div>
                            </motion.li>
                        ))}
                        {alerts.length === 0 && (
                            <li className="p-8 text-center text-gray-500">No alerts found.</li>
                        )}
                    </ul>
                </div>
            )}
        </div>
    );
};

export default AlertList;
