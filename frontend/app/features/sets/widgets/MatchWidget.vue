<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <SetStudyNav
      :setId="setId"
      :active="RouteName.SETS_ID_MATCH"
    />
    <BaseDataBoundary
      :pending="loading"
      :error="error"
      :empty="!availableCount"
      errorTitle="Unable to load this set"
      errorDescription="Please try again."
      retryLabel="Try again"
      @retry="handleRetry"
    >
      <template #loading>
        <div
          class="space-y-5"
          aria-label="Loading matching session"
          aria-busy="true"
        >
          <USkeleton class="h-8 w-48" />
          <USkeleton class="h-20 w-full" />
          <div class="grid grid-cols-2 gap-3">
            <USkeleton
              v-for="index in 12"
              :key="index"
              class="h-24"
            />
          </div>
        </div>
      </template>
      <template #empty>
        <section
          class="rounded-md border border-dashed border-default p-8 text-center"
        >
          <h1 class="text-xl font-semibold text-highlighted">
            No words to match yet
          </h1>
          <p class="mt-2 text-sm text-toned">
            Add cards with both a word and a definition to start matching.
          </p>
          <UButton
            v-if="canEdit"
            :to="{ name: RouteName.SETS_ID_EDIT, params: { id: setId } }"
            class="mt-5"
            icon="i-lucide-plus"
          >
            Add cards
          </UButton>
        </section>
      </template>

      <template v-if="status === 'ready'">
        <section
          class="
            rounded-md border border-default bg-elevated/70 p-6 text-center
            sm:p-10
          "
        >
          <div
            class="
              mx-auto flex size-16 items-center justify-center rounded-md
              bg-primary/10 text-primary
            "
          >
            <UIcon
              name="i-lucide-copy-check"
              class="size-8"
            />
          </div>
          <p
            class="
              mt-5 text-xs font-semibold tracking-widest text-primary uppercase
            "
          >
            Word match
          </p>
          <h1
            class="
              mt-2 text-2xl font-semibold wrap-break-word text-highlighted
              sm:text-3xl
            "
          >
            {{ setName }}
          </h1>
          <p class="mx-auto mt-4 max-w-lg text-sm/6 text-toned">
            Match each word with its definition. Work through
            {{ availableCount }} pairs in rounds of up to
            {{ MATCH_ROUND_SIZE }}. Your timer starts when you play.
          </p>
          <UButton
            class="mt-6"
            icon="i-lucide-play"
            size="xl"
            @click="handleStart"
          >
            Start matching
          </UButton>
          <p class="mt-4 text-xs text-muted">
            Tap to select, or use Tab and Enter on your keyboard.
          </p>
        </section>
      </template>

      <MatchResults
        v-else-if="status === 'finished'"
        :setId="setId"
        :setName="setName"
        :matchedCount="matchedCount"
        :mistakes="mistakes"
        :elapsedMs="elapsedMs"
        :accuracy="accuracy"
        @restart="handleStart"
      />

      <section
        v-else
        class="space-y-5"
      >
        <div class="flex items-start justify-between gap-3">
          <div class="min-w-0">
            <p
              class="
                text-xs font-semibold tracking-widest text-primary uppercase
              "
            >
              Word match
            </p>
            <h1
              class="
                mt-1 text-xl font-semibold wrap-break-word text-highlighted
              "
            >
              {{ setName }}
            </h1>
          </div>
          <UButton
            icon="i-lucide-rotate-ccw"
            color="neutral"
            variant="ghost"
            aria-label="Restart matching"
            @click="handleStart"
          >
            Restart
          </UButton>
        </div>
        <div
          class="space-y-3 rounded-md border border-default bg-elevated/70 p-4"
        >
          <dl class="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt class="text-xs text-muted">
                Matched
              </dt>
              <dd class="mt-1 font-semibold text-highlighted">
                {{ matchedCount }} / {{ totalCards }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-muted">
                Time
              </dt>
              <dd class="mt-1 font-semibold text-highlighted tabular-nums">
                {{ formatTime(elapsedMs) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-muted">
                Mistakes
              </dt>
              <dd class="mt-1 font-semibold text-highlighted">
                {{ mistakes }}
              </dd>
            </div>
          </dl>
          <UProgress
            :modelValue="matchedCount"
            :max="totalCards"
            aria-label="Pairs matched"
          />
        </div>
        <MatchBoard
          :terms="terms"
          :definitions="definitions"
          :selected="selected"
          :compared="compared"
          :feedback="feedback"
          :matchedIds="matchedIds"
          :roundNumber="roundIndex + 1"
          :roundCount="roundCount"
          :roundComplete="roundComplete"
          @select="handleSelect"
          @nextRound="handleNextRound"
        />
      </section>
    </BaseDataBoundary>
  </div>
</template>

<script setup lang="ts">
import { RouteName } from "~/shared/constants";

import { MATCH_ROUND_SIZE } from "../matching";
import { formatTime } from "../utils";

const { email } = useCurrentUser();
const {
  setId,
  setName,
  availableCount,
  canEdit,
  loading,
  error,
  status,
  terms,
  definitions,
  selected,
  compared,
  feedback,
  matchedIds,
  matchedCount,
  mistakes,
  totalCards,
  roundIndex,
  roundCount,
  roundComplete,
  elapsedMs,
  accuracy,
  refresh: handleRetry,
  start: handleStart,
  nextRound: handleNextRound,
  selectTile: handleSelect,
} = useMatchSession(email);
</script>
