import { useState } from 'react';
import { UserProgress } from '../types';
import { saveProgress } from '../utils/storage';
import { playClickSound, playSuccessSound, playRobotStep } from '../utils/audio';
import { Play, RotateCcw, ArrowLeft, Sparkles, Check, Download } from 'lucide-react';

interface CreativeModeProps {
  progress: UserProgress;
  soundEnabled: boolean;
  onUpdateProgress: (p: UserProgress) => void;
  onBack: () => void;
}

const BODIES = [
  { id: 'titan', name: 'Chasis Titan-X', type: 'Robusto Industrial', icon: '🤖', color: 'from-cyan-500 to-blue-600' },
  { id: 'scout', name: 'Chasis Scout-V', type: 'Veloz Aerodinámico', icon: '🛸', color: 'from-purple-500 to-pink-600' },
  { id: 'rover', name: 'Chasis Rover-Mars', type: 'Exploración Todo Terreno', icon: '🚜', color: 'from-amber-500 to-orange-600' },
];

const TRACTION = [
  { id: 'ruedas', name: '4 Ruedas de Goma de Alto Agarre', speed: '+30% Rapidez', icon: '🛞' },
  { id: 'orugas', name: 'Orugas Tipo Tanque', speed: '+50% Tracción en Pendientes', icon: '⚙️' },
  { id: 'patas', name: 'Patas Hexápodas Articuladas', speed: 'Navegación en Escombros', icon: '🕷️' },
];

const SENSORS = [
  { id: 'ultra', name: 'Sensor Ultrasonido HC-SR04', desc: 'Mide distancia y frena ante paredes', icon: '📏' },
  { id: 'ldr', name: 'Fotorresistor LDR', desc: 'Sigue fuentes de luz o detecta sombras', icon: '💡' },
  { id: 'cam', name: 'Cámara con Visión Artificial', desc: 'Reconoce colores y códigos QR', icon: '👁️' },
  { id: 'line', name: 'Sensor Seguidor de Línea IR', desc: 'Detecta líneas negras en el piso', icon: '〰️' },
];

const ACTUATORS = [
  { id: 'griper', name: 'Pinza Mecánica Servoasistida', desc: 'Sujeta y traslada objetos', icon: '🤏' },
  { id: 'leds', name: 'Foco LED de Alta Potencia', desc: 'Ilumina zonas oscuras', icon: '🔦' },
  { id: 'buzzer', name: 'Bocina / Zumbador Piezoeléctrico', desc: 'Emite alarmas sonoras', icon: '🔊' },
  { id: 'laser', name: 'Puntero Guía Láser', desc: 'Proyecta objetivos en el suelo', icon: '🎯' },
];

