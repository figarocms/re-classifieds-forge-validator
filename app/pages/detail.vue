<template>
  <div>
    <!-- Bouton retour -->
    <div class="mb-6">
      <button
        @click="goBack"
        class="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-primary-400 transition-colors group"
      >
        <svg class="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
        Retour à la liste
      </button>
    </div>

    <!-- Pas de données -->
    <div v-if="!prodListing && !integListing" class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/30 flex items-center justify-center">
        <svg class="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-400 mb-2">Aucune annonce sélectionnée</h3>
      <p class="text-sm text-slate-500 mb-6">Retournez à la liste pour sélectionner une annonce à comparer.</p>
      <button
        @click="goBack"
        class="bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/20"
      >
        Retour à la liste
      </button>
    </div>

    <!-- Comparaison détaillée -->
    <div v-else class="space-y-6">
      <!-- Titre de l'annonce -->
      <div class="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-5 shadow-xl">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 rounded-xl bg-gradient-to-br from-primary-500 to-primary-600 flex items-center justify-center shadow-lg shadow-primary-500/20">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
            </svg>
          </div>
          <div>
            <h2 class="text-lg font-bold text-slate-200">Comparaison PROD vs INTEG</h2>
            <p class="text-sm text-slate-400">
              Annonce
              <button
                v-if="selectedRef"
                type="button"
                @click="copyRefToClipboard"
                class="inline-flex items-center gap-1.5 font-mono hover:text-primary-400 focus:text-primary-400 focus:outline-none rounded px-1 -mx-1 hover:bg-slate-700/50 focus:bg-slate-700/50 transition-colors"
                :title="`Copier ${selectedRef}`"
              >{{ selectedRef }}</button>
              <template v-else>{{ selectedRef }}</template>
              — {{ getMainTitle() }}
              <span v-if="refCopied" class="text-primary-400 text-xs">Copié</span>
            </p>
            <div class="flex flex-wrap items-center gap-3 mt-2 text-xs text-slate-500">
              <div v-if="prodListing" class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-sky-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-sky-300">PROD:</span>
                <span>{{ prodModifiedDate }}</span>
              </div>
              <div v-if="integListing" class="flex items-center gap-1.5">
                <svg class="w-3.5 h-3.5 text-amber-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span class="text-amber-300">INTEG:</span>
                <span>{{ integModifiedDate }}</span>
              </div>
            </div>
            <p v-if="searchParams.partenaire || searchParams.codeAgence" class="text-xs text-slate-500 mt-1 flex items-center gap-1.5">
              <svg class="w-3.5 h-3.5 text-slate-500" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
              </svg>
              {{ searchParams.partenaire }}<span class="text-slate-600">·</span>Agence {{ searchParams.codeAgence }}
              <img
                v-if="searchParams.mediaId === '1'"
                src="/logos/fi.svg"
                alt="Figaro Immobilier"
                class="w-6 h-6 rounded ml-1.5"
              />
              <img
                v-if="searchParams.mediaId === '9'"
                src="/logos/plf.svg"
                alt="Propriétés Le Figaro"
                class="w-6 h-6 rounded ml-1.5"
              />
              <img
                v-if="searchParams.mediaId === '2'"
                src="/logos/fi9.svg"
                alt="Figaro Immoneuf"
                class="w-6 h-6 rounded ml-1.5"
              />
            </p>
            <p v-if="prodListing || integListing" class="text-xs text-slate-500 mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              <span v-if="prodListing" class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                Dernière modif. PROD : {{ getLastModification(prodListing) }}
              </span>
              <span v-if="integListing" class="flex items-center gap-1.5">
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                Dernière modif. INTEG : {{ getLastModification(integListing) }}
              </span>
            </p>
            <div class="flex flex-wrap items-center gap-2 mt-2">
              <button
                v-if="prodListing"
                @click="openListingUrl('PROD')"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-sky-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="getListingUrl('PROD')"
              >
                <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                API PROD
              </button>
              <button
                v-if="integListing"
                @click="openListingUrl('INTEG')"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-amber-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="getListingUrl('INTEG')"
              >
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                API INTEG
              </button>
              <span class="w-px h-4 bg-slate-700 mx-1"></span>
              <a
                v-if="prodListing?.id"
                :href="getBackendListingUrl('PROD', prodListing.id)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-sky-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="`Backend PROD — ID ${prodListing.id}`"
              >
                <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                BO PROD
              </a>
              <a
                v-if="integListing?.id"
                :href="getBackendListingUrl('INTEG', integListing.id)"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-amber-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="`Backend INTEG — ID ${integListing.id}`"
              >
                <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                BO INTEG
              </a>
              <span class="w-px h-4 bg-slate-700 mx-1"></span>
              <a
                v-if="temporalWorkflowsUrl"
                :href="temporalWorkflowsUrl"
                target="_blank"
                rel="noopener noreferrer"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-primary-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="`Temporal — CustomerReference=${selectedRef}`"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                TEMPORAL
              </a>
              <span class="w-px h-4 bg-slate-700 mx-1"></span>
              <button
                v-if="findOriginParams"
                @click="copyFindOrigin"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-500 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-primary-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="findOriginCommand"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                FILE LINE
              </button>
              <button
                v-if="findOriginMapCommand"
                @click="copyFindOriginMap"
                class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-500 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-primary-500/30 rounded-lg px-2.5 py-1.5 transition-all"
                :title="findOriginMapCommand"
              >
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                </svg>
                MAP FILE LINE
              </button>
              <span v-if="copiedFindOrigin" class="text-xs text-primary-400 ml-1">Copié</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Résumé global -->
      <div class="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <h2 class="text-lg font-semibold text-slate-200 mb-4 flex items-center gap-2">
          <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Résumé
        </h2>
        <div class="flex flex-wrap gap-4">
          <div class="flex-1 min-w-[120px] bg-slate-800/60 rounded-xl p-4 text-center border border-slate-700/30">
            <p class="text-2xl font-bold text-slate-100">{{ totalFields }}</p>
            <p class="text-xs text-slate-400 mt-1">Champs comparés</p>
          </div>
          <div class="flex-1 min-w-[120px] bg-emerald-900/20 rounded-xl p-4 text-center border border-emerald-500/20">
            <p class="text-2xl font-bold text-emerald-400">{{ matchCount }}</p>
            <p class="text-xs text-slate-400 mt-1">Identiques</p>
          </div>
          <div class="flex-1 min-w-[120px] bg-red-900/20 rounded-xl p-4 text-center border border-red-500/20">
            <p class="text-2xl font-bold text-red-400">{{ diffCount }}</p>
            <p class="text-xs text-slate-400 mt-1">Différences</p>
          </div>
          <div v-if="missingIntegCount > 0" class="flex-1 min-w-[120px] bg-amber-900/20 rounded-xl p-4 text-center border border-amber-500/20">
            <p class="text-2xl font-bold text-amber-400">{{ missingIntegCount }}</p>
            <p class="text-xs text-amber-300/70 mt-1">Manque INTEG</p>
          </div>
          <div v-if="missingProdCount > 0" class="flex-1 min-w-[120px] bg-sky-900/20 rounded-xl p-4 text-center border border-sky-500/20">
            <p class="text-2xl font-bold text-sky-400">{{ missingProdCount }}</p>
            <p class="text-xs text-sky-300/70 mt-1">Manque PROD</p>
          </div>
          <div v-if="naCount > 0" class="flex-1 min-w-[120px] bg-slate-800/40 rounded-xl p-4 text-center border border-slate-600/20">
            <p class="text-2xl font-bold text-slate-400">{{ naCount }}</p>
            <p class="text-xs text-slate-400 mt-1">Non transmises</p>
          </div>
        </div>

        <!-- Bandeau Succès si 0 différence et 0 manquante -->
        <div v-if="diffCount === 0 && missingOneCount === 0 && totalFields > 0" class="mt-4 bg-emerald-900/30 border border-emerald-500/30 rounded-xl px-5 py-3 flex items-center gap-3">
          <svg class="w-6 h-6 text-emerald-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <p class="text-sm font-semibold text-emerald-300">✅ Succès — PROD et INTEG sont ISO</p>
        </div>
        <!-- Bandeau Avertissement si 0 diff mais des manquantes -->
        <div v-else-if="diffCount === 0 && missingOneCount > 0 && totalFields > 0" class="mt-4 bg-amber-900/30 border border-amber-500/30 rounded-xl px-5 py-3 flex items-center gap-3">
          <svg class="w-6 h-6 text-amber-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p class="text-sm font-semibold text-amber-300">⚠️ Attention — {{ missingOneCount }} donnée(s) présente(s) d'un côté uniquement</p>
        </div>
      </div>

      <!-- Vignettes photos : PROD (gauche) / INTEG (droite) -->
      <div class="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 shadow-xl">
        <button @click="photosExpanded = !photosExpanded" class="w-full flex items-center justify-between group cursor-pointer">
          <div class="flex items-center gap-3">
            <span class="text-xl">📸</span>
            <h3 class="text-base font-semibold text-slate-200">Photos</h3>
            <span class="text-xs text-slate-500">PROD: {{ prodPhotos.length }} · INTEG: {{ integPhotos.length }}</span>
          </div>
          <svg
            class="w-5 h-5 text-slate-400 group-hover:text-slate-200 transition-all duration-200"
            :class="{ 'rotate-180': photosExpanded }"
            fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div v-show="photosExpanded" class="mt-5 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Photos PROD (gauche) -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2.5 h-2.5 rounded-full bg-sky-400"></div>
              <span class="text-sm font-semibold text-sky-300">PROD</span>
              <span class="text-xs text-slate-500">({{ prodPhotos.length }} photo{{ prodPhotos.length > 1 ? 's' : '' }})</span>
            </div>
            <div v-if="prodPhotos.length === 0" class="bg-slate-800/40 rounded-lg p-4 text-center">
              <p class="text-xs text-slate-500">Aucune photo</p>
            </div>
            <div v-else class="grid grid-cols-4 xl:grid-cols-5 gap-2">
              <div
                v-for="(photo, idx) in prodPhotos"
                :key="'prod-photo-' + idx"
                class="aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700/30"
              >
                <img
                  :src="getPhotoUrl(photo)"
                  :alt="'PROD photo ' + (idx as number + 1)"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            </div>
          </div>

          <!-- Photos INTEG (droite) -->
          <div>
            <div class="flex items-center gap-2 mb-3">
              <div class="w-2.5 h-2.5 rounded-full bg-amber-400"></div>
              <span class="text-sm font-semibold text-amber-300">INTEG</span>
              <span class="text-xs text-slate-500">({{ integPhotos.length }} photo{{ integPhotos.length > 1 ? 's' : '' }})</span>
            </div>
            <div v-if="integPhotos.length === 0" class="bg-slate-800/40 rounded-lg p-4 text-center">
              <p class="text-xs text-slate-500">Aucune photo</p>
            </div>
            <div v-else class="grid grid-cols-4 xl:grid-cols-5 gap-2">
              <div
                v-for="(photo, idx) in integPhotos"
                :key="'integ-photo-' + idx"
                class="aspect-square rounded-lg overflow-hidden bg-slate-800 border border-slate-700/30"
              >
                <img
                  :src="getPhotoUrl(photo)"
                  :alt="'INTEG photo ' + (idx as number + 1)"
                  class="w-full h-full object-cover hover:scale-110 transition-transform duration-200"
                  loading="lazy"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Tableaux par catégorie -->
      <div v-for="category in comparisonCategories" :key="category.name" class="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl overflow-hidden shadow-xl">
        <div class="px-6 py-4 border-b border-slate-700/50 flex items-center gap-3">
          <span class="text-xl">{{ category.icon }}</span>
          <h3 class="text-base font-semibold text-slate-200">{{ category.name }}</h3>
        </div>

        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead>
              <tr class="text-slate-400 text-xs uppercase tracking-wider">
                <th class="text-left px-6 py-3 w-1/4">Champ</th>
                <th class="text-left px-6 py-3">
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-sky-400"></span>
                    Valeur PROD
                  </span>
                </th>
                <th class="text-left px-6 py-3">
                  <span class="inline-flex items-center gap-1.5">
                    <span class="w-2 h-2 rounded-full bg-amber-400"></span>
                    Valeur INTEG
                  </span>
                </th>
                <th class="text-center px-6 py-3 w-1/8">Statut</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="(field, idx) in category.fields"
                :key="field.path"
                :class="[
                  idx % 2 === 0 ? 'bg-slate-800/30' : 'bg-slate-800/10',
                  'hover:bg-slate-700/30 transition-colors'
                ]"
              >
                <td class="px-6 py-3 font-medium text-slate-300">{{ field.label }}</td>
                <td class="px-6 py-3 text-slate-200 font-mono text-xs">{{ getFieldValue(prodListing, field.path) }}</td>
                <td class="px-6 py-3 text-slate-200 font-mono text-xs">{{ getFieldValue(integListing, field.path) }}</td>
                <td class="px-6 py-3 text-center">
                  <span
                    :class="getStatusClass(field)"
                    class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold transition-all"
                  >
                    <span class="w-1.5 h-1.5 rounded-full" :class="getStatusDotClass(field)" />
                    {{ getStatusText(field) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Validateur Forge — Détail comparatif',
})

