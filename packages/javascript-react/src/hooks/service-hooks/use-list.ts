import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "axios";
import { useAbortSignal } from "../use-abort-signal";
import type { ListServiceWithSignal } from "../../types/list-service-type";

interface UseListServiceHook<TRecord> {
    error?: Error;
    isLoading: boolean;
    results: TRecord[];
}

/**
 * A hook that provides a list function that can be used to list records.
 * @param listService The list service function that will be called to list the records.
 * @param queryParams The query parameters that will be passed to the list service.
 */
export function useListService<TRecord = any, TQueryParams = {}>(
    listService: ListServiceWithSignal<TRecord, TQueryParams>,
    queryParams?: TQueryParams
): UseListServiceHook<TRecord> {
    const signal = useAbortSignal();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [results, setResults] = useState<TRecord[]>([]);

    const list = useCallback(() => {
        (async function list() {
            try {
                const result = await listService(queryParams, signal);
                setResults(result.resultObjects);
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
    }, [queryParams]);

    useEffect(() => {
        list();
    }, [list]);

    return {
        error,
        isLoading,
        results,
    };
}