import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Registration from './components/StudentRegistration';
import StudentLogin from './components/StudentLogin';
import ForgotPassword from './components/ForgotPassword';

function App() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<StudentLogin />} />
                <Route path="/login" element={<StudentLogin />} />
                <Route path="/register" element={<Registration />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
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
