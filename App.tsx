import { request, check, PERMISSIONS, RESULTS } from 'react-native-permissions'
import { PoiApiResponse, PoiData, ResponseSummary } from './interfaces'
import PointOfIntrestItem from './components/PointOfInterestItem'
import SearchSummaryInfo from './components/SearchSummaryInfo'
import { ErrorBox, NoResults } from './components/MessageBox'
import SearchBar from './components/SearchBar'
import React from 'react'

import {
    View,
    FlatList,
    StatusBar,
    StyleSheet,
    SafeAreaView,
    NativeModules,
    ActivityIndicator
} from 'react-native'

export type Nullable<T> = T | null

interface AppState {
    pois: Nullable<PoiData[]>
    error: Nullable<Error>
    isPending: boolean
    currentPage: number
    searchSummary: Nullable<ResponseSummary>
    hasGeoLocation: boolean
}

const initialAppState = {
    pois: null,
    error: null,
    isPending: false,
    currentPage: 0,
    searchSummary: null
}

export default class App extends React.Component<{}, AppState> {
    constructor(props: any) {
        super(props)

        this.state = { ...initialAppState, hasGeoLocation: false }
    }

    async componentDidMount() {
        // check for geo-location permissions
        const permission = PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        const state = await check(permission)

        if (state != RESULTS.GRANTED) {
            const result = await request(permission)

            this.setState({
                hasGeoLocation: result === RESULTS.GRANTED
            })
        }
    }

    searchNewPointsOfIntrests = (query: string) => {
        const { TomTomAPI } = NativeModules

        // rest app state anew to keep UI clean.
        this.setState(initialAppState)
        // however, setting pending to true
        this.setState({ isPending: true })

        TomTomAPI.fetchPOI(query, {})
            .then(({ results, summary }: PoiApiResponse) => {
                this.setState({ pois: results, searchSummary: summary })
            })
            .catch((error: Error) => this.setState({ error }))
            .then(() => this.setState({ isPending: false }))
    }

    loadMoreData = () => {
        const { TomTomAPI } = NativeModules

        this.setState({ isPending: true })

        const nextPage = this.state.currentPage + 1
        const query = this.state.searchSummary?.query ?? ''

        // TomTomAPI modules automatically formats query paramaters
        // it requires however that all provided paramaters are strings.
        // here we are setting the 'ofs' offset
        const params = { ofs: nextPage.toString() }

        TomTomAPI.fetchPOI(query, params)
            .then(({ results, summary }: PoiApiResponse) => {
                const pois = this.state.pois
                pois?.push(...results)
                this.setState({ pois, searchSummary: summary })
            })
            .catch((error: Error) => this.setState({ error }))
            .then(() => this.setState({ isPending: false }))

        // lastly, save nextPage as new currentPage
        this.setState({ currentPage: nextPage })
    }

    render() {
        const { error, pois, isPending, searchSummary, hasGeoLocation } = this.state

        return (
            <SafeAreaView style={style.mainContainer}>
                <StatusBar barStyle='default' />

                <SearchBar onSearch={this.searchNewPointsOfIntrests} />

                <SearchSummaryInfo
                    hasGeoLocation={hasGeoLocation}
                    summary={searchSummary}
                />

                <View style={style.contentContainer}>
                    {isPending && !pois && (
                        <ActivityIndicator
                            size='large'
                            style={{ marginVertical: '50%' }}
                        />
                    )}

                    {error && <ErrorBox error={error} />}

                    {pois && !pois.length && searchSummary && (
                        <NoResults query={searchSummary.query} />
                    )}

                    {pois && pois.length > 0 && (
                        <FlatList
                            data={pois}
                            keyExtractor={poi => `${poi.id}${Math.random()}`}
                            renderItem={({ item }) => <PointOfIntrestItem {...item} />}
                            onEndReached={this.loadMoreData}
                            onEndReachedThreshold={1}
                        />
                    )}
                </View>
            </SafeAreaView>
        )
    }
}

const style = StyleSheet.create({
    mainContainer: {
        display: 'flex',
        height: '100%'
    },
    contentContainer: {
        borderTopWidth: 1,
        borderTopColor: '#EEEEEE',
        flex: 1
    }
})
