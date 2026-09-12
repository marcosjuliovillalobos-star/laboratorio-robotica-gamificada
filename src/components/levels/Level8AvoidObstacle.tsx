import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound, playRobotStep } from '../../utils/audio';
import { Play, RotateCcw, Trash2, ShieldAlert, CheckCircle2 } from 'lucide-react';

interface Level8AvoidProps {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

type Command = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'STOP';

interface Stage {
  id: number;
  name: string;
  gridSize: number;
  start: { x: number; y: number; dir: number }; // 0: N, 1: E, 2: S, 3: W
  goal: { x: number; y: number };
  obstacles: { x: number; y: number }[];
  description: string;
}

const STAGES: Stage[] = [
  {
    id: 1,
    name: 'Fácil (1 Obstáculo)',
    gridSize: 5,
    start: { x: 0, y: 4, dir: 0 },
    goal: { x: 0, y: 0 },
    obstacles: [{ x: 0, y: 2 }],
    description: 'Hay un bloque directamente en la trayectoria vertical. Rodealo girando a la derecha y luego volviendo.',
  },
  {
    id: 2,
    name: 'Medio (2 Obstáculos)',
    gridSize: 5,
    start: { x: 1, y: 4, dir: 0 },
    goal: { x: 3, y: 0 },
    obstacles: [{ x: 1, y: 2 }, { x: 2, y: 1 }],
    description: 'Dos obstáculos bloquean el corredor central. Trazá una ruta en zig-zag.',
  },
  {
    id: 3,
    name: 'Difícil (Laberinto con Sensores)',
    gridSize: 5,
    start: { x: 0, y: 4, dir: 1 }, // Facing East
    goal: { x: 4, y: 0 },
    obstacles: [{ x: 2, y: 4 }, { x: 2, y: 3 }, { x: 2, y: 1 }, { x: 3, y: 2 }],
    description: 'Paredes y barreras complejas. ¡Calculá cada casilla y giro con exactitud!',
  },
];

export function Level8AvoidObstacle({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level8AvoidProps) {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);
  const stage = STAGES[currentStageIdx];
  const [robotPos, setRobotPos] = useState(stage.start);
  const [sequence, setSequence] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeStep, setActiveStep] = useState<number | null>(null);
  const [solvedStages, setSolvedStages] = useState<number[]>([]);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Construí la secuencia para llegar a la bandera 🏁 evitando chocar con los bloques 🧱.');

