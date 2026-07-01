// Brief-faithful mock content. Keys: 'overview' (client-type-aware) or `${source}/${tab}`.
// Each platform Overview shows ONLY the brief's case-study KPIs + its ONE signature viz.
// Layout rule: tall widgets (gauge / funnel) never sit beside short auto-fit KPI cards.

const WK = ['Aug 1','Aug 5','Aug 9','Aug 13','Aug 17','Aug 21','Aug 25','Aug 28']
const SP = { up:[4,5,5,6,6,7,7,8], dn:[8,7.5,7,6.5,6,5.6,5.3,5], spend:[48,52,50,58,55,61,63,66] }
const BLUE='#2B8FEA', GREEN='#22FF88', GREY='#8A9BBB'
const DEV=[{name:'Desktop',value:62,color:GREEN},{name:'Mobile',value:31,color:BLUE},{name:'Tablet',value:7,color:GREY}]
const AGE=['18-24','25-34','35-44','45-54','55-64','65+']
const GEO=[['Country','Value'],['United States',1210000],['Canada',418000],['United Kingdom',303000],['Germany',192000],['Australia',139000],['France',96000],['Spain',74000],['Brazil',61000],['Japan',58000],['India',44000],['Netherlands',39000]]
const CHAN=['Paid Search','Paid Social','Email','Direct','Organic','Referral','Other']
const LCHAN=['Paid Search','Paid Social','Organic','Email','Referral','Direct']

const k=(l,v,delta,up,good,sp)=>({l,v,delta,up,good,sp})
const donut=(title,data,w=6)=>({type:'chart',kind:'donut',title,w,legend:true,height:210,data})
const geoBlock=(w=12,title='Performance by country')=>({type:'geo',title,w,data:GEO,height:210})
const chanHbar=(w=6,title='Spend by channel')=>({type:'chart',kind:'hbar',title,w,x:CHAN,data:[78,52,40,30,24,17,11],color:GREEN})

/* ---------- AWARENESS (Case Study 1) signature data ---------- */
const AW_VIDEO = { x:['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6'], stack:true, series:[
  {name:'25%',color:'#2B8FEA',data:[41,44,47,49,52,55]},
  {name:'50%',color:'#28C3AE',data:[27,29,31,33,35,37]},
  {name:'75%',color:'#25E29C',data:[15,17,18,20,22,24]},
  {name:'100%',color:'#22FF88',data:[8,9,11,12,13,15]},
] }
const AW_IMPRSHARE = { x:WK, series:[
  {name:'Display impressions',color:BLUE,data:[182000,205000,221000,243000,268000,291000,305000,322000]},
  {name:'Search top-of-page %',color:GREEN,data:[44,46,48,49,51,53,54,56]},
] }
const AW_NVR = [{name:'New users',value:64,color:BLUE},{name:'Returning users',value:36,color:GREEN}]
const AW_ORGANIC = { x:WK, series:[
  {name:'Brand impressions',color:GREEN,data:[12000,14500,16800,19200,22100,24800,27400,30200],area:true},
  {name:'Non-brand impressions',color:BLUE,data:[38000,41000,43500,46000,48800,51200,53600,56400],area:true},
] }

/* ---------- GA4 in-page action events (all types) ---------- */
const ACTION_EVENTS=[
  {ev:'form_start',count:'4,820',rate:'3.8%',val:'—'},
  {ev:'form_submit',count:'2,180',rate:'1.7%',val:'€96 CPL'},
  {ev:'product_view',count:'74,900',rate:'58.3%',val:'—'},
  {ev:'add_to_cart',count:'28,310',rate:'22.0%',val:'—'},
  {ev:'begin_checkout',count:'12,640',rate:'9.8%',val:'—'},
  {ev:'purchase',count:'7,180',rate:'5.6%',val:'€128,400'},
  {ev:'button_click (book demo)',count:'1,920',rate:'1.5%',val:'—'},
  {ev:'calendar_start',count:'860',rate:'0.7%',val:'—'},
  {ev:'calendar_submit',count:'412',rate:'0.3%',val:'€22.30 CPL'},
]
const ACTION_COLS=[{k:'ev',label:'Event'},{k:'count',label:'Count',r:true},{k:'rate',label:'Per session',r:true},{k:'val',label:'Value',r:true}]

/* ---------- Google Merchant (Case Study 2) ---------- */
const MERCH_STATUS=[
  {name:'Summit Trail Boot',cat:'Footwear',status:'Approved',status_s:'good',price:'€50',compete:'-8% vs market',compete_s:'good',clicks:'4,200'},
  {name:'Alpine Down Jacket',cat:'Apparel',status:'Approved',status_s:'good',price:'€80',compete:'+3% vs market',compete_s:'plain',clicks:'2,900'},
  {name:'Trek 40L Backpack',cat:'Gear',status:'Approved',status_s:'good',price:'€60',compete:'-2% vs market',compete_s:'good',clicks:'2,100'},
  {name:'Glacier Shell Jacket',cat:'Apparel',status:'Disapproved',status_s:'bad',price:'€60',compete:'+12% vs market',compete_s:'bad',clicks:'0'},
  {name:'Summit GPS Watch',cat:'Tech',status:'Pending',status_s:'plain',price:'€120',compete:'+18% vs market',compete_s:'bad',clicks:'320'},
]
const MERCH_COLS=[{k:'name',label:'Product'},{k:'cat',label:'Category'},{k:'status',label:'Status'},{k:'price',label:'Price',r:true},{k:'compete',label:'Price competitiveness'},{k:'clicks',label:'Clicks',r:true}]

