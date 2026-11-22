import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

export interface CardProps {
  className?: string;
  children: ReactNode;
}

export function Card({ className, children }: CardProps) {
  return (
    <div className={cn('rounded-xl bg-white p-6 shadow-sm', className)}>{children}</div>
  );
}