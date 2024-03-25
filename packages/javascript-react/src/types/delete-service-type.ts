import type { ServiceResponse } from "@rsm-hcd/javascript-core";

/**
 * Type defining the service function for deleting the supplied resource
 *
 * @param id Id of the record to be deleted
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 */
export type DeleteService = (
    id: number,
    pathParams?: any
) => Promise<ServiceResponse<boolean>>;

/**
 * Type defining the service function for deleting the supplied resource
 *
 * @param id Id of the record to be deleted
 * @param pathParams Object with path parameters to be replaced in the endpoint route
 * @param signal AbortSignal to cancel the request
 */
export type DeleteServiceWithSignal = (
    id: number,
    pathParams?: any,
    signal?: AbortSignal
) => Promise<ServiceResponse<boolean>>;
