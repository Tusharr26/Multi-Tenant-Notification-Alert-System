import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FiActivity, FiAlertTriangle, FiCheckCircle, FiClock } from 'react-icons/fi';
import api from '../api/axios';

const Dashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/alerts/dashboard');
                setStats(response.data);
            } catch (error) {
                console.error('Failed to fetch stats', error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <div className="p-8 text-center text-gray-500">Loading dashboard...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load statistics.</div>;

    const StatCard = ({ title, value, icon, bgClass, textClass, delay }) => (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ scale: 1.05, y: -5 }}
            transition={{ duration: 0.5, delay }}
            className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex items-center gap-6 cursor-pointer`}
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl ${bgClass} ${textClass}`}>
                {icon}
            </div>
            <div>
                <p className="text-sm font-medium text-gray-500">{title}</p>
                <motion.p
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 100, delay: delay + 0.2 }}
                    className="text-4xl font-bold text-gray-900 mt-1"
                >
                    {value}
                </motion.p>
            </div>
        </motion.div>
    );

    return (
        <div className="p-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Overview</h1>
                <p className="text-gray-500">Welcome back. Here is your tenant's alert status.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Alerts"
                    value={stats.totalAlerts}
                    icon={<FiActivity />}
                    bgClass="bg-blue-50"
                    textClass="text-blue-600"
                    delay={0}
                />
                <StatCard
                    title="High Severity"
                    value={stats.severityBreakdown['High'] || 0}
                    icon={<FiAlertTriangle />}
                    bgClass="bg-red-50"
                    textClass="text-red-600"
                    delay={0.1}
                />
                <StatCard
                    title="In Progress"
                    value={stats.statusBreakdown['In Progress'] || 0}
                    icon={<FiClock />}
                    bgClass="bg-yellow-50"
                    textClass="text-yellow-600"
                    delay={0.2}
                />
                <StatCard
                    title="Resolved Alerts"
                    value={stats.statusBreakdown['Closed'] || 0}
                    icon={<FiCheckCircle />}
                    bgClass="bg-green-50"
                    textClass="text-green-600"
                    delay={0.3}
                />
            </div>

            {/* Additional charts could be placed here */}
        </div>
    );
};

export default Dashboard;
