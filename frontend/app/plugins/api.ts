import { createRepository } from "~/repository";

export default defineNuxtPlugin(() => {
  const { getTokenEntry } = useAuthStore()

  const api = $fetch.create({
    baseURL: '/backend',
    credentials: 'omit',
    retry: false,

    async onRequest ({ options }) {
      options.headers.set('accept-language', 'uk')
      options.headers.set('authorization', getTokenEntry())
    },
  })

  return {
    provide: {
      api,
      repository: createRepository(api),
    },
  }
})