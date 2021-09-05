// used this neat website (https://transform.tools/json-to-json-schema)
// to generate ts interfaces from a JSON reponse.

export interface PoiApiResponse {
    summary: ResponseSummary
    results: PoiData[]
}

export interface ResponseSummary {
    query: string
    queryType: 'NON_NEAR' | 'NEARBY'
    queryTime: number
    numResults: number
    offset: number
    totalResults: number
    fuzzyLevel: number
}

export interface PoiData {
    type: string
    id: string
    score: number
    info: string
    dist?: number
    poi: Poi
    address: Address
    position: Coordinates
    viewport: Viewport
    entryPoints: EntryPoint[]
    dataSources?: DataSources
}

export interface Poi {
    name: string
    phone?: string
    categorySet: CategorySet[]
    categories: string[]
    classifications: Classification[]
    url?: string
}

export interface CategorySet {
    id: number
}

export interface Classification {
    code: string
    names: Name[]
}

export interface Name {
    nameLocale: string
    name: string
}

export interface Address {
    streetName: string
    municipality: string
    postalCode: string
    countryCode: string
    country: string
    countryCodeISO3: string
    freeformAddress: string
    localName: string
    municipalitySubdivision?: string
    streetNumber?: string
}

export interface Coordinates {
    lat: number
    lon: number
}

export interface Viewport {
    topLeftPoint: Coordinates
    btmRightPoint: Coordinates
}

export interface EntryPoint {
    type: string
    position: Coordinates
}

export interface DataSources {
    poiDetails: PoiDetail[]
}

export interface PoiDetail {
    id: string
    sourceName: string
}
