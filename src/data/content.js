// Dummy data for every tab. Keys: 'overview' or `${source}/${tab}`.
// Each entry: { sub, blocks:[ widget specs ] }

const WK = ['Aug 1','Aug 5','Aug 9','Aug 13','Aug 17','Aug 21','Aug 25','Aug 28']
const SP = {
  up:[4,5,5,6,6,7,7,8], dn:[8,7.5,7,6.5,6,5.6,5.3,5], flat:[6,6.2,5.9,6.3,6,6.4,6.2,6.5],
  rev:[182,205,198,250,243,288,300,312], spend:[48,52,50,58,55,61,63,66],
}
const BLUE='#2B8FEA', GREEN='#22FF88', GREY='#8A9BBB'
const DEV=[{name:'Desktop',value:62,color:GREEN},{name:'Mobile',value:31,color:BLUE},{name:'Tablet',value:7,color:GREY}]
const AGE=['18-24','25-34','35-44','45-54','55-64','65+']
const GEO=[['Country','Value'],['United States',1210000],['Canada',418000],['United Kingdom',303000],['Germany',192000],['Australia',139000],['France',96000],['Spain',74000],['Brazil',61000],['Japan',58000],['India',44000],['Netherlands',39000]]
const CHAN=['Paid Search','Paid Social','Email','Direct','Organic','Referral','Other']
const FUN_ECOM={ steps:[{name:'Session start',value:128440,p:'100%'},{name:'View item',value:74900,p:'58.3%'},{name:'Add to cart',value:28310,p:'22.0%'},{name:'Begin checkout',value:12640,p:'9.8%'},{name:'Purchase',value:7180,p:'5.6%'}] }
const FUN_LEAD={ steps:[{name:'Visit',value:42100,p:'100%'},{name:'View pricing',value:18400,p:'43.7%'},{name:'Form view',value:7600,p:'18.1%'},{name:'Form start',value:3950,p:'9.4%'},{name:'Lead',value:2180,p:'5.2%'}] }
const SANKEY={
  nodes:[{name:'Paid Social',itemStyle:{color:BLUE}},{name:'Paid Search',itemStyle:{color:'#5AAFF2'}},{name:'Organic',itemStyle:{color:GREY}},{name:'Purchased',itemStyle:{color:GREEN}},{name:'Dropped',itemStyle:{color:'#3a4f7a'}}],
  links:[{source:'Paid Social',target:'Purchased',value:3200},{source:'Paid Social',target:'Dropped',value:49100},{source:'Paid Search',target:'Purchased',value:2600},{source:'Paid Search',target:'Dropped',value:39200},{source:'Organic',target:'Purchased',value:1380},{source:'Organic',target:'Dropped',value:32960}],
}
const HEAT={
  xLabels:['Wk 0','Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6'],
  yLabels:['Wk of Aug 4','Aug 11','Aug 18','Aug 25','Sep 1','Sep 8'],
  matrix:[[100,42,31,26,22,19,17],[100,45,33,28,24,21],[100,40,30,25,22],[100,48,36,30],[100,44,34],[100,51]],
}
// Monthly acquisition cohorts (triangular — recent cohorts have fewer months elapsed)
const MCOHORT={
  xLabels:['M0','M1','M2','M3','M4','M5'],
  yLabels:['Jan','Feb','Mar','Apr','May','Jun'],
  matrix:[[100,48,39,33,29,26],[100,46,37,31,27],[100,51,42,35],[100,49,40],[100,53],[100]],
}
const k=(l,v,delta,up,good,sp)=>({l,v,delta,up,good,sp})
const lineSV=()=>({type:'chart',kind:'line',title:'Performance over time',src:'GA4 + Ads',w:8,x:WK,series:[{name:'Revenue',color:GREEN,data:SP.rev,area:true},{name:'Ad spend',color:BLUE,data:SP.spend,area:true}]})
const donutDev=(w=4)=>({type:'chart',kind:'donut',title:'Devices',w,legend:true,height:150,data:DEV})
const geoBlock=(w=6,title='Performance by country')=>({type:'geo',title,w,data:GEO,height:210})
const chanHbar=(w=6,title='Spend by channel')=>({type:'chart',kind:'hbar',title,w,x:CHAN,data:[78,52,40,30,24,17,11],color:GREEN})

/* ---------------- ECOMMERCE · PRODUCTS ---------------- */
const PRODUCTS=[
  {name:'Summit Trail Boot',cat:'Footwear',rev:'$92,000',rev_n:92,units:'1,840',views:'18,400',cart:'4,200',cvr:'10.0%',cvr_s:'good',price:'$50',roas:'6.4x',roas_s:'good',trend:'+18%',up:true},
  {name:'Alpine Down Jacket',cat:'Apparel',rev:'$78,400',rev_n:78.4,units:'980',views:'12,100',cart:'2,900',cvr:'8.1%',cvr_s:'good',price:'$80',roas:'5.8x',roas_s:'good',trend:'+12%',up:true},
  {name:'Trek 40L Backpack',cat:'Gear',rev:'$45,600',rev_n:45.6,units:'760',views:'9,800',cart:'2,100',cvr:'7.8%',cvr_s:'plain',price:'$60',roas:'4.9x',roas_s:'good',trend:'+6%',up:true},
  {name:'Merino Base Layer',cat:'Apparel',rev:'$31,000',rev_n:31,units:'1,240',views:'7,600',cart:'1,800',cvr:'16.3%',cvr_s:'good',price:'$25',roas:'5.1x',roas_s:'good',trend:'+22%',up:true},
  {name:'Carbon Trek Poles',cat:'Gear',rev:'$26,000',rev_n:26,units:'520',views:'5,400',cart:'1,100',cvr:'9.6%',cvr_s:'plain',price:'$50',roas:'3.6x',roas_s:'plain',trend:'-4%',up:false},
  {name:'Glacier Shell Jacket',cat:'Apparel',rev:'$22,800',rev_n:22.8,units:'380',views:'6,200',cart:'1,300',cvr:'6.1%',cvr_s:'plain',price:'$60',roas:'3.1x',roas_s:'plain',trend:'-9%',up:false},
  {name:'Trailhead Daypack',cat:'Gear',rev:'$18,400',rev_n:18.4,units:'610',views:'4,900',cart:'980',cvr:'12.4%',cvr_s:'good',price:'$30',roas:'4.2x',roas_s:'good',trend:'+15%',up:true},
  {name:'Summit GPS Watch',cat:'Tech',rev:'$16,200',rev_n:16.2,units:'135',views:'3,800',cart:'520',cvr:'3.6%',cvr_s:'bad',price:'$120',roas:'2.4x',roas_s:'bad',trend:'-12%',up:false},
]
const PROD_COLS=[
  {k:'name',label:'Product'},{k:'cat',label:'Category'},{k:'rev',label:'Revenue',r:true,strong:true,n:'rev_n'},
  {k:'units',label:'Units',r:true},{k:'views',label:'Views',r:true},{k:'cart',label:'Add to cart',r:true},
  {k:'cvr',label:'CVR',r:true},{k:'price',label:'Avg price',r:true},{k:'roas',label:'ROAS',r:true},{k:'trend',label:'Trend',r:true},
]
const PROD_CAT=[{name:'Apparel',value:42,color:BLUE},{name:'Footwear',value:30,color:GREEN},{name:'Gear',value:22,color:GREY},{name:'Tech',value:6,color:'#5AAFF2'}]

/* ---------------- GOOGLE MERCHANT (Case Study 2) ---------------- */
const MERCH_STATUS=[
  {name:'Summit Trail Boot',cat:'Footwear',status:'Approved',status_s:'good',price:'€50',compete:'-8% vs market',compete_s:'good',clicks:'4,200'},
  {name:'Alpine Down Jacket',cat:'Apparel',status:'Approved',status_s:'good',price:'€80',compete:'+3% vs market',compete_s:'plain',clicks:'2,900'},
  {name:'Trek 40L Backpack',cat:'Gear',status:'Approved',status_s:'good',price:'€60',compete:'-2% vs market',compete_s:'good',clicks:'2,100'},
  {name:'Glacier Shell Jacket',cat:'Apparel',status:'Disapproved',status_s:'bad',price:'€60',compete:'+12% vs market',compete_s:'bad',clicks:'0'},
  {name:'Summit GPS Watch',cat:'Tech',status:'Pending',status_s:'plain',price:'€120',compete:'+18% vs market',compete_s:'bad',clicks:'320'},
]
const MERCH_COLS=[{k:'name',label:'Product'},{k:'cat',label:'Category'},{k:'status',label:'Status'},{k:'price',label:'Price',r:true},{k:'compete',label:'Price competitiveness'},{k:'clicks',label:'Clicks',r:true}]

/* ---------------- LEAD-GEN data ---------------- */
const LCHAN=['Paid Search','Paid Social','Organic','Email','Referral','Direct']
const FUN_LEAD_FULL={ steps:[{name:'Impressions',value:1640000,p:'100%'},{name:'Clicks',value:48200,p:'2.9%'},{name:'Leads',value:2180,p:'0.13%'},{name:'Qualified (MQL)',value:1420,p:'0.087%'},{name:'Customers',value:184,p:'0.011%'}] }

