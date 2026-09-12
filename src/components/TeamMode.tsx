import { useState, useEffect } from 'react';
import { UserProgress } from '../types';
import { playClickSound, playSuccessSound, playSoftErrorSound } from '../utils/audio';
import { ArrowLeft, Users, Timer, CheckCircle2, Play, Pause, RotateCcw, Award, Flag } from 'lucide-react';

interface TeamModeProps {
  progress: UserProgress;
  soundEnabled: boolean;
  onBack: () => void;
}

interface TeamMission {
  id: string;
  title: string;
  category: string;
  badge: string;
  description: string;
  roles: { role: string; task: string }[];
  stepsToCoordinate: string[];
}

const MISSIONS: TeamMission[] = [
  {
    id: 'rescate',
    title: 'Misión 1: Rescate en Zona de Desastre',
    category: 'Misión de Emergencia',
    badge: '🚨',
    description: 'Un sensor detectó una fuga térmica en la planta de energía. El robot debe localizar al personal y guiarlo a la zona segura.',
    roles: [
      { role: 'Piloto / Navegador', task: 'Traza la ruta más corta en el mapa evitando zonas calientes.' },
      { role: 'Especialista en Sensores', task: 'Monitorea el sensor de temperatura y avisa si supera 45°C.' },
      { role: 'Programador de Bloques', task: 'Ensambla los comandos de avance y retroceso en el simulador.' },
      { role: 'Líder de Seguridad', task: 'Registra los intentos y supervisa el tiempo de rescate.' },
    ],
    stepsToCoordinate: [
      'Calibrar sensor térmico para detectar umbrales de riesgo.',
      'Definir ruta de aproximación sin colisiones.',
      'Activar señal acústica y lumínica de evacuación.',
      'Regresar a la zona de descontaminación.',
    ],
  },
  {
    id: 'exploracion',
    title: 'Misión 2: Exploración Planetaria Marciana',
    category: 'Misión Científica',
    badge: '🪐',
    description: 'Explorar un cráter con visibilidad reducida, tomar 3 muestras geológicas y transmitirlas a la nave nodriza.',
    roles: [
      { role: 'Geólogo Digital', task: 'Identifica las coordenadas de los minerales de mayor valor científico.' },
      { role: 'Operador de Brazo', task: 'Calcula la fuerza y apertura de la pinza para no quebrar las muestras.' },
      { role: 'Telecomunicaciones', task: 'Verifica la señal del transmisor antes de cada movimiento.' },
      { role: 'Cronometrador', task: 'Supervisa la reserva de batería del rover.' },
    ],
    stepsToCoordinate: [
      'Encender cámara y mapear el terreno con el sensor de ultrasonido.',
      'Posicionarse exactamente frente a la primera roca.',
      'Cerrar pinza robótica con torque controlado.',
      'Depositar la muestra en el compartimento presurizado.',
    ],
  },
  {
    id: 'transporte',
    title: 'Misión 3: Transporte de Energía Frágil',
    category: 'Logística de Precisión',
    badge: '⚡',
    description: 'Llevar 2 núcleos de fusión estables a través de una pista con pendientes y curvas cerradas sin aceleraciones bruscas.',
    roles: [
      { role: 'Especialista en Motores', task: 'Limita la velocidad máxima para evitar derrapes e inercia.' },
      { role: 'Inspector de Ruta', task: 'Advierte los cambios de rasante y curvas de 90°.' },
      { role: 'Control de Calidad', task: 'Verifica la estabilidad de la carga cada 10 segundos.' },
      { role: 'Capitán de Equipo', task: 'Coordina la comunicación sincronizada entre todos los miembros.' },
    ],
    stepsToCoordinate: [
      'Enganchar el módulo de carga con el actuador magnético.',
      'Avanzar a velocidad reducida en el tramo irregular.',
      'Frenar progresivamente a 10 cm de la terminal de descarga.',
      'Desconectar el electroimán y certificar la entrega.',
    ],
  },
];

