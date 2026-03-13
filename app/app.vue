<template>
  <div class="min-h-screen bg-slate-950 text-slate-100">
    <!-- Header -->
    <header class="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 border-b border-slate-700/50 shadow-xl">
      <div class="max-w-7xl mx-auto px-6 py-5">
        <div class="flex items-center gap-4">
          <div
            @click="handleReset"
            class="flex items-center gap-4 hover:opacity-90 transition-opacity cursor-pointer select-none"
            title="Réinitialiser l'application"
          >
            <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
              <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <div>
              <h1 class="text-xl font-bold tracking-tight">Validateur Forge</h1>
              <p class="text-sm text-slate-400">Comparaison PROD vs INTEG — Annonces Immobilières</p>
            </div>
          </div>
        </div>
      </div>
    </header>

    <main class="max-w-7xl mx-auto px-6 py-8">
      <NuxtPage />
    </main>
  </div>
</template>

<script setup lang="ts">
const router = useRouter()
const { resetAll } = useCompare()

function handleReset() {
  resetAll()
  router.push('/')
}

useHead({
  titleTemplate: '%s',
  meta: [
    { name: 'description', content: 'Outil de validation des annonces immobilières entre les environnements PROD et INTEG.' },
  ],
})
</script>
