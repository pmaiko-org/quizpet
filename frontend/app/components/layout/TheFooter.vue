<template>
  <footer class="border-t border-default p-4 text-xs text-muted">
    <UContainer
      class="
        flex flex-col gap-3
        sm:flex-row sm:items-center sm:justify-between
      "
    >
      <div
        class="
          flex flex-col gap-1
          sm:flex-row sm:items-center sm:gap-3
        "
      >
        <p>QuizPet © {{ new Date().getFullYear() }}</p>
        <span
          class="
            hidden
            sm:inline
          "
          aria-hidden="true"
        >·</span>
        <p>Маленькі кроки, сильна пам’ять.</p>
      </div>

      <nav
        class="flex flex-wrap items-center gap-x-3 gap-y-1"
        aria-label="Посилання проєкту"
      >
        <a
          :href="PROJECT_LINKS.github"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="GitHub проєкту QuizPet (відкривається в новій вкладці)"
          class="
            rounded-sm transition-colors
            hover:text-default
            focus-visible:ring-2 focus-visible:ring-primary
            focus-visible:outline-none
          "
        >
          GitHub
        </a>
        <span aria-hidden="true">·</span>
        <a
          :href="PROJECT_LINKS.telegram"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Telegram автора (відкривається в новій вкладці)"
          class="
            rounded-sm transition-colors
            hover:text-default
            focus-visible:ring-2 focus-visible:ring-primary
            focus-visible:outline-none
          "
        >
          Telegram
        </a>
        <span aria-hidden="true">·</span>
        <NuxtLink
          :to="{ name: RouteName.PRIVACY }"
          class="
            rounded-sm transition-colors
            hover:text-default
            focus-visible:ring-2 focus-visible:ring-primary
            focus-visible:outline-none
          "
        >
          Конфіденційність та умови
        </NuxtLink>
      </nav>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
import { PROJECT_LINKS, RouteName } from "~/constants";
</script>
