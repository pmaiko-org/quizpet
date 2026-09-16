<template>
  <div
    v-if="players.length"
    class="flex flex-wrap items-center justify-center gap-2"
  >
    <span
      v-for="player in players"
      :key="player.id"
      class="
        inline-flex items-center gap-1.5 rounded-full border border-default
        bg-muted/50 px-3 py-1 text-xs font-medium text-toned
      "
      :class="{
        'border-primary/40 bg-primary/10 text-primary': player.id === readerId,
      }"
    >
      <UIcon
        :name="player.id === readerId ? 'i-lucide-mic' : 'i-lucide-user'"
        class="size-3.5"
      />
      {{ player.name }}
    </span>
  </div>
</template>

<script setup lang="ts">
import type { TPitanyachkaPlayer } from "../types";

const { players, readerId = null } = defineProps<{
  players: TPitanyachkaPlayer[];
  readerId?: string | null;
}>();
</script>
