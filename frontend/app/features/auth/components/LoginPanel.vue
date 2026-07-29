<template>
  <section
    class="
      relative flex items-center justify-center px-4 py-8
      sm:px-6
      lg:w-1/2 lg:px-10
      xl:px-14
    "
  >
    <div class="absolute top-4 right-4">
      <UColorModeSwitch />
    </div>

    <div
      class="
        w-full max-w-xl rounded-[32px] border border-slate-200/80 bg-white/88
        p-6 shadow-[0_24px_80px_rgba(15,23,42,0.12)] backdrop-blur-sm
        xl:p-8
        dark:border-default dark:bg-elevated/90
      "
    >
      <p
        class="
          text-sm font-semibold tracking-[0.3em] text-amber-600 uppercase
          dark:text-amber-300
        "
      >
        Вхід
      </p>
      <h2
        class="
          mt-4 text-3xl font-semibold tracking-tight text-slate-900
          sm:text-4xl
          dark:text-highlighted
        "
      >
        Продовжити в QuizPet
      </h2>
      <p
        class="
          mt-4 max-w-lg text-sm/6 text-slate-600
          sm:text-base
          dark:text-toned
        "
      >
        Авторизуйся через Google, щоб зберегти прогрес, результати та
        персональні добірки квізів на будь-якому пристрої.
      </p>

      <div class="mt-8 space-y-4">
        <a
          href="/backend/auth/google"
          class="
            flex w-full items-center justify-center gap-3 rounded-2xl
            bg-slate-950 px-5 py-4 text-base font-medium text-white transition
            hover:-translate-y-0.5 hover:bg-slate-800
            focus:ring-2 focus:ring-amber-400 focus:ring-offset-2
            focus:outline-none
            dark:bg-white dark:text-slate-950
            dark:hover:bg-slate-100
          "
        >
          <img
            src="/google-logo.svg"
            alt="Google"
            class="size-5 rounded-full"
          >
          Продовжити з Google
        </a>

        <div
          class="
            flex items-center justify-center gap-2.5 px-4 py-1 text-center
            text-sm text-slate-500
            dark:text-muted
          "
        >
          <UIcon
            name="i-lucide-shield-check"
            class="
              size-4 shrink-0 text-amber-600
              dark:text-amber-300
            "
          />
          Без паролів. Безпечний вхід через Google.
        </div>
      </div>

      <div
        class="
          mt-8 grid gap-3 rounded-[24px] bg-amber-50 p-4 text-sm text-slate-700
          sm:grid-cols-3
          dark:bg-amber-950/20 dark:text-toned
        "
      >
        <div>
          <p
            class="
              font-semibold text-slate-900
              dark:text-highlighted
            "
          >
            200+
          </p>
          <p
            class="
              mt-1 text-slate-600
              dark:text-muted
            "
          >
            готових квізів
          </p>
        </div>
        <div>
          <p
            class="
              font-semibold text-slate-900
              dark:text-highlighted
            "
          >
            Live
          </p>
          <p
            class="
              mt-1 text-slate-600
              dark:text-muted
            "
          >
            рейтинги та дуелі
          </p>
        </div>
        <div>
          <p
            class="
              font-semibold text-slate-900
              dark:text-highlighted
            "
          >
            Sync
          </p>
          <p
            class="
              mt-1 text-slate-600
              dark:text-muted
            "
          >
            прогрес між пристроями
          </p>
        </div>
      </div>
    </div>
  </section>
</template>
