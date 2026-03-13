// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  modules: ['@nuxtjs/tailwindcss'],
  tailwindcss: {
    cssPath: '~/assets/css/tailwind.css',
  },
  runtimeConfig: {
    // Clés privées (serveur uniquement) — jamais exposées au client
    // Surchargeables via variables d'environnement :
    //   NUXT_API_KEY, NUXT_API_BASE_URL_PROD, NUXT_API_BASE_URL_INTEG
    apiKey: 'immobox',
    apiBaseUrlProd: 'https://explorimmobox.explorimmo.com/v2/listings.json',
    apiBaseUrlInteg: 'https://imb-integration.vip.adencf.local/v2/listings.json',
  },
})
