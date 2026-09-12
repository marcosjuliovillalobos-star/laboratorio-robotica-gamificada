import { useState, useEffect } from 'react';
import { Screen, UserProgress } from './types';
import { loadProgress, saveProgress, awardActivity, calculatePlayerLevel } from './utils/storage';
import { playClickSound, playSuccessSound, playLevelUpSound } from './utils/audio';

// Components
import { CyberNavbar } from './components/CyberNavbar';
import { MainMenu } from './components/MainMenu';
import { LevelSelector } from './components/LevelSelector';
import { AchievementsModal } from './components/AchievementsModal';
import { PedagogyGuideModal } from './components/PedagogyGuideModal';

// Levels
import { Level1Recognize } from './components/levels/Level1Recognize';
import { Level2Parts } from './components/levels/Level2Parts';
import { Level3Sequences } from './components/levels/Level3Sequences';
import { Level4Algorithms } from './components/levels/Level4Algorithms';
import { Level5Conditionals } from './components/levels/Level5Conditionals';
import { Level6BlockCoding } from './components/levels/Level6BlockCoding';
import { Level7SensorsLab } from './components/levels/Level7SensorsLab';
import { Level8AvoidObstacle } from './components/levels/Level8AvoidObstacle';
import { Level8RepairRobot } from './components/levels/Level8RepairRobot';
import { LevelFinalGreenhouse } from './components/levels/LevelFinalGreenhouse';

// Special Modes
import { CreativeMode } from './components/CreativeMode';
import { TeamMode } from './components/TeamMode';
import { TeacherMode } from './components/TeacherMode';

