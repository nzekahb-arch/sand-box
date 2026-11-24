import React, { useMemo, useState } from 'react';
import { Sigma } from 'lucide-react';

export const PhysicsMathView: React.FC = () => {
  const [velocity, setVelocity] = useState(24);
  const [angleDeg, setAngleDeg] = useState(45);
  const [gravity, setGravity] = useState(9.81);

  const metrics = useMemo(() => {
    const rad = (angleDeg * Math.PI) / 180;
    const vx = velocity * Math.cos(rad);
    const vy = velocity * Math.sin(rad);
    const flightTime = (2 * vy) / gravity;
    const maxHeight = (vy * vy) / (2 * gravity);
    const range = vx * flightTime;

    const points: { x: number; y: number }[] = [];
    const samples = 36;
    for (let i = 0; i <= samples; i++) {
      const t = (flightTime * i) / samples;
      const x = vx * t;
      const y = Math.max(0, vy * t - 0.5 * gravity * t * t);
      points.push({ x, y });
    }

    return { vx, vy, flightTime, maxHeight, range, points };
  }, [velocity, angleDeg, gravity]);

  const svgW = 560;
  const svgH = 260;
  const pad = 28;
  const maxPlotX = Math.max(60, Math.ceil(metrics.range * 1.1));
  const maxPlotY = Math.max(30, Math.ceil(metrics.maxHeight * 1.25));

  const toSvgX = (x: number) => pad + (x / maxPlotX) * (svgW - pad * 2);
  const toSvgY = (y: number) => svgH - pad - (y / maxPlotY) * (svgH - pad * 2);

  const pathD = metrics.points
    .map((p, idx) => `${idx === 0 ? 'M' : 'L'} ${toSvgX(p.x).toFixed(1)} ${toSvgY(p.y).toFixed(1)}`)
    .join(' ');

  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div>
        <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
          Interactive Kinematics Sandbox
        </span>
        <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
          Physics &amp; Math: Projectile Vector &amp; Trajectory Lab
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Adjust initial launch velocity, elevation angle, and gravitational acceleration to inspect real-time kinematics.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        <div className="lg:col-span-4 bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 space-y-5">
          <div className="flex items-center gap-2">
            <Sigma className="w-5 h-5 text-secondary" />
            <h2 className="text-base font-semibold text-on-surface">Kinematics Controls</h2>
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-on-surface-variant">Initial Velocity (v₀)</span>
              <span className="font-mono font-bold text-primary tabular-nums">{velocity} m/s</span>
            </div>
            <input
              type="range"
              min={5}
              max={45}
              step={1}
              value={velocity}
              onChange={(e) => setVelocity(Number(e.target.value))}
              className="w-full accent-primary-container cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-on-surface-variant">Launch Angle (θ)</span>
              <span className="font-mono font-bold text-secondary tabular-nums">{angleDeg}°</span>
            </div>
            <input
              type="range"
              min={10}
              max={85}
              step={1}
              value={angleDeg}
              onChange={(e) => setAngleDeg(Number(e.target.value))}
              className="w-full accent-secondary cursor-pointer"
            />
          </div>

          <div className="space-y-1.5">
            <div className="flex justify-between text-xs">
              <span className="font-semibold text-on-surface-variant">Gravity (g)</span>
              <span className="font-mono font-bold text-on-surface tabular-nums">
                {gravity.toFixed(2)} m/s²
              </span>
            </div>
            <div className="grid grid-cols-3 gap-2">
              {[
                { label: 'Moon (1.62)', val: 1.62 },
                { label: 'Mars (3.72)', val: 3.72 },
                { label: 'Earth (9.81)', val: 9.81 },
              ].map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => setGravity(preset.val)}
                  className={`py-1.5 px-2 rounded text-[11px] font-mono font-semibold border cursor-pointer ${
                    Math.abs(gravity - preset.val) < 0.05
                      ? 'bg-primary-container text-white border-primary-container'
                      : 'bg-surface-container-low text-on-surface border-outline-variant/50'
                  }`}
                >
                  {preset.label}
                </button>
              ))}
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3.5 font-mono text-xs space-y-1.5 border border-outline-variant/40">
            <div className="text-outline uppercase text-[10px]">Active Equations</div>
            <div className="text-on-surface">
              x(t) = ({metrics.vx.toFixed(2)}) · t
            </div>
            <div className="text-on-surface">
              y(t) = ({metrics.vy.toFixed(2)}) · t - 0.5 · {gravity.toFixed(2)} · t²
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/40">
              <div className="font-mono text-[10px] uppercase text-outline">Max Range</div>
              <div className="text-xl font-bold text-primary tabular-nums">
                {metrics.range.toFixed(2)} m
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/40">
              <div className="font-mono text-[10px] uppercase text-outline">Apex Height</div>
              <div className="text-xl font-bold text-secondary tabular-nums">
                {metrics.maxHeight.toFixed(2)} m
              </div>
            </div>
            <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/40">
              <div className="font-mono text-[10px] uppercase text-outline">Flight Time</div>
              <div className="text-xl font-bold text-emerald-700 tabular-nums">
                {metrics.flightTime.toFixed(2)} s
              </div>
            </div>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3 border border-outline-variant/40">
            <svg viewBox={`0 0 ${svgW} ${svgH}`} className="w-full h-auto bg-white rounded-md">
              <line
                x1={pad}
                y1={svgH - pad}
                x2={svgW - pad}
                y2={svgH - pad}
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              <line
                x1={pad}
                y1={pad}
                x2={pad}
                y2={svgH - pad}
                stroke="#94A3B8"
                strokeWidth="1.5"
              />
              <path
                d={pathD}
                fill="none"
                stroke="#1D4ED8"
                strokeWidth="3"
                strokeLinecap="round"
              />
              <circle
                cx={toSvgX(metrics.range / 2)}
                cy={toSvgY(metrics.maxHeight)}
                r="5"
                fill="#712EDD"
              />
              <text
                x={toSvgX(metrics.range / 2)}
                y={toSvgY(metrics.maxHeight) - 10}
                textAnchor="middle"
                fontFamily="JetBrains Mono"
                fontSize="10"
                fill="#712EDD"
                fontWeight="700"
              >
                Apex ({metrics.maxHeight.toFixed(1)}m)
              </text>
              <circle
                cx={toSvgX(metrics.range)}
                cy={toSvgY(0)}
                r="5"
                fill="#16A34A"
              />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};
