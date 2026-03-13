<template>
  <div>
    <!-- Formulaire de recherche -->
    <div class="bg-slate-900/80 backdrop-blur border border-slate-700/50 rounded-2xl p-6 mb-8 shadow-xl">
      <h2 class="text-lg font-semibold mb-5 text-slate-200 flex items-center gap-2">
        <svg class="w-5 h-5 text-primary-400" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Recherche
      </h2>

      <form @submit.prevent="handleSubmit" class="space-y-5">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <!-- Partenaire -->
          <div>
            <label for="partenaire" class="block text-sm font-medium text-slate-400 mb-1.5">Partenaire</label>
            <select
              id="partenaire"
              v-model="form.partenaire"
              class="w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            >
              <option value="">— Sélectionner —</option>
              <option v-for="p in partenaires" :key="p" :value="p">{{ p }}</option>
            </select>
          </div>

          <!-- Code Agence -->
          <div>
            <label for="codeAgence" class="block text-sm font-medium text-slate-400 mb-1.5">Code Agence</label>
            <input
              id="codeAgence"
              v-model="form.codeAgence"
              type="text"
              placeholder="Ex: 12345"
              class="w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            />
          </div>

          <!-- Réf Client -->
          <div>
            <label for="refClient" class="block text-sm font-medium text-slate-400 mb-1.5">Réf Client <span class="text-slate-500">(optionnel)</span></label>
            <input
              id="refClient"
              v-model="form.refClient"
              type="text"
              placeholder="Ex: REF001"
              class="w-full bg-slate-800 border border-slate-600 text-slate-100 rounded-lg px-3 py-2.5 placeholder-slate-500 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all outline-none"
            />
          </div>

          <!-- Bouton -->
          <div class="flex items-end">
            <button
              type="submit"
              :disabled="loading || !form.partenaire || !form.codeAgence"
              class="w-full bg-gradient-to-r from-primary-600 to-primary-500 hover:from-primary-500 hover:to-primary-400 disabled:from-slate-700 disabled:to-slate-700 disabled:text-slate-500 text-white font-semibold py-2.5 px-6 rounded-lg transition-all duration-200 shadow-lg shadow-primary-500/20 disabled:shadow-none flex items-center justify-center gap-2"
            >
              <svg v-if="loading" class="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
              {{ loading ? 'Chargement...' : 'Rechercher' }}
            </button>
          </div>
        </div>

        <!-- Filtre Portail de publication -->
        <div class="flex items-center gap-3 pt-1">
          <span class="text-sm font-medium text-slate-400">Portail</span>
          <div class="inline-flex rounded-lg border border-slate-600 overflow-hidden">
            <button
              v-for="portal in portals"
              :key="portal.value"
              type="button"
              @click="selectPortal(portal.value)"
              :class="[
                'px-4 py-1.5 text-sm font-semibold transition-all duration-200 outline-none',
                form.mediaId === portal.value
                  ? 'bg-primary-600 text-white shadow-inner'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-slate-200'
              ]"
            >
              {{ portal.label }}
            </button>
          </div>
          <span class="text-xs text-slate-500 italic">optionnel</span>
          <!-- Bouton Export CSV (visible uniquement quand il y a des résultats) -->
          <button
            v-if="hasResults"
            type="button"
            @click="exportCsv"
            class="ml-auto inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-primary-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-primary-500/30 rounded-lg px-2.5 py-1.5 transition-all"
            title="Exporter la liste des annonces en CSV"
          >
            <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Export CSV
          </button>
        </div>
      </form>
    </div>

    <!-- Messages d'erreur -->
    <div v-if="prodError || integError" class="mb-8 space-y-3">
      <div v-if="prodError" class="bg-red-900/30 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 flex items-center gap-3">
        <svg class="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span><strong>PROD :</strong> {{ prodError }}</span>
      </div>
      <div v-if="integError" class="bg-red-900/30 border border-red-500/30 rounded-xl px-5 py-3 text-red-300 flex items-center gap-3">
        <svg class="w-5 h-5 text-red-400 shrink-0" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
        <span><strong>INTEG :</strong> {{ integError }}</span>
      </div>
    </div>

    <!-- Résultats -->
    <div v-if="hasResults">
      <!-- En-têtes PROD / INTEG -->
      <div class="flex items-center gap-2 mb-4">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
          <div class="bg-slate-900/80 border border-sky-500/30 rounded-xl px-4 py-3 flex items-center justify-between min-w-0">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-sky-400 shadow-lg shadow-sky-400/30"></div>
              <span class="text-lg font-bold text-sky-300">PROD</span>
              <span class="bg-sky-500/20 text-sky-300 text-sm font-bold px-2.5 py-0.5 rounded-full border border-sky-500/30">{{ prodResults.length }}</span>
            </div>
            <button
              @click="openApiUrl('PROD')"
              class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-sky-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-sky-500/30 rounded-lg px-2.5 py-1.5 transition-all shrink-0"
              :title="getApiUrl('PROD')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              JSON PROD
            </button>
          </div>
          <div class="bg-slate-900/80 border border-amber-500/30 rounded-xl px-4 py-3 flex items-center justify-between min-w-0">
            <div class="flex items-center gap-3">
              <div class="w-3 h-3 rounded-full bg-amber-400 shadow-lg shadow-amber-400/30"></div>
              <span class="text-lg font-bold text-amber-300">INTEG</span>
              <span class="bg-amber-500/20 text-amber-300 text-sm font-bold px-2.5 py-0.5 rounded-full border border-amber-500/30">{{ integResults.length }}</span>
            </div>
            <button
              @click="openApiUrl('INTEG')"
              class="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-300 bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700/40 hover:border-amber-500/30 rounded-lg px-2.5 py-1.5 transition-all"
              :title="getApiUrl('INTEG')"
            >
              <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
              JSON INTEG
            </button>
          </div>
        </div>
        <!-- Espace réservé pour aligner avec la pastille de statut des annonces -->
        <div class="shrink-0 w-8"></div>
      </div>

      <!-- ═══════════ MODE FI9 : Affichage groupé programme / lots ═══════════ -->
      <template v-if="isFI9Mode">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <!-- Colonne PROD -->
          <div>
            <div v-for="group in groupedProgramsProd" :key="'fi9-prod-' + group.programRef" class="mb-4">
              <!-- Ligne programme -->
              <button
                @click="goToDetail(group.program)"
                class="w-full text-left bg-slate-900/80 border border-sky-500/30 hover:border-sky-400/60 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/10 group"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-sky-400/70 mr-2">🏗️ Programme</span>
                    <span class="text-sm font-bold text-sky-300 font-mono">{{ getProgramRef(group.program) }}</span>
                    <span v-if="group.program.fields?.titre_fr" class="text-slate-500 mx-2">—</span>
                    <span v-if="group.program.fields?.titre_fr" class="text-sm font-semibold text-slate-200">{{ group.program.fields.titre_fr }}</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span v-if="group.program.fields?.delivery_date_fr" class="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">🗓 {{ group.program.fields.delivery_date_fr }}</span>
                    <svg class="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <!-- Lots rattachés -->
              <div v-if="group.lots.length > 0" class="ml-6 mt-1 space-y-1 border-l-2 border-sky-500/20 pl-3">
                <button
                  v-for="lot in group.lots"
                  :key="'fi9-prod-lot-' + (lot.property?.reference || lot.id)"
                  @click="goToDetail(lot)"
                  class="w-full text-left bg-slate-800/50 border border-slate-700/30 hover:border-sky-500/30 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-md hover:shadow-sky-500/5 group"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <span class="text-xs text-slate-500 mr-1.5">└</span>
                      <span class="text-sm font-bold text-sky-300/80 font-mono">{{ getClientRef(lot) }}</span>
                      <span class="text-slate-500 mx-2">•</span>
                      <span class="text-sm text-slate-400">{{ lot.property_type?.name || '—' }}</span>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <span class="text-sm font-bold text-emerald-400">{{ formatPrice(lot.fields?.price_fr) }}</span>
                      <svg class="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>

          <!-- Colonne INTEG -->
          <div>
            <div v-for="group in groupedProgramsInteg" :key="'fi9-integ-' + group.programRef" class="mb-4">
              <!-- Ligne programme -->
              <button
                @click="goToDetail(group.program)"
                class="w-full text-left bg-slate-900/80 border border-amber-500/30 hover:border-amber-400/60 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/10 group"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <span class="text-xs font-bold uppercase tracking-wider text-amber-400/70 mr-2">🏗️ Programme</span>
                    <span class="text-sm font-bold text-amber-300 font-mono">{{ getProgramRef(group.program) }}</span>
                    <span v-if="group.program.fields?.titre_fr" class="text-slate-500 mx-2">—</span>
                    <span v-if="group.program.fields?.titre_fr" class="text-sm font-semibold text-slate-200">{{ group.program.fields.titre_fr }}</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span v-if="group.program.fields?.delivery_date_fr" class="text-xs text-slate-400 bg-slate-800/80 px-2 py-0.5 rounded">🗓 {{ group.program.fields.delivery_date_fr }}</span>
                    <svg class="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
              <!-- Lots rattachés -->
              <div v-if="group.lots.length > 0" class="ml-6 mt-1 space-y-1 border-l-2 border-amber-500/20 pl-3">
                <button
                  v-for="lot in group.lots"
                  :key="'fi9-integ-lot-' + (lot.property?.reference || lot.id)"
                  @click="goToDetail(lot)"
                  class="w-full text-left bg-slate-800/50 border border-slate-700/30 hover:border-amber-500/30 rounded-lg px-3 py-2 transition-all duration-200 hover:shadow-md hover:shadow-amber-500/5 group"
                >
                  <div class="flex items-center justify-between gap-3">
                    <div class="min-w-0 flex-1">
                      <span class="text-xs text-slate-500 mr-1.5">└</span>
                      <span class="text-sm font-bold text-amber-300/80 font-mono">{{ getClientRef(lot) }}</span>
                      <span class="text-slate-500 mx-2">•</span>
                      <span class="text-sm text-slate-400">{{ lot.property_type?.name || '—' }}</span>
                    </div>
                    <div class="flex items-center gap-3 shrink-0">
                      <span class="text-sm font-bold text-emerald-400">{{ formatPrice(lot.fields?.price_fr) }}</span>
                      <svg class="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </div>
                  </div>
                </button>
              </div>
            </div>
          </div>
        </div>
      </template>

      <!-- ═══════════ MODE ANCIEN : Affichage classique (FI / PLF / Tous) ═══════════ -->
      <template v-else>
      <!-- Annonces matchées (présentes dans les 2 environnements) -->
      <div v-if="matchedListings.length > 0" class="space-y-2 mb-6">
        <div
          v-for="pair in matchedListings"
          :key="'matched-' + pair.ref"
          class="flex items-center gap-2"
        >
          <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 flex-1">
            <!-- PROD -->
            <button
              @click="goToDetail(pair.prod)"
              class="w-full text-left bg-slate-900/80 border border-slate-700/40 hover:border-sky-500/40 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5 group"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <span class="text-sm font-bold text-sky-300 font-mono">{{ getClientRef(pair.prod) }}</span>
                  <span class="text-slate-500 mx-2">•</span>
                  <span class="text-sm text-slate-300">{{ pair.prod.property_type?.name || '—' }}</span>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="text-sm font-bold text-primary-400">{{ formatPrice(pair.prod.fields?.price_fr) }}</span>
                  <svg class="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
            <!-- INTEG -->
            <button
              @click="goToDetail(pair.integ)"
              class="w-full text-left bg-slate-900/80 border border-slate-700/40 hover:border-amber-500/40 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 group"
            >
              <div class="flex items-center justify-between gap-3">
                <div class="min-w-0 flex-1">
                  <span class="text-sm font-bold text-amber-300 font-mono">{{ getClientRef(pair.integ) }}</span>
                  <span class="text-slate-500 mx-2">•</span>
                  <span class="text-sm text-slate-300">{{ pair.integ.property_type?.name || '—' }}</span>
                </div>
                <div class="flex items-center gap-3 shrink-0">
                  <span class="text-sm font-bold text-primary-400">{{ formatPrice(pair.integ.fields?.price_fr) }}</span>
                  <svg class="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                  </svg>
                </div>
              </div>
            </button>
          </div>
          <!-- Pastille de statut -->
          <div class="shrink-0 w-8 flex justify-center" :title="getDiffCount(pair.prod, pair.integ) === 0 ? 'ISO — Aucune différence' : getDiffCount(pair.prod, pair.integ) + ' différence(s)'">
            <div v-if="getDiffCount(pair.prod, pair.integ) === 0" class="w-7 h-7 rounded-full bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center">
              <svg class="w-4 h-4 text-emerald-400" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div v-else class="w-7 h-7 rounded-full bg-red-500/20 border border-red-500/40 flex items-center justify-center">
              <span class="text-xs font-bold text-red-400">{{ getDiffCount(pair.prod, pair.integ) }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Annonces uniquement en PROD (sans correspondance INTEG) -->
      <div v-if="prodOnlyListings.length > 0" class="mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div>
            <div class="flex items-center gap-2 mb-2 mt-2">
              <div class="h-px flex-1 bg-sky-500/20"></div>
              <span class="text-xs font-semibold text-sky-400/60 uppercase tracking-wider px-2">PROD uniquement · {{ prodOnlyListings.length }}</span>
              <div class="h-px flex-1 bg-sky-500/20"></div>
            </div>
            <div class="space-y-2">
              <button
                v-for="(listing, idx) in prodOnlyListings"
                :key="'prod-only-' + idx"
                @click="goToDetail(listing)"
                class="w-full text-left bg-slate-900/80 border border-slate-700/40 hover:border-sky-500/40 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/5 group opacity-75 hover:opacity-100"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <span class="text-sm font-bold text-sky-300 font-mono">{{ getClientRef(listing) }}</span>
                    <span class="text-slate-500 mx-2">•</span>
                    <span class="text-sm text-slate-300">{{ listing.property_type?.name || '—' }}</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="text-sm font-bold text-primary-400">{{ formatPrice(listing.fields?.price_fr) }}</span>
                    <svg class="w-4 h-4 text-sky-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
          <div></div>
        </div>
      </div>

      <!-- Annonces uniquement en INTEG (sans correspondance PROD) -->
      <div v-if="integOnlyListings.length > 0" class="mb-6">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div></div>
          <div>
            <div class="flex items-center gap-2 mb-2 mt-2">
              <div class="h-px flex-1 bg-amber-500/20"></div>
              <span class="text-xs font-semibold text-amber-400/60 uppercase tracking-wider px-2">INTEG uniquement · {{ integOnlyListings.length }}</span>
              <div class="h-px flex-1 bg-amber-500/20"></div>
            </div>
            <div class="space-y-2">
              <button
                v-for="(listing, idx) in integOnlyListings"
                :key="'integ-only-' + idx"
                @click="goToDetail(listing)"
                class="w-full text-left bg-slate-900/80 border border-slate-700/40 hover:border-amber-500/40 rounded-xl px-4 py-3 transition-all duration-200 hover:shadow-lg hover:shadow-amber-500/5 group opacity-75 hover:opacity-100"
              >
                <div class="flex items-center justify-between gap-3">
                  <div class="min-w-0 flex-1">
                    <span class="text-sm font-bold text-amber-300 font-mono">{{ getClientRef(listing) }}</span>
                    <span class="text-slate-500 mx-2">•</span>
                    <span class="text-sm text-slate-300">{{ listing.property_type?.name || '—' }}</span>
                  </div>
                  <div class="flex items-center gap-3 shrink-0">
                    <span class="text-sm font-bold text-primary-400">{{ formatPrice(listing.fields?.price_fr) }}</span>
                    <svg class="w-4 h-4 text-amber-400 opacity-0 group-hover:opacity-100 transition-opacity" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </div>
              </button>
            </div>
          </div>
        </div>
      </div>
      </template>
    </div>

    <!-- État vide -->
    <div v-else-if="!loading && !prodError && !integError" class="text-center py-20">
      <div class="w-20 h-20 mx-auto mb-6 rounded-2xl bg-slate-800/60 border border-slate-700/30 flex items-center justify-center">
        <svg v-if="!hasSearched" class="w-10 h-10 text-slate-600" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
        </svg>
        <svg v-else class="w-10 h-10 text-amber-500/60" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
      </div>
      <h3 class="text-lg font-semibold text-slate-400 mb-2">{{ hasSearched ? 'Aucune annonce trouvée' : 'Aucune recherche en cours' }}</h3>
      <p class="text-sm text-slate-500">{{ hasSearched ? 'Aucune annonce ne correspond à cette combinaison de critères. Essayez un autre portail ou vérifiez le code agence.' : 'Sélectionnez un partenaire et un code agence pour lister les annonces.' }}</p>
    </div>
  </div>
</template>

<script setup lang="ts">
useHead({
  title: 'Validateur Forge — Liste des annonces',
})

const router = useRouter()

const partenaires = [
  'Apimo',
  'Hektor',
  'Immo-Facile',
  'La Boite Immo',
  'Netty',
  'Periimmo',
  'Poliris',
  'Rodacom',
  'Ubiflow',
]

const form = reactive({
  partenaire: '',
  codeAgence: '',
  refClient: '',
  mediaId: '',
})

const portals = [
  { label: 'Tous', value: '' },
  { label: 'FI', value: '1' },
  { label: 'PLF', value: '9' },
  { label: 'FI9', value: '2' },
]

const hasSearched = ref(false)
 
const { loading, prodData, integData, prodError, integError, prodResults, integResults, compare, selectListing, searchParams } = useCompare()

// Restaurer les paramètres de recherche depuis l'état global (retour depuis la page détail)
onMounted(() => {
  if (searchParams.value.partenaire) {
    form.partenaire = searchParams.value.partenaire
    form.codeAgence = searchParams.value.codeAgence
    form.refClient = searchParams.value.refClient
    form.mediaId = searchParams.value.mediaId
    // Marquer la recherche comme déjà effectuée si des résultats existent
    if (prodResults.value.length > 0 || integResults.value.length > 0) {
      hasSearched.value = true
    }
  }
})

// Détecter un reset global (clic sur le logo) et réinitialiser le formulaire local
watch(() => searchParams.value.partenaire, (val) => {
  if (!val) {
    form.partenaire = ''
    form.codeAgence = ''
    form.refClient = ''
    form.mediaId = ''
    hasSearched.value = false
  }
})

const hasResults = computed(() => prodResults.value.length > 0 || integResults.value.length > 0)

// Créer un index des refs INTEG pour le matching
const integRefMap = computed(() => {
  const map = new Map<string, any>()
  for (const listing of integResults.value) {
    const ref = listing?.property?.reference
    if (ref) map.set(ref, listing)
  }
  return map
})

const prodRefMap = computed(() => {
  const map = new Map<string, any>()
  for (const listing of prodResults.value) {
    const ref = listing?.property?.reference
    if (ref) map.set(ref, listing)
  }
  return map
})

// Annonces matchées : même référence dans les 2 environnements
const matchedListings = computed(() => {
  const pairs: Array<{ ref: string; prod: any; integ: any }> = []
  for (const prodListing of prodResults.value) {
    const ref = prodListing?.property?.reference
    if (ref && integRefMap.value.has(ref)) {
      pairs.push({ ref, prod: prodListing, integ: integRefMap.value.get(ref) })
    }
  }
  return pairs
})

// Annonces uniquement en PROD
const prodOnlyListings = computed(() => {
  return prodResults.value.filter((l: any) => {
    const ref = l?.property?.reference
    return !ref || !integRefMap.value.has(ref)
  })
})

// Annonces uniquement en INTEG
const integOnlyListings = computed(() => {
  return integResults.value.filter((l: any) => {
    const ref = l?.property?.reference
    return !ref || !prodRefMap.value.has(ref)
  })
})

// ── Mode FI9 (immobilier neuf) : grouper les annonces par programme ──
const isFI9Mode = computed(() => form.mediaId === '2')

// Regroupe les annonces d'un environnement en { program, lots[] }
function groupByProgram(listings: any[]): Array<{ programRef: string; program: any; lots: any[] }> {
  // Identifier les programmes (is_program === true)
  const programs = listings.filter((l: any) => l.property?.is_program === true)
  const lots = listings.filter((l: any) => l.property?.is_program !== true)
  const groups: Array<{ programRef: string; program: any; lots: any[] }> = []

  for (const prog of programs) {
    const progGwCode = prog.property?.gateway_code || ''
    const progRef = prog.property?.reference || ''
    // Rattacher les lots dont le gateway_code commence par celui du programme + '_'
    const matchedLots = lots.filter((lot: any) => {
      const lotGwCode = lot.property?.gateway_code || ''
      return lotGwCode.startsWith(progGwCode + '_')
    })
    groups.push({ programRef: progRef, program: prog, lots: matchedLots })
  }

  // Lots orphelins (pas rattachés à un programme connu) — les afficher comme des programmes individuels
  const attachedLotIds = new Set(groups.flatMap(g => g.lots.map((l: any) => l.id)))
  const orphanLots = lots.filter((l: any) => !attachedLotIds.has(l.id))
  for (const orphan of orphanLots) {
    groups.push({ programRef: orphan.property?.reference || '', program: orphan, lots: [] })
  }

  return groups
}

const groupedProgramsProd = computed(() => groupByProgram(prodResults.value))
const groupedProgramsInteg = computed(() => groupByProgram(integResults.value))

function getProgramRef(listing: any): string {
  return listing?.property?.reference || '—'
}

function selectPortal(value: string) {
  form.mediaId = value
  // Relancer la recherche automatiquement si les champs obligatoires sont remplis
  if (form.partenaire && form.codeAgence && !loading.value) {
    doSearch()
  }
}

// Recherche pure (sans navigation automatique)
async function doSearch() {
  hasSearched.value = true
  await compare({
    partenaire: form.partenaire,
    codeAgence: form.codeAgence,
    refClient: form.refClient,
    mediaId: form.mediaId,
  })
}

// Soumission du formulaire (recherche + navigation si réf client renseignée)
async function handleSubmit() {
  await doSearch()

  // Si une réf client est renseignée, naviguer directement vers le détail
  if (form.refClient.trim()) {
    const refToFind = form.refClient.trim()
    // Chercher dans PROD puis INTEG une annonce dont la référence contient la réf client
    const allListings = [...prodResults.value, ...integResults.value]
    const match = allListings.find((l: any) => {
      const ref = l?.property?.reference || ''
      const gwCode = l?.property?.gateway_code || ''
      return ref === refToFind || ref.includes(refToFind) || gwCode.endsWith('_' + refToFind)
    })
    if (match) {
      const ref = match?.property?.reference || ''
      selectListing(ref)
      router.push(`/detail?ref=${encodeURIComponent(ref)}`)
    }
  }
}

// Champs comparés pour le calcul rapide du statut ISO
const compareFields = [
  'property.address.city', 'property.address.zipcode',
  'fields.surface_fr', 'fields.surface_terrain_fr',
  'fields.nb_piece_fr', 'fields.nb_chambre_fr', 'fields.nb_sd_bains_fr', 'fields.nb_wc_fr', 'fields.places_parking_fr', 'fields.nb_terasse_fr', 'fields.nb_box_fr',
  'fields.exposition_fr', 'fields.etat_fr', 'fields.confort_fr', 'fields.copropriete_fr',
  'fields.type_chauffage_fr',
  'fields.date_dpe_fr', 'fields.dpe_valeur_consommation_fr', 'fields.dpe_etiquette_consommation_fr',
  'fields.dpe_valeur_gaz_effet_serre_fr', 'fields.dpe_etiquette_gaz_effet_serre_fr',
  'fields.description_fr',
  'fields.contact_email_fr', 'fields.nego_tel_fr', 'fields.contact_tel_fr', 'fields.contact_name_fr',
  'fields.price_fr', 'fields.honoraires_fr', 'fields.taxe_fonciere_fr', 'fields.charge_honoraires_fr',
]

function getNestedValue(obj: any, path: string): string {
  if (!obj) return ''
  let value = obj
  for (const part of path.split('.')) {
    if (value == null) return ''
    value = value[part]
  }
  if (value == null || value === '') return ''
  if (typeof value === 'object') return JSON.stringify(value)
  return String(value).trim().toLowerCase()
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

// Normalize Euro variants (e.g. U+0080 legacy vs U+20AC) to canonical € before comparing description
function normalizeDescriptionForCompare(s: string): string {
  return s.replace(/\u0080|\u20AC/g, '\u20AC')
}

// For confort_fr, strip "vue_degage" and "garage" from array before comparing (ignore list)
const CONFORT_IGNORE = ['vue_degage', 'garage']
function confortNormalizeForCompare(s: string): string {
  try {
    const arr = JSON.parse(s)
    if (Array.isArray(arr)) {
      const filtered = arr.filter((x: any) => !CONFORT_IGNORE.includes(String(x).toLowerCase()))
      return JSON.stringify(filtered)
    }
  } catch (_) {}
  return s
}

// Treat 0 and nil/empty as equivalent (do not flag diff)
function isZeroOrNil(s: string): boolean {
  const t = s.trim().toLowerCase()
  return t === '' || t === '—' || t === '0'
}

function getDiffCount(prod: any, integ: any): number {
  let diffs = 0
  for (const path of compareFields) {
    let pv = getNestedValue(prod, path)
    let iv = getNestedValue(integ, path)
    if (path === 'fields.confort_fr' && pv && iv) {
      pv = confortNormalizeForCompare(pv)
      iv = confortNormalizeForCompare(iv)
    }
    if (isZeroOrNil(pv) && isZeroOrNil(iv)) continue
    if (!pv || !iv) continue
    if (path === 'fields.description_fr') {
      const npv = normalizeDescriptionForCompare(pv)
      const niv = normalizeDescriptionForCompare(iv)
      if (npv.length !== niv.length) diffs++
    } else if (!valuesEqualForCompare(pv, iv)) {
      diffs++
    }
  }
  return diffs
}

function goToDetail(listing: any) {
  const ref = listing?.property?.reference || ''
  selectListing(ref)
  router.push(`/detail?ref=${encodeURIComponent(ref)}`)
}

function getClientRef(listing: any): string {
  if (!listing) return '—'
  // Extraire la ref client depuis gateway_code (format: codeAgence_refClient)
  const gwCode = listing.property?.gateway_code || ''
  if (gwCode && gwCode.includes('_')) {
    return gwCode.split('_').slice(1).join('_')
  }
  return listing.reference || gwCode || '—'
}

function formatPrice(price: any): string {
  if (price == null || price === '') return '—'
  const num = Number(price)
  if (isNaN(num)) return String(price)
  return new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR', maximumFractionDigits: 0 }).format(num)
}

// URLs API réelles (remontées par le serveur via _apiUrl)
function getApiUrl(env: string): string {
  const data = env === 'PROD' ? prodData.value : integData.value
  if (data?._apiUrl) return data._apiUrl
  // Pas de fallback avec la clé API — les URLs sont gérées côté serveur uniquement
  return ''
}

function openApiUrl(env: string) {
  const url = getApiUrl(env)
  if (url) window.open(url, '_blank')
}

// ── Export CSV ──────────────────────────────────────────────

function exportCsv() {
  const sep = ';'
  const headers = ['Référence', 'Type', 'Ville', 'CP', 'Gateway', 'Advertiser ID', 'Prix PROD', 'Prix INTEG', 'Statut', 'Nb Diffs', 'Présence']
  const rows: string[][] = []

  function esc(val: any): string {
    const s = String(val ?? '').replace(/"/g, '""')
    return `"${s}"`
  }

  function getVal(obj: any, path: string): string {
    if (!obj) return ''
    let value = obj
    for (const part of path.split('.')) {
      if (value == null) return ''
      value = value[part]
    }
    if (value == null || value === '') return ''
    if (typeof value === 'object') return JSON.stringify(value)
    return String(value)
  }

  function getGateway(listing: any): string {
    const gw = listing?.gateways
    if (Array.isArray(gw) && gw.length > 0) return gw[0]?.name || gw[0]?.code || ''
    return ''
  }

  function getAdvertiserId(listing: any): string {
    const id = listing?.property?.advertiser_id ?? listing?.advertiser_id
    return id != null ? String(id) : ''
  }

  // Annonces matchées
  for (const pair of matchedListings.value) {
    const diffs = getDiffCount(pair.prod, pair.integ)
    const listing = pair.prod || pair.integ
    rows.push([
      esc(pair.ref),
      esc(getVal(pair.prod, 'property.type')),
      esc(getVal(pair.prod, 'property.address.city')),
      esc(getVal(pair.prod, 'property.address.zipcode')),
      esc(getGateway(listing)),
      esc(getAdvertiserId(listing)),
      esc(getVal(pair.prod, 'fields.price_fr')),
      esc(getVal(pair.integ, 'fields.price_fr')),
      esc(diffs === 0 ? 'ISO' : 'DIFF'),
      esc(diffs),
      esc('PROD + INTEG'),
    ])
  }

  // Annonces uniquement PROD
  for (const listing of prodOnlyListings.value) {
    rows.push([
      esc(listing?.property?.reference || ''),
      esc(getVal(listing, 'property.type')),
      esc(getVal(listing, 'property.address.city')),
      esc(getVal(listing, 'property.address.zipcode')),
      esc(getGateway(listing)),
      esc(getAdvertiserId(listing)),
      esc(getVal(listing, 'fields.price_fr')),
      esc(''),
      esc('MANQUE INTEG'),
      esc(''),
      esc('PROD uniquement'),
    ])
  }

  // Annonces uniquement INTEG
  for (const listing of integOnlyListings.value) {
    rows.push([
      esc(listing?.property?.reference || ''),
      esc(getVal(listing, 'property.type')),
      esc(getVal(listing, 'property.address.city')),
      esc(getVal(listing, 'property.address.zipcode')),
      esc(getGateway(listing)),
      esc(getAdvertiserId(listing)),
      esc(''),
      esc(getVal(listing, 'fields.price_fr')),
      esc('MANQUE PROD'),
      esc(''),
      esc('INTEG uniquement'),
    ])
  }

  const csv = [headers.join(sep), ...rows.map(r => r.join(sep))].join('\n')
  const bom = '\uFEFF' // BOM UTF-8 pour Excel
  const blob = new Blob([bom + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `comparaison_${form.partenaire}_${form.codeAgence}_${new Date().toISOString().slice(0, 10)}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
</script>
