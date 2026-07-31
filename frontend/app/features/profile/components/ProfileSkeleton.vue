<template>
  <div
    class="
      grid gap-5 rounded-md border border-default bg-elevated/96 p-5 shadow-sm
      sm:p-6
      lg:grid-cols-[minmax(0,1fr)_minmax(16rem,0.62fr)]
    "
    aria-label="Завантаження профілю"
  >
    <div class="space-y-5">
      <div class="space-y-3">
        <USkeleton class="h-3 w-20" />
        <USkeleton class="h-8 w-48" />
        <USkeleton class="h-4 w-full max-w-xl" />
      </div>

      <div
        class="
          grid gap-4
          md:grid-cols-2
        "
      >
        <div
          v-for="index in 2"
          :key="index"
          class="space-y-2"
        >
          <USkeleton class="h-4 w-20" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-3 w-4/5" />
        </div>
      </div>

      <div class="space-y-2">
        <USkeleton class="h-4 w-16" />
        <USkeleton class="h-10 w-full" />
        <USkeleton class="h-3 w-3/4" />
      </div>
    </div>

    <div class="rounded-md border border-muted bg-elevated/72 p-4">
      <USkeleton class="h-4 w-20" />
      <USkeleton class="mx-auto mt-5 size-32" />
      <USkeleton class="mx-auto mt-4 h-10 w-36" />
      <USkeleton class="mx-auto mt-3 h-3 w-4/5" />
    </div>
  </div>
</template>
