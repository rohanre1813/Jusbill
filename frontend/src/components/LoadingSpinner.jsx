/**
 * LoadingSpinner - Reusable animated loading ring component
 * Matches the BitzTracker indigo/purple design system.
 *
 * Props:
 *  size  - "sm" | "md" | "lg"  (default: "md")
 *  label - optional text shown below the spinner
 *  fullPage - if true, centers the spinner in the full viewport height
 */
export default function LoadingSpinner({ size = "md", label, fullPage = false }) {
  const sizeMap = {
    sm: { ring: "w-6 h-6", border: "border-2", dot: "w-1.5 h-1.5" },
    md: { ring: "w-12 h-12", border: "border-[3px]", dot: "w-2.5 h-2.5" },
    lg: { ring: "w-20 h-20", border: "border-4", dot: "w-4 h-4" },
  };

  const { ring, border, dot } = sizeMap[size] || sizeMap.md;

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-3">
      {/* Outer spinning ring */}
      <div className="relative flex items-center justify-center">
        {/* Track ring */}
        <div
          className={`${ring} ${border} rounded-full border-indigo-200 dark:border-indigo-900/60`}
        />
        {/* Active arc */}
        <div
          className={`absolute ${ring} ${border} rounded-full border-transparent border-t-indigo-500 border-r-purple-500 animate-spin`}
          style={{ animationDuration: "0.75s" }}
        />
        {/* Inner glow dot */}
        <div
          className={`absolute ${dot} rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 animate-ping opacity-75`}
          style={{ animationDuration: "1.2s" }}
        />
      </div>

      {label && (
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400 animate-pulse">
          {label}
        </p>
      )}
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        {spinner}
      </div>
    );
  }

  return spinner;
}
