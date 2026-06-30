import { useEffect, useRef, useState } from 'react'
import EChart from '../components/EChart.jsx'
import { lineOpt, barOpt, donutOpt, funnelOpt, heatOpt, gaugeOpt, C } from '../lib/charts.js'
import { nivoTheme, FUNNEL_COLORS } from '../lib/nivoTheme.js'

// existing project libs
import { ResponsiveFunnel } from '@nivo/funnel'
import { Chart as GoogleChart } from 'react-google-charts'
import HFunnel from '../components/HFunnel.jsx'
import JourneyFlow from '../components/JourneyFlow.jsx'
import Funnel3D from '../components/Funnel3D.jsx'

// recharts
import {
  ResponsiveContainer, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip as RTooltip, CartesianGrid,
  RadialBarChart, RadialBar, PolarAngleAxis,
} from 'recharts'
import { HeatmapRect } from '@visx/heatmap'

// visx
import { scaleLinear, scaleBand, scalePoint } from '@visx/scale'
import { LinePath, AreaClosed, Bar as VxBar, Pie as VxPie } from '@visx/shape'
import { AxisBottom, AxisLeft } from '@visx/axis'
import { Group } from '@visx/group'
import { LinearGradient } from '@visx/gradient'
import { curveMonotoneX } from '@visx/curve'

// raw d3
import * as d3 from 'd3'

/* ------------------------------------------------------------------ *
 * Shared sample data — identical numbers fed to every library so the
 * only thing that differs cell-to-cell is the rendering approach.
 * ------------------------------------------------------------------ */
const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const SESSIONS = [1240, 1580, 1320, 1890, 2100, 1760, 1980]
const LINE_DATA = DAYS.map((d, i) => ({ label: d, value: SESSIONS[i] }))

const CHANNELS = ['Organic', 'Paid', 'Social', 'Email', 'Direct']
const CHAN_VALUES = [4200, 5800, 3100, 2400, 3600]
const BAR_DATA = CHANNELS.map((c, i) => ({ name: c, value: CHAN_VALUES[i] }))

const DONUT_DATA = [
  { name: 'Desktop', value: 58, color: C.blue },
  { name: 'Mobile', value: 34, color: C.green },
  { name: 'Tablet', value: 8, color: C.blue2 },
]

const FUNNEL_RAW = [
  { name: 'Sessions', value: 10000 },
  { name: 'Product Views', value: 6200 },
  { name: 'Add to Cart', value: 3100 },
  { name: 'Checkout', value: 1800 },
  { name: 'Purchase', value: 1234 },
]
const FUNNEL_STEPS = FUNNEL_RAW.map(s => ({ ...s, p: Math.round((s.value / FUNNEL_RAW[0].value) * 100) + '%' }))

const H = 210            // chart height in every cell
const AXIS = C.grey
const FONT = 'Montserrat, "Noto Sans", sans-serif'

/* measure a container's width so visx / d3 svgs fill their cell responsively */
function useWidth() {
  const ref = useRef(null)
  const [w, setW] = useState(320)
  useEffect(() => {
    if (!ref.current) return
    const ro = new ResizeObserver(([e]) => setW(e.contentRect.width))
    ro.observe(ref.current)
    return () => ro.disconnect()
  }, [])
  return [ref, w]
}

/* ============================ RECHARTS ============================ */
function RechartsLine() {
  return (
    <ResponsiveContainer width="100%" height={H}>
      <AreaChart data={LINE_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="rc-line" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.blue} stopOpacity={0.35} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(138,155,187,.07)" vertical={false} />
        <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11, fontFamily: FONT }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11, fontFamily: FONT }} width={42} />
        <RTooltip contentStyle={tipStyle} cursor={{ stroke: 'rgba(197,208,224,.15)' }} />
        <Area type="monotone" dataKey="value" stroke={C.blue} strokeWidth={3} fill="url(#rc-line)" />
      </AreaChart>
    </ResponsiveContainer>
  )
}
function RechartsBar() {
  return (
    <ResponsiveContainer width="100%" height={H}>
      <BarChart data={BAR_DATA} margin={{ top: 8, right: 8, left: -18, bottom: 0 }}>
        <defs>
          <linearGradient id="rc-bar" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={C.green} stopOpacity={0.95} />
            <stop offset="100%" stopColor={C.blue} stopOpacity={0.9} />
          </linearGradient>
        </defs>
        <CartesianGrid stroke="rgba(138,155,187,.07)" vertical={false} />
        <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11, fontFamily: FONT }} />
        <YAxis tickLine={false} axisLine={false} tick={{ fill: AXIS, fontSize: 11, fontFamily: FONT }} width={42} />
        <RTooltip contentStyle={tipStyle} cursor={{ fill: 'rgba(43,143,234,.10)' }} />
        <Bar dataKey="value" fill="url(#rc-bar)" radius={[4, 4, 0, 0]} barSize={34} />
      </BarChart>
    </ResponsiveContainer>
  )
}
function RechartsDonut() {
  return (
    <ResponsiveContainer width="100%" height={H}>
      <PieChart>
        <RTooltip contentStyle={tipStyle} />
        <Pie data={DONUT_DATA} dataKey="value" nameKey="name" innerRadius="60%" outerRadius="86%" paddingAngle={2} stroke="none">
          {DONUT_DATA.map((d, i) => <Cell key={i} fill={d.color} />)}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  )
}
const tipStyle = {
  background: 'rgba(9,18,34,.96)', border: '1px solid rgba(43,143,234,.35)',
  borderRadius: 10, color: '#fff', fontFamily: FONT, fontSize: 12,
}

