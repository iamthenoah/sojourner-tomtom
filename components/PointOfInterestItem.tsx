import { StyleSheet, Text, View } from 'react-native'
import { PoiData } from '../interfaces'
import React, { PureComponent } from 'react'
import Badge from './Badge'

export default class PointOfIntrestItem extends PureComponent<PoiData, {}> {
    constructor(props: PoiData) {
        super(props)
    }

    render() {
        const { address, poi, dist } = this.props
        const { streetName, municipality, countryCode, postalCode } = address
        const { classifications, name, phone } = poi

        return (
            <View style={style.container}>
                <View style={style.header}>
                    <Text style={style.name} numberOfLines={1}>
                        {name}
                    </Text>
                    <Badge title={classifications[0].code.replace(/_/g, ' ')} />
                </View>
                <Text>
                    {municipality}, {countryCode}
                </Text>
                {streetName && postalCode && (
                    <Text style={style.line}>
                        • Address: {postalCode} - {streetName}
                    </Text>
                )}
                {phone && <Text style={style.line}>• Contact: {phone}</Text>}
                {dist && (
                    <Text style={style.distance}>{Math.round(dist / 1000)} KM away</Text>
                )}
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 20,
        marginHorizontal: 20,
        marginTop: 20,
        borderColor: '#EEEEEE',
        borderWidth: 1
    },
    header: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between'
    },
    name: {
        fontSize: 18,
        fontWeight: 'bold',
        flex: 1
    },
    line: {
        marginTop: 10
    },
    distance: {
        fontWeight: 'bold',
        marginTop: 10
    }
})
