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
const k=(l,v,delta,up,good,sp)=>({l,v,delta,up,good,sp})
const lineSV=()=>({type:'chart',kind:'line',title:'Performance over time',src:'GA4 + Ads',w:8,x:WK,series:[{name:'Revenue',color:GREEN,data:SP.rev,area:true},{name:'Ad spend',color:BLUE,data:SP.spend,area:true}]})
const donutDev=(w=4)=>({type:'chart',kind:'donut',title:'Devices',w,legend:true,height:150,data:DEV})
const geoBlock=(w=6,title='Performance by country')=>({type:'geo',title,w,data:GEO,height:210})
const chanHbar=(w=6,title='Spend by channel')=>({type:'chart',kind:'hbar',title,w,x:CHAN,data:[78,52,40,30,24,17,11],color:GREEN})

const C = {
  /* ---------------- OVERVIEW ---------------- */
  overview:{ sub:'Meta Ads + Google Ads + GA4 + Search Console · vs previous 28 days', blocks:[
    {type:'kpis',items:[
      k('Ad spend','$65.6k','▲ 8.2%',true,true,SP.up),
      k('Revenue','$312.4k','▲ 14.0%',true,true,SP.up),
      k('ROAS','4.76x','▲ 0.4x',true,true,SP.up),
      k('Conversions','7,180','▲ 11.4%',true,true,SP.up),
      k('Conv. rate','5.59%','▼ 2.7%',false,false,SP.dn),
      k('Blended CPA','$9.14','▼ 6.0%',true,true,SP.dn),
    ]},
    lineSV(), donutDev(4),
    {type:'chart',kind:'funnel',title:'Conversion funnel',src:'GA4',w:6,steps:FUN_ECOM.steps,height:250},
    geoBlock(6),
    chanHbar(6), {type:'chart',kind:'bar',title:'Performance by channel',w:6,x:CHAN,data:[78,52,40,30,24,17,11]},
    {type:'chart',kind:'heat',title:'User retention — weekly cohorts',src:'GA4 cohort exploration',w:12,height:236,...HEAT},
  ]},

  /* ---------------- FUNNELS ---------------- */
  'funnels/builder':{ sub:'Build any path from your GA4 events. See where users drop, and which channels convert.', blocks:[
    {type:'builder',steps:['session_start','view_item','add_to_cart','begin_checkout','purchase']},
    {type:'chart',kind:'funnel',title:'Funnel',w:8,big:true,height:360,steps:FUN_ECOM.steps},
    {type:'leak',w:4,big:'View → Cart',text:'62.2% of product viewers leave before adding to cart — that’s 46,590 users. The single biggest revenue lever.'},
    {type:'chart',kind:'sankey',title:'User journey — channel → outcome',src:'Sankey',w:12,height:280,...SANKEY},
    {type:'kbreak',title:'By device',w:6,rows:[{k:'Desktop completion',v:'7.9%',s:'good'},{k:'Mobile completion',v:'3.1%',s:'bad'},{k:'Avg. time to purchase',v:'2d 4h'},{k:'Best channel',v:'Retargeting · 11.2%',s:'good'}]},
    {type:'chart',kind:'bar',title:'Completion rate by step',w:6,x:['Session','View','Cart','Checkout','Purchase'],data:[100,58,22,10,6]},
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
  'funnels/saved':{ sub:'Your saved funnel templates.', blocks:[
    {type:'table',title:'Saved funnels',w:12,columns:[{k:'name',label:'Funnel'},{k:'type',label:'Type'},{k:'steps',label:'Steps',r:true},{k:'cr',label:'Completion',r:true},{k:'updated',label:'Updated',r:true}],rows:[
      {name:'Ecommerce purchase',type:'Ecommerce',steps:'5',cr:'5.6%',cr_s:'plain',updated:'2d ago'},
      {name:'Lead generation',type:'Leads',steps:'5',cr:'5.2%',cr_s:'plain',updated:'5d ago'},
      {name:'Newsletter signup',type:'Leads',steps:'3',cr:'12.1%',cr_s:'good',updated:'1w ago'},
      {name:'App install → activate',type:'App',steps:'4',cr:'31.4%',cr_s:'good',updated:'2w ago'},
    ]},
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
    {type:'note',icon:'tune',title:'Free-form explore',text:'Drag any GA4 dimension and metric to build a custom table or chart — the full API catalog is available here (custom dimensions, cohorts, comparisons, segments).'},
    {type:'table',title:'Sample exploration · landing page × channel',w:12,columns:[{k:'name',label:'Landing page'},{k:'chan',label:'Channel'},{k:'sessions',label:'Sessions',r:true},{k:'cr',label:'Conv. rate',r:true},{k:'rev',label:'Revenue',r:true}],rows:[
      {name:'/products/trail-boots',chan:'Paid Social',sessions:'12,400',cr:'6.8%',cr_s:'good',rev:'$48k'},{name:'/collections/new',chan:'Paid Search',sessions:'9,100',cr:'5.4%',cr_s:'plain',rev:'$31k'},{name:'/',chan:'Organic',sessions:'18,900',cr:'3.2%',cr_s:'bad',rev:'$22k'},
    ]},
  ]},

  /* ---------------- GOOGLE ADS ---------------- */
  'ads/overview':{ sub:'Spend, clicks, conversions & ROAS', blocks:[
    {type:'kpis',items:[k('Spend','$27.1k','▲ 6.1%',true,true,SP.up),k('Impressions','1.9M','▲ 4%',true,true,SP.up),k('CTR','3.42%','▲ 0.3%',true,true,SP.up),k('Avg. CPC','$0.74','▼ 5%',true,true,SP.dn),k('Conversions','2,410','▲ 8%',true,true,SP.up),k('ROAS','5.2x','▲ 0.3x',true,true,SP.up)]},
    {type:'chart',kind:'line',title:'Spend vs conversions',w:8,x:WK,series:[{name:'Conversions',color:GREEN,data:[280,300,290,330,320,360,380,402],area:true},{name:'Spend ($)',color:BLUE,data:[3.1,3.4,3.3,3.8,3.6,4.0,4.2,4.4]}]},
    {type:'chart',kind:'donut',title:'Spend by campaign type',w:4,legend:true,height:150,data:[{name:'Search',value:52,color:GREEN},{name:'Shopping',value:31,color:BLUE},{name:'PMax',value:17,color:GREY}]},
    geoBlock(12,'Conversions by country'),
  ]},
  'ads/campaigns':{ sub:'8 campaigns · 6 active', pills:[['campaign','8','Campaigns','var(--blue2)'],['play_circle','6','Active','var(--green)'],['pause_circle','2','Paused','var(--muted)'],['warning','1','Off target','var(--red)']], blocks:[
    {type:'table',w:12,columns:[{k:'name',label:'Campaign'},{k:'status',label:'Status'},{k:'spend',label:'Spend',r:true},{k:'impr',label:'Impr.',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpc',label:'CPC',r:true},{k:'conv',label:'Conv.',r:true},{k:'roas',label:'ROAS',r:true}],rows:[
      {name:'Brand — Search',status:'Active',spend:'$3,210',impr:'180K',ctr:'8.4%',ctr_s:'good',cpc:'$0.42',cpc_s:'good',conv:'640',roas:'9.1x',roas_s:'good'},
      {name:'Shopping — All products',status:'Active',spend:'$8,940',impr:'620K',ctr:'2.1%',ctr_s:'plain',cpc:'$0.81',cpc_s:'plain',conv:'710',roas:'5.4x',roas_s:'good'},
      {name:'Performance Max',status:'Active',spend:'$6,120',impr:'540K',ctr:'1.9%',ctr_s:'plain',cpc:'$0.76',cpc_s:'plain',conv:'520',roas:'4.8x',roas_s:'good'},
      {name:'Non-brand — Search',status:'Active',spend:'$5,380',impr:'310K',ctr:'3.6%',ctr_s:'good',cpc:'$0.92',cpc_s:'plain',conv:'380',roas:'3.9x',roas_s:'good'},
      {name:'Competitor — Search',status:'Paused',spend:'$2,140',impr:'90K',ctr:'2.8%',ctr_s:'plain',cpc:'$1.64',cpc_s:'bad',conv:'88',roas:'2.1x',roas_s:'bad'},
      {name:'Display — Remarketing',status:'Active',spend:'$1,310',impr:'160K',ctr:'0.7%',ctr_s:'bad',cpc:'$0.38',cpc_s:'good',conv:'72',roas:'3.1x',roas_s:'plain'},
    ]},
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
  ]},
  'meta/campaigns':{ sub:'6 campaigns · 4 active · synced 14 min ago', pills:[['campaign','6','Campaigns','var(--blue2)'],['play_circle','4','Active','var(--green)'],['pause_circle','2','Paused','var(--muted)'],['warning','2','Off target','var(--red)']], blocks:[
    {type:'table',w:12,columns:[{k:'name',label:'Campaign'},{k:'status',label:'Status'},{k:'spend',label:'Spend',r:true},{k:'impr',label:'Impr.',r:true},{k:'ctr',label:'CTR',r:true},{k:'cpc',label:'CPC',r:true},{k:'roas',label:'ROAS',r:true},{k:'conv',label:'Conv.',r:true}],rows:[
      {name:'Retargeting · 30d',status:'Active',spend:'$6,930',impr:'420K',ctr:'2.61%',ctr_s:'good',cpc:'$0.98',cpc_s:'good',roas:'7.8x',roas_s:'good',conv:'540'},
      {name:'Prospecting · Broad',status:'Active',spend:'$12,480',impr:'1.2M',ctr:'1.84%',ctr_s:'good',cpc:'$1.42',cpc_s:'good',roas:'4.2x',roas_s:'good',conv:'612'},
      {name:'Advantage+ Shopping',status:'Active',spend:'$9,210',impr:'880K',ctr:'1.55%',ctr_s:'good',cpc:'$1.21',cpc_s:'good',roas:'5.1x',roas_s:'good',conv:'470'},
      {name:'Catalog · DPA',status:'Active',spend:'$4,760',impr:'310K',ctr:'2.10%',ctr_s:'good',cpc:'$1.05',cpc_s:'good',roas:'6.4x',roas_s:'good',conv:'388'},
      {name:'Lookalike 3%',status:'Paused',spend:'$3,140',impr:'260K',ctr:'0.92%',ctr_s:'bad',cpc:'$1.88',cpc_s:'bad',roas:'2.3x',roas_s:'bad',conv:'96'},
      {name:'Brand Awareness',status:'Paused',spend:'$1,980',impr:'540K',ctr:'0.74%',ctr_s:'bad',cpc:'$0.61',cpc_s:'good',roas:'1.1x',roas_s:'bad',conv:'41'},
    ]},
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
    {type:'note',icon:'person_add',title:'Add a new client',text:'Create a client workspace, pick their type (leads / ecommerce), then send them a one-time link to connect Google and Meta. Their dashboard builds itself once data syncs.'},
  ]},

  /* ---------------- SETTINGS ---------------- */
  'settings/connections':{ sub:'Connect data sources for this client', blocks:[ {type:'connections'} ]},
  'settings/targets':{ sub:'KPI targets drive the green / red coloring', blocks:[
    {type:'table',title:'KPI targets',w:12,columns:[{k:'name',label:'Metric'},{k:'src',label:'Source'},{k:'target',label:'Target'},{k:'cur',label:'Current',r:true},{k:'status',label:'Status'}],rows:[
      {name:'ROAS',src:'Meta + Ads',target:'> 3.0x',cur:'4.8x',cur_s:'good',status:'Active'},{name:'CPL',src:'Ads',target:'< $120',cur:'$96',cur_s:'good',status:'Active'},{name:'Conv. rate',src:'GA4',target:'> 6.0%',cur:'5.6%',cur_s:'bad',status:'Active'},{name:'CTR',src:'Meta',target:'> 1.5%',cur:'1.84%',cur_s:'good',status:'Active'},
    ]},
  ]},
  'settings/alerts':{ sub:'Get notified when KPIs cross a threshold', blocks:[
    {type:'note',icon:'notifications',title:'Alert rules',text:'Set thresholds per metric and route alerts to email or Slack. Example: notify when ROAS < 3x or CPL > $120.'},
    {type:'table',title:'Rules',w:12,columns:[{k:'name',label:'Rule'},{k:'channel',label:'Channel'},{k:'status',label:'Status'}],rows:[
      {name:'ROAS below 3x',channel:'Email + Slack',status:'Active'},{name:'CPL above $120',channel:'Email',status:'Active'},{name:'Spend pacing > 110%',channel:'Slack',status:'Paused'},
    ]},
  ]},
  'settings/branding':{ sub:'White-label this client dashboard', blocks:[
    {type:'note',icon:'palette',title:'Branding',text:'Upload the client logo, set accent colors, and choose a custom domain. GYA Media branding is applied by default; per-client white-labeling is available.'},
  ]},
  'settings/team':{ sub:'Who can access this workspace', blocks:[
    {type:'table',title:'Team & access',w:12,columns:[{k:'name',label:'User'},{k:'role',label:'Role'},{k:'access',label:'Access'},{k:'status',label:'Status'}],rows:[
      {name:'Apollo (you)',role:'Agency admin',access:'All clients',status:'Active'},{name:'Maria K.',role:'Analyst',access:'All clients',status:'Active'},{name:'Northwind — client',role:'Client',access:'Northwind only',status:'Active'},{name:'Lumen — client',role:'Client',access:'Lumen only',status:'Active'},
    ]},
  ]},
}

export function getContent(source, tab) {
  if (source === 'overview') return C.overview
  return C[`${source}/${tab}`] || { sub:'', blocks:[{ type:'note', title:'Coming soon', text:'This tab is part of the full build.' }] }
}
