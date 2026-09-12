import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { ArrowUp, ArrowDown, CheckCircle2, ListOrdered, Sparkles } from 'lucide-react';

interface Level4Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

interface Challenge {
  id: string;
  title: string;
  context: string;
  correctOrder: string[];
  initialItems: { id: string; text: string; icon: string }[];
}

const CHALLENGES: Challenge[] = [
  {
    id: 'pc',
    title: 'Desafío 1: Encender la Computadora',
    context: 'Queremos encender la computadora del taller para programar a ROBI.',
    correctOrder: ['p1', 'p2', 'p3', 'p4'],
    initialItems: [
      { id: 'p3', text: 'Iniciar sesión con usuario y contraseña', icon: '🔑' },
      { id: 'p1', text: 'Presionar el botón físico de encendido (Power)', icon: '🔘' },
      { id: 'p4', text: 'Abrir el software del simulador de robótica', icon: '💻' },
      { id: 'p2', text: 'Esperar a que cargue el sistema operativo', icon: '⏳' },
    ],
  },
  {
    id: 'calle',
    title: 'Desafío 2: Algoritmo de Cruce Seguro',
    context: 'Un robot móvil de delivery necesita cruzar una avenida por la senda peatonal.',
    correctOrder: ['c1', 'c2', 'c3', 'c4'],
    initialItems: [
      { id: 'c3', text: 'Esperar a que el semáforo se ponga en verde peatonal', icon: '🟢' },
      { id: 'c1', text: 'Llegar a la esquina y detenerse en el borde de la vereda', icon: '🛑' },
      { id: 'c4', text: 'Avanzar en línea recta por las líneas de cruce', icon: '🚶' },
      { id: 'c2', text: 'Verificar con sensor de visión que no pasen vehículos', icon: '👀' },
    ],
  },
  {
    id: 'brazo',
    title: 'Desafío 3: Brazo Robótico Clasificador',
    context: 'Un brazo mecánico en una fábrica debe tomar una pieza y guardarla en la caja.',
    correctOrder: ['b1', 'b2', 'b3', 'b4'],
    initialItems: [
      { id: 'b4', text: 'Mover el brazo hacia la caja y abrir la pinza para soltar', icon: '📦' },
      { id: 'b2', text: 'Descender el efector final hacia la pieza', icon: '⬇️' },
      { id: 'b1', text: 'Posicionar el brazo sobre las coordenadas de la pieza', icon: '🎯' },
      { id: 'b3', text: 'Cerrar la pinza neumática y elevar el brazo', icon: '🤏' },
    ],
  },
];

