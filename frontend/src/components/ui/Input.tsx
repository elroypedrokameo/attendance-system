import React, { forwardRef } from "react";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className = "", id, ...props }, ref) => {
    const inputId = id || props.name;

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-zinc-800 mb-1"
          >
            {label}
            {props.required && <span className="text-rose-500 ml-1">*</span>}
          </label>
        )}
        <input
          id={inputId}
          ref={ref}
          className={`w-full px-3 py-2 text-sm bg-white border rounded-lg shadow-xs transition-colors duration-150 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-offset-0 disabled:bg-zinc-100 disabled:text-zinc-500 disabled:border-zinc-200 disabled:cursor-not-allowed ${
            error
              ? "border-rose-400 focus:border-rose-500 focus:ring-rose-100"
              : "border-zinc-200 focus:border-zinc-900 focus:ring-zinc-900/10"
          } ${className}`}
          {...props}
        />
        {error ? (
          <p className="mt-1 text-xs text-rose-600 font-medium">{error}</p>
        ) : helperText ? (
          <p className="mt-1 text-xs text-zinc-500">{helperText}</p>
        ) : null}
      </div>
    );
  },
);

Input.displayName = "Input";
