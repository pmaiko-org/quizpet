<template>
  <section
    class="
      overflow-hidden border-y border-default bg-slate-950 py-16
      sm:py-24
    "
  >
    <UContainer>
      <div
        class="
          mb-10 max-w-3xl text-white
          sm:mb-14
        "
      >
        <p
          v-if="eyebrow"
          class="
            text-sm font-semibold tracking-[0.24em] text-blue-300 uppercase
          "
        >
          {{ eyebrow }}
        </p>
        <h2
          class="
            mt-3 text-4xl font-semibold tracking-[-0.04em] text-balance
            sm:text-5xl
          "
        >
          {{ title }}
        </h2>
        <p
          v-if="summary"
          class="mt-5 text-lg/8 text-white/65"
        >
          {{ summary }}
        </p>
      </div>

      <UCarousel
        :items="slides"
        :autoplay="autoplay ? { delay: 5500, stopOnInteraction: true } : false"
        arrows
        dots
        loop
        :prev="{ color: 'neutral', variant: 'soft', size: 'xl' }"
        :next="{ color: 'neutral', variant: 'soft', size: 'xl' }"
        :ui="{
          item: 'basis-full',
          controls: 'mt-7 flex items-center justify-between gap-5',
          arrows: 'flex gap-2',
          prev: 'relative inset-auto top-auto translate-y-0',
          next: 'relative inset-auto top-auto translate-y-0',
          dots: 'relative inset-auto bottom-auto justify-end',
        }"
      >
        <template #default="{ item, index }">
          <article
            class="
              relative min-h-152 overflow-hidden rounded-4xl border
              border-white/15 bg-slate-900 shadow-2xl shadow-black/30
              sm:min-h-160
            "
          >
            <NuxtImg
              :src="item.imageUrl"
              :alt="item.imageAlt"
              class="absolute inset-0 size-full object-cover"
              sizes="100vw lg:1200px"
              :loading="index === 0 ? 'eager' : 'lazy'"
            />
            <div
              class="
                absolute inset-0 bg-linear-to-t from-slate-950 via-slate-950/45
                to-slate-950/5
                md:bg-linear-to-r md:from-slate-950 md:via-slate-950/72
                md:to-slate-950/5
              "
            />
            <div
              class="
                absolute inset-x-0 bottom-0 z-10 flex max-w-3xl flex-col p-7
                text-white
                sm:p-10
                md:inset-y-0 md:right-auto md:bottom-auto md:justify-center
                md:p-14
              "
            >
              <div class="flex items-center gap-3">
                <span
                  class="
                    flex size-12 items-center justify-center rounded-2xl
                    bg-blue-400/18 text-blue-200 ring-1 ring-blue-200/25
                    backdrop-blur-md
                  "
                >
                  <UIcon
                    :name="item.icon"
                    class="size-6"
                  />
                </span>
                <span
                  class="
                    rounded-full bg-white/10 px-3 py-1 text-xs font-semibold
                    tracking-[0.18em] text-white/75 ring-1 ring-white/15
                    backdrop-blur-md
                  "
                >
                  {{ String(index + 1).padStart(2, "0") }} /
                  {{ String(slides.length).padStart(2, "0") }}
                </span>
              </div>
              <p
                v-if="item.eyebrow"
                class="
                  mt-7 text-xs font-semibold tracking-[0.22em] text-blue-200
                  uppercase
                "
              >
                {{ item.eyebrow }}
              </p>
              <h3
                class="
                  mt-3 max-w-2xl text-3xl font-semibold tracking-[-0.035em]
                  text-balance
                  sm:text-5xl
                "
              >
                {{ item.title }}
              </h3>
              <p
                class="
                  mt-5 max-w-xl text-base/7 text-white/75
                  sm:text-lg/8
                "
              >
                {{ item.description }}
              </p>
            </div>
          </article>
        </template>
      </UCarousel>
    </UContainer>
  </section>
</template>

<script setup lang="ts">
interface ISliderItem {
  id?: number;
  eyebrow?: string | null;
  title: string;
  description: string;
  imageUrl: string;
  imageAlt: string;
  icon: string;
}

const { eyebrow, title, summary, slides, autoplay } = defineProps<{
  eyebrow?: string | null;
  title: string;
  summary?: string | null;
  slides: ISliderItem[];
  autoplay: boolean;
}>();
</script>
