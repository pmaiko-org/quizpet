<template>
  <div
    class="mx-auto max-w-3xl space-y-3"
    aria-label="Завантаження навчального сеансу"
  >
    <section class="app-surface p-3">
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

    <div class="space-y-2">
      <div class="flex items-center justify-between gap-3">
        <div class="flex gap-2">
          <USkeleton class="h-6 w-18" />
          <USkeleton class="h-6 w-16" />
        </div>
        <div class="flex gap-1">
          <USkeleton class="size-8" />
          <USkeleton class="size-8" />
        </div>
      </div>

      <USkeleton class="mx-auto h-9 w-full max-w-64" />

      <section
        class="
          app-radius-surface flex min-h-60 flex-col border border-default
          bg-elevated p-3
          sm:min-h-80 sm:p-4
        "
      >
        <USkeleton class="h-6 w-16" />
        <div
          class="
            flex flex-1 flex-col items-center justify-center space-y-3 py-3
          "
        >
          <USkeleton class="h-9 w-2/5" />
          <USkeleton class="h-4 w-1/3" />
        </div>
      </section>

      <USkeleton class="mx-auto h-3 w-3/5" />
    </div>

    <div class="grid grid-cols-2 gap-2">
      <USkeleton class="h-11 w-full" />
      <USkeleton class="h-11 w-full" />
    </div>
  </div>
</template>
