import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { Wrench, CheckCircle2, AlertOctagon, RefreshCw } from 'lucide-react';

interface Level8RepairProps {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

interface BugCase {
  id: number;
  title: string;
  objective: string;
  faultyBlocks: { id: string; text: string; isBug: boolean }[];
  replacementOptions: { id: string; text: string; isCorrect: boolean }[];
  bugExplanation: string;
}

const BUG_CASES: BugCase[] = [
  {
    id: 1,
    title: 'Caso A: El Giro Invertido',
    objective: 'Objetivo del Robot: Avanzar hacia la estrella a la DERECHA.',
    faultyBlocks: [
      { id: 'b1', text: '🟦 AVANZAR (2 pasos)', isBug: false },
      { id: 'b2', text: '⚠️ GIRAR IZQUIERDA (Giro opuesto)', isBug: true },
      { id: 'b3', text: '🟦 AVANZAR (2 pasos)', isBug: false },
    ],
    replacementOptions: [
      { id: 'r1', text: '🔄 GIRAR DERECHA (90°)', isCorrect: true },
      { id: 'r2', text: '🛑 DETENERSE INMEDIATO', isCorrect: false },
      { id: 'r3', text: '⬇️ RETROCEDER', isCorrect: false },
    ],
    bugExplanation: 'El bloque tenía asignado un giro a la izquierda, lo que alejaba al robot de la estrella. Al cambiarlo por GIRAR DERECHA, la trayectoria es perfecta.',
  },
  {
    id: 2,
    title: 'Caso B: Freno Inexistente',
    objective: 'Objetivo del Robot: Avanzar por el pasillo y frenar antes de colisionar con la pared.',
    faultyBlocks: [
      { id: 'b4', text: '🟦 AVANZAR A TODA VELOCIDAD', isBug: false },
      { id: 'b5', text: '⚠️ IGNORAR SENSORES DE PROXIMIDAD', isBug: true },
      { id: 'b6', text: '🟦 ESPERAR 5 SEGUNDOS', isBug: false },
    ],
    replacementOptions: [
      { id: 'r4', text: '🛑 SI distancia < 15cm → DETENER MOTORES', isCorrect: true },
      { id: 'r5', text: '🔊 ACTIVAR BOCINA Y SEGUIR AVANZANDO', isCorrect: false },
      { id: 'r6', text: '💡 ENCENDER LUZ LED', isCorrect: false },
    ],
    bugExplanation: '¡Seguridad de taller! Todo robot móvil debe leer el sensor ultrasónico y frenar a tiempo.',
  },
];

export function Level8RepairRobot({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level8RepairProps) {
  const [currentCaseIdx, setCurrentCaseIdx] = useState(0);
  const bugCase = BUG_CASES[currentCaseIdx];
  const [selectedReplacement, setSelectedReplacement] = useState<string | null>(null);
  const [isRepaired, setIsRepaired] = useState<boolean>(false);
  const [solvedCases, setSolvedCases] = useState<number[]>([]);

  const [robotMood, setRobotMood] = useState<RobotMood>('confused');
  const [robotMessage, setRobotMessage] = useState('¡Alerta de código! Encontrá el bloque con error lógico y reemplazalo para reparar mi sistema.');

  const handleApplyFix = () => {
    if (!selectedReplacement) return;
    const chosen = bugCase.replacementOptions.find(o => o.id === selectedReplacement);

    if (chosen?.isCorrect) {
      playSuccessSound(soundEnabled);
      setIsRepaired(true);
      setRobotMood('celebrate');
      setRobotMessage('🔧 ¡ROBOT REPARADO! El programa ahora ejecuta la acción correcta.');

      if (!solvedCases.includes(bugCase.id)) {
        const nextSolved = [...solvedCases, bugCase.id];
        setSolvedCases(nextSolved);
        if (nextSolved.length === BUG_CASES.length) {
          onComplete();
        }
      }
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('thinking');
      setRobotMessage('“Casi. Ese reemplazo no cumple el objetivo de la misión. Revisá las opciones.”');
    }
  };

  const handleNextCase = () => {
    playClickSound(soundEnabled);
    if (currentCaseIdx < BUG_CASES.length - 1) {
      setCurrentCaseIdx(currentCaseIdx + 1);
      setSelectedReplacement(null);
      setIsRepaired(false);
      setRobotMood('confused');
      setRobotMessage('Cargando nuevo caso de diagnóstico...');
    }
  };

  const hints = [
    'Leé atentamente el objetivo: ¿hacia dónde debe moverse el robot?',
    'Fijate cuál de los 3 bloques contradice directamente ese objetivo.',
    'Seleccioná la opción que corrija la trayectoria o active la seguridad.',
  ];

  return (
    <ActivityShell
      title="Nivel 9 — Juego: ¡Repará el Robot! (Debugging)"
      levelNumber={9}
      axis="Eje 2 y 3: Depuración y Resolución de Fallos"
      objective="Detectá el bloque defectuoso en el programa del robot, seleccioná el reemplazo correcto y repará el sistema."
      howTo="Hacé clic en la opción de reemplazo que soluciona el error lógico y pulsá 'APLICAR REPARACIÓN'."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={() => {
        setSelectedReplacement(null);
        setIsRepaired(false);
        setRobotMood('confused');
      }}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-6">
        {/* Case selector */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {BUG_CASES.map((bc, i) => (
            <button
              key={bc.id}
              onClick={() => {
                playClickSound(soundEnabled);
                setCurrentCaseIdx(i);
                setSelectedReplacement(null);
                setIsRepaired(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                currentCaseIdx === i
                  ? 'bg-purple-950 border-purple-400 text-purple-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400'
              }`}
            >
              {solvedCases.includes(bc.id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{bc.title}</span>
            </button>
          ))}
        </div>

        {/* Diagnostic Monitor */}
        <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center gap-2 mb-2 text-amber-400 font-mono text-xs font-bold uppercase">
            <AlertOctagon className="w-4 h-4" />
            <span>DIAGNÓSTICO DEL SISTEMA • {bugCase.title}</span>
          </div>
          <p className="text-sm font-semibold text-slate-200">{bugCase.objective}</p>
        </div>

        {/* Faulty Code Stack */}
        <div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider mb-2 block">
            PROGRAMA ACTUAL EN MEMORIA DEL ROBOT:
          </span>
          <div className="space-y-2">
            {bugCase.faultyBlocks.map(block => (
              <div
                key={block.id}
                className={`p-3 rounded-xl border font-mono text-xs sm:text-sm font-bold flex items-center justify-between transition-all ${
                  block.isBug
                    ? isRepaired
                      ? 'bg-emerald-950/80 border-emerald-400 text-emerald-200 shadow-[0_0_15px_rgba(16,185,129,0.3)]'
                      : 'bg-rose-950/60 border-rose-500/80 text-rose-200 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
                    : 'bg-slate-900/80 border-slate-800 text-slate-300'
                }`}
              >
                <span>{isRepaired && block.isBug ? '🔧 [CORREGIDO CON ÉXITO]' : block.text}</span>
                {block.isBug && (
                  <span className={`text-[10px] uppercase font-mono px-2 py-0.5 rounded border ${
                    isRepaired
                      ? 'bg-emerald-900 border-emerald-400 text-emerald-300'
                      : 'bg-rose-900 border-rose-400 text-rose-300 animate-pulse'
                  }`}>
                    {isRepaired ? 'REPARADO' : 'ERROR LÓGICO DETECTADO'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Replacement Options */}
        <div>
          <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-2 block">
            SELECCIONÁ EL BLOQUE CORRECTO PARA REEMPLAZAR EL ERROR:
          </span>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {bugCase.replacementOptions.map(opt => (
              <button
                key={opt.id}
                disabled={isRepaired}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setSelectedReplacement(opt.id);
                }}
                className={`p-3 rounded-xl border text-xs font-mono font-bold text-left transition-all ${
                  selectedReplacement === opt.id
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-300 hover:border-slate-700'
                }`}
              >
                {opt.text}
              </button>
            ))}
          </div>
        </div>

        {/* Action and feedback */}
        <div className="pt-4 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-3">
          {isRepaired ? (
            <div className="text-xs font-mono text-emerald-300 flex items-center gap-1.5 font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>🔧 ¡ROBOT REPARADO! {bugCase.bugExplanation}</span>
            </div>
          ) : (
            <div className="text-xs text-slate-500 font-mono">
              Seleccioná un bloque y pulsá aplicar.
            </div>
          )}

          <div className="flex items-center gap-3">
            {isRepaired && currentCaseIdx < BUG_CASES.length - 1 && (
              <button
                onClick={handleNextCase}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-wider"
              >
                Siguiente Caso de Reparación →
              </button>
            )}

            <button
              disabled={!selectedReplacement || isRepaired}
              onClick={handleApplyFix}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-cyan-500 hover:from-amber-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(245,158,11,0.3)] disabled:opacity-40"
            >
              <Wrench className="w-4 h-4" />
              <span>APLICAR REPARACIÓN</span>
            </button>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
