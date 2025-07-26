import React, { useEffect } from "react";
import { XCircle, CheckCircle, AlertCircle, Info } from "lucide-react";

export type ToastType = "success" | "error" | "warning" | "info";

interface ToastProps {
  type: ToastType;
  message: string;
  onClose: () => void;
  duration?: number;
}

const icons = {
  success: <CheckCircle className="w-5 h-5 text-green-500" />,
  error: <XCircle className="w-5 h-5 text-red-500" />,
  warning: <AlertCircle className="w-5 h-5 text-yellow-500" />,
  info: <Info className="w-5 h-5 text-blue-500" />,
};

const backgrounds = {
  success: "bg-green-50 border-green-200",
  error: "bg-red-50 border-red-200",
  warning: "bg-yellow-50 border-yellow-200",
  info: "bg-blue-50 border-blue-200",
};

export const Toast: React.FC<ToastProps> = ({
  type,
  message,
  onClose,
  duration = 3000,
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  return (
    <div
      className={`
        flex items-center gap-2 px-4 py-3 rounded-lg border
        shadow-lg animate-slide-in
        ${backgrounds[type]}
      `}
      role="alert"
    >
      {icons[type]}
      <p className="text-sm font-medium">{message}</p>
      <button
        onClick={onClose}
        className="ml-auto hover:opacity-70 transition-opacity"
        aria-label="Close notification"
      >
        <XCircle className="w-5 h-5 text-gray-400" />
      </button>
    </div>
  );
};
