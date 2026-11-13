import { useEffect, useRef, useState } from 'react'
import { dims, type Dim } from '../config'
import { appointmentNo, type Result } from '../lib/scoring'
import { track } from '../lib/analytics'
import { copyText, dataUrlToFile, isInAppBrowser, isTouchDevice, renderPoster, savePoster, shareText } from '../lib/share'
import Poster from './Poster'
import ClubSection from './ClubSection'

type PosterState =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'ready'; url: string; file: File }
  | { status: 'error' }

export default function ResultView({
  result,
  attemptId,
  onRetry,
}: {
  result: Result
  attemptId: string
  onRetry: () => void
}) {
  const { persona, score } = result
  const filename = `CEO任命书-${persona.title}-${appointmentNo(result.key)}.png`
  const posterRef = useRef<HTMLDivElement>(null)
  const [poster, setPoster] = useState<PosterState>({ status: 'idle' })
  const [open, setOpen] = useState(false)
  const [toast, setToast] = useState<string | null>(null)
  const [manualCopy, setManualCopy] = useState<string | null>(null)
  // 顶部保存按钮滚出屏幕后，在底部常驻一个保存按钮
  const topSaveRef = useRef<HTMLButtonElement>(null)
  const [showDock, setShowDock] = useState(false)

  useEffect(() => {
    const el = topSaveRef.current
    if (!el || !('IntersectionObserver' in window)) return
    const io = new IntersectionObserver(([e]) => setShowDock(!e.isIntersecting && e.boundingClientRect.top < 0))
    io.observe(el)
    return () => io.disconnect()
  }, [])

  useEffect(() => {
    track('result_view', { persona: persona.id, score }, `result_view:${attemptId}`)
  }, [persona.id, score, attemptId])

  useEffect(() => {
    if (!toast) return
    const t = window.setTimeout(() => setToast(null), toast.length > 24 ? 4200 : 2400)
    return () => window.clearTimeout(t)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // 同一时刻只渲染一次；结果页出现后在后台预渲染，点按钮时基本可以秒开
  const job = useRef<Promise<void> | null>(null)
  const render = () => {
    if (job.current) return job.current
    if (!posterRef.current) {
      setPoster({ status: 'error' })
      return Promise.resolve()
    }
    setPoster({ status: 'loading' })
    // 提前把图片转成文件，点保存时才能同步调起系统分享（iOS 要求）
    job.current = renderPoster(posterRef.current)
      .then(async (url) => setPoster({ status: 'ready', url, file: await dataUrlToFile(url, filename) }))
      .catch(() => {
        setPoster({ status: 'error' })
        job.current = null
      })
    return job.current
  }

  useEffect(() => {
    const t = window.setTimeout(render, 1600)
    return () => window.clearTimeout(t)
    // 只在结果页出现时预渲染一次
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const inApp = isInAppBrowser()

  /** 结果页主按钮：图片已就绪就直接保存，同时打开预览；还没就绪则先打开预览等待生成 */
  const saveFromPage = () => {
    setOpen(true)
    track('poster_generate', { persona: persona.id }, `poster_generate:${attemptId}`)
    if (poster.status === 'ready') save()
    else render()
  }

  const retryPoster = () => {
    job.current = null
    render()
  }

  const save = () => {
    if (poster.status !== 'ready') return
    track('poster_save', { persona: persona.id }, `poster_save:${attemptId}`)
    if (inApp) {
      setToast('当前 App 不支持直接保存：请长按图片保存，或点右上角「···」用浏览器打开')
      return
    }
    // 注意：这里必须同步调用 savePoster，不能在它之前 await
    savePoster(poster.file, filename).then((r) => {
      if (r === 'downloaded') setToast(isTouchDevice() ? '已保存，可在相册或「下载」里找到' : '已保存到下载文件夹')
      else if (r === 'shared') setToast('选「存储图像」就能存进相册')
      else if (r === 'manual') setToast('长按图片即可保存到相册')
    })
  }

  const copy = async () => {
    const text = shareText(result)
    track('share_copy', { persona: persona.id }, `share_copy:${attemptId}`)
    const ok = await copyText(text)
    if (ok) setToast('挑战文案已复制，去发给朋友吧')
    else setManualCopy(text)
  }

  const fields: [string, string][] = [
    ['一句话评价', persona.oneLiner],
    ['核心优势', result.strength],
    ['致命短板', result.weakness],
    ['隐藏情感称号', result.hiddenTitle],
    ['董事会评语', persona.board],
    ['录用结论', result.verdict],
  ]

  return (
    <section className="pt-5 pb-6">
      <p className="rise font-mono text-xs text-mute">
        <span className="text-neon">&gt;</span> interview_result.json
      </p>

      {/* 主结果卡 */}
      <div className="rise relative mt-3 overflow-hidden rounded-3xl border border-neon/30 bg-panel p-5 shadow-[0_0_60px_-20px_rgb(184_255_44/0.35)]">
        <div
          className="pointer-events-none absolute inset-0"
          style={{ background: 'radial-gradient(90% 60% at 50% 0%, rgb(184 255 44 / 0.12), transparent 70%)' }}
        />
        <div className="relative">
          <p className="text-sm text-mute">董事会认为，你是一位</p>
          <h2 className="neon-text mt-1 text-[clamp(32px,10vw,42px)] leading-tight font-black">{persona.title}</h2>
          <div className="mt-3 space-y-0.5 text-[16px] leading-relaxed font-semibold">
            <p>{persona.tagline[0]}</p>
            <p>{persona.tagline[1]}</p>
          </div>

          <div className="mt-6 flex items-end justify-between gap-4">
            <div>
              <p className="tabular text-[64px] leading-none font-black">
                {score}
                <span className="ml-1 text-xl font-bold text-mute">/ 100</span>
              </p>
              <p className="mt-2 text-xs text-mute">虚构录用评分 · 娱乐模拟分数，不代表任何真实评价</p>
            </div>
            <div
              className="stamp-in grid size-[78px] shrink-0 place-items-center rounded-full border-[2.5px] border-[#ff5c5c]/85 text-center text-[#ff5c5c]"
              aria-hidden
            >
              <div>
                <p className="text-[10px] leading-tight font-bold">董事会</p>
                <p className="text-[15px] leading-tight font-black">已阅</p>
                <p className="text-[8px] leading-tight">（假的）</p>
              </div>
            </div>
          </div>

          <p className="mt-5 text-[14px] text-mute">
            隐藏情感称号 <span className="ml-1 font-bold text-[#ff8fb1]">{result.hiddenTitle}</span>
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {result.tags.map((t) => (
              <span key={t} className="rounded-full border border-neon/40 bg-neon/5 px-3 py-1 text-[13px] text-neon">
                {t}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 主要操作：紧跟结果卡，第一屏就能看到 */}
      <div className="rise mt-5 space-y-3" style={{ animationDelay: '120ms' }}>
        <button
          ref={topSaveRef}
          onClick={saveFromPage}
          className="press min-h-[56px] w-full rounded-2xl bg-neon text-[17px] font-black text-ink shadow-[0_10px_40px_-12px_rgb(184_255_44/0.6)] active:bg-neon-2"
        >
          保存我的 CEO 任命书
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onRetry} className="press min-h-[50px] rounded-2xl border border-line bg-panel text-[15px] font-bold">
            重新挑战
          </button>
          <button onClick={copy} className="press min-h-[50px] rounded-2xl border border-line bg-panel text-[15px] font-bold">
            复制挑战文案
          </button>
        </div>
      </div>

      {/* 面试详情 */}
      <div className="rise mt-8 rounded-2xl border border-line bg-panel" style={{ animationDelay: '180ms' }}>
        <p className="border-b border-line px-4 py-3 font-mono text-[11px] text-mute">面试评估报告（纯属虚构）</p>
        <dl className="divide-y divide-line">
          {fields.map(([k, v]) => (
            <div key={k} className="flex gap-3 px-4 py-3 text-[14.5px] leading-relaxed">
              <dt className="w-[92px] shrink-0 text-mute">{k}</dt>
              <dd className="text-text">{v}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="rise mt-4 rounded-2xl border border-line bg-panel p-4" style={{ animationDelay: '220ms' }}>
        <p className="font-mono text-[11px] text-mute">CEO 能力雷达（娱乐版）</p>
        <ul className="mt-3 space-y-3">
          {(Object.keys(dims) as Dim[]).map((d) => (
            <li key={d}>
              <div className="flex justify-between text-[13px]">
                <span className={d === result.top ? 'font-bold text-neon' : d === result.weak ? 'text-warn' : 'text-text/80'}>
                  {dims[d].label}
                  <span className="ml-1.5 font-mono text-[10px] text-mute">{dims[d].en}</span>
                  {d === result.top && <span className="ml-1.5 text-[11px]">最强</span>}
                  {d === result.weak && <span className="ml-1.5 text-[11px]">最弱</span>}
                </span>
                <span className="tabular font-mono text-mute">{result.levels[d]}</span>
              </div>
              <div className="mt-1 h-1.5 overflow-hidden rounded-full bg-line">
                <div
                  className={`h-full rounded-full ${d === result.top ? 'bg-neon' : d === result.weak ? 'bg-warn/70' : 'bg-text/40'}`}
                  style={{ width: `${Math.max(4, result.levels[d])}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>

      <ClubSection />

      {/* 底部常驻保存按钮 */}
      <div
        className={`fixed inset-x-0 bottom-0 z-30 flex justify-center px-4 pt-3 pb-[max(env(safe-area-inset-bottom),12px)] transition-all duration-300 ${
          showDock && !open ? 'translate-y-0 opacity-100' : 'pointer-events-none translate-y-full opacity-0'
        }`}
        style={{ background: 'linear-gradient(to top, rgb(7 8 10 / 0.96) 60%, transparent)' }}
      >
        <button
          onClick={saveFromPage}
          tabIndex={showDock ? 0 : -1}
          className="press min-h-[52px] w-full max-w-[448px] rounded-2xl bg-neon text-[16px] font-black text-ink shadow-[0_10px_40px_-12px_rgb(184_255_44/0.6)] active:bg-neon-2"
        >
          保存我的 CEO 任命书
        </button>
      </div>
      <div className="h-20" aria-hidden />

      {/* 离屏海报节点，仅用于导出图片 */}
      <div className="pointer-events-none fixed top-0 -left-[10000px]" aria-hidden>
        <Poster ref={posterRef} result={result} />
      </div>

      {open && (
        <PosterModal
          state={poster}
          inApp={inApp}
          onClose={() => setOpen(false)}
          onSave={save}
          onRetryPoster={retryPoster}
          onRetry={() => {
            setOpen(false)
            onRetry()
          }}
          onCopy={copy}
        />
      )}

      {manualCopy && (
        <div className="fixed inset-0 z-50 grid place-items-center bg-black/70 p-4" onClick={() => setManualCopy(null)}>
          <div className="w-full max-w-[420px] rounded-2xl border border-line bg-panel p-4" onClick={(e) => e.stopPropagation()}>
            <p className="text-sm font-bold">自动复制失败，请手动长按复制：</p>
            <textarea
              readOnly
              value={manualCopy}
              className="mt-3 h-28 w-full resize-none rounded-xl border border-line bg-ink p-3 text-[14px] leading-relaxed text-text"
              onFocus={(e) => e.currentTarget.select()}
            />
            <button onClick={() => setManualCopy(null)} className="press mt-3 min-h-[48px] w-full rounded-xl bg-text font-bold text-ink">
              好的
            </button>
          </div>
        </div>
      )}

      {toast && (
        <div className="pointer-events-none fixed inset-x-0 bottom-[max(env(safe-area-inset-bottom),20px)] z-[60] flex justify-center px-4">
          <p className="rise rounded-full border border-neon/40 bg-ink/95 px-4 py-2.5 text-sm text-text shadow-lg">{toast}</p>
        </div>
      )}
    </section>
  )
}

function PosterModal({
  state,
  inApp,
  onClose,
  onSave,
  onRetryPoster,
  onRetry,
  onCopy,
}: {
  state: PosterState
  inApp: boolean
  onClose: () => void
  onSave: () => void
  onRetryPoster: () => void
  onRetry: () => void
  onCopy: () => void
}) {
  return (
    <div className="fixed inset-0 z-40 flex flex-col bg-ink/95 backdrop-blur" role="dialog" aria-modal aria-label="CEO 任命书">
      <div className="flex items-center justify-between px-4 pt-[max(env(safe-area-inset-top),12px)] pb-2">
        <p className="font-mono text-xs text-mute">appointment.png</p>
        <button onClick={onClose} className="press -mr-2 rounded-lg px-3 py-2 text-sm text-mute" aria-label="关闭">
          关闭 ✕
        </button>
      </div>

      <div className="flex min-h-0 flex-1 items-center justify-center px-4">
        {state.status === 'ready' && (
          <img
            src={state.url}
            alt="我的 CEO 任命书"
            className="max-h-full w-auto max-w-full rounded-xl border border-line shadow-[0_20px_60px_-20px_rgb(184_255_44/0.35)]"
            style={{ aspectRatio: '9 / 16', WebkitTouchCallout: 'default' }}
          />
        )}
        {(state.status === 'loading' || state.status === 'idle') && (
          <div className="text-center">
            <div className="mx-auto size-10 animate-spin rounded-full border-2 border-line border-t-neon" />
            <p className="mt-4 font-mono text-sm text-mute">正在打印任命书……</p>
          </div>
        )}
        {state.status === 'error' && (
          <div className="max-w-[300px] text-center">
            <p className="text-base font-bold">任命书打印失败了</p>
            <p className="mt-2 text-sm text-mute">可能是浏览器不支持或内存不足。可以重试，或者直接截图上一页的结果卡。</p>
            <button onClick={onRetryPoster} className="press mt-4 min-h-[48px] w-full rounded-xl bg-neon font-bold text-ink">
              重新生成
            </button>
          </div>
        )}
      </div>

      <div className="space-y-3 px-4 pt-3 pb-[max(env(safe-area-inset-bottom),16px)]">
        <p className="text-center text-xs text-mute">
          {inApp ? '长按上方图片，选择「保存图片」即可存进相册' : '保存不了？长按上方图片也可以存进相册'}
        </p>
        <button
          onClick={onSave}
          disabled={state.status !== 'ready'}
          className="press min-h-[56px] w-full rounded-2xl bg-neon text-[17px] font-black text-ink disabled:opacity-40"
        >
          保存我的任命书
        </button>
        <div className="grid grid-cols-2 gap-3">
          <button onClick={onRetry} className="press min-h-[48px] rounded-2xl border border-line bg-panel text-[15px] font-bold">
            重新挑战
          </button>
          <button onClick={onCopy} className="press min-h-[48px] rounded-2xl border border-line bg-panel text-[15px] font-bold">
            复制挑战文案
          </button>
        </div>
      </div>
    </div>
  )
}
