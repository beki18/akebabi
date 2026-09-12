"use client";

import { MAP_DIMS, projectToMap, getUserMapPos, type Business } from "@/lib/businesses";
import { CATEGORIES } from "@/lib/businesses";

/**
 * Stylized SVG map of Addis Ababa showing business pins.
 * No external map tiles needed — fully self-contained and on-brand.
 */
export function MiniMap({
  businesses,
  selectedId,
  onSelect,
  className,
}: {
  businesses: Business[];
  selectedId?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}) {
  const userPos = getUserMapPos();

  // Sub-city zone labels (approximate positions on our map)
  const ZONES = [
    { name: "Piassa", x: 95, y: 25 },
    { name: "Bole", x: 280, y: 200 },
    { name: "Megenagna", x: 260, y: 130 },
    { name: "Kazanchis", x: 220, y: 160 },
    { name: "Sarbet", x: 130, y: 195 },
    { name: "Mekanisa", x: 30, y: 360 },
    { name: "22 Mazoria", x: 165, y: 80 },
  ];

  // Major "roads" (stylized dashed lines)
  const ROADS = [
    "M 50 20 L 200 100 L 320 220 L 380 360",   // main NE-SW artery
    "M 20 200 L 180 140 L 280 100 L 360 60",     // E-W road
    "M 100 440 L 220 300 L 340 180",             // southern road
  ];

  return (
    <div className={`relative w-full ${className ?? ""}`}>
      <svg
        viewBox={`0 0 ${MAP_DIMS.w} ${MAP_DIMS.h}`}
        className="w-full h-full"
        style={{ background: "var(--background)" }}
      >
        {/* Subtle grid */}
        <defs>
          <pattern id="mapGrid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="var(--border)" strokeWidth="0.5" opacity="0.5" />
          </pattern>
          <radialGradient id="userPulse" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.4" />
            <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
          </radialGradient>
        </defs>
        <rect width={MAP_DIMS.w} height={MAP_DIMS.h} fill="url(#mapGrid)" />

        {/* Sub-city zones (faint background blobs) */}
        <g opacity="0.5">
          {ZONES.map((z) => (
            <ellipse
              key={z.name}
              cx={z.x}
              cy={z.y + 10}
              rx={55}
              ry={40}
              fill="var(--muted)"
              opacity="0.3"
            />
          ))}
        </g>

        {/* Stylized roads */}
        <g stroke="var(--border)" strokeWidth="3" fill="none" strokeLinecap="round" opacity="0.7">
          {ROADS.map((d, i) => (
            <path key={i} d={d} strokeDasharray="2 6" />
          ))}
        </g>

        {/* Sub-city labels */}
        <g>
          {ZONES.map((z) => (
            <text
              key={z.name}
              x={z.x}
              y={z.y}
              textAnchor="middle"
              fontSize="11"
              fontWeight="600"
              fill="var(--muted-foreground)"
              style={{ pointerEvents: "none" }}
            >
              {z.name}
            </text>
          ))}
        </g>

        {/* User location pulse */}
        <g style={{ pointerEvents: "none" }}>
          <circle cx={userPos.x} cy={userPos.y} r={22} fill="url(#userPulse)" />
          <circle cx={userPos.x} cy={userPos.y} r={7} fill="var(--accent)" stroke="var(--background)" strokeWidth="2" />
          <text
            x={userPos.x}
            y={userPos.y - 14}
            textAnchor="middle"
            fontSize="9"
            fontWeight="700"
            fill="var(--accent)"
            style={{ pointerEvents: "none" }}
          >
            YOU
          </text>
        </g>

        {/* Business pins */}
        <g>
          {businesses.map((b) => {
            const { x, y } = projectToMap(b.lat, b.lng);
            const isSelected = b.id === selectedId;
            const isFeatured = b.featured;
            const r = isSelected ? 12 : 9;
            return (
              <g
                key={b.id}
                transform={`translate(${x}, ${y})`}
                onClick={() => onSelect?.(b.id)}
                style={{ cursor: onSelect ? "pointer" : "default" }}
              >
                {/* Selection ring */}
                {isSelected && (
                  <circle r={r + 6} fill="none" stroke="var(--primary)" strokeWidth="2" opacity="0.4">
                    <animate attributeName="r" values={`${r + 4};${r + 10};${r + 4}`} dur="1.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.4;0;0.4" dur="1.5s" repeatCount="indefinite" />
                  </circle>
                )}
                {/* Pin */}
                <circle
                  r={r}
                  fill={isFeatured ? "var(--accent)" : "var(--primary)"}
                  stroke="var(--background)"
                  strokeWidth="2.5"
                />
                {/* Rating inside pin */}
                <text
                  textAnchor="middle"
                  y={3}
                  fontSize="8"
                  fontWeight="700"
                  fill="var(--primary-foreground)"
                  style={{ pointerEvents: "none" }}
                >
                  {b.rating.toFixed(1)}
                </text>
              </g>
            );
          })}
        </g>
      </svg>
    </div>
  );
}