/* ============================== VISX ============================== */
function VisxLine() {
  const [ref, w] = useWidth()
  const m = { top: 10, right: 10, bottom: 24, left: 38 }
  const iw = Math.max(10, w - m.left - m.right), ih = H - m.top - m.bottom
  const x = scalePoint({ range: [0, iw], domain: DAYS, padding: 0.1 })
  const y = scaleLinear({ range: [ih, 0], domain: [0, Math.max(...SESSIONS) * 1.1], nice: true })
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={H}>
        <LinearGradient id="vx-line" from={C.blue} to={C.blue} fromOpacity={0.35} toOpacity={0} />
        <Group left={m.left} top={m.top}>
          <AreaClosed data={LINE_DATA} x={d => x(d.label)} y={d => y(d.value)} yScale={y}
            fill="url(#vx-line)" curve={curveMonotoneX} />
          <LinePath data={LINE_DATA} x={d => x(d.label)} y={d => y(d.value)}
            stroke={C.blue} strokeWidth={3} curve={curveMonotoneX} />
          <AxisLeft scale={y} numTicks={4} stroke="transparent" tickStroke="transparent"
            tickLabelProps={() => ({ fill: AXIS, fontSize: 11, fontFamily: FONT, dx: -4, dy: 4 })} />
          <AxisBottom scale={x} top={ih} stroke="transparent" tickStroke="transparent"
            tickLabelProps={() => ({ fill: AXIS, fontSize: 11, fontFamily: FONT, textAnchor: 'middle' })} />
        </Group>
      </svg>
    </div>
  )
}
function VisxBar() {
  const [ref, w] = useWidth()
  const m = { top: 10, right: 10, bottom: 24, left: 38 }
  const iw = Math.max(10, w - m.left - m.right), ih = H - m.top - m.bottom
  const x = scaleBand({ range: [0, iw], domain: CHANNELS, padding: 0.35 })
  const y = scaleLinear({ range: [ih, 0], domain: [0, Math.max(...CHAN_VALUES) * 1.1], nice: true })
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={H}>
        <LinearGradient id="vx-bar" from={C.green} to={C.blue} vertical />
        <Group left={m.left} top={m.top}>
          {BAR_DATA.map(d => {
            const bh = ih - y(d.value)
            return <VxBar key={d.name} x={x(d.name)} y={y(d.value)} width={x.bandwidth()} height={bh}
              fill="url(#vx-bar)" rx={4} />
          })}
          <AxisLeft scale={y} numTicks={4} stroke="transparent" tickStroke="transparent"
            tickLabelProps={() => ({ fill: AXIS, fontSize: 11, fontFamily: FONT, dx: -4, dy: 4 })} />
          <AxisBottom scale={x} top={ih} stroke="transparent" tickStroke="transparent"
            tickLabelProps={() => ({ fill: AXIS, fontSize: 11, fontFamily: FONT, textAnchor: 'middle' })} />
        </Group>
      </svg>
    </div>
  )
}
function VisxDonut() {
  const [ref, w] = useWidth()
  const r = Math.min(w, H) / 2
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={H}>
        <Group top={H / 2} left={w / 2}>
          <VxPie data={DONUT_DATA} pieValue={d => d.value} outerRadius={r - 4} innerRadius={(r - 4) * 0.62} padAngle={0.02}>
            {pie => pie.arcs.map((arc, i) => (
              <path key={i} d={pie.path(arc)} fill={DONUT_DATA[i].color} />
            ))}
          </VxPie>
        </Group>
      </svg>
    </div>
  )
}

