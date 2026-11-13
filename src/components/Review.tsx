import { useEffect, useState } from 'react'
import { reviewScreen } from '../config'

const { intro, lines, outro, button } = reviewScreen
const INTRO_MS = 900
const LINE_MS = 520

/** 纯前端娱乐过场，不调用任何外部系统 */
export default function Review({ onDone }: { onDone: () => void }) {
  // step 0：黑屏；1：出现开场白；2..lines+1：逐行检查；之后：结论 + 按钮
  const [step, setStep] = useState(0)
  const last = lines.length + 2

  useEffect(() => {
    if (step >= last) return
    const ms = step === 0 ? 350 : step === 1 ? INTRO_MS : LINE_MS
    const t = window.setTimeout(() => setStep((s) => s + 1), ms)
    return () => window.clearTimeout(t)
  }, [step, last])

  const shownLines = Math.max(0, step - 1)
  const finished = step >= last

  return (
    <section className="fixed inset-0 z-20 flex flex-col justify-center bg-black px-6 pt-10">
      <div className="mx-auto w-full max-w-[440px]">
        {step >= 1 && <p className="rise text-[22px] leading-snug font-bold whitespace-pre-line">{intro}</p>}

        <div className="mt-8 min-h-[190px] space-y-2.5 font-mono text-[13px] leading-relaxed">
          {lines.slice(0, shownLines).map((line, i) => {
            const ok = i < shownLines - 1 || finished
            return (
              <p key={line} className="rise flex items-start gap-2">
                <span className={ok ? 'text-neon' : 'text-warn'}>{ok ? '[ok]' : '[..]'}</span>
                <span className={ok ? 'text-text/70' : 'caret text-text'}>{line}</span>
              </p>
            )
          })}
        </div>

        {finished && (
          <div className="mt-6">
            {outro.map((line, i) => (
              <p
                key={line}
                className={`rise ${i === outro.length - 1 ? 'neon-text mt-1 text-[19px] font-bold' : 'text-[15px] text-text/80'}`}
                style={{ animationDelay: `${i * 220}ms` }}
              >
                {line}
              </p>
            ))}
            <button
              onClick={onDone}
              className="press rise mt-8 min-h-[56px] w-full rounded-2xl bg-neon text-[17px] font-black text-ink shadow-[0_10px_40px_-12px_rgb(184_255_44/0.6)] active:bg-neon-2"
              style={{ animationDelay: '500ms' }}
            >
              {button}
            </button>
          </div>
        )}
      </div>
      <p className="absolute inset-x-0 bottom-[max(env(safe-area-inset-bottom),16px)] text-center text-xs text-mute/60">
        以上审核纯属虚构，没有任何真实系统参与
      </p>
    </section>
  )
}
