import { toPng } from 'html-to-image'
import { shareTemplate, site } from '../config'
import type { Result } from './scoring'

/** 站点地址：优先用配置，否则用当前页面地址 */
export function siteLink() {
  return site.siteUrl || `${location.origin}${import.meta.env.BASE_URL}`
}

/** 给人看的短网址（去掉协议和末尾斜杠） */
export function displayUrl() {
  return siteLink().replace(/^https?:\/\//, '').replace(/\/$/, '')
}

/** 二维码地址，带来源参数，方便统计扫码进入的人数 */
export function qrLink() {
  const u = new URL(siteLink())
  u.searchParams.set('from', 'qr')
  return u.toString()
}

export function shareText(r: Result) {
  return shareTemplate
    .replace('{title}', r.persona.title)
    .replace('{loyalty}', r.loyalty)
    .replace('{score}', String(r.score))
    .replace('{url}', ` ${siteLink()}`)
    .trim()
}

/** 小红书 / 微信 / 微博等 App 内置浏览器通常不支持下载，只能长按保存 */
export function isInAppBrowser() {
  return /MicroMessenger|xhsdiscover|XiaoHongShu|Weibo|QQ\/|DingTalk|Lark|Feishu/i.test(navigator.userAgent)
}

export function isTouchDevice() {
  return window.matchMedia?.('(pointer: coarse)').matches ?? false
}

/** 生成 PNG。iOS Safari 首次渲染偶尔缺样式，先预热一次再正式导出 */
export async function renderPoster(node: HTMLElement): Promise<string> {
  const opts = { pixelRatio: 3, cacheBust: true, backgroundColor: '#07080a', skipFonts: true }
  const timeout = new Promise<never>((_, rej) => setTimeout(() => rej(new Error('timeout')), 12000))
  const ua = navigator.userAgent
  const needWarmup = /iPhone|iPad|iPod/i.test(ua) || (/Safari/i.test(ua) && !/Chrome|Chromium|Android/i.test(ua))
  const job = (async () => {
    if (needWarmup) await toPng(node, opts).catch(() => undefined)
    return toPng(node, opts)
  })()
  const url = await Promise.race([job, timeout])
  if (!url || url.length < 2000) throw new Error('empty image')
  return url
}

export async function dataUrlToFile(dataUrl: string, name: string) {
  const blob = await (await fetch(dataUrl)).blob()
  return new File([blob], name, { type: 'image/png' })
}

/**
 * 保存图片：
 * 1. 手机且支持系统分享 → 调起分享面板（可「存储图像」）
 * 2. 支持下载 → 直接下载
 * 返回 'shared' | 'downloaded' | 'manual'（需要用户长按保存）
 */
export async function savePoster(dataUrl: string, filename: string): Promise<'shared' | 'downloaded' | 'manual' | 'cancelled'> {
  if (isInAppBrowser()) return 'manual'

  if (isTouchDevice() && navigator.canShare) {
    try {
      const file = await dataUrlToFile(dataUrl, filename)
      if (navigator.canShare({ files: [file] })) {
        await navigator.share({ files: [file], title: site.productName })
        return 'shared'
      }
    } catch (e) {
      if ((e as Error).name === 'AbortError') return 'cancelled'
    }
  }

  try {
    const a = document.createElement('a')
    a.href = dataUrl
    a.download = filename
    document.body.appendChild(a)
    a.click()
    a.remove()
    return isTouchDevice() ? 'manual' : 'downloaded'
  } catch {
    return 'manual'
  }
}

export async function copyText(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch {
    try {
      const ta = document.createElement('textarea')
      ta.value = text
      ta.setAttribute('readonly', '')
      ta.style.position = 'fixed'
      ta.style.opacity = '0'
      document.body.appendChild(ta)
      ta.select()
      ta.setSelectionRange(0, text.length)
      const ok = document.execCommand('copy')
      ta.remove()
      return ok
    } catch {
      return false
    }
  }
}