const router = useRouter()
const route = useRoute()

const { selectedProdListing, selectedIntegListing, selectedRef, selectListing, searchParams, prodData, integData } = useCompare()

// Si la ref vient de l'URL (rechargement de page), la restaurer
const refFromQuery = route.query.ref as string
if (refFromQuery && !selectedRef.value) {
  selectListing(decodeURIComponent(refFromQuery))
}

const prodListing = computed(() => selectedProdListing.value)
const integListing = computed(() => selectedIntegListing.value)

// Toggle photos
const photosExpanded = ref(true)

// Copy URL spécifique à l'annonce
const copiedEnv = ref('')

// Params pour make find-origin / find-origin-map (priorité INTEG puis PROD)
const findOriginParams = computed(() => {
  const listing = integListing.value || prodListing.value
  if (!listing?.property?.reference) return null
  const ref = listing.property.reference
  const advertiserId = listing.property.advertiser_id ?? listing.advertiser_id
  if (advertiserId == null) return null
  const gw = listing.gateways
  const gatewayName = Array.isArray(gw) && gw.length > 0 ? (gw[0]?.name || gw[0]?.code || '') : ''
  return { reference: ref, advertiserId: String(advertiserId), gatewayId: String(gatewayName).toLowerCase() || undefined }
})

const findOriginCommand = computed(() => {
  const p = findOriginParams.value
  if (!p) return ''
  return `make find-origin REFERENCE="${p.reference}" ADVERTISER_ID=${p.advertiserId}`
})

