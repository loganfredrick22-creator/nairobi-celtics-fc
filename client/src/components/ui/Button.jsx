import { motion } from 'framer-motion';

export default function Button({ children, variant = 'primary', size = 'md', className = '', disabled, loading, onClick, type = 'button', ...props }) {
  const base = 'inline-flex items-center justify-center font-body font-semibold rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed';
  const variants = {
    primary: 'bg-green text-black hover:bg-green/90',
    secondary: 'bg-card text-white border border-green/30 hover:border-green',
    outline: 'bg-transparent text-green border-2 border-green hover:bg-green/10',
    ghost: 'bg-transparent text-white hover:text-green',
    danger: 'bg-red-600 text-white hover:bg-red-700',
  };
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-5 py-2.5 text-sm',
    lg: 'px-8 py-3 text-base',
    xl: 'px-10 py-4 text-lg',
  };

  return (
    <motion.button
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {loading ? (
        <svg className="animate-spin h-5 w-5 mr-2" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" /><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" /></svg>
      ) : null}
      {children}
    </motion.button>
  );
}
