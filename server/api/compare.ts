function buildApiUrl(env: 'PROD' | 'INTEG', partenaire: string, codeAgence: string, refClient: string, mediaId: string): string {
    const config = useRuntimeConfig()
    const baseUrl = env === 'PROD'
        ? `${config.apiBaseUrlProd}?api_key=${config.apiKey}`
        : `${config.apiBaseUrlInteg}?api_key=${config.apiKey}`
    const encodedPartner = encodeURIComponent(partenaire)
    const encodedAgency = encodeURIComponent(codeAgence)

    let gatewayCode = encodedAgency + '_*'
    let url = `${baseUrl}&filters[property.gateway_code]=${gatewayCode}&filters[status]=3&start=0&limit=1000`

    // Filtre optionnel par portail de publication (FI=1, PLF=9)
    if (mediaId) {
        url += `&filters[media_id]=${encodeURIComponent(mediaId)}`
    }

    return url
}

export default defineEventHandler(async (event) => {
    const query = getQuery(event)

    const partenaire = (query.partenaire as string) || ''
    const codeAgence = (query.codeAgence as string) || ''
    const refClient = (query.refClient as string) || ''
    const mediaId = (query.mediaId as string) || ''
    const env = (query.env as string)?.toUpperCase() as 'PROD' | 'INTEG'

    // Validation des paramètres obligatoires
    if (!partenaire || !codeAgence) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Les paramètres "partenaire" et "codeAgence" sont obligatoires.',
        })
    }

    if (env !== 'PROD' && env !== 'INTEG') {
        throw createError({
            statusCode: 400,
            statusMessage: 'Le paramètre "env" doit être "PROD" ou "INTEG".',
        })
    }

    const apiUrl = buildApiUrl(env, partenaire, codeAgence, refClient, mediaId)

    try {
        // Pour INTEG (.local), on désactive temporairement la vérification SSL
        const originalTLS = process.env.NODE_TLS_REJECT_UNAUTHORIZED
        if (env === 'INTEG') {
            process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0'
        }

        let data: any
        try {
            console.log(`[compare.ts] Fetching ${env}: ${apiUrl}`)
            data = await $fetch(apiUrl)
            console.log(`[compare.ts] Success ${env} - Count: ${data?.results?.length || data?.listings?.length || 0}`)
        } finally {
            // Restaurer la valeur originale dans tous les cas
            if (env === 'INTEG') {
                if (originalTLS !== undefined) {
                    process.env.NODE_TLS_REJECT_UNAUTHORIZED = originalTLS
                } else {
                    delete process.env.NODE_TLS_REJECT_UNAUTHORIZED
                }
            }
        }

        return {
            ...data,
            _apiUrl: apiUrl,
        }
    } catch (error: any) {
        const statusCode = error?.response?.status || error?.statusCode || 502
        const message = error?.response?.statusText || error?.message || 'Erreur lors de l\'appel API'

        console.error(`[compare.ts] Erreur ${env}:`, error?.message)

        throw createError({
            statusCode,
            statusMessage: `[${env}] ${message}`,
            data: {
                url: apiUrl.replace(/api_key=[^&]+/, 'api_key=***'),
                originalError: error?.message,
            },
        })
    }
})
