import type { ICardDetailsResponse } from "~/shared/types/api.generated";

export type TMatchSide = "term" | "definition";
export type TMatchStatus = "ready" | "playing" | "finished";
export type TMatchFeedback = "success" | "error";

export interface IMatchTile {
  cardId: string;
  side: TMatchSide;
}

export const MATCH_ROUND_SIZE = 6;

export const shuffleMatchItems = <T>(items: readonly T[]): T[] => {
  const shuffled = [...items];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1));
    [shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex]!,
      shuffled[index]!,
    ];
  }

  return shuffled;
};

const normalizeMatchText = (text: string) => {
  return text.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
};

export const buildMatchRounds = (cards: readonly ICardDetailsResponse[]) => {
  const rounds: ICardDetailsResponse[][] = [];
  let remaining = shuffleMatchItems(cards);

  while (remaining.length) {
    const round: ICardDetailsResponse[] = [];
    const deferred: ICardDetailsResponse[] = [];
    const terms = new Set<string>();
    const definitions = new Set<string>();

    for (const card of remaining) {
      const term = normalizeMatchText(card.term);
      const definition = normalizeMatchText(card.definition);

      if (
        round.length >= MATCH_ROUND_SIZE ||
        terms.has(term) ||
        definitions.has(definition)
      ) {
        deferred.push(card);
        continue;
      }

      round.push(card);
      terms.add(term);
      definitions.add(definition);
    }

    rounds.push(round);
    remaining = deferred;
  }

  return rounds;
};
