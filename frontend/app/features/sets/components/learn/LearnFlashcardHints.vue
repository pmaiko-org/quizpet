<template>
  <div class="absolute top-2 left-2 z-20 flex items-center gap-1">
    <UPopover>
      <UButton
        icon="i-lucide-info"
        size="xs"
        color="neutral"
        variant="ghost"
        class="rounded-full! bg-elevated/70 p-2 backdrop-blur-sm"
        aria-label="Підказки та керування з клавіатури"
        @click.stop
        @keydown.enter.stop
        @keydown.space.stop
      />

      <template #content>
        <div class="max-w-xs space-y-3 p-3 text-sm">
          <p class="text-highlighted">
            Натисніть картку, щоб побачити іншу сторону
          </p>

          <div class="space-y-1.5 text-muted">
            <div class="flex items-center gap-2">
              <UKbd>←</UKbd>
              <span>Не знаю</span>
            </div>
            <div class="flex items-center gap-2">
              <UKbd>→</UKbd>
              <span>Знаю, далі</span>
            </div>
            <div class="flex items-center gap-2">
              <UKbd>Пробіл</UKbd>
              <span>Перевернути картку</span>
            </div>
          </div>

          <div class="border-t border-default pt-3 text-muted">
            <div class="flex items-center gap-2">
              <UIcon
                name="i-lucide-move-horizontal"
                class="size-4 shrink-0"
              />
              <span>Свайп вправо — не знаю, вліво — знаю</span>
            </div>
          </div>

          <div class="space-y-1.5 border-t border-default pt-3 text-muted">
            <p class="text-xs font-medium text-highlighted">
              Кут картки
            </p>
            <div class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-[3px] bg-sky-500/80" />
              <span>Термін</span>
            </div>
            <div class="flex items-center gap-2">
              <span class="size-3 shrink-0 rounded-[3px] bg-emerald-500/80" />
              <span>Відповідь</span>
            </div>
          </div>
        </div>
      </template>
    </UPopover>

    <UPopover v-if="hasAnswerHint">
      <UButton
        icon="i-lucide-lightbulb"
        size="xs"
        color="neutral"
        variant="ghost"
        class="rounded-full! bg-elevated/70 p-2 text-amber-500 backdrop-blur-sm"
        aria-label="Підказка: перша літера відповіді"
        @click.stop
        @keydown.enter.stop
        @keydown.space.stop
      />

      <template #content>
        <div class="max-w-xs space-y-3 p-4">
          <div class="flex items-center gap-2 text-highlighted">
            <UIcon
              name="i-lucide-lightbulb"
              class="size-4 text-amber-500"
            />
            <p class="text-sm font-medium">
              Підказка
            </p>
          </div>

          <div class="flex items-center gap-3">
            <span
              class="
                flex size-12 shrink-0 items-center justify-center rounded-sm
                border text-2xl font-bold uppercase
              "
              :style="accentStyle"
            >
              {{ answerFirstLetter }}
            </span>

            <span
              v-if="answerMask"
              class="
                font-mono text-lg leading-none tracking-[0.35em] break-all
                text-toned
              "
            >
              {{ answerMask }}
            </span>
          </div>

          <p class="text-xs text-muted">
            Перша літера відповіді — решту згадайте самі.
          </p>
        </div>
      </template>
    </UPopover>
  </div>
</template>

<script setup lang="ts">
import type { CSSProperties } from "vue";

const { hasAnswerHint, answerFirstLetter, answerMask, accentStyle } =
  defineProps<{
    hasAnswerHint: boolean;
    answerFirstLetter: string;
    answerMask: string;
    accentStyle: CSSProperties;
  }>();
</script>
