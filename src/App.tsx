import { useEffect, useRef, useState } from 'react'
import { site } from './config'
import { computeResult, type Result } from './lib/scoring'
import { newAttemptId, track } from './lib/analytics'
import Home from './components/Home'
import Quiz from './components/Quiz'
import Review from './components/Review'
import ResultView from './components/ResultView'

type Stage = 'home' | 'quiz' | 'review' | 'result'

export default function App() {
  const [stage, setStage] = useState<Stage>('home')
  const [result, setResult] = useState<Result | null>(null)
  const attempt = useRef(newAttemptId())

  useEffect(() => {
    // from=qr 表示从海报二维码扫进来的
    const from = new URLSearchParams(location.search).get('from') || 'direct'
    track('page_view', { from })
  }, [])

  useEffect(() => {
    window.scrollTo({ top: 0 })
  }, [stage])

  const start = () => {
    track('quiz_start', {}, `quiz_start:${attempt.current}`)
    setStage('quiz')
  }

  const finish = (answers: string[]) => {
    const r = computeResult(answers)
    track('quiz_complete', { persona: r.persona.id, score: r.score }, `quiz_complete:${attempt.current}`)
    setResult(r)
    setStage('review')
  }

  const retry = () => {
    track('retry', {}, `retry:${attempt.current}`)
    attempt.current = newAttemptId()
    setResult(null)
    track('quiz_start', {}, `quiz_start:${attempt.current}`)
    setStage('quiz')
  }

  return (
    <div className="relative min-h-dvh">
      <div className="grid-bg pointer-events-none fixed inset-x-0 top-0 h-[70vh]" aria-hidden />
      <DisclaimerBar />
      <main className="relative mx-auto w-full max-w-[480px] px-4 pb-[max(env(safe-area-inset-bottom),24px)]">
        {stage === 'home' && <Home onStart={start} />}
        {stage === 'quiz' && <Quiz key={attempt.current} attemptId={attempt.current} onFinish={finish} />}
        {stage === 'review' && <Review onDone={() => setStage('result')} />}
        {stage === 'result' && result && (
          <ResultView result={result} attemptId={attempt.current} onRetry={retry} />
        )}
      </main>
    </div>
  )
}

function DisclaimerBar() {
  return (
    <div className="sticky top-0 z-30 border-b border-line/80 bg-ink/85 pt-[env(safe-area-inset-top)] backdrop-blur">
      <p className="mx-auto max-w-[480px] px-4 py-1.5 text-center font-mono text-[11px] leading-4 text-mute">
        {site.disclaimer}
      </p>
    </div>
  )
}
