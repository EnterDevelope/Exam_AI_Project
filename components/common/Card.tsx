import React from 'react';
import clsx from 'clsx';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  className?: string;
}

export default function Card({ children, className, ...props }: CardProps) {
  return (
    <div className={clsx('card', className)} {...props}>
      {children}
    </div>
  );
} 