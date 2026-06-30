import * as echarts from 'echarts'

export const C = {
  blue:'#2B8FEA', blue2:'#5AAFF2', green:'#22FF88', grey:'#8A9BBB',
  dim:'#5b6b8a', text:'#C5D0E0', red:'#FF6B6B', card:'#0E1C35', line:'rgba(255,255,255,.05)'
}
const FONT = 'Montserrat, "Noto Sans", system-ui, sans-serif'
const FUNNEL_COLORS = ['#2B8FEA','#2AAAD6','#28C3AE','#25E29C','#22FF88']
const grad = (c1, c2, vertical) =>
  new echarts.graphic.LinearGradient(0, 0, vertical ? 0 : 1, vertical ? 1 : 0,
    [{ offset: 0, color: c1 }, { offset: 1, color: c2 }])

const fmt = v => {
  if (typeof v !== 'number') return v
  if (Number.isInteger(v)) return v.toLocaleString()
  return v.toLocaleString(undefined, { maximumFractionDigits: 2 })
}

// shared tooltip look — rounded card, soft shadow, GYA surface
const tip = {
  backgroundColor:'#0E1C35', borderColor:'#22335c', borderWidth:1, padding:[10,13],
  textStyle:{ color:'#fff', fontFamily:FONT, fontSize:12 },
  extraCssText:'border-radius:12px;box-shadow:0 16px 38px -14px rgba(0,0,0,.7);backdrop-filter:blur(2px)',
}
const axisPointer = { type:'line', lineStyle:{ color:'rgba(43,143,234,.45)', width:1, type:[4,3] }, z:0 }

// multi-series rows with colored dots + value (Databloo style)
function rows(params, { total } = {}) {
  const head = `<div style="font-weight:700;color:#fff;margin-bottom:7px;font-size:12px">${params[0].axisValueLabel}</div>`
  let sum = 0
  const body = params.map(p => {
    sum += (typeof p.value === 'number' ? p.value : 0)
    return `<div style="display:flex;align-items:center;gap:9px;margin:4px 0;min-width:158px">
      <span style="width:9px;height:9px;border-radius:50%;background:${p.color};box-shadow:0 0 6px ${p.color}66"></span>
      <span style="color:#C5D0E0">${p.seriesName}</span>
      <b style="margin-left:auto;color:#fff">${fmt(p.value)}</b></div>`
  }).join('')
  const tot = total && params.length > 1
    ? `<div style="display:flex;gap:9px;margin-top:7px;padding-top:7px;border-top:1px solid #22335c"><span style="color:#8A9BBB">Total</span><b style="margin-left:auto;color:#22FF88">${fmt(sum)}</b></div>`
    : ''
  return head + body + tot
}

const axisBase = {
  axisLine:{ lineStyle:{ color:'#22335c' } }, axisTick:{ show:false },
  axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:10 },
  splitLine:{ lineStyle:{ color:C.line } },
}

export function lineOpt({ x, series, total }) {
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:12, top:16, bottom:6, containLabel:true },
    tooltip:{ trigger:'axis', axisPointer, ...tip, formatter:p => rows(p, { total }) },
    legend:{ show:false },
    xAxis:{ type:'category', boundaryGap:false, data:x, ...axisBase, splitLine:{ show:false } },
    yAxis:{ type:'value', ...axisBase, axisLine:{ show:false } },
    series: series.map((s, i) => ({
      name:s.name, type:'line', smooth:true, symbol:'circle', showSymbol:false, symbolSize:9,
      data:s.data,
      lineStyle:{ color:s.color, width: s.dashed ? 2 : 3, type: s.dashed ? 'dashed' : 'solid', opacity: s.dashed ? .55 : 1 },
      itemStyle:{ color:s.color, borderColor:'#0B1628', borderWidth:2 },
      animationDelay: i * 180,           // stagger multiple lines (CGM "animationBegin" trick)
      emphasis:{ focus:'series', scale:1.6 },
      // growing active dot on hover (like Recharts activeDot)
      emphasisDisabled:false,
      areaStyle: s.dashed ? undefined : (s.area ? { color: grad(s.color+'44', s.color+'00', true) } : undefined),
    })),
  }
}

