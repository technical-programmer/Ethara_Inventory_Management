const VARIANT_STYLES = {
  primary: 'bg-forest-dark text-paper hover:bg-ink border border-transparent shadow-sm',
  danger: 'bg-card text-clay border border-clay-line hover:bg-clay-soft',
  secondary: 'bg-card text-ink-soft border border-line hover:border-ink-faint hover:text-ink',
}

const SIZE_STYLES = {
  default: 'px-4 py-2.5 text-sm',
  sm: 'px-3 py-1.5 text-xs',
}

export const Button = ({
  children,
  variant = 'primary',
  size = 'default',
  type = 'button',
  onClick,
  disabled = false,
  className = '',
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`inline-flex items-center justify-center gap-1.5 rounded-lg font-medium tracking-tight transition-all duration-150 ease-out disabled:cursor-not-allowed disabled:opacity-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-forest focus-visible:ring-offset-2 focus-visible:ring-offset-paper active:scale-[0.97] ${SIZE_STYLES[size]} ${VARIANT_STYLES[variant]} ${className}`}
    >
      {children}
    </button>
  )
}