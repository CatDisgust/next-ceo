import { useEffect, useState } from 'react'
import { reviewLines } from '../config'

const STEP_MS = 520

/** 纯前端娱乐动画，不调用任何外部系统 */
export default function Review({ onDone }: { onDone: () => void }) {
  const [shown, setShown] = useState(0)
  const done = shown > reviewLines.length

  useEffect(() => {
    if (shown <= reviewLines.length) {
      const t = window.setTimeout(() => setShown((s) => s + 1), shown === 0 ? 200 : STEP_MS)
      return () => window.clearTimeout(t)
    }
    const t = window.setTimeout(onDone, 800)
    return () => window.clearTimeout(t)
  }, [shown, onDone])

  const progress = Math.min(100, Math.round((shown / (reviewLines.length + 1)) * 100))

  return (
    <section className="flex min-h-[calc(100dvh-40px)] flex-col justify-center py-10">
      <div className="overflow-hidden rounded-2xl border border-line bg-panel shadow-[0_30px_80px_-30px_rgb(0_0_0/0.9)]">
        <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
          <span className="size-2.5 rounded-full bg-[#ff5f57]" />
          <span className="size-2.5 rounded-full bg-[#febc2e]" />
          <span className="size-2.5 rounded-full bg-[#28c840]" />
          <span className="ml-2 font-mono text-[11px] text-mute">board-review.sh（娱乐演示）</span>
        </div>

        <div className="min-h-[260px] space-y-3 p-4 font-mono text-[13.5px] leading-relaxed">
          <p className="text-mute">
            <span className="text-neon">$</span> ./review --candidate=you
          </p>
          {reviewLines.slice(0, shown).map((line, i) => {
            const finished = i < shown - 1 || done
            return (
              <p key={line} className="rise flex items-start gap-2">
                <span className={finished ? 'text-neon' : 'text-warn'}>{finished ? '[ok]' : '[..]'}</span>
                <span className={finished ? 'text-text/80' : 'caret text-text'}>{line}</span>
              </p>
            )
          })}
          {done && (
            <p className="rise pt-2 text-base font-bold text-neon">&gt; 审核完成。结果有点意外。</p>
          )}
        </div>

        <div className="border-t border-line px-4 py-3">
          <div className="flex justify-between font-mono text-[11px] text-mute">
            <span>董事会审议进度</span>
            <span className="tabular">{progress}%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full rounded-full bg-neon transition-[width] duration-500 ease-out" style={{ width: `${progress}%` }} />
          </div>
        </div>
      </div>
      <p className="mt-4 text-center text-xs text-mute/70">以上审核纯属虚构，没有任何真实系统参与</p>
    </section>
  )
}
