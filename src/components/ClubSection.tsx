import { useEffect, useState } from 'react'
import { clubCta, site } from '../config'
import { track } from '../lib/analytics'
import { copyText } from '../lib/share'
import { LogoLockup } from './Logo'

const BASE = 'press flex min-h-[52px] w-full items-center justify-center rounded-2xl text-[16px] font-bold'
const BRIGHT = 'bg-text text-ink'
const QUIET = 'border border-line bg-panel text-text'

export default function ClubSection() {
  const { primary, secondary } = clubCta
  // 生产环境不展示未配置链接的按钮，避免指向不存在的入口
  const showPrimary = Boolean(primary.url) || import.meta.env.DEV
  const [copied, setCopied] = useState<'ok' | 'fail' | null>(null)

  useEffect(() => {
    if (!copied) return
    const t = window.setTimeout(() => setCopied(null), 3500)
    return () => window.clearTimeout(t)
  }, [copied])

  const copyWechat = async () => {
    track('club_cta_click', { cta: 'secondary' }, 'club_cta:secondary')
    setCopied((await copyText(secondary.wechat)) ? 'ok' : 'fail')
  }

  return (
    <section className="mt-16 rounded-3xl border border-line bg-panel-2 p-5">
      <LogoLockup height={34} />
      <p className="mt-4 font-mono text-[11px] text-neon">// made by humans + AI</p>
      <h3 className="mt-2 text-[21px] leading-snug font-black text-balance">{clubCta.title}</h3>
      <div className="mt-4 space-y-1.5 text-[15px] leading-relaxed text-text/80">
        {clubCta.body.map((line) => (
          <p key={line}>{line}</p>
        ))}
      </div>

      <div className="mt-6 space-y-3">
        {showPrimary &&
          (primary.url ? (
            <a
              href={primary.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => track('club_cta_click', { cta: 'primary' }, 'club_cta:primary')}
              className={`${BASE} ${BRIGHT}`}
            >
              {primary.label} →
            </a>
          ) : (
            <button disabled className={`${BASE} ${BRIGHT} cursor-not-allowed flex-col py-2 opacity-50`}>
              {primary.label}
              <span className="font-mono text-[11px] font-normal">开发提示：上线前在 config.ts 填写链接</span>
            </button>
          ))}

        <button onClick={copyWechat} className={`${BASE} ${showPrimary ? QUIET : BRIGHT} flex-col gap-0.5 py-2.5`}>
          <span>{copied === 'ok' ? '微信号已复制 ✓' : secondary.label}</span>
          <span className={`font-mono text-[12px] font-normal ${showPrimary ? 'text-mute' : 'text-ink/60'}`}>
            {copied === 'ok' ? '打开微信 → 添加朋友 → 粘贴搜索' : `微信添加 ${secondary.wechat} · 点击复制`}
          </span>
        </button>
        {copied === 'fail' && (
          <p className="text-center text-[13px] text-mute">
            自动复制失败，请手动添加微信：<span className="font-mono text-text select-all">{secondary.wechat}</span>
          </p>
        )}
      </div>

      <p className="mt-6 text-center font-mono text-[11px] text-mute">Created by {site.club}</p>
    </section>
  )
}
