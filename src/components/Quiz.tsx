import { useRef, useState } from 'react'
import { questions } from '../config'
import { track } from '../lib/analytics'

const LETTERS = ['A', 'B', 'C', 'D', 'E']

export default function Quiz({ attemptId, onFinish }: { attemptId: string; onFinish: (answers: string[]) => void }) {
  const [index, setIndex] = useState(0)
  const [answers, setAnswers] = useState<string[]>([])
  const [picked, setPicked] = useState<string | null>(null)
  const locked = useRef(false)

  const q = questions[index]
  const total = questions.length

  const choose = (optionId: string) => {
    if (locked.current) return // 防止连点跳题
    locked.current = true
    setPicked(optionId)
    track('question_answer', { q: q.id, option: optionId }, `answer:${attemptId}:${q.id}`)

    const next = [...answers.slice(0, index), optionId]
    window.setTimeout(() => {
      setAnswers(next)
      setPicked(null)
      locked.current = false
      if (index + 1 >= total) onFinish(next)
      else setIndex(index + 1)
    }, 280)
  }

  const back = () => {
    if (locked.current || index === 0) return
    setIndex(index - 1)
  }

  return (
    <section className="flex min-h-[calc(100dvh-40px)] flex-col pt-5">
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

      <div key={q.id} className="mt-8">
        <p className="rise font-mono text-xs text-neon">INTERVIEW_Q{index + 1}</p>
        <h2 className="rise mt-2 text-[26px] leading-snug font-bold text-balance" style={{ animationDelay: '40ms' }}>
          {q.title}
        </h2>

        <ul className="mt-7 space-y-3">
          {q.options.map((o, i) => {
            const isPicked = picked === o.id
            const wasChosen = !picked && answers[index] === o.id
            return (
              <li key={o.id} className="rise" style={{ animationDelay: `${90 + i * 55}ms` }}>
                <button
                  onClick={() => choose(o.id)}
                  className={`press flex min-h-[60px] w-full items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[16px] leading-snug ${
                    isPicked
                      ? 'border-neon bg-neon text-ink shadow-[0_0_30px_-6px_rgb(184_255_44/0.7)]'
                      : wasChosen
                        ? 'border-neon/60 bg-neon/10'
                        : 'border-line bg-panel hover:border-neon/40'
                  }`}
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

      <p className="mt-auto pt-10 pb-2 text-center font-mono text-[11px] text-mute/60">
        面试官正在假装认真记笔记
      </p>
    </section>
  )
}
