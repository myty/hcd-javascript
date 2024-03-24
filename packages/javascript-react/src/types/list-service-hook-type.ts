import type { ListService, ListServiceWithSignal } from "./list-service-type";

/**
 * Type defining the return object from calling `useList()`
 */
export type ListServiceHook<TRecord, TQueryParams> = () => {
    list: ListService<TRecord, TQueryParams>;
};

/**
 * Type defining the return object from calling `useList()`
 */
export type ListServiceHookWithSignal<TRecord, TQueryParams> = () => {
    list: ListServiceWithSignal<TRecord, TQueryParams>;
};
