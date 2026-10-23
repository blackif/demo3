import "./style.css";

type StatKey = "health" | "money" | "san" | "relationships" | "happiness" | "career" | "lifespan";
type Effects = Partial<Record<StatKey, number>>;
interface LifeEvent {
  title: string;
  category: string;
  description: string;
  effects: Effects;
  minAge: number;
  maxAge: number;
  mood: "good" | "bad" | "neutral";
  rarity?: number;
}
interface YearRecord extends LifeEvent {
  age: number;
  year: number;
  lifespanAfter: number;
  healthAfter: number;
  moneyAfter: number;
  sanAfter: number;
}
interface LifeState {
  age: number;
  lifespan: number;
  health: number;
  money: number;
  san: number;
  relationships: number;
  happiness: number;
  career: number;
  yearsLived: number;
  history: YearRecord[];
  ended: boolean;
  ending: string;
  origin: string;
  trait: string;
}
const SAVE_KEY = "demo3-life-simulator-v1";
const defaults: LifeState = {
  age: 0, lifespan: 80, health: 90, money: 0, san: 80,
  relationships: 45, happiness: 60, career: 0, yearsLived: 0,
  history: [], ended: false, ending: "", origin: "普通家庭", trait: "随遇而安"
};
const origins = [
  {name:"普通家庭", trait:"随遇而安", effects:{health:0,money:0,san:0,relationships:0,happiness:0,career:0}},
  {name:"富裕家庭", trait:"资源充足", effects:{health:5,money:12000,san:5,relationships:0,happiness:5,career:2}},
  {name:"拮据家庭", trait:"早熟独立", effects:{health:-5,money:800,san:-3,relationships:3,happiness:-3,career:5}},
  {name:"书香门第", trait:"好奇求知", effects:{health:0,money:1500,san:8,relationships:0,happiness:3,career:8}},
  {name:"艺术之家", trait:"感受敏锐", effects:{health:0,money:0,san:5,relationships:5,happiness:10,career:2}},
  {name:"动荡家庭", trait:"逆境求生", effects:{health:-8,money:0,san:-8,relationships:-5,happiness:-5,career:4}},
  {name:"被爱包围", trait:"信任世界", effects:{health:3,money:500,san:8,relationships:12,happiness:8,career:0}},
  {name:"天赋异禀", trait:"学习很快", effects:{health:0,money:0,san:3,relationships:0,happiness:3,career:12}}
] as const;
function newLife(): LifeState {
  const origin = origins[Math.floor(Math.random() * origins.length)]!;
  return {...defaults, history:[], origin:origin.name, trait:origin.trait,
    health:clamp(defaults.health+origin.effects.health,0,100),
    money:Math.max(0,defaults.money+origin.effects.money),
    san:clamp(defaults.san+origin.effects.san,0,100),
    relationships:clamp(defaults.relationships+origin.effects.relationships,0,100),
    happiness:clamp(defaults.happiness+origin.effects.happiness,0,100),
    career:clamp(defaults.career+origin.effects.career,0,100)};
}
const events: LifeEvent[] = [
  {title:"平安降生",category:"家庭",description:"你在家人的期待中来到这个世界。有人把你抱在怀里，轻轻哼着歌。",effects:{health:3,relationships:8,happiness:5},minAge:0,maxAge:1,mood:"good"},
  {title:"第一次发烧",category:"健康",description:"夜里突然发起高烧，家人抱着你赶去医院。幸好及时治疗。",effects:{health:-8,money:-300,happiness:-2},minAge:0,maxAge:5,mood:"bad"},
  {title:"学会走路",category:"成长",description:"你扶着桌沿摇摇晃晃地站起来，终于迈出了人生的第一步。",effects:{happiness:7,san:3},minAge:1,maxAge:3,mood:"good"},
  {title:"家里的争吵",category:"家庭",description:"大人的争吵让家里的气氛变得紧张，你躲在房间里不敢出声。",effects:{san:-8,relationships:-5,happiness:-6},minAge:2,maxAge:17,mood:"bad"},
  {title:"被温柔地照顾",category:"家庭",description:"有人记得你怕黑，睡前特地留了一盏小灯。小小的善意让你安心。",effects:{san:5,relationships:5,happiness:5},minAge:1,maxAge:12,mood:"good"},
  {title:"平凡的一年",category:"日常",description:"没有大喜，也没有大悲。日子像窗外的云一样缓慢地飘过。",effects:{},minAge:0,maxAge:100,mood:"neutral"},
  {title:"交到第一个朋友",category:"友情",description:"你们分享零食、秘密和无聊的笑话。原来有人一起玩，时间会过得很快。",effects:{relationships:10,happiness:8,san:4},minAge:4,maxAge:16,mood:"good"},
  {title:"考试失利",category:"学习",description:"努力准备的考试没有得到理想结果。你怀疑自己是不是不够聪明。",effects:{san:-7,happiness:-5},minAge:6,maxAge:22,mood:"bad"},
  {title:"发现喜欢的事",category:"成长",description:"你偶然接触到一件很喜欢的事，第一次愿意不看时间地投入其中。",effects:{happiness:10,san:5,career:2},minAge:6,maxAge:30,mood:"good"},
  {title:"被同学排挤",category:"人际",description:"你被排除在一个小圈子之外。那些看似不起眼的话，在心里留了很久。",effects:{san:-12,relationships:-8,happiness:-8},minAge:7,maxAge:19,mood:"bad"},
  {title:"家人带你出游",category:"家庭",description:"一家人去了陌生的地方。多年以后，你可能记不清风景，却记得当时的笑声。",effects:{relationships:8,happiness:10,money:-500},minAge:5,maxAge:18,mood:"good"},
  {title:"遇到一位好老师",category:"学习",description:"老师认真听你说话，并告诉你：现在不会，不代表以后也不会。",effects:{san:8,career:4,happiness:5},minAge:6,maxAge:20,mood:"good"},
  {title:"升学压力",category:"学习",description:"成绩、排名和未来压在一起。你开始把休息当成一种罪过。",effects:{san:-10,health:-3,happiness:-5},minAge:12,maxAge:23,mood:"bad"},
  {title:"顺利毕业",category:"成长",description:"你完成了一个阶段的学习。前方仍然迷茫，但至少又多了一种选择。",effects:{career:5,happiness:8,san:4},minAge:16,maxAge:27,mood:"good"},
  {title:"青春期的烦恼",category:"心理",description:"你开始在意别人怎么看自己，也常常不知道该怎样表达真实的想法。",effects:{san:-5,happiness:-3},minAge:12,maxAge:19,mood:"bad"},
  {title:"第一次打工",category:"工作",description:"你用自己的劳动换来第一笔收入。钱不多，但拿在手里很踏实。",effects:{money:1800,career:3,happiness:4},minAge:15,maxAge:25,mood:"good"},
  {title:"找到第一份工作",category:"工作",description:"你开始规律通勤、学习规矩，也慢慢明白职场并不总是讲道理。",effects:{money:4500,career:8,san:-3},minAge:18,maxAge:32,mood:"neutral"},
  {title:"租房搬家",category:"生活",description:"你搬进一间属于自己的小房间。自由是真的，账单也是真的。",effects:{money:-2200,relationships:-2,happiness:5},minAge:18,maxAge:40,mood:"neutral"},
  {title:"遇见心动的人",category:"爱情",description:"一次普通的相遇，让你开始期待手机亮起，也开始在意自己的样子。",effects:{relationships:8,happiness:12,san:5},minAge:16,maxAge:40,mood:"good"},
  {title:"一段感情结束",category:"爱情",description:"你们最终没能走到一起。曾经认真爱过的东西离开时，还是会痛。",effects:{relationships:-10,san:-14,happiness:-12},minAge:17,maxAge:55,mood:"bad"},
  {title:"升职加薪",category:"工作",description:"过去的努力终于被看见。收入提高了，责任和会议也一起增加。",effects:{money:7000,career:12,san:-4},minAge:23,maxAge:58,mood:"good"},
  {title:"项目失败",category:"工作",description:"一个项目没能达到预期，你承担了压力，也学会了如何面对失误。",effects:{money:-1800,career:-4,san:-9},minAge:20,maxAge:60,mood:"bad"},
  {title:"投资赚了一笔",category:"金钱",description:"你做过的研究恰好遇上好行情，资产有所增长。好运不代表每次都如此。",effects:{money:8500,happiness:6,san:2},minAge:20,maxAge:65,mood:"good"},
  {title:"冲动消费",category:"金钱",description:"压力大的时候，你买了很多并不需要的东西。拆包裹时开心，月底却有些后悔。",effects:{money:-2600,happiness:3,san:-2},minAge:16,maxAge:70,mood:"neutral"},
  {title:"熬夜成了习惯",category:"健康",description:"你总想着再做一点事，睡眠却一天天减少。身体暂时没抗议，不代表它没记账。",effects:{health:-10,san:-5,career:2},minAge:16,maxAge:55,mood:"bad"},
  {title:"开始规律运动",category:"健康",description:"你决定从散步和拉伸开始。变化很慢，但睡眠和精神状态逐渐改善。",effects:{health:12,happiness:5,san:4},minAge:16,maxAge:80,mood:"good"},
  {title:"认识一群挚友",category:"友情",description:"你们不一定常见面，但遇到难处时，总有人愿意听你把话说完。",effects:{relationships:14,san:8,happiness:8},minAge:18,maxAge:65,mood:"good"},
  {title:"亲人需要照顾",category:"家庭",description:"家庭责任突然变重。你在担心、疲惫和爱之间，努力找出一点平衡。",effects:{money:-3500,health:-5,san:-8,relationships:5},minAge:25,maxAge:75,mood:"bad"},
  {title:"迎来新生命",category:"家庭",description:"一个小生命加入了你的生活。快乐很具体，责任也从此变得具体。",effects:{relationships:12,happiness:12,money:-4000,san:-4},minAge:22,maxAge:48,mood:"good"},
  {title:"房贷与账单",category:"金钱",description:"收入看起来不少，但房租、贷款和各种账单很快分走了它们。",effects:{money:-5000,san:-5,happiness:-3},minAge:25,maxAge:60,mood:"neutral"},
  {title:"一次健康检查",category:"健康",description:"检查发现一些需要关注的小问题。医生建议你调整作息，别再透支身体。",effects:{health:5,money:-900,san:2},minAge:25,maxAge:85,mood:"neutral"},
  {title:"得到意外之财",category:"金钱",description:"一笔意料之外的奖金或馈赠落到你手里。它缓解了压力，也给了你一点余裕。",effects:{money:6000,happiness:7},minAge:20,maxAge:80,mood:"good"},
  {title:"工作倦怠",category:"心理",description:"每天都在忙，却说不清忙碌的意义。你需要休息，也需要重新想想自己想要什么。",effects:{san:-12,happiness:-8,health:-4},minAge:28,maxAge:65,mood:"bad"},
  {title:"学会拒绝",category:"成长",description:"你终于不再答应所有人的要求。边界没有让你变得冷漠，反而让关系更诚实。",effects:{san:10,relationships:4,happiness:6},minAge:20,maxAge:70,mood:"good"},
  {title:"事业迎来高峰",category:"工作",description:"你积累的经验开始发挥价值，拥有了更多选择，也有能力帮助别人。",effects:{money:12000,career:15,happiness:8},minAge:30,maxAge:62,mood:"good"},
  {title:"一次意外受伤",category:"健康",description:"意外打乱了生活计划。治疗和休养花去不少时间，也提醒你生命并非理所当然。",effects:{health:-18,money:-2500,san:-6,lifespan:-1},minAge:10,maxAge:85,mood:"bad"},
  {title:"久违的旅行",category:"生活",description:"你暂时离开熟悉的环境，看到不同的生活方式，心里重新有了空间。",effects:{money:-1800,happiness:12,san:8},minAge:18,maxAge:80,mood:"good"},
  {title:"朋友渐行渐远",category:"人际",description:"生活把大家带往不同方向。没有争吵，只是联络越来越少。",effects:{relationships:-6,happiness:-4},minAge:25,maxAge:75,mood:"neutral"},
  {title:"存下第一桶金",category:"金钱",description:"长期积累终于有了成果。你不再只担心下个月，也开始认真考虑未来。",effects:{money:10000,san:5,happiness:8},minAge:25,maxAge:65,mood:"good"},
  {title:"经济环境变差",category:"金钱",description:"行业不景气，收入和资产都受到影响。你开始重新安排预算，学着留有余地。",effects:{money:-6500,san:-7,happiness:-5},minAge:20,maxAge:75,mood:"bad"},
  {title:"孩子长大离家",category:"家庭",description:"家里忽然安静下来。你既为孩子高兴，也需要适应新的生活节奏。",effects:{relationships:-2,happiness:-3,san:2,money:1500},minAge:40,maxAge:75,mood:"neutral"},
  {title:"重新拾起爱好",category:"生活",description:"你找回年轻时喜欢的事情，不为赚钱，也不为证明什么，只是单纯享受。",effects:{happiness:10,san:8,relationships:3},minAge:30,maxAge:90,mood:"good"},
  {title:"退休了",category:"人生阶段",description:"工作日程终于空了下来。你需要重新定义每天的节奏，也拥有了更多自由。",effects:{career:-5,happiness:5,san:5,money:-1000},minAge:55,maxAge:75,mood:"neutral"},
  {title:"慢性病困扰",category:"健康",description:"身体需要长期管理，生活方式也不得不改变。规律治疗让情况暂时稳定下来。",effects:{health:-14,money:-3200,san:-5,lifespan:-2},minAge:45,maxAge:95,mood:"bad"},
  {title:"老友重逢",category:"友情",description:"多年未见的朋友坐在你对面，聊起往事时，仿佛那些年从未真正走远。",effects:{relationships:10,happiness:9,san:5},minAge:35,maxAge:95,mood:"good"},
  {title:"享受平静的午后",category:"日常",description:"阳光落在窗边，你喝着热茶，没有急事，也没有必须证明的事。平凡本身就是礼物。",effects:{health:2,san:5,happiness:6},minAge:45,maxAge:100,mood:"good"},
  {title:"失去重要的人",category:"离别",description:"你经历了一次沉重的告别。悲伤没有立刻消失，但你慢慢学着带着记忆继续生活。",effects:{relationships:-12,san:-12,happiness:-10},minAge:25,maxAge:100,mood:"bad"},
  {title:"身体恢复得不错",category:"健康",description:"长期坚持的生活习惯开始回报你。体检结果令人安心，你也更珍惜身体发出的信号。",effects:{health:10,lifespan:1,happiness:4},minAge:35,maxAge:95,mood:"good"},
  {title:"社区里帮了个忙",category:"人际",description:"你顺手帮邻居解决了一件小事。互相照应的感觉，让陌生的地方也有了人情味。",effects:{relationships:6,happiness:5,san:3},minAge:18,maxAge:100,mood:"good"},
  {title:"什么也没发生",category:"日常",description:"这一年没有值得写进新闻的大事。你吃饭、睡觉、工作，日子安静地往前走。",effects:{},minAge:0,maxAge:100,mood:"neutral"}

  {title:"彩票头奖",category:"极稀有",description:"你随手买的一张彩票竟然中了头奖。生活突然拥有了全新的选项，但如何使用这笔钱仍然是你的课题。",effects:{money:800000,happiness:20,san:8,relationships:4},minAge:18,maxAge:85,mood:"good",rarity:1},
  {title:"一夜之间负债",category:"极稀有",description:"担保、骗局或错误的商业决定让你背上沉重债务。你必须重新建立生活的底线。",effects:{money:-50000,san:-18,happiness:-15,relationships:-8},minAge:20,maxAge:70,mood:"bad",rarity:1},
  {title:"命运中的贵人",category:"奇迹",description:"一位重要人物看见了你的潜力，给你一个改变人生轨迹的机会。",effects:{career:25,money:18000,relationships:8,happiness:12},minAge:16,maxAge:55,mood:"good",rarity:2},
  {title:"重大事故幸存",category:"奇迹",description:"一场本可能改变一切的事故发生了。你奇迹般活了下来，从此重新审视时间的价值。",effects:{health:-25,san:10,lifespan:3,happiness:5},minAge:12,maxAge:90,mood:"good",rarity:2},
  {title:"被信任的人背叛",category:"暗潮",description:"你发现一个深信不疑的人一直在利用你。你失去了资源，也不得不重新学习信任。",effects:{money:-12000,san:-20,relationships:-20,happiness:-15},minAge:18,maxAge:75,mood:"bad",rarity:2},
  {title:"作品意外爆红",category:"奇迹",description:"你做的一件事突然被很多人看见。机会和关注一同涌来，平静的生活从此改变。",effects:{money:35000,career:22,relationships:5,happiness:18},minAge:14,maxAge:60,mood:"good",rarity:2},
  {title:"罕见的身心低谷",category:"暗潮",description:"连续的压力终于压垮了你。你需要暂停一些事，向可信任的人求助，而不是独自硬撑。",effects:{health:-15,san:-25,happiness:-18,lifespan:-2},minAge:18,maxAge:85,mood:"bad",rarity:2},
  {title:"重返校园",category:"人生转折",description:"你决定重新学习一项技能或回到校园。虽然起步比别人晚，但人生并没有规定只能选择一次。",effects:{money:-6000,career:16,san:8,happiness:10},minAge:25,maxAge:65,mood:"good",rarity:3},
  {title:"意外继承",category:"极稀有",description:"一位远亲留下了一笔遗产。它无法解决人生所有问题，却让你多了喘息的空间。",effects:{money:150000,relationships:3,san:6,happiness:15},minAge:18,maxAge:90,mood:"good",rarity:1},
  {title:"人生目标彻底改变",category:"人生转折",description:"一次经历让你发现，过去追逐的东西并不是自己真正想要的。你选择重新开始。",effects:{career:-8,san:15,happiness:12,relationships:5},minAge:20,maxAge:75,mood:"good",rarity:3},
];
function clamp(value:number,min:number,max:number):number { return Math.max(min,Math.min(max,value)); }
function formatMoney(value:number):string { return (value < 0 ? "-¥" : "¥") + Math.abs(Math.round(value)).toLocaleString("zh-CN"); }
function loadState():LifeState {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw) return newLife();
    const p=JSON.parse(raw) as Partial<LifeState>;
    return {...defaults,...p,history:Array.isArray(p.history)?p.history.slice(0,60):[]};
  } catch { return {...defaults,history:[]}; }
}
let state=loadState();
let latest:YearRecord[]=[];
let notice="人生没有固定剧本。抽取下一年，看看命运会发来什么事件。";
function save():void { localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
function chooseEvent(age:number):LifeEvent {
  const pool=events.filter(e=>age>=e.minAge && age<=e.maxAge);
  const total=pool.reduce((sum,e)=>sum+(e.rarity ?? 10),0);
  let roll=Math.random()*total;
  for(const event of pool){roll-=(event.rarity ?? 10);if(roll<0)return event;}
  return pool[pool.length-1] || events[events.length-1]!;
}
function applyEffect(key:StatKey,amount:number):void {
  if(key==="health") state.health=clamp(state.health+amount,0,100);
  else if(key==="money") state.money=Math.max(0,state.money+amount);
  else if(key==="san") state.san=clamp(state.san+amount,0,100);
  else if(key==="relationships") state.relationships=clamp(state.relationships+amount,0,100);
  else if(key==="happiness") state.happiness=clamp(state.happiness+amount,0,100);
  else if(key==="career") state.career=clamp(state.career+amount,0,100);
  else if(key==="lifespan") state.lifespan=Math.max(0,state.lifespan+amount);
}
function effectText(effects:Effects):string {
  const labels:Record<StatKey,string>={health:"健康",money:"金钱",san:"SAN",relationships:"人际",happiness:"幸福",career:"事业",lifespan:"寿元"};
  const keys=Object.keys(effects) as StatKey[];
  if(!keys.length) return "数值没有变化";
  return keys.map(k=>labels[k]+((effects[k]||0)>0?" +":" ")+(k==="money"?((effects[k]||0)<0?"-":"")+formatMoney(Math.abs(effects[k]||0)):String(effects[k]))).join("　·　");
}
function playYears(count:1|10):void {
  if(state.ended) return;
  latest=[];
  for(let i=0;i<count;i++){
    if(state.ended || state.lifespan<=0) break;
    state.lifespan-=1;
    state.age+=1;
    state.yearsLived+=1;
    const event=chooseEvent(state.age);
    Object.keys(event.effects).forEach(k=>applyEffect(k as StatKey,event.effects[k as StatKey]||0));
    let penalty="";
    if(state.health<20){state.lifespan=Math.max(0,state.lifespan-1);penalty="健康过低，额外损耗 1 年寿元。";}
    if(state.san<15){state.lifespan=Math.max(0,state.lifespan-1);penalty+=(penalty?" ":"")+"SAN 过低，额外损耗 1 年寿元。";}
    const record:YearRecord={...event,age:state.age,year:state.yearsLived,lifespanAfter:state.lifespan,healthAfter:state.health,moneyAfter:state.money,sanAfter:state.san};
    if(penalty) record.description += " "+penalty;
    latest.push(record);
    state.history.unshift(record);
    state.history=state.history.slice(0,60);
    if(state.health<=0){state.ended=true;state.ending="健康归零，生命走到了终点。";break;}
    if(state.lifespan<=0){state.ended=true;state.lifespan=0;state.ending="寿元耗尽，人生落下帷幕。";break;}
  }
  if(state.ended) notice="人生已结束。回顾这段旅程，或重新开始一段新人生。";
  else notice="本次经历了 "+latest.length+" 年。每个选择与意外，都悄悄改变着你的人生。";
  save();render();
}
function statBar(label:string,value:number,detail:string):string {
  const width=clamp(value,0,100);
  return '<div class="life-stat"><div class="life-stat-head"><span>'+label+'</span><strong>'+detail+'</strong></div><div class="life-stat-track"><div style="width:'+width+'%"></div></div></div>';
}
function renderEvents():string {
  if(!latest.length) return '<div class="life-empty"><div>✦</div><h3>你的人生故事尚未开始</h3><p>每抽一次，时间就向前走一年。命运可能给予惊喜，也可能带来考验。</p></div>';
  return '<div class="life-event-grid">'+latest.map((e,i)=>'<article class="life-event '+e.mood+'" style="--delay:'+(i*35)+'ms"><div class="life-event-top"><span>'+e.category+'</span><strong>'+e.age+' 岁</strong></div><h3>'+e.title+'</h3><p>'+e.description+'</p><div class="life-effects">'+effectText(e.effects)+'</div><div class="life-event-foot">剩余寿元 '+e.lifespanAfter+' 年</div></article>').join("")+'</div>';
}
function renderHistory():string {
  if(!state.history.length) return '<div class="life-empty compact">还没有人生记录。开始抽卡，书写你的第一年。</div>';
  return '<div class="life-timeline">'+state.history.slice(0,20).map(e=>'<article class="life-timeline-row '+e.mood+'"><div class="timeline-age">'+e.age+'<small>岁</small></div><div class="timeline-copy"><strong>'+e.title+'</strong><p>'+e.description+'</p><small>'+e.category+' · '+effectText(e.effects)+'</small></div><div class="timeline-life">寿元 '+e.lifespanAfter+'</div></article>').join("")+'</div>';
}
function render():void {
 const app=document.querySelector<HTMLDivElement>("#app"); if(!app)return;
 const ended=state.ended;
 app.innerHTML='<div class="life-shell"><header class="life-header"><a class="life-brand" href="#" data-action="home"><span>⌛</span><div><strong>人生抽卡模拟器</strong><small>ONE LIFE, MANY POSSIBILITIES</small></div></a><div class="life-header-right"><span class="life-save">● 本地自动存档</span><button class="life-reset" data-action="reset">重新开始</button></div></header><section class="life-hero"><div class="life-hero-copy"><div class="life-eyebrow">LIFE SIMULATION · 命运抽卡</div><h1>你的一生，<br><em>会抽到什么？</em></h1><p>每一次抽卡，都是人生向前的一年。健康、金钱、SAN、关系与机遇共同塑造你的命运。</p><div class="life-hero-tags"><span>✦ 每抽消耗 1 年寿元</span><span>✦ 十连经历 10 年</span><span>✦ 人生没有固定结局</span></div></div><div class="life-hourglass" aria-hidden="true"><div class="hourglass-glow"></div><div class="hourglass">⌛</div><div class="hourglass-orbit orbit-a"></div><div class="hourglass-orbit orbit-b"></div><span class="hourglass-caption">MEMENTO VITAE</span></div></section><section class="life-dashboard"><div class="life-main-column"><div class="life-panel life-status-panel"><div class="life-section-head"><div><span class="life-kicker">YOUR LIFE</span><h2>人生状态</h2></div><span class="life-age-chip">'+(ended?"人生终章":state.age+" 岁")+'</span></div><div class="life-origin-card"><span>🎲 本次人生起点</span><strong>'+state.origin+'</strong><small>先天特质：'+state.trait+'</small></div><div class="life-vitals"><div class="life-lifespan"><span>⌛ 剩余寿元</span><strong>'+state.lifespan+'<small>年</small></strong><div class="lifespan-track"><div style="width:'+clamp(state.lifespan/80*100,0,100)+'%"></div></div><small>初始 80 年 · 每次抽卡消耗 1 年</small></div><div class="life-vital-mini"><span>💰 当前资产</span><strong>'+formatMoney(state.money)+'</strong><span>🧭 累计经历</span><strong>'+state.yearsLived+' 年</strong></div></div><div class="life-stats-grid">'+statBar("健康",state.health,""+state.health+"/100")+statBar("SAN / 精神",state.san,""+state.san+"/100")+statBar("人际关系",state.relationships,""+state.relationships+"/100")+statBar("幸福感",state.happiness,""+state.happiness+"/100")+statBar("事业发展",state.career,""+state.career+"/100")+'</div><p class="life-rule-note">⚠ 健康低于 20 或 SAN 低于 15 时，每年额外损耗 1 年寿元；健康归零或寿元归零，人生结束。</p></div><div class="life-panel life-story-panel"><div class="life-section-head"><div><span class="life-kicker">FATE DRAW</span><h2>命运事件</h2></div><span class="life-history-count">本次 '+latest.length+' 年</span></div><p class="life-notice" role="status">'+notice+'</p>'+renderEvents()+'</div><div class="life-panel life-history-panel"><div class="life-section-head"><div><span class="life-kicker">MEMORIES</span><h2>人生回忆</h2></div><span class="life-history-count">最近 '+Math.min(20,state.history.length)+' 年</span></div>'+renderHistory()+'</div></div><aside class="life-side-column"><div class="life-panel life-draw-panel"><span class="life-kicker">NEXT CHAPTER</span><h2>抽取人生</h2><p>下一张卡牌会揭晓未来一年发生的事。你无法预知结果，只能继续生活。</p><button class="life-draw-btn single" data-action="single" '+(ended?'disabled':'')+'><span class="draw-icon">✧</span><span><strong>抽卡 × 1</strong><small>经历 1 年 · 消耗 1 年寿元</small></span></button><button class="life-draw-btn ten" data-action="ten" '+(ended?'disabled':'')+'><span class="draw-icon">✦</span><span><strong>十连抽 × 10</strong><small>经历最多 10 年 · 消耗最多 10 年寿元</small></span></button><div class="life-draw-foot">人生事件包含成长、学习、工作、金钱、爱情、家庭、健康、友情、退休与老年生活等。少数事件极其罕见，可能彻底改写人生。</div>'+(ended?'<div class="life-ending"><span>人生终章</span><strong>'+state.age+' 岁 · '+state.ending+'</strong><button data-action="reset">开启新人生 ↗</button></div>':'')+'</div><div class="life-panel life-principles"><span class="life-kicker">LIFE IS UNPREDICTABLE</span><h3>人生规则</h3><div class="life-rule"><span>01</span><div><strong>时间不可逆</strong><p>每次抽卡都会让年龄增长，寿元减少。</p></div></div><div class="life-rule"><span>02</span><div><strong>状态会影响寿命</strong><p>健康和精神状态太差，会加速消耗寿元。</p></div></div><div class="life-rule"><span>03</span><div><strong>没有完美人生</strong><p>好运与挫折交替发生，平凡的一年也值得记录。</p></div></div><div class="life-rule"><span>04</span><div><strong>每次人生都不同</strong><p>事件随机生成，结果保存在当前浏览器。</p></div></div></div></aside></section><footer class="life-footer"><span>⌛ 人生抽卡模拟器 · ONE LIFE, MANY POSSIBILITIES</span><span>纯前端模拟 · 事件与数值均为虚构游戏规则</span></footer></div>';
 app.querySelectorAll<HTMLButtonElement>("[data-action]").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.action;
  if(action==="single")playYears(1);
  if(action==="ten")playYears(10);
  if(action==="home"){window.scrollTo({top:0,behavior:"smooth"});render();}
  if(action==="reset"&&window.confirm("确定结束当前人生并重新开始吗？当前人生记录将被清空。")){
   state=newLife();latest=[];notice="新的人生已经开始。你的出生背景与先天特质已随机生成，命运仍然未知。";save();render();window.scrollTo({top:0,behavior:"smooth"});
  }
 }));
}
render();
