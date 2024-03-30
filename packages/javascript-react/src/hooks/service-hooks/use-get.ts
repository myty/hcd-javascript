import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "axios";
import { useAbortSignal } from "../use-abort-signal";
import type { GetServiceWithSignal } from "../../types/get-service-type";

interface UseGetServiceHook<TRecord> {
    error?: Error;
    isLoading: boolean;
    result?: TRecord;
    refresh: () => void;
}

interface UseGetServiceHookOptions<TPathParams, TQueryParams> {
    autoLoad?: boolean;
    pathParams: TPathParams;
    queryParams?: TQueryParams;
}

/**
 * A hook that provides a list function that can be used to get a record.
 * @param getService The get service function that will be called to get the record.
 * @param options The options that will be passed to the get service.
 */
export function useGetService<TRecord, TPathParams, TQueryParams>(
    getService: GetServiceWithSignal<TRecord, TPathParams, TQueryParams>,
    options: UseGetServiceHookOptions<TPathParams, TQueryParams>
): UseGetServiceHook<TRecord> {
    const { autoLoad = true, pathParams, queryParams } = options;

    const signal = useAbortSignal();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [result, setResult] = useState<TRecord>();

    const get = useCallback(
        (signal?: AbortSignal) => {
            (async function fetch() {
                try {
                    const result = await getService(
                        pathParams,
                        queryParams,
                        signal
                    );
                    setResult(result.resultObject);
                    setIsLoading(false);
                } catch (error: unknown) {
                    if (
                        error instanceof Error &&
                        !(error instanceof CanceledError)
                    ) {
                        setError(error);
                    }
                } finally {
                    setIsLoading(false);
                }
            })();
        },
        [getService, pathParams, queryParams]
    );

    const refresh = useCallback(() => {
        setIsLoading(true);
        get(signal);
    }, [get, signal]);

    useEffect(() => {
        if (!autoLoad) {
            return;
        }

        const controller = new AbortController();
        get(controller.signal);
        return () => controller.abort();
    }, [autoLoad, get]);

    return {
        error,
        isLoading,
        result,
        refresh,
    };
}
