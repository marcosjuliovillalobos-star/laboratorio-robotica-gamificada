import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound, playSensorPing } from '../../utils/audio';
import { Sun, Moon, Volume2, Ruler, CheckCircle2, ShieldAlert, Sparkles, Sliders } from 'lucide-react';

interface Level7Props {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

type SensorTab = 'luz' | 'sonido' | 'distancia';

export function Level7SensorsLab({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: Level7Props) {
  const [activeTab, setActiveTab] = useState<SensorTab>('luz');
  const [solvedSensors, setSolvedSensors] = useState<SensorTab[]>([]);

  // 1. Light sensor state
  const [lightLevel, setLightLevel] = useState<number>(30); // 0 (dark) to 100 (bright)
  const [lightThreshold, setLightThreshold] = useState<number>(40);
  const isLedOn = lightLevel < lightThreshold;

  // 2. Sound sensor state
  const [soundDb, setSoundDb] = useState<number>(50); // 20dB to 100dB
  const [soundThreshold, setSoundThreshold] = useState<number>(75);
  const isAlarmTriggered = soundDb >= soundThreshold;

  // 3. Distance sensor state
  const [distanceCm, setDistanceCm] = useState<number>(30); // 50cm to 5cm
  const [stopThreshold, setStopThreshold] = useState<number>(15);
  const isBrakeActive = distanceCm <= stopThreshold;

  const [robotMood, setRobotMood] = useState<RobotMood>('detecting');
  const [robotMessage, setRobotMessage] = useState('¡Bienvenidos a la Sala de Sensores! Calibrá los 3 bancos de prueba para completar la misión.');

  const checkCompletion = (sensor: SensorTab) => {
    if (!solvedSensors.includes(sensor)) {
      const updated = [...solvedSensors, sensor];
      setSolvedSensors(updated);
      if (updated.length === 3) {
        playSuccessSound(soundEnabled);
        setRobotMood('celebrate');
        setRobotMessage('🎉 ¡FELICITACIONES! Has calibrado con éxito los tres sensores esenciales de la robótica.');
        onComplete();
      }
    }
  };

  // Sound test button
  const triggerSoundSample = (db: number, label: string) => {
    playSensorPing(soundEnabled);
    setSoundDb(db);
    if (db >= soundThreshold) {
      if (label === 'aplauso' && soundThreshold > 55 && soundThreshold < 85) {
        playSuccessSound(soundEnabled);
        setRobotMood('happy');
        setRobotMessage('¡Punto justo calibrado! El aplauso activó la alarma y una conversación normal no.');
        checkCompletion('sonido');
      }
    }
  };

  const hints = [
    'Sensor de Luz: Deslizá la luz hacia la noche (< 40%) para ver encenderse el LED de alumbrado público.',
    'Sensor de Sonido: Ajustá el umbral alrededor de 70 dB para que un aplauso (85 dB) lo active pero una charla (50 dB) no.',
    'Sensor de Distancia: Seleccioná un umbral de parada entre 15cm y 20cm para que el robot frene seguro sin chocar la pared.',
  ];

  return (
    <ActivityShell
      title="Nivel 7 — Sala Interactiva de Sensores"
      levelNumber={7}
      axis="Eje 3: Construcción y Programación"
      objective="Experimentá y calibrá los 3 sensores fundamentales: Luz (LDR), Sonido (Micrófono) y Distancia (Ultrasonido)."
      howTo="Usá los controles deslizantes en cada pestaña para encontrar el punto óptimo de calibración y verificar el comportamiento del robot."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={() => {
        setLightLevel(30);
        setSoundDb(50);
        setDistanceCm(30);
      }}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-6">
        {/* Sensor tabs navigation */}
        <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-3">
          {[
            { id: 'luz', label: '💡 SENSOR DE LUZ (LDR)', color: 'text-amber-400' },
            { id: 'sonido', label: '🔊 SENSOR DE SONIDO', color: 'text-cyan-400' },
            { id: 'distancia', label: '📏 SENSOR DE DISTANCIA', color: 'text-purple-400' },
          ].map(tab => {
            const isSolved = solvedSensors.includes(tab.id as SensorTab);
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  playClickSound(soundEnabled);
                  setActiveTab(tab.id as SensorTab);
                }}
                className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-display font-bold uppercase tracking-wider flex items-center gap-2 transition-all border ${
                  isActive
                    ? 'bg-cyan-950 border-cyan-400 text-cyan-200 shadow-[0_0_15px_rgba(6,182,212,0.3)]'
                    : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                }`}
              >
                {isSolved && <CheckCircle2 className="w-4 h-4 text-emerald-400" />}
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        {/* 1. Light Sensor Lab */}
        {activeTab === 'luz' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual simulation room */}
            <div className="lg:col-span-6 p-6 rounded-2xl border border-amber-500/30 transition-colors flex flex-col items-center justify-center relative overflow-hidden"
                 style={{
                   backgroundColor: `rgba(4, 8, 20, ${1 - lightLevel / 150})`,
                 }}
            >
              <div className="text-xs font-mono text-amber-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                {lightLevel > 50 ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-sky-400" />}
                <span>AMBIENTE: {lightLevel > 50 ? 'DÍA (ILUMINADO)' : 'NOCHE (OSCURIDAD)'} ({lightLevel}% LUX)</span>
              </div>

              {/* Streetlamp / LED bulb visual */}
              <div className="relative flex flex-col items-center py-6">
                <div
                  className={`w-20 h-20 rounded-full flex items-center justify-center text-4xl transition-all duration-500 border-2 ${
                    isLedOn
                      ? 'bg-amber-400/90 border-amber-200 text-slate-950 shadow-[0_0_50px_rgba(251,191,36,0.9)] scale-110'
                      : 'bg-slate-800 border-slate-700 text-slate-600 opacity-60'
                  }`}
                >
                  💡
                </div>
                <div className="w-4 h-16 bg-slate-700 mt-1 rounded-sm" />
                <div className="w-16 h-3 bg-slate-800 rounded-md" />
              </div>

              <div className={`mt-3 text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                isLedOn
                  ? 'bg-amber-950/80 border-amber-400 text-amber-200'
                  : 'bg-slate-900 border-slate-700 text-slate-400'
              }`}>
                ACTUADOR: {isLedOn ? 'ENCENDIDO (Poca luz detectada)' : 'APAGADO (Hay suficiente luz natural)'}
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Luz Ambiental (Simulación Día/Noche):</span>
                    <span className="text-amber-300 font-bold">{lightLevel}%</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={lightLevel}
                    onChange={e => {
                      setLightLevel(Number(e.target.value));
                      if (Number(e.target.value) < lightThreshold) {
                        checkCompletion('luz');
                      }
                    }}
                    className="w-full accent-amber-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>0% (Oscuridad total)</span>
                    <span>100% (Mediodía soleado)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Umbral de Activación del Sensor LDR:</span>
                    <span className="text-cyan-300 font-bold">{lightThreshold}%</span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="80"
                    value={lightThreshold}
                    onChange={e => setLightThreshold(Number(e.target.value))}
                    className="w-full accent-cyan-400 cursor-pointer"
                  />
                </div>

                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-xs text-slate-300 font-mono">
                  <strong>REGLA:</strong> SI luz &lt; {lightThreshold}% → ENCENDER LED. SI NO → APAGAR LED.
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    playSuccessSound(soundEnabled);
                    checkCompletion('luz');
                  }}
                  className="px-5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(245,158,11,0.3)]"
                >
                  Confirmar Calibración de Luz
                </button>
              </div>
            </div>
          </div>
        )}

        {/* 2. Sound Sensor Lab */}
        {activeTab === 'sonido' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual simulation stage */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-cyan-500/30 flex flex-col items-center justify-center relative">
              <div className="text-xs font-mono text-cyan-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Volume2 className="w-4 h-4" />
                <span>SONÓMETRO VIRTUAL • {soundDb} dB</span>
              </div>

              {/* Siren Visual */}
              <div className={`w-28 h-28 rounded-2xl flex items-center justify-center text-5xl transition-all duration-300 border-2 ${
                isAlarmTriggered
                  ? 'bg-rose-950 border-rose-400 shadow-[0_0_40px_rgba(244,63,94,0.8)] animate-pulse'
                  : 'bg-slate-900 border-slate-800 opacity-60'
              }`}>
                {isAlarmTriggered ? '🚨' : '🔇'}
              </div>

              {/* Decibels VU Meter Bar */}
              <div className="w-full max-w-xs mt-6 space-y-1">
                <div className="flex justify-between text-[11px] font-mono text-slate-400">
                  <span>Nivel captado:</span>
                  <span className={soundDb >= soundThreshold ? 'text-rose-400 font-bold' : 'text-cyan-300'}>
                    {soundDb} dB
                  </span>
                </div>
                <div className="w-full bg-slate-900 h-4 rounded-full overflow-hidden border border-slate-800 p-0.5 relative">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      soundDb >= soundThreshold
                        ? 'bg-gradient-to-r from-cyan-500 via-amber-400 to-rose-500'
                        : 'bg-gradient-to-r from-cyan-500 to-sky-400'
                    }`}
                    style={{ width: `${Math.min(100, (soundDb / 100) * 100)}%` }}
                  />
                  {/* Threshold marker line */}
                  <div
                    className="absolute top-0 bottom-0 w-1 bg-white shadow-[0_0_6px_#fff]"
                    style={{ left: `${soundThreshold}%` }}
                    title={`Umbral: ${soundThreshold} dB`}
                  />
                </div>
              </div>

              <div className="mt-4 text-xs font-mono text-slate-400">
                Alarma: <span className={isAlarmTriggered ? 'text-rose-400 font-bold' : 'text-emerald-400'}>{isAlarmTriggered ? 'ACTIVADA' : 'EN ESPERA'}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <span className="text-xs font-mono text-slate-300 block">
                  PROBAR SONIDOS DE PRUEBA:
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => triggerSoundSample(25, 'silencio')}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-300 text-center"
                  >
                    <div>🤫 Silencio</div>
                    <div className="text-[10px] text-slate-500">25 dB</div>
                  </button>

                  <button
                    onClick={() => triggerSoundSample(50, 'charla')}
                    className="p-2.5 rounded-lg bg-slate-900 border border-slate-700 hover:border-slate-500 text-xs font-mono text-slate-300 text-center"
                  >
                    <div>💬 Charla</div>
                    <div className="text-[10px] text-slate-500">50 dB</div>
                  </button>

                  <button
                    onClick={() => triggerSoundSample(85, 'aplauso')}
                    className="p-2.5 rounded-lg bg-cyan-950 border border-cyan-500/60 hover:border-cyan-400 text-xs font-mono text-cyan-200 text-center shadow-[0_0_10px_rgba(6,182,212,0.2)]"
                  >
                    <div>👏 Aplauso</div>
                    <div className="text-[10px] text-cyan-400 font-bold">85 dB</div>
                  </button>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Umbral de Disparo de Alarma:</span>
                    <span className="text-rose-400 font-bold">{soundThreshold} dB</span>
                  </div>
                  <input
                    type="range"
                    min="35"
                    max="95"
                    value={soundThreshold}
                    onChange={e => setSoundThreshold(Number(e.target.value))}
                    className="w-full accent-rose-500 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    Objetivo: Calibrar el umbral para que el aplauso (85dB) active la alarma, pero la charla normal (50dB) no.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* 3. Distance Sensor Lab */}
        {activeTab === 'distancia' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Visual simulation stage */}
            <div className="lg:col-span-6 p-6 rounded-2xl bg-slate-950 border border-purple-500/30 flex flex-col items-center justify-center relative cyber-grid">
              <div className="text-xs font-mono text-purple-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <Ruler className="w-4 h-4" />
                <span>TELEMETRÍA ULTRASÓNICA • {distanceCm} cm</span>
              </div>

              {/* Corridor with wall and robot */}
              <div className="w-full max-w-sm h-32 bg-[#040814] rounded-xl border border-slate-800 relative flex items-center overflow-hidden px-4">
                {/* Robot */}
                <div
                  className="absolute text-3xl transition-all duration-300"
                  style={{
                    left: `${Math.max(10, Math.min(260, (50 - distanceCm) * 6))}px`,
                  }}
                >
                  🤖
                </div>

                {/* Ultrasonic pulse waves */}
                <div
                  className="absolute text-cyan-400/80 font-mono text-xs font-bold pointer-events-none"
                  style={{
                    left: `${Math.max(45, (50 - distanceCm) * 6 + 35)}px`,
                  }}
                >
                  &gt;&gt;&gt; {distanceCm} cm &gt;&gt;&gt;
                </div>

                {/* Brick wall */}
                <div className="absolute right-0 top-0 bottom-0 w-8 bg-amber-900/60 border-l-2 border-amber-600 flex flex-col justify-around py-1">
                  <div className="h-1 bg-amber-950" />
                  <div className="h-1 bg-amber-950" />
                  <div className="h-1 bg-amber-950" />
                </div>
              </div>

              {/* Status */}
              <div className="mt-4 flex items-center gap-3">
                <span className="text-xs font-mono text-slate-400">Freno Automático:</span>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border ${
                  isBrakeActive
                    ? 'bg-rose-950 border-rose-500 text-rose-300'
                    : 'bg-emerald-950 border-emerald-500 text-emerald-300'
                }`}>
                  {isBrakeActive ? '🛑 FRENO ACTIVO (Distancia límite)' : '⚡ AVANCE SEGURO'}
                </span>
              </div>
            </div>

            {/* Controls */}
            <div className="lg:col-span-6 space-y-4">
              <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-4">
                <div>
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>Distancia del Robot a la Pared:</span>
                    <span className="text-purple-300 font-bold">{distanceCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="50"
                    value={distanceCm}
                    onChange={e => setDistanceCm(Number(e.target.value))}
                    className="w-full accent-purple-400 cursor-pointer"
                  />
                  <div className="flex justify-between text-[10px] font-mono text-slate-500 mt-1">
                    <span>5 cm (Peligro de choque)</span>
                    <span>30 cm</span>
                    <span>50 cm (Lejos)</span>
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-800">
                  <div className="flex justify-between text-xs font-mono text-slate-300 mb-1.5">
                    <span>¿A qué distancia de seguridad debe frenar?:</span>
                    <span className="text-emerald-400 font-bold">{stopThreshold} cm</span>
                  </div>
                  <input
                    type="range"
                    min="8"
                    max="30"
                    value={stopThreshold}
                    onChange={e => {
                      const val = Number(e.target.value);
                      setStopThreshold(val);
                      if (val >= 15 && val <= 22) {
                        checkCompletion('distancia');
                      }
                    }}
                    className="w-full accent-emerald-400 cursor-pointer"
                  />
                  <span className="text-[11px] text-slate-400 mt-1 block">
                    💡 En robótica escolar se recomienda frenar entre 15 y 20 cm para evitar que la inercia golpee la pared.
                  </span>
                </div>
              </div>

              <div className="flex justify-end">
                <button
                  onClick={() => {
                    playSuccessSound(soundEnabled);
                    checkCompletion('distancia');
                  }}
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-display font-bold text-xs uppercase tracking-wider shadow-[0_0_12px_rgba(168,85,247,0.3)]"
                >
                  Confirmar Calibración de Distancia
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </ActivityShell>
  );
}