/* ================= OVERVIEW (client-type-aware, no sub-tabs) ================= */
const OVERVIEW = {
  ecommerce:{ sub:'Meta Ads + Google Ads + GA4 + Search Console · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Revenue','$312.4k','▲ 14.0%',true,true,SP.up),
      k('Blended ROAS','4.76x','▲ 0.4x',true,true,SP.up),
      k('AOV','$43.51','▲ 3.0%',true,true,SP.up),
      k('Conv. rate','5.59%','▼ 2.7%',false,false,SP.dn),
    ]},
    {type:'signatureFunnel',w:12,title:'Funnel overview',spend:'€870.12',
      steps:[{name:'Impressions',value:9598,p:'100%'},{name:'Clicks',value:954,p:'9.9%'},{name:'All conversions',value:155,p:'1.6%'},{name:'Conversions',value:143,p:'1.5%'},{name:'Value',value:8,p:'0.08%'}],
      side:[{label:'Avg. CPM',value:'€90.67',delta:'22%',up:true},{label:'Avg. CPC',value:'€0.91',delta:'18%',up:true},{label:'Cost / conv.',value:'€5.62',delta:'7%',up:true},{label:'Conversion rate',value:'0.79%'}],
      footer:'114.3% of previous month'},
    donut('Devices',DEV,6), chanHbar(6,'Revenue by channel'),
    geoBlock(12,'Revenue by country'),
  ]},
  leadgen:{ sub:'Meta Ads + Google Ads + GA4 + Search Console · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Total leads','2,180','▲ 12.4%',true,true,SP.up),
      k('Blended CPL','$30.10','▼ 6.0%',true,true,SP.dn),
      k('Conv. rate','5.2%','▲ 0.4%',true,true,SP.up),
      k('Ad spend','$65.6k','▲ 8.2%',true,true,SP.up),
    ]},
    {type:'signatureFunnel',w:12,title:'Funnel overview',spend:'€20,940',
      steps:[{name:'Impressions',value:1640000,p:'100%'},{name:'Clicks',value:48200,p:'2.9%'},{name:'Leads',value:2180,p:'0.13%'},{name:'Qualified (MQL)',value:1420,p:'0.087%'},{name:'Customers',value:184,p:'0.011%'}],
      side:[{label:'Avg. CPM',value:'€12.77',delta:'9%',up:true},{label:'Avg. CPC',value:'€0.43',delta:'6%',up:false},{label:'Cost / lead',value:'€9.60',delta:'6%',up:false},{label:'Lead → customer',value:'8.4%'}],
      footer:'106% of previous month'},
    donut('Leads by source',[{name:'Paid Search',value:38,color:GREEN},{name:'Paid Social',value:31,color:BLUE},{name:'Organic',value:19,color:GREY},{name:'Other',value:12,color:'#5AAFF2'}],6),
    donut('Devices',DEV,6),
    geoBlock(12,'Leads by country'),
  ]},
  awareness:{ sub:'Brand penetration & top-of-funnel engagement · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Reach','1.84M','▲ 22%',true,true,SP.up),
      k('Impressions','4.21M','▲ 18%',true,true,SP.up),
      k('Frequency','2.3','▲ 0.2',true,'plain',null),
      k('New users','64%','▲ 4%',true,true,SP.up),
    ]},
    {type:'signatureFunnel',w:12,title:'Brand reach funnel',spend:'€18,400',
      steps:[{name:'Impressions',value:4210000,p:'100%'},{name:'Reach',value:1840000,p:'43.7%'},{name:'Engaged',value:512000,p:'12.2%'},{name:'Video 100% plays',value:138000,p:'3.3%'},{name:'Brand searches',value:24600,p:'0.58%'}],
      side:[{label:'Avg. CPM',value:'€4.90',delta:'6%',up:false},{label:'Frequency',value:'2.3',delta:'0.2',up:true},{label:'Engagement rate',value:'12.2%',delta:'1.4%',up:true},{label:'Cost / engaged',value:'€0.36'}],
      footer:'118% of previous month'},
    donut('New vs Returning',AW_NVR,6), donut('Devices',DEV,6),
    geoBlock(12,'Geographic reach'),
  ]},
}

