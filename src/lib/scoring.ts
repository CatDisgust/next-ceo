import { dims, personas, questions, scoreBands, tieBreak, type Dim, type Persona } from '../config'

export interface Result {
  persona: Persona
  score: number
  top: Dim
  weak: Dim
  /** 各维度 0–100 归一化值 */
  levels: Record<Dim, number>
  verdict: string
  tags: string[]
  strength: string
  weakness: string
  key: string
}

const DIMS = Object.keys(dims) as Dim[]

/** 每个维度在整套题里理论上能拿到的最高分，用于归一化，避免某个维度天然占优 */
function maxPerDim(): Record<Dim, number> {
  const max = Object.fromEntries(DIMS.map((d) => [d, 0])) as Record<Dim, number>
  for (const q of questions) {
    for (const d of DIMS) {
      max[d] += Math.max(0, ...q.options.map((o) => o.weights[d] ?? 0))
    }
  }
  return max
}

/** 32 位 FNV-1a，保证同一组答案永远得到同一个数 */
function hash(s: string): number {
  let h = 0x811c9dc5
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i)
    h = Math.imul(h, 0x01000193)
  }
  return h >>> 0
}

/** answers: 每题所选选项 id，按题目顺序 */
export function computeResult(answers: string[]): Result {
  const raw = Object.fromEntries(DIMS.map((d) => [d, 0])) as Record<Dim, number>
  questions.forEach((q, i) => {
    const opt = q.options.find((o) => o.id === answers[i])
    if (!opt) return
    for (const [d, v] of Object.entries(opt.weights) as [Dim, number][]) raw[d] += v
  })

  const max = maxPerDim()
  const levels = Object.fromEntries(
    DIMS.map((d) => [d, max[d] ? Math.round((raw[d] / max[d]) * 100) : 0]),
  ) as Record<Dim, number>

  const rank = (d: Dim) => tieBreak.indexOf(d)
  const byHigh = [...DIMS].sort((a, b) => levels[b] - levels[a] || rank(a) - rank(b))
  const byLow = [...DIMS].sort((a, b) => levels[a] - levels[b] || rank(b) - rank(a))
  const top = byHigh[0]
  const weak = byLow[0] === top ? byLow[1] : byLow[0]

  const persona = personas.find((p) => p.dim === top) ?? personas[0]

  // 虚构录用评分：最高维度的集中度 + 答案组合的稳定扰动，落在 40–99
  const key = answers.join('-')
  const jitter = hash(key) % 23 // 0–22
  const score = Math.max(40, Math.min(99, Math.round(44 + levels[top] * 0.36 + jitter)))

  const band = scoreBands.find((b) => score >= b.min) ?? scoreBands[scoreBands.length - 1]

  return {
    persona,
    score,
    top,
    weak,
    levels,
    verdict: band.verdict,
    tags: [persona.tag, band.tag],
    strength: dims[top].strength,
    weakness: dims[weak].weakness,
    key,
  }
}

/** 任命书编号：由答案组合决定，同答案同编号 */
export function appointmentNo(key: string) {
  let h = 7
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) % 99991
  return String(h).padStart(5, '0')
}
