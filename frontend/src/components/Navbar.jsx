import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiBell, FiPlusSquare, FiPieChart, FiMap } from 'react-icons/fi';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    if (!user) return null;

    return (
        <nav className="bg-white shadow-md w-full z-10 sticky top-0">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex">
                        <div className="flex-shrink-0 flex items-center">
                            <span className="text-xl font-bold text-indigo-600 flex items-center gap-2">
                                <FiBell className="text-2xl" /> System Alert
                            </span>
                        </div>
                        <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                            <Link to="/" className="text-gray-900 border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Dashboard
                            </Link>
                            <Link to="/alerts" className="text-gray-900 border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Alerts
                            </Link>
                            <Link to="/statistics" className="text-gray-900 border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Statistics
                            </Link>
                            <Link to="/map" className="text-gray-900 border-transparent hover:border-indigo-500 hover:text-indigo-700 inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium">
                                Map View
                            </Link>
                        </div>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/create-alert" className="bg-indigo-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 flex items-center gap-2">
                            <FiPlusSquare /> Create Alert
                        </Link>
                        <div className="text-sm">
                            <p className="font-semibold text-gray-800">{user.name}</p>
                            <p className="text-xs text-gray-500">{user.role}</p>
                        </div>
                        <button
                            onClick={handleLogout}
                            className="text-gray-500 hover:text-red-600 transition p-2"
                            title="Logout"
                        >
                            <FiLogOut className="text-xl" />
                        </button>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
