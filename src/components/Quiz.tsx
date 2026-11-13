import { useEffect, useRef, useState } from 'react'
import { questions, type Option } from '../config'
import { track } from '../lib/analytics'

const LETTERS = ['A', 'B', 'C', 'D', 'E']
const HIGHLIGHT_MS = 380

/** 反应停留时间：基础约 2 秒，字多时适当延长，最长 3.2 秒；可点击跳过 */
function reactionMs(lines: string[]) {
  const chars = lines.join('').length
  return Math.min(3200, Math.max(1900, 900 + chars * 45))
}

export default function Quiz({ attemptId, onFinish }: { attemptId: string; onFinish: (answers: string[]) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const [reaction, setReaction] = useState<Option | null>(null)
  const locked = useRef(false)
  const timers = useRef<number[]>([])

  const q = questions[index]
  const total = questions.length

  useEffect(() => () => timers.current.forEach(clearTimeout), [])

  const later = (fn: () => void, ms: number) => {
    timers.current.push(window.setTimeout(fn, ms))
  }

  const advance = (optionId: string) => {
    timers.current.forEach(clearTimeout)
    timers.current = []
    const next = [...answers.slice(0, index), optionId]
    setAnswers(next)
    setPicked(null)
    setReaction(null)
    locked.current = false
    if (index + 1 >= total) onFinish(next)
    else setIndex(index + 1)
  }

  const choose = (opt: Option) => {
    if (locked.current) return // 防止连点跳题
    locked.current = true
    setPicked(opt.id)
    track('question_answer', { q: q.id, option: opt.id }, `answer:${attemptId}:${q.id}`)
    later(() => {
      setReaction(opt)
      later(() => advance(opt.id), reactionMs(opt.reaction))
    }, HIGHLIGHT_MS)
  }

  const back = () => {
    if (locked.current || index === 0) return
    setIndex(index - 1)
  }

  return (
    <section className="flex min-h-[calc(100dvh-40px)] flex-col pt-5 pb-4">
      <div className="flex items-center justify-between">
        <button
          onClick={back}
          disabled={index === 0}
          className="press -ml-2 rounded-lg px-2 py-2 font-mono text-xs text-mute disabled:opacity-0"
          aria-label="上一题"
        >
          ← 上一题
        </button>
        <p className="font-mono text-xs text-mute">
          第 <span className="tabular text-neon">{index + 1}</span> / {total} 题
        </p>
      </div>

      <div className="mt-2 flex gap-1.5" role="progressbar" aria-valuemin={1} aria-valuemax={total} aria-valuenow={index + 1}>
        {questions.map((item, i) => (
          <div key={item.id} className="h-1 flex-1 overflow-hidden rounded-full bg-line">
            <div
              className="h-full rounded-full bg-neon transition-[width] duration-300 ease-out"
              style={{ width: i < index || (i === index && picked) ? '100%' : i === index ? '35%' : '0%' }}
            />
          </div>
        ))}
      </div>

      <div key={q.id} className="mt-6">
        <p className="rise font-mono text-xs text-neon" data-qnum={index + 1}>
          Q{index + 1} · {q.tag}
        </p>
        <div className="rise mt-3 space-y-1 text-[15px] leading-relaxed text-text/70" style={{ animationDelay: '40ms' }}>
          {q.scene.map((line) => (
            <p key={line} className="text-pretty">
              {line}
            </p>
          ))}
        </div>
        <h2 className="rise mt-3 text-[20px] leading-snug font-bold whitespace-pre-line text-pretty" style={{ animationDelay: '90ms' }}>
          {q.title}
        </h2>

        <ul className="mt-5 space-y-2.5">
          {q.options.map((o, i) => {
            const isPicked = picked === o.id
            const dimmed = picked && !isPicked
            const wasChosen = !picked && answers[index] === o.id
            return (
              <li key={o.id} className="rise" style={{ animationDelay: `${140 + i * 50}ms` }}>
                <button
                  onClick={() => choose(o)}
                  className={`press flex min-h-[56px] w-full items-center gap-3 rounded-2xl border px-4 py-3 text-left text-[15px] leading-snug ${
                    isPicked
                      ? 'border-neon bg-neon text-ink shadow-[0_0_30px_-6px_rgb(184_255_44/0.7)]'
                      : wasChosen
                        ? 'border-neon/60 bg-neon/10'
                        : 'border-line bg-panel hover:border-neon/40'
                  } ${dimmed ? 'opacity-35' : ''}`}
                >
                  <span
                    className={`grid size-7 shrink-0 place-items-center rounded-lg font-mono text-[13px] font-bold ${
                      isPicked ? 'bg-ink/15 text-ink' : 'bg-line text-neon'
                    }`}
                  >
                    {LETTERS[i]}
                  </span>
                  <span className="text-pretty">{o.text}</span>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      {reaction && picked && (
        <BoardReaction key={reaction.id} lines={reaction.reaction} ms={reactionMs(reaction.reaction)} onSkip={() => advance(picked)} />
      )}
    </section>
  )
}

function BoardReaction({ lines, ms, onSkip }: { lines: string[]; ms: number; onSkip: () => void }) {
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/55" onClick={onSkip} role="dialog" aria-label="董事会反应">
      <div className="sheet-up w-full max-w-[480px] px-3 pb-[max(env(safe-area-inset-bottom),12px)]">
        <div className="overflow-hidden rounded-3xl border border-neon/40 bg-panel-2 shadow-[0_-10px_60px_-10px_rgb(184_255_44/0.35)]">
          <div className="px-5 pt-4 pb-5">
            <p className="flex items-center gap-2 font-mono text-[11px] tracking-wider text-neon">
              <span className="size-1.5 animate-pulse rounded-full bg-neon" />
              董事会反应
            </p>
            <div className="mt-3 space-y-1.5">
              {lines.map((line, i) => (
                <p key={line} className="rise text-[17px] leading-snug font-semibold" style={{ animationDelay: `${120 + i * 260}ms` }}>
                  {line}
                </p>
              ))}
            </div>
            <p className="mt-4 text-right font-mono text-[11px] text-mute">点击任意处继续 →</p>
          </div>
          <div className="h-1 bg-line">
            <div className="h-full origin-left bg-neon" style={{ animation: `drain ${ms}ms linear both` }} />
          </div>
        </div>
      </div>
    </div>
  )
}