/* =============================== D3 =============================== */
function D3Line() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const m = { top: 10, right: 10, bottom: 24, left: 38 }
    const iw = w - m.left - m.right, ih = H - m.top - m.bottom
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)
    const x = d3.scalePoint().domain(DAYS).range([0, iw]).padding(0.1)
    const y = d3.scaleLinear().domain([0, d3.max(SESSIONS) * 1.1]).nice().range([ih, 0])

    const defs = svg.append('defs')
    const grad = defs.append('linearGradient').attr('id', 'd3-line').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    grad.append('stop').attr('offset', '0%').attr('stop-color', C.blue).attr('stop-opacity', 0.35)
    grad.append('stop').attr('offset', '100%').attr('stop-color', C.blue).attr('stop-opacity', 0)

    const area = d3.area().x(d => x(d.label)).y0(ih).y1(d => y(d.value)).curve(d3.curveMonotoneX)
    const line = d3.line().x(d => x(d.label)).y(d => y(d.value)).curve(d3.curveMonotoneX)
    g.append('path').datum(LINE_DATA).attr('fill', 'url(#d3-line)').attr('d', area)
    g.append('path').datum(LINE_DATA).attr('fill', 'none').attr('stroke', C.blue).attr('stroke-width', 3).attr('d', line)

    g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0)).call(styleAxis)
    g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0)).call(styleAxis)
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}
function D3Bar() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const m = { top: 10, right: 10, bottom: 24, left: 38 }
    const iw = w - m.left - m.right, ih = H - m.top - m.bottom
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)
    const x = d3.scaleBand().domain(CHANNELS).range([0, iw]).padding(0.35)
    const y = d3.scaleLinear().domain([0, d3.max(CHAN_VALUES) * 1.1]).nice().range([ih, 0])

    const defs = svg.append('defs')
    const grad = defs.append('linearGradient').attr('id', 'd3-bar').attr('x1', 0).attr('y1', 0).attr('x2', 0).attr('y2', 1)
    grad.append('stop').attr('offset', '0%').attr('stop-color', C.green)
    grad.append('stop').attr('offset', '100%').attr('stop-color', C.blue)

    g.selectAll('rect').data(BAR_DATA).join('rect')
      .attr('x', d => x(d.name)).attr('y', d => y(d.value))
      .attr('width', x.bandwidth()).attr('height', d => ih - y(d.value))
      .attr('rx', 4).attr('fill', 'url(#d3-bar)')

    g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0)).call(styleAxis)
    g.append('g').call(d3.axisLeft(y).ticks(4).tickSize(0)).call(styleAxis)
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}
function D3Donut() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const r = Math.min(w, H) / 2 - 4
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${w / 2},${H / 2})`)
    const pie = d3.pie().value(d => d.value).padAngle(0.02)
    const arc = d3.arc().innerRadius(r * 0.62).outerRadius(r)
    g.selectAll('path').data(pie(DONUT_DATA)).join('path')
      .attr('d', arc).attr('fill', d => d.data.color)
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}
function D3Funnel() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const svg = d3.select(svgRef.current)
    svg.selectAll('*').remove()
    const pad = 8, rowH = (H - pad * 2) / FUNNEL_RAW.length
    const max = FUNNEL_RAW[0].value
    const x = d3.scaleLinear().domain([0, max]).range([0, w - 24])
    const g = svg.append('g').attr('transform', `translate(12,${pad})`)
    FUNNEL_RAW.forEach((s, i) => {
      const bw = x(s.value)
      g.append('rect')
        .attr('x', (w - 24 - bw) / 2).attr('y', i * rowH + 2)
        .attr('width', bw).attr('height', rowH - 6).attr('rx', 4)
        .attr('fill', FUNNEL_COLORS[i])
      g.append('text')
        .attr('x', (w - 24) / 2).attr('y', i * rowH + rowH / 2)
        .attr('text-anchor', 'middle').attr('dominant-baseline', 'middle')
        .attr('fill', '#04122b').attr('font-family', FONT).attr('font-weight', 700).attr('font-size', 11)
        .text(`${s.name} · ${FUNNEL_STEPS[i].p}`)
    })
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}

function styleAxis(sel) {
  sel.selectAll('text').attr('fill', AXIS).attr('font-family', FONT).attr('font-size', 11)
  sel.selectAll('.domain').attr('stroke', 'transparent')
}

/* ============================== NIVO ============================== */
function NivoFunnel() {
  return (
    <div style={{ height: H }}>
      <ResponsiveFunnel
        data={FUNNEL_RAW.map(s => ({ id: s.name, label: s.name, value: s.value }))}
        theme={nivoTheme}
        direction="vertical"
        margin={{ top: 8, right: 8, bottom: 8, left: 8 }}
        valueFormat=">-.0f"
        colors={FUNNEL_COLORS}
        borderWidth={0}
        labelColor="#04122b"
        beforeSeparatorLength={0}
        afterSeparatorLength={0}
        currentPartSizeExtension={0}
        motionConfig="gentle"
      />
    </div>
  )
}

/* ========================= GOOGLE CHARTS ========================= */
function GLine() {
  return (
    <GoogleChart chartType="LineChart" width="100%" height={`${H}px`}
      data={[['Day', 'Sessions'], ...LINE_DATA.map(d => [d.label, d.value])]}
      options={googleOpts({ legend: 'none', curveType: 'function', colors: [C.blue] })} />
  )
}
function GBar() {
  return (
    <GoogleChart chartType="ColumnChart" width="100%" height={`${H}px`}
      data={[['Channel', 'Value'], ...BAR_DATA.map(d => [d.name, d.value])]}
      options={googleOpts({ legend: 'none', colors: [C.green] })} />
  )
}
function GDonut() {
  return (
    <GoogleChart chartType="PieChart" width="100%" height={`${H}px`}
      data={[['Device', 'Share'], ...DONUT_DATA.map(d => [d.name, d.value])]}
      options={googleOpts({ pieHole: 0.62, legend: { position: 'right', textStyle: { color: C.text } }, colors: DONUT_DATA.map(d => d.color), pieSliceText: 'none' })} />
  )
}
const googleOpts = (extra) => ({
  backgroundColor: 'transparent',
  chartArea: { left: 44, top: 12, right: 12, bottom: 28, width: '100%', height: '100%' },
  hAxis: { textStyle: { color: C.grey, fontName: 'Montserrat' }, gridlines: { color: 'transparent' }, baselineColor: 'rgba(138,155,187,.15)' },
  vAxis: { textStyle: { color: C.grey, fontName: 'Montserrat' }, gridlines: { color: 'rgba(138,155,187,.07)' }, baselineColor: 'transparent' },
  fontName: 'Montserrat',
  tooltip: { textStyle: { color: '#04122b' } },
  ...extra,
})

/* ================ SIGNATURE: HORIZONTAL SMOOTH FUNNEL ============ *
 * Reference style: Nivo funnel, horizontal + smooth, warm gradient,
 * custom top labels (value / name / %) and thin separators.
 * ---------------------------------------------------------------- */
const HFUNNEL = [
  { id: 'Impressions', value: 12000 },
  { id: 'Add To Cart', value: 5700 },
  { id: 'Buy', value: 360 },
]
const HFUNNEL_STEPS = HFUNNEL.map(d => ({ name: d.id, value: d.value }))

/* ==================== SIGNATURE: STREAMGRAPH ===================== *
 * Reference style (image 2): ECharts themeRiver — symmetric stacked
 * stream around a centre baseline. ECharts is already in the project.
 * ---------------------------------------------------------------- */
const MONTHS = ['Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
const STREAM_SERIES = ['Organic', 'Paid', 'Referral', 'Social']
const STREAM_WAVE = [14, 26, 48, 80, 96, 78, 50, 30]
// themeRiver needs a value/time axis (a category axis collapses the layout),
// so x is the numeric month index and the axis label maps it back to a name.
const STREAM_DATA = STREAM_SERIES.flatMap((s, si) =>
  MONTHS.map((m, mi) => [mi, Math.round(STREAM_WAVE[mi] * (0.55 + si * 0.28)), s]))
const STREAM_COLORS = ['#D8D2F7', '#B3A6F0', '#8472E8', '#5B47C9'] // light → deep purple
const eTip = {
  backgroundColor: 'rgba(9,18,34,.96)', borderColor: 'rgba(43,143,234,.35)', borderWidth: 1,
  textStyle: { color: '#fff', fontFamily: FONT, fontSize: 12 },
  extraCssText: 'border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,.6)',
}
const streamOpt = {
  backgroundColor: 'transparent',
  color: STREAM_COLORS,
  tooltip: { trigger: 'axis', axisPointer: { type: 'line', lineStyle: { color: 'rgba(197,208,224,.18)' } }, ...eTip },
  singleAxis: {
    type: 'value', min: 0, max: MONTHS.length - 1, interval: 1,
    top: 14, bottom: 28, left: 12, right: 12,
    axisLine: { show: false }, axisTick: { show: false }, splitLine: { show: false },
    axisLabel: { color: C.grey, fontFamily: FONT, fontSize: 11, formatter: v => MONTHS[v] ?? '' },
  },
  series: [{
    type: 'themeRiver', emphasis: { focus: 'series', itemStyle: { shadowBlur: 14, shadowColor: 'rgba(91,71,201,.45)' } },
    label: { show: false }, itemStyle: { borderColor: 'transparent' }, data: STREAM_DATA,
  }],
}
// floating white value pills (overlay) at a few months — the "Sales Report" look
const STREAM_TOTALS = MONTHS.map((m, mi) => STREAM_SERIES.reduce((sum, s, si) => sum + Math.round(STREAM_WAVE[mi] * (0.55 + si * 0.28)), 0))
function StreamGraph() {
  const [ref, w] = useWidth()
  const pad = 12
  const px = mi => pad + (mi / (MONTHS.length - 1)) * (w - pad * 2)
  const pillMonths = [2, 4, 6]
  return (
    <div ref={ref} style={{ position: 'relative' }}>
      <EChart option={streamOpt} height={300} />
      {pillMonths.map(mi => (
        <div key={mi} style={{
          position: 'absolute', left: px(mi), top: '47%', transform: 'translate(-50%,-50%)',
          background: '#fff', color: '#1C2333', fontFamily: FONT, fontWeight: 700, fontSize: 12,
          padding: '3px 11px', borderRadius: 999, boxShadow: '0 4px 14px rgba(0,0,0,.4)',
          fontFeatureSettings: '"tnum" 1', pointerEvents: 'none', whiteSpace: 'nowrap',
        }}>{STREAM_TOTALS[mi].toLocaleString()}</div>
      ))}
    </div>
  )
}

/* ============================ HEATMAP ============================ */
const HEAT_X = ['W0', 'W1', 'W2', 'W3', 'W4', 'W5']
const HEAT_Y = ['Jan', 'Feb', 'Mar', 'Apr']
const HEAT_MATRIX = [
  [100, 68, 52, 41, 33, 28],
  [100, 72, 58, 46, 38, 31],
  [100, 65, 49, 37, 30, 24],
  [100, 70, 55, 44, 36, 30],
]
const heatColor = d3.scaleLinear().domain([0, 50, 100]).range(['#15203b', '#2563a8', '#57a8f0'])

function VisxHeat() {
  const [ref, w] = useWidth()
  const m = { top: 6, right: 8, bottom: 20, left: 34 }
  const nx = HEAT_X.length, ny = HEAT_Y.length
  const iw = Math.max(10, w - m.left - m.right), ih = H - m.top - m.bottom
  const binW = iw / nx, binH = ih / ny
  const bins = HEAT_X.map((_, xi) => ({ bin: xi, bins: HEAT_Y.map((_, yi) => ({ bin: yi, count: HEAT_MATRIX[yi][xi] })) }))
  const xScale = scaleLinear({ domain: [0, nx], range: [0, iw] })
  const yScale = scaleLinear({ domain: [0, ny], range: [0, ih] })
  const colorScale = scaleLinear({ domain: [0, 100], range: ['#15203b', '#57a8f0'] })
  return (
    <div ref={ref} style={{ width: '100%' }}>
      <svg width={w} height={H}>
        <Group left={m.left} top={m.top}>
          <HeatmapRect data={bins} xScale={xScale} yScale={yScale} colorScale={colorScale} binWidth={binW} binHeight={binH} gap={3}>
            {heatmap => heatmap.map(cols => cols.map(bin => (
              <g key={`${bin.row}-${bin.column}`}>
                <rect x={bin.x} y={bin.y} width={bin.width} height={bin.height} rx={4} fill={bin.color} />
                <text x={bin.x + bin.width / 2} y={bin.y + bin.height / 2 + 3} textAnchor="middle" fontFamily={FONT} fontSize={9} fill="#dCe7f7">{HEAT_MATRIX[bin.row][bin.column]}</text>
              </g>
            )))}
          </HeatmapRect>
          {HEAT_Y.map((l, i) => <text key={l} x={-6} y={i * binH + binH / 2 + 3} textAnchor="end" fontFamily={FONT} fontSize={10} fill={AXIS}>{l}</text>)}
          {HEAT_X.map((l, i) => <text key={l} x={i * binW + binW / 2} y={ih + 14} textAnchor="middle" fontFamily={FONT} fontSize={10} fill={AXIS}>{l}</text>)}
        </Group>
      </svg>
    </div>
  )
}
function D3Heat() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const m = { top: 6, right: 8, bottom: 20, left: 34 }
    const iw = w - m.left - m.right, ih = H - m.top - m.bottom
    const svg = d3.select(svgRef.current); svg.selectAll('*').remove()
    const g = svg.append('g').attr('transform', `translate(${m.left},${m.top})`)
    const x = d3.scaleBand().domain(HEAT_X).range([0, iw]).padding(0.06)
    const y = d3.scaleBand().domain(HEAT_Y).range([0, ih]).padding(0.06)
    HEAT_Y.forEach((ry, yi) => HEAT_X.forEach((rx, xi) => {
      const v = HEAT_MATRIX[yi][xi]
      g.append('rect').attr('x', x(rx)).attr('y', y(ry)).attr('width', x.bandwidth()).attr('height', y.bandwidth())
        .attr('rx', 4).attr('fill', heatColor(v))
      g.append('text').attr('x', x(rx) + x.bandwidth() / 2).attr('y', y(ry) + y.bandwidth() / 2 + 3)
        .attr('text-anchor', 'middle').attr('font-family', FONT).attr('font-size', 9).attr('fill', '#dce7f7').text(v)
    }))
    g.append('g').call(d3.axisLeft(y).tickSize(0)).call(s => { s.selectAll('text').attr('fill', AXIS).attr('font-family', FONT).attr('font-size', 10); s.select('.domain').remove() })
    g.append('g').attr('transform', `translate(0,${ih})`).call(d3.axisBottom(x).tickSize(0)).call(s => { s.selectAll('text').attr('fill', AXIS).attr('font-family', FONT).attr('font-size', 10); s.select('.domain').remove() })
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}

/* ============================= GAUGE ============================= */
const GAUGE_V = 72, GAUGE_GOAL = 80
function RechartsGauge() {
  const data = [{ name: 'v', value: GAUGE_V, fill: GAUGE_V >= GAUGE_GOAL ? C.green : C.blue }]
  return (
    <div style={{ position: 'relative', height: H }}>
      <ResponsiveContainer width="100%" height={H}>
        <RadialBarChart innerRadius="68%" outerRadius="100%" data={data} startAngle={220} endAngle={-40} barSize={16}>
          <PolarAngleAxis type="number" domain={[0, 100]} angleAxisId={0} tick={false} />
          <RadialBar background={{ fill: 'rgba(255,255,255,.07)' }} dataKey="value" cornerRadius={9} angleAxisId={0} />
        </RadialBarChart>
      </ResponsiveContainer>
      <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', pointerEvents: 'none' }}>
        <div style={{ fontFamily: FONT, fontWeight: 800, fontSize: 30, color: '#fff' }}>{GAUGE_V}%</div>
      </div>
    </div>
  )
}
function D3Gauge() {
  const [ref, w] = useWidth()
  const svgRef = useRef(null)
  useEffect(() => {
    if (!w) return
    const svg = d3.select(svgRef.current); svg.selectAll('*').remove()
    const cx = w / 2, cy = H * 0.6, r = Math.min(w / 2, H * 0.62) - 8
    const a0 = -2.0944, a1 = 2.0944 // 240° opening at bottom
    const f = GAUGE_V / 100, col = GAUGE_V >= GAUGE_GOAL ? C.green : C.blue
    const arc = d3.arc().innerRadius(r - 15).outerRadius(r).cornerRadius(8)
    const g = svg.append('g').attr('transform', `translate(${cx},${cy})`)
    const defs = svg.append('defs')
    const grad = defs.append('linearGradient').attr('id', 'd3-gauge').attr('x1', 0).attr('y1', 0).attr('x2', 1).attr('y2', 0)
    grad.append('stop').attr('offset', '0%').attr('stop-color', C.blue)
    grad.append('stop').attr('offset', '100%').attr('stop-color', col)
    g.append('path').attr('d', arc({ startAngle: a0, endAngle: a1 })).attr('fill', 'rgba(255,255,255,.07)')
    g.append('path').attr('d', arc({ startAngle: a0, endAngle: a0 + f * (a1 - a0) })).attr('fill', 'url(#d3-gauge)')
    const ga = a0 + (GAUGE_GOAL / 100) * (a1 - a0)
    g.append('line').attr('x1', Math.sin(ga) * (r - 17)).attr('y1', -Math.cos(ga) * (r - 17))
      .attr('x2', Math.sin(ga) * (r + 3)).attr('y2', -Math.cos(ga) * (r + 3)).attr('stroke', C.grey).attr('stroke-width', 2)
    g.append('text').attr('text-anchor', 'middle').attr('y', 6).attr('font-family', FONT).attr('font-weight', 800).attr('font-size', 30).attr('fill', '#fff').text(GAUGE_V + '%')
    g.append('text').attr('text-anchor', 'middle').attr('y', 26).attr('font-family', FONT).attr('font-size', 11).attr('fill', C.grey).text(`Goal ${GAUGE_GOAL}%`)
  }, [w])
  return <div ref={ref} style={{ width: '100%' }}><svg ref={svgRef} width={w} height={H} /></div>
}

/* =========================== KPI CARDS =========================== */
const KPI = { label: 'Revenue', value: '$52.3M', delta: '+12.5%', up: true, good: true, pct: 72, spark: [32, 38, 35, 44, 41, 49, 53, 50, 58, 62, 60, 67] }
function Spark({ data, color = C.green, w = 130, h = 36, id, full }) {
  const max = Math.max(...data), min = Math.min(...data)
  const nx = i => (i / (data.length - 1)) * w
  const ny = v => h - ((v - min) / (max - min || 1)) * (h - 5) - 3
  const line = data.map((v, i) => `${i ? 'L' : 'M'}${nx(i).toFixed(1)},${ny(v).toFixed(1)}`).join(' ')
  return (
    <svg viewBox={`0 0 ${w} ${h}`} width={full ? '100%' : w} height={h} preserveAspectRatio={full ? 'none' : 'xMidYMid meet'} style={{ display: 'block' }}>
      <defs><linearGradient id={id} x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={color} stopOpacity={0.4} /><stop offset="100%" stopColor={color} stopOpacity={0} /></linearGradient></defs>
      <path d={`${line} L${w},${h} L0,${h} Z`} fill={`url(#${id})`} />
      <path d={line} fill="none" stroke={color} strokeWidth={2} strokeLinecap="round" />
    </svg>
  )
}
function Donut({ pct, size = 58, color = C.blue }) {
  const sw = 7, r = (size - sw) / 2, c = 2 * Math.PI * r
  return (
    <svg width={size} height={size}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,.08)" strokeWidth={sw} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={color} strokeWidth={sw} strokeLinecap="round"
        strokeDasharray={`${(pct / 100) * c} ${c}`} transform={`rotate(-90 ${size / 2} ${size / 2})`} />
      <text x={size / 2} y={size / 2 + 4} textAnchor="middle" fontFamily={FONT} fontWeight={700} fontSize={13} fill="#fff">{pct}%</text>
    </svg>
  )
}
const deltaChip = good => ({ display: 'inline-flex', alignItems: 'center', gap: 2, fontSize: 11.5, fontWeight: 700, color: good ? C.green : C.red, background: good ? 'rgba(34,255,136,.12)' : 'rgba(255,107,107,.12)', border: `1px solid ${good ? 'rgba(34,255,136,.3)' : 'rgba(255,107,107,.3)'}`, padding: '2px 8px', borderRadius: 999 })
const cardBase = { background: 'var(--card)', border: '1px solid var(--line)', borderRadius: 14, padding: 16, minHeight: 120 }
const lbl = { color: 'var(--muted)', fontSize: 12, fontWeight: 600, letterSpacing: '.02em' }
const bignum = { fontFamily: FONT, fontWeight: 800, fontSize: 27, color: 'var(--white)', fontFeatureSettings: '"tnum" 1' }

