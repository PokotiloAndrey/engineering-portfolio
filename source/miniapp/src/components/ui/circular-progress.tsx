export function CircularProgress({
    completedSteps,
    totalSteps,
    size = 72,
    strokeWidth = 8,
    gapDegrees = 8,
    label,
    className,
  }: {
    completedSteps: number;
    totalSteps: number;
    size?: number;
    strokeWidth?: number;
    gapDegrees?: number;
    label?: React.ReactNode;
    className?: string;
  }) {
    const radius = (size - strokeWidth) / 2;
    const circumference = 2 * Math.PI * radius;
    const segmentCount = Math.max(totalSteps, 1);
    const segmentDegrees = 360 / segmentCount;
    const gap = Math.min(gapDegrees, segmentDegrees * 0.4);
    const arcDegrees = segmentDegrees - gap;
    const arcLength = (arcDegrees / 360) * circumference;
    const gapLength = circumference - arcLength;
  
    return (
      <div
        className={`relative inline-flex shrink-0 items-center justify-center ${className ?? ""}`}
        style={{ width: size, height: size }}
      >
        <svg className="-rotate-90" height={size} width={size}>
          {Array.from({ length: segmentCount }).map((_, index) => {
            const isCompleted = index < completedSteps;
            const rotation = index * segmentDegrees + gap / 2;
  
            return (
              <circle
                key={index}
                className={isCompleted ? "text-foreground" : "text-muted"}
                cx={size / 2}
                cy={size / 2}
                fill="none"
                r={radius}
                stroke="currentColor"
                strokeDasharray={`${arcLength} ${gapLength}`}
                strokeLinecap="round"
                strokeWidth={strokeWidth}
                style={{
                  transform: `rotate(${rotation}deg)`,
                  transformOrigin: "50% 50%",
                  transition: "stroke 0.3s ease-out",
                }}
              />
            );
          })}
        </svg>
  
        <div className="absolute inset-0 flex items-center justify-center">
          {label ?? (
            <span className="text-sm font-semibold tabular-nums">
              {completedSteps}/{totalSteps}
            </span>
          )}
        </div>
      </div>
    );
  }