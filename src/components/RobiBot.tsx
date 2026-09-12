import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { playClickSound, playSensorPing } from '../utils/audio';

export type RobotMood = 'idle' | 'happy' | 'thinking' | 'confused' | 'detecting' | 'celebrate' | 'moving';

interface RobiBotProps {
  mood?: RobotMood;
  message?: string;
  size?: 'sm' | 'md' | 'lg';
  soundEnabled?: boolean;
  className?: string;
}

export function RobiBot({
  mood = 'idle',
  message,
  size = 'md',
  soundEnabled = true,
  className = '',
}: RobiBotProps) {
  const [internalMessage, setInternalMessage] = useState<string | null>(message || null);
  const [antennaGlow, setAntennaGlow] = useState(false);

  useEffect(() => {
    setInternalMessage(message || null);
  }, [message]);

  const handlePoke = () => {
    playSensorPing(soundEnabled);
    setAntennaGlow(true);
    setTimeout(() => setAntennaGlow(false), 500);
    const friendlyQuotes = [
      '¡Sistema activo y listo!',
      '¿Probamos un nuevo algoritmo?',
      '¡El error nos enseña cómo mejorar!',
      '¡Sensores al 100% de calibración!',
      '¡Avanzar paso a paso es la clave!',
    ];
    setInternalMessage(friendlyQuotes[Math.floor(Math.random() * friendlyQuotes.length)]);
  };

  const dimensions = {
    sm: { w: 90, h: 100, text: 'text-xs' },
    md: { w: 140, h: 160, text: 'text-sm' },
    lg: { w: 200, h: 220, text: 'text-base' },
  }[size];

  // Eye color and expression based on mood
  const getEyeDetails = () => {
    switch (mood) {
      case 'happy':
      case 'celebrate':
        return {
          fill: '#10b981', // emerald glow
          path: 'M 35,46 Q 45,38 55,46 M 75,46 Q 85,38 95,46', // happy curve eyes
        };
      case 'confused':
        return {
          fill: '#38bdf8', // cyan
          path: 'M 38,45 Q 45,42 52,48 M 78,48 Q 85,42 92,45', // curious squint
        };
      case 'detecting':
        return {
          fill: '#f59e0b', // amber radar
          path: 'M 45,45 A 6,6 0 1,0 45,45.1 M 85,45 A 6,6 0 1,0 85,45.1',
        };
      case 'thinking':
        return {
          fill: '#a855f7', // purple
          path: 'M 40,43 L 50,47 M 80,47 L 90,43',
        };
      default:
        return {
          fill: '#00f0ff', // tron electric cyan
          path: 'M 45,45 A 7,7 0 1,0 45,45.1 M 85,45 A 7,7 0 1,0 85,45.1',
        };
    }
  };

  const eyes = getEyeDetails();

  return (
    <div className={`relative flex flex-col items-center select-none ${className}`}>
      {/* Speech bubble */}
      <AnimatePresence>
        {internalMessage && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -5, scale: 0.9 }}
            className={`mb-3 max-w-xs px-3.5 py-2 rounded-xl bg-slate-900/90 border border-cyan-500/40 text-cyan-200 ${dimensions.text} font-medium shadow-[0_0_15px_rgba(6,182,212,0.25)] relative text-center backdrop-blur-md`}
          >
            {internalMessage}
            <div className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3 h-3 bg-slate-900 border-r border-b border-cyan-500/40 rotate-45" />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Robot SVG Container */}
      <motion.div
        animate={
          mood === 'celebrate'
            ? { y: [0, -14, 0, -8, 0], rotate: [0, -4, 4, -2, 0] }
            : mood === 'thinking'
            ? { rotate: [0, 2, -2, 0] }
            : mood === 'moving'
            ? { x: [-3, 3, -3], y: [0, -2, 0] }
            : { y: [0, -4, 0] }
        }
        transition={{
          repeat: Infinity,
          duration: mood === 'celebrate' ? 1.2 : 3,
          ease: 'easeInOut',
        }}
        onClick={handlePoke}
        className="cursor-pointer group relative"
        title="¡Hacé clic sobre ROBI para interactuar!"
      >
        <svg
          width={dimensions.w}
          height={dimensions.h}
          viewBox="0 0 130 150"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="drop-shadow-[0_0_12px_rgba(6,182,212,0.45)] transition-transform group-hover:scale-105"
        >
          {/* Antenna */}
          <line x1="65" y1="26" x2="65" y2="12" stroke="#00f0ff" strokeWidth="3" strokeLinecap="round" />
          <circle
            cx="65"
            cy="10"
            r={antennaGlow ? '6' : '4'}
            fill={antennaGlow || mood === 'celebrate' ? '#10b981' : '#00f0ff'}
            className="transition-all duration-300"
          />
          {antennaGlow && (
            <circle cx="65" cy="10" r="10" stroke="#00f0ff" strokeWidth="1.5" opacity="0.6" />
          )}

          {/* Head */}
          <rect
            x="20"
            y="26"
            width="90"
            height="46"
            rx="14"
            fill="#0b1329"
            stroke="#00f0ff"
            strokeWidth="2.5"
          />
          {/* Visor Screen */}
          <rect
            x="27"
            y="33"
            width="76"
            height="32"
            rx="8"
            fill="#040814"
            stroke="#00f0ff"
            strokeWidth="1"
            strokeOpacity="0.5"
          />

          {/* Visor Grid / Scanlines */}
          <line x1="28" y1="41" x2="102" y2="41" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="28" y1="49" x2="102" y2="49" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" />
          <line x1="28" y1="57" x2="102" y2="57" stroke="#00f0ff" strokeWidth="0.5" strokeOpacity="0.2" />

          {/* Ears / Side Sensors */}
          <rect x="13" y="38" width="7" height="22" rx="3" fill="#00f0ff" fillOpacity="0.7" />
          <rect x="110" y="38" width="7" height="22" rx="3" fill="#00f0ff" fillOpacity="0.7" />

          {/* Digital Eyes */}
          {mood === 'happy' || mood === 'celebrate' || mood === 'confused' || mood === 'thinking' ? (
            <path
              d={eyes.path}
              stroke={eyes.fill}
              strokeWidth="4"
              strokeLinecap="round"
              fill="none"
              className="drop-shadow-[0_0_8px_currentColor]"
            />
          ) : (
            <g>
              <circle cx="45" cy="48" r="6.5" fill={eyes.fill} className="drop-shadow-[0_0_8px_#00f0ff]" />
              <circle cx="47" cy="46" r="2" fill="#ffffff" />
              <circle cx="85" cy="48" r="6.5" fill={eyes.fill} className="drop-shadow-[0_0_8px_#00f0ff]" />
              <circle cx="87" cy="46" r="2" fill="#ffffff" />
            </g>
          )}

          {/* Small mouth LED bar */}
          <rect
            x="53"
            y="58"
            width="24"
            height="3"
            rx="1.5"
            fill={mood === 'happy' || mood === 'celebrate' ? '#10b981' : '#00f0ff'}
            fillOpacity="0.8"
          />

          {/* Neck joint */}
          <rect x="57" y="72" width="16" height="6" rx="2" fill="#1e293b" stroke="#00f0ff" strokeWidth="1" />

          {/* Torso / Body */}
          <rect
            x="24"
            y="78"
            width="82"
            height="52"
            rx="12"
            fill="#091124"
            stroke="#00f0ff"
            strokeWidth="2.5"
          />

          {/* Chest Circuit Pattern */}
          <path
            d="M 38,90 L 50,90 L 58,98 L 72,98 L 80,90 L 92,90"
            stroke="#a855f7"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <circle cx="65" cy="112" r="10" fill="#040814" stroke="#00f0ff" strokeWidth="1.5" />
          <polygon
            points="65,106 70,115 60,115"
            fill={mood === 'celebrate' ? '#10b981' : '#00f0ff'}
            className="animate-pulse"
          />

          {/* Arms */}
          <g>
            <rect x="11" y="84" width="12" height="28" rx="6" fill="#0b1329" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="17" cy="115" r="4" fill="#a855f7" />
          </g>
          <g>
            <rect x="107" y="84" width="12" height="28" rx="6" fill="#0b1329" stroke="#00f0ff" strokeWidth="1.5" />
            <circle cx="113" cy="115" r="4" fill="#a855f7" />
          </g>

          {/* Bottom Hover Thruster / Tread */}
          <rect
            x="36"
            y="130"
            width="58"
            height="10"
            rx="5"
            fill="#1e293b"
            stroke="#00f0ff"
            strokeWidth="1.5"
          />
          {/* Energy beam under base */}
          <ellipse cx="65" cy="144" rx="22" ry="4" fill="#00f0ff" fillOpacity="0.4" className="animate-pulse" />
        </svg>
      </motion.div>
    </div>
  );
}
