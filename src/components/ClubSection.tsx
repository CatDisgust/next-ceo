import { clubCta, site } from '../config'
import { track } from '../lib/analytics'

type Cta = { label: string; url: string }

export default function ClubSection() {
  const ctas: [Cta, 'primary' | 'secondary'][] = [
    [clubCta.primary, 'primary'],
    [clubCta.secondary, 'secondary'],
  ]
  // 生产环境不展示未配置链接的按钮，避免指向不存在的入口
  const visible = ctas.filter(([c]) => c.url || import.meta.env.DEV)

  return (
    <section className="mt-16 rounded-3xl border border-line bg-panel-2 p-5">
      <p className="font-mono text-[11px] text-neon">// made by humans + AI</p>
      <h3 className="mt-2 text-[21px] leading-snug font-black text-balance">{clubCta.title}</h3>
      <div className="mt-4 space-y-1.5 text-[15px] leading-relaxed text-text/80">
        {clubCta.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      {visible.length > 0 && (
        <div className="mt-6 space-y-3">
          {visible.map(([c, kind]) => {
            const base = 'press flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-bold'
            const style = kind === 'primary' ? 'bg-text text-ink' : 'border border-line bg-panel text-text'
            if (!c.url) {
              return (
                <button key={kind} disabled className={`${base} ${style} cursor-not-allowed flex-col py-2 opacity-50`}>
                  {c.label}
                  <span className="font-mono text-[11px] font-normal">开发提示：上线前在 config.ts 填写链接</span>
                </button>
              )
            }
            return (
              <a
                key={kind}
                href={c.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => track('club_cta_click', { cta: kind }, `club_cta:${kind}`)}
                className={`${base} ${style}`}
              >
                {c.label} →
              </a>
            )
          })}
        </div>
      )}

      <p className="mt-6 text-center font-mono text-[11px] text-mute">Created by {site.club}</p>
    </section>
  )
}
