import { useState, useEffect, useRef } from "react";

export default function SuccessCard({
  isOpen,
  onClose,
  title = "Wallet Created",
  message = "Your wallet has been created successfully",
}) {
  const [timeLeft, setTimeLeft] = useState(5);
  const onCloseRef = useRef(onClose);

  // Keep the ref updated with the latest onClose function
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  const handleClose = () => {
    if (onCloseRef.current) {
      onCloseRef.current();
    }
  };

  useEffect(() => {
    if (!isOpen) return;

    setTimeLeft(5);

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          handleClose();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[99999] flex items-center justify-center bg-black/50 backdrop-blur-md p-4">
      {/* Card */}
      <div className="relative w-full max-w-[420px] bg-white rounded-2xl shadow-[0_30px_80px_rgba(0,0,0,0.25)] border border-gray-100 px-8 pt-10 pb-8 flex flex-col items-center animate-modalEnter">

        {/* Close Button (X) */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition"
          aria-label="Close"
        >
          <svg
            className="w-4 h-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M6 18L18 6" />
          </svg>
        </button>

        {/* Success Icon */}
        <div className="flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 mb-6">
          <div className="flex items-center justify-center w-14 h-14 rounded-full bg-emerald-500 shadow-md">
            <svg
              className="w-8 h-8 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="3"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>

        {/* Title & Message */}
        <h2 className="text-xl font-semibold text-gray-900 text-center mb-2">
          {title}
        </h2>
        <p className="text-sm text-gray-500 text-center mb-8 leading-relaxed">
          {message}
        </p>

        {/* Done Button */}
        <button
          onClick={handleClose}
          className="w-full rounded-xl bg-emerald-500 hover:bg-emerald-600 text-white font-semibold py-3 transition active:scale-[0.97] shadow-sm"
        >
          Done
          <span className="ml-2 opacity-80 font-normal">
            ({timeLeft}s)
          </span>
        </button>
      </div>
    </div>
  );
}