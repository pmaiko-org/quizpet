<template>
  <CmsPageRenderer :page="page" />
</template>

<script setup lang="ts">
const cmsPage = useCmsPage();

if (!cmsPage.page.value) {
  throw createError({
    statusCode: 503,
    statusMessage: "CMS page is unavailable",
  });
}

const page = computed(() => cmsPage.page.value!);

if (import.meta.server && page.value.routeName === "not-found") {
  setResponseStatus(useRequestEvent()!, 404);
}

useCmsPageSeo();
</script>
