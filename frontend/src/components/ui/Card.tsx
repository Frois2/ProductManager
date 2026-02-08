import { ReactNode } from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: ReactNode;
  className?: string;
  hoverable?: boolean;
  onClick?: () => void;
}

export const Card = ({ children, className = '', hoverable = false, onClick }: CardProps) => {
  const Component = hoverable ? motion.div : 'div';

  return (
    <Component className={`bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden ${className}`} whileHover={hoverable ? { y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.1)' } : undefined} onClick={onClick}>
      {children}
    </Component>
  );
};