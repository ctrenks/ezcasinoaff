export default function Logo({ className = "" }: { className?: string }) {
  return (
    <div className="flex items-center gap-3">
      <svg
        viewBox="0 0 100 100"
        className={className}
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Red stamp circle background */}
        <circle
          cx="50"
          cy="50"
          r="45"
          fill="none"
          stroke="#dc2626"
          strokeWidth="4"
          strokeDasharray="5,3"
          opacity="0.9"
        />

        {/* Inner circle */}
        <circle
          cx="50"
          cy="50"
          r="38"
          fill="none"
          stroke="#dc2626"
          strokeWidth="2"
          opacity="0.9"
        />

        {/* EZ text in stamp */}
        <text
          x="50"
          y="60"
          fontSize="32"
          fontWeight="900"
          fill="#dc2626"
          textAnchor="middle"
          fontFamily="Arial, sans-serif"
          style={{ letterSpacing: "-2px" }}
        >
          EZ
        </text>

        {/* Stamp texture lines */}
        <line
          x1="10"
          y1="25"
          x2="90"
          y2="25"
          stroke="#dc2626"
          strokeWidth="1"
          opacity="0.3"
        />
        <line
          x1="10"
          y1="75"
          x2="90"
          y2="75"
          stroke="#dc2626"
          strokeWidth="1"
          opacity="0.3"
        />
      </svg>

      <div className="flex flex-col">
        <span className="text-xl font-bold text-white leading-tight">
          Casino
        </span>
        <span className="text-sm font-semibold text-purple-300 leading-tight">
          Affiliates
        </span>
      </div>
    </div>
  );
}
