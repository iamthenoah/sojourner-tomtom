import { useState, useEffect } from 'react';
import { NativeModules } from 'react-native';

export type Nullable<T> = T | null;

export type RequestParams = Record<string, string | number>;

export const useApi = () => {
    const { PoiAPI } = NativeModules;

    const [pending, setPending] = useState(false);

    const [query, setQuery] = useState<Nullable<string>>(null);
    const [params, setParams] = useState<Nullable<RequestParams>>(null);

    const [data, setData] = useState<Nullable<any>>(null);
    const [error, setError] = useState<Nullable<Error>>(null);

    useEffect(() => {
        if (!pending) return;

        setTimeout(() => {
            PoiAPI.byQuery(query, params)
                .then((data: any) => setData(data))
                .catch((error: Error) => setError(error))
                .then(finalize)
        }, 1000);
        
    }, [pending]) // eslint-disable-line react-hooks/exhaustive-deps

    const finalize = () => {
        setPending(false);
        setParams(null);
        setQuery(null);
        setData(null);
    }

    const fetch = (query: string, params: Nullable<RequestParams> = null) => {
        setPending(true);
        setParams(params);
        setQuery(query);
        setError(null);
    }

    return { data, error, pending, fetch }
}