import { UserProgress, Screen } from '../types';
import { calculatePlayerLevel } from '../utils/storage';
import { Volume2, VolumeX, Award, BookOpen, GraduationCap, Home } from 'lucide-react';
import { playClickSound } from '../utils/audio';

interface CyberNavbarProps {
  progress: UserProgress;
  currentScreen: Screen;
  onNavigate: (screen: Screen) => void;
  onToggleSound: () => void;
  onOpenAchievements: () => void;
  onOpenDocente: () => void;
  onOpenGuia: () => void;
}

export function CyberNavbar({
  progress,
  currentScreen,
  onNavigate,
  onToggleSound,
  onOpenAchievements,
  onOpenDocente,
  onOpenGuia,
}: CyberNavbarProps) {
  const levelInfo = calculatePlayerLevel(progress.xp);
  const unlockedAchievementsCount = progress.achievements.filter(a => a.unlocked).length;

  return (
    <header className="sticky top-0 z-40 w-full bg-[#040814]/90 backdrop-blur-md border-b border-cyan-500/30 shadow-[0_4px_20px_rgba(0,240,255,0.08)]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-2 sm:gap-4">
        {/* Left: Brand & Home Button */}
        <div className="flex items-center gap-3">
          {currentScreen !== 'menu' ? (
            <button
              onClick={() => {
                playClickSound(progress.soundEnabled);
                onNavigate('menu');
              }}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 hover:bg-cyan-900/60 hover:border-cyan-400 text-xs sm:text-sm font-semibold transition-all shadow-[0_0_10px_rgba(6,182,212,0.2)] active:scale-95"
              title="Volver al Menú Principal"
            >
              <Home className="w-4 h-4" />
              <span className="hidden md:inline">MENÚ</span>
            </button>
          ) : null}

          <div 
            onClick={() => onNavigate('menu')} 
            className="cursor-pointer flex flex-col"
          >
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00f0ff] animate-pulse" />
              <span className="font-display font-bold text-sm sm:text-base tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 via-sky-200 to-purple-300">
                LABORATORIO VIRTUAL
              </span>
            </div>
            <span className="text-[10px] text-cyan-400/80 font-mono tracking-widest hidden sm:inline">
              ROBÓTICA APLICADA • 3.º AÑO
            </span>
          </div>
        </div>

        {/* Center: XP & Level Indicator */}
        <div className="hidden lg:flex items-center gap-3 bg-slate-900/80 px-4 py-1.5 rounded-full border border-cyan-500/20 shadow-inner">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold text-cyan-400 font-mono bg-cyan-950/90 px-2 py-0.5 rounded border border-cyan-500/40">
              NIVEL {levelInfo.currentLevel}
            </span>
            <span className="text-xs text-slate-300 font-medium truncate max-w-[140px]">
              {levelInfo.title}
            </span>
          </div>

          <div className="w-32 bg-slate-950 h-2.5 rounded-full overflow-hidden border border-slate-700/60 relative">
            <div
              className="h-full bg-gradient-to-r from-cyan-500 to-purple-500 rounded-full transition-all duration-500 shadow-[0_0_8px_#00f0ff]"
              style={{ width: `${levelInfo.percent}%` }}
            />
          </div>

          <span className="text-xs font-mono font-semibold text-cyan-300">
            XP {progress.xp} / {levelInfo.nextTierMax}
          </span>
        </div>

        {/* Right: Quick Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile XP badge */}
          <div className="lg:hidden flex items-center gap-1 bg-slate-900/90 px-2.5 py-1 rounded-md border border-cyan-500/30 text-xs font-mono text-cyan-300">
            <span className="font-bold">N{levelInfo.currentLevel}</span>
            <span className="text-slate-500">|</span>
            <span>{progress.xp} XP</span>
          </div>

          {/* Pedagogy / Learning Axes */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenGuia();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-300 text-xs font-medium transition-all"
            title="Guía Pedagógica y Ejes de Robótica"
          >
            <BookOpen className="w-4 h-4 text-cyan-400" />
            <span className="hidden sm:inline">Ejes</span>
          </button>

          {/* Achievements */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenAchievements();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-900/90 border border-amber-500/30 hover:border-amber-400/70 text-amber-300 hover:text-amber-200 text-xs font-medium transition-all shadow-[0_0_8px_rgba(245,158,11,0.15)]"
            title="Ver Logros y Medallas"
          >
            <Award className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">Logros</span>
            <span className="bg-amber-950/80 px-1.5 py-0.2 rounded text-[10px] border border-amber-500/40">
              {unlockedAchievementsCount}/{progress.achievements.length}
            </span>
          </button>

          {/* Teacher Mode */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenDocente();
            }}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-purple-950/70 border border-purple-500/40 hover:border-purple-400 text-purple-200 hover:text-purple-100 text-xs font-medium transition-all shadow-[0_0_10px_rgba(168,85,247,0.2)]"
            title="Modo Docente (Control y Desbloqueos)"
          >
            <GraduationCap className="w-4 h-4 text-purple-400" />
            <span className="hidden md:inline">Docente</span>
          </button>

          {/* Audio Toggle */}
          <button
            onClick={onToggleSound}
            className={`p-2 rounded-lg border transition-all ${
              progress.soundEnabled
                ? 'bg-cyan-950/80 border-cyan-500/50 text-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.25)]'
                : 'bg-slate-900/80 border-slate-700 text-slate-500'
            }`}
            title={progress.soundEnabled ? 'Sonido Activado' : 'Sonido Desactivado'}
          >
            {progress.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </header>
  );
}
