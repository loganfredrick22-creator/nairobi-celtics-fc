export default function Badge({ children, variant = 'default', className = '' }) {
  const variants = {
    default: 'bg-green/20 text-green',
    gold: 'bg-gold/20 text-gold border border-gold/30',
    success: 'bg-green/20 text-green',
    danger: 'bg-red-500/20 text-red-400',
    warning: 'bg-yellow-500/20 text-yellow-400',
    info: 'bg-blue-500/20 text-blue-400',
  };

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}