export default function App() {
  const [progress, setProgress] = useState<UserProgress>(() => loadProgress());
  const [currentScreen, setCurrentScreen] = useState<Screen>('menu');
  const [isAchievementsOpen, setIsAchievementsOpen] = useState(false);
  const [isGuiaOpen, setIsGuiaOpen] = useState(false);
  const [toastNotification, setToastNotification] = useState<{ title: string; subtitle: string } | null>(null);

  // Sync progress to localStorage whenever it changes
  useEffect(() => {
    saveProgress(progress);
  }, [progress]);

  const showToast = (title: string, subtitle: string) => {
    setToastNotification({ title, subtitle });
    setTimeout(() => {
      setToastNotification(null);
    }, 4000);
  };

  const handleNavigate = (screen: Screen) => {
    playClickSound(progress.soundEnabled);
    setCurrentScreen(screen);
    // Track last played level if it's a mission
    if (screen.startsWith('level_')) {
      const updated = { ...progress, lastPlayedLevel: screen };
      setProgress(updated);
    }
  };

  const handleToggleSound = () => {
    const updated = { ...progress, soundEnabled: !progress.soundEnabled };
    setProgress(updated);
    playClickSound(!progress.soundEnabled);
  };

  const handleLevelCompleted = (activitySlug: string, xpGain: number, nextLevelNum?: number) => {
    const { updated, isNew, leveledUp, newAchievements } = awardActivity(
      progress,
      activitySlug,
      xpGain,
      nextLevelNum
    );

    setProgress(updated);

    if (leveledUp) {
      playLevelUpSound(progress.soundEnabled);
      showToast('⚡ ¡SUBISTE DE NIVEL EN EL TALLER!', `Nivel ${updated.level}: ${calculatePlayerLevel(updated.xp).title}`);
    } else if (isNew) {
      playSuccessSound(progress.soundEnabled);
      showToast('🎉 ¡MISIÓN SUPERADA!', `+${xpGain} XP ganados para tu perfil de robótica.`);
    }

    if (newAchievements.length > 0) {
      setTimeout(() => {
        showToast('🏆 NUEVA INSIGNIA DESBLOQUEADA', newAchievements.join(', '));
      }, 1500);
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'menu':
        return (
          <MainMenu
            progress={progress}
            onNavigate={handleNavigate}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenDocente={() => setCurrentScreen('teacher_mode')}
            onOpenGuia={() => setIsGuiaOpen(true)}
          />
        );

      case 'levels':
        return (
          <LevelSelector
            progress={progress}
            onSelectLevel={handleNavigate}
            onBack={() => handleNavigate('menu')}
          />
        );

      // Level 1: Reconocimiento
      case 'level_1':
        return (
          <Level1Recognize
            isCompleted={progress.completedActivities.includes('level_1')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_1', 60, 2)}
            onNext={() => handleNavigate('level_2')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 2: Partes del robot
      case 'level_2':
        return (
          <Level2Parts
            isCompleted={progress.completedActivities.includes('level_2')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_2', 70, 3)}
            onNext={() => handleNavigate('level_3')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 3: Secuencias
      case 'level_3':
        return (
          <Level3Sequences
            isCompleted={progress.completedActivities.includes('level_3')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_3', 80, 4)}
            onNext={() => handleNavigate('level_4')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 4: Algoritmos
      case 'level_4':
        return (
          <Level4Algorithms
            isCompleted={progress.completedActivities.includes('level_4')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_4', 80, 5)}
            onNext={() => handleNavigate('level_5')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 5: Condicionales SI / ENTONCES
      case 'level_5':
        return (
          <Level5Conditionals
            isCompleted={progress.completedActivities.includes('level_5')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_5', 90, 6)}
            onNext={() => handleNavigate('level_6')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 6: Programación por Bloques
      case 'level_6':
        return (
          <Level6BlockCoding
            isCompleted={progress.completedActivities.includes('level_6')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_6', 100, 7)}
            onNext={() => handleNavigate('level_7')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 7: Sala de Sensores (Luz, Sonido, Distancia)
      case 'level_7':
        return (
          <Level7SensorsLab
            isCompleted={progress.completedActivities.includes('level_7')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_7', 120, 8)}
            onNext={() => handleNavigate('level_8_avoid')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 8: Juego - Evitá el obstáculo
      case 'level_8_avoid':
        return (
          <Level8AvoidObstacle
            isCompleted={progress.completedActivities.includes('level_8_avoid')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_8_avoid', 100, 9)}
            onNext={() => handleNavigate('level_8_repair')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 9: Juego - Repará el robot (Debugging)
      case 'level_8_repair':
        return (
          <Level8RepairRobot
            isCompleted={progress.completedActivities.includes('level_8_repair')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_8_repair', 110, 10)}
            onNext={() => handleNavigate('level_final_greenhouse')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Level 10: Misión Final - Operación Invernadero
      case 'level_final_greenhouse':
        return (
          <LevelFinalGreenhouse
            isCompleted={progress.completedActivities.includes('level_final_greenhouse')}
            soundEnabled={progress.soundEnabled}
            onComplete={() => handleLevelCompleted('level_final_greenhouse', 150)}
            onNext={() => handleNavigate('levels')}
            onBackToLevels={() => handleNavigate('levels')}
          />
        );

      // Specialized Modes
      case 'creative_creator':
        return (
          <CreativeMode
            progress={progress}
            soundEnabled={progress.soundEnabled}
            onUpdateProgress={setProgress}
            onBack={() => handleNavigate('menu')}
          />
        );

      case 'team_mission':
        return (
          <TeamMode
            progress={progress}
            soundEnabled={progress.soundEnabled}
            onBack={() => handleNavigate('menu')}
          />
        );

      case 'teacher_mode':
        return (
          <TeacherMode
            progress={progress}
            soundEnabled={progress.soundEnabled}
            onUpdateProgress={setProgress}
            onBack={() => handleNavigate('menu')}
          />
        );

      default:
        return (
          <MainMenu
            progress={progress}
            onNavigate={handleNavigate}
            onOpenAchievements={() => setIsAchievementsOpen(true)}
            onOpenDocente={() => setCurrentScreen('teacher_mode')}
            onOpenGuia={() => setIsGuiaOpen(true)}
          />
        );
    }
  };

  return (
    <div className="min-h-screen bg-[#030712] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top persistent navigation bar */}
      <CyberNavbar
        progress={progress}
        currentScreen={currentScreen}
        onNavigate={handleNavigate}
        onToggleSound={handleToggleSound}
        onOpenAchievements={() => setIsAchievementsOpen(true)}
        onOpenDocente={() => setCurrentScreen('teacher_mode')}
        onOpenGuia={() => setIsGuiaOpen(true)}
      />

      {/* Main interactive screen viewport */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {renderScreen()}
      </main>

      {/* Modals */}
      {isAchievementsOpen && (
        <AchievementsModal
          progress={progress}
          onClose={() => setIsAchievementsOpen(false)}
        />
      )}

      {isGuiaOpen && (
        <PedagogyGuideModal
          onClose={() => setIsGuiaOpen(false)}
        />
      )}

      {/* Toast popup */}
      {toastNotification && (
        <div className="fixed bottom-6 right-6 z-50 animate-bounce p-4 rounded-2xl bg-slate-950/95 border-2 border-cyan-400 shadow-[0_0_25px_rgba(6,182,212,0.4)] flex items-start gap-3 max-w-sm">
          <div className="text-2xl">🤖</div>
          <div>
            <div className="text-xs font-display font-bold text-cyan-300 uppercase tracking-wider">
              {toastNotification.title}
            </div>
            <div className="text-xs text-slate-200 mt-0.5">
              {toastNotification.subtitle}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