const findOriginMapCommand = computed(() => {
  const p = findOriginParams.value
  if (!p || !p.gatewayId) return ''
  return `make find-origin-map REFERENCE="${p.reference}" ADVERTISER_ID=${p.advertiserId} GATEWAY_ID=${p.gatewayId}`
})

const copiedFindOrigin = ref<'find-origin' | 'find-origin-map' | null>(null)

const refCopied = ref(false)

async function copyRefToClipboard() {
  const ref = selectedRef.value
  if (!ref) return
  try {
    await navigator.clipboard.writeText(ref)
    refCopied.value = true
    setTimeout(() => { refCopied.value = false }, 2000)
  } catch (_) {}
}

async function copyFindOrigin() {
  const cmd = findOriginCommand.value
  if (!cmd) return
  try {
    await navigator.clipboard.writeText(cmd)
    copiedFindOrigin.value = 'find-origin'
    setTimeout(() => { copiedFindOrigin.value = null }, 2000)
  } catch (_) {}
}

async function copyFindOriginMap() {
  const cmd = findOriginMapCommand.value
  if (!cmd) return
  try {
    await navigator.clipboard.writeText(cmd)
    copiedFindOrigin.value = 'find-origin-map'
    setTimeout(() => { copiedFindOrigin.value = null }, 2000)
  } catch (_) {}
}

