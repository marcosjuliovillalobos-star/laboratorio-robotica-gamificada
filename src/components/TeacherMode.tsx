import { useState } from 'react';
import { UserProgress } from '../types';
import { saveProgress, resetProgress, unlockAllLevels } from '../utils/storage';
import { playClickSound, playSuccessSound } from '../utils/audio';
import { ArrowLeft, Unlock, RotateCcw, BookOpen, GraduationCap, ShieldCheck, Check, Lightbulb } from 'lucide-react';

interface TeacherModeProps {
  progress: UserProgress;
  soundEnabled: boolean;
  onUpdateProgress: (p: UserProgress) => void;
  onBack: () => void;
}

export function TeacherMode({
  progress,
  soundEnabled,
  onUpdateProgress,
  onBack,
}: TeacherModeProps) {
  const [feedbackMsg, setFeedbackMsg] = useState<string | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleUnlockAll = () => {
    playSuccessSound(soundEnabled);
    const updated = unlockAllLevels(progress);
    onUpdateProgress(updated);
    setFeedbackMsg('✅ Todos los niveles (1 al 10) han sido desbloqueados para el aula.');
  };

  const handleReset = () => {
    playClickSound(soundEnabled);
    setShowResetConfirm(true);
  };

  const confirmReset = () => {
    playSuccessSound(soundEnabled);
    const fresh = resetProgress();
    onUpdateProgress(fresh);
    setShowResetConfirm(false);
    setFeedbackMsg('🔄 Progreso restaurado a valores de fábrica para el próximo estudiante.');
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              PANEL DE CONTROL PEDAGÓGICO
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-cyan-400" />
              <span>Modo Docente / Taller</span>
            </h1>
          </div>
        </div>

        <div className="text-xs font-mono text-slate-400">
          Destinado a: <span className="text-cyan-300 font-bold">3.° Año Ciclo Básico</span>
        </div>
      </div>

      {feedbackMsg && (
        <div className="p-3.5 rounded-xl bg-cyan-950 border border-cyan-400 text-xs font-mono text-cyan-200">
          {feedbackMsg}
        </div>
      )}

      {showResetConfirm && (
        <div className="p-5 rounded-2xl bg-rose-950/80 border border-rose-400 shadow-[0_0_25px_rgba(244,63,94,0.18)]">
          <div className="flex items-start gap-3">
            <div className="p-2 rounded-lg bg-rose-900/70 text-rose-300 border border-rose-400/40">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h2 className="text-sm font-display font-bold text-rose-100 uppercase tracking-wider">
                Confirmar reinicio del progreso
              </h2>
              <p className="text-xs text-rose-200/90 mt-2 leading-relaxed">
                Se eliminarán XP, niveles desbloqueados, actividades completadas, medallas y el robot personalizado guardado en esta computadora. El laboratorio volverá al estado inicial del Nivel 1.
              </p>
              <div className="flex flex-col sm:flex-row gap-2 mt-4">
                <button
                  type="button"
                  onClick={() => setShowResetConfirm(false)}
                  className="px-4 py-2 rounded-lg bg-slate-900 border border-slate-700 text-slate-200 text-xs font-bold hover:border-slate-500 transition-all"
                >
                  CANCELAR
                </button>
                <button
                  type="button"
                  onClick={confirmReset}
                  className="px-4 py-2 rounded-lg bg-rose-600 border border-rose-300 text-white text-xs font-bold hover:bg-rose-500 transition-all"
                >
                  SÍ, REINICIAR TODO
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Classroom Quick Actions */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-cyan-400" />
          <span>Acciones de Gestión de Aula</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleUnlockAll}
            className="p-4 rounded-xl bg-slate-900 border border-cyan-500/40 hover:border-cyan-400 text-left transition-all flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-cyan-950 text-cyan-400 border border-cyan-500/30">
              <Unlock className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-slate-200 font-mono">
                DESBLOQUEAR TODOS LOS NIVELES
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Habilita el acceso libre a los 10 niveles y la misión final sin necesidad de completar los previos en esta terminal.
              </div>
            </div>
          </button>

          <button
            onClick={handleReset}
            className="p-4 rounded-xl bg-slate-900 border border-rose-500/40 hover:border-rose-400 text-left transition-all flex items-start gap-3"
          >
            <div className="p-2 rounded-lg bg-rose-950 text-rose-400 border border-rose-500/30">
              <RotateCcw className="w-5 h-5" />
            </div>
            <div>
              <div className="text-xs font-bold text-rose-200 font-mono">
                REINICIAR PROGRESO DEL EQUIPO
              </div>
              <div className="text-[11px] text-slate-400 mt-1">
                Restaura niveles, XP y medallas para que un nuevo grupo o turno comience desde cero.
              </div>
            </div>
          </button>
        </div>
      </div>

      {/* Pedagogical Syllabus Guide */}
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
        <h2 className="text-sm font-display font-bold text-slate-100 uppercase tracking-wider flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span>Estructura Curricular de los 4 Ejes Temáticos</span>
        </h2>

        <div className="space-y-3">
          {[
            {
              axe: 'Eje 1: ¿Qué es un robot?',
              levels: 'Nivel 1 y Nivel 2',
              desc: 'Diferenciación entre aparatos automáticos y robots. Reconocimiento de los 4 subsistemas (Sensores, Actuadores, Estructura, CPU).',
              color: 'border-cyan-500/40 text-cyan-300',
            },
            {
              axe: 'Eje 2: Pensamiento computacional',
              levels: 'Nivel 3, 4 y 5',
              desc: 'Descomposición del problema, secuencias ordenadas, algoritmos paso a paso y toma de decisiones condicionales (SI / ENTONCES).',
              color: 'border-purple-500/40 text-purple-300',
            },
            {
              axe: 'Eje 3: Construcción y lógica de programación',
              levels: 'Nivel 6, 7, 8 y 9',
              desc: 'Bloques de código visuales, calibración de sensores de luz, sonido y ultrasonido, juegos de evasión y depuración de errores (debugging).',
              color: 'border-amber-500/40 text-amber-300',
            },
            {
              axe: 'Eje 4: Misión final integradora',
              levels: 'Nivel 10 (Operación Invernadero)',
              desc: 'Arquitectura completa de control automatizado: lectura sensorial → procesamiento → comando a actuadores (riego, clima, luz).',
              color: 'border-emerald-500/40 text-emerald-300',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800">
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold font-mono ${item.color}`}>
                  {item.axe}
                </span>
                <span className="text-[10px] font-mono text-slate-400 bg-slate-950 px-2 py-0.5 rounded border border-slate-800">
                  {item.levels}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Didactic suggestions */}
      <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 text-xs text-amber-200/90 space-y-1.5 font-mono">
        <div className="font-bold flex items-center gap-1.5 text-amber-300">
          <Lightbulb className="w-4 h-4" />
          CONSEJO DIDÁCTICO PARA EL TALLER:
        </div>
        <p>
          Enfatice siempre el lema: <em>"El error es el mejor maestro en robótica"</em>. Cuando un robot choque o tome un camino incorrecto, pida a los estudiantes que expliquen en voz alta qué instrucción provocó el desvío antes de cambiar el código.
        </p>
      </div>
    </div>
  );
}
