<template>
  <header
    class="
      pointer-events-none fixed inset-x-0 top-0 z-50 pt-3
      sm:pt-5
    "
  >
    <UContainer>
      <div
        class="
          pointer-events-auto flex h-16 items-center justify-between rounded-2xl
          border border-white/15 bg-slate-950/72 px-3 shadow-2xl shadow-black/20
          backdrop-blur-2xl
          sm:px-5
        "
      >
        <NuxtLink
          :to="routes.resolve('index')"
          class="group inline-flex items-center gap-2.5 text-white"
        >
          <span
            class="
              flex size-9 items-center justify-center rounded-xl bg-primary
              text-sm font-black text-inverted shadow-lg shadow-primary/25
              transition-transform
              group-hover:-rotate-6
            "
          >Q</span>
          <span class="text-base font-bold tracking-tight">QuizPet</span>
        </NuxtLink>

        <div
          class="
            flex items-center gap-1.5
            sm:gap-2
          "
        >
          <UColorModeSwitch class="text-white" />
          <LocaleSwitcher
            buttonClass="text-white/80 hover:bg-white/10 hover:text-white"
            labelClass="hidden sm:inline"
          />
          <UButton
            :to="routes.resolve(isLoggedIn ? 'cabinet' : 'login')"
            icon="i-lucide-arrow-right"
            trailing
            class="rounded-xl shadow-lg shadow-primary/20"
          >
            <span
              class="
                hidden
                sm:inline
              "
            >
              {{ $t(isLoggedIn ? "landing.openCabinet" : "landing.start") }}
            </span>
            <span class="sm:hidden">{{ $t("landing.ctaShort") }}</span>
          </UButton>
        </div>
      </div>
    </UContainer>
  </header>
</template>

<script setup lang="ts">
const routes = usePageRoutes();
const { isLoggedIn } = storeToRefs(useAuthStore());
</script>