const LISTING_BASE_URLS: Record<string, string> = {
  PROD: 'https://explorimmobox.explorimmo.com/v2/listings.json?api_key=immobox',
  INTEG: 'https://imb-integration.vip.adencf.local/v2/listings.json?api_key=immobox',
}

const BACKEND_ADMIN_BASE_URLS: Record<string, string> = {
  PROD: 'https://explorimmobox.explorimmo.com/v1/backend.php/listing/',
  INTEG: 'http://imb-integration.vip.adencf.local/v1/backend.php/listing/',
}

function getBackendListingUrl(env: string, immoboxId: number | string): string {
  const base = BACKEND_ADMIN_BASE_URLS[env]
  return base ? `${base}${immoboxId}` : ''
}

const TEMPORAL_WORKFLOWS_BASE = 'http://localhost:8233/namespaces/default/workflows'

const temporalWorkflowsUrl = computed(() => {
  const ref = selectedRef.value || integListing.value?.property?.reference || prodListing.value?.property?.reference
  if (!ref) return ''
  const query = '`CustomerReference`="' + ref + '"'
  return `${TEMPORAL_WORKFLOWS_BASE}?query=${encodeURIComponent(query)}`
})

function getListingUrl(env: string): string {
  const listing = env === 'PROD' ? prodListing.value : integListing.value
  const reference = listing?.property?.reference
  if (!reference) return ''
  // Utiliser _apiUrl du composable (remontée par le serveur)
  const data = env === 'PROD' ? prodData.value?._apiUrl : integData.value?._apiUrl
  if (!data) return ''
  // Extraire la base URL (avant les filtres) et construire l'URL d'annonce individuelle
  const baseMatch = data.match(/^[^?]+\?api_key=[^&]+/)
  if (!baseMatch) return ''
  return `${baseMatch[0]}&filters[property.reference]=${encodeURIComponent(reference)}&start=0&limit=1`
}

