import { analytics } from '../config'

/**
 * 轻量埋点：只记录行为事件与匿名的答题选项 id，不含任何个人信息。
 * 每个事件带一个 dedupeKey，同一会话内相同 key 只上报一次，避免重复统计。
 */

export type EventName =
  | 'page_view'
  | 'quiz_start'
  | 'question_answer'
  | 'quiz_complete'
  | 'result_view'
  | 'poster_generate'
  | 'poster_save'
  | 'share_copy'
  | 'retry'
  | 'club_cta_click'

type Props = Record<string, string | number>

declare global {
  interface Window {
    umami?: { track: (name: string, data?: Props) => void }
    plausible?: (name: string, opts?: { props?: Props }) => void
  }
}

const SENT_KEY = 'nvceo_sent_events'

function sentSet(): Set<string> {
  try {
    return new Set(JSON.parse(sessionStorage.getItem(SENT_KEY) || '[]'))
  } catch {
    return memorySent
  }
}
const memorySent = new Set<string>()

function remember(set: Set<string>, key: string) {
  set.add(key)
  memorySent.add(key)
  try {
    sessionStorage.setItem(SENT_KEY, JSON.stringify([...set]))
  } catch {
    /* 隐私模式下 sessionStorage 不可用，退回内存去重 */
  }
}

export function track(name: EventName, props: Props = {}, dedupeKey?: string) {
  const key = dedupeKey ?? name
  const set = sentSet()
  if (set.has(key) || memorySent.has(key)) return
  remember(set, key)

  try {
    if (window.umami) return window.umami.track(name, props)
    if (window.plausible) return window.plausible(name, { props })
    if (analytics.endpoint) {
      const body = JSON.stringify({ name, props, t: Date.now() })
      const ok = navigator.sendBeacon?.(analytics.endpoint, new Blob([body], { type: 'application/json' }))
      if (!ok) fetch(analytics.endpoint, { method: 'POST', body, keepalive: true }).catch(() => {})
      return
    }
    if (import.meta.env.DEV) console.debug('[track]', name, props)
  } catch {
    /* 埋点失败不影响体验 */
  }
}

/** 每次答题流程一个随机 id，用于按轮次去重（重新挑战算新一轮） */
export function newAttemptId() {
  return Math.random().toString(36).slice(2, 10)
}
