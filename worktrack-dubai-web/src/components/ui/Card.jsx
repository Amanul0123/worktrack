import { motion } from 'framer-motion';

export default function Card({ children, className = '', hover = false, ...props }) {
  const base = `card ${className}`;
  if (hover) {
    return (
      <motion.div
        className={base}
        whileHover={{ y: -2, boxShadow: '0 4px 24px rgba(201,162,39,0.08)' }}
        transition={{ duration: 0.15 }}
        {...props}
      >
        {children}
      </motion.div>
    );
  }
  return <div className={base} {...props}>{children}</div>;
}