function openListingUrl(env: string) {
  const url = getListingUrl(env)
  if (url) window.open(url, '_blank')
}

// Extraire les photos
const prodPhotos = computed(() => {
  if (!prodListing.value) return []
  return prodListing.value.photos || []
})

const integPhotos = computed(() => {
  if (!integListing.value) return []
  return integListing.value.photos || []
})

function getPhotoUrl(photo: any): string {
  if (typeof photo === 'string') return photo
  if (photo?.src) {
    if (typeof photo.src === 'string') return photo.src
    // API Immobox uses: s (small), xl (extra-large), raw (original)
    return photo.src.xl || photo.src.raw || photo.src.s || photo.src.medium || photo.src.small || photo.src.large || photo.src.original || ''
  }
  return photo?.url || photo?.uri || ''
}

function goBack() {
  router.push('/')
}

function getMainTitle(): string {
  const listing = prodListing.value || integListing.value
  if (!listing) return '—'
  const type = listing.property_type?.name || 'Bien'
  const city = listing.property?.address?.city || ''
  return [type, city].filter(Boolean).join(' — ')
}

function getLastModification(listing: any): string {
  const raw = listing?.updated_at
  if (!raw || raw === 'null') return '—'
  const d = new Date(raw)
  if (isNaN(d.getTime())) return String(raw)
  return new Intl.DateTimeFormat('fr-FR', { dateStyle: 'short', timeStyle: 'medium' }).format(d)
}

function formatDate(dateString: string | undefined | null): string {
  if (!dateString) return '—'
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) return '—'
    return new Intl.DateTimeFormat('fr-FR', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date)
  } catch {
    return '—'
  }
}

const prodModifiedDate = computed(() => {
  const listing = prodListing.value
  if (!listing) return '—'
  return formatDate(listing.updated_at || listing.modified_at || listing.last_modified)
})

const integModifiedDate = computed(() => {
  const listing = integListing.value
  if (!listing) return '—'
  return formatDate(listing.updated_at || listing.modified_at || listing.last_modified)
})

