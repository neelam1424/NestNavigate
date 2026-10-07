import type { Mood } from "@/game/mood"
import { mascotLines, mascotName } from "@/data/content"

type Props = { mood: Mood }

export default function Mascot({ mood }: Props) {
  const isHappy = mood === "happy"
  const isAnxious = mood === "anxious"
  const isSad = mood === "sad"

  return (
    <div key={mood} className={`mascot-${mood} flex flex-col items-center gap-1`}>
      <svg
        viewBox="0 0 120 120"
        role="img"
        aria-label={`${mascotName} looks ${mood}`}
        className="w-24 h-24"
      >
        {/* Body */}
        <ellipse cx="60" cy="72" rx="38" ry="42" className="fill-card stroke-foreground" strokeWidth="2" />
        {/* Belly patch */}
        <ellipse cx="60" cy="80" rx="24" ry="26" className="fill-muted stroke-foreground" strokeWidth="1.5" />
        {/* Left wing */}
        <ellipse cx="24" cy="74" rx="12" ry="7" transform="rotate(-20,24,74)" className="fill-muted stroke-foreground" strokeWidth="1.5" />
        {/* Right wing */}
        <ellipse cx="96" cy="74" rx="12" ry="7" transform="rotate(20,96,74)" className="fill-muted stroke-foreground" strokeWidth="1.5" />
        {/* Tail */}
        <ellipse cx="60" cy="111" rx="15" ry="5" className="fill-muted stroke-foreground" strokeWidth="1.5" />
        {/* Beak (amber) */}
        <polygon points="70,60 83,65 70,70" fill="#f59e0b" stroke="#d97706" strokeWidth="1" />

        {/* Eyes */}
        {isHappy ? (
          <>
            <path d="M 42,58 Q 48,52 54,58" fill="none" className="stroke-foreground" strokeWidth="2.5" strokeLinecap="round" />
            <path d="M 66,58 Q 72,52 78,58" fill="none" className="stroke-foreground" strokeWidth="2.5" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="48" cy="56" r="5" className="fill-foreground" />
            <circle cx="72" cy="56" r="5" className="fill-foreground" />
            <circle cx="50" cy="54" r="1.5" fill="white" />
            <circle cx="74" cy="54" r="1.5" fill="white" />
          </>
        )}

        {/* Brows */}
        {mood === "neutral" && (
          <>
            <line x1="42" y1="48" x2="54" y2="48" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
            <line x1="66" y1="48" x2="78" y2="48" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {isHappy && (
          <>
            <path d="M 42,48 Q 48,44 54,48" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
            <path d="M 66,48 Q 72,44 78,48" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {isAnxious && (
          <>
            <path d="M 42,50 Q 48,44 54,48" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
            <path d="M 66,48 Q 72,44 78,50" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
          </>
        )}
        {isSad && (
          <>
            <path d="M 42,48 Q 48,52 54,50" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
            <path d="M 66,50 Q 72,52 78,48" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
          </>
        )}

        {/* Mouth */}
        {mood === "neutral" && (
          <line x1="50" y1="79" x2="68" y2="79" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
        )}
        {isHappy && (
          <path d="M 48,76 Q 59,86 70,76" fill="none" className="stroke-foreground" strokeWidth="2.5" strokeLinecap="round" />
        )}
        {isAnxious && (
          <path d="M 48,79 Q 52,75 56,79 Q 60,83 64,79 Q 68,75 72,79" fill="none" className="stroke-foreground" strokeWidth="2" strokeLinecap="round" />
        )}
        {isSad && (
          <path d="M 48,83 Q 59,75 70,83" fill="none" className="stroke-foreground" strokeWidth="2.5" strokeLinecap="round" />
        )}

        {/* Extras */}
        {isHappy && (
          <g>
            <g transform="translate(10,18)">
              <line x1="-5" y1="0" x2="5" y2="0" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="0" y1="-5" x2="0" y2="5" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" />
              <line x1="-3.5" y1="-3.5" x2="3.5" y2="3.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="3.5" y1="-3.5" x2="-3.5" y2="3.5" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g transform="translate(108,22)">
              <line x1="-4" y1="0" x2="4" y2="0" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="-4" x2="0" y2="4" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            </g>
            <g transform="translate(112,48)">
              <line x1="-3" y1="0" x2="3" y2="0" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
              <line x1="0" y1="-3" x2="0" y2="3" stroke="#fbbf24" strokeWidth="1.5" strokeLinecap="round" />
            </g>
          </g>
        )}
        {isAnxious && (
          <g className="mascot-drop">
            <circle cx="102" cy="46" r="4" fill="#7dd3fc" />
            <polygon points="98,46 102,36 106,46" fill="#7dd3fc" />
          </g>
        )}
        {isSad && (
          <g className="mascot-drop">
            <circle cx="76" cy="70" r="3.5" fill="#7dd3fc" />
            <polygon points="72.5,70 76,61 79.5,70" fill="#7dd3fc" />
          </g>
        )}
      </svg>

      <p aria-live="polite" className="text-center text-xs text-muted-foreground leading-tight max-w-[10rem]">
        <span className="font-semibold">{mascotName}:</span> &quot;{mascotLines[mood]}&quot;
      </p>
    </div>
  )
}
