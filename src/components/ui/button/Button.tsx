import React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  className?: string;
  size?: "sm" | "md" | "lg";
  loading?: boolean;
}

const Button: React.FC<ButtonProps> = ({ className = "", size = "md", loading, children, ...props }) => {
  const sizeClasses =
    size === "sm" ? "px-4 py-2 text-sm" : size === "lg" ? "px-6 py-3 text-lg" : "px-5 py-2.5 text-base";

  const baseClasses = `inline-flex items-center justify-center rounded-lg text-white transition ${sizeClasses} ${className}`;

  return (
    <button
      className={`${baseClasses} ${
        loading || props.disabled
          ? "bg-teal-600 cursor-not-allowed"
          : "bg-gradient-to-br from-teal-600 via-cyan-700 to-teal-400 hover:from-teal-700 hover:via-cyan-800 hover:to-teal-500"
      }`}
      disabled={loading || props.disabled}
      {...props}
    >
      {loading && (
        <svg
          className="w-5 h-5 mr-2 animate-spin text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z"
          ></path>
        </svg>
      )}
      {children}
    </button>
  );
};

export default Button;
