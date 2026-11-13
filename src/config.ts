/**
 * 运营配置中心
 * 面试题、选项权重、结果文案、CTA 链接、埋点地址都在这里改，不用动组件代码。
 */

export type Dim = 'tech' | 'vision' | 'business' | 'creativity' | 'confidence'

export interface Option {
  id: string // 选项唯一 id，会进入埋点，改文案时不要改 id
  text: string
  weights: Partial<Record<Dim, number>>
  /** 只有感情题的选项有：结果页与海报上的「感情忠贞度」 */
  loyalty?: string
}

export interface Question {
  id: string
  title: string
  options: Option[]
}

export interface Persona {
  id: string
  dim: Dim // 该人格对应的最高维度
  title: string
  tagline: [string, string]
  oneLiner: string
  board: string
  tag: string
}

/* ------------------------------------------------------------------ */
/* 站点与社团                                                          */
/* ------------------------------------------------------------------ */

export const site = {
  productName: "Who's the Next CEO?",
  productNameZh: '英伟达 CEO 招聘模拟器',
  slogan: '老黄离职了，这个 CEO 你来当？',
  club: 'ViberSpace',
  /** 线上地址：海报二维码、海报网址、挑战文案都用它。留空则自动使用当前页面地址 */
  siteUrl: 'https://catdisgust.github.io/next-ceo/',
  disclaimer: '非官方娱乐模拟器 · 与 NVIDIA 无任何关联 · 不是真实招聘',
}

/**
 * 热点文案（与通用玩法分离）。
 * 热点过去后只需替换这里，整个模拟器仍可作为「CEO 人格测试」长期保留。
 */
export const newsHook = {
  kicker: 'BREAKING · 招聘公告',
  headline: ['老黄离职了。', '现在，轮到你当', '英伟达 CEO 了。'],
  sub: [
    '董事会正在物色新 CEO（这是真的），现向全体网友开放（这是假的）。',
    '六道面试题，看看你能不能镇住整个 AI 圈。',
  ],
  cta: '我要应聘 CEO',
  ctaHint: '0 年工作经验也可以试试。',
}

/**
 * 社团 CTA：上线前请填写真实链接。
 * 留空时：开发环境显示「待配置」，生产环境自动隐藏该按钮，不会指向不存在的入口。
 */
export const clubCta = {
  title: '这个离谱的面试系统，是一群大学生用 AI 做的。',
  body: [
    '我们是 ViberSpace。',
    '我们喜欢把一些奇奇怪怪的想法，变成真的能玩的产品。',
    '不会写代码也没关系。',
    '从一个想法开始，一起做点有趣的事。',
  ],
  primary: { label: '看看我们还做过什么', url: '' },
  secondary: { label: '我也想一起做点东西', url: '' },
}

/**
 * 埋点：
 * - 页面里如果加载了 Umami / Plausible，会自动调用它们；
 * - 否则若填写 endpoint，会用 sendBeacon POST JSON 到该地址；
 * - 两者都没有时只在控制台打印（开发调试用）。
 * 不采集任何姓名、邮箱、电话、学校账号或精确位置。
 */
export const analytics = {
  endpoint: '',
}

/* ------------------------------------------------------------------ */
/* 维度                                                                */
/* ------------------------------------------------------------------ */

export const dims: Record<Dim, { label: string; en: string; strength: string; weakness: string }> = {
  tech: {
    label: '技术力',
    en: 'Technical',
    strength: '能在董事会上徒手讲清 CUDA（虽然没人听懂）',
    weakness: '至今以为 CUDA 是一种咖喱',
  },
  vision: {
    label: '画饼力',
    en: 'Vision',
    strength: '极强的想象力，PPT 第一页就是万亿市场',
    weakness: '公司五年规划只写到了下周三',
  },
  business: {
    label: '商业嗅觉',
    en: 'Business',
    strength: '对「加钱」两个字有天然的敏感度',
    weakness: '差点把 GPU 按白菜价卖了',
  },
  creativity: {
    label: '整活创意',
    en: 'Creativity',
    strength: '遇事不决先问 AI，AI 不决再整个活',
    weakness: '发布会像在念产品说明书',
  },
  confidence: {
    label: '迷之自信',
    en: 'Confidence',
    strength: '自信心的算力已超过全球所有数据中心',
    weakness: '记者问一句「你确定吗」就想辞职',
  },
}

