import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { Layers, Eye, Zap, Cpu, CheckCircle2, AlertCircle } from 'lucide-react';

interface Level2Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

type PartKey = 'sensor' | 'actuador' | 'estructura' | 'cerebro';

export function Level2Parts({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level2Props) {
  const [activePart, setActivePart] = useState<PartKey>('sensor');
  const [exploredParts, setExploredParts] = useState<PartKey[]>(['sensor']);
  
  // Quiz states
  const [q1Answer, setQ1Answer] = useState<string | null>(null);
  const [q2Answer, setQ2Answer] = useState<string | null>(null);
  const [quizSubmitted, setQuizSubmitted] = useState(false);

  const [robotMood, setRobotMood] = useState<RobotMood>('idle');
  const [robotMessage, setRobotMessage] = useState('Hacé clic sobre las partes del robot para inspeccionar su función.');

  const partsData = {
    estructura: {
      title: 'Estructura (Chasis y Soporte)',
      icon: <Layers className="w-5 h-5 text-blue-400" />,
      tag: 'Cuerpo Físico',
      desc: 'Sostiene, protege y organiza todos los componentes electrónicos y mecánicos del robot. Puede ser de metal, acrílico, plástico o impresión 3D.',
      analogia: 'Es como el esqueleto en el cuerpo humano.',
      color: 'border-blue-500/50 bg-blue-950/30 text-blue-300',
    },
    sensor: {
      title: 'Sensores (Entrada de Datos)',
      icon: <Eye className="w-5 h-5 text-cyan-400" />,
      tag: 'Órganos Sensoriales',
      desc: 'Permite obtener información del entorno en tiempo real (distancia, luz, sonido, temperatura, obstáculos). Convierte magnitudes físicas en señales eléctricas.',
      analogia: 'Son como los ojos, oídos y tacto del robot.',
      color: 'border-cyan-500/50 bg-cyan-950/30 text-cyan-300',
    },
    actuador: {
      title: 'Actuadores (Salida / Acción)',
      icon: <Zap className="w-5 h-5 text-amber-400" />,
      tag: 'Efectores Físicos',
      desc: 'Permite realizar una acción física modificando el entorno. Ejemplos: motores que hacen girar ruedas, servomotores que mueven brazos, luces LED y zumbadores.',
      analogia: 'Son como los músculos y la voz del robot.',
      color: 'border-amber-500/50 bg-amber-950/30 text-amber-300',
    },
    cerebro: {
      title: 'Controlador / Cerebro (Microcontrolador)',
      icon: <Cpu className="w-5 h-5 text-purple-400" />,
      tag: 'Procesamiento',
      desc: 'Recibe los datos de los sensores, ejecuta las líneas de código del programa y envía las órdenes precisas a los actuadores.',
      analogia: 'Es como el cerebro que piensa y decide.',
      color: 'border-purple-500/50 bg-purple-950/30 text-purple-300',
    },
  };

  const handleSelectPart = (part: PartKey) => {
    playClickSound(soundEnabled);
    setActivePart(part);
    if (!exploredParts.includes(part)) {
      setExploredParts([...exploredParts, part]);
    }
    setRobotMood('detecting');
    setRobotMessage(`Inspeccionando: ${partsData[part].title}`);
  };

  const handleSubmitQuiz = () => {
    setQuizSubmitted(true);
    // Q1: ¿Qué componente utilizarías para detectar una pared? -> Sensor de distancia
    // Q2: ¿Qué componente utilizarías para mover y hacer avanzar el robot? -> Motor / Actuador
    const q1Correct = q1Answer === 'sensor_distancia';
    const q2Correct = q2Answer === 'motor';

    if (q1Correct && q2Correct) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage('¡Excelente! Distinguís con claridad la diferencia entre sensor y actuador.');
      onComplete();
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      setRobotMessage('¡Casi! Recordá: los sensores perciben el entorno y los actuadores ejecutan la fuerza.');
    }
  };

  const handleRetry = () => {
    setQ1Answer(null);
    setQ2Answer(null);
    setQuizSubmitted(false);
    setRobotMood('thinking');
    setRobotMessage('Revisemos las funciones de cada parte y volvamos a responder.');
  };

  const hints = [
    'Para detectar un obstáculo antes de chocar, necesitás medir qué tan cerca está.',
    'Una rueda no puede sentir nada por sí sola; necesita un motor para girar y un sensor para no chocar.',
    'La respuesta al primer desafío es el Sensor de Distancia.',
  ];

  return (
    <ActivityShell
      title="Nivel 2 — Partes del Robot"
      levelNumber={2}
      axis="Eje 1: Introducción a la Robótica"
      objective="Explorá los 4 componentes estructurales de un robot y resolvé los desafíos de identificación técnica."
      howTo="Tocá cada parte del robot en el esquema interactivo para leer su definición. Luego respondé las 2 preguntas de diagnóstico."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={handleRetry}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-6">
        {/* Interactive Diagram & Explanations */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Hologram Robot Visual */}
          <div className="lg:col-span-6 bg-slate-950/80 rounded-2xl p-6 border border-cyan-500/30 flex flex-col items-center justify-center relative cyber-grid">
            <div className="text-[11px] font-mono text-cyan-400 tracking-wider uppercase mb-3">
              ESQUEMA HOLOGRÁFICO • SELECCIONÁ UN COMPONENTE
            </div>

            {/* Interactive Component Hotspots */}
            <div className="relative w-72 h-80 flex items-center justify-center">
              {/* SVG Blueprint */}
              <svg viewBox="0 0 260 300" className="w-full h-full drop-shadow-[0_0_15px_rgba(6,182,212,0.3)]">
                {/* Structure / Outer Chassis */}
                <rect
                  x="40"
                  y="60"
                  width="180"
                  height="180"
                  rx="24"
                  className={`cursor-pointer transition-all duration-300 ${
                    activePart === 'estructura'
                      ? 'fill-blue-900/50 stroke-blue-400 stroke-[3]'
                      : 'fill-slate-900/90 stroke-slate-700 stroke-[2] hover:stroke-blue-400/60'
                  }`}
                  onClick={() => handleSelectPart('estructura')}
                />

                {/* Ultrasonic Sensor Eyes */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectPart('sensor')}
                >
                  <circle
                    cx="90"
                    cy="110"
                    r="24"
                    className={`transition-all duration-300 ${
                      activePart === 'sensor'
                        ? 'fill-cyan-900 stroke-cyan-300 stroke-[3]'
                        : 'fill-slate-800 stroke-cyan-600 stroke-[2]'
                    }`}
                  />
                  <circle cx="90" cy="110" r="14" fill="#040814" />
                  <circle cx="90" cy="110" r="6" fill="#00f0ff" className="animate-pulse" />

                  <circle
                    cx="170"
                    cy="110"
                    r="24"
                    className={`transition-all duration-300 ${
                      activePart === 'sensor'
                        ? 'fill-cyan-900 stroke-cyan-300 stroke-[3]'
                        : 'fill-slate-800 stroke-cyan-600 stroke-[2]'
                    }`}
                  />
                  <circle cx="170" cy="110" r="14" fill="#040814" />
                  <circle cx="170" cy="110" r="6" fill="#00f0ff" className="animate-pulse" />
                </g>

                {/* Controller / Microcontroller Heart */}
                <rect
                  x="90"
                  y="160"
                  width="80"
                  height="50"
                  rx="8"
                  className={`cursor-pointer transition-all duration-300 ${
                    activePart === 'cerebro'
                      ? 'fill-purple-900 stroke-purple-400 stroke-[3]'
                      : 'fill-slate-950 stroke-purple-600 stroke-[2]'
                  }`}
                  onClick={() => handleSelectPart('cerebro')}
                />
                <text x="130" y="190" textAnchor="middle" fill="#c084fc" fontSize="10" fontFamily="monospace" fontWeight="bold">
                  CPU / PLACA
                </text>

                {/* Actuator Wheels / Motors */}
                <g
                  className="cursor-pointer"
                  onClick={() => handleSelectPart('actuador')}
                >
                  <rect
                    x="20"
                    y="130"
                    width="20"
                    height="70"
                    rx="6"
                    className={`transition-all duration-300 ${
                      activePart === 'actuador'
                        ? 'fill-amber-900 stroke-amber-400 stroke-[3]'
                        : 'fill-slate-800 stroke-amber-600 stroke-[2]'
                    }`}
                  />
                  <rect
                    x="220"
                    y="130"
                    width="20"
                    height="70"
                    rx="6"
                    className={`transition-all duration-300 ${
                      activePart === 'actuador'
                        ? 'fill-amber-900 stroke-amber-400 stroke-[3]'
                        : 'fill-slate-800 stroke-amber-600 stroke-[2]'
                    }`}
                  />
                </g>
              </svg>
            </div>

            {/* Quick selector buttons */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 w-full mt-4">
              {(['sensor', 'actuador', 'estructura', 'cerebro'] as PartKey[]).map(p => (
                <button
                  key={p}
                  onClick={() => handleSelectPart(p)}
                  className={`py-1.5 px-2 rounded-lg text-xs font-mono uppercase font-bold transition-all border ${
                    activePart === p
                      ? 'bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_10px_rgba(6,182,212,0.4)]'
                      : 'bg-slate-900 text-slate-300 border-slate-700 hover:border-slate-500'
                  }`}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Part Detail Card */}
          <div className="lg:col-span-6 flex flex-col justify-center">
            <div className={`p-5 rounded-2xl border transition-all ${partsData[activePart].color}`}>
              <div className="flex items-center gap-2 mb-2">
                {partsData[activePart].icon}
                <h3 className="text-lg font-display font-bold text-slate-100">
                  {partsData[activePart].title}
                </h3>
              </div>
              <span className="inline-block text-[11px] font-mono px-2 py-0.5 rounded bg-slate-900/80 border border-current mb-3">
                {partsData[activePart].tag}
              </span>

              <p className="text-sm text-slate-200 leading-relaxed mb-4">
                {partsData[activePart].desc}
              </p>

              <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
                <strong className="text-cyan-400">💡 Analogía:</strong> {partsData[activePart].analogia}
              </div>
            </div>
          </div>
        </div>

        {/* Challenge Questions */}
        <div className="bg-slate-950/90 rounded-2xl p-5 border border-slate-800">
          <h3 className="text-base font-display font-bold text-slate-100 mb-4 flex items-center gap-2">
            <span>🎯 DESAFÍO DE IDENTIFICACIÓN</span>
            <span className="text-xs text-slate-400 font-mono">(Respondé ambas para avanzar)</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Q1 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-semibold text-cyan-300 mb-3 font-mono">
                1. ¿Qué componente utilizarías para detectar una pared antes de chocar?
              </p>
              <div className="space-y-2">
                {[
                  { id: 'motor', label: 'Motor eléctrico' },
                  { id: 'sensor_distancia', label: 'Sensor de distancia (Ultrasonido)' },
                  { id: 'rueda', label: 'Rueda de goma' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setQ1Answer(opt.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ${
                      q1Answer === opt.id
                        ? 'bg-cyan-950/80 border-cyan-400 text-cyan-200 shadow-[0_0_10px_rgba(6,182,212,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${quizSubmitted && opt.id === 'sensor_distancia' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Q2 */}
            <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
              <p className="text-xs font-semibold text-purple-300 mb-3 font-mono">
                2. ¿Qué componente es el responsable de ejercer la fuerza física para mover al robot?
              </p>
              <div className="space-y-2">
                {[
                  { id: 'chasis', label: 'Estructura de acrílico' },
                  { id: 'sensor_luz', label: 'Sensor de luz (LDR)' },
                  { id: 'motor', label: 'Motor (Actuador electromecánico)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => {
                      playClickSound(soundEnabled);
                      setQ2Answer(opt.id);
                    }}
                    className={`w-full text-left p-2.5 rounded-lg text-xs font-medium border transition-all ${
                      q2Answer === opt.id
                        ? 'bg-purple-950/80 border-purple-400 text-purple-200 shadow-[0_0_10px_rgba(168,85,247,0.2)]'
                        : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                    } ${quizSubmitted && opt.id === 'motor' ? 'border-emerald-500 bg-emerald-950/40 text-emerald-200' : ''}`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Submit */}
          <div className="mt-5 flex justify-end">
            <button
              disabled={!q1Answer || !q2Answer}
              onClick={handleSubmitQuiz}
              className={`px-6 py-2.5 rounded-xl font-display font-bold text-xs sm:text-sm tracking-wider uppercase transition-all ${
                q1Answer && q2Answer
                  ? 'bg-gradient-to-r from-cyan-500 to-purple-500 hover:from-cyan-400 hover:to-purple-400 text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              VERIFICAR RESPUESTAS
            </button>
          </div>
        </div>
      </div>
    </ActivityShell>
  );
}
