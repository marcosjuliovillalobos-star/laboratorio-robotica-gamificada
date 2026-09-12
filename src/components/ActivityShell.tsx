import { useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RobiBot, RobotMood } from './RobiBot';
import { Lightbulb, RotateCcw, ArrowRight, ArrowLeft, CheckCircle2, HelpCircle } from 'lucide-react';
import { playClickSound, playLevelUpSound } from '../utils/audio';

interface ActivityShellProps {
  title: string;
  levelNumber: number;
  axis: string;
  objective: string;
  howTo: string;
  hints: string[];
  robotMood?: RobotMood;
  robotMessage?: string;
  isCompleted?: boolean;
  soundEnabled?: boolean;
  onRetry?: () => void;
  onNext?: () => void;
  onBackToLevels: () => void;
  children: ReactNode;
}

export function ActivityShell({
  title,
  levelNumber,
  axis,
  objective,
  howTo,
  hints,
  robotMood = 'idle',
  robotMessage,
  isCompleted = false,
  soundEnabled = true,
  onRetry,
  onNext,
  onBackToLevels,
  children,
}: ActivityShellProps) {
  const [hintIndex, setHintIndex] = useState<number>(0);
  const [showHintModal, setShowHintModal] = useState<boolean>(false);
  const [showHowTo, setShowHowTo] = useState<boolean>(false);

  const handleNextHint = () => {
    playClickSound(soundEnabled);
    if (!showHintModal) {
      setShowHintModal(true);
      setHintIndex(0);
    } else {
      if (hintIndex < hints.length - 1) {
        setHintIndex(hintIndex + 1);
      } else {
        setShowHintModal(false);
      }
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      {/* Top Breadcrumb & Actions */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              onBackToLevels();
            }}
            className="flex items-center gap-1 text-xs font-mono text-cyan-400 hover:text-cyan-300 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" /> MISIONES
          </button>
          <span className="text-slate-600">/</span>
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-950/80 text-cyan-300 border border-cyan-500/30">
            NIVEL {levelNumber}
          </span>
          <span className="text-xs text-slate-400 hidden sm:inline">{axis}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* How to toggle */}
          <button
            onClick={() => {
              playClickSound(soundEnabled);
              setShowHowTo(!showHowTo);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-cyan-500/40 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all"
          >
            <HelpCircle className="w-3.5 h-3.5 text-cyan-400" />
            <span>¿Cómo se hace?</span>
          </button>

          {/* Progressive Hint Button */}
          {hints.length > 0 && (
            <button
              onClick={handleNextHint}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-950/60 border border-amber-500/40 hover:border-amber-400 text-amber-300 hover:text-amber-200 text-xs font-semibold transition-all shadow-[0_0_10px_rgba(245,158,11,0.15)]"
            >
              <Lightbulb className="w-3.5 h-3.5 text-amber-400" />
              <span>
                💡 PISTA {showHintModal ? `(${hintIndex + 1}/${hints.length})` : ''}
              </span>
            </button>
          )}

          {/* Retry Button */}
          {onRetry && (
            <button
              onClick={() => {
                playClickSound(soundEnabled);
                onRetry();
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 hover:text-slate-100 text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5 text-slate-400" />
              <span>Reintentar</span>
            </button>
          )}
        </div>
      </div>

      {/* Main Header Card */}
      <div className="bg-slate-950/90 rounded-2xl p-4 sm:p-5 border border-cyan-500/30 mb-6 shadow-[0_0_20px_rgba(6,182,212,0.1)] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 flex items-center gap-2.5">
            <span>{title}</span>
            {isCompleted && (
              <span className="inline-flex items-center gap-1 text-xs font-sans text-emerald-400 bg-emerald-950/90 border border-emerald-500/50 px-2.5 py-0.5 rounded-full font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" /> Misión Superada
              </span>
            )}
          </h1>
          <div className="mt-2 text-xs sm:text-sm text-cyan-200/90 flex items-start gap-2">
            <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono shrink-0">
              ¿QUÉ TENÉS QUE HACER?:
            </span>
            <span>{objective}</span>
          </div>

          <AnimatePresence>
            {showHowTo && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-3 p-3 rounded-xl bg-cyan-950/40 border border-cyan-500/20 text-xs text-slate-300 overflow-hidden"
              >
                <span className="text-cyan-400 font-bold uppercase tracking-wider font-mono">
                  ¿CÓMO LO HACÉS?:{' '}
                </span>
                {howTo}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Small ROBI Guide companion */}
        <div className="shrink-0 flex items-center justify-center">
          <RobiBot
            size="sm"
            mood={robotMood}
            message={robotMessage}
            soundEnabled={soundEnabled}
          />
        </div>
      </div>

      {/* Active Hint Banner if open */}
      <AnimatePresence>
        {showHintModal && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="mb-6 p-4 rounded-xl bg-amber-950/80 border border-amber-500/50 shadow-[0_0_15px_rgba(245,158,11,0.2)] flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-3">
              <span className="text-2xl">💡</span>
              <div>
                <h4 className="text-xs font-mono font-bold text-amber-400 uppercase tracking-wider">
                  PISTA {hintIndex + 1} DE {hints.length}
                </h4>
                <p className="text-sm text-amber-100 mt-0.5">
                  {hints[hintIndex]}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {hintIndex < hints.length - 1 ? (
                <button
                  onClick={handleNextHint}
                  className="text-xs px-3 py-1 rounded bg-amber-500 text-slate-950 font-bold hover:bg-amber-400 transition-colors"
                >
                  Siguiente Pista
                </button>
              ) : (
                <button
                  onClick={() => setShowHintModal(false)}
                  className="text-xs px-3 py-1 rounded bg-slate-800 text-slate-300 hover:text-white transition-colors"
                >
                  Entendido
                </button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Interactive Child Work Area */}
      <div className="bg-slate-900/80 rounded-2xl p-4 sm:p-6 border border-slate-800 shadow-xl min-h-[420px] flex flex-col justify-between">
        {children}
      </div>

      {/* Bottom Completion & Navigation Bar */}
      {isCompleted && onNext && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-2xl bg-gradient-to-r from-emerald-950/80 to-cyan-950/80 border border-emerald-500/50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        >
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h4 className="font-display font-bold text-slate-100 text-base">
                ¡MISIÓN COMPLETADA CON ÉXITO!
              </h4>
              <p className="text-xs text-emerald-300">
                ¡Excelente trabajo aplicando los conceptos de robótica!
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              playLevelUpSound(soundEnabled);
              onNext();
            }}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-display font-bold text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(16,185,129,0.4)] transition-all"
          >
            <span>SIGUIENTE MISIÓN</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </motion.div>
      )}
    </div>
  );
}
