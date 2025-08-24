import { ButtonHTMLAttributes, ReactNode } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
}

export const Button = ({ children, className, ...props }: ButtonProps) => {
  return (
    <button
      className={`
        bg-primary text-primary-foreground px-4 py-2 rounded-lg 
        hover:bg-primary/90 active:bg-primary/80 
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
