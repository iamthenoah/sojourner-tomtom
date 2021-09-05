import React from 'react'
import { StyleSheet, Text, View } from 'react-native'

export type MessageType = 'error' | 'warning' | 'success'

const titleColor: Record<MessageType, string> = {
    success: '#38E000',
    warning: '#FF9D00',
    error: '#FF0000'
}

const containerColor: Record<MessageType, string> = {
    success: '#C2FFCE',
    warning: '#FFE8C2',
    error: '#FFC2C2'
}

export interface MessageBoxProps {
    type: MessageType
    title: string
    children?: any
}

export default class MessageBox extends React.Component<MessageBoxProps> {
    constructor(props: MessageBoxProps) {
        super(props)
    }

    render() {
        const { type, title, children } = this.props

        const viewColor = { ...style.container, backgroundColor: containerColor[type] }
        const textColor = { ...style.title, color: titleColor[type] }

        return (
            <View style={viewColor}>
                <Text style={textColor}>{title}</Text>
                <View>{children}</View>
            </View>
        )
    }
}

const style = StyleSheet.create({
    container: {
        borderRadius: 5,
        padding: 20,
        margin: 20
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 15
    }
})

export const NoResults = ({ query }: { query: string }) => {
    return (
        <MessageBox type='warning' title='No results.'>
            <Text>No results matching search {query} found.</Text>
        </MessageBox>
    )
}

export const ErrorBox = ({ error }: { error: Error }) => {
    return (
        <MessageBox type='error' title={error.name}>
            <Text>{error.message}</Text>
        </MessageBox>
    )
}
