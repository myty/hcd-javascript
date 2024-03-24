import type {
    NestedListService,
    NestedListServiceWithSignal,
} from "./nested-list-service-type";

/**
 * Type defining the return object from calling `useNestedList()`
 */
export type NestedListServiceHook<TRecord, TPathParams, TQueryParams> = () => {
    list: NestedListService<TRecord, TPathParams, TQueryParams>;
};

/**
 * Type defining the return object from calling `useNestedList()`
 */
export type NestedListServiceHookWithSignal<
    TRecord,
    TPathParams,
    TQueryParams,
> = () => {
    list: NestedListServiceWithSignal<TRecord, TPathParams, TQueryParams>;
};