export function CreativeMode({
  progress,
  soundEnabled,
  onUpdateProgress,
  onBack,
}: CreativeModeProps) {
  const [robotName, setRobotName] = useState('CYBER-BOT 3000');
  const [selectedBody, setSelectedBody] = useState(BODIES[0].id);
  const [selectedTraction, setSelectedTraction] = useState(TRACTION[0].id);
  const [selectedSensors, setSelectedSensors] = useState<string[]>(['ultra', 'ldr']);
  const [selectedActuators, setSelectedActuators] = useState<string[]>(['griper', 'leds']);

  // Free Track Arena testing state
  const [testPos, setTestPos] = useState({ x: 2, y: 2 });
  const [testAngle, setTestAngle] = useState(0);
  const [actionLog, setActionLog] = useState<string>('Robot listo para probar en la pista.');

  const toggleSensor = (id: string) => {
    playClickSound(soundEnabled);
    if (selectedSensors.includes(id)) {
      setSelectedSensors(selectedSensors.filter(s => s !== id));
    } else {
      setSelectedSensors([...selectedSensors, id]);
    }
  };

  const toggleActuator = (id: string) => {
    playClickSound(soundEnabled);
    if (selectedActuators.includes(id)) {
      setSelectedActuators(selectedActuators.filter(a => a !== id));
    } else {
      setSelectedActuators([...selectedActuators, id]);
    }
  };

  const handleSaveRobot = () => {
    playSuccessSound(soundEnabled);
    const updatedAchievements = progress.achievements.map(a =>
      a.id === 'creative_engineer' ? { ...a, unlocked: true, unlockedAt: new Date().toLocaleDateString('es-AR') } : a
    );
    const updated: UserProgress = {
      ...progress,
      customRobot: {
        name: robotName,
        body: selectedBody,
        traction: selectedTraction,
        sensors: selectedSensors,
        actuators: selectedActuators,
        createdAt: new Date().toLocaleDateString('es-AR'),
      },
      xp: progress.xp + 50,
      achievements: updatedAchievements,
    };
    saveProgress(updated);
    onUpdateProgress(updated);
    setActionLog(`¡Diseño de ${robotName} guardado en el chip de memoria! Ganaste +50 XP.`);
  };

  const moveInTrack = (dx: number, dy: number) => {
    playRobotStep(soundEnabled);
    setTestPos(prev => ({
      x: Math.max(0, Math.min(4, prev.x + dx)),
      y: Math.max(0, Math.min(4, prev.y + dy)),
    }));
    setActionLog(`Navegando: posición (${testPos.x + dx}, ${testPos.y + dy})`);
  };

  const chosenBodyObj = BODIES.find(b => b.id === selectedBody)!;

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-fadeIn pb-12">
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
            <div className="text-[10px] font-mono text-purple-400 uppercase tracking-widest">
              LABORATORIO DE PROTOTIPADO LIBRE
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100">
              Modo Creativo: Diseñá tu Robot
            </h1>
          </div>
        </div>

        <button
          onClick={handleSaveRobot}
          className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-cyan-500 hover:from-purple-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center gap-2 shadow-[0_0_15px_rgba(168,85,247,0.3)]"
        >
          <Sparkles className="w-4 h-4" /> Guardar Prototipo (+50 XP)
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Customizer controls */}
        <div className="lg:col-span-7 space-y-6">
          {/* Name input */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <label className="text-xs font-mono text-slate-300 block mb-2 uppercase">
              1. Nombre del Prototipo:
            </label>
            <input
              type="text"
              value={robotName}
              onChange={e => setRobotName(e.target.value)}
              className="w-full bg-slate-900 border border-cyan-500/40 rounded-xl px-4 py-2 text-sm font-display font-bold text-cyan-300 focus:outline-none focus:border-cyan-400"
            />
          </div>

          {/* 2. Choose Body */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase block">
              2. Elegí el Chasis / Estructura:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {BODIES.map(b => (
                <button
                  key={b.id}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setSelectedBody(b.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedBody === b.id
                      ? 'bg-cyan-950/80 border-cyan-400 shadow-[0_0_12px_rgba(6,182,212,0.3)]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{b.icon}</div>
                  <div className="text-xs font-bold text-slate-200">{b.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.type}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 3. Traction */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase block">
              3. Sistema de Tracción / Movimiento:
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {TRACTION.map(t => (
                <button
                  key={t.id}
                  onClick={() => {
                    playClickSound(soundEnabled);
                    setSelectedTraction(t.id);
                  }}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    selectedTraction === t.id
                      ? 'bg-purple-950/80 border-purple-400 shadow-[0_0_12px_rgba(168,85,247,0.3)]'
                      : 'bg-slate-900 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="text-2xl mb-1">{t.icon}</div>
                  <div className="text-xs font-bold text-slate-200">{t.name}</div>
                  <div className="text-[10px] text-slate-400 font-mono mt-0.5">{t.speed}</div>
                </button>
              ))}
            </div>
          </div>

          {/* 4. Sensors multi-select */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase block">
              4. Sensores Instalados ({selectedSensors.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {SENSORS.map(s => {
                const isSelected = selectedSensors.includes(s.id);
                return (
                  <button
                    key={s.id}
                    onClick={() => toggleSensor(s.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-emerald-950/70 border-emerald-400 text-emerald-100'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xl">{s.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{s.name}</div>
                      <div className="text-[10px] text-slate-400">{s.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* 5. Actuators multi-select */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 space-y-3">
            <span className="text-xs font-mono text-slate-300 uppercase block">
              5. Actuadores y Herramientas ({selectedActuators.length}):
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {ACTUATORS.map(a => {
                const isSelected = selectedActuators.includes(a.id);
                return (
                  <button
                    key={a.id}
                    onClick={() => toggleActuator(a.id)}
                    className={`p-2.5 rounded-xl border text-left flex items-start gap-2.5 transition-all ${
                      isSelected
                        ? 'bg-amber-950/70 border-amber-400 text-amber-100'
                        : 'bg-slate-900 border-slate-800 text-slate-400'
                    }`}
                  >
                    <span className="text-xl">{a.icon}</span>
                    <div>
                      <div className="text-xs font-bold">{a.name}</div>
                      <div className="text-[10px] text-slate-400">{a.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right: Robot Preview & Free Arena Test */}
        <div className="lg:col-span-5 space-y-6">
          {/* Visual card */}
          <div className="p-5 rounded-2xl bg-[#040814] border border-cyan-500/40 text-center relative overflow-hidden">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1">
              FICHA TÉCNICA DEL PROTOTIPO
            </div>
            <h2 className="text-xl font-display font-bold text-slate-100 mb-4">{robotName}</h2>

            {/* Graphic robot representation */}
            <div className="w-32 h-32 mx-auto rounded-2xl bg-gradient-to-br from-cyan-950 to-purple-950 border-2 border-cyan-400/60 flex items-center justify-center text-6xl shadow-[0_0_30px_rgba(6,182,212,0.3)]">
              {chosenBodyObj.icon}
            </div>

            <div className="grid grid-cols-2 gap-2 mt-4 text-left text-xs font-mono">
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">CHASIS:</span>
                <span className="text-cyan-300 font-bold">{chosenBodyObj.name}</span>
              </div>
              <div className="p-2 rounded bg-slate-900/80 border border-slate-800">
                <span className="text-slate-500 block text-[10px]">TRACCIÓN:</span>
                <span className="text-purple-300 font-bold">{TRACTION.find(t => t.id === selectedTraction)?.name}</span>
              </div>
            </div>
          </div>

          {/* Free Arena Track */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800">
            <span className="text-xs font-mono text-slate-300 uppercase block mb-2">
              PISTA LIBRE DE PRUEBAS (5x5):
            </span>

            <div className="grid grid-cols-5 gap-1.5 w-full aspect-square max-w-[280px] mx-auto bg-[#030712] p-2 rounded-xl cyber-grid border border-slate-800">
              {Array.from({ length: 25 }).map((_, i) => {
                const x = i % 5;
                const y = Math.floor(i / 5);
                const isRobot = testPos.x === x && testPos.y === y;

                return (
                  <div
                    key={i}
                    className={`rounded flex items-center justify-center transition-all ${
                      isRobot
                        ? 'bg-cyan-950 border border-cyan-400 shadow-[0_0_10px_#00f0ff]'
                        : 'bg-slate-900/30 border border-slate-800'
                    }`}
                  >
                    {isRobot && <span className="text-2xl">{chosenBodyObj.icon}</span>}
                  </div>
                );
              })}
            </div>

            {/* Track Remote Pad */}
            <div className="grid grid-cols-3 gap-2 max-w-[180px] mx-auto mt-4">
              <div />
              <button
                onClick={() => moveInTrack(0, -1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-bold border border-slate-700"
              >
                ▲
              </button>
              <div />
              <button
                onClick={() => moveInTrack(-1, 0)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-bold border border-slate-700"
              >
                ◀
              </button>
              <button
                onClick={() => moveInTrack(0, 1)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-bold border border-slate-700"
              >
                ▼
              </button>
              <button
                onClick={() => moveInTrack(1, 0)}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-cyan-300 rounded font-bold border border-slate-700"
              >
                ▶
              </button>
            </div>

            <div className="mt-3 text-[11px] font-mono text-cyan-300 text-center">
              {actionLog}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
