import { Chart } from 'react-google-charts'

// Literal Google GeoChart, themed to GYA. data: [['Country','Value'], ...]
export default function GeoMap({ data, height = 206 }) {
  return (
    <Chart
      chartType="GeoChart"
      width="100%"
      height={height}
      data={data}
      options={{
        backgroundColor: 'transparent',
        datalessRegionColor: '#11233f',
        defaultColor: '#11233f',
        colorAxis: { colors: ['#16345c', '#2B8FEA', '#22FF88'] },
        legend: 'none',
        keepAspectRatio: false,
        tooltip: { textStyle: { color: '#04122b', fontName: 'Commissioner' } },
      }}
    />
  )
}