// Définition des catégories de comparaison (sans Médias car les photos sont affichées en vignettes)
const fieldDefinitions = [
  {
    name: 'Identification',
    icon: '🏷️',
    fields: [
      { label: 'ID', path: 'id' },
      { label: 'Code passerelle', path: 'property.gateway_code' },
      { label: 'Passerelle', path: '_gatewayName' },
      { label: 'Réf. mandat', path: 'fields.mandat_reference_fr' },
    ],
  },
  {
    name: 'Localisation',
    icon: '📍',
    fields: [
      { label: 'Ville', path: 'property.address.city' },
      { label: 'Code Postal', path: 'property.address.zipcode' },
      { label: 'Quartier', path: 'fields.quartier_fr' },
    ],
  },
  {
    name: 'Caractéristiques',
    icon: '🏠',
    fields: [
      { label: 'Type de transaction', path: 'property.property_deal.name' },
      { label: 'Type de bien', path: '_propertyTypeName' },
      { label: 'Famille de bien', path: '_propertyTypeFamilyName' },
      { label: 'Surface (m²)', path: 'fields.surface_fr' },
      { label: 'Surface terrain (m²)', path: 'fields.surface_terrain_fr' },
      { label: 'Pièces', path: 'fields.nb_piece_fr' },
      { label: 'Chambres', path: 'fields.nb_chambre_fr' },
      { label: 'Salles de bains', path: 'fields.nb_sd_bains_fr' },
      { label: 'WC', path: 'fields.nb_wc_fr' },
      { label: 'Places de parking', path: 'fields.places_parking_fr' },
      { label: 'Terasses', path: 'fields.nb_terasse_fr' },
      { label: 'Box', path: 'fields.nb_box_fr' },
      { label: 'Exposition', path: 'fields.exposition_fr' },
      { label: 'Visite virtuelle', path: 'fields.visite_virtuelle_fr' },
      { label: 'Copropriété', path: 'fields.copropriete_fr' },
      { label: 'État', path: 'fields.etat_fr' },
    ],
  },
  {
    name: 'Equipement',
    icon: '🛋️',
    fields: [
      { label: 'Type de chauffage', path: 'fields.type_chauffage_fr' },
      { label: 'Type de cuisine', path: 'fields.type_cuisine_fr' },
      { label: 'Meublé', path: 'fields.meuble_fr' },
      { label: 'Confort', path: 'fields.confort_fr' },
      { label: 'Confort PDF', path: 'fields.confort_pdf_fr' },
    ],
  },
  {
    name: 'Descriptif',
    icon: '📝',
    fields: [
      { label: 'Description', path: 'fields.description_fr' },
    ],
  },
  {
    name: 'DPE',
    icon: '⚡',
    fields: [
      { label: 'Date DPE', path: 'fields.date_dpe_fr' },
      { label: 'Consommation énergie', path: 'fields.dpe_valeur_consommation_fr' },
      { label: 'Classe GES', path: 'fields.dpe_etiquette_gaz_effet_serre_fr' },
      { label: 'Classe énergie', path: 'fields.dpe_etiquette_consommation_fr' },
      { label: 'Émission GES', path: 'fields.dpe_valeur_gaz_effet_serre_fr' },
    ],
  },
  {
    name: 'Contact',
    icon: '👤',
    fields: [
      { label: 'Email', path: 'fields.contact_email_fr' },
      { label: 'Tél. négociateur', path: 'fields.nego_tel_fr' },
      { label: 'Téléphone', path: 'fields.contact_tel_fr' },
      { label: 'Nom contact', path: 'fields.contact_name_fr' },
    ],
  },
  {
    name: 'Financier',
    icon: '💰',
    fields: [
      { label: 'Prix', path: 'fields.price_fr' },
      { label: 'Honoraires', path: 'fields.honoraires_fr' },
      { label: 'Prix nous consulter', path: 'fields.prix_nous_consulter_fr' },
      { label: 'Taxe foncière', path: 'fields.taxe_fonciere_fr' },
      { label: 'Charge honoraires', path: 'fields.charge_honoraires_fr' },
    ],
  },
  {
    name: 'Médias',
    icon: '📷',
    fields: [
      { label: 'Nombre de photos', path: '_photoCount' },
      { label: 'Vidéo', path: 'fields.video_fr' },
    ],
  },
  {
    name: 'Programme Neuf',
    icon: '🏗️',
    fi9Only: true,
    fields: [
      { label: 'Nom du programme', path: 'fields.titre_fr' },
      { label: 'Date de livraison', path: 'fields.delivery_date_fr' },
      { label: 'Est un programme', path: '_isProgram' },
      { label: 'Statut fiscal', path: 'fields.tax_status_fr' },
      { label: 'Étage', path: 'fields.etage_fr' },
      { label: 'Parking', path: 'fields.parking_fr' },
      { label: 'Lot détaillé', path: 'fields.detailed_lot_fr' },
      { label: 'Visite virtuelle 3D', path: 'fields.virtual_tour_3d_fr' },
      { label: 'Bureau de vente', path: 'fields.sales_office_address_fr' },
      { label: 'Horaires bureau de vente', path: 'fields.sales_office_schedule_fr' },
      { label: 'ID programme parent', path: 'property.program_id' },
      { label: 'ID listing programme', path: 'listing_program_id' },
    ],
  },
]

