import assert from "node:assert/strict";
import { test, type TestContext } from "node:test";
import { effectScope, ref } from "vue";

import { useMatchGame } from "../app/features/sets/composables/useMatchGame";
import {
  buildMatchRounds,
  MATCH_ROUND_SIZE,
} from "../app/features/sets/matching";
import type { ICardDetailsResponse } from "../app/shared/types/api.generated";

const createCard = (
  id: number,
  term = `Word ${id}`,
  definition = `Meaning ${id}`,
): ICardDetailsResponse => ({
  id: String(id),
  position: id,
  term,
  definition,
  termDescription: null,
  termImage: null,
  definitionImage: null,
  textColor: null,
  backgroundColor: null,
});

const setupGame = (context: TestContext, count = 3) => {
  context.mock.timers.enable({ apis: ["setTimeout", "Date"], now: 10000 });
  const cards = ref(
    Array.from({ length: count }, (_, index) => createCard(index)),
  );
  const scope = effectScope();
  const game = scope.run(() => useMatchGame(cards))!;
  context.after(() => scope.stop());
  return { game, cards, scope };
};

test("rounds include every card once, respect the limit and do not mutate the input", () => {
  const cards = Array.from({ length: 19 }, (_, index) => createCard(index));
  const original = [...cards];
  const rounds = buildMatchRounds(cards);
  assert.deepEqual(cards, original);
  assert.equal(rounds.length, 4);
  assert.ok(
    rounds.every(round => round.length > 0 && round.length <= MATCH_ROUND_SIZE),
  );
  assert.deepEqual(
    rounds
      .flat()
      .map(card => card.id)
      .sort(),
    cards.map(card => card.id).sort(),
  );
});

test("visually equivalent words and definitions never appear in the same round", () => {
  const cards = [
    createCard(1, " Cat ", "Animal"),
    createCard(2, "cat", "Pet"),
    createCard(3, "Kitten", " animal "),
    createCard(4, "ＣＡＴ", "Young cat"),
    createCard(5, "Sea  lion", "Marine mammal"),
    createCard(6, "sea lion", "Seal"),
  ];
  const normalize = (text: string) =>
    text.normalize("NFKC").trim().replace(/\s+/g, " ").toLowerCase();
  const rounds = buildMatchRounds(cards);
  assert.equal(rounds.flat().length, cards.length);
  for (const round of rounds) {
    assert.equal(
      new Set(round.map(card => normalize(card.term))).size,
      round.length,
    );
    assert.equal(
      new Set(round.map(card => normalize(card.definition))).size,
      round.length,
    );
  }
});

test("an empty set cannot start a session", (context) => {
  const { game } = setupGame(context, 0);
  game.start();
  assert.equal(game.status.value, "ready");
  assert.equal(game.totalCards.value, 0);
  assert.equal(game.elapsedMs.value, 0);
});

test("selection can be replaced or toggled off without recording an attempt", (context) => {
  const { game } = setupGame(context);
  assert.equal(game.status.value, "ready");
  game.start();
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "1", side: "term" });
  assert.deepEqual(game.selected.value, { cardId: "1", side: "term" });
  game.selectTile({ cardId: "1", side: "term" });
  assert.equal(game.selected.value, null);
  assert.equal(game.mistakes.value, 0);
  assert.equal(game.matchedCount.value, 0);
  game.selectTile({ cardId: "unknown", side: "term" });
  assert.equal(game.selected.value, null);
});

test("a mismatch is counted once, locks input during feedback and permits retry", (context) => {
  const { game } = setupGame(context);
  game.start();
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "1", side: "definition" });
  assert.equal(game.feedback.value, "error");
  game.selectTile({ cardId: "0", side: "definition" });
  game.nextRound();
  assert.equal(game.mistakes.value, 1);
  assert.equal(game.matchedCount.value, 0);
  assert.equal(game.roundIndex.value, 0);
  context.mock.timers.tick(1000);
  assert.equal(game.feedback.value, null);
  assert.equal(game.selected.value, null);
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "0", side: "definition" });
  assert.equal(game.matchedCount.value, 1);
  assert.equal(game.accuracy.value, 50);
});

test("matching works in either direction and matched pairs cannot be counted again", (context) => {
  const { game } = setupGame(context);
  game.start();
  game.selectTile({ cardId: "0", side: "definition" });
  game.selectTile({ cardId: "0", side: "term" });
  assert.equal(game.feedback.value, "success");
  game.selectTile({ cardId: "1", side: "term" });
  assert.equal(game.selected.value?.cardId, "0");
  context.mock.timers.tick(1000);
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "0", side: "definition" });
  assert.equal(game.selected.value, null);
  assert.equal(game.matchedCount.value, 1);
});

test("all rounds finish once and the timer freezes at the final answer", (context) => {
  const { game } = setupGame(context, 7);
  game.start();
  game.nextRound();
  assert.equal(game.roundIndex.value, 0);
  for (let round = 0; round < 2; round += 1) {
    for (const card of game.terms.value) {
      context.mock.timers.tick(1000);
      game.selectTile({ cardId: card.id, side: "term" });
      game.selectTile({ cardId: card.id, side: "definition" });
      context.mock.timers.tick(500);
    }
    assert.equal(game.roundComplete.value, true);
    if (round === 0) {
      assert.equal(game.status.value, "playing");
      game.nextRound();
      assert.equal(game.roundIndex.value, 1);
      assert.equal(game.matchedIds.value.size, 0);
    }
  }
  assert.equal(game.status.value, "finished");
  assert.equal(game.matchedCount.value, 7);
  assert.equal(game.accuracy.value, 100);
  assert.equal(game.elapsedMs.value, 10000);
  context.mock.timers.tick(10000);
  assert.equal(game.elapsedMs.value, 10000);
  game.nextRound();
  assert.equal(game.roundIndex.value, 1);
});

test("restarting during final feedback cancels the old completion", (context) => {
  const { game } = setupGame(context, 1);
  game.start();
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "0", side: "definition" });
  game.start();
  context.mock.timers.tick(1000);
  assert.equal(game.status.value, "playing");
  assert.equal(game.matchedCount.value, 0);
  assert.equal(game.mistakes.value, 0);
  assert.equal(game.selected.value, null);
  assert.equal(game.feedback.value, null);
});

test("replacing the source set resets the session and pending feedback", (context) => {
  const { game, cards } = setupGame(context);
  game.start();
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "1", side: "definition" });
  cards.value = [createCard(10)];
  context.mock.timers.tick(1000);
  assert.equal(game.status.value, "ready");
  assert.equal(game.mistakes.value, 0);
  assert.equal(game.terms.value.length, 0);
  game.start();
  assert.equal(game.terms.value[0]?.id, "10");
  assert.equal(game.totalCards.value, 1);
});

test("disposing a session cancels its pending completion callback", (context) => {
  const { game, scope } = setupGame(context, 1);
  game.start();
  game.selectTile({ cardId: "0", side: "term" });
  game.selectTile({ cardId: "0", side: "definition" });
  scope.stop();
  context.mock.timers.tick(1000);
  assert.equal(game.status.value, "playing");
  assert.equal(game.feedback.value, null);
});
