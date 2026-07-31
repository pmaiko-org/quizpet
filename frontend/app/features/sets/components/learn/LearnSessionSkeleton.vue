<template>
  <div
    class="
      flex h-[calc(100svh-var(--ui-header-height)-2.5rem)] min-h-0 flex-col
      gap-3
      sm:h-[calc(100svh-var(--ui-header-height)-3rem)]
    "
  >
    <USkeleton class="shrink-0 rounded-md bg-elevated/70 px-3 py-2">
      <div
        class="
          flex flex-col gap-1.5
          sm:flex-row sm:items-center sm:justify-between
        "
      >
        <div class="flex items-center gap-2">
          <div class="h-3.5 w-20" />
        </div>

        <div class="flex gap-1">
          <div
            v-for="index in 3"
            :key="index"
            class="h-8 w-16"
          />
        </div>
      </div>
      <USkeleton class="mt-1 h-1 w-full rounded-full" />
    </USkeleton>

    <div class="flex shrink-0 items-center gap-2">
      <USkeleton class="h-6 w-20" />
      <USkeleton class="h-7 w-16" />
      <div class="ml-auto flex gap-1">
        <USkeleton class="size-8" />
        <USkeleton class="size-8" />
        <USkeleton class="size-8" />
      </div>
    </div>

    <USkeleton class="min-h-0 w-full flex-1" />

    <div class="grid shrink-0 grid-cols-2 gap-2">
      <USkeleton class="h-11 w-full" />
      <USkeleton class="h-11 w-full" />
    </div>
  </div>
</template>
