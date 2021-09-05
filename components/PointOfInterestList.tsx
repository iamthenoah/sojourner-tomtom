import React from 'react'
import { FlatList, NativeModules } from 'react-native'
import { PoiData } from '../interfaces'

interface PointOfInterestListProps {
    query: string
    pois: PoiData[]
}

interface PointOfInterestListState {
    pois: PoiData[]
}

export default class PointOfInterestList extends React.Component<
    PointOfInterestListProps,
    PointOfInterestListState
> {
    constructor(props: PointOfInterestListProps) {
        super(props)
    }

    loadMoreData = () => {
        const { TomTomAPI } = NativeModules

        this.setState({ isPending: true })

        const nextPage = this.state.currentPage + 1
        const query = this.state.query?.query ?? ''

        // TomTomAPI modules automatically formats query paramaters
        // it requires however that all provided paramaters are strings.
        // here we are setting the 'ofs' offset
        const params = { ofs: nextPage.toString() }

        TomTomAPI.fetchPOI(query, params)
            .then(({ results, summary }: PoiApiResponse) => {
                const pois = this.state.pois
                pois?.push(...results)
                this.setState({ pois })
            })
            .catch((error: Error) => this.setState({ error }))
            .then(() => this.setState({ isPending: false }))

        // lastly, save nextPage as new currentPage
        this.setState({ currentPage: nextPage })
    }

    render() {
        const { pois } = this.props

        return (
            <FlatList
                data={pois}
                keyExtractor={poi => `${poi.id}${Math.random()}`}
                renderItem={({ item }) => <PointOfIntrestItem {...item} />}
                onEndReached={this.loadMoreData}
                onEndReachedThreshold={1}
            />
        )
    }
}
