import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { Check, Info, Sparkles } from 'lucide-react';

interface Level1Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

interface Item {
  id: string;
  name: string;
  category: string;
  isRobot: boolean;
  icon: string;
  description: string;
  explanation: string;
}

const ITEMS: Item[] = [
  {
    id: 'aspiradora',
    name: 'Robot Aspirador',
    category: 'Hogar autónomo',
    isRobot: true,
    icon: '🧹',
    description: 'Navega esquivando obstáculos y limpia pisos por sí mismo.',
    explanation: '¡SÍ es un robot! Posee sensores de proximidad para no chocar, un procesador que decide rutas y motores que lo desplazan.',
  },
  {
    id: 'semaforo',
    name: 'Semáforo Convencional',
    category: 'Señalización vial',
    isRobot: false,
    icon: '🚦',
    description: 'Cambia de luces verde, amarillo y rojo con un temporizador fijo.',
    explanation: 'NO es un robot. Es una automatización con un reloj fijo; no percibe el entorno ni adapta sus decisiones.',
  },
  {
    id: 'lavarropas',
    name: 'Lavarropas Automático',
    category: 'Electrodoméstico',
    isRobot: false,
    icon: '🧺',
    description: 'Ejecuta ciclos predefinidos de lavado y centrifugado.',
    explanation: 'NO es un robot. Es un aparato electromecánico automático que sigue un programa fijo sin adaptarse autónomamente.',
  },
  {
    id: 'brazo',
    name: 'Brazo Robótico Industrial',
    category: 'Manufactura',
    isRobot: true,
    icon: '🦾',
    description: 'Ensambla piezas, suelda y mueve cargas con gran precisión.',
    explanation: '¡SÍ es un robot! Tiene articulaciones mecánicas, sensores de posición y actuadores programables para manipular objetos.',
  },
  {
    id: 'ventilador',
    name: 'Ventilador de Techo',
    category: 'Ventilación',
    isRobot: false,
    icon: '🌀',
    description: 'Gira aspas cuando una persona aprieta la perilla de encendido.',
    explanation: 'NO es un robot. Es un motor eléctrico simple con interruptor manual. No toma decisiones ni tiene sensores.',
  },
  {
    id: 'riego',
    name: 'Sistema de Riego con Sensor',
    category: 'Agricultura inteligente',
    isRobot: true,
    icon: '💧',
    description: 'Mide la humedad de la tierra y riega solo cuando las plantas lo necesitan.',
    explanation: '¡SÍ puede considerarse un sistema robótico! Recibe datos del suelo (sensor), evalúa la humedad y acciona la válvula de agua.',
  },
  {
    id: 'auto_autonomo',
    name: 'Vehículo Autónomo',
    category: 'Transporte inteligente',
    isRobot: true,
    icon: '🚗',
    description: 'Detecta peatones, lee señales de tránsito y conduce sin chofer.',
    explanation: '¡SÍ es un robot avanzado! Utiliza cámaras, radares y un procesador potente para tomar decisiones en tiempo real.',
  },
];

