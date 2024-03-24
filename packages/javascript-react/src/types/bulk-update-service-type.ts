import type { ServiceResponse } from "@rsm-hcd/javascript-core";

/**
 * Type defining the service function for bulk updating the supplied resource type
 *
 * @param records Records to be updated
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 */
export type BulkUpdateService<TRecord, TPathParams> = (
    records: TRecord[],
    pathParams?: TPathParams
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for bulk updating the supplied resource type
 *
 * @param records Records to be updated
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 * @param signal AbortSignal to cancel the request
 */
export type BulkUpdateServiceWithSignal<TRecord, TPathParams> = (
    records: TRecord[],
    pathParams?: TPathParams,
    signal?: AbortSignal
) => Promise<ServiceResponse<TRecord>>;
