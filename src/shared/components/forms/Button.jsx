export const Button = ({ children, className, ...props }) => (
  <button
    className={`bg-orange-gradient text-white font-bold py-2 px-6 rounded-lg 
    hover:shadow-[0_0_15px_rgba(245,124,0,0.5)] transition-all ${className}`}
    {...props}
  >
    {children}
  </button>
);
