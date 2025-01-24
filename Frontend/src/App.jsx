import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState, useEffect } from 'react';
import { auth } from './config/firebase';
import Registration from './components/StudentRegistration';
import StudentLogin from './components/StudentLogin';
import ForgotPassword from './components/ForgotPassword';
import StudentProfile from './components/StudentProfile';
import LoadingSpinner from './components/LoadingSpinner';
import PropTypes from 'prop-types';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (!user) {
        return <Navigate to="/login" />;
    }

    return children;
};

// Add PropTypes validation
ProtectedRoute.propTypes = {
    children: PropTypes.node.isRequired
};

// Public Route Component (for login/register pages)
const PublicRoute = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    if (loading) {
        return <LoadingSpinner />;
    }

    if (user) {
        return <Navigate to="/profile" />;
    }

    return children;
};

// Add PropTypes validation
PublicRoute.propTypes = {
    children: PropTypes.node.isRequired
};

function App() {
    return (
        <BrowserRouter>
            <Routes>
                {/* Public Routes */}
                <Route 
                    path="/" 
                    element={
                        <PublicRoute>
                            <StudentLogin />
                        </PublicRoute>
                    }
                />
                <Route 
                    path="/login" 
                    element={
                        <PublicRoute>
                            <StudentLogin />
                        </PublicRoute>
                    }
                />
                <Route 
                    path="/register" 
                    element={
                        <PublicRoute>
                            <Registration />
                        </PublicRoute>
                    }
                />
                <Route path="/forgot-password" element={<ForgotPassword />} />

                {/* Protected Routes */}
                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute>
                            <StudentProfile />
                        </ProtectedRoute>
                    }
                />
            </Routes>
            <ToastContainer
                position="top-right"
                autoClose={2000}
                hideProgressBar={false}
                newestOnTop={true}
                closeOnClick={true}
                rtl={false}
                pauseOnFocusLoss
                draggable
                pauseOnHover={false}
                theme="light"
            />
        </BrowserRouter>
    );
}

export default App;
