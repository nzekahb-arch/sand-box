import React from 'react';
import { ArrowRight, CheckCircle2, Trophy } from 'lucide-react';
import { ChallengeItem } from '../types/sandbox';

interface ChallengesViewProps {
  challenges: ChallengeItem[];
  completedChallengeIds: string[];
  onStartChallenge: (challenge: ChallengeItem) => void;
}

export const ChallengesView: React.FC<ChallengesViewProps> = ({
  challenges,
  completedChallengeIds,
  onStartChallenge,
}) => {
  return (
    <div className="p-5 md:p-8 bg-surface w-full max-w-[1440px] mx-auto space-y-6">
      <div>
        <span className="font-mono text-[11px] text-outline uppercase tracking-wider">
          Autonomous Verification Suite
        </span>
        <h1 className="text-[24px] leading-8 font-semibold text-on-surface tracking-tight mt-0.5">
          STEM Robotics Challenges
        </h1>
        <p className="text-[14px] text-on-surface-variant mt-1">
          Solve constrained navigation scenarios in the Code Playground to earn XP and verify edge-case robustness.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {challenges.map((chal) => {
          const isDone = completedChallengeIds.includes(chal.id);
          return (
            <div
              key={chal.id}
              className="bg-surface-container-lowest border border-outline-variant/60 rounded-lg p-5 flex flex-col justify-between gap-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold ${
                      chal.difficulty === 'Beginner'
                        ? 'bg-emerald-100 text-emerald-900'
                        : chal.difficulty === 'Intermediate'
                          ? 'bg-amber-100 text-amber-900'
                          : 'bg-secondary-fixed text-on-secondary-fixed'
                    }`}
                  >
                    {chal.difficulty}
                  </span>
                  <span className="inline-flex items-center gap-1 font-mono text-[11px] font-bold text-secondary">
                    <Trophy className="w-3.5 h-3.5" />+{chal.xpReward} XP
                  </span>
                </div>

                <h2 className="text-base font-semibold text-on-surface flex items-center gap-2">
                  <span>{chal.title}</span>
                  {isDone && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
                </h2>
                <p className="text-xs text-on-surface-variant leading-relaxed">
                  {chal.description}
                </p>
              </div>

              <div className="pt-3 border-t border-surface-container flex items-center justify-between">
                <span className="font-mono text-[11px] text-outline">
                  Goal: ({chal.targetCoord.x}, {chal.targetCoord.y})
                </span>
                <button
                  type="button"
                  onClick={() => onStartChallenge(chal)}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary-container hover:bg-primary text-white text-xs font-semibold cursor-pointer"
                >
                  <span>{isDone ? 'Replay' : 'Attempt'}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
