/**
 * 运营配置中心
 * 面试题、选项权重、结果文案、CTA 链接、埋点地址都在这里改，不用动组件代码。
 */

export type Dim = 'tech' | 'vision' | 'business' | 'creativity' | 'confidence'

export interface Option {
  id: string // 选项唯一 id，会进入埋点，改文案时不要改 id
  text: string
  weights: Partial<Record<Dim, number>>
  /** 选完后弹出的董事会反应，每个元素一行 */
  reaction: string[]
  /** 只有感情题的选项有：结果页与海报上的「隐藏情感称号」 */
  hiddenTitle?: string
}

export interface Question {
  id: string
  /** 小标题，例如「第一印象」 */
  tag: string
  /** 情景铺垫，每个元素一行 */
  scene: string[]
  /** 真正的问题（大字显示） */
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
  productNameZh: '下一任英伟达 CEO，要不你来？',
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
  primary: { label: '看看我们还做过什么', url: 'https://viberspace.io' },
  secondary: { label: '我也想一起做点东西', url: 'https://viberspace.io' },
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
/* 面试题（每个选项总分 3 分；感情题选项额外带「隐藏情感称号」）          */
/* ------------------------------------------------------------------ */

export const questions: Question[] = [
  {
    id: 'q1',
    tag: '第一印象',
    scene: ['董事会正在物色下一任 CEO。', '你推开会议室的门，十几双眼睛齐刷刷看向你。'],
    title: '面试官：「简单介绍一下自己？」',
    options: [
      {
        id: 'q1a',
        text: '「不用介绍了，我的皮衣已经在路上了。」',
        weights: { confidence: 3 },
        reaction: ['HR 默默把你的名字圈了起来。', '旁边写着：「有那味了。」'],
      },
      {
        id: 'q1b',
        text: '「先聊薪资吧，我想确认一下自己的市值。」',
        weights: { business: 3 },
        reaction: ['CFO 原本在玩手机。', '现在突然坐直了。'],
      },
      {
        id: 'q1c',
        text: '「我带了性能测试数据。就是跑分用的是我宿舍的 RTX 3060。」',
        weights: { tech: 3 },
        reaction: ['CTO 露出了今天第一个微笑。', '虽然不知道是欣慰还是同情。'],
      },
      {
        id: 'q1d',
        text: '「我不是来接替黄仁勋的，我是来接替摩尔定律的。」',
        weights: { vision: 3 },
        reaction: ['全场沉默。', '公关部已经开始拟新闻稿了。'],
      },
    ],
  },
  {
    id: 'q2',
    tag: '上任第一天',
    scene: [
      '面试官决定考验你的商业能力。',
      '假设你明天就上任，下周还要发布财报。',
      'CFO 把一份 87 页的文件放在你面前。',
    ],
    title: '「CEO，你的第一项决策是什么？」',
    options: [
      {
        id: 'q2a',
        text: '「先把 Excel 里所有红色数字改成荧光绿。至少看起来很英伟达。」',
        weights: { creativity: 3 },
        reaction: ['CFO：「我做了二十年财务，第一次见这种解决方案。」', '但他居然没有反对。'],
      },
      {
        id: 'q2b',
        text: '「财报先别急着发，我想确认一下 AI 热潮到底给我们赚了几个零。」',
        weights: { business: 3 },
        reaction: ['CFO 眼睛亮了。', '「这位候选人终于开始问钱了。」'],
      },
      {
        id: 'q2c',
        text: '「Blackwell、Rubin、CUDA……今晚给我安排个通宵培训。」',
        weights: { tech: 3 },
        reaction: ['技术部门表示非常感动。', '但已经有人开始准备 400 页 PPT 了。'],
      },
      {
        id: 'q2d',
        text: '「先定制一件新皮衣，发布会的气势不能输。」',
        weights: { confidence: 2, vision: 1 },
        reaction: ['行政部已经开始联系供应商。', 'CFO：「所以这笔算研发费用还是营销费用？」'],
      },
    ],
  },
  {
    id: 'q3',
    tag: '客户管理',
    scene: [
      '你刚坐上 CEO 的位置。',
      '微软、OpenAI、Meta 的 CEO 同时打来电话。',
      '三个人只说了一句话：「还有 GPU 吗？」',
    ],
    title: '你怎么回复？',
    options: [
      {
        id: 'q3a',
        text: '「别急，我正在研究怎么把排队时间也做成订阅服务。」',
        weights: { business: 3 },
        reaction: ['CFO 当场鼓掌。', '「你怎么知道我们还没收这个钱？」'],
      },
      {
        id: 'q3b',
        text: '「不要老想着显卡。我们应该聊聊人类文明的下一个阶段。」',
        weights: { vision: 3 },
        reaction: ['对面沉默了五秒。', '然后默默追加了订单。'],
      },
      {
        id: 'q3c',
        text: '「你先把现有 GPU 的利用率发来。别告诉我你们买回去在跑贪吃蛇。」',
        weights: { tech: 3 },
        reaction: ['技术部门给你点了个赞。', '销售部门把你拉进了免打扰群。'],
      },
      {
        id: 'q3d',
        text: '「卡没有。要不我先给你们发个许愿链接？转发三个 CEO 可以提高出货概率。」',
        weights: { creativity: 3 },
        reaction: ['三位 CEO 居然真的转发了。', '现在硅谷的群聊有点失控。'],
      },
    ],
  },
  {
    id: 'q_love',
    tag: '私人危机',
    scene: [
      '面试官突然拿出一张纸：「现在考考你的危机处理能力。」',
      '假设你已经是 CEO。某天深夜，你的白月光突然发来一条消息：',
    ],
    title: '「听说你现在很厉害？」\n你怎么回复？',
    options: [
      {
        id: 'love_a',
        text: '「您好，您已进入上市公司合规聊天模式。所有消息均有可能出现在下季度财报里。」',
        weights: { business: 3 },
        hiddenTitle: '合规型海王',
        reaction: ['法务部激动地站了起来。', '「这才是我们想要的 CEO！」'],
      },
      {
        id: 'love_b',
        text: '「我们的关系具有长期向好的基本面，具体进展将在下个季度披露。」',
        weights: { vision: 3 },
        hiddenTitle: '情感战略家',
        reaction: ['白月光：「所以到底什么意思？」', '投资者关系部门：「非常标准的回答。」'],
      },
      {
        id: 'love_c',
        text: '把消息发给 AI，生成 20 条回复，再让另一个 AI 选出最不像 AI 写的那条。',
        weights: { creativity: 3 },
        hiddenTitle: '恋爱自动驾驶',
        reaction: ['AI 最后建议：「不建议回复。」', '你觉得模型可能有了自我意识。'],
      },
      {
        id: 'love_d',
        text: '已读不回。我已经决定和 CUDA 共度余生。',
        weights: { confidence: 3 },
        hiddenTitle: 'GPU 纯爱战神',
        reaction: ['CUDA：「？」', '「我们什么时候在一起的？」'],
      },
    ],
  },
  {
    id: 'q5',
    tag: '竞争危机',
    scene: ['面试进入最终压力测试。', '竞争对手突然发布一款价格只有你们十分之一的芯片。', '董事会全体看向你。'],
    title: '「CEO，我们该怎么办？」',
    options: [
      {
        id: 'q5a',
        text: '「先买三张回来。一张拆架构，一张测性能，还有一张防止第一张拆坏。」',
        weights: { tech: 3 },
        reaction: ['CTO 感动得快哭了：「终于来了个懂硬件的。」', '采购部：「等等，这就三张了？」'],
      },
      {
        id: 'q5b',
        text: '「他们比我们便宜十倍？很好，说明我们的高端定位非常成功。」',
        weights: { confidence: 3 },
        reaction: ['市场部沉默了。', '然后把这句话写进了明年的品牌战略。'],
      },
      {
        id: 'q5c',
        text: '「先联系他们。打不过就谈合作，合作不了就谈收购。」',
        weights: { business: 3 },
        reaction: ['法务：「你知道这有多复杂吗？」', 'CFO：「但我喜欢他的思路。」'],
      },
      {
        id: 'q5d',
        text: '「从今天起，英伟达正式进军玄学。GPU 不算了，我们算你命里有没有 GPU。」',
        weights: { creativity: 3 },
        reaction: ['三分钟后，官网新增一项服务：', '「AI 算命，$19.99 / 月。」', 'CFO 表示可以再讨论讨论。'],
      },
    ],
  },
  {
    id: 'q6',
    tag: '终极面试',
    scene: [
      '面试终于结束。董事会成员交换了一下眼神。',
      '董事长缓缓站起来：「我们一致决定……」',
      '「恭喜，你被录用了。」',
    ],
    title: '「现在，你还有什么想说的？」',
    options: [
      {
        id: 'q6a',
        text: '「？？？不是哥们，我以为这是个小游戏啊？」',
        weights: { creativity: 3 },
        reaction: ['HR：「我们也以为你是来整活的。」', '「但刚才有人已经给你开好工牌了。」'],
      },
      {
        id: 'q6b',
        text: '「等一下，能先给我配台电脑吗？我的笔记本连公司官网都快打不开了。」',
        weights: { tech: 3 },
        reaction: ['IT：「预算多少？」', '你：「我是 CEO。」', 'IT：「那也得走审批。」'],
      },
      {
        id: 'q6c',
        text: '「感谢各位。我上任后的第一件事，就是让全世界的人都来参加这个 CEO 面试。」',
        weights: { vision: 3 },
        reaction: ['增长团队突然精神了。', '「CEO，您说的这个用户增长模型……有点东西。」'],
      },
      {
        id: 'q6d',
        text: '「其实我刚才一道题都没听懂，但你们不觉得我一直很有 CEO 的气质吗？」',
        weights: { confidence: 3 },
        reaction: ['董事长摘下眼镜。', '「你知道吗，这正是我们最担心、又最欣赏你的地方。」'],
      },
    ],
  },
]

/** 没有答感情题时的兜底（理论上不会出现） */
export const defaultHiddenTitle = '心里只有工作'

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
/** 所有玩家都会被录用（虚构），分档只影响录用评语和标签 */
export const scoreBands = [
  { min: 90, verdict: '全票通过，皮衣尺码已登记', tag: '#董事会一致通过' },
  { min: 78, verdict: '录用通过，董事会仍在消化你的发言', tag: '#CEO预备役' },
  { min: 62, verdict: '录用通过，附赠三个月试用期', tag: '#实习CEO' },
  { min: 0, verdict: '已录用，董事会集体请了半天假', tag: '#试用期CEO' },
]

/** 答完题后的过场动画 */
export const reviewScreen = {
  intro: '恭喜。\n你已经成功引起董事会的注意。',
  lines: [
    '正在分析你的商业天赋……',
    '正在检查你的技术背景……',
    '正在评估你的皮衣适配度……',
    '正在排查潜在公关危机……',
    '正在确认你是否真的适合管理万亿市值……',
  ],
  outro: ['董事会讨论结束。', '你的 CEO 人格鉴定报告已生成。'],
  button: '查看我的 CEO 任命书 →',
}

/** 挑战文案模板：{title} {hiddenTitle} {score} {url} 会被替换 */
export const shareTemplate =
  '我去面试英伟达 CEO 了，董事会说我适合当「{title}」，隐藏情感称号：{hiddenTitle}，模拟评分 {score} 分。你能拿多少分？{url}'
