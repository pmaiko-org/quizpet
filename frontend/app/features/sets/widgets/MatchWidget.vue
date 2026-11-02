<template>
  <div class="mx-auto max-w-4xl space-y-5">
    <SetStudyNav
      :setId="setId"
      active="sets-id-match"
    />
    <BaseDataBoundary
      :pending="loading"
      :error="error"
      :empty="!availableCount"
      :errorTitle="$wt('loadError.title')"
      :errorDescription="$wt('loadError.description')"
      :retryLabel="$wt('common.retryAgain')"
      @retry="handleRetry"
    >
      <template #loading>
        <div
          class="space-y-5"
          :aria-label="$wt('loading')"
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
            {{ $wt("empty.title") }}
          </h1>
          <p class="mt-2 text-sm text-toned">
            {{ $wt("empty.description") }}
          </p>
          <UButton
            v-if="canEdit"
            :to="routes.resolve('sets-id-edit', { id: setId })"
            class="mt-5"
            icon="i-lucide-plus"
          >
            {{ $wt("empty.action") }}
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
            {{ $wt("eyebrow") }}
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
            {{
              $wt("intro", {
                count: availableCount,
                size: MATCH_ROUND_SIZE,
              })
            }}
          </p>
          <UButton
            class="mt-6"
            icon="i-lucide-play"
            size="xl"
            @click="handleStart"
          >
            {{ $wt("start") }}
          </UButton>
          <p class="mt-4 text-xs text-muted">
            {{ $wt("keyboardHint") }}
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
              {{ $wt("eyebrow") }}
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
            :aria-label="$wt('restart')"
            @click="handleStart"
          >
            {{ $wt("restart") }}
          </UButton>
        </div>
        <div
          class="space-y-3 rounded-md border border-default bg-elevated/70 p-4"
        >
          <dl class="grid grid-cols-3 gap-3 text-center">
            <div>
              <dt class="text-xs text-muted">
                {{ $wt("metrics.matched") }}
              </dt>
              <dd class="mt-1 font-semibold text-highlighted">
                {{ matchedCount }} / {{ totalCards }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-muted">
                {{ $wt("metrics.time") }}
              </dt>
              <dd class="mt-1 font-semibold text-highlighted tabular-nums">
                {{ formatTime(elapsedMs) }}
              </dd>
            </div>
            <div>
              <dt class="text-xs text-muted">
                {{ $wt("metrics.mistakes") }}
              </dt>
              <dd class="mt-1 font-semibold text-highlighted">
                {{ mistakes }}
              </dd>
            </div>
          </dl>
          <UProgress
            :modelValue="matchedCount"
            :max="totalCards"
            :aria-label="$wt('metrics.matched')"
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
import { MATCH_ROUND_SIZE } from "../matching";
import { formatTime } from "../utils";

const routes = usePageRoutes();

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
const { t: $wt } = useCmsWidgetI18n();
</script>
