import { useState, useEffect } from 'react';
import { auth, db } from '../config/firebase';
import { collection, query, where, getDocs, addDoc, doc, getDoc } from 'firebase/firestore';
import { FiUser, FiFileText, FiClock, FiDownload, FiEye } from 'react-icons/fi';
import { toast } from 'react-toastify';

const StudentProfile = () => {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showRequestModal, setShowRequestModal] = useState(false);
    const [reason, setReason] = useState('');

    // Fetch user data and bonafide requests
    useEffect(() => {
        const fetchData = async () => {
            try {
                const userDoc = await getDoc(doc(db, "users", auth.currentUser.uid));
                setUser(userDoc.data());

                const requestsQuery = query(
                    collection(db, "bonafideRequests"),
                    where("userId", "==", auth.currentUser.uid)
                );
                const requestsSnapshot = await getDocs(requestsQuery);
                const requestsData = requestsSnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setRequests(requestsData);
            } catch (error) {
                console.error("Error fetching data:", error);
                toast.error("Failed to load profile data");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    const handleRequestBonafide = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await addDoc(collection(db, "bonafideRequests"), {
                userId: auth.currentUser.uid,
                studentName: `${user.firstName} ${user.lastName}`,
                prn: user.prn,
                department: user.department,
                reason: reason,
                status: "pending",
                requestDate: new Date().toISOString(),
                documentUrl: null
            });
            toast.success("Bonafide request submitted successfully!");
            setShowRequestModal(false);
            setReason('');
            // Refresh requests
            const requestsQuery = query(
                collection(db, "bonafideRequests"),
                where("userId", "==", auth.currentUser.uid)
            );
            const requestsSnapshot = await getDocs(requestsQuery);
            const requestsData = requestsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setRequests(requestsData);
        } catch (error) {
            console.error("Error submitting request:", error);
            toast.error("Failed to submit request");
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'approved': return 'bg-green-100 text-green-800';
            case 'rejected': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    if (loading) return <div>Loading...</div>;

    return (
        <div className="min-h-screen bg-[#2B4C7C]">
            {/* Profile Header */}
            <div className="bg-[#0A6DF0] text-white py-6 px-4 sm:px-6 lg:px-8">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                        <div className="bg-white p-3 rounded-full">
                            <FiUser className="h-6 w-6 text-[#0A6DF0]" />
                        </div>
                        <div>
                            <h1 className="text-2xl font-bold">{user?.firstName} {user?.lastName}</h1>
                            <p className="text-sm opacity-90">PRN: {user?.prn}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowRequestModal(true)}
                        className="bg-white text-[#0A6DF0] px-4 py-2 rounded-md font-medium hover:bg-opacity-90 transition-colors"
                    >
                        Request Bonafide
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Total Requests</p>
                                <p className="text-2xl font-bold text-gray-900">{requests.length}</p>
                            </div>
                            <div className="bg-blue-100 p-3 rounded-full">
                                <FiFileText className="h-6 w-6 text-[#0A6DF0]" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Pending</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {requests.filter(r => r.status === 'pending').length}
                                </p>
                            </div>
                            <div className="bg-yellow-100 p-3 rounded-full">
                                <FiClock className="h-6 w-6 text-yellow-600" />
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl p-6 shadow-md">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-sm text-gray-600">Approved</p>
                                <p className="text-2xl font-bold text-gray-900">
                                    {requests.filter(r => r.status === 'approved').length}
                                </p>
                            </div>
                            <div className="bg-green-100 p-3 rounded-full">
                                <FiFileText className="h-6 w-6 text-green-600" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Requests Table */}
                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Date
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Reason
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Status
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Actions
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {requests.map((request) => (
                                    <tr key={request.id}>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            {new Date(request.requestDate).toLocaleDateString()}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-900">
                                            {request.reason}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusColor(request.status)}`}>
                                                {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                            <div className="flex space-x-3">
                                                {request.documentUrl && (
                                                    <>
                                                        <button
                                                            className="text-[#0A6DF0] hover:text-blue-700"
                                                            onClick={() => window.open(request.documentUrl, '_blank')}
                                                        >
                                                            <FiEye className="h-5 w-5" />
                                                        </button>
                                                        <button
                                                            className="text-[#0A6DF0] hover:text-blue-700"
                                                            onClick={() => {/* Download logic */}}
                                                        >
                                                            <FiDownload className="h-5 w-5" />
                                                        </button>
                                                    </>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {/* Request Modal */}
            {showRequestModal && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
                    <div className="bg-white rounded-xl shadow-xl p-8 max-w-md w-full mx-4">
                        <h2 className="text-2xl font-bold text-gray-900 mb-6">Request Bonafide</h2>
                        <form onSubmit={handleRequestBonafide}>
                            <div className="mb-6">
                                <label className="block text-gray-700 text-sm font-medium mb-2">
                                    Reason for Request
                                </label>
                                <textarea
                                    value={reason}
                                    onChange={(e) => setReason(e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-[#0A6DF0]"
                                    rows="4"
                                    required
                                ></textarea>
                            </div>
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="button"
                                    onClick={() => setShowRequestModal(false)}
                                    className="px-4 py-2 text-gray-600 hover:text-gray-800"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-[#0A6DF0] text-white rounded-md hover:bg-blue-700"
                                    disabled={loading}
                                >
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentProfile;