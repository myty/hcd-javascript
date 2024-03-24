import type {
    NestedCreateService,
    NestedCreateServiceWithSignal,
} from "./nested-create-service-type";

/**
 * Type defining the return object from calling `useNestedCreate()`
 */
export type NestedCreateServiceHook<TRecord, TPathParams> = () => {
    create: NestedCreateService<TRecord, TPathParams>;
};

/**
 * Type defining the return object from calling `useNestedCreate()`
 */
export type NestedCreateServiceHookWithSignal<TRecord, TPathParams> = () => {
    create: NestedCreateServiceWithSignal<TRecord, TPathParams>;
};
