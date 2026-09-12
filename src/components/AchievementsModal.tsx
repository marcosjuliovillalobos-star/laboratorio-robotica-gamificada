import { UserProgress } from '../types';
import { X, Trophy, CheckCircle2, Lock } from 'lucide-react';

interface AchievementsModalProps {
  progress: UserProgress;
  onClose: () => void;
}

export function AchievementsModal({ progress, onClose }: AchievementsModalProps) {
  const totalUnlocked = progress.achievements.filter(a => a.unlocked).length;
  const totalCount = progress.achievements.length || 1;
  const percent = Math.round((totalUnlocked / totalCount) * 100);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-slate-950 border border-cyan-500/40 rounded-3xl p-6 shadow-[0_0_50px_rgba(6,182,212,0.25)] space-y-5 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-cyan-950 border border-cyan-400 text-cyan-300">
              <Trophy className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-xl font-display font-bold text-slate-100">
                Medallero de Robótica
              </h2>
              <p className="text-xs font-mono text-cyan-400">
                {totalUnlocked} de {progress.achievements.length} Insignias Desbloqueadas ({percent}%)
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-400 hover:text-cyan-300 transition-all"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-slate-900 h-3 rounded-full overflow-hidden border border-slate-800 p-0.5">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 via-purple-500 to-emerald-400 rounded-full transition-all duration-500"
            style={{ width: `${percent}%` }}
          />
        </div>

        {/* Achievement Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 flex-1 py-1">
          {progress.achievements.map(ach => {
            const isUnlocked = ach.unlocked;
            return (
              <div
                key={ach.id}
                className={`p-3.5 rounded-2xl border transition-all flex items-start gap-3 ${
                  isUnlocked
                    ? 'bg-cyan-950/40 border-cyan-500/50 shadow-[0_0_12px_rgba(6,182,212,0.15)]'
                    : 'bg-slate-900/40 border-slate-800/80 opacity-60'
                }`}
              >
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shrink-0 ${
                    isUnlocked
                      ? 'bg-cyan-950 border-cyan-400 text-cyan-300 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 border-slate-800 text-slate-600'
                  }`}
                >
                  {ach.icon}
                </div>

                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="text-xs font-bold text-slate-200 font-display">
                      {ach.title}
                    </span>
                    {isUnlocked ? (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    ) : (
                      <Lock className="w-3.5 h-3.5 text-slate-600" />
                    )}
                  </div>
                  <p className="text-[11px] text-slate-400 leading-tight">
                    {ach.description}
                  </p>
                  <span className="text-[10px] font-mono text-cyan-400 font-bold block pt-0.5">
                    +{ach.xpReward} XP
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
          <span className="text-xs font-mono text-slate-400 italic">
            “Jugá. Programá. Probá. Equivocate. Mejorá.”
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
