/**
 * ViberSpace 社团 Logo（SVG 重绘版，用于网页与海报，导出图片时不会模糊）。
 * 拿到官方源文件后，可替换为 <img src="logo.svg"> 以完全还原。
 */

function Mark() {
  return (
    <g>
      {/* 闪光 */}
      <g stroke="#FFC61A" strokeWidth="3.6" strokeLinecap="round">
        <line x1="13" y1="4" x2="16" y2="11" />
        <line x1="4.5" y1="12" x2="10.5" y2="15.5" />
        <line x1="51" y1="4" x2="48" y2="11" />
        <line x1="59.5" y1="12" x2="53.5" y2="15.5" />
      </g>
      {/* 代码括号 */}
      <g stroke="#8B46FF" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round" fill="none">
        <polyline points="20,18 9,28.5 18,38" />
        <polyline points="44,18 55,28.5 46,38" />
      </g>
      {/* 星星吉祥物 */}
      <path
        d="M32 17 Q35 34 52 37.5 Q35 41 31.5 60 Q28.5 41.5 12 38.5 Q29 34 32 17 Z"
        fill="#FFC61A"
        stroke="#FFC61A"
        strokeWidth="3"
        strokeLinejoin="round"
      />
      <ellipse cx="28.6" cy="37.5" rx="1.9" ry="3.1" fill="#1E1033" />
      <ellipse cx="35.4" cy="37.5" rx="1.9" ry="3.1" fill="#1E1033" />
    </g>
  )
}

/** 完整横版 Logo：图形 + ViberSpace 字标 + 绿色轨道 */
export function LogoLockup({ height = 28, className = '' }: { height?: number; className?: string }) {
  return (
    <svg
      viewBox="0 0 258 64"
      height={height}
      width={(height * 258) / 64}
      className={className}
      role="img"
      aria-label="ViberSpace"
    >
      <Mark />
      <g transform="rotate(-7 165 36)">
        <ellipse cx="165" cy="36" rx="90" ry="17" fill="none" stroke="#A6F02B" strokeWidth="2.4" strokeDasharray="150 40 260 60" />
      </g>
      <path d="M236 10 Q237.2 16.8 244 18 Q237.2 19.2 236 26 Q234.8 19.2 228 18 Q234.8 16.8 236 10 Z" fill="#A6F02B" />
      <text
        x="72"
        y="45"
        fontSize="31"
        fontWeight="700"
        letterSpacing="-0.6"
        fill="#F4F1FA"
        style={{ fontFamily: "'Avenir Next', 'Montserrat', 'Helvetica Neue', system-ui, sans-serif" }}
      >
        ViberSpace
      </text>
    </svg>
  )
}

/** 仅图形 */
export function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg viewBox="0 0 64 64" width={size} height={size} role="img" aria-label="ViberSpace">
      <Mark />
    </svg>
  )
}
