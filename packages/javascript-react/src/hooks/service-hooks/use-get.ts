import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "axios";
import { useAbortSignal } from "../use-abort-signal";
import type { GetServiceWithSignal } from "../../types/get-service-type";

interface UseGetServiceHook<TRecord> {
    error?: Error;
    isLoading: boolean;
    result?: TRecord;
}

/**
 * A hook that provides a list function that can be used to get a record.
 * @param getService The get service function that will be called to get the record.
 * @param pathParams The path parameters that will be used to get the record.
 * @param queryParams The query parameters that will be used to get the record.
 */
export function useGetService<
    TRecord = any,
    TPathParams = {},
    TQueryParams = {},
>(
    getService: GetServiceWithSignal<TRecord, TPathParams, TQueryParams>,
    pathParams: TPathParams,
    queryParams?: TQueryParams
): UseGetServiceHook<TRecord> {
    const signal = useAbortSignal();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [result, setResult] = useState<TRecord>();

    const get = useCallback(() => {
        (async function list() {
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
    }, [pathParams, queryParams]);

    useEffect(() => {
        get();
    }, [get]);

    return {
        error,
        isLoading,
        result,
    };
}
