import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
} from 'chart.js';
import { Bar, Pie } from 'react-chartjs-2';
import api from '../api/axios';
import { FiPieChart } from 'react-icons/fi';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

const Statistics = () => {
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

    if (loading) return <div className="p-8 text-center text-gray-500">Loading statistics...</div>;
    if (!stats) return <div className="p-8 text-center text-red-500">Failed to load statistics.</div>;

    // Prepare data for Severity Bar Chart
    const severityLabels = Object.keys(stats.severityBreakdown || {});
    const severityData = Object.values(stats.severityBreakdown || {});

    const severityChartData = {
        labels: severityLabels.length ? severityLabels : ['None'],
        datasets: [
            {
                label: 'Number of Alerts',
                data: severityData.length ? severityData : [0],
                backgroundColor: [
                    'rgba(239, 68, 68, 0.7)',  // Red
                    'rgba(245, 158, 11, 0.7)', // Yellow/Orange
                    'rgba(59, 130, 246, 0.7)', // Blue
                    'rgba(16, 185, 129, 0.7)', // Green
                ],
                borderColor: [
                    'rgb(239, 68, 68)',
                    'rgb(245, 158, 11)',
                    'rgb(59, 130, 246)',
                    'rgb(16, 185, 129)',
                ],
                borderWidth: 1,
                borderRadius: 8,
            },
        ],
    };

    const barOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { display: false },
            title: { display: false },
        },
        scales: {
            y: { beginAtZero: true, grid: { display: true, color: '#f3f4f6' } },
            x: { grid: { display: false } },
        }
    };

    // Prepare data for Status Pie Chart
    const statusLabels = Object.keys(stats.statusBreakdown || {});
    const statusData = Object.values(stats.statusBreakdown || {});

    const statusPieData = {
        labels: statusLabels.length ? statusLabels : ['None'],
        datasets: [
            {
                data: statusData.length ? statusData : [1],
                backgroundColor: [
                    'rgba(59, 130, 246, 0.7)', // Open (Blue)
                    'rgba(245, 158, 11, 0.7)', // In Progress (Yellow)
                    'rgba(16, 185, 129, 0.7)', // Closed (Green)
                ],
                borderColor: ['#fff', '#fff', '#fff'],
                borderWidth: 2,
            },
        ],
    };

    const pieOptions = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: { position: 'bottom' },
        },
    };

    return (
        <div className="p-8">
            <div className="mb-8 flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
                        <FiPieChart /> Analytics & Reporting
                    </h2>
                    <p className="text-gray-500 mt-2">Deeper insight into alert volume and historical resolution data.</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Severity Bar Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Alerts by Severity</h3>
                        <p className="text-sm text-gray-500">Distribution of incidents broken out by priority level.</p>
                    </div>
                    <div className="h-80 w-full">
                        <Bar data={severityChartData} options={barOptions} />
                    </div>
                </motion.div>

                {/* Status Pie Chart */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
                >
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-gray-800">Alert Resolutions</h3>
                        <p className="text-sm text-gray-500">Breakdown of reported events by their current handling status.</p>
                    </div>
                    <div className="h-80 w-full">
                        <Pie data={statusPieData} options={pieOptions} />
                    </div>
                </motion.div>
            </div>
        </div>
    );
};

export default Statistics;
