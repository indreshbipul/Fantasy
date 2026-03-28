import { useEffect } from 'react';
 
export function Toast({ title, message, type, onClose, duration = 5000 }) {
    useEffect(() => {
        if (duration) {
            const timer = setTimeout(() => {
                onClose(); 
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [duration, onClose]);

    // --- Theme Dictionary ---
    const theme = {
        success: {
            icon: (
                <svg className="h-6 w-6 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-white"
        },
        error: {
            icon: (
                <svg className="h-6 w-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-white"
        },
        info: {
            icon: (
                <svg className="h-6 w-6 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            bg: "bg-gray-50"
        }
    };

    const activeTheme = theme[type] || theme.info;

    return (
        <div className={`max-w-sm w-full ${activeTheme.bg} shadow-lg rounded-xl border border-gray-200 pointer-events-auto flex ring-1 ring-black/5 overflow-hidden transition-all duration-300 transform`}>
            <div className="p-4 w-full">
                <div className="flex items-start">
                    
                    <div className="flex-shrink-0">
                        {activeTheme.icon}
                    </div>
                    
                    <div className="ml-3 w-0 flex-1 pt-0.5">
                        <p className="text-sm font-semibold text-gray-900 tracking-tight">
                            {title}
                        </p>
                        {message && (
                            <p className="mt-1 text-sm text-gray-500 leading-relaxed">
                                {message}
                            </p>
                        )}
                    </div>
                    
                    <div className="ml-4 flex-shrink-0 flex">
                        <button 
                            onClick={onClose}
                            className="rounded-md inline-flex text-gray-400 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900 transition-colors"
                        >
                            <span className="sr-only">Close</span>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                            </svg>
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
};