export function Level1Recognize({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level1Props) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [analyzed, setAnalyzed] = useState(false);
  const [robotMood, setRobotMood] = useState<RobotMood>('thinking');
  const [robotMessage, setRobotMessage] = useState('Seleccioná los dispositivos que consideres robots y pulsa "Analizar".');

  const toggleItem = (id: string) => {
    playClickSound(soundEnabled);
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(item => item !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleVerify = () => {
    setAnalyzed(true);
    const robotIds = ITEMS.filter(i => i.isRobot).map(i => i.id);
    const nonRobotIds = ITEMS.filter(i => !i.isRobot).map(i => i.id);

    const selectedRobots = selectedIds.filter(id => robotIds.includes(id));
    const selectedNonRobots = selectedIds.filter(id => nonRobotIds.includes(id));

    // Success condition: found at least 3 out of 4 robots, and selected no more than 1 non-robot
    const isSuccess = selectedRobots.length >= 3 && selectedNonRobots.length === 0;

    if (isSuccess) {
      playSuccessSound(soundEnabled);
      setRobotMood('celebrate');
      setRobotMessage('¡Excelente deducción! Un robot recibe información, procesa y actúa.');
      onComplete();
    } else {
      playSoftErrorSound(soundEnabled);
      setRobotMood('confused');
      if (selectedNonRobots.length > 0) {
        setRobotMessage('¡Casi! Revisá si alguno de los seleccionados solo sigue un temporizador fijo.');
      } else {
        setRobotMessage('¡Buen intento! Todavía quedan robots con sensores y decisiones en la lista.');
      }
    }
  };

  const handleRetry = () => {
    setSelectedIds([]);
    setAnalyzed(false);
    setRobotMood('thinking');
    setRobotMessage('Volvé a intentarlo. Pensá: ¿Recibe información del entorno y decide?');
  };

  const hints = [
    'Un robot no es solo algo con forma humana de película. Es una máquina que percibe su entorno.',
    'Preguntate: ¿Tiene sensores para saber qué pasa a su alrededor o solo funciona con un reloj fijo?',
    'El lavarropas y el semáforo común no pueden "ver" lo que pasa: solo cumplen un horario preestablecido.',
  ];

  return (
    <ActivityShell
      title="Nivel 1 — Conocé al Robot"
      levelNumber={1}
      axis="Eje 1: Introducción a la Robótica"
      objective="Identificá cuáles de los siguientes 7 dispositivos pueden considerarse robots y cuáles son máquinas comunes o automatizaciones fijas."
      howTo="Tocá las tarjetas de los objetos para marcarlos. Cuando estés listo, hacé clic en 'ANALIZAR SELECCIÓN'. Leé las explicaciones de cada uno."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={handleRetry}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div>
        {/* Concept Banner */}
        <div className="mb-5 p-3.5 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-xs sm:text-sm text-cyan-200">
          <div className="font-bold font-mono text-cyan-400 uppercase tracking-wider mb-1 flex items-center gap-1.5">
            <Info className="w-4 h-4" /> REGLA DE ORO DE LA ROBÓTICA
          </div>
          <p>
            Para que una máquina sea considerada un <strong className="text-white">robot</strong> debe cumplir el ciclo:{' '}
            <span className="text-amber-300 font-semibold">1. Entrada (Sensores)</span> →{' '}
            <span className="text-purple-300 font-semibold">2. Procesamiento (Decisión)</span> →{' '}
            <span className="text-emerald-300 font-semibold">3. Salida (Actuadores / Acción)</span>.
          </p>
        </div>

        {/* Items Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3.5 mb-6">
          {ITEMS.map(item => {
            const isSelected = selectedIds.includes(item.id);
            return (
              <div
                key={item.id}
                onClick={() => !analyzed && toggleItem(item.id)}
                className={`relative rounded-xl p-4 border transition-all cursor-pointer select-none flex flex-col justify-between ${
                  isSelected
                    ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.3)] ring-1 ring-cyan-400'
                    : 'bg-slate-950/60 border-slate-800 hover:border-slate-700 hover:bg-slate-900/60'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-3xl">{item.icon}</span>
                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center text-xs transition-colors ${
                        isSelected
                          ? 'bg-cyan-500 border-cyan-400 text-slate-950'
                          : 'border-slate-700 bg-slate-900'
                      }`}
                    >
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                  </div>

                  <h3 className="font-display font-bold text-slate-100 text-sm">{item.name}</h3>
                  <span className="text-[10px] text-cyan-400/80 font-mono">{item.category}</span>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">{item.description}</p>
                </div>

                {/* Explanation revealed after analysis */}
                {analyzed && (
                  <div
                    className={`mt-3 pt-2.5 border-t text-[11px] leading-relaxed rounded-lg p-2 ${
                      item.isRobot
                        ? 'bg-emerald-950/50 border-emerald-500/40 text-emerald-200'
                        : 'bg-slate-900 border-slate-700 text-slate-300'
                    }`}
                  >
                    <div className="font-bold mb-0.5">
                      {item.isRobot ? '✅ SÍ ES UN ROBOT' : 'ℹ️ NO ES UN ROBOT'}
                    </div>
                    {item.explanation}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
        <div className="text-xs text-slate-400 font-mono">
          Seleccionados:{' '}
          <span className="text-cyan-300 font-bold">{selectedIds.length} objetos</span>
        </div>

        <div className="flex items-center gap-3">
          {analyzed && (
            <button
              onClick={handleRetry}
              className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs font-semibold hover:bg-slate-700 transition-colors"
            >
              Probar Otra Combinación
            </button>
          )}

          <button
            onClick={handleVerify}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-sky-500 hover:from-cyan-400 hover:to-sky-400 text-slate-950 font-display font-bold text-xs sm:text-sm tracking-wider uppercase shadow-[0_0_15px_rgba(6,182,212,0.4)] transition-all"
          >
            {analyzed ? 'Re-analizar Selección' : '⚡ ANALIZAR SELECCIÓN'}
          </button>
        </div>
      </div>
    </ActivityShell>
  );
}
