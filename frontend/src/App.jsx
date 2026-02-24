import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { AnimatePresence } from 'framer-motion';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AlertList from './pages/AlertList';
import CreateAlert from './pages/CreateAlert';
import MapView from './pages/MapView';
import Statistics from './pages/Statistics';
import PageTransition from './components/PageTransition';

const ProtectedRoute = ({ children }) => {
  const { user } = useAuth();
  if (!user) return <Navigate to="/login" replace />;
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <div className="max-w-7xl mx-auto w-full flex-1 flex flex-col">
          {children}
        </div>
      </div>
    </>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/login" element={<PageTransition><Login /></PageTransition>} />
        <Route path="/" element={<ProtectedRoute><PageTransition><Dashboard /></PageTransition></ProtectedRoute>} />
        <Route path="/alerts" element={<ProtectedRoute><PageTransition><AlertList /></PageTransition></ProtectedRoute>} />
        <Route path="/create-alert" element={<ProtectedRoute><PageTransition><CreateAlert /></PageTransition></ProtectedRoute>} />
        <Route path="/map" element={<ProtectedRoute><PageTransition><MapView /></PageTransition></ProtectedRoute>} />
        <Route path="/statistics" element={<ProtectedRoute><PageTransition><Statistics /></PageTransition></ProtectedRoute>} />
      </Routes>
    </AnimatePresence>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <AnimatedRoutes />
      </Router>
    </AuthProvider>
  );
}

export default App;