function CardAccent() {
  return (
    <div style={{ ...cardBase, borderLeft: `3px solid ${C.green}` }}>
      <div style={lbl}>{KPI.label}</div>
      <div style={{ ...bignum, margin: '6px 0 8px' }}>{KPI.value}</div>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <span style={deltaChip(KPI.good)}><span className="ms" style={{ fontSize: 14 }}>{KPI.up ? 'arrow_upward' : 'arrow_downward'}</span>{KPI.delta}</span>
        <Spark data={KPI.spark} id="sp-accent" w={96} h={30} />
      </div>
    </div>
  )
}
function CardGlass() {
  return (
    <div style={{ ...cardBase, background: 'linear-gradient(135deg, rgba(43,143,234,.18), rgba(34,255,136,.08))', position: 'relative', overflow: 'hidden' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div style={lbl}>{KPI.label}</div>
        <span style={deltaChip(KPI.good)}>{KPI.delta}</span>
      </div>
      <div style={{ ...bignum, fontSize: 30, marginTop: 10 }}>{KPI.value}</div>
      <div style={{ color: 'var(--muted)', fontSize: 11, marginTop: 4 }}>vs prev period</div>
    </div>
  )
}
function CardRing() {
  return (
    <div style={{ ...cardBase, display: 'flex', alignItems: 'center', gap: 14 }}>
      <Donut pct={KPI.pct} color={C.blue} />
      <div>
        <div style={lbl}>{KPI.label}</div>
        <div style={{ ...bignum, margin: '4px 0' }}>{KPI.value}</div>
        <span style={deltaChip(KPI.good)}>{KPI.delta} to target</span>
      </div>
    </div>
  )
}
function CardSparkFill() {
  return (
    <div style={{ ...cardBase, padding: 0, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '16px 16px 0' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={lbl}>{KPI.label}</div>
          <span style={deltaChip(KPI.good)}>{KPI.delta}</span>
        </div>
        <div style={{ ...bignum, marginTop: 6 }}>{KPI.value}</div>
      </div>
      <div style={{ marginTop: 'auto' }}><Spark data={KPI.spark} id="sp-fill" w={400} h={44} color={C.green} full /></div>
    </div>
  )
}
function CardIcon() {
  return (
    <div style={{ ...cardBase, display: 'flex', gap: 13 }}>
      <span style={{ flex: '0 0 auto', width: 44, height: 44, borderRadius: 11, background: 'linear-gradient(135deg,#2B8FEA,#22FF88)', display: 'grid', placeItems: 'center' }}>
        <span className="ms" style={{ color: '#04122b', fontSize: 24 }}>payments</span>
      </span>
      <div>
        <div style={lbl}>{KPI.label}</div>
        <div style={{ ...bignum, margin: '3px 0 6px' }}>{KPI.value}</div>
        <span style={deltaChip(KPI.good)}><span className="ms" style={{ fontSize: 14 }}>trending_up</span>{KPI.delta}</span>
      </div>
    </div>
  )
}

/* ======================= DATA REFERENCE ========================= */
const DATA_REF = [
  { grp: 'Comparison charts' },
  { el: 'Line / Area', use: 'A metric trending over time', shape: '{ x:[labels], series:[{name,data,color}] }', ex: 'Sessions, revenue per day' },
  { el: 'Bar', use: 'One metric across categories', shape: '{ x:[labels], data:[numbers], color }', ex: 'Revenue by channel' },
  { el: 'Donut / Pie', use: 'Share of a whole (parts of 100%)', shape: '{ data:[{name,value,color}] }', ex: 'Device split, source mix' },
  { el: 'Heatmap', use: 'A value across two dimensions', shape: '{ xLabels, yLabels, matrix[y][x] }', ex: 'Cohort retention, hour×day' },
  { el: 'Gauge', use: 'A single KPI vs a target', shape: '{ value, max, goal, unit }', ex: 'ROAS vs target' },
  { grp: 'Funnels & flows' },
  { el: 'Horizontal Funnel', use: 'Sequential drop-off, 2–6 steps', shape: 'steps:[{name,value,p?}]', ex: 'Cart → Checkout → Purchase' },
  { el: 'ECharts Funnel', use: 'Same, vertical', shape: '{ steps:[{name,value,p}] }', ex: 'Impressions → Clicks → Conv' },
  { el: 'Conversion Journey', use: 'Journey node-map (size ∝ value, % auto)', shape: 'stages:[{label,value}]', ex: 'Visit → Blog → Subscribe → Buy' },
  { el: '3D Stage Funnel', use: '4-ish stages w/ labels, shows value + %', shape: 'stages:[{key,value,icon?,left?,right?}]', ex: 'Reach → Act → Convert → Engage' },
  { el: 'Streamgraph', use: 'Several series’ volume over time', shape: '[[xIndex,value,series], …]', ex: 'Channel volume by month' },
  { grp: 'Other builders' },
  { el: 'Stacked Bar', use: 'Composition across categories', shape: '{ x, series:[{name,data,color}] }', ex: 'Spend by channel / month' },
  { el: 'Sankey', use: 'Flow between many nodes', shape: '{ nodes:[{name}], links:[{source,target,value}] }', ex: 'Channel → landing → conv' },
  { el: 'Scatter', use: 'Correlation of two metrics', shape: '{ points:[[x,y,size?]] }', ex: 'CPC vs conversions' },
  { el: 'Ring', use: 'A single progress %', shape: '{ pct, color, label }', ex: '% of monthly target' },
  { el: 'Geo map', use: 'A metric by country/region', shape: "[['Country','Value'], …]", ex: 'Users by country' },
  { grp: 'KPI cards' },
  { el: 'KPI card', use: 'One headline number + trend', shape: '{ label, value, delta, up, good, pct, spark:[] }', ex: 'Revenue, CPL, ROAS' },
]
function DataRefTable() {
  return (
    <div style={{ overflowX: 'auto' }}>
      <table className="sc-table">
        <thead><tr><th>Element</th><th>Best for</th><th>Data / props</th><th>Example metrics</th></tr></thead>
        <tbody>
          {DATA_REF.map((r, i) => r.grp
            ? <tr className="grp" key={i}><td colSpan={4}>{r.grp}</td></tr>
            : <tr key={i}><td>{r.el}</td><td>{r.use}</td><td><code>{r.shape}</code></td><td>{r.ex}</td></tr>)}
        </tbody>
      </table>
    </div>
  )
}

/* ============================ LAYOUT ============================ */
function LibCell({ lib, badge, children }) {
  return (
    <div className="sc-cell">
      <div className="sc-cell-head">
        <span className="sc-lib">{lib}</span>
        {badge && <span className="sc-badge">{badge}</span>}
      </div>
      {children}
    </div>
  )
}

function Row({ title, sub, cells }) {
  return (
    <div className="card sc-row">
      <div className="sc-row-head">
        <h3>{title}</h3>
        <span className="sc-row-sub">{sub}</span>
      </div>
      <div className="sc-grid">
        {cells.map((c, i) => (
          <LibCell key={i} lib={c.lib} badge={c.badge}>{c.node}</LibCell>
        ))}
      </div>
    </div>
  )
}

const IN_PROJECT = 'in project'

export default function ChartShowcase() {
  return (
    <div className="wrap">
      <div className="ph">
        <div>
          <div className="eyebrow"><span className="dot" /> CHART LIBRARY SHOWCASE</div>
          <h1>Same Element, Six Libraries</h1>
          <div className="psub">
            Identical data rendered by each library so you can compare look, polish, and effort.
            <b style={{ color: 'var(--green)' }}> ECharts</b>, <b style={{ color: 'var(--green)' }}>Nivo</b> and
            <b style={{ color: 'var(--green)' }}> Google Charts</b> are already in GYA Pulse;
            Recharts, visx and raw D3 were added for this comparison.
          </div>
        </div>
      </div>

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>Data Reference</h3>
          <span className="sc-badge">what feeds what</span>
          <span className="sc-row-sub">the metrics &amp; data shape each element below accepts</span>
        </div>
        <DataRefTable />
      </div>

      <Row
        title="Line / Area Trend"
        sub="Daily sessions · curved area with gradient fill"
        cells={[
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={lineOpt({ x: DAYS, series: [{ name: 'Sessions', data: SESSIONS, color: C.blue }] })} height={H} /> },
          { lib: 'Google Charts', badge: IN_PROJECT, node: <GLine /> },
          { lib: 'Recharts', node: <RechartsLine /> },
          { lib: 'visx', node: <VisxLine /> },
          { lib: 'raw D3', node: <D3Line /> },
        ]}
      />

      <Row
        title="Bar Chart"
        sub="Revenue by channel · rounded bars, blue→green gradient"
        cells={[
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={barOpt({ x: CHANNELS, data: CHAN_VALUES, color: C.green })} height={H} /> },
          { lib: 'Google Charts', badge: IN_PROJECT, node: <GBar /> },
          { lib: 'Recharts', node: <RechartsBar /> },
          { lib: 'visx', node: <VisxBar /> },
          { lib: 'raw D3', node: <D3Bar /> },
        ]}
      />

      <Row
        title="Donut / Pie"
        sub="Device split · 62% inner radius"
        cells={[
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={donutOpt({ data: DONUT_DATA })} height={H} /> },
          { lib: 'Google Charts', badge: IN_PROJECT, node: <GDonut /> },
          { lib: 'Recharts', node: <RechartsDonut /> },
          { lib: 'visx', node: <VisxDonut /> },
          { lib: 'raw D3', node: <D3Donut /> },
        ]}
      />

      <Row
        title="Heatmap"
        sub="Cohort retention · ECharts is strong here; visx/D3 give full control (Recharts has no native heatmap)"
        cells={[
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={heatOpt({ xLabels: HEAT_X, yLabels: HEAT_Y, matrix: HEAT_MATRIX })} height={H} /> },
          { lib: 'visx', node: <VisxHeat /> },
          { lib: 'raw D3', node: <D3Heat /> },
        ]}
      />

      <Row
        title="Gauge"
        sub="Goal progress · ECharts gauge vs Recharts radial-bar vs hand-built D3 arc"
        cells={[
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={gaugeOpt({ value: GAUGE_V, max: 100, goal: GAUGE_GOAL, unit: '%' })} height={H} /> },
          { lib: 'Recharts', node: <RechartsGauge /> },
          { lib: 'raw D3', node: <D3Gauge /> },
        ]}
      />

      <Row
        title="Funnel"
        sub="Conversion funnel · 5 steps. Recharts & visx have no native funnel — D3 is hand-built."
        cells={[
          { lib: 'Nivo', badge: IN_PROJECT, node: <NivoFunnel /> },
          { lib: 'ECharts', badge: IN_PROJECT, node: <EChart option={funnelOpt({ steps: FUNNEL_STEPS, big: true })} height={H} /> },
          { lib: 'raw D3', node: <D3Funnel /> },
        ]}
      />

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>KPI Cards</h3>
          <span className="sc-badge">custom UI</span>
          <span className="sc-row-sub">same metric, five card treatments — pick the look for the dashboard</span>
        </div>
        <div className="sc-grid">
          <LibCell lib="Accent + spark"><CardAccent /></LibCell>
          <LibCell lib="Gradient glass"><CardGlass /></LibCell>
          <LibCell lib="Progress ring"><CardRing /></LibCell>
          <LibCell lib="Sparkline fill"><CardSparkFill /></LibCell>
          <LibCell lib="Icon tile"><CardIcon /></LibCell>
        </div>
      </div>

      <div className="ph" style={{ marginTop: 26 }}>
        <div>
          <div className="eyebrow"><span className="dot" /> SIGNATURE FLOWS · YOUR REFERENCE STYLES</div>
          <h1>Funnel & Streamgraph</h1>
          <div className="psub">Recreating the looks you shared — both data-driven, both with libraries already in GYA Pulse.</div>
        </div>
      </div>

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>Smooth Horizontal Funnel</h3>
          <span className="sc-badge">Nivo</span>
          <span className="sc-row-sub">horizontal + smooth interpolation · warm gradient · custom labels & separators · also live on the Meta page</span>
        </div>
        <HFunnel steps={HFUNNEL_STEPS} height={300} />
      </div>

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>Streamgraph</h3>
          <span className="sc-badge">ECharts</span>
          <span className="sc-row-sub">themeRiver — symmetric stacked stream · the “Sales Report” look · with floating value pills</span>
        </div>
        <StreamGraph />
      </div>

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>Conversion Journey</h3>
          <span className="sc-badge">custom · SVG + d3</span>
          <span className="sc-row-sub">data-driven · donut-ring nodes joined by proportional flow ribbons · sizes & % derived from the stage values</span>
        </div>
        <JourneyFlow stages={[
          { label: 'Site Visit', value: 186811 },
          { label: 'Blog View', value: 47266 },
          { label: 'Subscribe', value: 25061 },
          { label: 'Purchase Product', value: 509 },
        ]} />
      </div>

      <div className="card sc-row">
        <div className="sc-row-head">
          <h3>3D Stage Funnel</h3>
          <span className="sc-badge">custom · SVG</span>
          <span className="sc-row-sub">data-driven · segmented 3D funnel with perspective caps, glow, per-stage value + % and icons</span>
        </div>
        <Funnel3D stages={[
          { key: 'Reach', value: 120000, icon: 'campaign', left: 'Attract the right audience through targeted campaigns and digital channels.', right: 'Increase brand visibility through data-driven campaigns and audience segmentation.' },
          { key: 'Act', value: 38400, icon: 'play_arrow', left: 'Drive meaningful interactions and capture qualified leads.', right: 'Track user behavior and encourage interactions across key touchpoints.' },
          { key: 'Convert', value: 9600, icon: 'shopping_cart', left: 'Turn prospects into paying customers and reduce buying friction.', right: 'Optimize the customer journey using insights to improve conversion rates.' },
          { key: 'Engage', value: 2840, icon: 'star', left: 'Strengthen relationships and deliver ongoing personalized value.', right: 'Leverage analytics and personalization to strengthen loyalty and lifetime value.' },
        ]} />
      </div>

      <div className="foot-note">
        Showcase route · {`{`}Line, Bar, Donut, Funnel{`}`} × six libraries + signature flows · identical sample data ·
        existing components reused from <code>lib/charts.js</code>, <code>EChart.jsx</code>, <code>nivoTheme.js</code>
      </div>
    </div>
  )
}
