import { useEffect, useRef } from 'react'
import * as echarts from 'echarts'

export default function EChart({ option, height = 240 }) {
  const ref = useRef(null)
  const inst = useRef(null)

  useEffect(() => {
    if (!ref.current) return
    inst.current = echarts.init(ref.current, null, { renderer: 'svg' })
    inst.current.setOption(option)
    const ro = new ResizeObserver(() => inst.current && inst.current.resize())
    ro.observe(ref.current)
    let cancelled = false
    if (document.fonts && document.fonts.ready) {
      document.fonts.ready.then(() => { if (!cancelled && inst.current) inst.current.resize() })
    }
    return () => { cancelled = true; ro.disconnect(); inst.current && inst.current.dispose() }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (inst.current) inst.current.setOption(option, true)
  }, [option])

  return <div ref={ref} className="chart" style={{ height }} />
}
