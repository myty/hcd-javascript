import type { GetService, GetServiceWithSignal } from "./get-service-type";

/**
 * Type defining the return object from calling `useGet()`
 */
export type GetServiceHook<
    TRecord,
    TPathParams,
    TQueryParams = undefined,
> = () => {
    get: GetService<TRecord, TPathParams, TQueryParams>;
};

/**
 * Type defining the return object from calling `useGet()`
 */
export type GetServiceHookWithSignal<
    TRecord,
    TPathParams,
    TQueryParams = undefined,
> = () => {
    get: GetServiceWithSignal<TRecord, TPathParams, TQueryParams>;
};
