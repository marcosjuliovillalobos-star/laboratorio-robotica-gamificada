import { UserProgress } from '../types';
import { INITIAL_ACHIEVEMENTS } from '../data/initialData';

const STORAGE_KEY = 'robotica_lab_v1';

export const LEVEL_THRESHOLDS = [
  { level: 1, title: 'Iniciado en Robótica', minXp: 0, maxXp: 100 },
  { level: 2, title: 'Explorador de Circuitos', minXp: 100, maxXp: 250 },
  { level: 3, title: 'Cadete de Algoritmos', minXp: 250, maxXp: 450 },
  { level: 4, title: 'Operador de Sensores', minXp: 450, maxXp: 700 },
  { level: 5, title: 'Programador de Bloques', minXp: 700, maxXp: 1000 },
  { level: 6, title: 'Técnico de Depuración', minXp: 1000, maxXp: 1400 },
  { level: 7, title: 'Ingeniero de Automatización', minXp: 1400, maxXp: 1900 },
  { level: 8, title: 'Maestro de la Robótica', minXp: 1900, maxXp: 2500 },
];

export function calculatePlayerLevel(xp: number): { currentLevel: number; title: string; currentTierMin: number; nextTierMax: number; percent: number } {
  for (let i = LEVEL_THRESHOLDS.length - 1; i >= 0; i--) {
    const tier = LEVEL_THRESHOLDS[i];
    if (xp >= tier.minXp) {
      const range = tier.maxXp - tier.minXp;
      const progressInTier = Math.min(range, xp - tier.minXp);
      const percent = Math.min(100, Math.round((progressInTier / range) * 100));
      return {
        currentLevel: tier.level,
        title: tier.title,
        currentTierMin: tier.minXp,
        nextTierMax: tier.maxXp,
        percent,
      };
    }
  }
  return {
    currentLevel: 1,
    title: LEVEL_THRESHOLDS[0].title,
    currentTierMin: 0,
    nextTierMax: 100,
    percent: 0,
  };
}

export function getDefaultProgress(): UserProgress {
  return {
    xp: 0,
    level: 1,
    unlockedLevels: [1], // Level 1 starts unlocked
    completedActivities: [],
    achievements: INITIAL_ACHIEVEMENTS.map(a => ({ ...a })),
    soundEnabled: true,
    lastPlayedLevel: 'level_1',
  };
}

export function loadProgress(): UserProgress {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return getDefaultProgress();
    const parsed = JSON.parse(data);
    
    // Ensure all achievements exist even if schema evolved
    const achievements = INITIAL_ACHIEVEMENTS.map(initial => {
      const saved = parsed.achievements?.find((a: { id: string }) => a.id === initial.id);
      return saved || initial;
    });

    return {
      ...getDefaultProgress(),
      ...parsed,
      achievements,
      unlockedLevels: parsed.unlockedLevels && parsed.unlockedLevels.length > 0 ? parsed.unlockedLevels : [1],
    };
  } catch {
    return getDefaultProgress();
  }
}

export function saveProgress(progress: UserProgress): void {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress));
  } catch (e) {
    console.warn('Could not save progress to localStorage', e);
  }
}

export function awardActivity(
  current: UserProgress,
  activityId: string,
  xpGain: number,
  unlocksNextLevelId?: number
): { updated: UserProgress; isNew: boolean; leveledUp: boolean; newAchievements: string[] } {
  const isNew = !current.completedActivities.includes(activityId);
  const newActivities = isNew ? [...current.completedActivities, activityId] : current.completedActivities;
  const newXp = isNew ? current.xp + xpGain : current.xp;
  
  const oldLevelInfo = calculatePlayerLevel(current.xp);
  const newLevelInfo = calculatePlayerLevel(newXp);
  const leveledUp = newLevelInfo.currentLevel > oldLevelInfo.currentLevel;

  // Level unlocking
  let unlockedLevels = [...current.unlockedLevels];
  if (unlocksNextLevelId && !unlockedLevels.includes(unlocksNextLevelId)) {
    unlockedLevels.push(unlocksNextLevelId);
  }

  // Check achievements
  const newAchievements: string[] = [];
  const updatedAchievements = current.achievements.map(ach => {
    if (ach.unlocked) return ach;
    let shouldUnlock = false;

    if (ach.id === 'first_mission' && newActivities.length >= 1) shouldUnlock = true;
    if (ach.id === 'logical_mind' && (activityId.includes('level_3') || activityId.includes('level_4'))) shouldUnlock = true;
    if (ach.id === 'detector' && activityId.includes('level_7')) shouldUnlock = true;
    if (ach.id === 'block_coder' && activityId.includes('level_6')) shouldUnlock = true;
    if (ach.id === 'robot_pilot' && activityId.includes('level_8_avoid')) shouldUnlock = true;
    if (ach.id === 'debugger' && activityId.includes('level_8_repair')) shouldUnlock = true;
    if (ach.id === 'greenhouse_master' && activityId.includes('level_final')) shouldUnlock = true;
    if (ach.id === 'teamwork' && activityId.includes('team_mission')) shouldUnlock = true;
    if (ach.id === 'creative_engineer' && activityId.includes('creative_creator')) shouldUnlock = true;
    if (ach.id === 'robotics_master' && newActivities.length >= 9) shouldUnlock = true;

    if (shouldUnlock) {
      newAchievements.push(ach.title);
      return {
        ...ach,
        unlocked: true,
        unlockedAt: new Date().toLocaleDateString('es-AR'),
      };
    }
    return ach;
  });

  const updated: UserProgress = {
    ...current,
    xp: newXp,
    level: newLevelInfo.currentLevel,
    completedActivities: newActivities,
    unlockedLevels,
    achievements: updatedAchievements,
  };

  saveProgress(updated);
  return { updated, isNew, leveledUp, newAchievements };
}

export function resetProgress(): UserProgress {
  const fresh = getDefaultProgress();
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch (e) {
    console.warn('Could not clear local progress', e);
  }
  saveProgress(fresh);
  return fresh;
}

export function unlockAllLevels(current: UserProgress): UserProgress {
  const allLevels = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
  const updated: UserProgress = {
    ...current,
    unlockedLevels: allLevels,
  };
  saveProgress(updated);
  return updated;
}
