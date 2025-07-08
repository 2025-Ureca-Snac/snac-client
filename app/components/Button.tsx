import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        bg-blue-500 text-white px-4 py-2 rounded-lg 
        hover:bg-blue-600 active:bg-blue-700 
        transition-colors duration-200
        disabled:opacity-50 disabled:cursor-not-allowed
        ${className || ''}
      `}
      {...props}
    >
      {children}
    </button>
  );
};
