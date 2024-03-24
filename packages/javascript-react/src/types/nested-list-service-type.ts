import type { ServiceResponse } from "@rsm-hcd/javascript-core";

/**
 * Type defining the service function for listing resources by supplied type when resource is nested
 *
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 * @param queryParams Object with query parameters to be appended to the endpoint route
 */
export type NestedListService<TRecord, TPathParams, TQueryParams> = (
    pathParams: TPathParams,
    queryParams?: TQueryParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for listing resources by supplied type when resource is nested
 *
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 * @param queryParams Object with query parameters to be appended to the endpoint route
 * @param signal AbortSignal to be used for aborting the request
 */
export type NestedListServiceWithSignal<TRecord, TPathParams, TQueryParams> = (
    pathParams: TPathParams,
    queryParams?: TQueryParams,
    signal?: AbortSignal
) => Promise<ServiceResponse<TRecord>>;
