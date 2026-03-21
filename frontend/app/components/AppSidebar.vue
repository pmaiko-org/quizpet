<template>
  <Transition name="slide-left">
    <aside
      v-if="sidebarVisible"
      class="sidebar"
    >
      <div class="flex items-center justify-end h-(--ui-header-height) px-2">
        <UButton
          icon="i-lucide-sidebar-close"
          variant="outline"
          class="cursor-pointer"
          @click="closeSidebar"
        />
      </div>

      <div class="px-2">
        <UUser
          name="John Doe"
          description="Software Engineer"
          :avatar="{
            src: 'https://i.pravatar.cc/150?u=john-doe',
            loading: 'lazy',
            icon: 'i-lucide-image',
          }"
          class="mb-4"
        />

        <UNavigationMenu
          :items="items"
          orientation="vertical"
        />
      </div>
    </aside>
  </Transition>
</template>

<script setup lang="ts">
import type { NavigationMenuItem } from "#ui/components/NavigationMenu.vue";

const items = ref<NavigationMenuItem[]>([
  {
    label: "Guide",
    icon: "i-lucide-book-open",
    to: "/docs/getting-started",
    children: [
      {
        label: "Introduction",
        description: "Fully styled and customizable components for Nuxt.",
        icon: "i-lucide-house",
      },
      {
        label: "Installation",
        description:
          "Learn how to install and configure Nuxt UI in your application.",
        icon: "i-lucide-cloud-download",
      },
      {
        label: "Icons",
        icon: "i-lucide-smile",
        description:
          "You have nothing to do, @nuxt/icon will handle it automatically.",
      },
      {
        label: "Colors",
        icon: "i-lucide-swatch-book",
        description:
          "Choose a primary and a neutral color from your Tailwind CSS theme.",
      },
      {
        label: "Theme",
        icon: "i-lucide-cog",
        description:
          "You can customize components by using the `class` / `ui` props or in your app.config.ts.",
      },
    ],
  },
  {
    label: "Composables",
    icon: "i-lucide-database",
    to: "/docs/composables",
    children: [
      {
        label: "defineShortcuts",
        icon: "i-lucide-file-text",
        description: "Define shortcuts for your application.",
        to: "/docs/composables/define-shortcuts",
      },
      {
        label: "useOverlay",
        icon: "i-lucide-file-text",
        description: "Display a modal/slideover within your application.",
        to: "/docs/composables/use-overlay",
      },
      {
        label: "useToast",
        icon: "i-lucide-file-text",
        description: "Display a toast within your application.",
        to: "/docs/composables/use-toast",
      },
    ],
  },
  {
    label: "Components",
    icon: "i-lucide-box",
    to: "/docs/components",
    active: true,
    children: [
      {
        label: "Link",
        icon: "i-lucide-file-text",
        description: "Use NuxtLink with superpowers.",
        to: "/docs/components/link",
      },
      {
        label: "Modal",
        icon: "i-lucide-file-text",
        description: "Display a modal within your application.",
        to: "/docs/components/modal",
      },
      {
        label: "NavigationMenu",
        icon: "i-lucide-file-text",
        description: "Display a list of links.",
        to: "/docs/components/navigation-menu",
      },
      {
        label: "Pagination",
        icon: "i-lucide-file-text",
        description: "Display a list of pages.",
        to: "/docs/components/pagination",
      },
      {
        label: "Popover",
        icon: "i-lucide-file-text",
        description:
          "Display a non-modal dialog that floats around a trigger element.",
        to: "/docs/components/popover",
      },
      {
        label: "Progress",
        icon: "i-lucide-file-text",
        description: "Show a horizontal bar to indicate task progression.",
        to: "/docs/components/progress",
      },
    ],
  },
  {
    label: "GitHub",
    icon: "i-simple-icons-github",
    badge: "6k",
    to: "https://github.com/nuxt/ui",
    target: "_blank",
  },
  {
    label: "Help",
    icon: "i-lucide-circle-help",
    disabled: true,
  },
]);

const { sidebarVisible, closeSidebar } = useUiStore();
</script>

<style>
@reference "~/assets/css/main.css";

.sidebar {
  @apply fixed
  xl:sticky
  z-51
  top-0
  left-0
  w-xs
  h-dvh
  overflow-x-hidden
  overflow-y-auto
  overscroll-y-contain
  bg-default/75
  backdrop-blur
  border-r
  border-default
  will-change-transform;
}
</style>
