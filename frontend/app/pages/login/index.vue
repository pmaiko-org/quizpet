<template>
  <div
    class="min-h-screen bg-[radial-gradient(circle_at_top,_#fef3c7_0%,_#fff7ed_30%,_#ffffff_68%)]"
  >
    <div class="flex min-h-screen flex-col lg:flex-row">
      <section
        class="relative min-h-[320px] overflow-hidden lg:min-h-screen lg:w-1/2"
      >
        <NuxtImg
          src="/2FPjlAyMQTA.jpg"
          alt="Quiz Pet illustration"
          class="h-full w-full object-cover"
        />

        <div
          class="absolute inset-0 bg-gradient-to-tr from-slate-950/80 via-slate-900/30 to-amber-500/25"
        />

        <div
          class="absolute inset-x-0 bottom-0 flex justify-center p-6 sm:p-8 lg:p-10"
        >
          <div
            class="w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-5 text-white backdrop-blur-md sm:p-6"
          >
            <p
              class="text-xs font-semibold uppercase tracking-[0.35em] text-amber-200/90"
            >
              QuizPet
            </p>
            <h1 class="mt-3 text-3xl font-semibold leading-tight sm:text-4xl">
              Вікторини, які хочеться проходити до кінця
            </h1>
            <p class="mt-3 text-sm leading-6 text-white/78 sm:text-base">
              Обирай улюблені теми, відповідай швидше за інших і повертайся по
              нову порцію запитань.
            </p>
          </div>
        </div>
      </section>

      <section
        class="flex items-center justify-center px-4 py-8 sm:px-6 lg:w-1/2 lg:px-10 xl:px-14"
      >
        <div
          class="w-full max-w-xl rounded-[32px] border border-slate-200/80 bg-white/88 p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur xl:p-8"
        >
          <p
            class="text-sm font-semibold uppercase tracking-[0.3em] text-amber-600"
          >
            Вхід
          </p>
          <h2
            class="mt-4 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl"
          >
            Продовжити в QuizPet
          </h2>
          <p
            class="mt-4 max-w-lg text-sm leading-6 text-slate-600 sm:text-base"
          >
            Авторизуйся через Google, щоб зберегти прогрес, результати та
            персональні добірки квізів на будь-якому пристрої.
          </p>

          <div class="mt-8 space-y-4">
            <NuxtLink
              type="button"
              to="/backend/auth/google"
              class="flex w-full items-center justify-center gap-3 rounded-2xl bg-slate-950 px-5 py-4 text-base font-medium text-white transition hover:-translate-y-0.5 hover:bg-slate-800 focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2"
            >
              <img
                src="/google-logo.svg"
                alt="Google"
                class="h-5 w-5 rounded-full"
              />
              Продовжити з Google
            </NuxtLink>

            <NuxtLink
              to="/"
              class="flex w-full items-center justify-center rounded-2xl border border-slate-200 px-5 py-4 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
            >
              Повернутися на головну
            </NuxtLink>
          </div>

          <div
            class="mt-8 grid gap-3 rounded-[24px] bg-amber-50 p-4 text-sm text-slate-700 sm:grid-cols-3"
          >
            <div>
              <p class="font-semibold text-slate-900">200+</p>
              <p class="mt-1 text-slate-600">готових квізів</p>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Live</p>
              <p class="mt-1 text-slate-600">рейтинги та дуелі</p>
            </div>
            <div>
              <p class="font-semibold text-slate-900">Sync</p>
              <p class="mt-1 text-slate-600">прогрес між пристроями</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "empty",
});
</script>
