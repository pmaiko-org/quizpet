<template>
  <div
    class="
      flex h-[calc(100svh-var(--ui-header-height)-2.5rem)] min-h-0 flex-col
      gap-3 pb-[env(safe-area-inset-bottom)]
      sm:h-[calc(100svh-var(--ui-header-height)-3rem)]
    "
    aria-label="Завантаження навчального сеансу"
  >
    <section class="app-surface shrink-0 p-3">
      <div
        class="
          flex flex-col gap-3
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div class="space-y-2">
          <USkeleton class="h-3 w-28" />
          <USkeleton class="h-6 w-32" />
        </div>

        <div class="grid grid-cols-3 gap-px">
          <USkeleton
            v-for="index in 3"
            :key="index"
            class="h-11 w-20"
          />
        </div>
      </div>
      <USkeleton class="mt-3 h-2 w-full" />
    </section>

    <div class="flex shrink-0 items-center gap-2">
      <USkeleton class="h-6 w-20" />
      <USkeleton class="h-7 w-16" />
      <div class="ml-auto flex gap-1">
        <USkeleton class="size-8" />
        <USkeleton class="size-8" />
        <USkeleton class="size-8" />
      </div>
    </div>

    <USkeleton class="app-radius-surface min-h-0 w-full flex-1" />

    <div class="grid shrink-0 grid-cols-2 gap-2">
      <USkeleton class="h-11 w-full" />
      <USkeleton class="h-11 w-full" />
    </div>
  </div>
</template>
