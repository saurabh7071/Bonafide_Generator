import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from 'react-toastify';

const ForgotPassword = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        prn: "",
        email: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // Add your password reset API call here
            toast.success("Password reset link sent to your email!");
        } catch (error) {
            toast.error(error.message || "Failed to send reset link");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 font-inter">
                        Forgot Password
                    </h2>
                    <p className="mt-2 text-sm text-gray-600">
                        Enter your PRN and email to reset your password
                    </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    {/* PRN Field */}
                    <div className="relative">
                        <input
                            type="text"
                            name="prn"
                            value={formData.prn}
                            onChange={handleChange}
                            className="peer w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="PRN"
                            required
                        />
                        <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
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
                            className="peer w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                            placeholder="Email"
                            required
                        />
                        <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                            Email Address
                        </label>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
                        >
                            {isLoading ? 'Sending...' : 'Send Reset Link'}
                        </button>
                        <div className="text-center mt-4">
                            <Link to="/login" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                                Back to Login
                            </Link>
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default ForgotPassword;
