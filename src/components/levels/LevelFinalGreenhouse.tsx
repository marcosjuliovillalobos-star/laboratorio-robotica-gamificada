import { useState } from 'react';
import { ActivityShell } from '../ActivityShell';
import { RobotMood } from '../RobiBot';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../../utils/audio';
import { Droplet, Wind, Sun, CheckCircle2, Play, Sparkles, RefreshCw } from 'lucide-react';

interface LevelFinalProps {
  isCompleted: boolean;
  soundEnabled: boolean;
  onComplete: () => void;
  onNext: () => void;
  onBackToLevels: () => void;
}

export function LevelFinalGreenhouse({
  isCompleted,
  soundEnabled,
  onComplete,
  onNext,
  onBackToLevels,
}: LevelFinalProps) {
  // Logic links configured by the student
  // Rule 1: Soil Humidity
  const [humiditySensorDecision, setHumiditySensorDecision] = useState<string>('activar_riego');
  // Rule 2: Temperature
  const [tempSensorDecision, setTempSensorDecision] = useState<string>('activar_ventilador');
  // Rule 3: Light
  const [lightSensorDecision, setLightSensorDecision] = useState<string>('encender_led');

  // Interactive Live Weather in Greenhouse
  const [soilMoisture, setSoilMoisture] = useState<number>(20); // 20% is dry
  const [ambientTemp, setAmbientTemp] = useState<number>(36); // 36°C is hot
  const [ambientLight, setAmbientLight] = useState<number>(15); // 15% is dim

  // Simulation Running State
  const [isSimActive, setIsSimActive] = useState<boolean>(false);
  const [simResults, setSimResults] = useState<{ irrigation: boolean; fan: boolean; light: boolean; healthy: boolean } | null>(null);

  const [robotMood, setRobotMood] = useState<RobotMood>('thinking');
  const [robotMessage, setRobotMessage] = useState('Proyecto Integrador: vinculá Sensor → Información → Decisión → Actuador para cuidar el invernadero.');

  const handleRunSimulation = () => {
    playClickSound(soundEnabled);
    setIsSimActive(true);
    setRobotMood('detecting');

    setTimeout(() => {
      // Evaluate rules against current environmental readings:
      // When soilMoisture < 30% -> Need irrigation
      // When ambientTemp > 30°C -> Need ventilation fan
      // When ambientLight < 25% -> Need grow light
      const irrigationActive = humiditySensorDecision === 'activar_riego';
      const fanActive = tempSensorDecision === 'activar_ventilador';
      const lightActive = lightSensorDecision === 'encender_led';

      const isAllOptimal = irrigationActive && fanActive && lightActive;

      setSimResults({
        irrigation: irrigationActive,
        fan: fanActive,
        light: lightActive,
        healthy: isAllOptimal,
      });

      setIsSimActive(false);

      if (isAllOptimal) {
        playSuccessSound(soundEnabled);
        setRobotMood('celebrate');
        setRobotMessage('🎉 ¡OPERACIÓN INVERNADERO EXITOSA! Los 3 actuadores respondieron con precisión a los sensores.');
        onComplete();
      } else {
        playSoftErrorSound(soundEnabled);
        setRobotMood('confused');
        setRobotMessage('“Revisá las asignaciones de cada regla: asegurate de activar el actuador que corresponde a cada problema.”');
      }
    }, 1000);
  };

  const hints = [
    'Si la tierra está seca (&lt; 30%), el robot debe encender la Bomba de Riego 💧.',
    'Si la temperatura supera los 32°C, el robot debe encender el Ventilador / Extractor 🌀.',
    'Si hay poca luz (&lt; 25%), el robot debe encender la Lámpara LED de cultivo 💡.',
  ];

  return (
    <ActivityShell
      title="Misión Final — Operación Invernadero (Eje 4)"
      levelNumber={10}
      axis="Eje 4: Proyecto Integrador"
      objective="Diseñá el sistema automatizado completo: vinculá cada sensor con su condición lógica y el actuador correspondiente."
      howTo="Configurá las 3 reglas lógicas (Riego, Clima, Luz). Luego pulsá 'ACTIVAR SIMULADOR EN VIVO' para ver el invernadero en acción."
      hints={hints}
      robotMood={robotMood}
      robotMessage={robotMessage}
      isCompleted={isCompleted}
      soundEnabled={soundEnabled}
      onRetry={() => {
        setSimResults(null);
      }}
      onNext={onNext}
      onBackToLevels={onBackToLevels}
    >
      <div className="space-y-6">
        {/* Greenhouse Visual Stage */}
        <div className="p-6 rounded-2xl bg-[#040814] border border-emerald-500/40 shadow-[0_0_25px_rgba(16,185,129,0.15)] relative overflow-hidden cyber-grid">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
            <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🌱 INVERNADERO AUTOMATIZADO • TELEMETRÍA AMBIENTAL</span>
            </span>
            <div className="flex items-center gap-3 text-xs font-mono">
              <span className="text-cyan-300">💧 Suelo: {soilMoisture}%</span>
              <span className="text-amber-300">🌡️ Temp: {ambientTemp}°C</span>
              <span className="text-yellow-300">☀️ Luz: {ambientLight}%</span>
            </div>
          </div>

          {/* Graphical Greenhouse Diorama */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 my-3 text-center">
            {/* Plant & Soil Box */}
            <div className={`p-4 rounded-xl border transition-all ${
              simResults?.irrigation ? 'bg-cyan-950/60 border-cyan-400' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className="text-4xl mb-2">
                {simResults?.healthy ? '🌻' : soilMoisture < 30 ? '🥀' : '🌿'}
              </div>
              <div className="text-xs font-bold text-slate-200">Suelo y Raíces</div>
              <div className="text-[11px] font-mono text-cyan-300 mt-1">
                {simResults?.irrigation ? '💧 Bomba de Riego: ACTIVA' : '⏸️ Bomba: En reposo'}
              </div>
            </div>

            {/* Climate & Vent Box */}
            <div className={`p-4 rounded-xl border transition-all ${
              simResults?.fan ? 'bg-purple-950/60 border-purple-400' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className={`text-4xl mb-2 ${simResults?.fan ? 'animate-spin' : ''}`}>
                🌀
              </div>
              <div className="text-xs font-bold text-slate-200">Ventilación y Clima</div>
              <div className="text-[11px] font-mono text-purple-300 mt-1">
                {simResults?.fan ? '💨 Extractor: ACTIVADO' : '⏸️ Extractor: En reposo'}
              </div>
            </div>

            {/* Illumination Box */}
            <div className={`p-4 rounded-xl border transition-all ${
              simResults?.light ? 'bg-amber-950/60 border-amber-400' : 'bg-slate-900/60 border-slate-800'
            }`}>
              <div className={`text-4xl mb-2 ${simResults?.light ? 'drop-shadow-[0_0_15px_#f59e0b]' : ''}`}>
                💡
              </div>
              <div className="text-xs font-bold text-slate-200">Luminaria Espectral</div>
              <div className="text-[11px] font-mono text-amber-300 mt-1">
                {simResults?.light ? '⚡ Lámparas LED: ENCENDIDAS' : '⏸️ Lámparas: Apagadas'}
              </div>
            </div>
          </div>

          {/* Status announcement */}
          {simResults && (
            <div className={`mt-4 p-3 rounded-xl border text-xs font-mono font-bold flex items-center justify-between ${
              simResults.healthy
                ? 'bg-emerald-950 border-emerald-500 text-emerald-200'
                : 'bg-rose-950 border-rose-500 text-rose-200'
            }`}>
              <span>
                {simResults.healthy
                  ? '✅ ¡CONTROL TOTAL LOGRADO! Todas las condiciones se estabilizaron.'
                  : '⚠️ ¡ALERTA! Alguna variable no fue compensada por su actuador.'}
              </span>
              <span className="uppercase text-[10px] px-2 py-0.5 rounded bg-slate-950">
                {simResults.healthy ? 'PRODUCCIÓN ÓPTIMA' : 'REQUIERE AJUSTE'}
              </span>
            </div>
          )}
        </div>

        {/* 3 Logic Connectors Builder (Sensor -> Info -> Decision -> Actuator) */}
        <div className="space-y-3">
          <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider block">
            CONSTRUCTOR DE REGLAS LÓGICAS (SENSOR → DECISIÓN → ACTUADOR):
          </span>

          {/* Rule 1 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-500/40 text-cyan-300 font-bold">
                SENSOR HUMEDAD
              </span>
              <span className="text-slate-400">→ SI Suelo &lt; 30% →</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">ORDENAR AL ACTUADOR:</span>
              <select
                value={humiditySensorDecision}
                onChange={e => setHumiditySensorDecision(e.target.value)}
                className="bg-slate-900 border border-cyan-500/50 rounded-lg px-2.5 py-1 text-cyan-300 font-bold focus:outline-none"
              >
                <option value="activar_riego">💧 Activar Bomba de Riego (Válvula)</option>
                <option value="nada">⏸️ No hacer nada</option>
                <option value="apagar_todo">🛑 Cortar energía general</option>
              </select>
            </div>
          </div>

          {/* Rule 2 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-purple-950 border border-purple-500/40 text-purple-300 font-bold">
                SENSOR TEMPERATURA
              </span>
              <span className="text-slate-400">→ SI Temperatura &gt; 32°C →</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">ORDENAR AL ACTUADOR:</span>
              <select
                value={tempSensorDecision}
                onChange={e => setTempSensorDecision(e.target.value)}
                className="bg-slate-900 border border-purple-500/50 rounded-lg px-2.5 py-1 text-purple-300 font-bold focus:outline-none"
              >
                <option value="activar_ventilador">🌀 Encender Ventilador / Extractor</option>
                <option value="nada">⏸️ Ignorar lectura térmica</option>
                <option value="activar_calefaccion">🔥 Encender calefactor</option>
              </select>
            </div>
          </div>

          {/* Rule 3 */}
          <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-mono">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded bg-amber-950 border border-amber-500/40 text-amber-300 font-bold">
                SENSOR DE LUZ
              </span>
              <span className="text-slate-400">→ SI Luz &lt; 25% (Oscuro) →</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-slate-300">ORDENAR AL ACTUADOR:</span>
              <select
                value={lightSensorDecision}
                onChange={e => setLightSensorDecision(e.target.value)}
                className="bg-slate-900 border border-amber-500/50 rounded-lg px-2.5 py-1 text-amber-300 font-bold focus:outline-none"
              >
                <option value="encender_led">💡 Encender Luces LED de Crecimiento</option>
                <option value="nada">⏸️ Dejar en oscuridad</option>
                <option value="activar_alarma">🚨 Hacer sonar la alarma</option>
              </select>
            </div>
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            disabled={isSimActive}
            onClick={handleRunSimulation}
            className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs sm:text-sm tracking-wider uppercase flex items-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.4)] disabled:opacity-40"
          >
            <Play className="w-4 h-4 fill-current" />
            <span>{isSimActive ? 'PROCESANDO SENSORES...' : 'ACTIVAR SIMULADOR EN VIVO'}</span>
          </button>
        </div>
      </div>
    </ActivityShell>
  );
}
