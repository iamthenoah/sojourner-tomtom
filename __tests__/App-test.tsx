import { render, fireEvent } from '@testing-library/react-native'
import * as mock from 'react-native-permissions/mock'
import SearchBar from '../components/SearchBar'
import React from 'react'
import 'react-native'

// setting react-native-permissions mock
jest.mock('react-native-permissions', () => mock)

/**
 * ----------------------------------------------
 * SearchBar Testing
 * ----------------------------------------------
 */

const setupSearchBar = () => {
    const onSearchEvent = jest.fn()
    const { getByTestId } = render(<SearchBar onSearch={onSearchEvent} />)
    const searchInput = getByTestId('search-bar-input')

    return { onSearchEvent, searchInput }
}

/**
 * Performs testing for SearchBar Component.
 * Although there is a lot of repeated code, it's for the safety
 * of running the component tests in isolation from one another.
 */
describe('trigger onSearch for SearchBar component', () => {
    it('should always fire onSearch on SumbitEditing event', () => {
        const { searchInput, onSearchEvent } = setupSearchBar()

        // call submit with completed input
        fireEvent(searchInput, 'submitEditing', { nativeEvent: { text: 'restaurant' } })
        expect(onSearchEvent).toHaveBeenCalledWith('restaurant')

        // call submit with unfinished input
        fireEvent(searchInput, 'submitEditing', { nativeEvent: { text: 're' } })
        expect(onSearchEvent).toHaveBeenCalledWith('re')
    })
})
