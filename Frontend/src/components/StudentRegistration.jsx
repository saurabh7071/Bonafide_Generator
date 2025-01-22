import { useState, useEffect } from "react";
import { Link,  useNavigate } from "react-router-dom";
import { FcGoogle } from 'react-icons/fc';
import axios from 'axios';
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth, db } from "../config/firebase";
import { setDoc, doc } from "firebase/firestore"
import { toast } from "react-toastify";

const Registration = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        prn: "",
        phone: "",
        email: "",
        password: "",
        department: "",
        gender: ""
    });

    const [departments, setDepartments] = useState([]);

    // Add validation state
    const [errors, setErrors] = useState({
        firstName: "",
        lastName: "",
        prn: "",
        phone: "",
        email: "",
        password: ""
    });

    // Fetch departments from database
    useEffect(() => {
        const fetchDepartments = async () => {
            try {
                const response = await axios.get('http://localhost:5500/api/v1/department-names/get-all-departments');
                if (response.data?.data) {
                    setDepartments(response.data.data);
                }
            } catch (error) {
                console.error('Error fetching departments:', error);
            }
        };

        fetchDepartments();
    }, []);

    // Validation functions
    const validateName = (name) => {
        const nameRegex = /^[A-Za-z\s]{2,30}$/;
        return nameRegex.test(name);
    };

    const validatePRN = (prn) => {
        const prnRegex = /^\d{13}$/;
        return prnRegex.test(prn);
    };

    const validatePhone = (phone) => {
        const phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[789]\d{9}$/;
        return phoneRegex.test(phone);
    };

    const validateEmail = (email) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const validatePassword = (password) => {
        const passwordRegex = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{6,}$/;
        return passwordRegex.test(password);
    };

    // Modified handleChange with validation
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));

        // Validate fields as user types
        switch (name) {
            case 'firstName':
            case 'lastName':
                if (!validateName(value)) {
                    setErrors(prev => ({
                        ...prev,
                        [name]: "Only letters allowed, minimum 2 characters"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, [name]: "" }));
                }
                break;

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

            case 'phone':
                if (!validatePhone(value)) {
                    setErrors(prev => ({
                        ...prev,
                        phone: "Enter valid Indian phone number"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, phone: "" }));
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
                if (!validatePassword(value)) {
                    setErrors(prev => ({
                        ...prev,
                        password: "Password must contain at least 6 characters, 1 uppercase, 1 number, and 1 special character"
                    }));
                } else {
                    setErrors(prev => ({ ...prev, password: "" }));
                }
                break;

            default:
                break;
        }
    };

    // Separate submit handler for registration
    const handleRegister = async (e) => {
        e.preventDefault();
        
        // Check all validations before proceeding
        const validationErrors = {
            firstName: !validateName(formData.firstName) ? "Invalid first name" : "",
            lastName: !validateName(formData.lastName) ? "Invalid last name" : "",
            prn: !validatePRN(formData.prn) ? "Invalid PRN" : "",
            phone: !validatePhone(formData.phone) ? "Invalid phone number" : "",
            email: !validateEmail(formData.email) ? "Invalid email" : "",
            password: !validatePassword(formData.password) ? "Invalid password" : ""
        };

        setErrors(validationErrors);

        // Check if there are any errors
        if (Object.values(validationErrors).some(error => error !== "")) {
            toast.error("Please fix all errors before submitting");
            return;
        }

        setIsLoading(true);

        try {
            // Log the form data being sent
            console.log("Attempting registration with data:", formData);

            const userCredential = await createUserWithEmailAndPassword(
                auth, 
                formData.email, 
                formData.password
            );

            console.log("Auth successful, user created:", userCredential.user.uid);

            const userDocRef = doc(db, "users", userCredential.user.uid);
            
            const userData = {
                firstName: formData.firstName,
                lastName: formData.lastName,
                prn: formData.prn,
                phoneNumber: formData.phone,
                email: formData.email,
                department: formData.department,
                gender: formData.gender,
                createdAt: new Date().toISOString(),
                userId: userCredential.user.uid,
                userType: "student"
            };

            // Log the actual data being saved to Firestore
            console.log("Attempting to save to Firestore:", userData);

            await setDoc(userDocRef, userData);
            
            console.log("User data saved successfully to Firestore");
            toast.success("Registration successful!");
            navigate('/login');

        } catch (error) {
            console.error("Detailed registration error:", {
                code: error.code,
                message: error.message,
                fullError: error
            });
            toast.error(error.message || "Registration failed");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8 py-12">
            <div className="max-w-2xl w-full space-y-8 bg-white p-8 rounded-2xl shadow-lg">
                {/* Header Section */}
                <div className="text-center mb-10">
                    <h2 className="text-3xl font-bold text-gray-900 font-inter">
                        Create your Account
                    </h2>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleRegister}>
                    {/* Name Fields Row */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                    className={`peer w-full rounded-lg border ${
                                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                                    } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    placeholder="First Name"
                                    required
                                />
                                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                                    First Name
                                </label>
                                {errors.firstName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.firstName}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex-1">
                            <div className="relative">
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                    className={`peer w-full rounded-lg border ${
                                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                                    } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                    placeholder="Last Name"
                                    required
                                />
                                <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                                    Last Name
                                </label>
                                {errors.lastName && (
                                    <p className="mt-1 text-xs text-red-500">{errors.lastName}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* PRN Field */}
                    <div className="relative">
                        <input
                            type="text"
                            name="prn"
                            value={formData.prn}
                            onChange={handleChange}
                            className={`peer w-full rounded-lg border ${
                                errors.prn ? 'border-red-500' : 'border-gray-300'
                            } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            placeholder="PRN"
                            required
                        />
                        <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                            PRN Number
                        </label>
                        {errors.prn && (
                            <p className="mt-1 text-xs text-red-500">{errors.prn}</p>
                        )}
                    </div>

                    {/* Phone Field */}
                    <div className="relative">
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className={`peer w-full rounded-lg border ${
                                errors.phone ? 'border-red-500' : 'border-gray-300'
                            } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                            placeholder="Phone"
                            required
                        />
                        <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                            Phone Number
                        </label>
                        {errors.phone && (
                            <p className="mt-1 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>

                    {/* Email and Password Fields */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1 relative">
                            <input
                                type="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                className={`peer w-full rounded-lg border ${
                                    errors.email ? 'border-red-500' : 'border-gray-300'
                                } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Email"
                                required
                            />
                            <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                                Email Address
                            </label>
                            {errors.email && (
                                <p className="mt-1 text-xs text-red-500">{errors.email}</p>
                            )}
                        </div>
                        <div className="flex-1 relative">
                            <input
                                type="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                className={`peer w-full rounded-lg border ${
                                    errors.password ? 'border-red-500' : 'border-gray-300'
                                } px-4 py-3 text-gray-900 placeholder-transparent focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500`}
                                placeholder="Password"
                                required
                            />
                            <label className="absolute left-4 -top-2.5 bg-white px-1 text-sm text-gray-600 transition-all peer-placeholder-shown:top-3.5 peer-placeholder-shown:text-base peer-placeholder-shown:text-gray-400 peer-focus:-top-2.5 peer-focus:text-sm peer-focus:text-blue-500">
                                Password
                            </label>
                            {errors.password && (
                                <p className="mt-1 text-xs text-red-500">{errors.password}</p>
                            )}
                        </div>
                    </div>

                    {/* Department Dropdown with fetched data */}
                    <div className="relative">
                        <select
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            required
                        >
                            <option value="">Select Department</option>
                            {departments.map((dept) => (
                                <option key={dept._id} value={dept._id}>
                                    {dept.departmentName}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="relative">
                        <select
                            name="gender"
                            value={formData.gender}
                            onChange={handleChange}
                            className="w-full rounded-lg border border-gray-300 px-4 py-3 text-gray-900 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                            required
                        >
                            <option value="">Select Gender</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                            <option value="other">Other</option>
                        </select>
                    </div>

                    {/* Submit Button */}
                    <div>
                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors disabled:bg-blue-400"
                        >
                            {isLoading ? 'Creating Account...' : 'Create an Account'}
                        </button>
                        <div className="text-right mt-2">
                            <Link to="/login" className="text-sm font-medium text-gray-500">
                                Already have an account?<span className="text-blue-600"> Login here</span>
                            </Link>
                        </div>
                    </div>

                    {/* Divider */}
                    <div className="relative mt-8">
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
                        className="w-full flex items-center justify-center gap-3 py-3 px-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    >
                        <FcGoogle className="text-xl" />
                        <span className="text-gray-700 font-semibold">Sign up with Google</span>
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Registration;