/* ================= CLIENT-TYPE-AWARE PLATFORM OVERVIEWS ================= */
const TYPED = {
  ecommerce:{
    'meta/overview':{ sub:'Facebook & Instagram — catalog sales funnel', blocks:[
      {type:'kpis',items:[k('Catalog sales','€128.4k','▲ 14%',true,true,SP.up),k('Add to cart','28,310','▲ 9%',true,true,SP.up),k('Purchases','7,180','▲ 11%',true,true,SP.up)]},
      {type:'chart',kind:'hfunnel',title:'Catalog: Add to cart → Initiate checkout → Purchase',src:'Meta Ads',w:12,big:true,height:300,steps:[{name:'Add to cart',value:28310,p:'100%'},{name:'Initiate checkout',value:12640,p:'44.6%'},{name:'Purchase',value:7180,p:'25.4%'}]},
      {type:'kpis',items:[k('Video Views','312k','▲ 11%',true,true,null),k('Reach','1.21M','▲ 16%',true,true,null),k('Frequency','2.1','▲ 0.1',true,'plain',null),k('Clicks','28,310','▲ 9%',true,true,null),k('CTR%','2.34%','▲ 0.3%',true,true,null),k('CPC','€0.86','▼ 4%',false,true,null),k('CPM','€6.40','▲ 2%',true,false,null),k('CPA','€5.62','▼ 7%',false,true,null),k('Conversions','7,180','▲ 11%',true,true,null),k('Conv. Value','€128.4k','▲ 14%',true,true,null),k('ROAS','4.8x','▲ 0.4x',true,true,null)]},
    ]},
    'ads/overview':{ sub:'Shopping performance — ROAS, conversion value & cost-per-sale', blocks:[
      {type:'kpis',items:[k('Shopping ROAS','4.8x','▲ 0.4x',true,true,SP.up),k('Conversion value','€128,400','▲ 14%',true,true,SP.up),k('Cost / sale','€11.40','▼ 6%',true,true,SP.dn)]},
      {type:'chart',kind:'gauge',title:'Shopping ROAS vs goal',src:'Google Ads',w:5,height:260,value:4.8,max:8,goal:4.0,unit:'x'},
      {type:'chart',kind:'line',title:'Shopping ROAS trend',src:'Google Ads',w:7,height:260,x:WK,series:[{name:'ROAS',color:GREEN,data:[4.1,4.3,4.2,4.5,4.6,4.7,4.8,4.8],area:true}]},
      {type:'kpis',items:[k('Impressions','2.8M','▲ 14%',true,true,null),k('Display Impressions','412k','▲ 18%',true,true,null),k('Clicks','31,200','▲ 9%',true,true,null),k('CTR%','1.11%','▼ 0.2%',false,false,null),k('CPC','€0.87','▼ 5%',false,true,null),k('CPL','€11.40','▼ 6%',false,true,null),k('CPA','€11.40','▼ 6%',false,true,null),k('Conversions','7,180','▲ 11%',true,true,null),k('Conv. Value','€128.4k','▲ 14%',true,true,null),k('ROAS','4.8x','▲ 0.4x',true,true,null),k('Search Top-of-Page Rate','48%','▲ 4%',true,true,null),k('Avg. LTV','€243','▲ 8%',true,true,null)]},
    ]},
    'ga4/overview':{ sub:'Site behaviour — product performance & revenue source', blocks:[
      {type:'kpis',items:[k('Total users','80,633','▲ 18%',true,true,SP.up),k('Sessions','109,794','▲ 15%',true,true,SP.up),k('Engagement rate','61.4%','▲ 3.1%',true,true,SP.up),k('Conv. value','$312k','▲ 14%',true,true,SP.up)]},
      {type:'chart',kind:'scatter',title:'Product performance (CVR × revenue × spend)',src:'GA4',w:6,points:[[10.0,92000,1840],[8.1,78400,980],[7.8,45600,760],[16.3,31000,1240],[9.6,26000,520],[6.1,22800,380],[12.4,18400,610],[3.6,16200,135]]},
      {type:'chart',kind:'hbar',title:'Revenue by source',src:'GA4',w:6,x:CHAN,data:[112,96,54,38,90,22,11],color:GREEN},
      {type:'kpis',items:[k('Page Views','284k','▲ 16%',true,true,null),k('Landing Page Views','109,794','▲ 15%',true,true,null),k('Avg Session Duration','2m 04s','▲ 11%',true,true,null),k('Reach','80,633','▲ 18%',true,true,null),k('Impressions','284k','▲ 16%',true,true,null),k('New Users','51,605','▲ 20%',true,true,null),k('Returning Users','29,028','▲ 14%',true,true,null)]},
    ]},
    'search/overview':{ sub:'Organic clicks, impressions & position', blocks:[
      {type:'kpis',items:[k('Clicks','48,210','▲ 12%',true,true,SP.up),k('Impressions','1.4M','▲ 9%',true,true,SP.up),k('Avg. CTR','3.44%','▲ 0.2%',true,true,SP.up),k('Avg. position','8.3','▲ 1.1',true,true,SP.dn)]},
      {type:'chart',kind:'line',title:'Clicks & impressions',src:'Search Console',w:12,x:WK,series:[{name:'Impressions (k)',color:BLUE,data:[160,172,168,184,176,192,200,210],area:true},{name:'Clicks (k)',color:GREEN,data:[5.6,6.0,5.9,6.4,6.1,6.8,7.0,7.4],area:true}]},
    ]},
    'merchant/overview':{ sub:'Google Merchant Center — feed health & product status', blocks:[
      {type:'healthScore',w:5,title:'Merchant Health Score',score:82,max:100,items:[
        {label:'Approved products',status:'ok',note:'142 / 150'},
        {label:'Disapproved',status:'bad',note:'1 (price mismatch)'},
        {label:'Pending review',status:'warn',note:'7'},
        {label:'Feed freshness',status:'ok',note:'updated 3h ago'},
      ]},
      {type:'leaderboard',w:7,title:'Product leaderboard',rows:[
        {name:'Summit Trail Boot',sub:'High sales · efficient spend',value:'6.4x ROAS',status:'good',trend:'+18%'},
        {name:'Merino Base Layer',sub:'Top conversion rate',value:'16.3% CVR',status:'good',trend:'+22%'},
        {name:'Summit GPS Watch',sub:'High spend · low conversion',value:'2.4x ROAS',status:'bad',trend:'-12%'},
        {name:'Glacier Shell Jacket',sub:'Disapproved — not serving',value:'0 clicks',status:'bad',trend:'-9%'},
      ]},
      {type:'producttable',w:12,title:'Product status & price competitiveness',columns:MERCH_COLS,rows:MERCH_STATUS},
      {type:'insight',w:12,icon:'inventory',tone:'bad',title:'Glacier Shell Jacket disapproved',text:'Price mismatch between feed (€60) and landing page. Fix the structured-data price to restore Shopping eligibility.'},
    ]},
  },

  leadgen:{
    'meta/overview':{ sub:'Lead forms — completion & on-platform vs site split', blocks:[
      {type:'kpis',items:[k('Lead-form completion','62%','▲ 5%',true,true,SP.up),k('On-platform CPL','€78','▼ 9%',true,true,SP.dn),k('Site CPL','€118','▲ 4%',false,'plain',null)]},
      {type:'chart',kind:'stack',title:'On-platform (Instant Form) vs site leads',src:'Meta Ads',w:12,stack:false,x:['May Wk1','Wk2','Wk3','Wk4','Jun Wk1','Wk2'],series:[{name:'On-platform (Instant Form)',color:GREEN,data:[120,140,135,160,158,172]},{name:'Site leads',color:BLUE,data:[88,96,92,104,110,118]}]},
      {type:'kpis',items:[k('Video Views','208k','▲ 8%',true,true,null),k('Reach','840k','▲ 14%',true,true,null),k('Frequency','2.8','▲ 0.3',true,'plain',null),k('Clicks','19,420','▲ 7%',true,true,null),k('CTR%','2.31%','▲ 0.2%',true,true,null),k('CPC','€1.08','▼ 3%',false,true,null),k('CPM','€12.77','▲ 4%',true,false,null),k('CPA','€9.60','▼ 6%',false,true,null),k('Conversions','2,180','▲ 12%',true,true,null),k('Conv. Value','€209.3k','▲ 9%',true,true,null),k('ROAS','3.2x','▲ 0.2x',true,'plain',null)]},
    ]},
    'ads/overview':{ sub:'Lead generation — CPL, conversion rate & keyword relevance', blocks:[
      {type:'kpis',items:[k('CPL','€96','▼ 6%',true,true,SP.dn),k('Conv. rate','5.2%','▲ 0.4%',true,true,SP.up),k('Spend','€20,940','▲ 3%',true,'plain',null)]},
      {type:'chart',kind:'hbar',title:'Leads by keyword',src:'Google Ads',w:12,x:['injury lawyer','accident claim','legal advice','compensation','free consult','near me'],data:[540,420,310,260,180,140],color:GREEN},
      {type:'kpis',items:[k('Impressions','1.64M','▲ 11%',true,true,null),k('Display Impressions','228k','▲ 9%',true,true,null),k('Clicks','48,200','▲ 8%',true,true,null),k('CTR%','2.94%','▲ 0.3%',true,true,null),k('CPC','€0.43','▼ 6%',false,true,null),k('CPL','€9.60','▼ 6%',false,true,null),k('CPA','€9.60','▼ 6%',false,true,null),k('Conversions','2,180','▲ 12%',true,true,null),k('Conv. Value','€209.3k','▲ 9%',true,true,null),k('ROAS','3.2x','▲ 0.2x',true,'plain',null),k('Search Top-of-Page Rate','52%','▲ 6%',true,true,null),k('Avg. LTV','€1,140','▲ 5%',true,true,null)]},
    ]},
    'ga4/overview':{ sub:'Path to lead — resource downloads & MQL → SQL flow', blocks:[
      {type:'kpis',items:[k('Visitors','42,100','▲ 11%',true,true,SP.up),k('Resource downloads','7,600','▲ 14%',true,true,SP.up),k('MQL','1,420','▲ 8%',true,true,SP.up),k('SQL','184','▲ 5%',true,true,SP.up)]},
      {type:'chart',kind:'sankey',title:'MQL → SQL conversion flow',src:'GA4',w:12,height:300,
        nodes:[{name:'Visitors',itemStyle:{color:BLUE}},{name:'Resource download',itemStyle:{color:'#5AAFF2'}},{name:'MQL',itemStyle:{color:'#28C3AE'}},{name:'SQL',itemStyle:{color:GREEN}},{name:'Customer',itemStyle:{color:'#22FF88'}},{name:'Dropped',itemStyle:{color:'#3a4f7a'}}],
        links:[{source:'Visitors',target:'Resource download',value:7600},{source:'Visitors',target:'Dropped',value:34500},{source:'Resource download',target:'MQL',value:2180},{source:'Resource download',target:'Dropped',value:5420},{source:'MQL',target:'SQL',value:1420},{source:'MQL',target:'Dropped',value:760},{source:'SQL',target:'Customer',value:184},{source:'SQL',target:'Dropped',value:1236}]},
      {type:'kpis',items:[k('Page Views','124k','▲ 12%',true,true,null),k('Landing Page Views','42,100','▲ 11%',true,true,null),k('Avg Session Duration','3m 12s','▲ 8%',true,true,null),k('Reach','42,100','▲ 11%',true,true,null),k('Impressions','124k','▲ 12%',true,true,null),k('New Users','27,365','▲ 14%',true,true,null),k('Returning Users','14,735','▲ 7%',true,true,null)]},
    ]},
    'search/overview':{ sub:'Organic clicks, impressions & position', blocks:[
      {type:'kpis',items:[k('Clicks','18,420','▲ 9%',true,true,SP.up),k('Impressions','640k','▲ 7%',true,true,SP.up),k('Avg. CTR','2.88%','▲ 0.2%',true,true,SP.up),k('Avg. position','9.1','▲ 0.8',true,true,SP.dn)]},
      {type:'chart',kind:'line',title:'Clicks & impressions',src:'Search Console',w:12,x:WK,series:[{name:'Impressions (k)',color:BLUE,data:[72,78,76,84,81,88,92,96],area:true},{name:'Clicks (k)',color:GREEN,data:[2.1,2.3,2.2,2.5,2.4,2.7,2.8,2.9],area:true}]},
    ]},
    'webinar/overview':{ sub:'Zoom / webinar registration & attendance', blocks:[
      {type:'kpis',items:[k('Registered','1,240','▲ 16%',true,true,SP.up),k('Attended','512','▲ 9%',true,true,SP.up),k('Attendance rate','41%','▲ 2%',true,true,SP.up),k('Avg. time on webinar','38m','▲ 4m',true,true,null)]},
      donut('Registration vs Attendance',[{name:'Attended',value:41,color:GREEN},{name:'No-show',value:59,color:'#3a4f7a'}],6),
      {type:'chart',kind:'line',title:'Time-on-webinar distribution',src:'Zoom',w:6,height:210,x:['0-10m','10-20m','20-30m','30-40m','40-50m','50m+'],series:[{name:'Attendees',color:BLUE,data:[88,96,110,124,72,22],area:true}]},
      {type:'chart',kind:'hbar',title:'Registrations by source',src:'Zoom',w:12,x:['LinkedIn Ads','Email','Google Ads','Organic','Partner'],data:[420,360,240,140,80],color:GREEN},
    ]},
    'webinar/funnel':{ sub:'Ads → Registration → Attended → SQL → Conversion', blocks:[
      {type:'journey',w:12,title:'Webinar funnel',spend:'€2,140',
        stages:[{label:'Impressions',value:184000},{label:'Reg. page views',value:9600},{label:'Registered',value:1240},{label:'Attended',value:512},{label:'SQL',value:96},{label:'Conversion',value:24}],
        stats:[{label:'Cost / registrant',value:'€1.73'},{label:'Attendance rate',value:'41%'},{label:'Reg → SQL',value:'7.7%'},{label:'Cost / SQL',value:'€22.30'}]},
    ]},
  },

  awareness:{
    'meta/overview':{ sub:'Reach, frequency & video engagement', blocks:[
      {type:'kpis',items:[k('Reach','1.84M','▲ 22%',true,true,SP.up),k('Frequency','2.3','▲ 0.2',true,'plain',null),k('Video views','512k','▲ 14%',true,true,SP.up)]},
      {type:'chart',kind:'stack',title:'Video engagement (play %)',src:'Meta Ads',w:6,weekly:'video',...AW_VIDEO},
      {type:'weekFunnels',w:6,title:'Video completion funnel · by week',src:'Meta Ads',height:150},
      {type:'kpis',items:[k('Video Views','512k','▲ 14%',true,true,null),k('Reach','1.84M','▲ 22%',true,true,null),k('Frequency','2.3','▲ 0.2',true,'plain',null),k('Clicks','48,210','▲ 12%',true,true,null),k('CTR%','3.44%','▲ 0.2%',true,true,null),k('CPC','€0.91','▼ 5%',false,true,null),k('CPM','€4.90','▼ 6%',false,'plain',null),k('CPA','€36.00','▲ 3%',true,false,null),k('Conversions','512','▲ 6%',true,true,null),k('Conv. Value','€18.4k','▲ 8%',true,true,null),k('ROAS','1.8x','▼ 0.2x',false,false,null)]},
    ]},
    'ads/overview':{ sub:'Display reach & search visibility', blocks:[
      {type:'kpis',items:[k('Display impressions','322k','▲ 18%',true,true,SP.up),k('Search top-of-page rate','56%','▲ 4%',true,true,SP.up)]},
      {type:'chart',kind:'line',title:'Display impressions & top-of-page rate',src:'Google Ads',w:12,...AW_IMPRSHARE},
      {type:'kpis',items:[k('Impressions','4.21M','▲ 18%',true,true,null),k('Display Impressions','322k','▲ 18%',true,true,null),k('Clicks','24,800','▲ 16%',true,true,null),k('CTR%','0.59%','▼ 0.1%',false,false,null),k('CPC','€0.74','▼ 3%',false,true,null),k('CPL','€36.00','▲ 3%',true,false,null),k('CPA','€36.00','▲ 3%',true,false,null),k('Conversions','512','▲ 6%',true,true,null),k('Conv. Value','€18.4k','▲ 8%',true,true,null),k('ROAS','1.8x','▼ 0.2x',false,false,null),k('Search Top-of-Page Rate','56%','▲ 4%',true,true,null),k('Avg. LTV','€184','▲ 4%',true,true,null)]},
    ]},
    'ga4/overview':{ sub:'New vs returning & engagement', blocks:[
      {type:'kpis',items:[k('Total users','80,633','▲ 18%',true,true,SP.up),k('New users','64%','▲ 4%',true,true,SP.up),k('Engagement rate','61.4%','▲ 3.1%',true,true,SP.up),k('Avg. session','1m 48s','▲ 9%',true,true,null)]},
      donut('New vs Returning',AW_NVR,6),
      {type:'chart',kind:'line',title:'Avg. session duration',src:'GA4',w:6,height:210,x:WK,series:[{name:'Seconds',color:GREEN,data:[92,98,101,108,112,118,121,128],area:true}]},
      {type:'kpis',items:[k('Page Views','214k','▲ 21%',true,true,null),k('Landing Page Views','80,633','▲ 18%',true,true,null),k('Avg Session Duration','1m 48s','▲ 9%',true,true,null),k('Reach','80,633','▲ 18%',true,true,null),k('Impressions','214k','▲ 21%',true,true,null),k('New Users','51,605','▲ 22%',true,true,null),k('Returning Users','29,028','▲ 12%',true,true,null)]},
    ]},
    'search/overview':{ sub:'Brand vs non-brand organic visibility', blocks:[
      {type:'kpis',items:[k('Clicks','24,800','▲ 16%',true,true,SP.up),k('Impressions','870k','▲ 21%',true,true,SP.up),k('Avg. CTR','2.85%','▲ 0.3%',true,true,SP.up),k('Avg. position','7.6','▲ 1.4',true,true,SP.dn)]},
      {type:'chart',kind:'line',title:'Brand vs Non-brand impressions',src:'Search Console',w:12,...AW_ORGANIC},
    ]},
  },
}

