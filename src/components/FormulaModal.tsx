import React from 'react';
import { BookOpen, X } from 'lucide-react';

interface FormulaModalProps {
  open: boolean;
  heuristicWeight: number;
  euclideanDistance: number;
  onClose: () => void;
}

export const FormulaModal: React.FC<FormulaModalProps> = ({
  open,
  heuristicWeight,
  euclideanDistance,
  onClose,
}) => {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/40 flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="formula-modal-title"
    >
      <div className="bg-surface-container-lowest border border-outline-variant rounded-xl max-w-lg w-full p-6 shadow-xl flex flex-col gap-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-secondary" />
            <h3 id="formula-modal-title" className="text-base font-semibold text-on-surface">
              A* Pathfinding &amp; Kinematics Formulas
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close formula docs"
            className="p-1 rounded-lg text-on-surface-variant hover:bg-surface-container-low cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="space-y-3 text-sm text-on-surface-variant">
          <div className="bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/40">
            <div className="font-mono text-xs uppercase text-outline mb-1">
              Weighted A* Cost Function
            </div>
            <div className="font-mono text-sm font-semibold text-secondary">
              f(n) = g(n) + {heuristicWeight.toFixed(2)} · h(n)
            </div>
            <p className="text-xs mt-1.5 leading-relaxed">
              Where <code className="font-mono text-primary">g(n)</code> is exact path cost
              from start and <code className="font-mono text-primary">h(n)</code> is the
              Manhattan heuristic <code className="font-mono">|x₂ - x₁| + |y₂ - y₁|</code>.
            </p>
          </div>

          <div className="bg-surface-container-low rounded-lg p-3.5 border border-outline-variant/40">
            <div className="font-mono text-xs uppercase text-outline mb-1">
              Euclidean Straight-Line Distance
            </div>
            <div className="font-mono text-sm font-semibold text-on-surface">
              d = √((x₂ - x₁)² + (y₂ - y₁)²) = {euclideanDistance.toFixed(2)} units
            </div>
            <p className="text-xs mt-1.5 leading-relaxed">
              Provides the lower-bound physical displacement vector between Rover origin and
              Goal Beacon.
            </p>
          </div>
        </div>

        <div className="flex justify-end pt-1">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-sm font-semibold cursor-pointer"
          >
            Got it
          </button>
        </div>
      </div>
    </div>
  );
};