export function barOpt({ x, data, color, horizontal }) {
  const cat = { type:'category', data:x, ...axisBase, splitLine:{ show:false } }
  const val = { type:'value', ...axisBase, axisLine:{ show:false } }
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:14, top:10, bottom:6, containLabel:true },
    tooltip:{ trigger:'axis', axisPointer:{ type:'shadow', shadowStyle:{ color:'rgba(43,143,234,.10)' } }, ...tip, formatter: rows },
    xAxis: horizontal ? val : cat,
    yAxis: horizontal ? { ...cat, inverse:true } : val,
    series:[{ type:'bar', name:'Value', data, barWidth:'56%',
      itemStyle:{ borderRadius: horizontal ? [0,4,4,0] : [4,4,0,0], color: grad(color||C.green, C.blue, !horizontal) },
      animationDelay:(idx)=>idx*55,
      emphasis:{ itemStyle:{ shadowBlur:14, shadowColor:'rgba(34,255,136,.4)' } } }],
  }
}

export function donutOpt({ data }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ trigger:'item', ...tip,
      formatter:o => `<div style="font-weight:700;color:#fff;text-transform:uppercase;letter-spacing:.04em;margin-bottom:3px">${o.name}</div><div style="color:#C5D0E0"><b style="color:#fff;font-size:14px">${fmt(o.value)}%</b> <span style="color:#8A9BBB">of total</span></div>` },
    series:[{ type:'pie', radius:['60%','86%'], center:['50%','50%'], avoidLabelOverlap:false,
      label:{ show:false }, labelLine:{ show:false },
      emphasis:{ scale:true, scaleSize:6, itemStyle:{ shadowBlur:16, shadowColor:'rgba(43,143,234,.5)' } },
      data: data.map(d => ({ value:d.value, name:d.name, itemStyle:{ color:d.color } })) }],
  }
}

export function funnelOpt({ steps, big }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ trigger:'item', ...tip,
      formatter:o => `<div style="font-weight:700;color:#fff;margin-bottom:3px">${o.name}</div><div style="color:#C5D0E0"><b style="color:#fff">${fmt(o.value)}</b> users · <b style="color:#22FF88">${o.data.p}</b></div>` },
    series:[{ type:'funnel', left:'4%', right:'4%', top:8, bottom:8, minSize:'22%', maxSize:'100%',
      sort:'descending', gap:5, funnelAlign:'center',
      label:{ show:true, position:'inside', color:'#04122b', fontFamily:FONT, fontWeight:700,
        fontSize: big?13:11, textBorderWidth:0, textBorderColor:'transparent', textShadowBlur:0,
        formatter:o => big?`${o.name}  ${o.data.p}`:`${o.data.p}` },
      labelLine:{ show:false }, itemStyle:{ borderWidth:0 },
      emphasis:{ label:{ textBorderWidth:0 }, itemStyle:{ shadowBlur:18, shadowColor:'rgba(34,255,136,.45)' } },
      data: steps.map((d,i)=>({ value:d.value, name:d.name, p:d.p,
        itemStyle:{ color: grad(FUNNEL_COLORS[i%5], FUNNEL_COLORS[Math.min(i+1,4)]) } })) }],
  }
}

export function sankeyOpt({ nodes, links }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ trigger:'item', ...tip,
      formatter:o => o.dataType === 'edge'
        ? `<span style="color:#C5D0E0">${o.data.source} → ${o.data.target}</span><br><b style="color:#fff">${fmt(o.data.value)}</b> users`
        : `<b style="color:#fff">${o.name}</b>` },
    series:[{ type:'sankey', left:10, right:120, top:10, bottom:10, nodeWidth:14, nodeGap:16,
      label:{ color:C.text, fontFamily:FONT, fontSize:12 },
      lineStyle:{ color:'gradient', opacity:.38, curveness:.5 }, emphasis:{ focus:'adjacency' },
      data: nodes, links }],
  }
}

