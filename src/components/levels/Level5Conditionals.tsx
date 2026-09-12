import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { GitFork, Check, Play, RefreshCw, AlertTriangle } from 'lucide-react';

interface Level5Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

export function Level5Conditionals({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level5Props) {
  // Phase 1: Simple Question
  const [q1Selected, setQ1Selected] = useState<string | null>(null);
  const [phase1Done, setPhase1Done] = useState(false);

  // Phase 2: Dual Branch IF / ELSE
  // IF obstacle -> Action A (girar, detenerse, avanzar)
  // ELSE -> Action B (avanzar, apagar, girar)
  const [ifAction, setIfAction] = useState<string>('girar');
  const [elseAction, setElseAction] = useState<string>('avanzar');
  const [hasObstacleInSim, setHasObstacleInSim] = useState<boolean>(true);
  const [simRunning, setSimRunning] = useState<boolean>(false);
  const [simLog, setSimLog] = useState<string | null>(null);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Los condicionales le permiten al robot tomar decisiones según lo que leen sus sensores.');

  const handleVerifyQ1 = () => {
    if (q1Selected === 'detenerse') {
      playSuccessSound(soundEnabled);
      setPhase1Done(true);
      setRobotMood('happy');
      setRobotMessage('¡Correcto! Si hay una pared enfrente, lo más seguro es frenar o desviar.');
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('¡Cuidado! Si continúa de largo, el robot colisionará con la pared.');
    }
  };

  const handleRunSimulator = () => {
    playClickSound(soundEnabled);
    setSimRunning(true);
    setRobotMood('detecting');

    setTimeout(() => {
      let result = '';
      if (hasObstacleInSim) {
        if (ifAction === 'girar' || ifAction === 'detenerse') {
          result = `Sensor detectó OBSTÁCULO a 10cm → Ejecutando acción: ${ifAction.toUpperCase()} con éxito. Evitó la colisión.`;
          playSuccessSound(soundEnabled);
          setRobotMood('celebrate');
          setRobotMessage('¡Excelente lógica condicional! El robot protegió su integridad.');
          onComplete();
        } else {
          result = `Sensor detectó OBSTÁCULO → Acción incorrecta: AVANZAR. ¡Colisión inminente!`;
          playSoftErrorSound(soundEnabled);
          setRobotMood('confused');
          setRobotMessage('“Si hay un obstáculo no podemos avanzar de frente. Probá poner girar o detenerse.”');
        }
      } else {
        if (elseAction === 'avanzar') {
          result = `Sensor despejado (SIN obstáculo) → Ejecutando acción: ${elseAction.toUpperCase()}. El camino continúa libre.`;
          playSuccessSound(soundEnabled);
          setRobotMood('happy');
          setRobotMessage('¡Camino despejado! Avanza correctamente.');
        } else {
          result = `Sensor despejado → El robot se detuvo innecesariamente. Podría avanzar.`;
          setRobotMood('thinking');
        }
      }
      setSimLog(result);
      setSimRunning(false);
    }, 800);
  };

  const hints = [
    'Pensá en el sentido común: SI hay una pared justo adelante, no podemos avanzar.',
    'La regla SI / ENTONCES funciona como: "SI pasa X cosa, ENTONCES hago Y".',
    'Configurá: SI hay obstáculo → GIRAR. SI NO hay obstáculo → AVANZAR.',
  ];

  return (
    <ActivityShell
      title="Nivel 5 — Lógica Condicional: SI / ENTONCES"
      levelNumber={5}
      axis="Eje 2: Pensamiento Computacional"
      objective="Enseñale a ROBI a tomar decisiones inteligentes utilizando condiciones lógicas según los sensores."
      howTo="Completá el primer desafío para desbloquear el simulador de bifurcación condicional SI / SINO."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={() => {
        setQ1Selected(null);
        setPhase1Done(false);
        setSimLog(null);
      }}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-6">
        {/* Step 1: Basic Conditional Question */}
        <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
              PASO 1: SITUACIÓN DIRECTA
            </span>
            {phase1Done && (
              <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                <Check className="w-4 h-4" /> Resuelto
              </span>
            )}
          </div>

          <div className="flex items-center justify-center gap-6 py-4 bg-slate-900/60 rounded-xl border border-slate-800 mb-4">
            <span className="text-4xl">🤖</span>
            <span className="text-cyan-400 font-mono text-xl font-bold">—— sensor de distancia ——→</span>
            <span className="text-4xl">🧱</span>
          </div>

          <p className="text-sm font-semibold text-slate-100 mb-3">
            <span className="text-purple-400 font-mono font-bold">SI</span> hay un obstáculo en el camino... ¿Qué debe hacer el robot?
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              { id: 'seguir', label: 'Seguir avanzando' },
              { id: 'detenerse', label: 'Detenerse / Frenar' },
              { id: 'apagar', label: 'Apagar la pantalla' },
            ].map(opt => (
              <button
                key={opt.id}
                disabled={phase1Done}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setQ1Selected(opt.id);
                }}
                className={`p-3 rounded-xl border text-xs font-bold font-mono transition-all text-left ${
                  q1Selected === opt.id
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {!phase1Done && (
            <div className="mt-4 flex justify-end">
              <button
                disabled={!q1Selected}
                onClick={handleVerifyQ1}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider disabled:opacity-40"
              >
                Confirmar Decisión
              </button>
            </div>
          )}
        </div>

        {/* Step 2: Full Dual Branching IF / ELSE */}
        <div className={`p-5 rounded-2xl bg-slate-950 border transition-all ${
          phase1Done ? 'border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.15)]' : 'border-slate-800 opacity-40'
        }`}>
          <div className="flex items-center gap-2 mb-3">
            <GitFork className="w-5 h-5 text-purple-400" />
            <span className="text-xs font-mono font-bold text-purple-400 uppercase tracking-wider">
              PASO 2: ESTRUCTURA CONDICIONAL COMPLETA (SI / SINO)
            </span>
          </div>

          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 space-y-4 mb-4 font-mono text-xs sm:text-sm">
            {/* Branch 1 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-purple-950 text-purple-300 font-bold px-2.5 py-1 rounded border border-purple-500/40">
                SI
              </span>
              <span className="text-slate-200 font-semibold">
                hay un obstáculo enfrente
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-cyan-400 font-bold">ENTONCES:</span>
              <select
                value={ifAction}
                disabled={!phase1Done}
                onChange={e => setIfAction(e.target.value)}
                className="bg-slate-950 border border-cyan-500/50 rounded-lg px-3 py-1.5 text-cyan-300 font-bold focus:outline-none focus:border-cyan-400"
              >
                <option value="girar">Girar 90° para esquivar</option>
                <option value="detenerse">Detener los motores</option>
                <option value="avanzar">Avanzar a toda velocidad</option>
              </select>
            </div>

            {/* Branch 2 */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-slate-800 text-slate-300 font-bold px-2.5 py-1 rounded border border-slate-700">
                SI NO (Camino libre)
              </span>
              <span className="text-slate-500">→</span>
              <span className="text-emerald-400 font-bold">ENTONCES:</span>
              <select
                value={elseAction}
                disabled={!phase1Done}
                onChange={e => setElseAction(e.target.value)}
                className="bg-slate-950 border border-emerald-500/50 rounded-lg px-3 py-1.5 text-emerald-300 font-bold focus:outline-none focus:border-emerald-400"
              >
                <option value="avanzar">Avanzar hacia adelante</option>
                <option value="girar">Girar sin parar</option>
                <option value="apagar">Apagar los motores</option>
              </select>
            </div>
          </div>

          {/* Interactive Environment Toggle */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-3 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-mono">Entorno de prueba:</span>
              <button
                disabled={!phase1Done}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setHasObstacleInSim(!hasObstacleInSim);
                  setSimLog(null);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-mono font-bold border transition-all ${
                  hasObstacleInSim
                    ? 'bg-rose-950/80 border-rose-500/60 text-rose-300'
                    : 'bg-emerald-950/80 border-emerald-500/60 text-emerald-300'
                }`}
              >
                {hasObstacleInSim ? '🧱 Obstáculo Presente' : '🟢 Camino Libre'}
              </button>
            </div>

            <button
              disabled={!phase1Done || simRunning}
              onClick={handleRunSimulator}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_12px_rgba(168,85,247,0.3)] disabled:opacity-40"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>{simRunning ? 'EVALUANDO...' : 'PROBAR EN SIMULADOR'}</span>
            </button>
          </div>

          {/* Simulation Output Log */}
          {simLog && (
            <div className="mt-4 p-3.5 rounded-xl bg-slate-900 border border-cyan-500/40 text-xs font-mono text-cyan-200">
              <span className="text-cyan-400 font-bold uppercase">TELEMETRÍA EN VIVO:</span> {simLog}
            </div>
          )}
        </div>
      </div>
    </ActivityShell>
  );
}
