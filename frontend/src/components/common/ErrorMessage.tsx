import { AlertCircle } from "lucide-react";

interface ErrorMessageProps {
  message: string;
  className?: string;
}

export const ErrorMessage = ({
  message,
  className = "",
}: ErrorMessageProps) => {
  if (!message) return null;

  return (
    <div
      className={`flex items-center p-4 text-red-800 bg-red-50 rounded-lg ${className}`}
      role="alert"
    >
      <AlertCircle className="w-5 h-5 mr-2" />
      <span className="text-sm font-medium">{message}</span>
    </div>
  );
};
