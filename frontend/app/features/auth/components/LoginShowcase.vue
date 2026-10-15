<template>
  <section
    class="
      relative min-h-[320px] overflow-hidden
      lg:min-h-screen lg:w-1/2
    "
  >
    <NuxtImg
      src="/2FPjlAyMQTA.jpg"
      alt="Quiz Pet illustration"
      class="size-full object-cover"
    />

    <div
      class="
        absolute inset-0 bg-linear-to-tr from-slate-950/80 via-slate-900/30
        to-amber-500/25
      "
    />

    <div
      class="
        absolute inset-x-0 bottom-0 flex justify-center p-6
        sm:p-8
        lg:p-10
      "
    >
      <div
        class="
          w-full max-w-md rounded-[28px] border border-white/15 bg-white/10 p-5
          text-white backdrop-blur-md
          sm:p-6
        "
      >
        <p
          class="
            text-xs font-semibold tracking-[0.35em] text-amber-200/90 uppercase
          "
        >
          QuizPet
        </p>
        <h1
          class="
            mt-3 text-3xl/tight font-semibold
            sm:text-4xl
          "
        >
          {{ $t("login.showcase.title") }}
        </h1>
        <p
          class="
            mt-3 text-sm/6 text-white/78
            sm:text-base
          "
        >
          {{ $t("login.showcase.description") }}
        </p>
      </div>
    </div>
  </section>
</template>
