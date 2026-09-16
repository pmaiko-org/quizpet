export type TPitanyachkaQuestion = {
  id: number;
  category: string;
  emoji: string;
  text: string;
  hint: string;
};

export enum PitanyachkaPhase {
  IDLE = "idle",
  READING = "reading",
}

export type TPitanyachkaPlayer = {
  id: string;
  name: string;
};

export type TPitanyachkaCategory = {
  name: string;
  emoji: string;
  count: number;
};

export type TPitanyachkaPublicState = {
  started: boolean;
  phase: PitanyachkaPhase;
  players: TPitanyachkaPlayer[];
  readerId: string | null;
  readerName: string | null;
  selectedCategory: string | null;
  usedCount: number;
  remaining: number;
  total: number;
};

export type TPitanyachkaWelcomePayload = {
  playerId: string;
};

export type TPitanyachkaQuestionPayload = {
  category: string;
  emoji: string;
  text: string;
  hint: string;
};

export type TPitanyachkaJoinPayload = {
  name: string;
};

export type TPitanyachkaStartPayload = {
  category: string | null;
};