/** 平分时的优先级（越靠前越优先），保证同分时结果稳定 */
export const tieBreak: Dim[] = ['creativity', 'vision', 'tech', 'business', 'confidence']

/* ------------------------------------------------------------------ */
/* 面试题（每个选项总分保持 3；感情题选项额外带「感情忠贞度」）          */
/* ------------------------------------------------------------------ */

export const questions: Question[] = [
  {
    id: 'q1',
    title: '董事会正在内外部同时物色新 CEO。你作为外部候选人走进面试间，开口第一句是？',
    options: [
      { id: 'q1a', text: '「不用介绍了，我的皮衣已经在路上了。」', weights: { confidence: 3 } },
      { id: 'q1b', text: '「先聊薪资。股价跌掉的那 4%，算谁的？」', weights: { business: 3 } },
      { id: 'q1c', text: '「请问 CUDA 那道题，可以开卷吗？」', weights: { tech: 2, creativity: 1 } },
      { id: 'q1d', text: '「我不是来应聘的，我是来带你们去下一个万亿市场的。」', weights: { vision: 3 } },
    ],
  },
  {
    id: 'q2',
    title: '上任第一天，下周就要发财报了。你先干什么？',
    options: [
      { id: 'q2a', text: '全员放假三天，财报让 AI 先写个初稿。', weights: { creativity: 2, confidence: 1 } },
      { id: 'q2e', text: '宣布全线显卡打骨折：财报可以难看，口碑必须好看。', weights: { business: 3 } },
      { id: 'q2b', text: '连夜补课：CUDA、Blackwell、Rubin 到底谁是谁。', weights: { tech: 3 } },
      { id: 'q2f', text: '先定制一件新皮衣，发布会的气势不能输。', weights: { confidence: 2, vision: 1 } },
    ],
  },
  {
    id: 'q3',
    title: '全球大厂的 CEO 排队给你打电话要 GPU，你的统一回复是？',
    options: [
      { id: 'q3a', text: '「请取号排队，当前预计等待：18 个月。」', weights: { business: 2, tech: 1 } },
      { id: 'q3b', text: '「买得越多，省得越多。」', weights: { business: 3 } },
      { id: 'q3c', text: '「我们正在重新定义算力的未来，请稍后再拨。」', weights: { vision: 2, confidence: 1 } },
      { id: 'q3d', text: '「卡没有。要不你先借我点钱扩产？」', weights: { creativity: 2, business: 1 } },
    ],
  },
  {
    id: 'q_love',
    title: '你刚当上 CEO，白月光突然发来消息：「听说你现在很厉害？」你怎么回？',
    options: [
      { id: 'love_a', text: '已读不回。我现在只对 GPU 专一。', weights: { confidence: 3 }, loyalty: '忠贞不二 · 只爱 GPU' },
      { id: 'love_b', text: '「等我把市值做回去，再来找你。」', weights: { vision: 3 }, loyalty: '画饼型深情' },
      { id: 'love_c', text: '让 AI 帮我写一条既体面又暧昧的回复。', weights: { creativity: 3 }, loyalty: 'AI 代理恋爱' },
      { id: 'love_d', text: '「先说清楚，你现在用的是什么显卡？」', weights: { tech: 3 }, loyalty: '硬件至上主义' },
    ],
  },
  {
    id: 'q4',
    title: '竞争对手发布了一款比你便宜十倍的芯片，你怎么办？',
    options: [
      { id: 'q4a', text: '连夜召集研发：下一代芯片，提前发布。', weights: { tech: 3 } },
      { id: 'q4b', text: '发条动态：「真正的高手，从不在乎价格。」', weights: { confidence: 3 } },
      { id: 'q4c', text: '先买一个回来拆开看看，看完挂闲鱼回血。', weights: { tech: 2, creativity: 1 } },
      { id: 'q4d', text: '宣布英伟达转型做奶茶，第一杯叫「CUDA 拿铁」。', weights: { creativity: 3 } },
    ],
  },
  {
    id: 'q5',
    title: '最后一题。董事会问：你凭什么觉得自己能胜任？',
    options: [
      { id: 'q5a', text: '「我不能，但我可以边做边学。大模型不也是边训边学？」', weights: { tech: 1, creativity: 2 } },
      { id: 'q5b', text: '「我不懂技术，但我会用 AI。」', weights: { creativity: 3 } },
      { id: 'q5c', text: '「我的自信，已经超过了 GPU 的算力。」', weights: { confidence: 3 } },
      { id: 'q5d', text: '「先让我试用三个月，股价涨回来再转正。」', weights: { business: 2, vision: 1 } },
    ],
  },
]