  const handleAddCmd = (cmd: Command) => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setSequence([...sequence, cmd]);
  };

  const handleClear = () => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setSequence([]);
    setRobotPos(stage.start);
    setActiveStep(null);
  };

  const handleSwitchStage = (idx: number) => {
    playClickSound(soundEnabled);
    setCurrentStageIdx(idx);
    setRobotPos(STAGES[idx].start);
    setSequence([]);
    setActiveStep(null);
    setRobotMood('idle');
    setRobotMessage(`Cargando escenario: ${STAGES[idx].name}`);
  };

  const handleRun = async () => {
    if (isRunning || sequence.length === 0) return;
    setIsRunning(true);
    setRobotMood('moving');
    setRobotMessage('Navegando el circuito de obstáculos...');

    let { x, y, dir } = stage.start;
    setRobotPos({ x, y, dir });

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];
    let crashed = false;

    for (let i = 0; i < sequence.length; i++) {
      setActiveStep(i);
      const cmd = sequence[i];
      playRobotStep(soundEnabled);

      if (cmd === 'FORWARD') {
        const nextX = x + dx[dir];
        const nextY = y + dy[dir];

        // Check boundary collision
        if (nextX < 0 || nextX >= stage.gridSize || nextY < 0 || nextY >= stage.gridSize) {
          crashed = true;
          break;
        }

        // Check obstacle collision
        if (stage.obstacles.some(o => o.x === nextX && o.y === nextY)) {
          crashed = true;
          x = nextX;
          y = nextY;
          setRobotPos({ x, y, dir });
          break;
        }

        x = nextX;
        y = nextY;
      } else if (cmd === 'TURN_LEFT') {
        dir = (dir + 3) % 4;
      } else if (cmd === 'TURN_RIGHT') {
        dir = (dir + 1) % 4;
      }

      setRobotPos({ x, y, dir });
      await new Promise(r => setTimeout(r, 550));
    }

    setIsRunning(false);
    setActiveStep(null);

    if (crashed) {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('“¡Casi! Chocamos con un obstáculo o con el borde. Probá girar antes.”');
    } else if (x === stage.goal.x && y === stage.goal.y) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage(`¡Meta alcanzada en ${stage.name}!`);

      if (!solvedStages.includes(stage.id)) {
        const nextSolved = [...solvedStages, stage.id];
        setSolvedStages(nextSolved);
        if (nextSolved.length === STAGES.length) {
          onComplete();
        }
      }
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('thinking');
      setRobotMessage('“No chocaste, pero faltaron pasos para llegar a la bandera 🏁.”');
    }
  };

  const hints = [
    'Observá hacia dónde apunta la flecha de ROBI al comenzar.',
    'Nunca avances directo hacia una casilla con ladrillo 🧱.',
    'Girá 90°, avanzá para esquivar la columna y volvé a orientarte hacia la meta.',
  ];

  return (
    <ActivityShell
      title="Nivel 8 — Juego: Evitá el Obstáculo"
      levelNumber={8}
      axis="Eje 3: Construcción y Navegación"
      objective="Conducí a ROBI a través de 3 pistas con obstáculos crecientes hasta llegar a la meta sin colisionar."
      howTo="Armá la secuencia usando Avanzar y Giros. Si chocás, no te preocupes: reintentá ajustando la trayectoria."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={handleClear}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-4">
        {/* Stage Tabs */}
        <div className="flex gap-2 border-b border-slate-800 pb-2">
          {STAGES.map((st, i) => (
            <button
              key={st.id}
              onClick={() => handleSwitchStage(i)}
              className={`px-3 py-1.5 rounded-lg text-xs font-mono font-bold flex items-center gap-1.5 transition-all border ${
                currentStageIdx === i
                  ? 'bg-cyan-950 border-cyan-400 text-cyan-200'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {solvedStages.includes(st.id) && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />}
              <span>{st.name}</span>
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Stage Grid */}
          <div className="lg:col-span-6 flex flex-col items-center">
            <div className="p-2 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
              <div className="grid grid-cols-5 gap-1.5 w-[280px] h-[280px] bg-[#030712] p-1.5 rounded-xl cyber-grid">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const x = idx % 5;
                  const y = Math.floor(idx / 5);
                  const isRobot = robotPos.x === x && robotPos.y === y;
                  const isGoal = stage.goal.x === x && stage.goal.y === y;
                  const isObstacle = stage.obstacles.some(o => o.x === x && o.y === y);

                  const dirArrows = ['↑', '→', '↓', '←'];

                  return (
                    <div
                      key={idx}
                      className={`relative rounded-lg border flex items-center justify-center transition-all ${
                        isRobot
                          ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                          : isObstacle
                          ? 'bg-rose-950/50 border-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.3)]'
                          : isGoal
                          ? 'bg-emerald-950/50 border-emerald-400'
                          : 'bg-slate-900/40 border-slate-800'
                      }`}
                    >
                      {isObstacle && <span className="text-xl">🧱</span>}
                      {isGoal && !isRobot && <span className="text-xl">🏁</span>}
                      {isRobot && (
                        <div className="flex flex-col items-center">
                          <span className="text-xl">🤖</span>
                          <span className="text-[10px] font-mono text-cyan-300 font-bold -mt-1">
                            {dirArrows[robotPos.dir]}
                          </span>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <p className="text-xs text-slate-400 mt-2 font-mono text-center">
              {stage.description}
            </p>
          </div>

          {/* Controls */}
          <div className="lg:col-span-6 space-y-4">
            <div className="grid grid-cols-3 gap-2">
              <button
                disabled={isRunning}
                onClick={() => handleAddCmd('FORWARD')}
                className="p-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-slate-950 font-bold font-mono text-xs border border-cyan-400 text-center"
              >
                ⬆️ AVANZAR
              </button>
              <button
                disabled={isRunning}
                onClick={() => handleAddCmd('TURN_LEFT')}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs border border-purple-400 text-center"
              >
                ↩️ GIRAR IZQ
              </button>
              <button
                disabled={isRunning}
                onClick={() => handleAddCmd('TURN_RIGHT')}
                className="p-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold font-mono text-xs border border-purple-400 text-center"
              >
                ↪️ GIRAR DER
              </button>
            </div>

            {/* Sequence Box */}
            <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 min-h-[160px] flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-mono text-cyan-400 uppercase">
                    SECUENCIA ({sequence.length} PASOS)
                  </span>
                  {sequence.length > 0 && (
                    <button
                      disabled={isRunning}
                      onClick={handleClear}
                      className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                    >
                      <Trash2 className="w-3 h-3" /> Borrar
                    </button>
                  )}
                </div>

                <div className="flex flex-wrap gap-1.5 py-1 max-h-32 overflow-y-auto">
                  {sequence.map((cmd, i) => (
                    <span
                      key={i}
                      className={`px-2.5 py-1 rounded text-xs font-mono font-bold border transition-all ${
                        activeStep === i
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-105'
                          : 'bg-slate-900 border-slate-700 text-slate-300'
                      }`}
                    >
                      {cmd === 'FORWARD' ? '⬆️ AVAN' : cmd === 'TURN_LEFT' ? '↩️ G.IZQ' : '↪️ G.DER'}
                    </span>
                  ))}
                </div>
              </div>

              <div className="pt-3 border-t border-slate-800 flex justify-end">
                <button
                  disabled={isRunning || sequence.length === 0}
                  onClick={handleRun}
                  className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 disabled:opacity-40"
                >
                  <Play className="w-4 h-4 fill-current" />
                  <span>{isRunning ? 'NAVEGANDO...' : 'EJECUTAR MISIÓN'}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