/* ---------------- CAMPAIGN TREES (Campaign → set → ad) ---------------- */
const fmtIconList=['Reel','Carousel','Image','Video','DPA','Catalog','Shopping','RSA','Asset group','Display']
const META_TREE_COLS=[{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'roas',label:'ROAS',r:true},{k:'conv',label:'Conv.',r:true}]
const META_CAMPAIGNS=[
  {name:'Retargeting · 30d',status:'Active',spend:'$6,930',ctr:'2.61%',ctr_s:'good',cpc:'$0.98',cpc_s:'good',roas:'7.8x',roas_s:'good',conv:'540',sets:[
    {name:'Cart abandoners',spend:'$3,900',ctr:'3.1%',ctr_s:'good',roas:'9.2x',roas_s:'good',conv:'320',ads:[
      {name:'UGC — “Still in your cart?”',fmt:'Reel',spend:'$2,300',ctr:'3.6%',ctr_s:'good',roas:'10.1x',roas_s:'good',conv:'210'},
      {name:'Carousel — top picks',fmt:'Carousel',spend:'$1,600',ctr:'2.5%',roas:'7.9x',roas_s:'good',conv:'110'}]},
    {name:'Viewed product 14d',spend:'$3,030',ctr:'2.4%',ctr_s:'good',roas:'6.4x',roas_s:'good',conv:'220',ads:[
      {name:'Dynamic product ad',fmt:'DPA',spend:'$3,030',ctr:'2.4%',roas:'6.4x',roas_s:'good',conv:'220'}]}]},
  {name:'Prospecting · Broad',status:'Active',spend:'$12,480',ctr:'1.84%',ctr_s:'good',cpc:'$1.42',cpc_s:'good',roas:'4.2x',roas_s:'good',conv:'612',sets:[
    {name:'Lookalike 1% — Feed',spend:'$5,200',ctr:'1.9%',roas:'4.6x',roas_s:'good',conv:'280',ads:[
      {name:'UGC — trail run',fmt:'Reel',spend:'$3,000',ctr:'2.1%',roas:'5.0x',roas_s:'good',conv:'170'},
      {name:'Static — new arrivals',fmt:'Image',spend:'$2,200',ctr:'1.5%',roas:'3.9x',roas_s:'plain',conv:'110'}]},
    {name:'Interest: Hiking',spend:'$4,100',ctr:'1.6%',roas:'3.8x',roas_s:'plain',conv:'210',ads:[
      {name:'Video — brand story',fmt:'Video',spend:'$4,100',ctr:'1.6%',roas:'3.8x',roas_s:'plain',conv:'210'}]},
    {name:'Broad — Advantage',spend:'$3,180',ctr:'1.7%',roas:'3.5x',roas_s:'plain',conv:'122',ads:[
      {name:'Carousel — bestsellers',fmt:'Carousel',spend:'$3,180',ctr:'1.7%',roas:'3.5x',roas_s:'plain',conv:'122'}]}]},
  {name:'Advantage+ Shopping',status:'Active',spend:'$9,210',ctr:'1.55%',ctr_s:'good',cpc:'$1.21',cpc_s:'good',roas:'5.1x',roas_s:'good',conv:'470',sets:[
    {name:'ASC — Existing customers',spend:'$3,600',ctr:'1.8%',roas:'6.2x',roas_s:'good',conv:'210',ads:[
      {name:'Catalog — winter range',fmt:'Catalog',spend:'$3,600',ctr:'1.8%',roas:'6.2x',roas_s:'good',conv:'210'}]},
    {name:'ASC — Prospects',spend:'$5,610',ctr:'1.4%',roas:'4.5x',roas_s:'good',conv:'260',ads:[
      {name:'Catalog — bestsellers',fmt:'Catalog',spend:'$5,610',ctr:'1.4%',roas:'4.5x',roas_s:'good',conv:'260'}]}]},
  {name:'Catalog · DPA',status:'Active',spend:'$4,760',ctr:'2.10%',ctr_s:'good',cpc:'$1.05',cpc_s:'good',roas:'6.4x',roas_s:'good',conv:'388',sets:[
    {name:'Cross-sell',spend:'$2,400',ctr:'2.2%',roas:'6.9x',roas_s:'good',conv:'210',ads:[
      {name:'DPA — complete the look',fmt:'DPA',spend:'$2,400',ctr:'2.2%',roas:'6.9x',roas_s:'good',conv:'210'}]},
    {name:'Upsell',spend:'$2,360',ctr:'2.0%',roas:'5.9x',roas_s:'good',conv:'178',ads:[
      {name:'DPA — premium picks',fmt:'DPA',spend:'$2,360',ctr:'2.0%',roas:'5.9x',roas_s:'good',conv:'178'}]}]},
  {name:'Lookalike 3%',status:'Paused',spend:'$3,140',ctr:'0.92%',ctr_s:'bad',cpc:'$1.88',cpc_s:'plain',roas:'2.3x',roas_s:'bad',conv:'96',sets:[
    {name:'LAL 3% — Feed',spend:'$3,140',ctr:'0.92%',ctr_s:'bad',roas:'2.3x',roas_s:'bad',conv:'96',ads:[
      {name:'Static — sale 20%',fmt:'Image',spend:'$3,140',ctr:'0.92%',ctr_s:'bad',roas:'2.3x',roas_s:'bad',conv:'96'}]}]},
  {name:'Brand Awareness',status:'Paused',spend:'$1,980',ctr:'0.74%',ctr_s:'bad',cpc:'$0.61',cpc_s:'good',roas:'1.1x',roas_s:'bad',conv:'41',sets:[
    {name:'Reach — Broad',spend:'$1,980',ctr:'0.74%',ctr_s:'bad',roas:'1.1x',roas_s:'bad',conv:'41',ads:[
      {name:'Video — brand film',fmt:'Video',spend:'$1,980',ctr:'0.74%',ctr_s:'bad',roas:'1.1x',roas_s:'bad',conv:'41'}]}]},
]
const ADS_TREE_COLS=[{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpc',label:'CPC',r:true},{k:'conv',label:'Conv.',r:true},{k:'roas',label:'ROAS',r:true}]
const ADS_CAMPAIGNS=[
  {name:'Brand — Search',status:'Active',spend:'$3,210',ctr:'8.4%',ctr_s:'good',cpc:'$0.42',cpc_s:'good',conv:'640',roas:'9.1x',roas_s:'good',sets:[
    {name:'Brand terms — exact',spend:'$1,900',ctr:'9.2%',cpc:'$0.38',conv:'420',roas:'10.2x',roas_s:'good',ads:[
      {name:'RSA — “Official store”',fmt:'RSA',spend:'$1,900',ctr:'9.2%',cpc:'$0.38',conv:'420',roas:'10.2x',roas_s:'good'}]},
    {name:'Brand + product',spend:'$1,310',ctr:'7.3%',cpc:'$0.48',conv:'220',roas:'7.8x',roas_s:'good',ads:[
      {name:'RSA — boots & jackets',fmt:'RSA',spend:'$1,310',ctr:'7.3%',cpc:'$0.48',conv:'220',roas:'7.8x',roas_s:'good'}]}]},
  {name:'Shopping — All products',status:'Active',spend:'$8,940',ctr:'2.1%',ctr_s:'plain',cpc:'$0.81',cpc_s:'plain',conv:'710',roas:'5.4x',roas_s:'good',sets:[
    {name:'Footwear',spend:'$3,120',ctr:'2.4%',cpc:'$0.78',conv:'280',roas:'6.1x',roas_s:'good',ads:[
      {name:'PLA — trail boots',fmt:'Shopping',spend:'$3,120',ctr:'2.4%',cpc:'$0.78',conv:'280',roas:'6.1x',roas_s:'good'}]},
    {name:'Apparel',spend:'$2,480',ctr:'2.0%',cpc:'$0.84',conv:'190',roas:'4.9x',roas_s:'good',ads:[
      {name:'PLA — jackets',fmt:'Shopping',spend:'$2,480',ctr:'2.0%',cpc:'$0.84',conv:'190',roas:'4.9x',roas_s:'good'}]},
    {name:'Gear',spend:'$3,340',ctr:'1.9%',cpc:'$0.82',conv:'240',roas:'5.0x',roas_s:'good',ads:[
      {name:'PLA — backpacks',fmt:'Shopping',spend:'$3,340',ctr:'1.9%',cpc:'$0.82',conv:'240',roas:'5.0x',roas_s:'good'}]}]},
  {name:'Performance Max',status:'Active',spend:'$6,120',ctr:'1.9%',ctr_s:'plain',cpc:'$0.76',cpc_s:'plain',conv:'520',roas:'4.8x',roas_s:'good',sets:[
    {name:'Asset group — Bestsellers',spend:'$3,600',ctr:'2.0%',cpc:'$0.74',conv:'320',roas:'5.2x',roas_s:'good',ads:[
      {name:'PMax — bestsellers',fmt:'Asset group',spend:'$3,600',ctr:'2.0%',cpc:'$0.74',conv:'320',roas:'5.2x',roas_s:'good'}]},
    {name:'Asset group — New season',spend:'$2,520',ctr:'1.7%',cpc:'$0.79',conv:'200',roas:'4.2x',roas_s:'good',ads:[
      {name:'PMax — new season',fmt:'Asset group',spend:'$2,520',ctr:'1.7%',cpc:'$0.79',conv:'200',roas:'4.2x',roas_s:'good'}]}]},
  {name:'Non-brand — Search',status:'Active',spend:'$5,380',ctr:'3.6%',ctr_s:'good',cpc:'$0.92',cpc_s:'plain',conv:'380',roas:'3.9x',roas_s:'good',sets:[
    {name:'Hiking gear',spend:'$2,900',ctr:'3.1%',cpc:'$0.95',conv:'210',roas:'3.6x',roas_s:'plain',ads:[
      {name:'RSA — hiking gear',fmt:'RSA',spend:'$2,900',ctr:'3.1%',cpc:'$0.95',conv:'210',roas:'3.6x',roas_s:'plain'}]},
    {name:'Trail running',spend:'$2,480',ctr:'4.2%',cpc:'$0.88',conv:'170',roas:'4.3x',roas_s:'good',ads:[
      {name:'RSA — trail running',fmt:'RSA',spend:'$2,480',ctr:'4.2%',cpc:'$0.88',conv:'170',roas:'4.3x',roas_s:'good'}]}]},
  {name:'Competitor — Search',status:'Paused',spend:'$2,140',ctr:'2.8%',ctr_s:'plain',cpc:'$1.64',cpc_s:'bad',conv:'88',roas:'2.1x',roas_s:'bad',sets:[
    {name:'Competitor terms',spend:'$2,140',ctr:'2.8%',cpc:'$1.64',cpc_s:'bad',conv:'88',roas:'2.1x',roas_s:'bad',ads:[
      {name:'RSA — switch & save',fmt:'RSA',spend:'$2,140',ctr:'2.8%',cpc:'$1.64',conv:'88',roas:'2.1x',roas_s:'bad'}]}]},
  {name:'Display — Remarketing',status:'Active',spend:'$1,310',ctr:'0.7%',ctr_s:'bad',cpc:'$0.38',cpc_s:'good',conv:'72',roas:'3.1x',roas_s:'plain',sets:[
    {name:'Cart abandoners — Display',spend:'$1,310',ctr:'0.7%',ctr_s:'bad',cpc:'$0.38',cpc_s:'good',conv:'72',roas:'3.1x',roas_s:'plain',ads:[
      {name:'Responsive display',fmt:'Display',spend:'$1,310',ctr:'0.7%',cpc:'$0.38',conv:'72',roas:'3.1x',roas_s:'plain'}]}]},
]

/* ---------------- CAMPAIGN TREES · LEAD-GEN (CPL-based) ---------------- */
const META_TREE_COLS_LEAD=[{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpl',label:'CPL',r:true},{k:'leads',label:'Leads',r:true}]
const META_CAMPAIGNS_LEAD=[
  {name:'Lead Gen · Broad',status:'Active',spend:'$12,480',ctr:'1.84%',ctr_s:'good',cpl:'$28',cpl_s:'good',leads:'446',sets:[
    {name:'Lookalike 1% — Feed',spend:'$5,200',ctr:'1.9%',cpl:'$26',cpl_s:'good',leads:'200',ads:[
      {name:'Instant form — Free consult',fmt:'Instant Form',spend:'$3,000',ctr:'2.1%',cpl:'$24',cpl_s:'good',leads:'125'},
      {name:'Static — “Talk to a lawyer”',fmt:'Image',spend:'$2,200',ctr:'1.5%',cpl:'$29',cpl_s:'good',leads:'75'}]},
    {name:'Interest: Legal help',spend:'$4,100',ctr:'1.6%',cpl:'$31',cpl_s:'good',leads:'132',ads:[
      {name:'Video — case results',fmt:'Video',spend:'$4,100',ctr:'1.6%',cpl:'$31',cpl_s:'good',leads:'132'}]},
    {name:'Broad — Advantage',spend:'$3,180',ctr:'1.7%',cpl:'$28',cpl_s:'good',leads:'114',ads:[
      {name:'Carousel — practice areas',fmt:'Carousel',spend:'$3,180',ctr:'1.7%',cpl:'$28',cpl_s:'good',leads:'114'}]}]},
  {name:'Retargeting · Site visitors',status:'Active',spend:'$6,930',ctr:'2.61%',ctr_s:'good',cpl:'$22',cpl_s:'good',leads:'315',sets:[
    {name:'Form abandoners',spend:'$3,900',ctr:'3.1%',cpl:'$19',cpl_s:'good',leads:'205',ads:[
      {name:'Instant form — “Finish your request”',fmt:'Instant Form',spend:'$2,300',ctr:'3.6%',cpl:'$18',cpl_s:'good',leads:'128'},
      {name:'Carousel — why choose us',fmt:'Carousel',spend:'$1,600',ctr:'2.5%',cpl:'$21',cpl_s:'good',leads:'77'}]},
    {name:'Viewed pricing 14d',spend:'$3,030',ctr:'2.4%',cpl:'$28',cpl_s:'good',leads:'110',ads:[
      {name:'Static — book a call',fmt:'Image',spend:'$3,030',ctr:'2.4%',cpl:'$28',cpl_s:'good',leads:'110'}]}]},
  {name:'Lookalike · Past clients',status:'Active',spend:'$9,210',ctr:'1.55%',ctr_s:'good',cpl:'$34',cpl_s:'good',leads:'271',sets:[
    {name:'LAL 1% — Past clients',spend:'$5,610',ctr:'1.6%',cpl:'$32',cpl_s:'good',leads:'176',ads:[
      {name:'Video — testimonials',fmt:'Video',spend:'$5,610',ctr:'1.6%',cpl:'$32',cpl_s:'good',leads:'176'}]},
    {name:'LAL 3% — Past clients',spend:'$3,600',ctr:'1.5%',cpl:'$38',cpl_s:'plain',leads:'95',ads:[
      {name:'Static — free case review',fmt:'Image',spend:'$3,600',ctr:'1.5%',cpl:'$38',cpl_s:'plain',leads:'95'}]}]},
  {name:'Instant Forms · Mobile',status:'Active',spend:'$4,760',ctr:'2.10%',ctr_s:'good',cpl:'$26',cpl_s:'good',leads:'183',sets:[
    {name:'Mobile feed',spend:'$2,400',ctr:'2.2%',cpl:'$24',cpl_s:'good',leads:'100',ads:[
      {name:'Instant form — quick quote',fmt:'Instant Form',spend:'$2,400',ctr:'2.2%',cpl:'$24',cpl_s:'good',leads:'100'}]},
    {name:'Reels',spend:'$2,360',ctr:'2.0%',cpl:'$29',cpl_s:'good',leads:'83',ads:[
      {name:'Reel — 15s explainer',fmt:'Reel',spend:'$2,360',ctr:'2.0%',cpl:'$29',cpl_s:'good',leads:'83'}]}]},
  {name:'Lookalike 3%',status:'Paused',spend:'$3,140',ctr:'0.92%',ctr_s:'bad',cpl:'$142',cpl_s:'bad',leads:'22',sets:[
    {name:'LAL 3% — Feed',spend:'$3,140',ctr:'0.92%',ctr_s:'bad',cpl:'$142',cpl_s:'bad',leads:'22',ads:[
      {name:'Static — generic offer',fmt:'Image',spend:'$3,140',ctr:'0.92%',cpl:'$142',cpl_s:'bad',leads:'22'}]}]},
  {name:'Brand Awareness',status:'Paused',spend:'$1,980',ctr:'0.74%',ctr_s:'bad',cpl:'$198',cpl_s:'bad',leads:'10',sets:[
    {name:'Reach — Broad',spend:'$1,980',ctr:'0.74%',ctr_s:'bad',cpl:'$198',cpl_s:'bad',leads:'10',ads:[
      {name:'Video — brand film',fmt:'Video',spend:'$1,980',ctr:'0.74%',cpl:'$198',cpl_s:'bad',leads:'10'}]}]},
]
const ADS_TREE_COLS_LEAD=[{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpc',label:'CPC',r:true},{k:'cpl',label:'CPL',r:true},{k:'leads',label:'Leads',r:true}]
const ADS_CAMPAIGNS_LEAD=[
  {name:'Brand — Search',status:'Active',spend:'$3,210',ctr:'8.4%',ctr_s:'good',cpc:'$0.42',cpc_s:'good',cpl:'$16',cpl_s:'good',leads:'201',sets:[
    {name:'Brand terms — exact',spend:'$1,900',ctr:'9.2%',cpc:'$0.38',cpl:'$14',cpl_s:'good',leads:'136',ads:[
      {name:'RSA — “Official firm site”',fmt:'RSA',spend:'$1,900',ctr:'9.2%',cpc:'$0.38',cpl:'$14',cpl_s:'good',leads:'136'}]},
    {name:'Brand + service',spend:'$1,310',ctr:'7.3%',cpc:'$0.48',cpl:'$20',cpl_s:'good',leads:'65',ads:[
      {name:'RSA — free consultation',fmt:'RSA',spend:'$1,310',ctr:'7.3%',cpc:'$0.48',cpl:'$20',cpl_s:'good',leads:'65'}]}]},
  {name:'Non-brand — Search',status:'Active',spend:'$8,940',ctr:'2.1%',ctr_s:'plain',cpc:'$0.81',cpc_s:'plain',cpl:'$38',cpl_s:'good',leads:'235',sets:[
    {name:'Personal injury',spend:'$3,120',ctr:'2.4%',cpc:'$0.78',cpl:'$34',cpl_s:'good',leads:'92',ads:[
      {name:'RSA — injury claim',fmt:'RSA',spend:'$3,120',ctr:'2.4%',cpc:'$0.78',cpl:'$34',cpl_s:'good',leads:'92'}]},
    {name:'Family law',spend:'$2,480',ctr:'2.0%',cpc:'$0.84',cpl:'$41',cpl_s:'good',leads:'60',ads:[
      {name:'RSA — family law help',fmt:'RSA',spend:'$2,480',ctr:'2.0%',cpc:'$0.84',cpl:'$41',cpl_s:'good',leads:'60'}]},
    {name:'Employment law',spend:'$3,340',ctr:'1.9%',cpc:'$0.82',cpl:'$41',cpl_s:'good',leads:'83',ads:[
      {name:'RSA — workplace claims',fmt:'RSA',spend:'$3,340',ctr:'1.9%',cpc:'$0.82',cpl:'$41',cpl_s:'good',leads:'83'}]}]},
  {name:'Local Services',status:'Active',spend:'$6,120',ctr:'1.9%',ctr_s:'plain',cpc:'$0.76',cpc_s:'plain',cpl:'$44',cpl_s:'good',leads:'139',sets:[
    {name:'LSA — Personal injury',spend:'$3,600',ctr:'2.0%',cpc:'$0.74',cpl:'$42',cpl_s:'good',leads:'86',ads:[
      {name:'Local Services ad',fmt:'LSA',spend:'$3,600',ctr:'2.0%',cpc:'$0.74',cpl:'$42',cpl_s:'good',leads:'86'}]},
    {name:'LSA — Family',spend:'$2,520',ctr:'1.7%',cpc:'$0.79',cpl:'$47',cpl_s:'good',leads:'53',ads:[
      {name:'Local Services ad',fmt:'LSA',spend:'$2,520',ctr:'1.7%',cpc:'$0.79',cpl:'$47',cpl_s:'good',leads:'53'}]}]},
  {name:'Competitor — Search',status:'Paused',spend:'$2,140',ctr:'2.8%',ctr_s:'plain',cpc:'$1.64',cpc_s:'bad',cpl:'$134',cpl_s:'bad',leads:'16',sets:[
    {name:'Competitor terms',spend:'$2,140',ctr:'2.8%',cpc:'$1.64',cpc_s:'bad',cpl:'$134',cpl_s:'bad',leads:'16',ads:[
      {name:'RSA — switch firms',fmt:'RSA',spend:'$2,140',ctr:'2.8%',cpc:'$1.64',cpl:'$134',cpl_s:'bad',leads:'16'}]}]},
  {name:'Display — Remarketing',status:'Active',spend:'$1,310',ctr:'0.7%',ctr_s:'bad',cpc:'$0.38',cpc_s:'good',cpl:'$58',cpl_s:'good',leads:'23',sets:[
    {name:'Form abandoners — Display',spend:'$1,310',ctr:'0.7%',ctr_s:'bad',cpc:'$0.38',cpc_s:'good',cpl:'$58',cpl_s:'good',leads:'23',ads:[
      {name:'Responsive display',fmt:'Display',spend:'$1,310',ctr:'0.7%',cpc:'$0.38',cpl:'$58',cpl_s:'good',leads:'23'}]}]},
]

/* ---------------- AWARENESS data (Case Study 1) ---------------- */
const AW_WK = WK
const AW_VIDEO = { x:['Wk 1','Wk 2','Wk 3','Wk 4','Wk 5','Wk 6'], stack:true, series:[
  {name:'25%',color:'#2B8FEA',data:[41,44,47,49,52,55]},
  {name:'50%',color:'#28C3AE',data:[27,29,31,33,35,37]},
  {name:'75%',color:'#25E29C',data:[15,17,18,20,22,24]},
  {name:'100%',color:'#22FF88',data:[8,9,11,12,13,15]},
] }
const AW_IMPRSHARE = { x:AW_WK, series:[
  {name:'Display impressions',color:BLUE,data:[182000,205000,221000,243000,268000,291000,305000,322000]},
  {name:'Search top-of-page %',color:GREEN,data:[44,46,48,49,51,53,54,56]},
] }
const AW_NVR = [{name:'New users',value:64,color:BLUE},{name:'Returning users',value:36,color:GREEN}]
const AW_ORGANIC = { x:AW_WK, series:[
  {name:'Brand impressions',color:GREEN,data:[12000,14500,16800,19200,22100,24800,27400,30200],area:true},
  {name:'Non-brand impressions',color:BLUE,data:[38000,41000,43500,46000,48800,51200,53600,56400],area:true},
] }

const C = {
  /* ---------------- OVERVIEW (ecommerce) ---------------- */
  'overview/ecom':{ sub:'Meta Ads + Google Ads + GA4 + Search Console · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Revenue','$312.4k','▲ 14.0%',true,true,SP.up),
      k('Ad spend','$65.6k','▲ 8.2%',true,true,SP.up),
      k('Blended ROAS','4.76x','▲ 0.4x',true,true,SP.up),
      k('AOV','$43.51','▲ 3.0%',true,true,SP.up),
      k('Conv. rate','5.59%','▼ 2.7%',false,false,SP.dn),
      k('CAC','$9.14','▼ 6.0%',true,true,SP.dn),
    ]},
    {type:'signatureFunnel',w:12,title:'Funnel overview',spend:'€870.12',
      steps:[{name:'Impressions',value:9598,p:'100%'},{name:'Clicks',value:954,p:'9.9%'},{name:'All conversions',value:155,p:'1.6%'},{name:'Conversions',value:143,p:'1.5%'},{name:'Value',value:8,p:'0.08%'}],
      side:[{label:'Avg. CPM',value:'€90.67',delta:'22%',up:true},{label:'Avg. CPC',value:'€0.91',delta:'18%',up:true},{label:'Cost / conv.',value:'€5.62',delta:'7%',up:true},{label:'Conversion rate',value:'0.79%'}],
      footer:'114.3% of previous month'},
    {type:'insight',w:12,tone:'good',icon:'auto_awesome',title:'AI summary',text:'Revenue is up 14% on just 8% more spend — efficiency is improving and blended ROAS held at 4.76x. The one watch-out: conversion rate slipped 2.7%, concentrated on mobile checkout. Recovering it is the biggest lever this period.'},
    lineSV(), donutDev(4),
    {type:'chart',kind:'funnel',title:'Purchase funnel',src:'GA4',w:6,steps:FUN_ECOM.steps,height:250},
    geoBlock(6),
    chanHbar(6,'Revenue by channel'), {type:'chart',kind:'bar',title:'Conversions by channel',w:6,x:CHAN,data:[78,52,40,30,24,17,11]},
    {type:'chart',kind:'heat',title:'Customer retention — weekly cohorts',src:'GA4 cohort exploration',w:12,height:236,...HEAT},
    {type:'insight',w:6,tone:'good',icon:'trending_up',title:'Footwear is carrying growth',text:'Footwear revenue is up 18% and holds the best category ROAS (6.4x). Shifting budget toward Summit Trail Boot creative should compound.'},
    {type:'insight',w:6,tone:'warn',icon:'remove_shopping_cart',title:'Cart abandonment is the leak',text:'62% of product viewers never add to cart, and mobile checkout completion (3.1%) lags desktop (7.9%). A one-page mobile checkout is the highest-ROI fix.'},
  ]},

  /* ---------------- OVERVIEW (lead-gen) ---------------- */
  'overview/lead':{ sub:'Meta Ads + Google Ads + GA4 + Search Console · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Total leads','2,180','▲ 12.4%',true,true,SP.up),
      k('Ad spend','$65.6k','▲ 8.2%',true,true,SP.up),
      k('Blended CPL','$30.10','▼ 6.0%',true,true,SP.dn),
      k('Cost / acquisition','$112','▼ 4.2%',true,true,SP.dn),
      k('Conv. rate','5.2%','▲ 0.4%',true,true,SP.up),
      k('Qualified rate','65%','▲ 3.0%',true,true,SP.up),
    ]},
    {type:'signatureFunnel',w:12,title:'Funnel overview',spend:'€20,940',
      steps:[{name:'Impressions',value:1640000,p:'100%'},{name:'Clicks',value:48200,p:'2.9%'},{name:'Leads',value:2180,p:'0.13%'},{name:'Qualified (MQL)',value:1420,p:'0.087%'},{name:'Customers',value:184,p:'0.011%'}],
      side:[{label:'Avg. CPM',value:'€12.77',delta:'9%',up:true},{label:'Avg. CPC',value:'€0.43',delta:'6%',up:false},{label:'Cost / lead',value:'€9.60',delta:'6%',up:false},{label:'Lead → customer',value:'8.4%'}],
      footer:'106% of previous month'},
    {type:'insight',w:12,tone:'good',icon:'auto_awesome',title:'AI summary',text:'Lead volume is up 12% while CPL dropped 6% to $30 — you are buying more, cheaper leads. Quality held too (65% qualified). Paid Search delivers the highest-quality leads; Paid Social is cheapest but converts lower.'},
    {type:'chart',kind:'line',title:'Leads vs ad spend',src:'GA4 + Ads',w:8,x:WK,series:[{name:'Leads',color:GREEN,data:[58,62,60,68,66,72,75,78],area:true},{name:'Spend ($k)',color:BLUE,data:SP.spend,area:true}]},
    {type:'chart',kind:'donut',title:'Leads by source',w:4,legend:true,height:150,data:[{name:'Paid Search',value:38,color:GREEN},{name:'Paid Social',value:31,color:BLUE},{name:'Organic',value:19,color:GREY},{name:'Other',value:12,color:'#5AAFF2'}]},
    {type:'chart',kind:'funnel',title:'Acquisition funnel',src:'GA4 + Meta',w:6,steps:FUN_LEAD_FULL.steps,height:250},
    {type:'chart',kind:'hbar',title:'Leads by channel',w:6,x:LCHAN,data:[820,640,310,210,110,90],color:GREEN},
    geoBlock(12,'Leads by country'),
  ]},

  /* ---------------- FUNNELS ---------------- */
  'funnels/builder':{ sub:'Build any path from your GA4 events — add or remove steps and the funnel updates live. Save it to reuse.', blocks:[
    {type:'builder',steps:['session_start','view_item','add_to_cart','begin_checkout','purchase']},
    {type:'chart',kind:'sankey',title:'User journey — channel → outcome',src:'Sankey',w:12,height:280,...SANKEY},
    {type:'kbreak',title:'By device',w:6,rows:[{k:'Desktop completion',v:'7.9%',s:'good'},{k:'Mobile completion',v:'3.1%',s:'bad'},{k:'Avg. time to purchase',v:'2d 4h'},{k:'Best channel',v:'Retargeting · 11.2%',s:'good'}]},
    {type:'chart',kind:'bar',title:'Conversions by channel',w:6,x:CHAN,data:[78,52,40,30,24,17,11]},
  ]},
  'funnels/ecommerce':{ sub:'Standard ecommerce purchase funnel.', blocks:[
    {type:'chart',kind:'funnel',title:'Ecommerce funnel',w:8,big:true,height:360,steps:FUN_ECOM.steps},
    {type:'leak',w:4,big:'View → Cart',text:'Largest drop-off is between product view and add-to-cart (62.2%).'},
    {type:'chart',kind:'sankey',title:'Journey',w:12,height:260,...SANKEY},
  ]},
  'funnels/lead':{ sub:'Lead-generation funnel from visit to qualified lead.', blocks:[
    {type:'chart',kind:'funnel',title:'Lead funnel',w:8,big:true,height:360,steps:FUN_LEAD.steps},
    {type:'leak',w:4,big:'Pricing → Form',text:'Most prospects view pricing but never open the form (58.7% drop).'},
    {type:'kbreak',title:'Lead quality',w:6,rows:[{k:'Marketing qualified',v:'1,420',s:'good'},{k:'Sales qualified',v:'612'},{k:'Cost per lead',v:'$30.10',s:'good'},{k:'Lead → customer',v:'8.4%'}]},
    {type:'chart',kind:'bar',title:'Leads by channel',w:6,x:CHAN,data:[640,520,310,180,140,90,60]},
  ]},
  'funnels/journeys':{ sub:'Where users come from and where they end up.', blocks:[
    {type:'chart',kind:'sankey',title:'Channel → outcome',w:12,height:340,...SANKEY},
    {type:'kbreak',title:'Top converting paths',w:6,rows:[{k:'Paid Social → Purchase',v:'3,200',s:'good'},{k:'Paid Search → Purchase',v:'2,600',s:'good'},{k:'Organic → Purchase',v:'1,380'},{k:'Multi-touch (3+)',v:'41%'}]},
    {type:'chart',kind:'bar',title:'Assisted conversions',w:6,x:CHAN,data:[420,380,260,120,300,90,40]},
  ]},
  'funnels/saved':{ sub:'Starter templates plus any funnels you save from the Builder.', blocks:[
    {type:'savedFunnels',w:12},
  ]},

  /* ---------------- ECOMMERCE · PRODUCTS ---------------- */
  'products/overview':{ sub:'SKU-level performance · revenue, units & product ROAS · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Units sold','6,465','▲ 12.0%',true,true,SP.up),
      k('Top product','$92.0k',null,null,true),
      k('Active products','248','+6',true,true,SP.up),
      k('Avg item revenue','$43.51','▲ 3.0%',true,true,SP.up),
      k('Product ROAS','4.9x','▲ 0.3x',true,true,SP.up),
      k('Return rate','3.1%','▼ 0.4%',true,true,SP.dn),
    ]},
    {type:'producttable',title:'Top products',src:'GA4 items + Ads',w:12,columns:PROD_COLS,rows:PRODUCTS},
    {type:'chart',kind:'hbar',title:'Top products by revenue',src:'GA4',w:7,x:PRODUCTS.map(p=>p.name),data:PRODUCTS.map(p=>p.rev_n),color:GREEN},
    {type:'chart',kind:'donut',title:'Revenue by category',w:5,legend:true,height:170,data:PROD_CAT},
    {type:'table',title:'Rising products',w:6,columns:[{k:'name',label:'Product'},{k:'rev',label:'Revenue',r:true},{k:'trend',label:'vs prev',r:true}],rows:[
      {name:'Merino Base Layer',rev:'$31,000',trend:'+22%',trend_s:'good'},{name:'Summit Trail Boot',rev:'$92,000',trend:'+18%',trend_s:'good'},{name:'Trailhead Daypack',rev:'$18,400',trend:'+15%',trend_s:'good'},{name:'Alpine Down Jacket',rev:'$78,400',trend:'+12%',trend_s:'good'},
    ]},
    {type:'table',title:'Falling products',w:6,columns:[{k:'name',label:'Product'},{k:'rev',label:'Revenue',r:true},{k:'trend',label:'vs prev',r:true}],rows:[
      {name:'Summit GPS Watch',rev:'$16,200',trend:'-12%',trend_s:'bad'},{name:'Glacier Shell Jacket',rev:'$22,800',trend:'-9%',trend_s:'bad'},{name:'Carbon Trek Poles',rev:'$26,000',trend:'-4%',trend_s:'bad'},
    ]},
  ]},
  'products/categories':{ sub:'Revenue & demand by collection', blocks:[
    {type:'chart',kind:'donut',title:'Revenue by category',w:5,legend:true,height:200,data:PROD_CAT},
    {type:'chart',kind:'bar',title:'Units by category',w:7,x:['Apparel','Footwear','Gear','Tech'],data:[2600,1975,1890,135]},
    {type:'table',title:'Category performance',w:12,columns:[{k:'name',label:'Category'},{k:'rev',label:'Revenue',r:true},{k:'units',label:'Units',r:true},{k:'share',label:'Rev share',r:true},{k:'roas',label:'ROAS',r:true},{k:'trend',label:'Trend',r:true}],rows:[
      {name:'Apparel',rev:'$132,200',units:'2,600',share:'42%',roas:'5.0x',roas_s:'good',trend:'+11%',trend_s:'good'},
      {name:'Footwear',rev:'$92,000',units:'1,975',share:'30%',roas:'6.4x',roas_s:'good',trend:'+18%',trend_s:'good'},
      {name:'Gear',rev:'$90,000',units:'1,890',share:'22%',roas:'4.2x',roas_s:'plain',trend:'+4%',trend_s:'good'},
      {name:'Tech',rev:'$16,200',units:'135',share:'6%',roas:'2.4x',roas_s:'bad',trend:'-12%',trend_s:'bad'},
    ]},
  ]},
  'products/shopping':{ sub:'Google Merchant Center — feed health & product status', blocks:[
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
    {type:'insight',icon:'inventory',tone:'bad',title:'Glacier Shell Jacket disapproved',text:'Price mismatch between feed (€60) and landing page. Fix the structured data price to restore Shopping eligibility.'},
  ]},
  'products/inventory':{ sub:'Stock health (requires store / Shopify connection)', blocks:[
    {type:'note',icon:'inventory',title:'Inventory needs a store connection',text:'Stock levels, days-of-cover and reorder points come from your ecommerce platform (Shopify / WooCommerce). The figures below are illustrative until the store is connected.'},
    {type:'table',title:'Stock & reorder',w:12,columns:[{k:'name',label:'Product'},{k:'stock',label:'In stock',r:true},{k:'cover',label:'Days of cover',r:true},{k:'velocity',label:'Units / day',r:true},{k:'status',label:'Status'}],rows:[
      {name:'Summit Trail Boot',stock:'1,240',cover:'19',velocity:'66',status:'Active'},
      {name:'Merino Base Layer',stock:'310',cover:'7',velocity:'44',cover_s:'bad',status:'Active'},
      {name:'Alpine Down Jacket',stock:'880',cover:'25',velocity:'35',status:'Active'},
      {name:'Summit GPS Watch',stock:'0',cover:'0',velocity:'5',cover_s:'bad',status:'Paused'},
    ]},
  ]},

  /* ---------------- ECOMMERCE · CUSTOMERS ---------------- */
  'customers/retention':{ sub:'New vs returning, repeat purchase & churn', blocks:[
    {type:'kpis',items:[
      k('Returning revenue','38%','▲ 2.0%',true,true,SP.up),
      k('Repeat purchase rate','27%','▲ 1.4%',true,true,SP.up),
      k('New customers','4,120','▲ 9.1%',true,true,SP.up),
      k('Returning customers','3,060','▲ 6.0%',true,true,SP.up),
      k('Avg orders / customer','1.6',null,null,null),
      k('Churn (90d)','58%','▼ 1.2%',true,true,SP.dn),
    ]},
    {type:'chart',kind:'line',title:'New vs returning revenue',src:'GA4',w:8,x:WK,series:[{name:'New',color:BLUE,data:[112,120,116,132,128,140,146,152],area:true},{name:'Returning',color:GREEN,data:[70,85,82,98,95,108,114,120],area:true}]},
    {type:'chart',kind:'donut',title:'Revenue split',w:4,legend:true,height:150,data:[{name:'Returning',value:38,color:GREEN},{name:'New',value:62,color:BLUE}]},
    {type:'chart',kind:'heat',title:'Customer retention — weekly cohorts',src:'GA4',w:12,height:236,...HEAT},
  ]},
  'customers/cohorts':{ sub:'Monthly acquisition cohorts — retention, revenue & repeat behaviour', blocks:[
    {type:'kpis',items:[
      k('Avg cohort size','1,080','▲ 6.0%',true,true,SP.up),
      k('M1 retention','49%','▲ 2.0%',true,true,SP.up),
      k('M3 retention','34%','▲ 1.4%',true,true,SP.up),
      k('M5 retention','26%','▲ 1.0%',true,true,SP.up),
      k('Best cohort','March',null,null,true),
      k('Repeat rate','27%','▲ 1.4%',true,true,SP.up),
    ]},
    {type:'chart',kind:'heat',title:'Retention by monthly cohort',src:'GA4 cohort exploration',w:12,height:260,...MCOHORT},
    {type:'chart',kind:'line',title:'Cumulative LTV by cohort',src:'GA4 + store',w:6,x:MCOHORT.xLabels,series:[
      {name:'Jan cohort',color:GREEN,data:[48,71,89,104,116,127],area:true},
      {name:'Feb cohort',color:BLUE,data:[50,72,90,106,118,129]},
      {name:'Mar cohort',color:'#5AAFF2',data:[52,78,98,118,131,141]},
    ]},
    {type:'chart',kind:'line',title:'Retention curve by acquisition channel',src:'GA4',w:6,x:MCOHORT.xLabels,series:[
      {name:'Email',color:GREEN,data:[100,58,46,39,34,31]},
      {name:'Organic',color:GREY,data:[100,52,41,35,30,27]},
      {name:'Paid Search',color:BLUE,data:[100,49,38,32,28,25]},
      {name:'Paid Social',color:'#5AAFF2',data:[100,44,33,27,23,20]},
    ]},
    {type:'chart',kind:'bar',title:'Cohort size by month',w:6,x:MCOHORT.yLabels,data:[980,1020,1240,1080,1160,1010]},
    {type:'chart',kind:'line',title:'Repeat-purchase curve',w:6,x:['Order 1','2','3','4','5','6'],series:[{name:'% who reorder',color:GREEN,data:[100,27,14,9,6,4],area:true}]},
    {type:'table',title:'Cohort detail',src:'GA4 + store',w:12,columns:[{k:'name',label:'Cohort'},{k:'size',label:'Customers',r:true},{k:'m1',label:'M1',r:true},{k:'m3',label:'M3',r:true},{k:'m5',label:'M5',r:true},{k:'ltv',label:'LTV',r:true},{k:'repeat',label:'Repeat rate',r:true}],rows:[
      {name:'January',size:'980',m1:'48%',m3:'33%',m5:'26%',ltv:'$127',repeat:'26%'},
      {name:'February',size:'1,020',m1:'46%',m3:'31%',m5:'—',ltv:'$129',repeat:'24%'},
      {name:'March',size:'1,240',m1:'51%',m1_s:'good',m3:'35%',m3_s:'good',m5:'—',ltv:'$141',ltv_s:'good',repeat:'29%',repeat_s:'good'},
      {name:'April',size:'1,080',m1:'49%',m3:'—',m5:'—',ltv:'$104',repeat:'22%'},
      {name:'May',size:'1,160',m1:'53%',m1_s:'good',m3:'—',m5:'—',ltv:'$82',repeat:'—'},
      {name:'June',size:'1,010',m1:'—',m3:'—',m5:'—',ltv:'—',repeat:'—'},
    ]},
  ]},
  'customers/ltv':{ sub:'Lifetime value & acquisition economics', blocks:[
    {type:'note',icon:'savings',title:'LTV uses blended store + ad data',text:'LTV and payback combine ecommerce revenue (GA4 / store) with ad spend (Meta + Ads). Connect the store for exact margin-based LTV.'},
    {type:'kpis',items:[
      k('Customer LTV','$118','▲ 5.0%',true,true,SP.up),
      k('CAC','$28.40','▼ 4.2%',true,true,SP.dn),
      k('LTV : CAC','4.2 : 1',null,true,true),
      k('Payback','1.4 mo',null,true,true),
    ]},
    {type:'chart',kind:'bar',title:'LTV by acquisition channel',w:6,x:['Email','Organic','Paid Social','Paid Search','Direct'],data:[164,142,118,104,96]},
    {type:'chart',kind:'bar',title:'CAC by channel',w:6,x:['Organic','Email','Paid Search','Paid Social','Direct'],data:[6,12,31,34,9]},
  ]},

  /* ---------------- LEAD-GEN · LEADS ---------------- */
  'leads/overview':{ sub:'Lead volume, cost & quality · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Total leads','2,180','▲ 12.4%',true,true,SP.up),
      k('Cost per lead','$30.10','▼ 6.0%',true,true,SP.dn),
      k('Cost / acquisition','$112','▼ 4.2%',true,true,SP.dn),
      k('Conv. rate','5.2%','▲ 0.4%',true,true,SP.up),
      k('Qualified rate','65%','▲ 3.0%',true,true,SP.up),
      k('Lead → customer','8.4%','▲ 0.6%',true,true,SP.up),
    ]},
    {type:'chart',kind:'line',title:'Leads over time',src:'GA4',w:8,x:WK,series:[{name:'Leads',color:GREEN,data:[58,62,60,68,66,72,75,78],area:true}]},
    {type:'chart',kind:'hbar',title:'Leads by channel',w:4,x:LCHAN,data:[820,640,310,210,110,90],color:GREEN},
    {type:'table',title:'Top landing pages',src:'GA4',w:12,columns:[{k:'name',label:'Landing page'},{k:'sessions',label:'Sessions',r:true},{k:'leads',label:'Leads',r:true},{k:'cr',label:'Conv. rate',r:true},{k:'cpl',label:'CPL',r:true}],rows:[
      {name:'/free-consultation',sessions:'14,200',leads:'820',cr:'5.8%',cr_s:'good',cpl:'$24',cpl_s:'good'},
      {name:'/services/personal-injury',sessions:'9,800',leads:'540',cr:'5.5%',cr_s:'good',cpl:'$28',cpl_s:'good'},
      {name:'/contact',sessions:'7,100',leads:'310',cr:'4.4%',cr_s:'plain',cpl:'$36',cpl_s:'plain'},
      {name:'/landing/google-ads',sessions:'6,400',leads:'410',cr:'6.4%',cr_s:'good',cpl:'$22',cpl_s:'good'},
      {name:'/blog/do-i-have-a-case',sessions:'5,200',leads:'100',cr:'1.9%',cr_s:'bad',cpl:'$74',cpl_s:'bad'},
    ]},
  ]},
  'leads/funnel':{ sub:'Impression → click → lead → qualified → customer', blocks:[
    {type:'chart',kind:'funnel',title:'Acquisition funnel',src:'GA4 + Meta',w:8,big:true,height:360,steps:FUN_LEAD_FULL.steps},
    {type:'leak',w:4,big:'Click → Lead',text:'95.5% of clicks never become a lead — landing-page and form experience is the single biggest lever.'},
    {type:'kbreak',title:'Stage conversion',w:6,rows:[{k:'Impr → Click (CTR)',v:'2.9%'},{k:'Click → Lead',v:'4.5%',s:'plain'},{k:'Lead → Qualified',v:'65.1%',s:'good'},{k:'Qualified → Customer',v:'13.0%',s:'good'}]},
    {type:'chart',kind:'bar',title:'Volume by stage',w:6,x:['Impr.','Clicks','Leads','Qualified','Customers'],data:[100,2.9,0.13,0.087,0.011]},
  ]},
  'leads/channels':{ sub:'Which channels bring cheap — and good — leads', blocks:[
    {type:'table',title:'Channel performance',src:'GA4 + Ads',w:12,columns:[{k:'name',label:'Channel'},{k:'sessions',label:'Sessions',r:true},{k:'leads',label:'Leads',r:true},{k:'cr',label:'Conv. rate',r:true},{k:'cpl',label:'CPL',r:true},{k:'sql',label:'Qualified %',r:true}],rows:[
      {name:'Paid Search',sessions:'31,400',leads:'820',cr:'2.6%',cr_s:'plain',cpl:'$28',cpl_s:'good',sql:'71%',sql_s:'good'},
      {name:'Paid Social',sessions:'24,800',leads:'640',cr:'2.6%',cr_s:'plain',cpl:'$22',cpl_s:'good',sql:'54%',sql_s:'plain'},
      {name:'Organic',sessions:'28,100',leads:'310',cr:'1.1%',cr_s:'bad',cpl:'—',sql:'78%',sql_s:'good'},
      {name:'Email',sessions:'8,900',leads:'210',cr:'2.4%',cr_s:'plain',cpl:'$9',cpl_s:'good',sql:'69%',sql_s:'good'},
      {name:'Referral',sessions:'4,200',leads:'110',cr:'2.6%',cr_s:'plain',cpl:'—',sql:'82%',sql_s:'good'},
    ]},
    {type:'chart',kind:'hbar',title:'CPL by channel',w:6,x:['Email','Paid Social','Paid Search'],data:[9,22,28],color:GREEN},
    {type:'chart',kind:'hbar',title:'Qualified % by channel',w:6,x:['Referral','Organic','Paid Search','Email','Paid Social'],data:[82,78,71,69,54]},
  ]},
  'leads/quality':{ sub:'Lead quality & pipeline (requires CRM connection)', blocks:[
    {type:'note',icon:'verified',title:'Quality metrics need a CRM',text:'MQL / SQL, pipeline value and closed revenue come from your CRM (HubSpot / Salesforce / Pipedrive). GA4 + Meta measure lead volume and cost; quality below is shown once CRM is connected.'},
    {type:'kpis',items:[
      k('MQL','1,420','▲ 8.0%',true,true,SP.up),
      k('SQL','612','▲ 5.0%',true,true,SP.up),
      k('Qualified rate','65%','▲ 3.0%',true,true,SP.up),
      k('Lead → customer','8.4%','▲ 0.6%',true,true,SP.up),
      k('Pipeline value','$1.2M','▲ 11%',true,true,SP.up),
    ]},
    {type:'chart',kind:'bar',title:'Qualified leads by channel',w:6,x:['Paid Search','Paid Social','Organic','Email','Referral'],data:[582,346,242,145,90]},
    {type:'table',title:'Quality by channel',w:6,columns:[{k:'name',label:'Channel'},{k:'leads',label:'Leads',r:true},{k:'mql',label:'MQL',r:true},{k:'close',label:'Close rate',r:true}],rows:[
      {name:'Paid Search',leads:'820',mql:'582',close:'11.2%',close_s:'good'},
      {name:'Paid Social',leads:'640',mql:'346',close:'6.1%',close_s:'plain'},
      {name:'Email',leads:'210',mql:'145',close:'14.0%',close_s:'good'},
      {name:'Organic',leads:'310',mql:'242',close:'9.4%',close_s:'good'},
    ]},
  ]},

  /* ---------------- LEAD-GEN · WEBINAR ---------------- */
  'webinar/overview':{ sub:'Zoom / webinar registration & attendance', blocks:[
    {type:'kpis',w:12,items:[k('Registered','1,240','+16%',true,true,null),k('Attended','512','+9%',true,true,null),k('Attendance rate','41%','+2%',true,true,null),k('Avg. time on webinar','38m','+4m',true,true,null)]},
    {type:'chart',kind:'donut',title:'Registration vs Attendance',src:'Zoom',w:5,legend:true,height:160,data:[{name:'Attended',value:41,color:GREEN},{name:'No-show',value:59,color:'#3a4f7a'}]},
    {type:'chart',kind:'line',title:'Time-on-webinar distribution',src:'Zoom',w:7,x:['0-10m','10-20m','20-30m','30-40m','40-50m','50m+'],series:[{name:'Attendees',color:BLUE,data:[88,96,110,124,72,22],area:true}]},
  ]},
  'webinar/attendance':{ sub:'Attendance ratio & drop-off', blocks:[
    {type:'chart',kind:'donut',title:'Attendance ratio',w:5,legend:true,height:160,data:[{name:'Attended',value:41,color:GREEN},{name:'No-show',value:59,color:'#3a4f7a'}]},
    {type:'chart',kind:'hbar',title:'Registrations by source',w:7,x:['LinkedIn Ads','Email','Google Ads','Organic','Partner'],data:[420,360,240,140,80],color:GREEN},
  ]},
  'webinar/funnel':{ sub:'Ads → Registration → Attended → SQL → Conversion', blocks:[
    {type:'signatureFunnel',w:12,title:'Webinar funnel',spend:'€2,140',
      steps:[{name:'Impressions',value:184000,p:'100%'},{name:'Reg. page views',value:9600,p:'5.2%'},{name:'Registered',value:1240,p:'0.67%'},{name:'Attended',value:512,p:'0.28%'},{name:'SQL',value:96,p:'0.05%'},{name:'Conversion',value:24,p:'0.013%'}],
      side:[{label:'Cost / registrant',value:'€1.73',delta:'8%',up:false},{label:'Attendance rate',value:'41%',delta:'2%',up:true},{label:'Reg → SQL',value:'7.7%'},{label:'Cost / SQL',value:'€22.30',delta:'5%',up:false}],
      footer:'108% of previous webinar'},
  ]},

  /* ---------------- GA4 ---------------- */
  'ga4/overview':{ sub:'Users, sessions, engagement & conversions', blocks:[
    {type:'kpis',items:[
      k('Total users','80,633','▲ 18.0%',true,true,SP.up),k('Sessions','109,794','▲ 15.2%',true,true,SP.up),
      k('Engagement rate','61.4%','▲ 3.1%',true,true,SP.up),k('Avg. session','2m 56s','▼ 1.0%',false,false,SP.dn),
      k('Key events','12,904','▲ 9.4%',true,true,SP.up),k('Conv. value','$312k','▲ 14%',true,true,SP.up),
    ]},
    {type:'chart',kind:'line',title:'Users & sessions over time',src:'GA4',w:8,x:WK,series:[{name:'Sessions',color:BLUE,data:[88,96,92,104,99,112,118,122],area:true},{name:'Users',color:GREEN,data:[64,70,68,77,73,82,85,88],area:true}]},
    donutDev(4), geoBlock(6,'Users by country'), chanHbar(6,'Sessions by channel'),
    {type:'chart',kind:'scatter',title:'Product performance (CVR × revenue × spend)',src:'GA4',w:6,points:[[10.0,92000,1840],[8.1,78400,980],[7.8,45600,760],[16.3,31000,1240],[9.6,26000,520],[6.1,22800,380],[12.4,18400,610],[3.6,16200,135]]},
  ]},
  'ga4/realtime':{ sub:'Activity in the last 30 minutes', blocks:[
    {type:'kpis',items:[k('Active users now','438','▲ live',true,true,SP.up),k('Views / min','1,204',null,null,null),k('Top channel','Paid Social',null,null,null),k('Conversions (30m)','37','▲',true,true,SP.up)]},
    {type:'chart',kind:'bar',title:'Active users per minute',w:8,x:Array.from({length:30},(_,i)=>i%5?'':`-${30-i}m`),data:[12,14,11,15,18,16,19,17,22,20,18,24,21,19,23,26,22,25,28,24,20,27,29,31,28,26,30,33,29,35]},
    donutDev(4), {type:'table',title:'Top pages right now',w:12,columns:[{k:'name',label:'Page'},{k:'users',label:'Active users',r:true},{k:'views',label:'Views',r:true}],rows:[
      {name:'/products/trail-boots',users:'84',views:'212'},{name:'/',users:'66',views:'180'},{name:'/collections/new',users:'41',views:'120'},{name:'/cart',users:'29',views:'77'},{name:'/checkout',users:'18',views:'44'},
    ]},
  ]},
  'ga4/acquisition':{ sub:'How users find your site', blocks:[
    {type:'kpis',items:[k('New users','41,208','▲ 12%',true,true,SP.up),k('Sessions','109,794','▲ 15%',true,true,SP.up),k('Engaged sessions','67,420','▲ 9%',true,true,SP.up),k('Avg. engagement','1m 48s',null,null,null)]},
    chanHbar(6,'Sessions by default channel group'),
    {type:'chart',kind:'line',title:'New vs returning',w:6,x:WK,series:[{name:'New',color:GREEN,data:[28,31,30,34,33,37,38,41]},{name:'Returning',color:BLUE,data:[36,39,38,42,41,45,47,49]}]},
    {type:'table',title:'Top source / medium',w:12,columns:[{k:'name',label:'Source / medium'},{k:'users',label:'Users',r:true},{k:'sessions',label:'Sessions',r:true},{k:'er',label:'Engagement rate',r:true},{k:'conv',label:'Key events',r:true}],rows:[
      {name:'google / organic',users:'24,100',sessions:'31,400',er:'64.2%',er_s:'good',conv:'3,210'},
      {name:'facebook / cpc',users:'18,900',sessions:'24,800',er:'58.1%',er_s:'plain',conv:'2,940'},
      {name:'google / cpc',users:'14,600',sessions:'19,100',er:'61.0%',er_s:'good',conv:'2,510'},
      {name:'(direct) / (none)',users:'11,200',sessions:'14,300',er:'52.4%',er_s:'plain',conv:'1,180'},
      {name:'newsletter / email',users:'6,400',sessions:'8,900',er:'70.3%',er_s:'good',conv:'1,460'},
    ]},
  ]},
  'ga4/engagement':{ sub:'What users do on your site', blocks:[
    {type:'kpis',items:[k('Views','241,900','▲ 10%',true,true,SP.up),k('Event count','512,400','▲ 8%',true,true,SP.up),k('Events / user','6.4',null,null,null),k('Avg. engagement time','2m 56s','▼ 1%',false,false,SP.dn)]},
    {type:'table',title:'Pages & screens',w:7,columns:[{k:'name',label:'Page path'},{k:'views',label:'Views',r:true},{k:'users',label:'Users',r:true},{k:'time',label:'Avg. time',r:true}],rows:[
      {name:'/',views:'62,100',users:'48,200',time:'1m 12s'},{name:'/products/trail-boots',views:'31,400',users:'24,800',time:'2m 40s'},{name:'/collections/new',views:'22,900',users:'18,100',time:'1m 55s'},{name:'/cart',views:'14,600',users:'11,900',time:'3m 02s'},{name:'/blog/best-hikes',views:'9,800',users:'8,400',time:'4m 18s'},
    ]},
    {type:'chart',kind:'bar',title:'Top events',w:5,x:['page_view','view_item','scroll','add_to_cart','begin_checkout','purchase'],data:[241,140,98,52,28,18]},
  ]},
  'ga4/funnels':{ sub:'GA4 funnel exploration', blocks:[
    {type:'builder',steps:['session_start','view_item','add_to_cart','begin_checkout','purchase']},
    {type:'chart',kind:'funnel',title:'Funnel exploration',w:8,big:true,height:340,steps:FUN_ECOM.steps},
    {type:'leak',w:4,big:'View → Cart',text:'62.2% drop between product view and add-to-cart.'},
    {type:'chart',kind:'sankey',title:'Path exploration',w:12,height:260,...SANKEY},
  ]},
  'ga4/conversions':{ sub:'Key events & conversions', blocks:[
    {type:'kpis',items:[k('Key events','12,904','▲ 9%',true,true,SP.up),k('Conversion rate','5.59%','▼ 2.7%',false,false,SP.dn),k('Conv. value','$312k','▲ 14%',true,true,SP.up),k('Value / session','$2.84',null,null,null)]},
    {type:'chart',kind:'bar',title:'Key events by name',w:6,x:['purchase','generate_lead','sign_up','add_to_cart','contact','download'],data:[7180,2180,1640,9200,820,540]},
    {type:'chart',kind:'line',title:'Conversions over time',w:6,x:WK,series:[{name:'Conversions',color:GREEN,data:[5,5.4,5.2,6,6.3,6.1,6.8,7.18],area:true}]},
    {type:'table',title:'Conversions by channel',w:12,columns:[{k:'name',label:'Channel'},{k:'conv',label:'Conversions',r:true},{k:'cr',label:'Conv. rate',r:true},{k:'val',label:'Value',r:true}],rows:[
      {name:'Paid Social',conv:'2,940',cr:'5.9%',cr_s:'good',val:'$128k'},{name:'Paid Search',conv:'2,510',cr:'6.1%',cr_s:'good',val:'$112k'},{name:'Organic Search',conv:'3,210',cr:'4.8%',cr_s:'plain',val:'$96k'},{name:'Email',conv:'1,460',cr:'7.2%',cr_s:'good',val:'$54k'},{name:'Direct',conv:'1,180',cr:'4.1%',cr_s:'bad',val:'$38k'},
    ]},
    {type:'table',w:12,title:'In-page action events',columns:[{k:'ev',label:'Event'},{k:'count',label:'Count',r:true},{k:'rate',label:'Per session',r:true},{k:'val',label:'Value',r:true}],rows:[
      {ev:'form_start',count:'4,820',rate:'3.8%',val:'—'},
      {ev:'form_submit',count:'2,180',rate:'1.7%',val:'€96 CPL'},
      {ev:'product_view',count:'74,900',rate:'58.3%',val:'—'},
      {ev:'add_to_cart',count:'28,310',rate:'22.0%',val:'—'},
      {ev:'begin_checkout',count:'12,640',rate:'9.8%',val:'—'},
      {ev:'purchase',count:'7,180',rate:'5.6%',val:'€128,400'},
      {ev:'button_click (book demo)',count:'1,920',rate:'1.5%',val:'—'},
      {ev:'calendar_start',count:'860',rate:'0.7%',val:'—'},
      {ev:'calendar_submit',count:'412',rate:'0.3%',val:'€22.30 CPL'},
    ]},
  ]},
  'ga4/monetization':{ sub:'Ecommerce revenue & products', blocks:[
    {type:'kpis',items:[k('Total revenue','$312.4k','▲ 14%',true,true,SP.up),k('Purchases','7,180','▲ 11%',true,true,SP.up),k('AOV','$43.51','▲ 3%',true,true,SP.up),k('Purchaser rate','41.2%','▲ 1.4%',true,true,SP.up),k('Refunds','$4.1k','▼ 8%',true,true,SP.dn),k('Items / order','2.3',null,null,null)]},
    {type:'chart',kind:'line',title:'Revenue over time',w:8,x:WK,series:[{name:'Revenue',color:GREEN,data:SP.rev,area:true}]},
    {type:'chart',kind:'donut',title:'Revenue by category',w:4,legend:true,height:150,data:[{name:'Footwear',value:48,color:GREEN},{name:'Apparel',value:34,color:BLUE},{name:'Gear',value:18,color:GREY}]},
    {type:'table',title:'Top products',w:12,columns:[{k:'name',label:'Item'},{k:'views',label:'Views',r:true},{k:'cart',label:'Add to cart',r:true},{k:'qty',label:'Purchased',r:true},{k:'rev',label:'Revenue',r:true}],rows:[
      {name:'Summit Trail Boot',views:'18,400',cart:'4,200',qty:'1,840',rev:'$92,000',rev_s:'good'},{name:'Alpine Down Jacket',views:'12,100',cart:'2,900',qty:'980',rev:'$78,400',rev_s:'good'},{name:'Trek 40L Backpack',views:'9,800',cart:'2,100',qty:'760',rev:'$45,600'},{name:'Merino Base Layer',views:'7,600',cart:'1,800',qty:'1,240',rev:'$31,000'},{name:'Carbon Trek Poles',views:'5,400',cart:'1,100',qty:'520',rev:'$26,000'},
    ]},
  ]},
  'ga4/retention':{ sub:'How users come back over time', blocks:[
    {type:'kpis',items:[k('Day-1 retention','42%','▲ 2%',true,true,SP.up),k('Day-7 retention','19%','▲ 1%',true,true,SP.up),k('Returning users','39,400','▲ 6%',true,true,SP.up),k('DAU / MAU','11.3%',null,null,null)]},
    {type:'chart',kind:'heat',title:'Weekly cohort retention',src:'GA4',w:12,height:240,...HEAT},
    {type:'chart',kind:'line',title:'Retention curve',w:12,x:['Day 0','1','2','3','4','5','6','7'],series:[{name:'Retention',color:GREEN,data:[100,42,31,26,22,20,18,17],area:true}]},
  ]},
  'ga4/demographics':{ sub:'Who your users are', blocks:[
    {type:'kpis',items:[k('Top country','United States',null,null,null),k('Top age','25-34',null,null,null),k('Top language','en-US',null,null,null),k('Top interest','Outdoor gear',null,null,null)]},
    geoBlock(7,'Users by country'),
    {type:'chart',kind:'donut',title:'Gender',w:5,legend:true,height:150,data:[{name:'Female',value:54,color:GREEN},{name:'Male',value:43,color:BLUE},{name:'Unknown',value:3,color:GREY}]},
    {type:'chart',kind:'bar',title:'Users by age',w:6,x:AGE,data:[14,38,24,12,8,4]},
    {type:'chart',kind:'hbar',title:'Top interests',w:6,x:['Outdoor gear','Travel','Fitness','Camping','Photography','Running'],data:[42,31,24,18,12,9]},
    {type:'chart',kind:'hbar',title:'Top cities',w:6,x:['Athens','Thessaloniki','Patras','Heraklion','Larissa','London'],data:[2280,556,317,260,232,901],color:GREEN},
    {type:'chart',kind:'donut',title:'Economic status (proxy)',w:6,legend:true,height:150,data:[{name:'Top 10%',value:18,color:GREEN},{name:'Mid 40%',value:52,color:BLUE},{name:'Lower 50%',value:30,color:GREY}]},
  ]},
  'ga4/tech':{ sub:'Devices, browsers & platforms', blocks:[
    {type:'kpis',items:[k('Top device','Desktop · 62%',null,null,null),k('Top browser','Chrome · 68%',null,null,null),k('Top OS','Windows · 41%',null,null,null),k('Crash-free rate','99.4%',null,true,true)]},
    donutDev(4),
    {type:'chart',kind:'bar',title:'Sessions by browser',w:8,x:['Chrome','Safari','Edge','Firefox','Samsung','Other'],data:[68,18,7,4,2,1]},
    {type:'table',title:'Operating systems',w:12,columns:[{k:'name',label:'OS'},{k:'users',label:'Users',r:true},{k:'sessions',label:'Sessions',r:true},{k:'er',label:'Engagement',r:true}],rows:[
      {name:'Windows',users:'33,100',sessions:'45,000',er:'60%'},{name:'iOS',users:'19,400',sessions:'26,100',er:'63%'},{name:'Android',users:'15,800',sessions:'21,300',er:'57%'},{name:'macOS',users:'9,600',sessions:'12,900',er:'66%'},{name:'Linux',users:'2,700',sessions:'4,500',er:'59%'},
    ]},
  ]},
  'ga4/explore':{ sub:'Build a custom report from any dimensions & metrics', blocks:[
    {type:'explore',w:12},
  ]},

  /* ---------------- GOOGLE ADS ---------------- */
  'ads/overview':{ sub:'Spend, clicks, conversions & ROAS', blocks:[
    {type:'kpis',items:[k('Spend','$27.1k','▲ 6.1%',true,true,SP.up),k('Impressions','1.9M','▲ 4%',true,true,SP.up),k('CTR','3.42%','▲ 0.3%',true,true,SP.up),k('Avg. CPC','$0.74','▼ 5%',true,true,SP.dn),k('Conversions','2,410','▲ 8%',true,true,SP.up),k('ROAS','5.2x','▲ 0.3x',true,true,SP.up)]},
    {type:'chart',kind:'gauge',title:'Shopping ROAS vs goal',src:'Google Ads',w:4,value:4.8,max:8,goal:4.0,unit:'x'},
    {type:'kpis',w:8,items:[k('Conversion value','€128,400','+14%',true,true,null),k('Cost / sale','€11.40','-6%',false,true,null),k('Shopping clicks','18,420','+9%',true,true,null),k('ROAS','4.8x','+0.4',true,true,null)]},
    {type:'chart',kind:'line',title:'Spend vs conversions',w:8,x:WK,series:[{name:'Conversions',color:GREEN,data:[280,300,290,330,320,360,380,402],area:true},{name:'Spend ($)',color:BLUE,data:[3.1,3.4,3.3,3.8,3.6,4.0,4.2,4.4]}]},
    {type:'chart',kind:'donut',title:'Spend by campaign type',w:4,legend:true,height:150,data:[{name:'Search',value:52,color:GREEN},{name:'Shopping',value:31,color:BLUE},{name:'PMax',value:17,color:GREY}]},
    geoBlock(12,'Conversions by country'),
  ]},
  'ads/campaigns':{ sub:'6 campaigns · click a row to drill into ad groups & ads', pills:[['campaign','6','Campaigns','var(--blue2)'],['play_circle','5','Active','var(--green)'],['pause_circle','1','Paused','var(--muted)'],['warning','1','Off target','var(--red)']], blocks:[
    {type:'campaignTree',w:12,setLabel:'Ad groups',columns:ADS_TREE_COLS,rows:ADS_CAMPAIGNS},
  ]},
  'ads/adgroups':{ sub:'Ad groups & ads', blocks:[
    {type:'table',title:'Ad groups',w:12,columns:[{k:'name',label:'Ad group'},{k:'camp',label:'Campaign'},{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'conv',label:'Conv.',r:true},{k:'cpa',label:'CPA',r:true}],rows:[
      {name:'Trail boots',camp:'Shopping',spend:'$3,120',ctr:'2.4%',ctr_s:'plain',conv:'280',cpa:'$11.1',cpa_s:'good'},{name:'Down jackets',camp:'Shopping',spend:'$2,480',ctr:'2.0%',ctr_s:'plain',conv:'190',cpa:'$13.0',cpa_s:'plain'},{name:'Brand terms',camp:'Brand',spend:'$3,210',ctr:'8.4%',ctr_s:'good',conv:'640',cpa:'$5.0',cpa_s:'good'},{name:'Hiking gear',camp:'Non-brand',spend:'$2,900',ctr:'3.1%',ctr_s:'good',conv:'210',cpa:'$13.8',cpa_s:'plain'},
    ]},
  ]},
  'ads/keywords':{ sub:'Keywords & search terms', blocks:[
    {type:'table',title:'Top keywords',w:7,columns:[{k:'name',label:'Keyword'},{k:'clicks',label:'Clicks',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpc',label:'CPC',r:true},{k:'conv',label:'Conv.',r:true}],rows:[
      {name:'trail running shoes',clicks:'4,200',ctr:'5.1%',ctr_s:'good',cpc:'$0.88',conv:'310'},{name:'waterproof hiking boots',clicks:'3,100',ctr:'4.4%',ctr_s:'good',cpc:'$1.02',conv:'240'},{name:'down jacket sale',clicks:'2,400',ctr:'6.2%',ctr_s:'good',cpc:'$0.74',conv:'180'},{name:'camping backpack',clicks:'1,900',ctr:'3.0%',ctr_s:'plain',cpc:'$0.66',conv:'110'},
    ]},
    {type:'chart',kind:'hbar',title:'Search impression share',w:5,x:['Brand','Trail boots','Jackets','Backpacks','Poles'],data:[92,64,58,41,33]},
  ]},
  'ads/funnel':{ sub:'Impression to conversion funnel', blocks:[
    {type:'chart',kind:'funnel',title:'Ads conversion funnel',w:8,big:true,height:340,steps:[{name:'Impressions',value:1900000,p:'100%'},{name:'Clicks',value:65000,p:'3.4%'},{name:'Landing page view',value:58200,p:'3.1%'},{name:'Add to cart',value:9800,p:'0.5%'},{name:'Conversion',value:2410,p:'0.13%'}]},
    {type:'leak',w:4,big:'Click → Cart',text:'Only 15% of clicks reach add-to-cart — landing page experience is the bottleneck.'},
  ]},
  'ads/audiences':{ sub:'Audience performance', blocks:[
    {type:'table',title:'Audiences',w:7,columns:[{k:'name',label:'Audience'},{k:'conv',label:'Conv.',r:true},{k:'cpa',label:'CPA',r:true},{k:'roas',label:'ROAS',r:true}],rows:[
      {name:'In-market: Outdoor',conv:'620',cpa:'$9.1',cpa_s:'good',roas:'6.2x',roas_s:'good'},{name:'Remarketing 30d',conv:'480',cpa:'$6.4',cpa_s:'good',roas:'8.1x',roas_s:'good'},{name:'Similar: Purchasers',conv:'310',cpa:'$12.8',cpa_s:'plain',roas:'4.1x',roas_s:'plain'},{name:'Affinity: Fitness',conv:'140',cpa:'$18.2',cpa_s:'bad',roas:'2.4x',roas_s:'bad'},
    ]},
    {type:'chart',kind:'bar',title:'Conversions by audience',w:5,x:['In-market','Remarket','Similar','Affinity'],data:[620,480,310,140]},
  ]},
  'ads/geo':{ sub:'Devices & geography', blocks:[
    geoBlock(7,'Conversions by country'), donutDev(5),
    {type:'table',title:'Performance by device',w:12,columns:[{k:'name',label:'Device'},{k:'spend',label:'Spend',r:true},{k:'conv',label:'Conv.',r:true},{k:'cpa',label:'CPA',r:true},{k:'roas',label:'ROAS',r:true}],rows:[
      {name:'Mobile',spend:'$14,200',conv:'1,180',cpa:'$12.0',cpa_s:'plain',roas:'4.4x',roas_s:'plain'},{name:'Desktop',spend:'$10,400',conv:'1,090',cpa:'$9.5',cpa_s:'good',roas:'6.1x',roas_s:'good'},{name:'Tablet',spend:'$2,500',conv:'140',cpa:'$17.9',cpa_s:'bad',roas:'2.8x',roas_s:'bad'},
    ]},
  ]},

  /* ---------------- SEARCH CONSOLE ---------------- */
  'search/overview':{ sub:'Organic clicks, impressions & position', blocks:[
    {type:'kpis',items:[k('Clicks','48,210','▲ 12%',true,true,SP.up),k('Impressions','1.4M','▲ 9%',true,true,SP.up),k('Avg. CTR','3.44%','▲ 0.2%',true,true,SP.up),k('Avg. position','8.3','▲ 1.1',true,true,SP.dn)]},
    {type:'chart',kind:'line',title:'Clicks & impressions',w:8,x:WK,series:[{name:'Impressions (k)',color:BLUE,data:[160,172,168,184,176,192,200,210],area:true},{name:'Clicks (k)',color:GREEN,data:[5.6,6.0,5.9,6.4,6.1,6.8,7.0,7.4],area:true}]},
    {type:'chart',kind:'donut',title:'Clicks by device',w:4,legend:true,height:150,data:DEV},
    {type:'table',title:'Top queries',w:12,columns:[{k:'name',label:'Query'},{k:'clicks',label:'Clicks',r:true},{k:'impr',label:'Impr.',r:true},{k:'ctr',label:'CTR',r:true},{k:'pos',label:'Position',r:true}],rows:[
      {name:'trail running shoes',clicks:'4,820',impr:'92k',ctr:'5.2%',ctr_s:'good',pos:'4.1'},{name:'best hiking boots',clicks:'3,610',impr:'120k',ctr:'3.0%',ctr_s:'plain',pos:'6.8'},{name:'waterproof jacket',clicks:'2,940',impr:'78k',ctr:'3.8%',ctr_s:'good',pos:'5.2'},{name:'camping checklist',clicks:'2,110',impr:'140k',ctr:'1.5%',ctr_s:'bad',pos:'11.4'},
    ]},
  ]},
  'search/queries':{ sub:'What people search to find you', blocks:[
    {type:'table',title:'Queries',w:7,columns:[{k:'name',label:'Query'},{k:'clicks',label:'Clicks',r:true},{k:'ctr',label:'CTR',r:true},{k:'pos',label:'Position',r:true}],rows:[
      {name:'trail running shoes',clicks:'4,820',ctr:'5.2%',ctr_s:'good',pos:'4.1'},{name:'best hiking boots',clicks:'3,610',ctr:'3.0%',ctr_s:'plain',pos:'6.8'},{name:'waterproof jacket',clicks:'2,940',ctr:'3.8%',ctr_s:'good',pos:'5.2'},{name:'merino base layer',clicks:'1,780',ctr:'4.1%',ctr_s:'good',pos:'5.9'},{name:'camping checklist',clicks:'2,110',ctr:'1.5%',ctr_s:'bad',pos:'11.4'},
    ]},
    {type:'chart',kind:'hbar',title:'Clicks by query',w:5,x:['trail shoes','hiking boots','jacket','base layer','checklist'],data:[4820,3610,2940,1780,2110]},
  ]},
  'search/pages':{ sub:'Pages ranking in Google', blocks:[
    {type:'table',title:'Top pages',w:12,columns:[{k:'name',label:'Page'},{k:'clicks',label:'Clicks',r:true},{k:'impr',label:'Impr.',r:true},{k:'ctr',label:'CTR',r:true},{k:'pos',label:'Position',r:true}],rows:[
      {name:'/products/trail-boots',clicks:'6,200',impr:'140k',ctr:'4.4%',ctr_s:'good',pos:'4.8'},{name:'/blog/best-hikes',clicks:'4,100',impr:'180k',ctr:'2.3%',ctr_s:'plain',pos:'7.1'},{name:'/collections/jackets',clicks:'3,400',impr:'96k',ctr:'3.5%',ctr_s:'good',pos:'5.6'},{name:'/blog/camping-checklist',clicks:'2,100',impr:'140k',ctr:'1.5%',ctr_s:'bad',pos:'11.4'},
    ]},
  ]},
  'search/geo':{ sub:'Where your organic traffic comes from', blocks:[ geoBlock(7,'Clicks by country'), donutDev(5,'Clicks by device') ]},
  'search/trends':{ sub:'Position & click trends', blocks:[
    {type:'chart',kind:'line',title:'Clicks over time',w:12,x:WK,series:[{name:'Clicks',color:GREEN,data:[5.6,6.0,5.9,6.4,6.1,6.8,7.0,7.4],area:true}]},
    {type:'chart',kind:'bar',title:'Queries by position bucket',w:12,x:['1-3','4-10','11-20','21-50','50+'],data:[210,640,480,320,150]},
  ]},

  /* ---------------- META ADS ---------------- */
  'meta/overview':{ sub:'Facebook & Instagram ad performance', blocks:[
    {type:'kpis',items:[k('Spend','$38.5k','▲ 9%',true,true,SP.up),k('Impressions','3.6M','▲ 6%',true,true,SP.up),k('Reach','1.4M','▲ 4%',true,true,SP.up),k('CTR','1.84%','▲ 0.2%',true,true,SP.up),k('CPC','$1.21','▼ 4%',true,true,SP.dn),k('ROAS','5.1x','▲ 0.3x',true,true,SP.up)]},
    {type:'chart',kind:'line',title:'Spend vs revenue',w:8,x:WK,series:[{name:'Revenue',color:GREEN,data:[120,134,128,150,143,168,180,196],area:true},{name:'Spend',color:BLUE,data:[28,31,30,34,33,37,38,40]}]},
    {type:'chart',kind:'donut',title:'Spend by placement',w:4,legend:true,height:150,data:[{name:'Feed',value:46,color:GREEN},{name:'Reels',value:34,color:BLUE},{name:'Stories',value:20,color:GREY}]},
    chanHbar(12,'Spend by campaign'),
    {type:'chart',kind:'funnel',title:'Catalog: ATC → Checkout → Buy',src:'Meta Ads',w:6,big:true,steps:[{name:'Add to cart',value:28310,p:'100%'},{name:'Initiate checkout',value:12640,p:'44.6%'},{name:'Purchase',value:7180,p:'25.4%'}]},
  ]},
  'meta/campaigns':{ sub:'6 campaigns · click a row to drill into ad sets & ads · synced 14 min ago', pills:[['campaign','6','Campaigns','var(--blue2)'],['play_circle','4','Active','var(--green)'],['pause_circle','2','Paused','var(--muted)'],['warning','2','Off target','var(--red)']], blocks:[
    {type:'campaignTree',w:12,setLabel:'Ad sets',columns:META_TREE_COLS,rows:META_CAMPAIGNS},
  ]},
  'meta/adsets':{ sub:'Ad sets & ads', blocks:[
    {type:'table',title:'Ad sets',w:12,columns:[{k:'name',label:'Ad set'},{k:'camp',label:'Campaign'},{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'roas',label:'ROAS',r:true},{k:'conv',label:'Conv.',r:true}],rows:[
      {name:'Lookalike 1% — Feed',camp:'Prospecting',spend:'$5,200',ctr:'1.9%',ctr_s:'good',roas:'4.6x',roas_s:'good',conv:'280'},{name:'Interest: Hiking',camp:'Prospecting',spend:'$4,100',ctr:'1.6%',ctr_s:'plain',roas:'3.8x',roas_s:'plain',conv:'210'},{name:'Cart abandoners',camp:'Retargeting',spend:'$3,900',ctr:'3.1%',ctr_s:'good',roas:'9.2x',roas_s:'good',conv:'320'},{name:'Viewed product 14d',camp:'Retargeting',spend:'$3,030',ctr:'2.4%',ctr_s:'good',roas:'6.4x',roas_s:'good',conv:'220'},
    ]},
  ]},
  'meta/funnels':{ sub:'Meta checkout / lead funnel', blocks:[
    {type:'chart',kind:'funnel',title:'Checkout funnel',w:8,big:true,height:340,steps:[{name:'Reach',value:1400000,p:'100%'},{name:'Link click',value:65000,p:'4.6%'},{name:'View content',value:42000,p:'3.0%'},{name:'Add to cart',value:14000,p:'1.0%'},{name:'Purchase',value:7100,p:'0.5%'}]},
    {type:'kbreak',title:'Attribution',w:4,rows:[{k:'7d click',v:'5,420',s:'good'},{k:'1d view',v:'1,680'},{k:'Avg. attribution',v:'7d click / 1d view'},{k:'ROAS (unified)',v:'5.1x',s:'good'}]},
  ]},
  'meta/breakdowns':{ sub:'Performance by audience & placement', blocks:[
    {type:'chart',kind:'bar',title:'Spend by age',w:6,x:AGE,data:[12,34,26,14,9,5]},
    {type:'chart',kind:'donut',title:'By gender',w:6,legend:true,height:150,data:[{name:'Female',value:58,color:GREEN},{name:'Male',value:39,color:BLUE},{name:'Unknown',value:3,color:GREY}]},
    {type:'chart',kind:'hbar',title:'ROAS by placement',w:6,x:['Feed','Reels','Stories','Marketplace','Search'],data:[6.4,5.1,4.2,3.1,2.4]},
    geoBlock(6,'Spend by country'),
  ]},
  'meta/creatives':{ sub:'Top performing creatives', blocks:[
    {type:'table',title:'Creatives',w:12,columns:[{k:'name',label:'Creative'},{k:'type',label:'Format'},{k:'spend',label:'Spend',r:true},{k:'ctr',label:'CTR',r:true},{k:'roas',label:'ROAS',r:true},{k:'fatigue',label:'Fatigue',r:true}],rows:[
      {name:'UGC — trail run',type:'Reel',spend:'$4,200',ctr:'3.2%',ctr_s:'good',roas:'7.1x',roas_s:'good',fatigue:'Low',fatigue_s:'good'},{name:'Carousel — boots',type:'Carousel',spend:'$3,600',ctr:'2.1%',ctr_s:'plain',roas:'5.2x',roas_s:'good',fatigue:'Medium'},{name:'Static — sale 20%',type:'Image',spend:'$2,900',ctr:'1.4%',ctr_s:'bad',roas:'3.1x',roas_s:'plain',fatigue:'High',fatigue_s:'bad'},{name:'Video — brand',type:'Video',spend:'$2,100',ctr:'0.9%',ctr_s:'bad',roas:'1.8x',roas_s:'bad',fatigue:'High',fatigue_s:'bad'},
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
    {type:'table',title:'Open alerts',w:12,columns:[{k:'name',label:'Client'},{k:'metric',label:'Metric'},{k:'msg',label:'Alert'},{k:'when',label:'When',r:true}],rows:[
      {name:'Harbor Dental',metric:'ROAS',msg:'ROAS dropped below 2.5x',msg_s:'bad',when:'2h ago'},{name:'Briar & Co',metric:'CPA',msg:'CPA up 38% week-over-week',msg_s:'bad',when:'6h ago'},{name:'Apex Legal',metric:'CPL',msg:'CPL above $120 target',msg_s:'bad',when:'1d ago'},{name:'Northwind',metric:'Conv. rate',msg:'Conversion rate down 2.7%',msg_s:'plain',when:'1d ago'},
    ]},
  ]},
  'clients/add':{ sub:'Onboard a new client', blocks:[
    {type:'addClient',w:7},
  ]},

  /* ---------------- SETTINGS ---------------- */
  'settings/connections':{ sub:'Connect data sources for this client', blocks:[ {type:'connections'} ]},
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
    {type:'insight',icon:'warning',tone:'bad',title:'form_submit stopped firing 2 days ago',text:'The lead form conversion tag has not fired since the last site deploy. Check the GTM trigger and the form selector before trusting CPL this period.'},
  ]},
  'settings/targets':{ sub:'These targets drive the green / red coloring across campaigns, KPIs & the detail panel', blocks:[
    {type:'note',icon:'target',title:'One source of truth',text:'Edit a target below and it updates everywhere instantly — the campaign detail panel’s KPI breakdown and on-target pills all read these same definitions.'},
    {type:'kpiTargets',w:12},
  ]},
  'settings/alerts':{ sub:'Get notified when KPIs cross a threshold', blocks:[
    {type:'alertsManager',w:12},
  ]},
  'settings/branding':{ sub:'White-label this client dashboard', blocks:[
    {type:'branding',w:12},
  ]},
  'settings/team':{ sub:'Who can access this workspace', blocks:[
    {type:'teamManager',w:12},
  ]},
  'settings/log':{ sub:'Logged campaign changes for client transparency', blocks:[
    {type:'changelog',w:12,title:'Campaign changelog',rows:[
      {date:'Jun 23, 2026',update:'Launched Reels-first creative test',trend:'CTR up to 9.2%, stable CPM',change:'Shifting budget to Reels next week — 18% lift in 100% video plays'},
      {date:'Jun 16, 2026',update:'Paused 2 underperforming interest sets',trend:'CPA crept above target on broad interests',change:'Reallocated €40/day to lookalikes — CPA back under €5.60'},
      {date:'Jun 9, 2026',update:'Added city-level targeting (Athens, Thessaloniki)',trend:'Higher CTR in metro areas',change:'City split now standard — top-of-page rate +4pts'},
      {date:'Jun 2, 2026',update:'New month kickoff, refreshed budgets',trend:'Stable 8% CTR, €0.91 CPC',change:'Holding strategy; watching frequency (2.3)'},
    ]},
  ]},

  /* ---------------- OVERVIEW (awareness) ---------------- */
  'overview/awareness':{ sub:'Brand penetration & top-of-funnel engagement', blocks:[
    {type:'kpis',w:12,items:[
      k('Reach','1.84M','+22%',true,true,null), k('Impressions','4.21M','+18%',true,true,null),
      k('Frequency','2.3','+0.2',true,'plain',null), k('Avg. session','1m 48s','+9%',true,true,null),
      k('New users','64%','+4%',true,true,null), k('Video 100% plays','15%','+3%',true,true,null),
    ]},
    {type:'chart',kind:'stack',title:'Video engagement (play %)',src:'Meta Ads',w:6,...AW_VIDEO},
    {type:'chart',kind:'donut',title:'New vs Returning',src:'GA4',w:6,legend:true,height:150,data:AW_NVR},
    {type:'geo',title:'Geographic reach (heatmap)',w:6,data:GEO,height:230},
    {type:'chart',kind:'line',title:'Cumulative brand awareness',src:'Blended',w:6,x:AW_WK,series:[{name:'Brand reach',color:GREEN,data:[180,410,690,1010,1360,1720,2090,2470],area:true}]},
  ]},

  /* ---------------- AWARENESS tabs ---------------- */
  'awareness/overview':{ sub:'Top-of-funnel brand reach summary', blocks:[
    {type:'kpis',w:12,items:[
      k('Reach','1.84M','+22%',true,true,null), k('Impressions','4.21M','+18%',true,true,null),
      k('Frequency','2.3','+0.2',true,'plain',null), k('Video 100% plays','15%','+3%',true,true,null),
    ]},
    {type:'chart',kind:'stack',title:'Video engagement (play %)',src:'Meta Ads',w:7,...AW_VIDEO},
    {type:'chart',kind:'donut',title:'New vs Returning',src:'GA4',w:5,legend:true,height:150,data:AW_NVR},
    {type:'geo',title:'Geographic reach',w:12,data:GEO,height:230},
  ]},
  'awareness/reach':{ sub:'Reach, frequency & geographic penetration', blocks:[
    {type:'kpis',w:12,items:[k('Reach','1.84M','+22%',true,true,null),k('Frequency','2.3','+0.2',true,'plain',null),k('Impressions','4.21M','+18%',true,true,null),k('CPM','€4.90','-6%',false,true,null)]},
    {type:'geo',title:'Reach by country',w:7,data:GEO,height:300},
    {type:'chart',kind:'hbar',title:'Reach by region',w:5,x:['Attica','Thessaloniki','Crete','Achaea','Larissa','Other'],data:[640,410,228,150,104,308],color:GREEN},
  ]},
  'awareness/video':{ sub:'Video view-through engagement', blocks:[
    {type:'chart',kind:'stack',title:'Video play % (25 / 50 / 75 / 100)',src:'Meta Ads',w:12,...AW_VIDEO},
    {type:'chart',kind:'line',title:'Impression share & top-of-page rate',src:'Google Ads',w:12,...AW_IMPRSHARE},
  ]},
  'awareness/organic':{ sub:'Brand vs non-brand organic visibility', blocks:[
    {type:'chart',kind:'line',title:'Brand vs Non-brand impressions',src:'Search Console',w:12,...AW_ORGANIC},
    {type:'insight',icon:'travel_explore',tone:'good',title:'Brand demand is climbing',text:'Brand impressions grew 2.5× over the period while non-brand stayed flat — paid reach is converting into organic brand search.'},
  ]},
  'youtube/overview':{ sub:'YouTube channel performance', blocks:[
    {type:'kpis',w:12,items:[k('Views','284,000','+14%',true,true,null),k('Watch time (hrs)','9,420','+11%',true,true,null),k('Subscribers','+1,240','+8%',true,true,null),k('Avg. view duration','3m 12s','+6%',true,true,null)]},
    {type:'chart',kind:'line',title:'Views & watch time',src:'YouTube',w:8,x:WK,series:[{name:'Views',color:GREEN,data:[24,28,31,35,38,42,45,48].map(v=>v*1000),area:true},{name:'Watch hrs',color:BLUE,data:[820,910,980,1050,1120,1190,1240,1310]}]},
    {type:'chart',kind:'donut',title:'Traffic source',w:4,legend:true,height:150,data:[{name:'Browse',value:38,color:BLUE},{name:'Search',value:29,color:GREEN},{name:'Suggested',value:22,color:GREY},{name:'External',value:11,color:'#5AAFF2'}]},
  ]},
  'linkedin/overview':{ sub:'LinkedIn page & content performance', blocks:[
    {type:'kpis',w:12,items:[k('Impressions','142,000','+17%',true,true,null),k('Engagement rate','4.8%','+0.5%',true,true,null),k('Followers','+540','+9%',true,true,null),k('Clicks','6,820','+12%',true,true,null)]},
    {type:'chart',kind:'line',title:'Impressions & engagement',src:'LinkedIn',w:8,x:WK,series:[{name:'Impressions',color:BLUE,data:[14,16,17,19,21,22,24,26].map(v=>v*1000),area:true},{name:'Engagements',color:GREEN,data:[680,760,810,910,980,1040,1120,1210]}]},
    {type:'leaderboard',w:4,title:'Top posts',rows:[
      {name:'How we cut CPL 40%',value:'9.2% ER',status:'good',sub:'Case study'},
      {name:'Hiring: Performance Lead',value:'7.1% ER',status:'good',sub:'Culture'},
      {name:'Q2 industry report',value:'5.4% ER',status:'plain',sub:'Thought leadership'},
    ]},
  ]},
  'social/overview':{ sub:'Organic Instagram & Facebook', blocks:[
    {type:'kpis',w:12,items:[k('Reach','412,000','+13%',true,true,null),k('Engagement','38,400','+10%',true,true,null),k('Followers','+2,140','+7%',true,true,null),k('Profile visits','18,600','+15%',true,true,null)]},
    {type:'chart',kind:'stack',title:'Engagement by type',src:'Meta Social',w:7,stack:true,x:WK,series:[{name:'Likes',color:'#2B8FEA',data:[3.2,3.5,3.7,4.0,4.2,4.5,4.7,5.0].map(v=>Math.round(v*1000))},{name:'Comments',color:'#28C3AE',data:[420,460,490,520,560,600,640,680]},{name:'Shares',color:'#22FF88',data:[180,200,220,240,260,280,300,320]}]},
    {type:'chart',kind:'donut',title:'Reach: IG vs FB',w:5,legend:true,height:150,data:[{name:'Instagram',value:64,color:GREEN},{name:'Facebook',value:36,color:BLUE}]},
  ]},
}

