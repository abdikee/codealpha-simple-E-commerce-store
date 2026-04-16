import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs) {
  return twMerge(clsx(inputs));
}

export function Input({
  label,
  helperText,
  errorMessage,
  leadingIcon,
  trailingIcon,
  variant = 'default',
  className,
  id,
  value,
  ...props
}) {
  const isError = !!errorMessage;

  return (
    <div className="flex flex-col gap-1.5 w-full">
      <div className="relative group">
        {leadingIcon && (
          <div className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors duration-200">
            {leadingIcon}
          </div>
        )}
        <input
          id={id}
          value={value}
          placeholder={label ? " " : props.placeholder}
          className={cn(
            "peer flex h-10 w-full rounded-md border-2 border-gray-200 bg-white px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-0 disabled:cursor-not-allowed disabled:bg-gray-50 transition-all duration-200",
            label && "pt-4 pb-1",
            leadingIcon && "pl-10",
            trailingIcon && "pr-10",
            variant === 'filled' && "bg-gray-100 border-transparent focus:bg-white focus:border-gray-200",
            isError && "border-destructive focus:ring-destructive",
            className
          )}
          {...props}
        />
        {label && (
          <label
            htmlFor={id}
            className={cn(
              "absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-400 pointer-events-none",
              "transition-all duration-200 origin-left",
              "peer-focus:-translate-y-[1.1rem] peer-focus:scale-75 peer-focus:text-primary",
              "peer-[:not(:placeholder-shown)]:-translate-y-[1.1rem] peer-[:not(:placeholder-shown)]:scale-75",
              leadingIcon && "left-10",
              isError
                ? "peer-focus:text-destructive peer-[:not(:placeholder-shown)]:text-destructive"
                : "peer-[:not(:placeholder-shown)]:text-gray-500"
            )}
          >
            {label}
          </label>
        )}
        {trailingIcon && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 cursor-pointer hover:text-gray-600 transition-colors">
            {trailingIcon}
          </div>
        )}
      </div>
      {errorMessage ? (
        <p className="text-xs text-destructive mt-1">{errorMessage}</p>
      ) : helperText ? (
        <p className="text-xs text-gray-500 mt-1">{helperText}</p>
      ) : null}
    </div>
  );
}