/** 没有答感情题时的兜底（理论上不会出现） */
export const defaultLoyalty = '心里只有工作'

/* ------------------------------------------------------------------ */
/* 五种 CEO 人格                                                       */
/* ------------------------------------------------------------------ */

export const personas: Persona[] = [
  {
    id: 'cuda',
    dim: 'tech',
    title: 'CUDA 技术狂魔',
    tagline: ['你可能真的懂一点技术。', '可惜董事会听不懂你在说什么。'],
    oneLiner: '你的就职演讲里，有 47% 是代码。',
    board: '建议任命为首席技术布道官，并配一名翻译。',
    tag: '#CUDA原住民',
  },
  {
    id: 'vision',
    dim: 'vision',
    title: '战略画饼大师',
    tagline: ['GPU 可以不够，梦想必须管够。', '你已经在规划下一代 AI 帝国了。'],
    oneLiner: '你的愿景，已经超过了 GPU 的算力。',
    board: '适合担任愿景首席负责人，饼由你画，活由别人干。',
    tag: '#画饼不限量',
  },
  {
    id: 'price',
    dim: 'business',
    title: '显卡价格终结者',
    tagline: ['你的上任宣言只有一句：', '「从今天开始，显卡不许卖这么贵。」'],
    oneLiner: '全球玩家已经在给你众筹皮衣了。',
    board: '财务总监听完已晕倒，建议暂缓公开发言。',
    tag: '#显卡自由',
  },
  {
    id: 'ppt',
    dim: 'confidence',
    title: 'PPT 帝国继承人',
    tagline: ['你不一定能造出下一代 GPU。', '但你一定能做出下一代 GPU 的发布会。'],
    oneLiner: '发布会还没开，你的皮衣已经上热搜了。',
    board: '适合担任首席发布会官，严禁接触财报。',
    tag: '#皮衣已就位',
  },
  {
    id: 'vibe',
    dim: 'creativity',
    title: '天选 Vibe CEO',
    tagline: ['不会写 CUDA？没关系。', '你已经准备好让 AI 帮你写了。'],
    oneLiner: '你不写代码，但代码都在为你工作。',
    board: '全票通过。董事会也想知道你用的是哪个 AI。',
    tag: '#VibeCEO',
  },
]

/** 录用结论与身份标签，按虚构评分分档（min 从高到低） */
export const scoreBands = [
  { min: 90, verdict: '当场录用，皮衣尺码已登记', tag: '#董事会一致通过' },
  { min: 78, verdict: '进入终面，董事会正在激烈讨论', tag: '#CEO预备役' },
  { min: 62, verdict: '建议先从实习 CEO 做起', tag: '#实习CEO' },
  { min: 0, verdict: '董事会需要冷静一下', tag: '#试用期CEO' },
]

/** 审核动画台词 */
export const reviewLines = [
  '正在分析你的商业天赋……',
  '正在评估你能否在财报前稳住股价……',
  '正在确认你是否知道 CUDA 是什么……',
  '董事会陷入了沉默……',
]

/** 挑战文案模板：{title} {loyalty} {score} {url} 会被替换 */
export const shareTemplate =
  '我去面试英伟达 CEO 了，董事会说我适合当「{title}」，感情忠贞度：{loyalty}，模拟评分 {score} 分。你能拿多少分？{url}'
