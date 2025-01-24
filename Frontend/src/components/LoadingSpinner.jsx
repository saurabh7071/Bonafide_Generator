const LoadingSpinner = () => {
    return (
        <div className="min-h-screen bg-[#2B4C7C] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
                {/* Outer circle */}
                <div className="w-16 h-16 rounded-full border-4 border-[#0A6DF0]/30 border-t-[#0A6DF0] animate-spin"></div>
                
                {/* Inner circle */}
                <div className="absolute">
                    <div className="w-8 h-8 rounded-full border-4 border-[#0A6DF0]/30 border-t-white animate-spin"></div>
                </div>
                
                {/* Loading text */}
                <div className="mt-4 text-white font-medium animate-pulse">
                    Loading...
                </div>
            </div>
        </div>
    );
};

export default LoadingSpinner; 