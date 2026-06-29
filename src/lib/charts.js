import * as echarts from 'echarts'

export const C = {
  blue:'#2B8FEA', blue2:'#5AAFF2', green:'#22FF88', grey:'#8A9BBB',
  dim:'#5b6b8a', text:'#C5D0E0', red:'#FF6B6B', card:'#0E1C35', line:'rgba(255,255,255,.05)'
}
const FONT = 'Commissioner, system-ui, sans-serif'
const FUNNEL_COLORS = ['#2B8FEA','#2AAAD6','#28C3AE','#25E29C','#22FF88']
const grad = (c1, c2, vertical) =>
  new echarts.graphic.LinearGradient(0, 0, vertical ? 0 : 1, vertical ? 1 : 0,
    [{ offset: 0, color: c1 }, { offset: 1, color: c2 }])

const tip = { backgroundColor:'#0E1C35', borderColor:'#22335c', textStyle:{ color:'#fff', fontFamily:FONT } }
const axisBase = {
  axisLine:{ lineStyle:{ color:'#22335c' } }, axisTick:{ show:false },
  axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:10 },
  splitLine:{ lineStyle:{ color:C.line } },
}

export function lineOpt({ x, series }) {
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:12, top:16, bottom:6, containLabel:true },
    tooltip:{ trigger:'axis', ...tip },
    legend:{ show:false },
    xAxis:{ type:'category', boundaryGap:false, data:x, ...axisBase, splitLine:{ show:false } },
    yAxis:{ type:'value', ...axisBase, axisLine:{ show:false } },
    series: series.map(s => ({
      name:s.name, type:'line', smooth:true, symbol:'none',
      data:s.data, lineStyle:{ color:s.color, width:3 }, itemStyle:{ color:s.color },
      areaStyle: s.area ? { color: grad(s.color+'44', s.color+'00', true) } : undefined,
    })),
  }
}

export function barOpt({ x, data, color, horizontal }) {
  const cat = { type:'category', data:x, ...axisBase, splitLine:{ show:false }, axisLabel:{ ...axisBase.axisLabel, fontSize:10 } }
  const val = { type:'value', ...axisBase, axisLine:{ show:false } }
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:14, top:10, bottom:6, containLabel:true },
    tooltip:{ trigger:'axis', ...tip },
    xAxis: horizontal ? val : cat,
    yAxis: horizontal ? { ...cat, inverse:true } : val,
    series:[{ type:'bar', data, barWidth:'56%',
      itemStyle:{ borderRadius: horizontal ? [0,4,4,0] : [4,4,0,0], color: grad(color||C.green, C.blue, !horizontal) } }],
  }
}

export function donutOpt({ data }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ ...tip, trigger:'item' },
    series:[{ type:'pie', radius:['60%','86%'], center:['50%','50%'], avoidLabelOverlap:false,
      label:{ show:false }, labelLine:{ show:false },
      data: data.map(d => ({ value:d.value, name:d.name, itemStyle:{ color:d.color } })) }],
  }
}

export function funnelOpt({ steps, big }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ ...tip, trigger:'item', formatter:o=>`${o.name}<br><b>${Number(o.value).toLocaleString()}</b>` },
    series:[{ type:'funnel', left:'4%', right:'4%', top:8, bottom:8, minSize:'22%', maxSize:'100%',
      sort:'descending', gap:5, funnelAlign:'center',
      label:{ show:true, position:'inside', color:'#04122b', fontFamily:FONT, fontWeight:700,
        fontSize: big?13:11, textBorderWidth:0, textBorderColor:'transparent', textShadowBlur:0,
        formatter:o=> big?`${o.name}  ${o.data.p}`:`${o.data.p}` },
      labelLine:{ show:false }, itemStyle:{ borderWidth:0 },
      emphasis:{ label:{ textBorderWidth:0 } },
      data: steps.map((d,i)=>({ value:d.value, name:d.name, p:d.p,
        itemStyle:{ color: grad(FUNNEL_COLORS[i%5], FUNNEL_COLORS[Math.min(i+1,4)]) } })) }],
  }
}

export function sankeyOpt({ nodes, links }) {
  return {
    backgroundColor:'transparent',
    tooltip:{ ...tip, trigger:'item' },
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
      formatter:p=>`${yLabels[p.value[1]]} · ${xLabels[p.value[0]]}<br><b>${p.value[2]}%</b>` },
    grid:{ left:104, right:14, top:8, bottom:24 },
    xAxis:{ type:'category', data:xLabels, position:'top', axisLine:{ show:false }, axisTick:{ show:false }, splitLine:{ show:false }, axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:11 } },
    yAxis:{ type:'category', data:yLabels, inverse:true, axisLine:{ show:false }, axisTick:{ show:false }, splitLine:{ show:false }, axisLabel:{ color:C.dim, fontFamily:FONT, fontSize:11 } },
    visualMap:{ show:false, min:0, max:100, inRange:{ color:['#0E1C35','#143a63','#1f5fa6','#2B8FEA','#5AAFF2'] } },
    series:[{ type:'heatmap', data, label:{ show:true, color:'#eaf3ff', fontFamily:FONT, fontSize:10, formatter:p=>p.value[2]+'%' },
      itemStyle:{ borderColor:'#0B1628', borderWidth:4, borderRadius:7 },
      emphasis:{ itemStyle:{ borderColor:'#22FF88', borderWidth:2 } } }],
  }
}

export function scatterOpt({ points }) {
  return {
    backgroundColor:'transparent',
    grid:{ left:6, right:14, top:14, bottom:6, containLabel:true },
    tooltip:{ ...tip, trigger:'item' },
    xAxis:{ type:'value', ...axisBase }, yAxis:{ type:'value', ...axisBase },
    series:[{ type:'scatter', symbolSize:d=>Math.max(8, d[2]/30), data:points,
      itemStyle:{ color:'rgba(34,255,136,.6)', borderColor:C.green } }],
  }
}
