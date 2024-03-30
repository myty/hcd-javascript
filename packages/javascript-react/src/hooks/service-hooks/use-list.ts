import { useCallback, useEffect, useState } from "react";
import { CanceledError } from "axios";
import { useAbortSignal } from "../use-abort-signal";
import type { ListServiceWithSignal } from "../../types/list-service-type";

interface UseListServiceHook<TRecord> {
    error?: Error;
    isLoading: boolean;
    results: TRecord[];
    refresh: () => void;
}

interface UseListServiceHookOptions<TQueryParams> {
    autoLoad?: boolean;
    queryParams?: TQueryParams;
}

/**
 * A hook that provides a list function that can be used to list records.
 * @param listService The list service function that will be called to list the records.
 * @param queryParams The query parameters that will be passed to the list service.
 */
export function useListService<TRecord = any, TQueryParams = {}>(
    listService: ListServiceWithSignal<TRecord, TQueryParams>,
    options: UseListServiceHookOptions<TQueryParams> = {}
): UseListServiceHook<TRecord> {
    const { autoLoad = true, queryParams } = options;

    const signal = useAbortSignal();
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error>();
    const [results, setResults] = useState<TRecord[]>([]);

    const list = useCallback(
        (signal?: AbortSignal) => {
            (async function list() {
                try {
                    const result = await listService(queryParams, signal);
                    setResults(result.resultObjects);
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
        [listService, queryParams]
    );

    const refresh = useCallback(() => {
        setIsLoading(true);
        list(signal);
    }, [list, signal]);

    useEffect(() => {
        if (!autoLoad) {
            return;
        }

        const controller = new AbortController();
        list(controller.signal);
        return () => controller.abort();
    }, [autoLoad, list]);

    return {
        error,
        isLoading,
        results,
        refresh,
    };
}
