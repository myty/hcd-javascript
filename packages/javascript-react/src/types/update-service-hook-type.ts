import type {
    UpdateService,
    UpdateServiceWithSignal,
} from "./update-service-type";

/**
 * Type defining the return object from calling `useUpdate()`
 */
export type UpdateServiceHook<TRecord, TPathParams> = () => {
    update: UpdateService<TRecord, TPathParams>;
};

/**
 * Type defining the return object from calling `useUpdate()`
 */
export type UpdateServiceHookWithSignal<TRecord, TPathParams> = () => {
    update: UpdateServiceWithSignal<TRecord, TPathParams>;
};
