import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { toast } from "react-toastify";
import { collection, query, where, getDocs } from "firebase/firestore";

const Login = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        prn: "",
        email: "",
        password: ""
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate fields as user types
        switch (name) {
            case 'prn':
                if (!validatePRN(value)) {
                    setErrors(prev => ({
                        ...prev,
                        prn: "PRN must be exactly 13 digits"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, prn: "" }));
                }
                break;

            case 'email':
                if (!validateEmail(value)) {
                    setErrors(prev => ({
                        ...prev,
                        email: "Enter valid email address"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, email: "" }));
                }
                break;

            case 'password':
                if (!value) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password is required"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, password: "" }));
                }
                break;

            default:
                break;
        }
    };

    const handleLogin = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            // First verify PRN
            const userQuery = query(
                collection(db, "users"),
                where("prn", "==", formData.prn),
                where("email", "==", formData.email)
            );
            
            const userSnapshot = await getDocs(userQuery);
            
            if (userSnapshot.empty) {
                toast.error("Invalid PRN or Email combination");
                setIsLoading(false);
                return;
            }

            // If PRN and email match, try to login
            await signInWithEmailAndPassword(auth, formData.email, formData.password);
            toast.success("Login successful! Welcome back!");
            navigate('/profile');

        } catch (error) {
            if (error.code === 'auth/wrong-password') {
                toast.error("Incorrect password");
            } else if (error.code === 'auth/user-not-found') {
                toast.error("No account found with this email");
            } else {
                toast.error("Login failed. Please try again.");
            }
            console.error("Login error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-[#2B4C7C] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full bg-[#0A6DF0] rounded-2xl shadow-xl">
                <h2 className="text-3xl font-bold text-white py-6 text-center">
                    Login to your Account
                </h2>

                <div className="bg-white rounded-b-2xl">
                    <form className="px-8 py-6 space-y-6" onSubmit={handleLogin}>
                        {/* PRN Field */}
                        <div className="relative">
                            <input
                                type="text"
                                name="prn"
                                value={formData.prn}
                                onChange={handleChange}
                                className="peer w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-transparent focus:border-[#0A6DF0] focus:outline-none shadow-sm"
                                placeholder="PRN"
                                required
                            />
                            <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#0A6DF0]">
                                PRN Number
                            </label>
                        </div>

                        {/* Email Field */}
                        <div className="relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className="peer w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-transparent focus:border-[#0A6DF0] focus:outline-none shadow-sm"
                                placeholder="Email"
                                required
                            />
                            <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#0A6DF0]">
                                Email Address
                            </label>
                        </div>

                        {/* Password Field */}
                        <div className="relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className="peer w-full rounded-md border border-gray-300 px-4 py-3 text-gray-900 placeholder-transparent focus:border-[#0A6DF0] focus:outline-none shadow-sm"
                                placeholder="Password"
                                required
                            />
                            <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-[#0A6DF0]">
                                Password
                            </label>
                            
                        </div>

                        {/* Forgot Password Link */}
                        <div className="text-right">
                            <Link to="/forgot-password" className="text-sm font-medium text-[#0A6DF0] hover:text-blue-700">
                                Forgot Password?
                            </Link>
                        </div>

                        {/* Submit Button */}
                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full py-3 px-4 bg-gradient-to-r from-[#0A6DF0] to-[#002961] text-white font-medium rounded-md transition-all shadow-md hover:shadow-lg active:shadow-inner disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? 'Logging in...' : 'Login'}
                            </button>
                            <div className="text-right mt-2">
                                <Link to="/register" className="text-sm font-medium text-gray-500">
                                    Don&apos;t have an account?<span className="text-[#0A6DF0]"> Register here</span>
                                </Link>
                            </div>
                        </div>

                        {/* Divider */}
                        <div className="relative">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white text-gray-500">Or continue with</span>
                            </div>
                        </div>

                        {/* Google Sign In */}
                        <button
                            type="button"
                            className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                        >
                            <FcGoogle className="text-xl" />
                            <span className="text-gray-700 font-semibold">Sign in with Google</span>
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default Login; 