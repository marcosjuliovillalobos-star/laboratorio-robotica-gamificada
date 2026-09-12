import { motion } from 'motion/react';
import { UserProgress, Screen } from '../types';
import { RobiBot } from './RobiBot';
import { playClickSound } from '../utils/audio';
import { Rocket, Play, Award, BookOpen, GraduationCap, Bot, Users, Sparkles, ShieldCheck } from 'lucide-react';
import { calculatePlayerLevel } from '../utils/storage';

interface MainMenuProps {
  progress: UserProgress;
  onNavigate: (screen: Screen) => void;
  onOpenAchievements: () => void;
  onOpenDocente: () => void;
  onOpenGuia: () => void;
}

export function MainMenu({
  progress,
  onNavigate,
  onOpenAchievements,
  onOpenDocente,
  onOpenGuia,
}: MainMenuProps) {
  const levelInfo = calculatePlayerLevel(progress.xp);
  const nextPlayableScreen: Screen = progress.lastPlayedLevel || 'level_1';

  return (
    <div className="relative min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 py-8 cyber-grid overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[550px] h-[350px] bg-gradient-to-tr from-cyan-600/15 via-sky-500/10 to-purple-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-10 w-72 h-72 bg-purple-600/10 rounded-full blur-2xl pointer-events-none" />
      <div className="absolute top-10 right-10 w-72 h-72 bg-cyan-600/10 rounded-full blur-2xl pointer-events-none" />

      {/* Main Hero Container */}
      <div className="w-full max-w-5xl z-10 flex flex-col items-center text-center">
        {/* Futuristic Status Badge */}
        <motion.div
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/70 border border-cyan-500/40 text-cyan-300 text-xs font-mono tracking-wider mb-4 shadow-[0_0_12px_rgba(6,182,212,0.25)]"
        >
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
          <span>SISTEMA ACTIVO • TALLER DE ROBÓTICA APLICADA • 3.º AÑO</span>
        </motion.div>

        {/* Big Game Title */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="space-y-1 mb-2"
        >
          <h2 className="text-xl sm:text-2xl font-display font-semibold tracking-[0.25em] text-cyan-400 uppercase">
            LABORATORIO VIRTUAL
          </h2>
          <h1 className="text-3xl sm:text-5xl md:text-6xl font-display font-black tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-cyan-200 via-sky-100 to-purple-300 neon-text-cyan">
            DE ROBÓTICA APLICADA
          </h1>
        </motion.div>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="text-base sm:text-xl font-display font-medium text-slate-300 tracking-wide mb-8 max-w-2xl"
        >
          “<span className="text-cyan-300 font-semibold">Jugá</span>. <span className="text-purple-300 font-semibold">Programá</span>. <span className="text-sky-300 font-semibold">Probá</span>. <span className="text-amber-300 font-semibold">Equivocate</span>. <span className="text-emerald-300 font-semibold">Mejorá</span>.”
        </motion.p>

        {/* Central Robot Avatar & Greeting */}
        <div className="mb-8">
          <RobiBot
            size="md"
            mood="happy"
            message="¡Hola! Soy ROBI. Estoy listo para ayudarte a construir y programar en cada desafío."
            soundEnabled={progress.soundEnabled}
          />
        </div>

        {/* Main Action Buttons Grid (Designed like a Futuristic Game Menu) */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-2 gap-3.5 mb-6">
          {/* Primary: Comenzar Misión */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onNavigate('levels');
            }}
            className="group relative overflow-hidden flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-gradient-to-r from-cyan-600 via-cyan-500 to-sky-500 text-slate-950 font-display font-bold text-lg tracking-wider uppercase shadow-[0_0_25px_rgba(6,182,212,0.4)] border border-cyan-300 transition-all hover:shadow-[0_0_35px_rgba(6,182,212,0.7)]"
          >
            <Rocket className="w-6 h-6 text-slate-950 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            <span>🚀 COMENZAR MISIÓN</span>
            <div className="absolute inset-0 bg-white/20 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 pointer-events-none" />
          </motion.button>

          {/* Continuar Partida */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onNavigate(nextPlayableScreen);
            }}
            className="group relative flex items-center justify-center gap-3 px-6 py-4 rounded-xl bg-slate-900/90 hover:bg-slate-800/90 text-cyan-300 font-display font-bold text-lg tracking-wider uppercase border border-cyan-500/40 hover:border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.2)] transition-all"
          >
            <Play className="w-6 h-6 text-cyan-400 fill-cyan-400/40" />
            <span>🎮 CONTINUAR</span>
          </motion.button>

          {/* Logros */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenAchievements();
            }}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-amber-300 font-display font-semibold text-base tracking-wider uppercase border border-amber-500/30 hover:border-amber-400 shadow-[0_0_12px_rgba(245,158,11,0.15)] transition-all"
          >
            <Award className="w-5 h-5 text-amber-400" />
            <span>🏆 LOGROS Y MEDALLAS</span>
          </motion.button>

          {/* Aprender / Guía Curricular */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenGuia();
            }}
            className="flex items-center justify-center gap-3 px-5 py-3.5 rounded-xl bg-slate-950/80 hover:bg-slate-900 text-sky-300 font-display font-semibold text-base tracking-wider uppercase border border-sky-500/30 hover:border-sky-400 shadow-[0_0_12px_rgba(56,189,248,0.15)] transition-all"
          >
            <BookOpen className="w-5 h-5 text-sky-400" />
            <span>📚 APRENDER (LOS 4 EJES)</span>
          </motion.button>
        </div>

        {/* Secondary Creative & Special Modes */}
        <div className="w-full max-w-2xl grid grid-cols-1 sm:grid-cols-3 gap-3 mb-8">
          {/* Creá tu Robot */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onNavigate('creative_creator');
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-purple-950/40 hover:bg-purple-900/50 border border-purple-500/30 hover:border-purple-400 text-purple-200 text-sm font-semibold transition-all shadow-[0_0_10px_rgba(168,85,247,0.15)]"
          >
            <Bot className="w-4 h-4 text-purple-400" />
            <span>🤖 Creá tu Robot</span>
          </button>

          {/* Modo Equipo */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onNavigate('team_mission');
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-emerald-950/40 hover:bg-emerald-900/50 border border-emerald-500/30 hover:border-emerald-400 text-emerald-200 text-sm font-semibold transition-all shadow-[0_0_10px_rgba(16,185,129,0.15)]"
          >
            <Users className="w-4 h-4 text-emerald-400" />
            <span>👥 Modo Equipo</span>
          </button>

          {/* Modo Docente */}
          <button
            onClick={() => {
              playClickSound(progress.soundEnabled);
              onOpenDocente();
            }}
            className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-900/80 hover:bg-slate-800/80 border border-slate-700 hover:border-cyan-500/50 text-slate-300 hover:text-cyan-200 text-sm font-semibold transition-all"
          >
            <GraduationCap className="w-4 h-4 text-cyan-400" />
            <span>👨‍🏫 Modo Docente</span>
          </button>
        </div>

        {/* Player Snapshot Info Card */}
        <div className="w-full max-w-xl p-4 rounded-xl bg-slate-950/80 border border-cyan-500/20 backdrop-blur-sm flex flex-col sm:flex-row items-center justify-between gap-4 text-left">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-cyan-950/80 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-bold font-mono text-lg shadow-[0_0_8px_rgba(6,182,212,0.3)]">
              {levelInfo.currentLevel}
            </div>
            <div>
              <div className="text-xs text-slate-400 uppercase tracking-wider font-mono">Estado del Estudiante</div>
              <div className="text-sm font-bold text-slate-100">{levelInfo.title}</div>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="text-right">
              <span className="text-slate-400">Progreso XP: </span>
              <span className="text-cyan-300 font-bold">{progress.xp} XP</span>
            </div>
            <div className="text-right">
              <span className="text-slate-400">Actividades: </span>
              <span className="text-purple-300 font-bold">{progress.completedActivities.length} listas</span>
            </div>
          </div>
        </div>

        {/* Motivational Pedagogical Footer */}
        <p className="mt-8 text-xs text-slate-500 flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-cyan-500/60" />
          <span>Contenido curricular adaptado para 3.º año del Ciclo Básico • Taller de Robótica Aplicada</span>
        </p>
      </div>
    </div>
  );
}
