import type { ServiceResponse } from "@rsm-hcd/javascript-core";

/**
 * Type defining the service function for creating the supplied resource type
 *
 * @param record Record to be created
 */
export type CreateService<TRecord> = (
    record: TRecord
) => Promise<ServiceResponse<TRecord>>;

/**
 * Type defining the service function for creating the supplied resource type
 *
 * @param record Record to be created
 */
export type CreateServiceWithSignal<TRecord> = (
    record: TRecord,
    signal?: AbortSignal
) => Promise<ServiceResponse<TRecord>>;
