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
        <p>{{ global?.siteName }} © {{ new Date().getFullYear() }}</p>
        <span
          class="
            hidden
            sm:inline
          "
          aria-hidden="true"
        >·</span>
        <p>{{ global?.footerTagline }}</p>
      </div>

      <nav
        class="flex flex-wrap items-center gap-x-3 gap-y-1"
        :aria-label="$t('common.projectLinks')"
      >
        <template
          v-for="link in links"
          :key="`${link.label}:${link.path}`"
        >
          <a
            v-if="link.isExternal"
            :href="link.path"
            target="_blank"
            rel="noopener noreferrer"
            class="
              rounded-sm transition-colors
              hover:text-default
              focus-visible:ring-2 focus-visible:ring-primary
              focus-visible:outline-none
            "
          >
            {{ link.label }}
          </a>
          <NuxtLink
            v-else
            :to="link.path"
            class="
              rounded-sm transition-colors
              hover:text-default
              focus-visible:ring-2 focus-visible:ring-primary
              focus-visible:outline-none
            "
          >
            {{ link.label }}
          </NuxtLink>
        </template>
      </nav>
    </UContainer>
  </footer>
</template>

<script setup lang="ts">
const { bootstrap } = useCmsBootstrap();
const global = computed(() => bootstrap.value?.global);
const links = computed(() => [
  ...(global.value?.socialLinks ?? []),
  ...(global.value?.footerLinks ?? []),
]);
</script>
