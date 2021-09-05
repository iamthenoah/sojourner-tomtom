import { StyleSheet, Text, View } from 'react-native'
import { ResponseSummary } from '../interfaces'
import { Nullable } from '../App'
import React from 'react'

interface SearchSummaryInfoProps {
    summary: Nullable<ResponseSummary>
    hasGeoLocation: boolean
}

export default class SearchSummaryInfo extends React.Component<SearchSummaryInfoProps> {
    constructor(props: SearchSummaryInfoProps) {
        super(props)
    }

    renderDefaultMessage() {
        return this.props.hasGeoLocation ? (
            <Text>Search will be based around your current location.</Text>
        ) : (
            <Text>Geo-location is diabled.</Text>
        )
    }

    renderSearchSummary() {
        const summary = this.props.summary!

        const { query, numResults, offset, totalResults, queryType } = summary

        const currentTotal = offset * numResults + numResults
        const nearby = queryType === 'NEARBY'

        return (
            <Text>
                Showing {currentTotal} of {totalResults} results for
                <Text style={style.query}> {query} </Text>
                <Text>{nearby ? 'near you' : 'everywhere'}</Text>.
            </Text>
        )
    }

    render() {
        const content = this.props.summary
            ? this.renderSearchSummary()
            : this.renderDefaultMessage()

        return <View style={style.container}>{content}</View>
    }
}

const style = StyleSheet.create({
    container: {
        marginVertical: 10,
        textAlign: 'center',
        alignSelf: 'center',
        marginBottom: 10
    },
    query: {
        fontWeight: 'bold'
    }
})
