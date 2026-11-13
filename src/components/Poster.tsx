import { forwardRef, useEffect, useState } from 'react'
import QRCode from 'qrcode'
import { site } from '../config'
import { appointmentNo, type Result } from '../lib/scoring'
import { displayUrl, qrLink } from '../lib/share'
import { LogoLockup } from './Logo'

/** 生成二维码 SVG（本地生成，不依赖任何外部服务） */
function useQrSvg(text: string) {
  const [svg, setSvg] = useState('')
  useEffect(() => {
    QRCode.toString(text, {
      type: 'svg',
      margin: 0,
      errorCorrectionLevel: 'M',
      color: { dark: '#07080a', light: '#ffffff' },
    })
      .then(setSvg)
      .catch(() => setSvg(''))
  }, [text])
  return svg
}

/**
 * 分享海报：固定 360×640 CSS 像素，导出时 ×3 → 1080×1920，适合小红书竖图。
 * 只用系统字体与纯 CSS，避免导出时跨域资源失败。
 */
const Poster = forwardRef<HTMLDivElement, { result: Result }>(function Poster({ result }, ref) {
  const { persona, score } = result
  const qr = useQrSvg(qrLink())
  return (
    <div
      ref={ref}
      style={{
        width: 360,
        height: 640,
        background:
          'radial-gradient(120% 60% at 50% 0%, rgba(184,255,44,0.16) 0%, rgba(7,8,10,0) 60%), linear-gradient(#0b0d0f, #07080a)',
        fontFamily: 'var(--font-sans)',
      }}
      className="relative flex flex-col overflow-hidden text-text"
    >
      {/* 网格纹理 */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            'linear-gradient(to right, rgba(184,255,44,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(184,255,44,0.06) 1px, transparent 1px)',
          backgroundSize: '24px 24px',
          opacity: 0.6,
        }}
      />

      <div className="relative flex h-full flex-col px-6 pt-5 pb-4">
        <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-mute">
          <span>{site.productNameZh} · CEO APPOINTMENT</span>
          <span>No.{appointmentNo(result.key)}</span>
        </div>
        <div className="mt-1 h-px bg-neon/30" />

        <p className="mt-3 text-center text-[13px] tracking-[0.3em] text-mute">CEO 任命书</p>
        <p className="mt-2 text-center text-[13px] text-text/80">经董事会（假的）认真讨论，兹任命</p>
        <p className="mt-1 text-center text-[13px] text-text/80">
          <span className="border-b border-neon/50 px-2 font-bold text-text">本网友</span> 为下一任 CEO 候选人
        </p>

        <div className="mt-3 text-center">
          <p className="font-mono text-[10px] text-neon/80">CEO PERSONA</p>
          <p
            className="mt-1 text-[34px] leading-tight font-black"
            style={{ color: '#b8ff2c', textShadow: '0 0 24px rgba(184,255,44,0.4)' }}
          >
            {persona.title}
          </p>
        </div>

        <div className="mt-4 flex items-stretch gap-3">
          <div className="flex w-[118px] shrink-0 flex-col items-center justify-center rounded-xl border border-neon/40 bg-neon/10 py-2.5">
            <p className="tabular text-[44px] leading-none font-black text-neon">{score}</p>
            <p className="mt-1 font-mono text-[10px] text-mute">/ 100</p>
            <p className="mt-1.5 text-[9.5px] text-mute">虚构录用评分</p>
          </div>
          <div className="flex flex-1 flex-col justify-center rounded-xl border border-line bg-panel/80 px-3 py-3">
            <p className="text-[11px] text-mute">董事会评语</p>
            <p className="mt-1 text-[13px] leading-snug font-medium">{persona.board}</p>
            <p className="mt-2 border-t border-line pt-1.5 text-[11px] text-mute">
              感情忠贞度 <span className="font-bold text-[#ff8fb1]">{result.loyalty}</span>
            </p>
          </div>
        </div>

        <div className="relative mt-3 rounded-xl border border-line bg-panel/80 px-4 pt-2.5 pb-3">
          <p className="font-mono text-[22px] leading-none text-neon">“</p>
          <p className="-mt-1 text-[15px] leading-normal font-bold">{persona.tagline[0]}</p>
          <p className="text-[15px] leading-normal font-bold">{persona.tagline[1]}</p>
          <p className="mt-1.5 pr-20 text-[12px] text-mute">{result.verdict}</p>

          <div
            className="absolute -right-1 -bottom-11 grid size-[76px] place-items-center rounded-full border-[2.5px] text-center"
            style={{ borderColor: 'rgba(255,92,92,0.85)', color: 'rgba(255,92,92,0.9)', transform: 'rotate(-14deg)' }}
          >
            <div>
              <p className="text-[10px] leading-tight font-bold">董事会</p>
              <p className="text-[15px] leading-tight font-black">已阅</p>
              <p className="text-[8px] leading-tight">（假的）</p>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2 pr-20">
          {result.tags.map((t) => (
            <span key={t} className="rounded-full border border-neon/40 px-2.5 py-1 text-[12px] font-medium text-neon">
              {t}
            </span>
          ))}
        </div>

        <div className="mt-auto pt-2">
          <div className="flex items-end justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[13px] font-bold">我去面试了，你能拿多少分？</p>
              <p className="mt-0.5 text-[11.5px] text-neon">扫码，立刻开始你的 CEO 面试 →</p>
              <p className="mt-2 font-mono text-[10.5px] font-bold text-text/90">{site.productName}</p>
              <p className="font-mono text-[9.5px] text-mute">{displayUrl()}</p>
              <p className="mt-0.5 flex items-center gap-1.5 font-mono text-[9.5px] text-mute">
                Created by <LogoLockup height={15} />
              </p>
            </div>
            {qr && (
              <div className="shrink-0 rounded-lg bg-white p-[5px]">
                <div className="size-[68px] [&>svg]:block [&>svg]:size-full" dangerouslySetInnerHTML={{ __html: qr }} />
              </div>
            )}
          </div>
          <div className="mt-2 h-px bg-line" />
          <p className="mt-1.5 text-center text-[10px] text-mute">非官方娱乐模拟结果 · 与 NVIDIA 无任何关联</p>
        </div>
      </div>
    </div>
  )
})

export default Poster
