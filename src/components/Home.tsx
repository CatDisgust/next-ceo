import { newsHook, questions, site } from '../config'
import { LogoLockup } from './Logo'

const jobRows: [string, string][] = [
  ['职位', 'CEO（全球最难岗位之一）'],
  ['汇报对象', '董事会 + 全体网友'],
  ['经验要求', '不限，敢来就行'],
  ['加分项', '自带皮衣 / 会用 AI / 心理素质好'],
]

export default function Home({ onStart }: { onStart: () => void }) {
  return (
    <section className="flex min-h-[calc(100dvh-40px)] flex-col pt-6">
      <p className="rise font-mono text-xs text-mute">
        <span className="text-neon">$</span> ./hire --role=CEO --candidate=<span className="text-text">you</span>
      </p>

      <div className="mt-7">
        <span
          className="rise inline-flex items-center gap-2 rounded-full border border-neon/40 bg-neon/10 px-3 py-1 font-mono text-[11px] tracking-wider text-neon"
          style={{ animationDelay: '60ms' }}
        >
          <span className="size-1.5 animate-pulse rounded-full bg-neon" />
          {newsHook.kicker}
        </span>

        <h1 className="mt-4 text-[clamp(38px,11.5vw,54px)] leading-[1.08] font-black tracking-tight text-balance">
          {newsHook.headline.map((line, i) => (
            <span
              key={line}
              className={`rise block ${i === newsHook.headline.length - 1 ? 'neon-text' : ''}`}
              style={{ animationDelay: `${120 + i * 90}ms` }}
            >
              {line}
            </span>
          ))}
        </h1>

        <div className="rise mt-5 space-y-1 text-[15px] leading-relaxed text-mute" style={{ animationDelay: '420ms' }}>
          {newsHook.sub.map((s) => (
            <p key={s} className="text-pretty">
              {s}
            </p>
          ))}
        </div>
      </div>

      {/* 招聘卡片（明显是整活，不模仿任何真实招聘页） */}
      <div
        className="rise mt-7 rounded-2xl border border-line bg-panel/90 p-4 shadow-[0_0_0_1px_rgb(184_255_44/0.04),0_20px_50px_-20px_rgb(0_0_0/0.8)]"
        style={{ animationDelay: '500ms' }}
      >
        <div className="flex items-center justify-between font-mono text-[11px] text-mute">
          <span>JOB_ID: CEO-0001</span>
          <span className="rounded bg-warn/15 px-1.5 py-0.5 text-warn">急招 · 假的</span>
        </div>
        <dl className="mt-3 space-y-2 text-sm">
          {jobRows.map(([k, v]) => (
            <div key={k} className="flex gap-3">
              <dt className="w-16 shrink-0 text-mute">{k}</dt>
              <dd className="text-text">{v}</dd>
            </div>
          ))}
        </dl>
        <div className="mt-4">
          <div className="flex justify-between font-mono text-[11px] text-mute">
            <span>董事会耐心值</span>
            <span className="tabular text-neon">23%</span>
          </div>
          <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-line">
            <div className="h-full w-[23%] rounded-full bg-neon" />
          </div>
        </div>
      </div>

      <div className="mt-auto pt-8 pb-4">
        <button
          onClick={onStart}
          className="press rise group relative w-full overflow-hidden rounded-2xl bg-neon py-4 text-lg font-black text-ink shadow-[0_10px_40px_-10px_rgb(184_255_44/0.6)] active:bg-neon-2"
          style={{ animationDelay: '600ms' }}
        >
          <span className="relative z-10">{newsHook.cta} →</span>
          <span
            className="absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-white/45 to-transparent"
            style={{ animation: 'scan 2.6s 1.2s ease-in-out infinite' }}
            aria-hidden
          />
        </button>
        <p className="mt-3 text-center text-[13px] text-mute">{newsHook.ctaHint}</p>
        <p className="mt-6 text-center font-mono text-[11px] leading-5 text-mute/70">
          共 {questions.length} 题 · 约 1 分钟 · 无需注册
          <br />
          {site.productName}
        </p>
        <div className="mt-2 flex items-center justify-center gap-2 font-mono text-[11px] text-mute/70">
          by <LogoLockup height={20} />
        </div>
      </div>
    </section>
  )
}
