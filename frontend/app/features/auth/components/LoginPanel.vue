<template>
  <section
    class="
      relative flex items-center justify-center px-4 py-8
      sm:px-6
      lg:w-1/2 lg:px-10
      xl:px-14
    "
  >
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
        {{ $t("login.eyebrow") }}
      </p>
      <h2
        class="
          mt-4 text-3xl font-semibold tracking-tight text-slate-900
          sm:text-4xl
          dark:text-highlighted
        "
      >
        {{ $t("login.title") }}
      </h2>
      <p
        class="
          mt-4 max-w-lg text-sm/6 text-slate-600
          sm:text-base
          dark:text-toned
        "
      >
        {{ $t("login.description") }}
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
          {{ $t("login.google") }}
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
          {{ $t("login.secure") }}
        </div>

        <p
          class="
            px-2 text-center text-xs/5 text-slate-500
            dark:text-muted
          "
        >
          {{ $t("login.agreement.prefix") }}
          <NuxtLink
            :to="routes.resolve('privacy')"
            class="
              font-medium text-amber-600 underline underline-offset-2
              hover:text-amber-700
              dark:text-amber-300
              dark:hover:text-amber-200
            "
          >
            {{ $t("login.agreement.link") }}</NuxtLink>.
        </p>

        <p
          class="
            flex flex-wrap items-center justify-center gap-x-1.5 gap-y-1 px-2
            text-center text-xs/5 text-slate-400
            dark:text-muted
          "
        >
          <span>
            {{ $t("login.openSource") }}
          </span>
          <a
            :href="githubUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="$t('login.githubAria')"
            class="
              rounded-sm font-medium text-slate-600 underline-offset-2
              transition-colors
              hover:text-amber-600 hover:underline
              focus-visible:ring-2 focus-visible:ring-amber-400
              focus-visible:outline-none
              dark:text-toned
              dark:hover:text-amber-300
            "
          >GitHub</a>
          <span aria-hidden="true">·</span>
          <a
            :href="telegramUrl"
            target="_blank"
            rel="noopener noreferrer"
            :aria-label="$t('login.telegramAria')"
            class="
              rounded-sm font-medium text-slate-600 underline-offset-2
              transition-colors
              hover:text-amber-600 hover:underline
              focus-visible:ring-2 focus-visible:ring-amber-400
              focus-visible:outline-none
              dark:text-toned
              dark:hover:text-amber-300
            "
          >Telegram</a>
        </p>
      </div>

      <div
        class="
          mt-8 grid gap-3 rounded-[24px] bg-amber-50 p-4 text-sm text-slate-700
          sm:grid-cols-3
          dark:bg-white/5 dark:text-toned dark:ring-1 dark:ring-white/10
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
            {{ $t("login.metric.quizzes") }}
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
            {{ $t("login.metric.live") }}
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
            {{ $t("login.metric.sync") }}
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const routes = usePageRoutes();
const { bootstrap } = useCmsBootstrap();
const githubUrl = computed(
  () =>
    bootstrap.value?.global.socialLinks.find(link => link.label === "GitHub")
      ?.path ?? "",
);
const telegramUrl = computed(
  () =>
    bootstrap.value?.global.socialLinks.find(link => link.label === "Telegram")
      ?.path ?? "",
);
</script>
