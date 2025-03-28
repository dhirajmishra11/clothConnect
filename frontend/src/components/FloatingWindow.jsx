import { useState } from "react";

const FloatingWindow = () => {
    const [isOpen, setIsOpen] = useState(true);

    if (!isOpen) return null;

    return (
        <div className="absolute top-[559px] left-[682px] transform -translate-x-1/2 -translate-y-1/2 w-60 h-56 bg-gray-200 rounded-lg shadow-lg flex flex-col items-center p-4 text-center">
            <div className="w-full flex justify-between">
                <button className="text-lg hover:scale-110 transition-transform">&#x2022;</button>
                <button className="text-lg hover:scale-110 transition-transform" onClick={() => setIsOpen(false)}>&#10006;</button>
            </div>
            <div className="flex-1 text-sm text-gray-800 mt-2">
                <p className="text-yellow-700 font-bold">Welcome! Explore our platform...
                    <span className="text-green-600">ClothConnect</span>
                </p>
            </div>
            <div className="flex gap-3">
                <button onClick={() => window.location.href = 'register'} className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">Register</button>
                <button onClick={() => window.location.href = 'about-us'} className="px-3 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-600">About</button>
            </div>
        </div>
    );
};

export default FloatingWindow;