export function Level4Algorithms({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level4Props) {
  const [currentChallengeIdx, setCurrentChallengeIdx] = useState(0);
  const challenge = CHALLENGES[currentChallengeIdx];
  const [items, setItems] = useState<{ id: string; text: string; icon: string }[]>(challenge.initialItems);
  const [verified, setVerified] = useState(false);
  const [solvedChallenges, setSolvedChallenges] = useState<number[]>([]);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Un algoritmo es una serie de pasos ordenados y finitos para lograr un objetivo.');

  const moveItem = (index: number, direction: 'up' | 'down') => {
    playClickSound(soundEnabled);
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= items.length) return;

    const updated = [...items];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setItems(updated);
    setVerified(false);
  };

  const handleTestAlgorithm = () => {
    setVerified(true);
    const currentOrder = items.map(i => i.id);
    const isCorrect = JSON.stringify(currentOrder) === JSON.stringify(challenge.correctOrder);

    if (isCorrect) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage('¡Excelente! El algoritmo se ejecutó en el orden lógico exacto.');

      if (!solvedChallenges.includes(currentChallengeIdx)) {
        const nextSolved = [...solvedChallenges, currentChallengeIdx];
        setSolvedChallenges(nextSolved);
        if (nextSolved.length === CHALLENGES.length) {
          onComplete();
        }
      }
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('“Casi. Hay un paso que intenta ejecutarse antes de tiempo. Revisá el orden.”');
    }
  };

  const handleNextChallenge = () => {
    playClickSound(soundEnabled);
    if (currentChallengeIdx < CHALLENGES.length - 1) {
      const nextIdx = currentChallengeIdx + 1;
      setCurrentChallengeIdx(nextIdx);
      setItems(CHALLENGES[nextIdx].initialItems);
      setVerified(false);
      setRobotMood('idle');
      setRobotMessage(`Cargando ${CHALLENGES[nextIdx].title}. ¡A ordenar los pasos!`);
    }
  };

  const hints = [
    'Pensá qué es indispensable hacer primero antes que nada (ej: ¡no podés abrir un programa si la PC está apagada!).',
    'Un robot nunca puede saltarse pasos intermedios.',
    'Verificá el primer y el último paso: ¿Tiene sentido empezar y terminar de esa forma?',
  ];

  return (
    <ActivityShell
      title="Nivel 4 — Algoritmos y Secuencias"
      levelNumber={4}
      axis="Eje 2: Pensamiento Computacional"
      objective="Ordená las instrucciones de cada situación para formar un algoritmo válido y eficiente."
      howTo="Usá las flechas de Subir (↑) y Bajar (↓) para ordenar los pasos del 1 al 4. Luego pulsa 'PROBAR ALGORITMO'."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={() => {
        setItems(challenge.initialItems);
        setVerified(false);
      }}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-5">
        {/* Definition reminder */}
        <div className="p-3.5 rounded-xl bg-purple-950/40 border border-purple-500/30 text-xs text-purple-200 flex items-center justify-between">
          <div>
            <strong className="text-purple-300 font-mono">CONCEPTO CLAVE:</strong> “Un algoritmo es una serie de instrucciones lógicas, precisas y ordenadas para resolver un problema o alcanzar un objetivo.”
          </div>
          <div className="text-xs font-mono text-cyan-300 shrink-0 ml-3">
            Desafío {currentChallengeIdx + 1} de {CHALLENGES.length}
          </div>
        </div>

        {/* Challenge selector tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2 overflow-x-auto">
          {CHALLENGES.map((ch, idx) => (
            <button
              key={ch.id}
              onClick={() => {
                playClickSound(soundEnabled);
                setCurrentChallengeIdx(idx);
                setItems(CHALLENGES[idx].initialItems);
                setVerified(false);
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold transition-all flex items-center gap-1.5 ${
                currentChallengeIdx === idx
                  ? 'bg-cyan-500 text-slate-950'
                  : 'bg-slate-900 text-slate-400 hover:text-slate-200'
              }`}
            >
              {solvedChallenges.includes(idx) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{ch.title.split(':')[0]}</span>
            </button>
          ))}
        </div>

        {/* Current challenge prompt */}
        <div>
          <h3 className="text-base font-display font-bold text-slate-100">{challenge.title}</h3>
          <p className="text-xs text-slate-400 mt-0.5">{challenge.context}</p>
        </div>

        {/* Re-orderable steps list */}
        <div className="space-y-2.5">
          {items.map((item, idx) => (
            <div
              key={item.id}
              className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-cyan-500/40 flex items-center justify-between gap-3 transition-all"
            >
              <div className="flex items-center gap-3">
                <span className="w-7 h-7 rounded-lg bg-cyan-950/80 border border-cyan-500/40 text-cyan-300 font-mono font-bold text-xs flex items-center justify-center">
                  {idx + 1}
                </span>
                <span className="text-xl">{item.icon}</span>
                <span className="text-xs sm:text-sm text-slate-200 font-medium">{item.text}</span>
              </div>

              {/* Order Controls */}
              <div className="flex items-center gap-1 shrink-0">
                <button
                  disabled={idx === 0}
                  onClick={() => moveItem(idx, 'up')}
                  className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 disabled:opacity-30 disabled:hover:border-slate-700"
                  title="Mover arriba"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  disabled={idx === items.length - 1}
                  onClick={() => moveItem(idx, 'down')}
                  className="p-1.5 rounded-md bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300 disabled:opacity-30 disabled:hover:border-slate-700"
                  title="Mover abajo"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-slate-800 flex items-center justify-between">
          <div className="text-xs font-mono text-slate-400">
            {solvedChallenges.includes(currentChallengeIdx) ? (
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <CheckCircle2 className="w-4 h-4" /> ¡Desafío Resuelto!
              </span>
            ) : (
              <span>Ordená del 1 al 4 y probá</span>
            )}
          </div>

          <div className="flex items-center gap-3">
            {solvedChallenges.includes(currentChallengeIdx) && currentChallengeIdx < CHALLENGES.length - 1 && (
              <button
                onClick={handleNextChallenge}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display text-xs font-bold uppercase tracking-wider"
              >
                Siguiente Desafío →
              </button>
            )}

            <button
              onClick={handleTestAlgorithm}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)]"
            >
              PROBAR ALGORITMO
            </button>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
