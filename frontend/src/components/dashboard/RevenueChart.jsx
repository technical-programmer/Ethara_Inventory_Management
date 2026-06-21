import { useMemo } from 'react'

const formatDateLabel = (dateKey) => {
  const [, month, day] = dateKey.split('-')
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec']
  return `${months[parseInt(month, 10) - 1]} ${parseInt(day, 10)}`
}

export const RevenueChart = ({ orders }) => {
  const { points, totalRevenue, maxValue } = useMemo(() => {
    if (!orders || orders.length === 0) {
      return { points: [], totalRevenue: 0, maxValue: 0 }
    }

    const byDay = {}
    orders.forEach((order) => {
      const dateKey = new Date(order.created_at).toISOString().slice(0, 10)
      byDay[dateKey] = (byDay[dateKey] || 0) + order.total_amount
    })

    const sortedKeys = Object.keys(byDay).sort()
    const dailyPoints = sortedKeys.map((key) => ({ dateKey: key, value: byDay[key] }))

    const total = dailyPoints.reduce((sum, p) => sum + p.value, 0)
    const max = Math.max(...dailyPoints.map((p) => p.value), 1)

    return { points: dailyPoints, totalRevenue: total, maxValue: max }
  }, [orders])

  if (points.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-line bg-card px-6 py-16 text-center">
        <p className="text-sm text-ink-faint">No revenue data yet. Place an order to see trends here.</p>
      </div>
    )
  }

  const width = 600
  const height = 180
  const padding = { top: 28, right: 12, bottom: 28, left: 44 }
  const plotWidth = width - padding.left - padding.right
  const plotHeight = height - padding.top - padding.bottom

  const isSparse = points.length < 3
  const gridFracs = [0, 0.25, 0.5, 0.75, 1]

  const stepX = points.length > 1 ? plotWidth / (points.length - 1) : 0
  const coords = points.map((p, i) => {
    const x = padding.left + (points.length > 1 ? i * stepX : plotWidth / 2)
    const y = padding.top + plotHeight - (p.value / maxValue) * plotHeight
    return { x, y, ...p }
  })

  const linePath = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ')
  const areaPath = `${linePath} L ${coords[coords.length - 1].x} ${padding.top + plotHeight} L ${coords[0].x} ${padding.top + plotHeight} Z`

  const lastPoint = coords[coords.length - 1]
  const barWidth = 28

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-card">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-line-soft px-5 py-4">
        <div>
          <h3 className="font-display text-base font-semibold text-ink">Revenue</h3>
          <p className="mt-0.5 text-sm text-ink-soft">Daily totals from placed orders</p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-semibold tabular-nums text-ink">
            ${totalRevenue.toFixed(2)}
          </p>
          <p className="text-[11px] text-ink-faint">total across {points.length} day{points.length !== 1 ? 's' : ''}</p>
        </div>
      </div>

      <div className="relative px-2 py-4 sm:px-5">
        <svg viewBox={`0 0 ${width} ${height}`} className="w-full" preserveAspectRatio="none">
          <defs>
            <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#3D6B5C" stopOpacity="0.18" />
              <stop offset="100%" stopColor="#3D6B5C" stopOpacity="0" />
            </linearGradient>
          </defs>

          {gridFracs.map((frac) => {
            const y = padding.top + plotHeight * (1 - frac)
            return (
              <line
                key={frac}
                x1={padding.left}
                x2={width - padding.right}
                y1={y}
                y2={y}
                stroke="#F0EDE3"
                strokeWidth="1"
              />
            )
          })}

          {isSparse ? (
            coords.map((c, i) => (
              <rect
                key={i}
                x={c.x - barWidth / 2}
                y={c.y}
                width={barWidth}
                height={Math.max(padding.top + plotHeight - c.y, 2)}
                rx="6"
                fill="url(#revenueFill)"
                stroke="#3D6B5C"
                strokeWidth="1.5"
              />
            ))
          ) : (
            <>
              <path d={areaPath} fill="url(#revenueFill)" />
              <path d={linePath} fill="none" stroke="#3D6B5C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              {coords.map((c, i) => (
                <circle key={i} cx={c.x} cy={c.y} r="3.5" fill="#FFFFFF" stroke="#3D6B5C" strokeWidth="2" />
              ))}
            </>
          )}
        </svg>

       
        <div className="pointer-events-none absolute inset-0 px-2 py-4 sm:px-5">
          {gridFracs.map((frac) => {
            if (frac === 0) return null
            const value = maxValue * frac
            const topPercent = ((padding.top + plotHeight * (1 - frac)) / height) * 100
            return (
              <span
                key={frac}
                className="absolute -translate-y-1/2 font-mono text-[10px] text-ink-faint"
                style={{ top: `${topPercent}%`, left: 0 }}
              >
                ${value >= 1000 ? `${(value / 1000).toFixed(1)}k` : Math.round(value)}
              </span>
            )
          })}

          {coords.map((c, i) => {
            const leftPercent = (c.x / width) * 100
            const align = isSparse ? 'center' : i === 0 ? 'left' : i === coords.length - 1 ? 'right' : 'center'
            return (
              <span
                key={i}
                className="absolute bottom-0 font-mono text-[10px] text-ink-faint"
                style={{
                  left: `${leftPercent}%`,
                  transform: align === 'center' ? 'translateX(-50%)' : align === 'right' ? 'translateX(-100%)' : 'none',
                }}
              >
                {formatDateLabel(c.dateKey)}
              </span>
            )
          })}

          {(isSparse ? coords : [lastPoint]).map((c, i) => {
            const leftPercent = (c.x / width) * 100
            const topPercent = (Math.max(c.y - 22, padding.top - 4) / height) * 100
            return (
              <span
                key={i}
                className="absolute font-mono text-xs font-semibold text-forest-dark"
                style={{ left: `${leftPercent}%`, top: `${topPercent}%`, transform: 'translateX(-50%)' }}
              >
                ${c.value.toFixed(0)}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}