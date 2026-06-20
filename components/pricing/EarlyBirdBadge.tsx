type Props = {
  className?: string;
};

export function EarlyBirdBadge({ className = "" }: Props) {
  return (
    <p
      className={`inline-flex items-center gap-1.5 rounded-lg border border-amber-500/35 bg-amber-500/10 px-3 py-1.5 text-sm text-amber-100 ${className}`}
    >
      <span aria-hidden>🎁</span>
      <span>
        <strong className="font-semibold">Early Bird</strong> — you got +2 months free!
      </span>
    </p>
  );
}
