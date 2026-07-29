<template>
  <div
    class="space-y-5 pb-20"
    aria-label="Завантаження редактора набору"
  >
    <section
      class="
        app-surface app-radius-surface space-y-5 p-5
        sm:p-6
      "
    >
      <div
        class="
          flex flex-col gap-3
          md:flex-row md:items-start md:justify-between
        "
      >
        <div class="w-full max-w-xl space-y-3">
          <USkeleton class="h-3 w-24" />
          <USkeleton class="h-8 w-3/4" />
          <USkeleton class="h-4 w-full" />
        </div>
        <USkeleton class="h-7 w-48" />
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
          <USkeleton class="h-4 w-28" />
          <USkeleton class="h-10 w-full" />
          <USkeleton class="h-3 w-3/4" />
        </div>
      </div>

      <div class="space-y-2">
        <USkeleton class="h-4 w-20" />
        <USkeleton class="h-20 w-full" />
        <USkeleton class="h-3 w-2/3" />
      </div>

      <USkeleton class="h-11 w-full" />
    </section>

    <section class="space-y-3">
      <div class="flex items-end justify-between gap-4">
        <div class="space-y-2">
          <USkeleton class="h-3 w-24" />
          <USkeleton class="h-7 w-44" />
        </div>
        <USkeleton class="h-4 w-16" />
      </div>

      <USkeleton class="h-14 w-full" />

      <div class="space-y-3">
        <article
          v-for="index in 2"
          :key="index"
          class="
            app-surface app-radius-surface space-y-4 p-4
            sm:p-5
          "
        >
          <div class="flex items-center justify-between gap-3">
            <USkeleton class="h-6 w-28" />
            <div class="flex gap-2">
              <USkeleton class="size-8" />
              <USkeleton class="size-8" />
            </div>
          </div>

          <div
            class="
              grid gap-4
              md:grid-cols-2
            "
          >
            <div
              v-for="side in 2"
              :key="side"
              class="space-y-3"
            >
              <USkeleton class="h-4 w-20" />
              <USkeleton class="h-24 w-full" />
              <USkeleton class="h-9 w-full" />
            </div>
          </div>
        </article>
      </div>
    </section>
  </div>
</template>
