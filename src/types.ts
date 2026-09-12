export type Screen = 
  | 'menu' 
  | 'levels' 
  | 'level_1' 
  | 'level_2' 
  | 'level_3' 
  | 'level_4' 
  | 'level_5' 
  | 'level_6' 
  | 'level_7' 
  | 'level_8_avoid'
  | 'level_8_repair'
  | 'level_final_greenhouse'
  | 'creative_creator'
  | 'team_mission'
  | 'teacher_mode'
  | 'progress_screen';

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  xpReward: number;
}

export interface CustomRobot {
  id?: string;
  name: string;
  body: string;
  traction: string;
  sensors: string[];
  actuators: string[];
  createdAt?: string;
}

export interface UserProgress {
  xp: number;
  level: number;
  unlockedLevels: number[];
  completedActivities: string[];
  achievements: Achievement[];
  soundEnabled: boolean;
  customRobot?: CustomRobot;
  lastPlayedLevel?: Screen;
}

export interface Hint {
  step1: string;
  step2: string;
  step3: string;
}

export interface PedagogyAxis {
  id: number;
  title: string;
  description: string;
  topics: string[];
  competencies: string[];
  icon: string;
}