/* ================= SHARED (type-independent) CONTENT ================= */

const C = {
  /* ---------------- GA4 shared tabs ---------------- */
  'ga4/events':{ sub:'In-page action events — what users click, submit & buy', blocks:[
    {type:'kpis',items:[k('Tracked events','9'),k('Top event','product_view'),k('Form submits','2,180','▲ 6%',true,true,SP.up),k('Purchases','7,180','▲ 11%',true,true,SP.up)]},
    {type:'table',w:12,title:'In-page action events',src:'GA4',columns:ACTION_COLS,rows:ACTION_EVENTS},
  ]},
  'ga4/demographics':{ sub:'Who your users are — age, gender, geography & device', blocks:[
    {type:'kpis',items:[k('Top country','United States'),k('Top age','25-34'),k('Top device','Desktop · 62%'),k('Economic tier','Mid 40%')]},
    {type:'chart',kind:'bar',title:'Users by age',w:6,x:AGE,data:[14,38,24,12,8,4]},
    donut('Gender',[{name:'Female',value:54,color:GREEN},{name:'Male',value:43,color:BLUE},{name:'Unknown',value:3,color:GREY}],6),
    geoBlock(12,'Users by country'),
    {type:'chart',kind:'hbar',title:'Top cities',w:6,x:['Athens','Thessaloniki','Patras','Heraklion','Larissa','London'],data:[2280,901,556,317,260,232],color:GREEN},
    {type:'chart',kind:'hbar',title:'State / Region',w:6,x:['Attica','Central Macedonia','Crete','Western Greece','Thessaly','Peloponnese'],data:[44200,18600,9800,7400,6100,4800],color:BLUE},
    donut('Device',DEV,6),
    donut('Economic status (proxy)',[{name:'Top 10%',value:18,color:GREEN},{name:'Mid 40%',value:52,color:BLUE},{name:'Lower 50%',value:30,color:GREY}],6),
  ]},

  /* ---------------- Placeholder integrations ---------------- */
  'youtube/overview':{ sub:'Organic channel performance — views, watch time & subscribers · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Views','742k','▲ 18%',true,true,SP.up),
      k('Watch time','48.6k hrs','▲ 14%',true,true,SP.up),
      k('Avg view duration','3:56','▲ 6%',true,true,null),
      k('Net subscribers','+7,730','▲ 22%',true,true,SP.up),
    ]},
    {type:'chart',kind:'line',title:'Views & watch time',src:'YouTube Analytics',w:12,x:WK,series:[
      {name:'Views (k)',color:GREEN,data:[78,84,88,92,96,98,102,104],area:true},
      {name:'Watch time (k hrs)',color:BLUE,data:[5.2,5.6,5.8,6.1,6.3,6.4,6.6,6.6]},
    ]},
    donut('Traffic sources',[{name:'YouTube search',value:31,color:GREEN},{name:'Suggested',value:28,color:BLUE},{name:'Browse',value:22,color:'#5AAFF2'},{name:'External',value:9,color:GREY},{name:'Direct',value:6,color:'#28C3AE'},{name:'Other',value:4,color:'#3a4f7a'}],6),
    donut('Device',[{name:'Mobile',value:64,color:GREEN},{name:'Desktop',value:21,color:BLUE},{name:'TV',value:11,color:GREY},{name:'Tablet',value:4,color:'#5AAFF2'}],6),
    {type:'kpis',items:[
      k('Engaged views','512k','▲ 12%',true,true,null),
      k('Avg % viewed','41.3%','▲ 2%',true,true,null),
      k('Likes','58.9k','▲ 16%',true,true,null),
      k('Shares','6,420','▲ 9%',true,true,null),
      k('Comments','4,180','▲ 7%',true,true,null),
      k('Playlist saves','3,050','▲ 5%',true,true,null),
      k('Subscribers gained','9,240','▲ 20%',true,true,null),
      k('Total subscribers','214.8k','▲ 4%',true,true,null),
    ]},
    geoBlock(12,'Views by country'),
    {type:'table',w:12,title:'Top videos',src:'YouTube Analytics',columns:[
      {k:'name',label:'Video'},{k:'pub',label:'Published'},{k:'views',label:'Views',r:true},{k:'dur',label:'Avg duration',r:true},{k:'watch',label:'Watch time (hrs)',r:true},{k:'pct',label:'Avg % viewed',r:true},{k:'likes',label:'Likes',r:true},{k:'subs',label:'Subs +',r:true},
    ],rows:[
      {name:'Ultralight Backpacking Gear List 2026',pub:'May 12',views:'148,320',dur:'4:37',watch:'11,420',pct:'44%',likes:'9,240',subs:'1,860'},
      {name:'Why Your Tent Is Leaking (Fix in 60s) #Shorts',pub:'Jun 25',views:'210,450',dur:'0:31',watch:'1,810',pct:'88%',likes:'12,900',subs:'970'},
      {name:'We Tested 7 Waterproof Jackets in a Storm',pub:'Apr 28',views:'96,540',dur:'5:12',watch:'8,370',pct:'47%',likes:'6,110',subs:'1,205'},
      {name:'How to Pack a Bag for 5 Days (One Carry-On)',pub:'Jun 03',views:'74,880',dur:'3:58',watch:'4,955',pct:'40%',likes:'4,530',subs:'812'},
      {name:'Sunrise Summit Vlog — Dolomites',pub:'Jun 18',views:'61,940',dur:'6:03',watch:'6,245',pct:'49%',likes:'5,880',subs:'1,090'},
      {name:'Trail-Tested: Our New Merino Base Layer',pub:'May 21',views:'52,110',dur:'2:44',watch:'2,375',pct:'38%',likes:'3,020',subs:'540'},
      {name:'Fall Layering System Explained',pub:'May 30',views:'44,230',dur:'4:09',watch:'3,060',pct:'42%',likes:'2,780',subs:'425'},
      {name:'5 Campsite Coffee Setups Ranked',pub:'Apr 15',views:'38,760',dur:'3:21',watch:'2,165',pct:'36%',likes:'2,410',subs:'318'},
    ]},
  ]},
  'linkedin/overview':{ sub:'Organic page & LinkedIn Ads — followers, engagement & lead gen · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Followers','14,238','▲ 4.5%',true,true,SP.up),
      k('Impressions','248.9k','▲ 12%',true,true,SP.up),
      k('Engagement rate','5.8%','▲ 0.4%',true,true,SP.up),
      k('Follower gains','+612','▲ 9%',true,true,SP.up),
    ]},
    {type:'chart',kind:'line',title:'Follower growth & impressions',src:'LinkedIn Pages API',w:12,x:WK,series:[
      {name:'Followers',color:GREEN,data:[13626,13758,13904,14010,14092,14148,14196,14238],area:true},
      {name:'Impressions (k)',color:BLUE,data:[26.1,29.4,31.8,33.2,30.5,34.1,31.9,31.9]},
    ]},
    {type:'chart',kind:'hbar',title:'Followers by seniority',src:'LinkedIn',w:6,x:['Senior','Manager','Director','Entry','VP','CXO','Owner/Partner','Training'],data:[24,21,16,14,9,7,5,4],color:GREEN},
    donut('Engagement by post type',[{name:'Article',value:34,color:GREEN},{name:'Image',value:22,color:BLUE},{name:'Video',value:18,color:'#5AAFF2'},{name:'Document',value:12,color:GREY},{name:'Poll',value:9,color:'#28C3AE'},{name:'Text',value:5,color:'#3a4f7a'}],6),
    {type:'chart',kind:'hbar',title:'Followers by job function',src:'LinkedIn',w:6,x:['Legal','Business Dev','Finance','Operations','Consulting','Sales','HR','Marketing'],data:[28,13,11,10,9,8,7,6],color:BLUE},
    {type:'chart',kind:'hbar',title:'Followers by company size',src:'LinkedIn',w:6,x:['1k–5k','201–500','51–200','501–1k','10k+','11–50','5k–10k','1–10'],data:[19,17,16,14,12,11,7,4],color:GREEN},
    {type:'kpis',items:[
      k('Unique reach','96.4k','▲ 8%',true,true,null),
      k('Post clicks','5,120','▲ 11%',true,true,null),
      k('Reactions','7,340','▲ 14%',true,true,null),
      k('Comments','892','▲ 6%',true,true,null),
      k('Shares','1,046','▲ 9%',true,true,null),
      k('Page views','11,470','▲ 9%',true,true,null),
    ]},
    {type:'kpis',items:[
      k('Ad spend','€6,420','▲ 3%',true,'plain',null),
      k('Ad impressions','142.6k','▲ 10%',true,true,null),
      k('CTR','1.53%','▲ 0.2%',true,true,null),
      k('CPC','€2.95','▼ 4%',false,true,null),
      k('Leads','74','▲ 12%',true,true,null),
      k('CPL','€86.76','▼ 6%',false,true,null),
      k('Conversions','96','▲ 8%',true,true,null),
      k('Cost / conv.','€66.88','▼ 5%',false,true,null),
    ]},
    {type:'table',w:12,title:'Top posts',src:'LinkedIn Pages API',columns:[
      {k:'name',label:'Post'},{k:'type',label:'Type'},{k:'impr',label:'Impressions',r:true},{k:'react',label:'Reactions',r:true},{k:'comments',label:'Comments',r:true},{k:'shares',label:'Shares',r:true},{k:'ctr',label:'CTR',r:true},{k:'er',label:'Eng. rate',r:true},
    ],rows:[
      {name:'New EU AI Act: 5 compliance steps for GCs',type:'Article',impr:'18,400',react:'742',comments:'118',shares:'214',ctr:'2.9%',er:'7.4%'},
      {name:'Partner spotlight: Q&A on cross-border M&A',type:'Video',impr:'14,900',react:'615',comments:'96',shares:'88',ctr:'1.6%',er:'6.1%'},
      {name:'2026 Employment Law Handbook (gated)',type:'Document',impr:'12,300',react:'389',comments:'41',shares:'132',ctr:'4.2%',er:'6.8%'},
      {name:'Client win: €40M dispute resolution',type:'Image',impr:'9,850',react:'508',comments:'74',shares:'61',ctr:'1.1%',er:'6.9%'},
      {name:'Webinar recap: Data privacy in fintech',type:'Article',impr:'8,600',react:'296',comments:'52',shares:'79',ctr:'2.4%',er:'5.6%'},
      {name:"We're hiring: Senior Associate, Corporate",type:'Image',impr:'7,200',react:'341',comments:'63',shares:'38',ctr:'1.8%',er:'6.4%'},
      {name:'Poll: Biggest 2026 regulatory concern?',type:'Poll',impr:'6,750',react:'210',comments:'187',shares:'24',ctr:'0.9%',er:'6.3%'},
      {name:'Thought leadership: ESG reporting shifts',type:'Article',impr:'5,400',react:'178',comments:'29',shares:'46',ctr:'2.1%',er:'4.7%'},
    ]},
  ]},
  'social/overview':{ sub:'Organic Instagram & Facebook — reach, engagement & audience · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Reach','412.8k','▲ 11.4%',true,true,SP.up),
      k('Followers','85.2k','▲ 3,180',true,true,SP.up),
      k('Engagement rate','5.42%','▲ 0.4%',true,true,SP.up),
      k('Total interactions','96.3k','▲ 12.7%',true,true,SP.up),
    ]},
    {type:'chart',kind:'line',title:'Reach & follower growth',src:'Instagram Graph API',w:12,x:WK,series:[
      {name:'Reach (k)',color:GREEN,data:[44.1,47.8,51.2,49.6,55.4,58.9,52.3,53.5],area:true},
      {name:'Net new followers',color:BLUE,data:[310,420,505,290,640,470,285,260]},
    ]},
    donut('Reach by content type',[{name:'Reels',value:54,color:GREEN},{name:'Carousels',value:24,color:BLUE},{name:'Images',value:14,color:'#5AAFF2'},{name:'Stories',value:8,color:GREY}],6),
    donut('Follower vs non-follower reach',[{name:'Non-followers',value:63,color:GREEN},{name:'Followers',value:37,color:BLUE}],6),
    {type:'kpis',items:[
      k('IG Views','1.34M','▲ 9.2%',true,true,null),
      k('Profile views','58.4k','▲ 6.8%',true,true,null),
      k('Accounts engaged','47.6k','▲ 8.1%',true,true,null),
      k('Website taps','6,420','▲ 5.3%',true,true,null),
      k('Saves','9,800','▲ 14%',true,true,null),
      k('Shares','6,400','▲ 10%',true,true,null),
      k('FB Reach','248.7k','▲ 4.6%',true,true,null),
      k('FB Followers','48.9k','▲ 1,240',true,true,null),
    ]},
    {type:'chart',kind:'bar',title:'Audience by age',w:6,x:['18-24','25-34','35-44','45-54','55-64','65+'],data:[19,38,26,11,4,2]},
    donut('Audience gender',[{name:'Female',value:52,color:GREEN},{name:'Male',value:46,color:BLUE},{name:'Unknown',value:2,color:GREY}],6),
    {type:'table',w:12,title:'Top posts',src:'Instagram + Facebook',columns:[
      {k:'name',label:'Post'},{k:'plat',label:'Platform'},{k:'type',label:'Type'},{k:'reach',label:'Reach',r:true},{k:'likes',label:'Likes',r:true},{k:'comments',label:'Comments',r:true},{k:'saves',label:'Saves',r:true},{k:'er',label:'Eng. rate',r:true},
    ],rows:[
      {name:'Golden hour on the ridgeline',plat:'Instagram',type:'Image',reach:'36,800',likes:'4,110',comments:'205',saves:'690',er:'14.7%'},
      {name:'Trail-tested: 3 layering systems',plat:'Instagram',type:'Carousel',reach:'41,200',likes:'3,180',comments:'388',saves:'1,620',er:'14.0%'},
      {name:'Summit Series jacket — first look',plat:'Instagram',type:'Reel',reach:'88,400',likes:'7,240',comments:'512',saves:'2,180',er:'13.4%'},
      {name:'Pack it in 60 sec',plat:'Instagram',type:'Reel',reach:'72,600',likes:'5,880',comments:'431',saves:'1,340',er:'12.6%'},
      {name:'Behind the fabric: recycled shell',plat:'Instagram',type:'Carousel',reach:'28,900',likes:'2,020',comments:'266',saves:'980',er:'12.4%'},
      {name:'Customer trip report: Dolomites',plat:'Facebook',type:'Image',reach:'22,300',likes:'1,340',comments:'184',saves:'—',er:'8.2%'},
      {name:'Fall collection drop — shop now',plat:'Facebook',type:'Video',reach:'31,700',likes:'1,890',comments:'142',saves:'—',er:'8.0%'},
      {name:'Weekend restock is live',plat:'Instagram',type:'Story',reach:'19,400',likes:'640',comments:'58',saves:'—',er:'4.7%'},
    ]},
  ]},

  /* ---------------- CLIENTS (agency) ---------------- */
  'clients/portfolio':{ sub:'12 clients · $214k managed spend this month', blocks:[
    {type:'kpis',items:[k('Clients','12','+2',true,true,SP.up),k('Managed spend','$214k','▲ 11%',true,true,SP.up),k('Blended ROAS','4.9x','▲ 0.2x',true,true,SP.up),k('On target','9 / 12',null,true,true),k('Off target','3',null,false,false),k('Open alerts','5',null,false,false)]},
    {type:'table',title:'Clients',w:12,columns:[{k:'name',label:'Client'},{k:'type',label:'Type'},{k:'sources',label:'Sources'},{k:'spend',label:'Spend',r:true},{k:'roas',label:'ROAS',r:true},{k:'status',label:'Status'}],rows:[
      {name:'Northwind Outdoors',type:'Ecommerce',sources:'GA4·Ads·Meta·GSC',spend:'$65.6k',roas:'4.8x',roas_s:'good',status:'Active'},
      {name:'Lumen Skincare',type:'Ecommerce',sources:'GA4·Meta',spend:'$41.2k',roas:'6.1x',roas_s:'good',status:'Active'},
      {name:'Apex Legal',type:'Leads',sources:'GA4·Ads·GSC',spend:'$22.8k',roas:'3.2x',roas_s:'plain',status:'Active'},
      {name:'Harbor Dental',type:'Leads',sources:'GA4·Ads',spend:'$14.1k',roas:'2.1x',roas_s:'bad',status:'Active'},
      {name:'Volt Fitness',type:'Ecommerce',sources:'GA4·Meta·GSC',spend:'$31.0k',roas:'5.4x',roas_s:'good',status:'Active'},
      {name:'Briar & Co',type:'Ecommerce',sources:'GA4·Ads·Meta',spend:'$18.9k',roas:'1.9x',roas_s:'bad',status:'Paused'},
    ]},
  ]},
  'clients/master':{ sub:'Portfolio roll-up across all clients', blocks:[
    {type:'kpis',items:[k('Total spend','$214k','▲ 11%',true,true,SP.up),k('Total revenue','$1.05M','▲ 16%',true,true,SP.up),k('Blended ROAS','4.9x','▲ 0.2x',true,true,SP.up),k('Total conversions','24,100','▲ 13%',true,true,SP.up)]},
    {type:'chart',kind:'hbar',title:'Spend by client',w:6,x:['Northwind','Lumen','Volt','Apex','Briar','Harbor'],data:[65.6,41.2,31,22.8,18.9,14.1]},
    {type:'chart',kind:'line',title:'Blended ROAS trend',w:6,x:WK,series:[{name:'ROAS',color:GREEN,data:[4.2,4.4,4.3,4.6,4.5,4.7,4.8,4.9],area:true}]},
  ]},
  'clients/alerts':{ sub:'KPIs that crossed a threshold', blocks:[
    {type:'digest',w:12},
    {type:'table',title:'Open alerts',w:12,columns:[{k:'name',label:'Client'},{k:'metric',label:'Metric'},{k:'msg',label:'Alert'},{k:'when',label:'When',r:true}],rows:[
      {name:'Harbor Dental',metric:'ROAS',msg:'ROAS dropped below 2.5x',msg_s:'bad',when:'2h ago'},{name:'Briar & Co',metric:'CPA',msg:'CPA up 38% week-over-week',msg_s:'bad',when:'6h ago'},{name:'Apex Legal',metric:'CPL',msg:'CPL above $120 target',msg_s:'bad',when:'1d ago'},{name:'Northwind',metric:'Conv. rate',msg:'Conversion rate down 2.7%',msg_s:'plain',when:'1d ago'},
    ]},
  ]},
  'clients/add':{ sub:'Onboard a new client', blocks:[ {type:'addClient',w:7} ]},

  /* ---------------- SETTINGS ---------------- */
  'settings/connections':{ sub:'Connect data sources for this client', blocks:[ {type:'connections'} ]},
  'settings/targets':{ sub:'These targets drive the green / red coloring across campaigns, KPIs & the detail panel', blocks:[
    {type:'note',icon:'target',title:'One source of truth',text:'Edit a target below and it updates everywhere instantly — the campaign detail panel’s KPI breakdown and on-target pills all read these same definitions.'},
    {type:'kpiTargets',w:12},
  ]},
  'settings/branding':{ sub:'White-label this client dashboard', blocks:[ {type:'branding',w:12} ]},
  'settings/team':{ sub:'Who can access this workspace', blocks:[ {type:'teamManager',w:12} ]},
  'settings/health':{ sub:'Pixel / GTM firing status across tracked events', blocks:[
    {type:'kpis',w:12,items:[k('Tags firing','11 / 13',null,true,'good',null),k('Stale tags','1',null,false,'plain',null),k('Not firing','1',null,false,'bad',null),k('Last container push','2d ago',null,true,'plain',null)]},
    {type:'trackingHealth',w:12,title:'Tag & event health',rows:[
      {name:'GA4 config',source:'GTM · All pages',status:'firing',last:'just now'},
      {name:'page_view',source:'GA4',status:'firing',last:'just now'},
      {name:'CRS — sign_up',source:'GA4 · Signups case',status:'firing',last:'4 min ago'},
      {name:'AlbaPV — purchase',source:'GA4 · Ecommerce case',status:'firing',last:'8 min ago'},
      {name:'add_to_cart',source:'GA4',status:'firing',last:'12 min ago'},
      {name:'Meta Pixel — PageView',source:'Meta',status:'firing',last:'just now'},
      {name:'Meta Pixel — Purchase',source:'Meta',status:'stale',last:'3h ago'},
      {name:'begin_checkout',source:'GA4',status:'firing',last:'15 min ago'},
      {name:'Google Ads — conversion',source:'Google Ads',status:'firing',last:'9 min ago'},
      {name:'form_submit',source:'GA4',status:'down',last:'2d ago'},
    ]},
    {type:'insight',w:12,icon:'warning',tone:'bad',title:'form_submit stopped firing 2 days ago',text:'The lead form conversion tag has not fired since the last site deploy. Check the GTM trigger and the form selector before trusting CPL this period.'},
  ]},
  'settings/log':{ sub:'Logged campaign changes for client transparency', blocks:[
    {type:'changelog',w:12,title:'Campaign changelog',rows:[
      {date:'Jun 23, 2026',update:'Launched Reels-first creative test',trend:'CTR up to 9.2%, stable CPM',change:'Shifting budget to Reels next week — 18% lift in 100% video plays'},
      {date:'Jun 16, 2026',update:'Paused 2 underperforming interest sets',trend:'CPA crept above target on broad interests',change:'Reallocated €40/day to lookalikes — CPA back under €5.60'},
      {date:'Jun 9, 2026',update:'Added city-level targeting (Athens, Thessaloniki)',trend:'Higher CTR in metro areas',change:'City split now standard — top-of-page rate +4pts'},
      {date:'Jun 2, 2026',update:'New month kickoff, refreshed budgets',trend:'Stable 8% CTR, €0.91 CPC',change:'Holding strategy; watching frequency (2.3)'},
    ]},
  ]},
}

export function getContent(source, tab, clientType = 'ecommerce') {
  if (source === 'overview') return OVERVIEW[clientType] || OVERVIEW.ecommerce
  const key = `${source}/${tab}`
  const typed = TYPED[clientType] && TYPED[clientType][key]
  if (typed) return typed
  if (C[key]) return C[key]
  return { sub:'', blocks:[{ type:'note', title:'Coming soon', text:'This section lights up once its data source is connected.' }] }
}
