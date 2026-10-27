import "./style.css";

type StatKey = "health" | "money" | "san" | "relationships" | "happiness" | "career" | "lifespan";
type Rarity = "common" | "uncommon" | "rare" | "legendary";
type Effects = Partial<Record<StatKey, number>>;
interface LifeEvent {
  title: string;
  category: string;
  description: string;
  effects: Effects;
  minAge: number;
  maxAge: number;
  mood: "good" | "bad" | "neutral";
  rarity: Rarity;
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
  choiceAges: number[];
  choicesMade: number;
}
const SAVE_KEY = "demo3-life-simulator-v1";
const defaults: LifeState = {
  age: 0, lifespan: 80, health: 90, money: 0, san: 80,
  relationships: 45, happiness: 60, career: 0, yearsLived: 0,
  history: [], ended: false, ending: "", origin: "普通家庭", trait: "随遇而安", choiceAges: [], choicesMade: 0
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
    health:Math.max(0,defaults.health+origin.effects.health),
    money:Math.max(0,defaults.money+origin.effects.money),
    san:Math.max(0,defaults.san+origin.effects.san),
    relationships:Math.max(0,defaults.relationships+origin.effects.relationships),
    happiness:Math.max(0,defaults.happiness+origin.effects.happiness),
    career:Math.max(0,defaults.career+origin.effects.career)};
}
const events: LifeEvent[] = [
  {title:"平安降生",category:"家庭",description:"你在家人的期待中来到这个世界。有人把你抱在怀里，轻轻哼着歌。",effects:{health:3,relationships:8,happiness:5},minAge:0,maxAge:1,mood:"good",rarity:"common"},
  {title:"第一次发烧",category:"健康",description:"夜里突然发起高烧，家人抱着你赶去医院。幸好及时治疗。",effects:{health:-8,money:-300,happiness:-2},minAge:0,maxAge:5,mood:"bad",rarity:"common"},
  {title:"学会走路",category:"成长",description:"你扶着桌沿摇摇晃晃地站起来，终于迈出了人生的第一步。",effects:{happiness:7,san:3},minAge:1,maxAge:3,mood:"good",rarity:"common"},
  {title:"家里的争吵",category:"家庭",description:"大人的争吵让家里的气氛变得紧张，你躲在房间里不敢出声。",effects:{san:-8,relationships:-5,happiness:-6},minAge:2,maxAge:17,mood:"bad",rarity:"common"},
  {title:"被温柔地照顾",category:"家庭",description:"有人记得你怕黑，睡前特地留了一盏小灯。小小的善意让你安心。",effects:{san:5,relationships:5,happiness:5},minAge:1,maxAge:12,mood:"good",rarity:"common"},
  {title:"平凡的一年",category:"日常",description:"没有大喜，也没有大悲。日子像窗外的云一样缓慢地飘过。",effects:{},minAge:0,maxAge:100,mood:"neutral",rarity:"common"},
  {title:"交到第一个朋友",category:"友情",description:"你们分享零食、秘密和无聊的笑话。原来有人一起玩，时间会过得很快。",effects:{relationships:10,happiness:8,san:4},minAge:4,maxAge:16,mood:"good",rarity:"common"},
  {title:"考试失利",category:"学习",description:"努力准备的考试没有得到理想结果。你怀疑自己是不是不够聪明。",effects:{san:-7,happiness:-5},minAge:6,maxAge:22,mood:"bad",rarity:"common"},
  {title:"发现喜欢的事",category:"成长",description:"你偶然接触到一件很喜欢的事，第一次愿意不看时间地投入其中。",effects:{happiness:10,san:5,career:2},minAge:6,maxAge:30,mood:"good",rarity:"common"},
  {title:"被同学排挤",category:"人际",description:"你被排除在一个小圈子之外。那些看似不起眼的话，在心里留了很久。",effects:{san:-12,relationships:-8,happiness:-8},minAge:7,maxAge:19,mood:"bad",rarity:"common"},
  {title:"家人带你出游",category:"家庭",description:"一家人去了陌生的地方。多年以后，你可能记不清风景，却记得当时的笑声。",effects:{relationships:8,happiness:10,money:-500},minAge:5,maxAge:18,mood:"good",rarity:"common"},
  {title:"遇到一位好老师",category:"学习",description:"老师认真听你说话，并告诉你：现在不会，不代表以后也不会。",effects:{san:8,career:4,happiness:5},minAge:6,maxAge:20,mood:"good",rarity:"common"},
  {title:"升学压力",category:"学习",description:"成绩、排名和未来压在一起。你开始把休息当成一种罪过。",effects:{san:-10,health:-3,happiness:-5},minAge:12,maxAge:23,mood:"bad",rarity:"common"},
  {title:"顺利毕业",category:"成长",description:"你完成了一个阶段的学习。前方仍然迷茫，但至少又多了一种选择。",effects:{career:5,happiness:8,san:4},minAge:16,maxAge:27,mood:"good",rarity:"common"},
  {title:"青春期的烦恼",category:"心理",description:"你开始在意别人怎么看自己，也常常不知道该怎样表达真实的想法。",effects:{san:-5,happiness:-3},minAge:12,maxAge:19,mood:"bad",rarity:"common"},
  {title:"第一次打工",category:"工作",description:"你用自己的劳动换来第一笔收入。钱不多，但拿在手里很踏实。",effects:{money:1800,career:3,happiness:4},minAge:15,maxAge:25,mood:"good",rarity:"common"},
  {title:"找到第一份工作",category:"工作",description:"你开始规律通勤、学习规矩，也慢慢明白职场并不总是讲道理。",effects:{money:4500,career:8,san:-3},minAge:18,maxAge:32,mood:"neutral",rarity:"common"},
  {title:"租房搬家",category:"生活",description:"你搬进一间属于自己的小房间。自由是真的，账单也是真的。",effects:{money:-2200,relationships:-2,happiness:5},minAge:18,maxAge:40,mood:"neutral",rarity:"common"},
  {title:"遇见心动的人",category:"爱情",description:"一次普通的相遇，让你开始期待手机亮起，也开始在意自己的样子。",effects:{relationships:8,happiness:12,san:5},minAge:16,maxAge:40,mood:"good",rarity:"common"},
  {title:"一段感情结束",category:"爱情",description:"你们最终没能走到一起。曾经认真爱过的东西离开时，还是会痛。",effects:{relationships:-10,san:-14,happiness:-12},minAge:17,maxAge:55,mood:"bad",rarity:"common"},
  {title:"升职加薪",category:"工作",description:"过去的努力终于被看见。收入提高了，责任和会议也一起增加。",effects:{money:7000,career:12,san:-4},minAge:23,maxAge:58,mood:"good",rarity:"common"},
  {title:"项目失败",category:"工作",description:"一个项目没能达到预期，你承担了压力，也学会了如何面对失误。",effects:{money:-1800,career:-4,san:-9},minAge:20,maxAge:60,mood:"bad",rarity:"common"},
  {title:"投资赚了一笔",category:"金钱",description:"你做过的研究恰好遇上好行情，资产有所增长。好运不代表每次都如此。",effects:{money:8500,happiness:6,san:2},minAge:20,maxAge:65,mood:"good",rarity:"common"},
  {title:"冲动消费",category:"金钱",description:"压力大的时候，你买了很多并不需要的东西。拆包裹时开心，月底却有些后悔。",effects:{money:-2600,happiness:3,san:-2},minAge:16,maxAge:70,mood:"neutral",rarity:"common"},
  {title:"熬夜成了习惯",category:"健康",description:"你总想着再做一点事，睡眠却一天天减少。身体暂时没抗议，不代表它没记账。",effects:{health:-10,san:-5,career:2},minAge:16,maxAge:55,mood:"bad",rarity:"common"},
  {title:"开始规律运动",category:"健康",description:"你决定从散步和拉伸开始。变化很慢，但睡眠和精神状态逐渐改善。",effects:{health:12,happiness:5,san:4},minAge:16,maxAge:80,mood:"good",rarity:"common"},
  {title:"认识一群挚友",category:"友情",description:"你们不一定常见面，但遇到难处时，总有人愿意听你把话说完。",effects:{relationships:14,san:8,happiness:8},minAge:18,maxAge:65,mood:"good",rarity:"common"},
  {title:"亲人需要照顾",category:"家庭",description:"家庭责任突然变重。你在担心、疲惫和爱之间，努力找出一点平衡。",effects:{money:-3500,health:-5,san:-8,relationships:5},minAge:25,maxAge:75,mood:"bad",rarity:"common"},
  {title:"迎来新生命",category:"家庭",description:"一个小生命加入了你的生活。快乐很具体，责任也从此变得具体。",effects:{relationships:12,happiness:12,money:-4000,san:-4},minAge:22,maxAge:48,mood:"good",rarity:"common"},
  {title:"房贷与账单",category:"金钱",description:"收入看起来不少，但房租、贷款和各种账单很快分走了它们。",effects:{money:-5000,san:-5,happiness:-3},minAge:25,maxAge:60,mood:"neutral",rarity:"common"},
  {title:"一次健康检查",category:"健康",description:"检查发现一些需要关注的小问题。医生建议你调整作息，别再透支身体。",effects:{health:5,money:-900,san:2},minAge:25,maxAge:85,mood:"neutral",rarity:"common"},
  {title:"得到意外之财",category:"金钱",description:"一笔意料之外的奖金或馈赠落到你手里。它缓解了压力，也给了你一点余裕。",effects:{money:6000,happiness:7},minAge:20,maxAge:80,mood:"good",rarity:"common"},
  {title:"工作倦怠",category:"心理",description:"每天都在忙，却说不清忙碌的意义。你需要休息，也需要重新想想自己想要什么。",effects:{san:-12,happiness:-8,health:-4},minAge:28,maxAge:65,mood:"bad",rarity:"common"},
  {title:"学会拒绝",category:"成长",description:"你终于不再答应所有人的要求。边界没有让你变得冷漠，反而让关系更诚实。",effects:{san:10,relationships:4,happiness:6},minAge:20,maxAge:70,mood:"good",rarity:"common"},
  {title:"事业迎来高峰",category:"工作",description:"你积累的经验开始发挥价值，拥有了更多选择，也有能力帮助别人。",effects:{money:12000,career:15,happiness:8},minAge:30,maxAge:62,mood:"good",rarity:"common"},
  {title:"一次意外受伤",category:"健康",description:"意外打乱了生活计划。治疗和休养花去不少时间，也提醒你生命并非理所当然。",effects:{health:-18,money:-2500,san:-6,lifespan:-1},minAge:10,maxAge:85,mood:"bad",rarity:"common"},
  {title:"久违的旅行",category:"生活",description:"你暂时离开熟悉的环境，看到不同的生活方式，心里重新有了空间。",effects:{money:-1800,happiness:12,san:8},minAge:18,maxAge:80,mood:"good",rarity:"common"},
  {title:"朋友渐行渐远",category:"人际",description:"生活把大家带往不同方向。没有争吵，只是联络越来越少。",effects:{relationships:-6,happiness:-4},minAge:25,maxAge:75,mood:"neutral",rarity:"common"},
  {title:"存下第一桶金",category:"金钱",description:"长期积累终于有了成果。你不再只担心下个月，也开始认真考虑未来。",effects:{money:10000,san:5,happiness:8},minAge:25,maxAge:65,mood:"good",rarity:"common"},
  {title:"经济环境变差",category:"金钱",description:"行业不景气，收入和资产都受到影响。你开始重新安排预算，学着留有余地。",effects:{money:-6500,san:-7,happiness:-5},minAge:20,maxAge:75,mood:"bad",rarity:"common"},
  {title:"孩子长大离家",category:"家庭",description:"家里忽然安静下来。你既为孩子高兴，也需要适应新的生活节奏。",effects:{relationships:-2,happiness:-3,san:2,money:1500},minAge:40,maxAge:75,mood:"neutral",rarity:"common"},
  {title:"重新拾起爱好",category:"生活",description:"你找回年轻时喜欢的事情，不为赚钱，也不为证明什么，只是单纯享受。",effects:{happiness:10,san:8,relationships:3},minAge:30,maxAge:90,mood:"good",rarity:"common"},
  {title:"退休了",category:"人生阶段",description:"工作日程终于空了下来。你需要重新定义每天的节奏，也拥有了更多自由。",effects:{career:-5,happiness:5,san:5,money:-1000},minAge:55,maxAge:75,mood:"neutral",rarity:"common"},
  {title:"慢性病困扰",category:"健康",description:"身体需要长期管理，生活方式也不得不改变。规律治疗让情况暂时稳定下来。",effects:{health:-14,money:-3200,san:-5,lifespan:-2},minAge:45,maxAge:95,mood:"bad",rarity:"common"},
  {title:"老友重逢",category:"友情",description:"多年未见的朋友坐在你对面，聊起往事时，仿佛那些年从未真正走远。",effects:{relationships:10,happiness:9,san:5},minAge:35,maxAge:95,mood:"good",rarity:"common"},
  {title:"享受平静的午后",category:"日常",description:"阳光落在窗边，你喝着热茶，没有急事，也没有必须证明的事。平凡本身就是礼物。",effects:{health:2,san:5,happiness:6},minAge:45,maxAge:100,mood:"good",rarity:"common"},
  {title:"失去重要的人",category:"离别",description:"你经历了一次沉重的告别。悲伤没有立刻消失，但你慢慢学着带着记忆继续生活。",effects:{relationships:-12,san:-12,happiness:-10},minAge:25,maxAge:100,mood:"bad",rarity:"common"},
  {title:"身体恢复得不错",category:"健康",description:"长期坚持的生活习惯开始回报你。体检结果令人安心，你也更珍惜身体发出的信号。",effects:{health:10,lifespan:1,happiness:4},minAge:35,maxAge:95,mood:"good",rarity:"common"},
  {title:"社区里帮了个忙",category:"人际",description:"你顺手帮邻居解决了一件小事。互相照应的感觉，让陌生的地方也有了人情味。",effects:{relationships:6,happiness:5,san:3},minAge:18,maxAge:100,mood:"good",rarity:"common"},
  {title:"什么也没发生",category:"日常",description:"这一年没有值得写进新闻的大事。你吃饭、睡觉、工作，日子安静地往前走。",effects:{},minAge:0,maxAge:100,mood:"neutral",rarity:"common"},
  {title:"彩票头奖",category:"极稀有",description:"你随手买的一张彩票竟然中了头奖。生活突然拥有了全新的选项，但如何使用这笔钱仍然是你的课题。",effects:{money:800000,happiness:20,san:8,relationships:4},minAge:18,maxAge:85,mood:"good",rarity:"legendary"},
  {title:"一夜之间负债",category:"极稀有",description:"担保、骗局或错误的商业决定让你背上沉重债务。你必须重新建立生活的底线。",effects:{money:-50000,san:-18,happiness:-15,relationships:-8},minAge:20,maxAge:70,mood:"bad",rarity:"rare"},
  {title:"命运中的贵人",category:"奇迹",description:"一位重要人物看见了你的潜力，给你一个改变人生轨迹的机会。",effects:{career:25,money:18000,relationships:8,happiness:12},minAge:16,maxAge:55,mood:"good",rarity:"rare"},
  {title:"重大事故幸存",category:"奇迹",description:"一场本可能改变一切的事故发生了。你奇迹般活了下来，从此重新审视时间的价值。",effects:{health:-25,san:10,lifespan:3,happiness:5},minAge:12,maxAge:90,mood:"good",rarity:"rare"},
  {title:"被信任的人背叛",category:"暗潮",description:"你发现一个深信不疑的人一直在利用你。你失去了资源，也不得不重新学习信任。",effects:{money:-12000,san:-20,relationships:-20,happiness:-15},minAge:18,maxAge:75,mood:"bad",rarity:"rare"},
  {title:"作品意外爆红",category:"奇迹",description:"你做的一件事突然被很多人看见。机会和关注一同涌来，平静的生活从此改变。",effects:{money:35000,career:22,relationships:5,happiness:18},minAge:14,maxAge:60,mood:"good",rarity:"rare"},
  {title:"罕见的身心低谷",category:"暗潮",description:"连续的压力终于压垮了你。你需要暂停一些事，向可信任的人求助，而不是独自硬撑。",effects:{health:-15,san:-25,happiness:-18,lifespan:-2},minAge:18,maxAge:85,mood:"bad",rarity:"rare"},
  {title:"重返校园",category:"人生转折",description:"你决定重新学习一项技能或回到校园。虽然起步比别人晚，但人生并没有规定只能选择一次。",effects:{money:-6000,career:16,san:8,happiness:10},minAge:25,maxAge:65,mood:"good",rarity:"rare"},
  {title:"意外继承",category:"极稀有",description:"一位远亲留下了一笔遗产。它无法解决人生所有问题，却让你多了喘息的空间。",effects:{money:150000,relationships:3,san:6,happiness:15},minAge:18,maxAge:90,mood:"good",rarity:"legendary"},
  {title:"高薪机会与健康透支",category:"工作",description:"猎头带来一份薪酬大幅提升的工作，你也终于能主导重要项目；但高强度出差让身体亮起红灯。",effects:{money:18000,career:20,health:-16},minAge:25,maxAge:58,mood:"neutral",rarity:"rare"},
  {title:"创业初胜与友情裂痕",category:"事业",description:"新业务终于盈利，你也得到关键客户的认可；然而长期把朋友当作免费帮手，让一段多年友情出现裂痕。",effects:{money:22000,career:18,relationships:-18},minAge:23,maxAge:55,mood:"neutral",rarity:"rare"},
  {title:"公开演讲一鸣惊人",category:"成长",description:"一次重要演讲获得热烈反响，你的自信和职业声望都大幅提升；准备期间持续失眠，让精神状态明显下滑。",effects:{career:22,happiness:16,san:-18},minAge:18,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"意外成名的代价",category:"名望",description:"你的作品获得广泛关注，收入和机会接连增加；与此同时，隐私被曝光，日常生活受到严重干扰。",effects:{money:30000,career:25,relationships:-22},minAge:16,maxAge:55,mood:"neutral",rarity:"rare"},
  {title:"重要考试逆袭",category:"学习",description:"你在关键考试中超常发挥，打开了更好的升学或就业通道；临考前的高压却让健康和睡眠都受损。",effects:{career:18,happiness:15,health:-14},minAge:14,maxAge:30,mood:"neutral",rarity:"rare"},
  {title:"获得奖学金却错过陪伴",category:"学习",description:"优异成绩为你赢得丰厚奖学金和导师推荐；但你长期缺席家庭重要时刻，亲近的人感到失落。",effects:{money:12000,career:16,relationships:-16},minAge:16,maxAge:32,mood:"neutral",rarity:"rare"},
  {title:"勇敢转行迎来新生",category:"人生转折",description:"你离开消耗自己的旧岗位，找到更符合兴趣的新方向，精神状态明显好转；转型期的收入中断让存款大幅缩水。",effects:{san:22,happiness:20,money:-14000},minAge:25,maxAge:58,mood:"neutral",rarity:"rare"},
  {title:"家庭团聚与照护压力",category:"家庭",description:"多年分隔的家人终于团聚，关系修复，幸福感显著提升；但照护安排和额外开销让你疲惫不堪。",effects:{relationships:22,happiness:18,health:-15},minAge:30,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"一段关系给你勇气",category:"爱情",description:"伴侣坚定地支持你的梦想，你们的关系更深，生活也重新有了期待；为了共同计划，你花掉大笔积蓄。",effects:{relationships:24,happiness:20,money:-16000},minAge:18,maxAge:65,mood:"neutral",rarity:"rare"},
  {title:"买房成功却背上重担",category:"生活",description:"你终于买下期待已久的住所，安全感和家庭幸福感大幅提高；贷款与装修开支让财务压力陡增。",effects:{happiness:18,relationships:16,money:-28000},minAge:25,maxAge:55,mood:"neutral",rarity:"rare"},
  {title:"救人获誉却受重伤",category:"意外",description:"你在突发事故中帮助他人，得到社会认可，也因此更加珍惜生命；但自己受了重伤，需要漫长康复。",effects:{relationships:20,happiness:15,health:-28},minAge:18,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"抓住风口却失去睡眠",category:"事业",description:"你准确抓住行业机会，收入和事业发展快速增长；持续高压和睡眠不足让精神状态严重恶化。",effects:{money:26000,career:24,san:-24},minAge:22,maxAge:58,mood:"neutral",rarity:"rare"},
  {title:"公益项目改变社区",category:"人际",description:"你推动的公益项目真正改善了社区生活，也让你结识一群可靠的伙伴；投入过多时间后，自己的工作进度落后。",effects:{relationships:24,happiness:18,career:-16},minAge:22,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"康复成功与巨额账单",category:"健康",description:"坚持治疗和复健后，你的身体状态明显改善，生活质量也恢复许多；高昂的治疗费用几乎掏空积蓄。",effects:{health:28,happiness:16,money:-24000},minAge:25,maxAge:85,mood:"neutral",rarity:"rare"},
  {title:"被提拔却遭团队孤立",category:"工作",description:"你获得重要职位和更高收入，终于有机会推动自己的想法；快速晋升引来同事不满，团队关系急剧恶化。",effects:{money:20000,career:22,relationships:-24},minAge:25,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"作品获奖与创作枯竭",category:"创作",description:"多年打磨的作品获得重量级奖项，收入和自信都达到新高；接踵而来的要求让你逐渐失去创作热情。",effects:{money:24000,happiness:18,san:-20},minAge:18,maxAge:70,mood:"neutral",rarity:"rare"},
  {title:"继承家业却失去自由",category:"家庭",description:"家人把经营多年的事业交到你手中，你获得资产与事业基础；但沉重责任挤压了私人生活，也让你长期焦虑。",effects:{money:35000,career:20,happiness:-20},minAge:25,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"重病后重新理解生活",category:"健康",description:"一场严重疾病让你经历艰难治疗，康复后你更珍惜身边的人，也重新找到生活意义；身体仍留下长期损伤。",effects:{happiness:22,san:18,health:-22},minAge:30,maxAge:85,mood:"neutral",rarity:"rare"},
  {title:"一次大胆投资改变阶层",category:"金钱",description:"经过充分研究的一次投资带来远超预期的回报，你的财务自由度和幸福感大幅提高；风险暴露也让你承受巨大精神压力。",effects:{money:50000,happiness:20,san:-22},minAge:25,maxAge:65,mood:"neutral",rarity:"rare"},
  {title:"找到人生导师却得罪旧友",category:"成长",description:"一位经验丰富的导师帮你突破瓶颈，事业和自信都明显进步；你把太多时间投入新圈子，旧友觉得被抛下。",effects:{career:20,san:16,relationships:-20},minAge:18,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"家庭危机后关系重建",category:"家庭",description:"一次家庭危机迫使所有人坦诚沟通，亲密关系和幸福感得到修复；处理危机消耗了大量金钱与精力。",effects:{relationships:26,happiness:22,money:-18000,health:-14},minAge:25,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"创业成功却婚姻告急",category:"事业",description:"你创办的事业终于稳定盈利，个人成就感大幅提高；多年来把工作放在第一位，让伴侣对这段关系失去信心。",effects:{money:42000,career:26,relationships:-24,happiness:-18},minAge:28,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"实现梦想却付出健康代价",category:"人生转折",description:"你终于完成多年追逐的目标，获得强烈满足感，也更相信自己的能力；为了赶上期限，你透支身体并花光备用金。",effects:{happiness:24,career:22,health:-24,money:-18000},minAge:20,maxAge:65,mood:"neutral",rarity:"rare"},
  {title:"照顾家人与事业双重突破",category:"家庭",description:"你在照护家人的同时找到更灵活的工作方式，家庭关系和事业发展都取得突破；长期奔波让精神与健康承压。",effects:{relationships:22,career:20,san:-20,health:-16},minAge:28,maxAge:70,mood:"neutral",rarity:"rare"},
  {title:"人生目标彻底改变",category:"人生转折",description:"一次经历让你发现，过去追逐的东西并不是自己真正想要的。你选择重新开始。",effects:{career:-8,san:15,happiness:12,relationships:5},minAge:20,maxAge:75,mood:"good",rarity:"rare"},
  {title:"谈成关键合同却失去私人时间",category:"工作",description:"你签下改变团队业绩的大合同，收入也随之大幅提高；为了交付承诺，你几乎没有时间陪伴自己在乎的人。",effects:{money:32000,relationships:-24},minAge:25,maxAge:60,mood:"neutral",rarity:"rare"},
  {title:"多年努力终于获奖",category:"成长",description:"你坚持多年的专业成果获得重要奖项，能力终于被广泛认可；随之而来的竞争与审视让你承受巨大精神压力。",effects:{career:28,san:-22},minAge:20,maxAge:70,mood:"neutral",rarity:"rare"},
  {title:"卖掉旧房获得自由却失去归属",category:"生活",description:"你以理想价格卖掉房产，手头资金一下宽裕许多；离开熟悉的社区后，你却感到强烈的失落与孤独。",effects:{money:45000,happiness:-20},minAge:30,maxAge:80,mood:"neutral",rarity:"rare"},
  {title:"重返赛场却旧伤复发",category:"健康",description:"经过长期训练，你的体能与状态恢复到新高度；一次高强度比赛让旧伤复发，身体再次受到重创。",effects:{health:24,lifespan:-3},minAge:18,maxAge:65,mood:"neutral",rarity:"rare"},
  {title:"成为管理者却众叛亲离",category:"工作",description:"你获得高层信任并拿下关键管理职位；为推动改革，你采取过于强硬的方式，昔日同事逐渐疏远你。",effects:{career:26,relationships:-26},minAge:28,maxAge:62,mood:"neutral",rarity:"rare"},
  {title:"偿清债务却耗尽积蓄",category:"金钱",description:"你终于彻底摆脱沉重债务，心理负担大幅减轻；但还款几乎耗尽了所有储蓄，短期内缺少安全垫。",effects:{san:24,money:-30000},minAge:25,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"公开发声赢得支持却遭报复",category:"人际",description:"你为不公平的事挺身而出，得到许多人的尊重与支持；相关利益方开始针对你，工作和生活受到干扰。",effects:{relationships:28,career:-22},minAge:18,maxAge:70,mood:"neutral",rarity:"rare"},
  {title:"实现财务目标却失去热情",category:"人生转折",description:"你提前完成重要的财务目标，终于拥有选择生活方式的自由；长期只顾积累财富，让你一时找不到继续努力的意义。",effects:{money:60000,happiness:-24},minAge:30,maxAge:75,mood:"neutral",rarity:"rare"},
  {title:"学习一项新技能",category:"成长",description:"你投入时间掌握新技能，短期看不到巨大变化，却悄悄扩大了未来的可能性。",effects:{career:8,san:3,happiness:5,money:-1200},minAge:12,maxAge:70,mood:"good",rarity:"uncommon"},
  {title:"被裁员后重新出发",category:"工作",description:"岗位突然消失，计划被打乱。经过一段艰难调整，你开始寻找更适合自己的方向。",effects:{money:-6500,career:-5,san:-10,happiness:-8},minAge:22,maxAge:62,mood:"bad",rarity:"uncommon"},
  {title:"主动修复一段关系",category:"人际",description:"你鼓起勇气道歉，也认真听完对方的感受。不是所有关系都能复原，但这一次你们愿意重新开始。",effects:{relationships:12,san:5,happiness:7},minAge:16,maxAge:75,mood:"good",rarity:"uncommon"},
  {title:"长期储蓄计划见效",category:"金钱",description:"你坚持记账、储蓄并控制冲动消费。没有一夜暴富，但选择权比过去更多了。",effects:{money:9000,san:5,happiness:4},minAge:22,maxAge:75,mood:"good",rarity:"uncommon"},
  {title:"重新找回生活节奏",category:"健康",description:"你开始认真安排睡眠、运动与休息。变化不是奇迹，却让每一天都容易了一点。",effects:{health:14,san:6,happiness:6},minAge:18,maxAge:85,mood:"good",rarity:"uncommon"},
  {title:"一次昂贵的错误",category:"金钱",description:"你忽略风险，把希望押在过于美好的承诺上。损失令人心痛，但你终于学会先保护自己。",effects:{money:-12000,san:-8,happiness:-8,career:-2},minAge:18,maxAge:75,mood:"bad",rarity:"uncommon"},
  {title:"成为别人的依靠",category:"家庭",description:"有人在最困难的时候向你求助。你付出时间与资源，也发现自己比想象中更有力量。",effects:{relationships:12,happiness:8,money:-2500,san:4},minAge:20,maxAge:85,mood:"good",rarity:"uncommon"},
  {title:"健康习惯坚持了一整年",category:"健康",description:"你没有追求极端改变，只是持续做对身体有益的小事。一年后，积累终于看得见。",effects:{health:8,lifespan:1},minAge:20,maxAge:90,mood:"good",rarity:"uncommon"},
  {title:"财务自由的第一步",category:"金钱",description:"你计算了长期开支，建立应急储备，并开始认真规划未来。自由还没完全到来，但你已经走在路上。",effects:{money:18000,san:8,happiness:8},minAge:25,maxAge:70,mood:"good",rarity:"rare"},
  {title:"多年好友为你挺身而出",category:"友情",description:"当你遇到真正的麻烦时，一位老朋友主动站出来帮忙。你终于明白，关系的价值不在联系频率，而在关键时刻。",effects:{relationships:20,san:12,happiness:12,money:3000},minAge:18,maxAge:90,mood:"good",rarity:"rare"},
  {title:"带领团队完成不可能的任务",category:"事业",description:"你协调分歧、承担责任，最终带领团队完成了看似不可能的目标。你的能力与信誉都获得提升。",effects:{career:24,money:15000,relationships:8,happiness:12,san:-5},minAge:25,maxAge:60,mood:"good",rarity:"rare"},
  {title:"在低谷中接受帮助",category:"心理",description:"你终于告诉信任的人自己正在经历什么。有人陪你一起面对问题，恢复并不迅速，但你不必再独自承受。",effects:{san:18,happiness:12,relationships:10},minAge:16,maxAge:90,mood:"good",rarity:"rare"},
  {title:"发现真正想过的生活",category:"人生转折",description:"你重新审视金钱、成就与关系，决定把时间花在真正重要的事上。人生没有重来，但方向可以改变。",effects:{happiness:18,san:12,relationships:8,career:-4},minAge:25,maxAge:80,mood:"good",rarity:"rare"},
  {title:"长期透支终于反噬",category:"健康",description:"你忽视了多次警讯，身体问题集中爆发。恢复需要时间，也需要你改变一直以来的生活方式。",effects:{health:-28,money:-8000,san:-12,lifespan:-2},minAge:30,maxAge:90,mood:"bad",rarity:"rare"}
];
function clamp(value:number,min:number,max:number):number { return Math.max(min,Math.min(max,value)); }
function formatMoney(value:number):string { return (value < 0 ? "-¥" : "¥") + Math.abs(Math.round(value)).toLocaleString("zh-CN"); }
function loadState():LifeState {
  try {
    const raw=localStorage.getItem(SAVE_KEY);
    if(!raw) return newLife();
    const p=JSON.parse(raw) as Partial<LifeState>;
    return {...defaults,...p,history:Array.isArray(p.history)?p.history.slice(0,60):[],choiceAges:Array.isArray(p.choiceAges)?p.choiceAges:[],choicesMade:typeof p.choicesMade==="number"?p.choicesMade:0};
  } catch { return {...defaults,history:[]}; }
}
let state=loadState();
let latest:YearRecord[]=[];
let notice="人生没有固定剧本。抽取下一年，看看命运会发来什么事件。";
function save():void { localStorage.setItem(SAVE_KEY,JSON.stringify(state)); }
const rarityRules:Record<Rarity,{label:string;weight:number}> = {
  common:{label:"普通",weight:100},
  uncommon:{label:"少见",weight:25},
  rare:{label:"稀有",weight:6},
  legendary:{label:"传说",weight:1}
};
function chooseEvent(age:number):LifeEvent {
  const pool=events.filter(e=>age>=e.minAge && age<=e.maxAge);
  const total=pool.reduce((sum,e)=>sum+rarityRules[e.rarity].weight,0);
  let roll=Math.random()*total;
  for(const event of pool){roll-=rarityRules[event.rarity].weight;if(roll<0)return event;}
  return pool[pool.length-1] || events[events.length-1]!;
}
function calculateEffect(amount:number):number {
  return amount;
}
function applyEffect(key:StatKey,amount:number):void {
  if(key==="health") state.health=Math.max(0,state.health+amount);
  else if(key==="money") state.money+=amount;
  else if(key==="san") state.san=Math.max(0,state.san+amount);
  else if(key==="relationships") state.relationships+=amount;
  else if(key==="happiness") state.happiness+=amount;
  else if(key==="career") state.career=Math.max(0,state.career+amount);
  else if(key==="lifespan") state.lifespan=Math.max(0,state.lifespan+amount);
}
function effectText(effects:Effects):string {
  const labels:Record<StatKey,string>={health:"健康",money:"金钱",san:"SAN",relationships:"人际",happiness:"幸福",career:"事业",lifespan:"寿元"};
  const keys=Object.keys(effects) as StatKey[];
  if(!keys.length) return "数值没有变化";
  return keys.map(k=>labels[k]+((effects[k]||0)>0?" +":" ")+(k==="money"?((effects[k]||0)<0?"-":"")+formatMoney(Math.abs(effects[k]||0)):String(effects[k]))).join("　·　");
}
function applyAnnualSystems():{effects:Effects;notes:string[]} {
  const effects:Effects={};
  const notes:string[]=[];
  const add=(key:StatKey,amount:number):void=>{
    if(amount===0) return;
    applyEffect(key,amount);
    effects[key]=(effects[key]||0)+amount;
  };

  // 成年后每年结算收入与生活成本；事业越稳定，现金流越好。
  if(state.age>=18 && state.age<65){
    const income=800+Math.round(state.career*75);
    const cost=state.age<25?1300:2100;
    add("money",income-cost);
    notes.push("工作收入 +"+formatMoney(income)+"，生活开支 -"+formatMoney(cost));
  } else if(state.age>=65){
    const pension=500+Math.round(state.career*15);
    const cost=1400;
    add("money",pension-cost);
    notes.push("退休收入 +"+formatMoney(pension)+"，生活开支 -"+formatMoney(cost));
  }

  // 财务安全感会影响精神状态；负债则持续制造压力。
  if(state.money<0){
    add("san",-2); add("happiness",-2);
    notes.push("财务压力：SAN -2、幸福 -2");
  } else if(state.money>=50000){
    add("san",1); add("happiness",1);
    notes.push("财务安全感：SAN +1、幸福 +1");
  }

  // 人际关系是支持网络，关系破裂时也会增加孤立感。
  if(state.relationships>=60){
    add("san",1); add("happiness",1);
    notes.push("人际支持：SAN +1、幸福 +1");
  } else if(state.relationships<15){
    add("san",-2); add("happiness",-1);
    notes.push("社交孤立：SAN -2、幸福 -1");
  }

  // 幸福感与身体状态会反馈到精神状态。
  if(state.happiness>=70){
    add("san",1);
    notes.push("生活满足：SAN +1");
  } else if(state.happiness<20){
    add("san",-1);
    notes.push("长期低落：SAN -1");
  }
  if(state.health>=80){
    add("san",1);
    notes.push("身体状态良好：SAN +1");
  } else if(state.health<40){
    add("san",-1);
    notes.push("身体状况不佳：SAN -1");
  }
  return {effects,notes};
}
interface LifeChoice {title:string;description:string;options:{title:string;description:string;effects:Effects}[]}
let pendingChoice:LifeChoice|null=null;
const lifeChoices:Record<number,LifeChoice> = {
18:{title:"成年了，你想把时间投向哪里？",description:"时间、金钱与精力有限。选择一条路，也意味着暂时放下另一条。",options:[{title:"继续深造",description:"投资未来的学习机会。",effects:{money:-4500,career:12,san:4,happiness:3}},{title:"尽早工作",description:"先获得收入与经验。",effects:{money:3500,career:7,san:-3}},{title:"探索世界",description:"体验生活，结交朋友。",effects:{money:-2200,relationships:10,happiness:12,career:-2}}]},
25:{title:"人生进入新阶段，你要优先什么？",description:"每条路都有代价，选择会影响属性，但不会锁死未来。",options:[{title:"冲刺事业",description:"接受更多责任与挑战。",effects:{career:15,money:5000,san:-8,health:-3}},{title:"经营关系",description:"把时间留给重要的人。",effects:{relationships:15,happiness:10,career:-2}},{title:"建立财务基础",description:"控制开支，积累储备。",effects:{money:9000,happiness:3,san:3}}]},
35:{title:"你开始重新审视生活",description:"过去的选择带你来到这里。接下来，你希望怎样调整？",options:[{title:"争取更高的位置",description:"用压力换取事业空间。",effects:{career:18,money:12000,san:-10,relationships:-3}},{title:"照顾身心",description:"减少透支，恢复节奏。",effects:{health:14,san:10,happiness:8,career:-4}},{title:"修复重要关系",description:"主动陪伴与沟通。",effects:{relationships:18,happiness:9,san:5,money:-1800}}]},
45:{title:"人生中途，你想改变什么？",description:"你仍然可以改变方向，但不同选择会带来不同成本。",options:[{title:"创业或转型",description:"接受不确定性，争取新可能。",effects:{money:-7000,career:18,happiness:8,san:-5}},{title:"守住稳定",description:"降低风险，保护现有生活。",effects:{money:4500,san:5,health:3}},{title:"追求热爱",description:"把时间投入真正喜欢的事。",effects:{happiness:16,san:8,career:-3,money:-2500}}]},
60:{title:"进入人生后半程，你想留下什么？",description:"成功不只有一种定义。你可以选择成就、陪伴或平静。",options:[{title:"继续发挥经验",description:"以顾问、导师或志愿者的方式贡献经验。",effects:{career:8,relationships:8,happiness:7,san:-2}},{title:"陪伴家人朋友",description:"把时间留给珍惜的人。",effects:{relationships:15,happiness:12,san:5}},{title:"照顾自己，慢慢生活",description:"优先健康与内心平静。",effects:{health:10,san:10,happiness:8,career:-3}}]}
};
function chooseLifeOption(index:number):void {
 if(!pendingChoice)return;const option=pendingChoice.options[index];if(!option)return;
 const applied:Effects={};Object.keys(option.effects).forEach(k=>{const key=k as StatKey;const amount=option.effects[key]||0;applyEffect(key,amount);applied[key]=amount;});
 state.choiceAges.push(state.age);state.choicesMade+=1;
 const record:YearRecord={title:"人生抉择："+option.title,category:"人生选择",description:option.description+" 你的选择改变了人生方向。",effects:applied,minAge:state.age,maxAge:state.age,mood:"neutral",rarity:"uncommon",age:state.age,year:state.yearsLived,lifespanAfter:state.lifespan,healthAfter:state.health,moneyAfter:state.money,sanAfter:state.san};
 state.history.unshift(record);state.history=state.history.slice(0,60);latest.unshift(record);pendingChoice=null;
 notice="你做出了自己的选择。它不会决定全部人生，却会改变接下来的路。";save();render();
}
function renderChoiceButtons():string {
 if(!pendingChoice)return "";
 return '<div class="life-choice-question"><h3>'+pendingChoice.title+'</h3><p class="life-choice-hint">'+pendingChoice.description+'</p>'+pendingChoice.options.map((o,i)=>'<button class="life-draw-btn '+(i===1?'ten':'single')+' life-choice-draw-btn" data-choice="'+i+'"><span class="draw-icon">'+(i===0?'✧':i===1?'✦':'◇')+'</span><span><strong>'+o.title+'</strong><small>'+o.description+'<br>'+effectText(o.effects)+'</small></span></button>').join('')+'</div>';
}
function renderChoicePanel():string {
 if(pendingChoice)return "";
 return '<div class="life-panel life-choice-panel"><div class="life-section-head"><div><span class="life-kicker">YOUR DECISION</span><h2>人生岔路口</h2></div><span class="life-history-count">选择会影响属性</span></div><p class="life-panel-intro">'+(pendingChoice?pendingChoice.description:"关键年龄会出现人生选择。每个方案都有取舍。")+'</p>'+(pendingChoice?'<div class="life-choice-question"><h3>'+pendingChoice.title+'</h3><div class="life-choice-grid">'+pendingChoice.options.map((o,i)=>'<button class="life-choice-option" data-choice="'+i+'"><strong>'+o.title+'</strong><p>'+o.description+'</p><small>'+effectText(o.effects)+'</small></button>').join('')+'</div></div>':'<p class="life-choice-hint">尚未到达下一个关键人生阶段。</p>')+'</div>';
}
function calculateLifeScore():{score:number;grade:string;title:string;description:string} {
 const ageScore=clamp(state.age/90*25,0,25),healthScore=clamp(state.health,0,100)*.15,sanScore=clamp(state.san,0,100)*.12;
 const relationScore=clamp(state.relationships,0,100)*.10,happinessScore=clamp(state.happiness,0,100)*.13,careerScore=clamp(state.career,0,100)*.10;
 const wealthScore=clamp(Math.log10(Math.max(0,state.money)+1)/5*100,0,100)*.15;
 const score=Math.round(ageScore+healthScore+sanScore+relationScore+happinessScore+careerScore+wealthScore);
 const grade=score>=85?"S":score>=72?"A":score>=58?"B":score>=42?"C":"D";
 const best=[{name:"财富积累",value:wealthScore},{name:"健康管理",value:healthScore},{name:"精神韧性",value:sanScore},{name:"人际关系",value:relationScore},{name:"幸福感",value:happinessScore},{name:"事业成就",value:careerScore}].sort((a,b)=>b.value-a.value)[0]!;
 let title="平凡而真实的一生",description="人生不只由分数定义，那些没有被数字记录的瞬间同样重要。";
 if(state.age>=80&&state.happiness>=65&&state.relationships>=55){title="温暖丰盈的人生";description="你走过漫长岁月，也保留了快乐与重要的关系。";}
 else if(state.money>=100000&&state.career>=50){title="成就与财富并进";description="你建立了不错的物质基础，也在事业上留下成果。";}
 else if(state.health>=75&&state.san>=70){title="身心平衡的人生";description="你守住了身心状态，在生活里找到自己的节奏。";}
 else if(state.relationships>=80){title="被爱与记忆环绕";description="你在人与人的连接中留下深刻痕迹。";}
 else if(state.career>=80){title="奋斗者的故事";description="你在事业上投入努力，成就成为人生的重要篇章。";}
 else if(state.age<40){title="过早落幕的人生";description="这段人生比预期短暂。评分记录经历，不衡量生命价值。";}
 return {score,grade,title,description:description+" 你最突出的方面是："+best.name+"。"};
}
function renderEnding():string {
 const r=calculateLifeScore(),rows:[string,number|string][]=[["健康",state.health],["SAN / 精神",state.san],["人际关系",state.relationships],["幸福感",state.happiness],["事业发展",state.career],["最终资产",formatMoney(state.money)]];
 return '<div class="life-ending-report"><div class="ending-score"><span>人生综合评分</span><strong>'+r.score+'</strong><small>/ 100 · '+r.grade+' 级</small></div><div class="ending-title"><span>人生结局</span><h3>'+r.title+'</h3><p>'+r.description+'</p><p>你活到了 <strong>'+state.age+' 岁</strong>，做出了 <strong>'+state.choicesMade+' 次人生选择</strong>，经历了 <strong>'+state.yearsLived+' 年</strong>。</p></div><div class="ending-stats">'+rows.map(x=>'<div><span>'+x[0]+'</span><strong>'+x[1]+'</strong></div>').join('')+'</div><p class="ending-footnote">评分综合寿命、财富、健康、精神、人际关系、幸福感与事业，仅用于游戏反馈，不代表真实人生价值。</p></div>';
}
function playYears(count:1|10):void {
  if(state.ended || pendingChoice) return;
  latest=[];
  for(let i=0;i<count;i++){
    if(state.ended || state.lifespan<=0) break;
    state.lifespan-=1;
    state.age+=1;
    state.yearsLived+=1;
    const event=chooseEvent(state.age);
    const appliedEffects:Effects={};
    Object.keys(event.effects).forEach(k=>{
      const key=k as StatKey;
      const amount=calculateEffect(event.effects[key]||0);
      appliedEffects[key]=amount;
      applyEffect(key,amount);
    });
    const annual=applyAnnualSystems();
    Object.keys(annual.effects).forEach(k=>{
      const key=k as StatKey;
      appliedEffects[key]=(appliedEffects[key]||0)+(annual.effects[key]||0);
    });
    let penalty="";
    if(state.health<20){state.lifespan=Math.max(0,state.lifespan-1);penalty="健康过低，额外损耗 1 年寿元。";}
    if(state.san<15){state.lifespan=Math.max(0,state.lifespan-1);penalty+=(penalty?" ":"")+"SAN 过低，额外损耗 1 年寿元。";}
    const record:YearRecord={...event,effects:appliedEffects,age:state.age,year:state.yearsLived,lifespanAfter:state.lifespan,healthAfter:state.health,moneyAfter:state.money,sanAfter:state.san};
    if(annual.notes.length) record.description += " 年度结算："+annual.notes.join("；")+"。";
    if(penalty) record.description += " "+penalty;
    latest.push(record);
    state.history.unshift(record);
    state.history=state.history.slice(0,60);
    if(state.health<=0){state.ended=true;state.ending="健康归零，生命走到了终点。";break;}
    if(state.lifespan<=0){state.ended=true;state.lifespan=0;state.ending="寿元耗尽，人生落下帷幕。";break;}
    if(lifeChoices[state.age] && !state.choiceAges.includes(state.age)){pendingChoice=lifeChoices[state.age];break;}
  }
  if(state.ended) notice="人生已结束。回顾这段旅程，或重新开始一段新人生。";
  else notice="本次经历了 "+latest.length+" 年。每个选择与意外，都悄悄改变着你的人生。普通、少见、稀有与传说事件有不同的抽取权重和数值影响。";
  save();render();
}
function statBar(label:string,value:number,detail:string):string {
  const width=clamp(value,0,100);
  return '<div class="life-stat"><div class="life-stat-head"><span>'+label+'</span><strong>'+detail+'</strong></div><div class="life-stat-track"><div style="width:'+width+'%"></div></div></div>';
}
interface LifeGoal {title:string;description:string;progress:number;target:number;reward:string;complete:boolean}
function getLifeGoals():LifeGoal[] {
 return [
  {title:"建立安全储备",description:"资产达到 ¥50,000",progress:Math.max(0,state.money),target:50000,reward:"财务安全",complete:state.money>=50000},
  {title:"成为行业能手",description:"事业值达到 50",progress:state.career,target:50,reward:"职业成就",complete:state.career>=50},
  {title:"经营深厚关系",description:"人际关系达到 70",progress:Math.max(0,state.relationships),target:70,reward:"人际支持",complete:state.relationships>=70},
  {title:"照顾好自己",description:"健康达到 80",progress:state.health,target:80,reward:"健康基础",complete:state.health>=80},
  {title:"找到生活满足感",description:"幸福感达到 75",progress:Math.max(0,state.happiness),target:75,reward:"内心满足",complete:state.happiness>=75},
  {title:"走过漫长人生",description:"累计经历 60 年",progress:state.yearsLived,target:60,reward:"人生阅历",complete:state.yearsLived>=60}
 ];
}
function renderGoals():string {
 const goals=getLifeGoals(),done=goals.filter(g=>g.complete).length;
 return '<div class="life-goals-summary"><div class="life-goals-count"><strong>'+done+' / '+goals.length+'</strong><span>人生目标完成</span></div><div class="life-goals-grid">'+goals.map(g=>{const p=clamp(g.progress/g.target*100,0,100);return '<article class="life-goal '+(g.complete?'complete':'')+'"><div class="life-goal-top"><strong>'+(g.complete?'✓ ':'◇ ')+g.title+'</strong><span>'+(g.complete?'已完成':Math.floor(p)+'%')+'</span></div><p>'+g.description+'</p><div class="life-goal-track"><div style="width:'+p+'%"></div></div><small>'+(g.complete?'已达成：':'目标：')+g.reward+'</small></article>';}).join('')+'</div></div>';
}
function getAchievements():{title:string;description:string;icon:string;earned:boolean}[] {
 return [
  {title:"人生新手",description:"经历第一年",icon:"✦",earned:state.yearsLived>=1},
  {title:"储蓄达人",description:"资产达到 ¥100,000",icon:"◈",earned:state.money>=100000},
  {title:"事业有成",description:"事业值达到 100",icon:"♜",earned:state.career>=100},
  {title:"人缘广阔",description:"人际关系达到 100",icon:"♡",earned:state.relationships>=100},
  {title:"身心强健",description:"健康与 SAN 均达到 100",icon:"✚",earned:state.health>=100&&state.san>=100},
  {title:"幸福人生",description:"幸福感达到 100",icon:"☀",earned:state.happiness>=100},
  {title:"传奇人生",description:"活到 80 岁",icon:"⌛",earned:state.age>=80},
  {title:"绝境求生",description:"曾经负债，后来资产转正",icon:"↗",earned:state.history.some(h=>h.moneyAfter<0)&&state.money>=0}
 ];
}
function renderAchievements():string {
 const items=getAchievements(),earned=items.filter(a=>a.earned).length;
 return '<div class="life-achievements-head">已解锁 '+earned+' / '+items.length+'</div><div class="life-achievements-grid">'+items.map(a=>'<article class="life-achievement '+(a.earned?'earned':'locked')+'"><span class="achievement-icon">'+a.icon+'</span><div><strong>'+a.title+'</strong><p>'+a.description+'</p></div><span class="achievement-state">'+(a.earned?'已解锁':'未解锁')+'</span></article>').join('')+'</div>';
}
function renderEvents():string {
  if(!latest.length) return '<div class="life-empty"><div>✦</div><h3>你的人生故事尚未开始</h3><p>每抽一次，时间就向前走一年。命运可能给予惊喜，也可能带来考验。</p></div>';
  return '<div class="life-event-grid">'+latest.map((e,i)=>'<article class="life-event '+e.mood+'" style="--delay:'+(i*35)+'ms"><div class="life-event-top"><span>'+e.category+' · '+rarityRules[e.rarity].label+'事件</span><strong>'+e.age+' 岁</strong></div><h3>'+e.title+'</h3><p>'+e.description+'</p><div class="life-effects">'+effectText(e.effects)+'</div><div class="life-event-foot">剩余寿元 '+e.lifespanAfter+' 年</div></article>').join("")+'</div>';
}
function renderHistory():string {
  if(!state.history.length) return '<div class="life-empty compact">还没有人生记录。开始抽卡，书写你的第一年。</div>';
  return '<div class="life-timeline">'+state.history.slice(0,20).map(e=>'<article class="life-timeline-row '+e.mood+'"><div class="timeline-age">'+e.age+'<small>岁</small></div><div class="timeline-copy"><strong>'+e.title+'</strong><p>'+e.description+'</p><small>'+e.category+' · '+rarityRules[e.rarity].label+'事件 · '+effectText(e.effects)+'</small></div><div class="timeline-life">寿元 '+e.lifespanAfter+'</div></article>').join("")+'</div>';
}
function render():void {
 const app=document.querySelector<HTMLDivElement>("#app"); if(!app)return;
 const ended=state.ended;
 app.innerHTML='<div class="life-shell"><header class="life-header"><a class="life-brand" href="#" data-action="home"><span>⌛</span><div><strong>人生抽卡模拟器</strong><small>ONE LIFE, MANY POSSIBILITIES</small></div></a><div class="life-header-right"><span class="life-save">● 本地自动存档</span><button class="life-reset" data-action="reset">重新开始</button></div></header><section class="life-hero"><div class="life-hero-copy"><div class="life-eyebrow">LIFE SIMULATION · 命运抽卡</div><h1>你的一生，<br><em>会抽到什么？</em></h1><p>每一次抽卡，都是人生向前的一年。健康、金钱、SAN、关系与机遇共同塑造你的命运。</p><div class="life-hero-tags"><span>✦ 每抽消耗 1 年寿元</span><span>✦ 十连经历 10 年</span><span>✦ 人生没有固定结局</span></div></div><div class="life-hourglass" aria-hidden="true"><div class="hourglass-glow"></div><div class="hourglass">⌛</div><div class="hourglass-orbit orbit-a"></div><div class="hourglass-orbit orbit-b"></div><span class="hourglass-caption">MEMENTO VITAE</span></div></section><section class="life-dashboard"><div class="life-main-column"><div class="life-panel life-status-panel"><div class="life-section-head"><div><span class="life-kicker">YOUR LIFE</span><h2>人生状态</h2></div><span class="life-age-chip">'+(ended?"人生终章":state.age+" 岁")+'</span></div><div class="life-origin-card"><span>🎲 本次人生起点</span><strong>'+state.origin+'</strong><small>先天特质：'+state.trait+'</small></div><div class="life-vitals"><div class="life-lifespan"><span>⌛ 剩余寿元</span><strong>'+state.lifespan+'<small>年</small></strong><div class="lifespan-track"><div style="width:'+clamp(state.lifespan/80*100,0,100)+'%"></div></div><small>初始 80 年 · 每次抽卡消耗 1 年</small></div><div class="life-vital-mini"><span>💰 当前资产</span><strong>'+formatMoney(state.money)+'</strong><span>🧭 累计经历</span><strong>'+state.yearsLived+' 年</strong></div></div><div class="life-stats-grid">'+statBar("健康",state.health,""+state.health)+statBar("SAN / 精神",state.san,""+state.san)+statBar("人际关系",state.relationships,""+state.relationships)+statBar("幸福感",state.happiness,""+state.happiness)+statBar("事业发展",state.career,""+state.career)+'</div><p class="life-rule-note">⚠ 成年后每年结算收入与生活开支；负债会增加精神压力，储蓄和良好人际关系会提供支持。健康、幸福感也会影响 SAN。健康低于 20 或 SAN 低于 15 时，每年额外损耗 1 年寿元；健康归零或寿元归零，人生结束。</p></div><div class="life-panel life-story-panel"><div class="life-section-head"><div><span class="life-kicker">FATE DRAW</span><h2>命运事件</h2></div><span class="life-history-count">本次 '+latest.length+' 年</span></div><p class="life-notice" role="status">'+notice+'</p>'+renderEvents()+'</div>'+renderChoicePanel()+'<div class="life-panel life-goals-panel"><div class="life-section-head"><div><span class="life-kicker">PERSONAL QUESTS</span><h2>人生目标</h2></div><span class="life-history-count">持续成长</span></div><p class="life-panel-intro">没有唯一的胜利条件。你可以追求财富、事业、关系、健康、幸福，也可以慢慢走完人生。</p>'+renderGoals()+'</div><div class="life-panel life-achievements-panel"><div class="life-section-head"><div><span class="life-kicker">MILESTONES</span><h2>人生成就</h2></div><span class="life-history-count">记录你的高光时刻</span></div>'+renderAchievements()+'</div><div class="life-panel life-history-panel"><div class="life-section-head"><div><span class="life-kicker">MEMORIES</span><h2>人生回忆</h2></div><span class="life-history-count">最近 '+Math.min(20,state.history.length)+' 年</span></div>'+renderHistory()+'</div></div><aside class="life-side-column"><div class="life-panel life-draw-panel"><span class="life-kicker">NEXT CHAPTER</span><h2>抽取人生</h2><p>下一张卡牌会揭晓未来一年发生的事。你无法预知结果，只能继续生活。</p>'+(pendingChoice?renderChoiceButtons():'<button class="life-draw-btn single" data-action="single" '+(ended?'disabled':'')+'><span class="draw-icon">✧</span><span><strong>抽卡 × 1</strong><small>经历 1 年 · 消耗 1 年寿元</small></span></button><button class="life-draw-btn ten" data-action="ten" '+(ended?'disabled':'')+'><span class="draw-icon">✦</span><span><strong>十连抽 × 10</strong><small>经历最多 10 年 · 消耗最多 10 年寿元</small></span></button>')+'<div class="life-draw-foot">人生事件包含成长、学习、工作、金钱、爱情、家庭、健康、友情、退休与老年生活等。少数事件极其罕见，可能彻底改写人生。</div>'+(ended?'<div class="life-ending"><span>人生终章</span><strong>'+state.age+' 岁 · '+state.ending+'</strong>'+renderEnding()+'<button data-action="reset">开启新人生 ↗</button></div>':'')+'</div><div class="life-panel life-principles"><span class="life-kicker">LIFE IS UNPREDICTABLE</span><h3>人生规则</h3><div class="life-rule"><span>01</span><div><strong>时间不可逆</strong><p>每次抽卡都会让年龄增长，寿元减少。</p></div></div><div class="life-rule"><span>02</span><div><strong>属性会互相影响</strong><p>事业决定现金流，金钱、人际关系、幸福感和健康会共同影响精神状态；健康或 SAN 太低会加速消耗寿元。</p></div></div><div class="life-rule"><span>03</span><div><strong>没有完美人生</strong><p>好运与挫折交替发生，平凡的一年也值得记录。</p></div></div><div class="life-rule"><span>04</span><div><strong>目标与成就</strong><p>积累资产、发展事业、经营关系或照顾身体，都可能成为你的人生目标。</p></div></div><div class="life-rule"><span>04</span><div><strong>每次人生都不同</strong><p>事件随机生成，结果保存在当前浏览器。</p></div></div></div></aside></section><footer class="life-footer"><span>⌛ 人生抽卡模拟器 · ONE LIFE, MANY POSSIBILITIES</span><span>纯前端模拟 · 事件与数值均为虚构游戏规则</span></footer></div>';
 app.querySelectorAll<HTMLButtonElement>("[data-choice]").forEach(button=>button.addEventListener("click",()=>chooseLifeOption(Number(button.dataset.choice))));
 app.querySelectorAll<HTMLButtonElement>("[data-action]").forEach(button=>button.addEventListener("click",()=>{
  const action=button.dataset.action;
  if(action==="single")playYears(1);
  if(action==="ten")playYears(10);
  if(action==="home"){window.scrollTo({top:0,behavior:"smooth"});render();}
  if(action==="reset"&&window.confirm("确定结束当前人生并重新开始吗？当前人生记录将被清空。")){
   state=newLife();latest=[];pendingChoice=null;notice="新的人生已经开始。你的出生背景与先天特质已随机生成，命运仍然未知。";save();render();window.scrollTo({top:0,behavior:"smooth"});
  }
 }));
}
render();