export function TeamMode({ progress, soundEnabled, onBack }: TeamModeProps) {
  const [teamName, setTeamName] = useState('EQUIPO TITANES 3° B');
  const [selectedMission, setSelectedMission] = useState<TeamMission>(MISSIONS[0]);
  const [attempts, setAttempts] = useState<number>(1);

  // Timer states
  const [timerSeconds, setTimerSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);
  const [completedMissions, setCompletedMissions] = useState<string[]>([]);

  useEffect(() => {
    let interval: any = null;
    if (isTimerRunning) {
      interval = setInterval(() => {
        setTimerSeconds(s => s + 1);
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const toggleTimer = () => {
    playClickSound(soundEnabled);
    setIsTimerRunning(!isTimerRunning);
  };

  const resetTimer = () => {
    playClickSound(soundEnabled);
    setIsTimerRunning(false);
    setTimerSeconds(0);
  };

  const handleFinishMission = () => {
    playSuccessSound(soundEnabled);
    setIsTimerRunning(false);
    if (!completedMissions.includes(selectedMission.id)) {
      setCompletedMissions([...completedMissions, selectedMission.id]);
    }
  };

  const formatTime = (total: number) => {
    const mins = Math.floor(total / 60);
    const secs = total % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-fadeIn pb-12">
      {/* Top Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-950/80 border border-slate-800">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan-400 text-slate-300 hover:text-cyan-300"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest">
              DINÁMICA COLABORATIVA DE AULA
            </div>
            <h1 className="text-xl sm:text-2xl font-display font-bold text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6 text-cyan-400" />
              <span>Modo Desafío en Equipo</span>
            </h1>
          </div>
        </div>

        {/* Team Name badge */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-mono">Equipo:</span>
          <input
            type="text"
            value={teamName}
            onChange={e => setTeamName(e.target.value)}
            className="bg-slate-900 border border-cyan-500/40 rounded-lg px-3 py-1 text-xs font-mono font-bold text-cyan-300"
          />
        </div>
      </div>

      {/* Mission Selectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {MISSIONS.map(m => {
          const isSelected = selectedMission.id === m.id;
          const isDone = completedMissions.includes(m.id);
          return (
            <button
              key={m.id}
              onClick={() => {
                playClickSound(soundEnabled);
                setSelectedMission(m);
                setIsTimerRunning(false);
                setTimerSeconds(0);
              }}
              className={`p-4 rounded-2xl border text-left transition-all ${
                isSelected
                  ? 'bg-cyan-950/70 border-cyan-400 shadow-[0_0_15px_rgba(6,182,212,0.25)]'
                  : 'bg-slate-950 border-slate-800 hover:border-slate-700'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-2xl">{m.badge}</span>
                {isDone && (
                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-bold">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Lograda
                  </span>
                )}
              </div>
              <div className="text-[10px] font-mono text-cyan-400 uppercase">{m.category}</div>
              <div className="text-sm font-bold text-slate-100 mt-0.5">{m.title}</div>
            </button>
          );
        })}
      </div>

      {/* Active Mission Details & Team Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Mission brief and Roles distribution */}
        <div className="lg:col-span-7 space-y-4">
          <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 space-y-4">
            <div>
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block">
                OBJETIVO DE LA MISIÓN:
              </span>
              <p className="text-sm text-slate-200 mt-1 font-medium leading-relaxed">
                {selectedMission.description}
              </p>
            </div>

            {/* Roles for students */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-cyan-400 uppercase tracking-wider block mb-2">
                ROLES ASIGNADOS EN EL EQUIPO (PLANIFICACIÓN PREVIA):
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                {selectedMission.roles.map((r, i) => (
                  <div key={i} className="p-2.5 rounded-xl bg-slate-900 border border-slate-800">
                    <div className="text-xs font-bold text-cyan-300 font-mono">
                      👤 {r.role}
                    </div>
                    <div className="text-[11px] text-slate-400 mt-0.5">
                      {r.task}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Checklist of steps */}
            <div className="pt-3 border-t border-slate-800">
              <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-2">
                PASOS DE COORDINACIÓN:
              </span>
              <ul className="space-y-1.5">
                {selectedMission.stepsToCoordinate.map((step, idx) => (
                  <li key={idx} className="text-xs text-slate-300 flex items-center gap-2">
                    <span className="w-4 h-4 rounded-full bg-cyan-950 border border-cyan-500/40 text-cyan-300 text-[10px] flex items-center justify-center font-mono">
                      {idx + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* Right: Team Stopwatch & Attempt tracker */}
        <div className="lg:col-span-5 space-y-4">
          {/* Stopwatch widget */}
          <div className="p-5 rounded-2xl bg-[#040814] border border-cyan-500/40 text-center relative overflow-hidden cyber-grid">
            <div className="text-[10px] font-mono text-cyan-400 uppercase tracking-widest mb-1 flex items-center justify-center gap-1.5">
              <Timer className="w-3.5 h-3.5" />
              <span>CRONÓMETRO DE EQUIPO</span>
            </div>

            <div className="text-4xl sm:text-5xl font-mono font-bold text-cyan-300 tracking-wider py-4 text-glow">
              {formatTime(timerSeconds)}
            </div>

            <div className="flex items-center justify-center gap-2">
              <button
                onClick={toggleTimer}
                className={`px-4 py-2 rounded-xl text-xs font-bold font-display uppercase tracking-wider flex items-center gap-1.5 ${
                  isTimerRunning
                    ? 'bg-amber-600 hover:bg-amber-500 text-slate-950'
                    : 'bg-cyan-500 hover:bg-cyan-400 text-slate-950'
                }`}
              >
                {isTimerRunning ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                <span>{isTimerRunning ? 'Pausar' : 'Iniciar'}</span>
              </button>

              <button
                onClick={resetTimer}
                className="p-2 rounded-xl bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300"
                title="Reiniciar cronómetro"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Iteration / Attempts counter */}
          <div className="p-4 rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="text-xs font-bold text-slate-200">Registro de Intentos:</div>
              <div className="text-[11px] text-slate-400 font-mono">
                "El error es parte del aprendizaje"
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setAttempts(Math.max(1, attempts - 1))}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold"
              >
                -
              </button>
              <span className="w-10 text-center font-mono font-bold text-cyan-300 text-base">
                {attempts}
              </span>
              <button
                onClick={() => setAttempts(attempts + 1)}
                className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 text-slate-300 font-bold"
              >
                +
              </button>
            </div>
          </div>

          {/* Complete Mission button */}
          <button
            onClick={handleFinishMission}
            className="w-full py-3.5 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-display font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(16,185,129,0.3)]"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>CERTIFICAR MISIÓN DEL EQUIPO</span>
          </button>
        </div>
      </div>
    </div>
  );
}
