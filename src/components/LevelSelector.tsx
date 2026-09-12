import { motion } from 'motion/react';
import { UserProgress, Screen } from '../types';
import { LEVELS_CONFIG } from '../data/initialData';
import { Lock, CheckCircle2, ArrowLeft, Star, Sparkles } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface LevelSelectorProps {
  progress: UserProgress;
  onSelectLevel: (screen: Screen) => void;
  onBack: () => void;
}

export function LevelSelector({ progress, onSelectLevel, onBack }: LevelSelectorProps) {
  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onBack();
            }}
            className="inline-flex items-center gap-2 text-sm text-cyan-400 hover:text-cyan-300 font-mono mb-2 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> VOLVER AL MENÚ
          </button>
          <h1 className="text-2xl sm:text-3xl font-display font-bold text-slate-100 flex items-center gap-3">
            <span>SELECCIONÁ TU MISIÓN</span>
            <span className="text-xs font-mono font-normal bg-cyan-950/80 text-cyan-300 border border-cyan-500/30 px-3 py-1 rounded-full">
              {progress.completedActivities.length} / {LEVELS_CONFIG.length} Superados
            </span>
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Comenzá por el Nivel 1 y avanzá paso a paso descubriendo los fundamentos de la robótica.
          </p>
        </div>
      </div>

      {/* Grid of Missions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {LEVELS_CONFIG.map((lvl, index) => {
          const isUnlocked = progress.unlockedLevels.includes(lvl.id);
          const isCompleted = progress.completedActivities.includes(lvl.slug);

          return (
            <motion.div
              key={lvl.id}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.04 }}
              className={`relative rounded-2xl p-5 border transition-all duration-300 flex flex-col justify-between ${
                isCompleted
                  ? 'bg-slate-950/90 border-emerald-500/50 shadow-[0_0_15px_rgba(16,185,129,0.15)] hover:border-emerald-400'
                  : isUnlocked
                  ? 'bg-slate-900/90 border-cyan-500/40 shadow-[0_0_15px_rgba(6,182,212,0.15)] hover:border-cyan-400 hover:scale-[1.01]'
                  : 'bg-slate-950/40 border-slate-800 opacity-60'
              }`}
            >
              <div>
                {/* Level Top Meta */}
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">{lvl.icon}</span>
                    <span className="text-xs font-mono font-semibold px-2 py-0.5 rounded bg-slate-900 border border-slate-700 text-slate-300">
                      NIVEL {lvl.id}
                    </span>
                    <span className="text-[11px] font-mono text-cyan-400/80">
                      {lvl.axis}
                    </span>
                  </div>

                  <div>
                    {isCompleted ? (
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-400 font-semibold bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-500/40">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Superado
                      </span>
                    ) : isUnlocked ? (
                      <span className="inline-flex items-center gap-1 text-xs text-cyan-300 font-medium bg-cyan-950/80 px-2 py-0.5 rounded-full border border-cyan-500/30">
                        <Star className="w-3.5 h-3.5 text-cyan-400" /> Disponible
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs text-slate-500 bg-slate-900 px-2 py-0.5 rounded-full border border-slate-800">
                        <Lock className="w-3.5 h-3.5" /> Bloqueado
                      </span>
                    )}
                  </div>
                </div>

                {/* Title & Subtitle */}
                <h3 className="text-lg font-display font-bold text-slate-100 group-hover:text-cyan-300 transition-colors">
                  {lvl.title}
                </h3>
                <p className="text-xs font-medium text-cyan-400/90 mb-2">
                  {lvl.subtitle}
                </p>
                <p className="text-xs text-slate-400 leading-relaxed">
                  {lvl.description}
                </p>
              </div>

              {/* Card Footer */}
              <div className="mt-5 pt-4 border-t border-slate-800/80 flex items-center justify-between">
                <span className="text-xs font-mono text-purple-300 flex items-center gap-1">
                  <Sparkles className="w-3.5 h-3.5 text-purple-400" /> +{lvl.xpReward} XP
                </span>

                <button
                  disabled={!isUnlocked}
                  onClick={() => {
                    playClickSound(progress.soundEnabled);
                    onSelectLevel(lvl.slug as Screen);
                  }}
                  className={`px-4 py-1.5 rounded-lg text-xs font-semibold tracking-wider font-display uppercase transition-all ${
                    isCompleted
                      ? 'bg-emerald-950/90 hover:bg-emerald-900/90 text-emerald-300 border border-emerald-500/50'
                      : isUnlocked
                      ? 'bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold shadow-[0_0_12px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-800/50 text-slate-500 cursor-not-allowed border border-slate-700/50'
                  }`}
                >
                  {isCompleted ? 'Repasar' : isUnlocked ? 'Jugar' : 'Bloqueado'}
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
