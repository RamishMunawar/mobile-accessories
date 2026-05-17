import { useEffect, useMemo, useState } from 'react'

function calc(target) {
  const diff = Math.max(0, target.getTime() - Date.now())
  const totalSec = Math.floor(diff / 1000)
  return {
    days: Math.floor(totalSec / 86400),
    hours: Math.floor((totalSec % 86400) / 3600),
    minutes: Math.floor((totalSec % 3600) / 60),
    seconds: totalSec % 60,
  }
}

/**
 * @param {Date | string | number} targetDate
 */
export function useCountdown(targetDate) {
  const target = useMemo(() => new Date(targetDate), [targetDate])
  const targetMs = target.getTime()
  const [parts, setParts] = useState(() => calc(target))

  useEffect(() => {
    const tick = () => setParts(calc(new Date(targetMs)))
    const id = window.setInterval(tick, 1000)
    const sync = window.setTimeout(tick, 0)
    return () => {
      window.clearInterval(id)
      window.clearTimeout(sync)
    }
  }, [targetMs])

  return parts
}