export function heatOpt({ xLabels, yLabels, matrix }) {
  const data = []
  matrix.forEach((row, y) => row.forEach((v, x) => { if (v != null) data.push([x, y, v]) }))
  return {
    backgroundColor:'transparent',
    tooltip:{ ...tip, position:'top',
      formatter:p => `<div style="font-weight:700;color:#fff;margin-bottom:2px">${yLabels[p.value[1]]} · ${xLabels[p.value[0]]}</div><div style="color:#C5D0E0"><b style="color:#fff;font-size:14px">${p.value[2]}%</b> retained</div>` },
    grid:{ left:104, right:14, top:8, bottom:24 },
    xAxis:{ type:'category', data:xLabels, position:'top', axisLine:{ show:false }, axisTick:{ show:false }, splitLine:{ show:false }, axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:11 } },
    yAxis:{ type:'category', data:yLabels, inverse:true, axisLine:{ show:false }, axisTick:{ show:false }, splitLine:{ show:false }, axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:11 } },
    visualMap:{ show:false, min:0, max:100, inRange:{ color:['#1d4172','#2563a8','#2B8FEA','#57a8f0'] } },
    series:[{ type:'heatmap', data, label:{ show:true, color:'#eaf3ff', fontFamily:FONT, fontSize:10, formatter:p=>p.value[2]+'%' },
      itemStyle:{ borderColor:'#0B1628', borderWidth:4, borderRadius:7 },
      emphasis:{ itemStyle:{ borderColor:'#22FF88', borderWidth:2, shadowBlur:12, shadowColor:'rgba(34,255,136,.5)' } } }],
  }
}

export function scatterOpt({ points }) {
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:14, top:14, bottom:6, containLabel:true },
    tooltip:{ trigger:'item', ...tip },
    xAxis:{ type:'value', ...axisBase }, yAxis:{ type:'value', ...axisBase },
    series:[{ type:'scatter', symbolSize:d=>Math.max(8, d[2]/30), data:points,
      itemStyle:{ color:'rgba(34,255,136,.6)', borderColor:C.green },
      emphasis:{ scale:1.4, itemStyle:{ shadowBlur:14, shadowColor:'rgba(34,255,136,.6)' } } }],
  }
}

export function stackBarOpt({ x, series, stack = true, total }) {
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:14, top:18, bottom:6, containLabel:true },
    tooltip:{ trigger:'axis', axisPointer:{ type:'shadow', shadowStyle:{ color:'rgba(43,143,234,.10)' } }, ...tip, formatter:p => rows(p, { total }) },
    legend:{ show:true, top:0, textStyle:{ color:C.text, fontFamily:FONT, fontSize:11 }, itemWidth:10, itemHeight:10, icon:'roundRect' },
    xAxis:{ type:'category', data:x, ...axisBase, splitLine:{ show:false } },
    yAxis:{ type:'value', ...axisBase, axisLine:{ show:false } },
    series: series.map((s, i) => ({
      name:s.name, type:'bar', stack: stack ? 'total' : undefined,
      barWidth: stack ? '52%' : undefined, barGap: stack ? undefined : '12%',
      data:s.data, itemStyle:{ color:s.color, borderRadius: stack ? 0 : [3,3,0,0] },
      animationDelay:(idx)=>idx*40 + i*60,
      emphasis:{ itemStyle:{ shadowBlur:12, shadowColor:'rgba(34,255,136,.35)' } },
    })),
  }
}

export function gaugeOpt({ value, max = value * 1.5, goal, unit = '' }) {
  const onTarget = goal == null || value >= goal
  const col = onTarget ? C.green : C.red
  return {
    backgroundColor:'transparent',
    series:[{
      type:'gauge', startAngle:210, endAngle:-30, min:0, max,
      radius:'92%', center:['50%','58%'],
      progress:{ show:true, width:14, roundCap:true, itemStyle:{ color: grad(C.blue, col) } },
      axisLine:{ lineStyle:{ width:14, color:[[1,'rgba(255,255,255,.07)']] } },
      pointer:{ show:false },
      axisTick:{ show:false }, splitLine:{ show:false },
      axisLabel:{ show:false },
      anchor:{ show:false },
      title:{ show:false },
      detail:{ valueAnimation:true, offsetCenter:[0,0], fontFamily:FONT, fontWeight:800,
        fontSize:30, color:'#fff', formatter:v => `${fmt(v)}${unit}` },
      data:[{ value }],
      markLine: goal == null ? undefined : {},
    },
    // goal marker drawn as a second thin gauge tick band
    goal == null ? null : {
      type:'gauge', startAngle:210, endAngle:-30, min:0, max, radius:'92%', center:['50%','58%'],
      axisLine:{ show:false }, pointer:{ show:false }, axisTick:{ show:false }, splitLine:{ show:false },
      axisLabel:{ show:false }, detail:{ show:false },
      data:[{ value:goal }],
      anchor:{ show:false },
    }].filter(Boolean),
    graphic: goal == null ? [] : [{ type:'text', left:'center', top:'82%',
      style:{ text:`Goal ${fmt(goal)}${unit}`, fill:C.grey, font:`11px ${FONT}` } }],
  }
}
