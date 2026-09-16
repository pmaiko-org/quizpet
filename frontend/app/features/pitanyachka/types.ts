export enum PitanyachkaPhase {
  IDLE = "idle",
  READING = "reading",
}

export type TPitanyachkaPlayer = {
  id: string;
  name: string;
};

export type TPitanyachkaState = {
  started: boolean;
  phase: PitanyachkaPhase;
  players: TPitanyachkaPlayer[];
  readerId: string | null;
  readerName: string | null;
  usedCount: number;
  remaining: number;
  total: number;
};

export type TPitanyachkaQuestion = {
  category: string;
  emoji: string;
  text: string;
  hint: string;
};

export type TPitanyachkaServerMessage =
  | { event: "welcome"; data: { playerId: string } } |
  { event: "state"; data: TPitanyachkaState } |
  { event: "question"; data: TPitanyachkaQuestion };

export type TPitanyachkaClientEvent =
  | "join" |
  "start" |
  "reset" |
  "generateQuestion" |
  "passTurn";

export const createEmptyPitanyachkaState = (): TPitanyachkaState => ({
  started: false,
  phase: PitanyachkaPhase.IDLE,
  players: [],
  readerId: null,
  readerName: null,
  usedCount: 0,
  remaining: 0,
  total: 0,
});
