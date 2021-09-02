import React, { useEffect, useState } from 'react';
import { useApi, Nullable } from './hooks';

import {
    SafeAreaView,
    ScrollView,
    TextInput,
    Button,
    Text,
    View
} from 'react-native';

const App = () => {
    const [query, setQuery] = useState('pizza');
    const [data, setData] = useState<Nullable<any>>(null);
    const [error, setError] = useState<Nullable<Error>>(null);
    const poi = useApi();

    useEffect(() => {
        setData(null);
        setError(null);
        if (poi.error) setError(poi.error);
        if (poi.data) setData(poi.data as any);
    }, [poi.pending]);

    const searchPointsOfIntrests = () => {
        poi.fetch(query, { 'ofs': '0' , 'limit': '10', 'countrySet': 'FR' })
    }

    return (
        <SafeAreaView >
            <ScrollView>
                <View>
                    <TextInput 
                        value={query}
                        onChangeText={setQuery}
                        placeholder='Find POI...'
                    />
                    <Button 
                        title="Search"
                        onPress={searchPointsOfIntrests} 
                    />
                    {data && (<Text>{JSON.stringify(data)}</Text>)}
                    {error && (<Text>ERROR: {JSON.stringify(error)}</Text>)}
                    {poi.pending && (<Text>Loading data...</Text>)}
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

export default App;
