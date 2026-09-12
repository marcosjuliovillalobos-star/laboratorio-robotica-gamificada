import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound, playRobotStep } from '../../utils/audio';
import { Play, RotateCcw, Trash2, ArrowUp, ArrowDown, Sparkles, CheckCircle2 } from 'lucide-react';

interface Level6Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

export type BlockType = 
  | 'FORWARD' 
  | 'BACKWARD' 
  | 'TURN_RIGHT' 
  | 'TURN_LEFT' 
  | 'WAIT' 
  | 'STOP' 
  | 'REPEAT_2X' 
  | 'IF_OBSTACLE';

interface ProgramBlock {
  id: string;
  type: BlockType;
  label: string;
  category: 'motion' | 'control' | 'logic';
}

const AVAILABLE_BLOCKS: { type: BlockType; label: string; category: 'motion' | 'control' | 'logic'; color: string }[] = [
  { type: 'FORWARD', label: '🟦 AVANZAR', category: 'motion', color: 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white' },
  { type: 'BACKWARD', label: '🟦 RETROCEDER', category: 'motion', color: 'bg-blue-600 hover:bg-blue-500 border-blue-400 text-white' },
  { type: 'TURN_RIGHT', label: '🟦 GIRAR DER (90°)', category: 'motion', color: 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-white' },
  { type: 'TURN_LEFT', label: '🟦 GIRAR IZQ (90°)', category: 'motion', color: 'bg-sky-600 hover:bg-sky-500 border-sky-400 text-white' },
  { type: 'WAIT', label: '🟦 ESPERAR (1s)', category: 'motion', color: 'bg-slate-700 hover:bg-slate-600 border-slate-500 text-slate-200' },
  { type: 'STOP', label: '🟦 DETENER', category: 'motion', color: 'bg-rose-600 hover:bg-rose-500 border-rose-400 text-white' },
  { type: 'REPEAT_2X', label: '🟨 REPETIR (x2)', category: 'control', color: 'bg-amber-600 hover:bg-amber-500 border-amber-400 text-slate-950 font-bold' },
  { type: 'IF_OBSTACLE', label: '🟩 SI obstáculo → GIRAR', category: 'logic', color: 'bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white' },
];

export function Level6BlockCoding({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level6Props) {
  const [program, setProgram] = useState<ProgramBlock[]>([
    { id: '1', type: 'FORWARD', label: '🟦 AVANZAR', category: 'motion' },
    { id: '2', type: 'TURN_RIGHT', label: '🟦 GIRAR DER (90°)', category: 'motion' },
  ]);

  const [executingIndex, setExecutingIndex] = useState<number | null>(null);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [robotPos, setRobotPos] = useState<{ x: number; y: number; dir: number }>({ x: 0, y: 3, dir: 0 }); // Facing North
  const [collectedEnergy, setCollectedEnergy] = useState<boolean>(false);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Construí un programa por bloques para recolectar la batería de energía 🔋 y llegar a la base.');

  // Target objective in 4x4 mini-arena
  // Start: (0, 3), Facing North (0)
  // Battery: (0, 1)
  // Base Goal: (2, 1)
  const targetBattery = { x: 0, y: 1 };
  const targetBase = { x: 2, y: 1 };

  const addBlock = (type: BlockType) => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    const def = AVAILABLE_BLOCKS.find(b => b.type === type)!;
    setProgram([
      ...program,
      {
        id: `${type}_${Date.now()}_${Math.random()}`,
        type,
        label: def.label,
        category: def.category,
      },
    ]);
  };

  const removeBlock = (index: number) => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setProgram(program.filter((_, i) => i !== index));
  };

  const handleClear = () => {
    if (isRunning) return;
    playClickSound(soundEnabled);
    setProgram([]);
    setRobotPos({ x: 0, y: 3, dir: 0 });
    setCollectedEnergy(false);
    setExecutingIndex(null);
    setRobotMood('idle');
    setRobotMessage('Programa limpiado. Probá añadiendo los bloques necesarios.');
  };

  const handleExecute = async () => {
    if (isRunning || program.length === 0) return;
    setIsRunning(true);
    setRobotMood('moving');
    setRobotMessage('Compilando y ejecutando bloques...');

    let currentX = 0;
    let currentY = 3;
    let currentDir = 0; // 0: N, 1: E, 2: S, 3: W
    let hasBattery = false;
    setRobotPos({ x: currentX, y: currentY, dir: currentDir });
    setCollectedEnergy(false);

    const dx = [0, 1, 0, -1];
    const dy = [-1, 0, 1, 0];

    // Expand program to handle REPEAT_2X
    const flattened: BlockType[] = [];
    for (let i = 0; i < program.length; i++) {
      if (program[i].type === 'REPEAT_2X') {
        // Repeats previous motion block if any
        if (flattened.length > 0) {
          flattened.push(flattened[flattened.length - 1]);
        }
      } else {
        flattened.push(program[i].type);
      }
    }

    for (let i = 0; i < flattened.length; i++) {
      setExecutingIndex(i);
      const block = flattened[i];
      playRobotStep(soundEnabled);

      if (block === 'FORWARD') {
        currentX = Math.max(0, Math.min(3, currentX + dx[currentDir]));
        currentY = Math.max(0, Math.min(3, currentY + dy[currentDir]));
      } else if (block === 'BACKWARD') {
        currentX = Math.max(0, Math.min(3, currentX - dx[currentDir]));
        currentY = Math.max(0, Math.min(3, currentY - dy[currentDir]));
      } else if (block === 'TURN_RIGHT') {
        currentDir = (currentDir + 1) % 4;
      } else if (block === 'TURN_LEFT') {
        currentDir = (currentDir + 3) % 4;
      } else if (block === 'WAIT') {
        await new Promise(r => setTimeout(r, 400));
      }

      // Check battery pickup
      if (currentX === targetBattery.x && currentY === targetBattery.y) {
        hasBattery = true;
        setCollectedEnergy(true);
      }

      setRobotPos({ x: currentX, y: currentY, dir: currentDir });
      await new Promise(r => setTimeout(r, 600));
    }

    setIsRunning(false);
    setExecutingIndex(null);

    // Verify victory
    if (currentX === targetBase.x && currentY === targetBase.y && hasBattery) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage('🎉 ¡PROGRAMA PERFECTO! ROBI recogió la batería y llegó a la base de recarga.');
      onComplete();
    } else if (!hasBattery && currentX === targetBase.x && currentY === targetBase.y) {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('“Llegaste a la base, pero olvidaste pasar por la batería de energía 🔋 en el camino.”');
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('“Casi llegamos. Revisá los giros y la cantidad de bloques avanzar.”');
    }
  };

  const hints = [
    'Para recoger la batería 🔋: avanzá 2 veces al Norte desde la posición inicial.',
    'Luego girá 90° a la derecha (hacia el Este).',
    'Avanzá 2 veces hacia la base de recarga y colocá DETENER.',
  ];

  return (
    <ActivityShell
      title="Nivel 6 — Programación por Bloques"
      levelNumber={6}
      axis="Eje 2 y 3: Construcción y Lógica"
      objective="Armá un programa visual combinando bloques de movimiento y control para que ROBI recoja la batería y llegue a la base."
      howTo="Tocá los bloques disponibles para apilarlos en tu programa. Tocá cualquier bloque apilado para borrarlo si te equivocaste."
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
        {/* Left: 4x4 Circuit Simulator */}
        <div className="lg:col-span-5 flex flex-col items-center">
          <div className="text-xs font-mono text-cyan-400 mb-2 flex items-center justify-between w-full max-w-[280px]">
            <span>ESCENARIO DE PRUEBAS (4x4)</span>
            <span>{collectedEnergy ? '🔋 ENERGÍA OK' : '⚠️ FALTA ENERGÍA'}</span>
          </div>

          <div className="p-2 rounded-2xl bg-slate-950 border border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.15)]">
            <div className="grid grid-cols-4 gap-2 w-[260px] h-[260px] bg-[#030712] p-2 rounded-xl cyber-grid">
              {Array.from({ length: 16 }).map((_, idx) => {
                const x = idx % 4;
                const y = Math.floor(idx / 4);
                const isRobot = robotPos.x === x && robotPos.y === y;
                const isBattery = targetBattery.x === x && targetBattery.y === y;
                const isBase = targetBase.x === x && targetBase.y === y;

                return (
                  <div
                    key={idx}
                    className={`relative rounded-lg border flex items-center justify-center transition-all ${
                      isRobot
                        ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.5)]'
                        : isBase
                        ? 'bg-emerald-950/50 border-emerald-400 shadow-[0_0_10px_rgba(16,185,129,0.3)]'
                        : isBattery && !collectedEnergy
                        ? 'bg-amber-950/50 border-amber-400 animate-pulse'
                        : 'bg-slate-900/40 border-slate-800'
                    }`}
                  >
                    {isRobot && <span className="text-xl">🤖</span>}
                    {isBattery && !collectedEnergy && !isRobot && <span className="text-xl">🔋</span>}
                    {isBase && !isRobot && <span className="text-xl">🏁</span>}
                  </div>
                );
              })}
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono mt-3 text-slate-300">
            <span>🤖 Inicio: (0,3)</span>
            <span>🔋 Batería: (0,1)</span>
            <span>🏁 Meta: (2,1)</span>
          </div>
        </div>

        {/* Right: Blocks Palette & Program Workspace */}
        <div className="lg:col-span-7 space-y-4">
          {/* Palette */}
          <div>
            <span className="text-xs font-mono text-slate-300 uppercase tracking-wider mb-2 block">
              BLOQUES DISPONIBLES (TOCÁ PARA AGREGAR):
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {AVAILABLE_BLOCKS.map(b => (
                <button
                  key={b.type}
                  disabled={isRunning}
                  onClick={() => addBlock(b.type)}
                  className={`p-2 rounded-lg text-xs font-mono font-bold border transition-all text-left truncate active:scale-95 shadow-sm ${b.color}`}
                >
                  {b.label}
                </button>
              ))}
            </div>
          </div>

          {/* Program sequence stack */}
          <div className="p-4 rounded-2xl bg-slate-950/90 border border-slate-800 min-h-[220px] flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider">
                  PROGRAMA EN CONSTRUCCIÓN ({program.length} BLOQUES)
                </span>
                {program.length > 0 && (
                  <button
                    disabled={isRunning}
                    onClick={handleClear}
                    className="text-[11px] font-mono text-rose-400 hover:text-rose-300 flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" /> Vaciar
                  </button>
                )}
              </div>

              {program.length === 0 ? (
                <div className="text-xs text-slate-500 italic py-8 text-center">
                  El programa está vacío. Tocá los bloques de arriba para armar el algoritmo.
                </div>
              ) : (
                <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                  {program.map((block, i) => (
                    <div
                      key={block.id}
                      onClick={() => removeBlock(i)}
                      className={`p-2 rounded-lg border text-xs font-mono font-bold flex items-center justify-between cursor-pointer select-none transition-all ${
                        executingIndex === i
                          ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_12px_#00f0ff] scale-[1.02]'
                          : 'bg-slate-900 border-slate-700 text-slate-200 hover:border-rose-500 hover:text-rose-300'
                      }`}
                      title="Hacé clic para quitar este bloque"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-slate-500 text-[10px] w-4">{i + 1}.</span>
                        <span>{block.label}</span>
                      </div>
                      <span className="text-[10px] text-slate-500 hover:text-rose-400">✕</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Run button */}
            <div className="pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono">
                {collectedEnergy ? '✅ Batería obtenida' : '⚪ Pendiente batería'}
              </span>

              <button
                disabled={isRunning || program.length === 0}
                onClick={handleExecute}
                className={`px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 transition-all ${
                  program.length > 0 && !isRunning
                    ? 'bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-400 hover:to-cyan-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed'
                }`}
              >
                <Play className="w-4 h-4 fill-current" />
                <span>{isRunning ? 'EJECUTANDO CÓDIGO...' : 'EJECUTAR PROGRAMA'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