// Lead-gen clients see CPL-based campaign trees instead of the ROAS ones
const LEAD_OVERRIDE = {
  'meta/campaigns':{ sub:'6 campaigns · click a row to drill into ad sets & ads · synced 14 min ago', pills:[['campaign','6','Campaigns','var(--blue2)'],['play_circle','4','Active','var(--green)'],['pause_circle','2','Paused','var(--muted)'],['warning','2','Off target','var(--red)']], blocks:[
    {type:'campaignTree',w:12,setLabel:'Ad sets',columns:META_TREE_COLS_LEAD,rows:META_CAMPAIGNS_LEAD},
  ]},
  'ads/campaigns':{ sub:'5 campaigns · click a row to drill into ad groups & ads', pills:[['campaign','5','Campaigns','var(--blue2)'],['play_circle','4','Active','var(--green)'],['pause_circle','1','Paused','var(--muted)'],['warning','1','Off target','var(--red)']], blocks:[
    {type:'campaignTree',w:12,setLabel:'Ad groups',columns:ADS_TREE_COLS_LEAD,rows:ADS_CAMPAIGNS_LEAD},
  ]},
  'ads/overview':{ sub:'Lead generation — CPL & keyword relevance', blocks:[
    {type:'kpis',w:12,items:[k('Leads','2,180','+12%',true,true,null),k('CPL','€96','-6%',false,true,null),k('Conv. rate','5.2%','+0.4%',true,true,null),k('Spend','€20,940','+3%',true,'plain',null)]},
    {type:'chart',kind:'hbar',title:'Leads by keyword',src:'Google Ads',w:7,x:['injury lawyer','accident claim','legal advice','compensation','free consult','near me'],data:[540,420,310,260,180,140],color:GREEN},
    {type:'chart',kind:'donut',title:'Search term relevance',w:5,legend:true,height:150,data:[{name:'High intent',value:58,color:GREEN},{name:'Mid',value:30,color:BLUE},{name:'Low / negative',value:12,color:'#3a4f7a'}]},
  ]},
  'meta/overview':{ sub:'Lead forms — completion & source split', blocks:[
    {type:'chart',kind:'stack',title:'On-platform vs site leads',src:'Meta Ads',w:7,stack:false,x:['May Wk1','Wk2','Wk3','Wk4','Jun Wk1','Wk2'],series:[{name:'On-platform (Instant Form)',color:GREEN,data:[120,140,135,160,158,172]},{name:'Site leads',color:BLUE,data:[88,96,92,104,110,118]}]},
    {type:'kpis',w:5,items:[k('Form completion','62%','+5%',true,true,null),k('On-platform CPL','€78','-9%',false,true,null),k('Site CPL','€118','+4%',false,'plain',null),k('Leads','2,180','+12%',true,true,null)]},
  ]},
  'ga4/overview':{ sub:'Path to lead — MQL → SQL flow', blocks:[
    {type:'chart',kind:'sankey',title:'MQL → SQL conversion flow',src:'GA4',w:12,height:300,
      nodes:[{name:'Visitors',itemStyle:{color:BLUE}},{name:'Resource download',itemStyle:{color:'#5AAFF2'}},{name:'MQL',itemStyle:{color:'#28C3AE'}},{name:'SQL',itemStyle:{color:GREEN}},{name:'Customer',itemStyle:{color:'#22FF88'}},{name:'Dropped',itemStyle:{color:'#3a4f7a'}}],
      links:[{source:'Visitors',target:'Resource download',value:7600},{source:'Visitors',target:'Dropped',value:34500},{source:'Resource download',target:'MQL',value:2180},{source:'Resource download',target:'Dropped',value:5420},{source:'MQL',target:'SQL',value:1420},{source:'MQL',target:'Dropped',value:760},{source:'SQL',target:'Customer',value:184},{source:'SQL',target:'Dropped',value:1236}]},
  ]},
}

