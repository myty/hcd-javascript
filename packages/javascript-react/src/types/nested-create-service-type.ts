import type { ServiceResponse } from "@rsm-hcd/javascript-core";

/**
 * Type defining the service function for creating the supplied resource type when resource is nested
 *
 * @param record Record to be created
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 */
export type NestedCreateService<TRecord, TPathParams> = (
    record: TRecord,
    pathParams: TPathParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for creating the supplied resource type when resource is nested
 *
 * @param record Record to be created
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 * @param signal AbortSignal to be used for aborting the request
 */
export type NestedCreateServiceWithSignal<TRecord, TPathParams> = (
    record: TRecord,
    pathParams: TPathParams,
    signal?: AbortSignal
) => Promise<ServiceResponse<TRecord>>;
