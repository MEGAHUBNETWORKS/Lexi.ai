
export interface Message {
  role: 'user' | 'model';
  content: string;
  image?: string; // Base64 image data
  isLocked?: boolean;
  isRevealing?: boolean;
  category?: string;
}

export interface ChatHistory {
  messages: Message[];
}

export enum AdPosition {
  TOP = 'TOP',
  SIDE = 'SIDE',
  NATIVE = 'NATIVE'
}

export type AIMode = 'Innocent' | 'Extreme' | 'Good Caring';
export type Language = 'English' | 'Urdu';
