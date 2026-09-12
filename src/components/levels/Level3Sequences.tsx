import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound, playRobotStep } from '../../utils/audio';
import { Play, RotateCcw, Trash2, ArrowUp, RotateCcw as TurnLeft, RotateCw as TurnRight, Octagon } from 'lucide-react';

interface Level3Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

type CommandType = 'FORWARD' | 'TURN_LEFT' | 'TURN_RIGHT' | 'STOP';

interface Command {
  id: string;
  type: CommandType;
  label: string;
  icon: string;
}

const PALETTE: { type: CommandType; label: string; icon: string; color: string }[] = [
  { type: 'FORWARD', label: 'AVANZAR', icon: '⬆️', color: 'bg-cyan-600 hover:bg-cyan-500 border-cyan-400' },
  { type: 'TURN_LEFT', label: 'GIRAR IZQ', icon: '↩️', color: 'bg-purple-600 hover:bg-purple-500 border-purple-400' },
  { type: 'TURN_RIGHT', label: 'GIRAR DER', icon: '↪️', color: 'bg-purple-600 hover:bg-purple-500 border-purple-400' },
  { type: 'STOP', label: 'DETENER', icon: '🛑', color: 'bg-rose-600 hover:bg-rose-500 border-rose-400' },
];

export function Level3Sequences({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level3Props) {
  // Grid 5x5: (0,0) top-left, (4,4) bottom-right
  // Start: (0, 3), Facing: North (0: North, 1: East, 2: South, 3: West)
  // Star: (2, 1)
  // Path: Forward 2 (to 0,1), Turn Right (facing East), Forward 2 (to 2,1), Stop.
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; dir: number }>({ x: 0, y: 3, dir: 0 });
  const [sequence, setSequence] = useState<Command[]>([]);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [activeStepIndex, setActiveStepIndex] = useState<number | null>(null);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Armá la secuencia para que ROBI llegue hasta la estrella ⭐.');

  const starPos = { x: 2, y: 1 };

  const addCommand = (type: CommandType) => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    const item = PALETTE.find(p => p.type === type)!;
    setSequence([...sequence, { id: `${type}_${Date.now()}_${Math.random()}`, type, label: item.label, icon: item.icon }]);
  };

  const removeCommand = (index: number) => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setSequence(sequence.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setSequence([]);
    setRobotPos({ x: 0, y: 3, dir: 0 });
    setActiveStepIndex(null);
    setRobotMood('idle');
    setRobotMessage('Secuencia reiniciada. Probá agregando los bloques necesarios.');
  };

  const handleRunSequence = async () => {
    if (isRunning || sequence.length === 0) return;
    setIsRunning(true);
    setRobotMood('moving');
    setRobotMessage('Ejecutando secuencia en tiempo real...');

    // Reset initial position before simulation
    let currentX = 0;
    let currentY = 3;
    let currentDir = 0; // 0: North, 1: East, 2: South, 3: West
    setRobotPos({ x: currentX, y: currentY, dir: currentDir });

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    for (let i = 0; i < sequence.length; i++) {
      setActiveStepIndex(i);
      const cmd = sequence[i];
      playRobotStep(soundEnabled);

      if (cmd.type === 'FORWARD') {
        const nextX = Math.max(0, Math.min(4, currentX + dx[currentDir]));
        const nextY = Math.max(0, Math.min(4, currentY + dy[currentDir]));
        currentX = nextX;
        currentY = nextY;
      } else if (cmd.type === 'TURN_LEFT') {
        currentDir = (currentDir + 3) % 4;
      } else if (cmd.type === 'TURN_RIGHT') {
        currentDir = (currentDir + 1) % 4;
      } else if (cmd.type === 'STOP') {
        // Stop
      }

      setRobotPos({ x: currentX, y: currentY, dir: currentDir });
      await new Promise(res => setTimeout(res, 600));
    }

    setIsRunning(false);
    setActiveStepIndex(null);

    // Check if reached target
    if (currentX === starPos.x && currentY === starPos.y) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage('🎉 ¡MISIÓN COMPLETADA! El robot llegó exactamente a la estrella.');
      onComplete();
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('“El robot tomó otro camino. ¡El error nos enseña! Probá cambiar el orden.”');
    }
  };

  const hints = [
    'Mirá la posición inicial de ROBI: está mirando hacia el Norte (arriba).',
    'Para llegar a la estrella, primero tiene que avanzar 2 casillas hacia arriba.',
    'Luego girá a la DERECHA, avanzá 2 casillas hacia el Este y finalizá con DETENER.',
  ];

  return (
    <ActivityShell
      title="Nivel 3 — Ordená el Robot"
      levelNumber={3}
      axis="Eje 2: Pensamiento Computacional"
      objective="Ordená las tarjetas de comando para guiar a ROBI por la cuadrícula hasta alcanzar la estrella ⭐."
      howTo="Tocá las tarjetas de la paleta para añadirlas a la secuencia. Luego pulsá 'EJECUTAR SECUENCIA' para ver a ROBI en movimiento."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={handleClear}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: 5x5 Cyber Grid Stage */}
        <div className="lg:col-span-6 flex flex-col items-center">
          <div className="text-xs font-mono text-cyan-400 mb-2 tracking-wider flex items-center justify-between w-full max-w-[320px]">
            <span>CUADRÍCULA DE PRUEBAS</span>
            <span>INICIO: (0, 3)</span>
          </div>

          <div className="relative p-2 rounded-2xl bg-slate-950 border-2 border-cyan-500/40 shadow-[0_0_25px_rgba(6,182,212,0.2)]">
            <div className="grid grid-cols-5 gap-1.5 w-[300px] h-[300px] bg-[#030712] p-1.5 rounded-xl cyber-grid">
              {Array.from({ length: 25 }).map((_, idx) => {
                const x = idx % 5;
                const y = Math.floor(idx / 5);
                const isRobot = robotPos.x === x && robotPos.y === y;
                const isStar = starPos.x === x && starPos.y === y;

                const dirArrows = ['↑', '→', '↓', '←'];

                return (
                  <div
                    key={idx}
                    className={`relative rounded-lg border flex items-center justify-center transition-all ${
                      isRobot
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : isStar
                        ? 'bg-amber-950/40 border-amber-400/80 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    {isStar && (
                      <span className="text-2xl animate-bounce drop-shadow-[0_0_8px_#f59e0b]">
                        ⭐
                      </span>
                    )}

                    {isRobot && (
                      <div className="flex flex-col items-center">
                        <span className="text-xl">🤖</span>
                        <span className="text-[10px] font-bold text-cyan-300 -mt-1 font-mono">
                          {dirArrows[robotPos.dir]}
                        </span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="text-[11px] text-slate-400 font-mono mt-3">
            Orientación: <span className="text-cyan-300 font-bold">{['NORTE (↑)', 'ESTE (→)', 'SUR (↓)', 'OESTE (←)'][robotPos.dir]}</span>
          </div>
        </div>

        {/* Right: Palette & Workspace */}
        <div className="lg:col-span-6 space-y-4">
          {/* Command Palette */}
          <div>
            <div className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2">
              TARJETAS DE COMANDO DISPONIBLES:
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {PALETTE.map(p => (
                <button
                  key={p.type}
                  disabled={isRunning}
                  onClick={() => addCommand(p.type)}
                  className={`p-2.5 rounded-xl border text-xs font-bold text-slate-950 tracking-wider flex items-center justify-center gap-1.5 transition-all active:scale-95 shadow-[0_0_10px_rgba(0,0,0,0.3)] ${p.color}`}
                >
                  <span className="text-base">{p.icon}</span>
                  <span>{p.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Sequence Timeline */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 min-h-[160px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  SECUENCIA PROGRAMADA ({sequence.length} PASOS)
                </span>
                {sequence.length > 0 && (
                  <button
                    disabled={isRunning}
                    onClick={handleClear}
                    className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Limpiar
                  </button>
                )}
              </div>

              {sequence.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-6 text-center">
                  Hacé clic en las tarjetas de arriba para construir la secuencia ordenada.
                </div>
              ) : (
                <div className="flex flex-wrap gap-2 py-2">
                  {sequence.map((cmd, i) => (
                    <div
                      key={cmd.id}
                      onClick={() => removeCommand(i)}
                      className={`px-3 py-1.5 rounded-lg border text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer select-none transition-all ${
                        activeStepIndex === i
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 scale-105 shadow-[0_0_10px_#00f0ff]'
                          : 'bg-slate-900 border-cyan-500/40 text-cyan-200 hover:border-rose-500 hover:text-rose-300'
                      }`}
                      title="Hacé clic para quitar"
                    >
                      <span className="text-slate-400 text-[10px]">{i + 1}.</span>
                      <span>{cmd.icon}</span>
                      <span>{cmd.label}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run Button */}
            <div className="pt-4 border-t border-slate-800/80 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">
                Llevar a ROBI hasta la estrella ⭐
              </span>
              <button
                disabled={isRunning || sequence.length === 0}
                onClick={handleRunSequence}
                className={`px-5 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all ${
                  sequence.length > 0 && !isRunning
                    ? 'bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'EJECUTANDO...' : 'EJECUTAR SECUENCIA'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
