export default defineNuxtPlugin(() => {
  const cms = $fetch.create({
    baseURL: useCmsUrl(),
    headers: {
      Accept: "application/json",
    },
  });

  return {
    provide: {
      cms,
    },
  };
});
