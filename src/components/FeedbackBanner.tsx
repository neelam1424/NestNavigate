type Props = { correct: boolean; text: string; hint?: string; mayaReaction?: string }

export default function FeedbackBanner({ correct, text, hint, mayaReaction }: Props) {
  return (
    <div className="space-y-2" role="status" aria-live="polite">
      <div
        className={`rounded border-2 p-4 font-mono text-sm
          ${correct
            ? "border-green-700 bg-green-50 text-green-900 dark:border-green-500 dark:bg-green-950/30 dark:text-green-100"
            : "border-red-700 bg-red-50 text-red-900 dark:border-red-500 dark:bg-red-950/30 dark:text-red-100"
          }`}
      >
        <p className="mb-1 text-xs font-bold uppercase tracking-widest">
          {correct ? "LENDER: Accepted" : "LENDER: Pushed back"}
        </p>
        <p>{text}</p>
        {hint && (
          <p className="mt-2 border-t border-current/30 pt-2 text-xs">
            Note: {hint}
          </p>
        )}
      </div>
      {correct && mayaReaction && (
        <div className="-rotate-1 rounded border border-amber-400 bg-amber-50 px-3 py-2 text-sm dark:bg-amber-950/30">
          <span className="mr-1 font-semibold">Maya:</span>
          <span className="italic">{mayaReaction}</span>
        </div>
      )}
    </div>
  )
}