// Comparaison des champs
const comparisonCategories = computed(() => {
  return fieldDefinitions
    .filter((cat: any) => !cat.fi9Only || searchParams.value.mediaId === '2')
    .map((cat) => ({
    ...cat,
    fields: cat.fields.map((field: any) => ({
      ...field,
      prodValue: getFieldValue(prodListing.value, field.path),
      integValue: getFieldValue(integListing.value, field.path),
    })),
  }))
})

// Statistiques
const totalFields = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.length, 0))
const matchCount = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.filter((f: any) => getStatusText(f) === 'OK').length, 0))
const diffCount = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.filter((f: any) => getStatusText(f) === 'DIFF').length, 0))
// Données manquantes d'un seul côté (potentiel dysfonctionnement)
const missingOneCount = computed(() => missingIntegCount.value + missingProdCount.value)
const missingIntegCount = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.filter((f: any) => getStatusText(f) === 'MANQUE INTEG').length, 0))
const missingProdCount = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.filter((f: any) => getStatusText(f) === 'MANQUE PROD').length, 0))
// Données absentes des deux côtés (non transmises par la source)
const naCount = computed(() => comparisonCategories.value.reduce((sum: number, cat: any) => sum + cat.fields.filter((f: any) => getStatusText(f) === 'N/A').length, 0))

function getFieldValue(obj: any, path: string): string {
  if (!obj) return '—'

  // Champs spéciaux calculés
  if (path === '_photoCount') {
    const photos = obj.photos || []
    return String(photos.length)
  }
  if (path === '_gatewayName') {
    const gw = obj.gateways
    if (Array.isArray(gw) && gw.length > 0) return gw[0]?.name || '—'
    return '—'
  }
  if (path === '_propertyTypeName') {
    return obj.property_type?.name || '—'
  }
  if (path === '_propertyTypeFamilyName') {
    return obj.property_type?.property_type_family?.name || '—'
  }
  if (path === '_isProgram') {
    return obj.property?.is_program === true ? 'Oui' : 'Non'
  }

  const parts = path.split('.')
  let value = obj
  for (const part of parts) {
    if (value == null) return '—'
    value = value[part]
  }

  if (value == null || value === '') return '—'
  if (typeof value === 'object') {
    if (Array.isArray(value)) {
      // Special handling for confort arrays: remove "vue_degagee" and sort
      if (path === 'fields.confort_fr') {
        const filtered = value.filter((item: any) => item !== 'vue_degagee')
        const sorted = [...filtered].sort((a: any, b: any) => String(a).localeCompare(String(b)))
        return JSON.stringify(sorted)
      }
      // For other arrays, sort them before stringifying
      const sorted = [...value].sort((a: any, b: any) => String(a).localeCompare(String(b)))
      return JSON.stringify(sorted)
    }
    if (value.name) return String(value.name)
    return JSON.stringify(value)
  }
  return String(value)
}

// Normalize Euro variants (e.g. U+0080 legacy vs U+20AC) to canonical € before comparing description
function normalizeDescriptionForCompare(s: string): string {
  return s.replace(/\u0080|\u20AC/g, '\u20AC')
}

