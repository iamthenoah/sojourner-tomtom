import { View, Text, StyleSheet } from 'react-native'
import React from 'react'

export interface BadgeProps {
    title: string
    color?: string
}

export default class Badge extends React.Component<BadgeProps> {
    constructor(props: BadgeProps) {
        super(props)
    }

    render() {
        const { title, color = '#f54242' } = this.props

        return (
            <View style={{ ...style.container, backgroundColor: color }}>
                <Text style={style.title}>{title.toUpperCase()}</Text>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 5,
        alignSelf: 'flex-start'
    },
    title: {
        fontWeight: 'bold',
        fontSize: 10,
        color: 'white'
    }
})
