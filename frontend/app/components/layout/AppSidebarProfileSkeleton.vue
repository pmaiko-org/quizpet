<template>
  <section
    class="mt-3 border-t border-default pt-3"
    aria-label="Завантаження профілю"
  >
    <div class="app-radius-surface border border-default bg-muted/45 p-3">
      <div class="mb-3 flex items-center justify-between">
        <USkeleton class="h-3 w-14" />
        <USkeleton class="size-7" />
      </div>

      <div class="flex items-center gap-3">
        <USkeleton class="size-10 shrink-0 rounded-full" />
        <div class="min-w-0 flex-1 space-y-2">
          <USkeleton class="h-4 w-28" />
          <USkeleton class="h-3 w-full max-w-36" />
        </div>
      </div>

      <div class="mt-3 flex gap-3">
        <USkeleton
          v-for="index in 3"
          :key="index"
          class="h-3 w-12"
        />
      </div>
    </div>
  </section>
</template>