// For confort_fr, strip "vue_degage" from integ array before comparing (INTEG-only quirk)
function integValueForConfortCompare(iv: string): string {
  try {
    const arr = JSON.parse(iv)
    if (Array.isArray(arr)) {
      const filtered = arr.filter((x: any) => String(x).toLowerCase() !== 'vue_degage')
      return JSON.stringify(filtered)
    }
  } catch (_) {}
  return iv
}

function getStatusText(field: any): string {
  const pv = String(field.prodValue ?? '—')
  let iv = String(field.integValue ?? '—')
  if (field.path === 'fields.confort_fr') iv = integValueForConfortCompare(iv)
  if (pv === '—' && iv === '—') return 'N/A'
  if (pv !== '—' && iv === '—') return 'MANQUE INTEG'
  if (pv === '—' && iv !== '—') return 'MANQUE PROD'
  if (field.path === 'fields.description_fr') {
    const npv = normalizeDescriptionForCompare(pv)
    const niv = normalizeDescriptionForCompare(iv)
    return npv.length === niv.length ? 'OK' : 'DIFF'
  }
  if (valuesEqualForCompare(pv, iv)) return 'OK'
  return normalize(pv) === normalize(iv) ? 'OK' : 'DIFF'
}

function getStatusClass(field: any): string {
  const status = getStatusText(field)
  if (status === 'OK') return 'bg-emerald-900/40 text-emerald-300 border border-emerald-500/20'
  if (status === 'DIFF') return 'bg-red-900/40 text-red-300 border border-red-500/20'
  if (status === 'MANQUE INTEG') return 'bg-amber-900/40 text-amber-300 border border-amber-500/20'
  if (status === 'MANQUE PROD') return 'bg-sky-900/40 text-sky-300 border border-sky-500/20'
  return 'bg-slate-800/40 text-slate-400 border border-slate-600/20'
}

function getStatusDotClass(field: any): string {
  const status = getStatusText(field)
  if (status === 'OK') return 'bg-emerald-400'
  if (status === 'DIFF') return 'bg-red-400'
  if (status === 'MANQUE INTEG') return 'bg-amber-400'
  if (status === 'MANQUE PROD') return 'bg-sky-400'
  return 'bg-slate-500'
}

function normalize(value: string): string {
  return value.toString().trim().toLowerCase()
}

// Compare two values for equality; for arrays, order is ignored (same set = equal)
function valuesEqualForCompare(pv: string, iv: string): boolean {
  if (pv === iv) return true
  try {
    const a = JSON.parse(pv)
    const b = JSON.parse(iv)
    if (Array.isArray(a) && Array.isArray(b)) {
      const sortKey = (x: any) => (typeof x === 'object' && x !== null ? JSON.stringify(x) : String(x))
      const sortedA = [...a].sort((x, y) => sortKey(x).localeCompare(sortKey(y)))
      const sortedB = [...b].sort((x, y) => sortKey(x).localeCompare(sortKey(y)))
      return JSON.stringify(sortedA) === JSON.stringify(sortedB)
    }
  } catch (_) {
    /* not JSON or not arrays */
  }
  return false
}

// ── Exports ──────────────────────────────────────────────────

function exportPdf() {
  window.print()
}

function exportComparisonJson() {
  const data = {
    reference: selectedRef.value,
    partenaire: searchParams.value.partenaire,
    codeAgence: searchParams.value.codeAgence,
    mediaId: searchParams.value.mediaId,
    exportDate: new Date().toISOString(),
    summary: {
      totalFields: totalFields.value,
      identiques: matchCount.value,
      differences: diffCount.value,
      manqueInteg: missingIntegCount.value,
      manqueProd: missingProdCount.value,
      nonTransmises: naCount.value,
    },
    categories: comparisonCategories.value.map((cat: any) => ({
      name: cat.name,
      fields: cat.fields.map((field: any) => ({
        label: field.label,
        path: field.path,
        prodValue: field.prodValue,
        integValue: field.integValue,
        status: getStatusText(field),
      })),
    })),
  }

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparaison_${selectedRef.value || 'export'}_${new Date().toISOString().slice(0, 10)}.json`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
