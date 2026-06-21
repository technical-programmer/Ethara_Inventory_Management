const LOW_STOCK_THRESHOLD = 10
const FULL_STOCK_REFERENCE = 50

export const StockGauge = ({ quantity }) => {
  const isOut = quantity === 0
  const isLow = quantity > 0 && quantity < LOW_STOCK_THRESHOLD

  const barColorClass = isOut ? 'bg-clay' : isLow ? 'bg-amber' : 'bg-forest'
  const fillPct = Math.min(100, (quantity / FULL_STOCK_REFERENCE) * 100)
  const label = isOut ? 'Out of stock' : isLow ? 'Low stock' : 'In stock'

  return (
    <div className="flex items-center gap-2.5">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-line-soft">
        <div
          className={`h-full rounded-full transition-[width] duration-500 ease-out ${barColorClass}`}
          style={{ width: `${isOut ? 100 : fillPct}%` }}
        />
      </div>
      <div className="flex flex-col leading-tight">
        <span className="font-mono text-sm font-medium tabular-nums text-ink">{quantity}</span>
        <span className="text-[10px] text-ink-faint">{label}</span>
      </div>
    </div>
  )
}