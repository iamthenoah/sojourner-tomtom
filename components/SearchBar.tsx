import React from 'react'
import _ from 'lodash'

import {
    TextInput,
    StyleSheet,
    TextInputProps,
    NativeSyntheticEvent,
    TextInputSubmitEditingEventData
} from 'react-native'

interface SearchBarState {
    oldQuery: string
}

export interface SearchBarProps extends TextInputProps {
    onSearch: (query: string) => void
}

export default class SearchBar extends React.Component<SearchBarProps, SearchBarState> {
    constructor(props: SearchBarProps) {
        super(props)

        this.state = { oldQuery: '' }
    }

    onChange = (input: string) => {
        // remove white spaces since the API does not like trailing spaces.
        const text = input.trim()

        // only perform a search if length is > 3
        if (text.length > 3 && this.state.oldQuery !== text) {
            this.props.onSearch(text)
        }

        this.setState({ oldQuery: text })
    }

    onSubmit = (e: NativeSyntheticEvent<TextInputSubmitEditingEventData>) => {
        const text = e.nativeEvent.text.trim()
        this.setState({ oldQuery: text })

        // do search if it is a new query
        if (text !== this.state.oldQuery) {
            this.props.onSearch(text)
        }
    }

    render() {
        const hasInput = this.state.oldQuery.length !== 0

        return (
            <TextInput
                testID='search-bar-input'
                returnKeyType='go'
                onSubmitEditing={this.onSubmit}
                onChangeText={_.debounce(this.onChange, 500)}
                placeholder={!hasInput ? 'Where to next?' : ''}
                {...this.props}
                style={
                    hasInput
                        ? { ...style.searchBar, ...style.focused }
                        : { ...style.searchBar, ...style.unfocused }
                }
            />
        )
    }
}

const style = StyleSheet.create({
    searchBar: {
        paddingHorizontal: 25,
        alignSelf: 'stretch',
        marginVertical: 15,
        fontWeight: 'bold',
        fontSize: 24
    },
    focused: {
        textAlign: 'left'
    },
    unfocused: {
        textAlign: 'center'
    }
})