// Awareness clients see TOFU-focused source overviews
const AWARENESS_OVERRIDE = {
  'meta/overview':{ sub:'Reach, frequency & video engagement', blocks:[
    {type:'chart',kind:'stack',title:'Video engagement (play %)',src:'Meta Ads',w:7,...AW_VIDEO},
    {type:'chart',kind:'donut',title:'Reach by placement',w:5,legend:true,height:150,data:[{name:'Feed',value:48,color:BLUE},{name:'Reels',value:34,color:GREEN},{name:'Stories',value:18,color:GREY}]},
  ]},
  'ads/overview':{ sub:'Display reach & search visibility', blocks:[
    {type:'chart',kind:'line',title:'Display impressions & top-of-page rate',src:'Google Ads',w:12,...AW_IMPRSHARE},
  ]},
  'ga4/overview':{ sub:'New vs returning & engagement', blocks:[
    {type:'chart',kind:'donut',title:'New vs Returning',w:5,legend:true,height:150,data:AW_NVR},
    {type:'chart',kind:'line',title:'Avg. session duration',w:7,x:AW_WK,series:[{name:'Seconds',color:GREEN,data:[92,98,101,108,112,118,121,128],area:true}]},
  ]},
  'search/overview':{ sub:'Brand vs non-brand organic visibility', blocks:[
    {type:'chart',kind:'line',title:'Brand vs Non-brand impressions',src:'Search Console',w:12,...AW_ORGANIC},
  ]},
}

export function getContent(source, tab, clientType = 'ecommerce') {
  if (source === 'overview') {
    if (clientType === 'leadgen') return C['overview/lead']
    if (clientType === 'awareness') return C['overview/awareness']
    return C['overview/ecom']
  }
  const key = `${source}/${tab}`
  if (clientType === 'leadgen' && LEAD_OVERRIDE[key]) return LEAD_OVERRIDE[key]
  if (clientType === 'awareness' && AWARENESS_OVERRIDE[key]) return AWARENESS_OVERRIDE[key]
  if (clientType === 'awareness' && key.startsWith('awareness/')) return C[key] || { sub:'', blocks:[{ type:'note', title:'Coming soon', text:'This tab is part of the full build.' }] }
  return C[key] || { sub:'', blocks:[{ type:'note', title:'Coming soon', text:'This tab is part of the full build.' }] }
}
