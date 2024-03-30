/* eslint-disable react-hooks/rules-of-hooks -- factory methods are incorrectly identified as callbacks */
import { useCallback } from "react";
import type { ServiceResponse } from "@rsm-hcd/javascript-core";
import { CanceledError } from "axios";
import type { BulkUpdateServiceHook } from "../types/bulk-update-service-hook-type";
import type { CreateServiceHook } from "../types/create-service-hook-type";
import type { DeleteServiceHook } from "../types/delete-service-hook-type";
import type { GetServiceHook } from "../types/get-service-hook-type";
import type { ListServiceHook } from "../types/list-service-hook-type";
import type { NestedCreateServiceHook } from "../types/nested-create-service-hook-type";
import type { NestedListServiceHook } from "../types/nested-list-service-hook-type";
import type { UpdateServiceHook } from "../types/update-service-hook-type";
import { useAbortSignal } from "../hooks/use-abort-signal";
import type { RecordType } from "./service-factory";
import { ServiceFactory } from "./service-factory";

// ---------------------------------------------------------------------------------------------
// #region Functions
// ---------------------------------------------------------------------------------------------

/**
 * Factory to encapsulate common service function logic
 */
const ServiceHookFactory = {
    /**
     * Creates conventional hook for using service update function for an array of the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param resourceEndpoint
     */
    useBulkUpdate<TRecord extends RecordType, TPathParams>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): BulkUpdateServiceHook<TRecord, TPathParams> {
        const serviceUpdate = ServiceFactory.bulkUpdate(
            recordType,
            resourceEndpoint
        );

        return () => {
            const signal = useAbortSignal();

            const update = useCallback(
                async function update(
                    records: TRecord[],
                    pathParams?: TPathParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceUpdate(records, pathParams, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { update };
        };
    },

    /**
     * Creates conventional hook for using service create function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     *
     * ### Recommendation
     * Use `useNestedCreate` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    useCreate<TRecord extends RecordType>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): CreateServiceHook<TRecord> {
        const serviceCreate = ServiceFactory.create(recordType, baseEndpoint);

        return () => {
            const signal = useAbortSignal();

            const create = useCallback(
                async function create(
                    record: TRecord
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceCreate(record, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { create };
        };
    },

    /**
     * Creates conventional hook for using service delete function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useDelete(resourceEndpoint: string): DeleteServiceHook {
        const serviceDelete = ServiceFactory.delete(resourceEndpoint);

        return () => {
            const signal = useAbortSignal();

            const _delete = useCallback(
                async function (
                    id: number,
                    pathParams?: any
                ): Promise<ServiceResponse<boolean>> {
                    try {
                        return await serviceDelete(id, pathParams, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { delete: _delete };
        };
    },

    /**
     * Creates conventional hook for using service get function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param resourceEndpoint
     */
    useGet<TRecord, TPathParams, TQueryParams = undefined>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): GetServiceHook<TRecord, TPathParams, TQueryParams> {
        const serviceGet = ServiceFactory.get<
            TRecord,
            TPathParams,
            TQueryParams
        >(recordType, resourceEndpoint);

        return () => {
            const signal = useAbortSignal();

            const get = useCallback(
                async function get(
                    pathParams: TPathParams,
                    queryParams?: TQueryParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceGet(
                            pathParams,
                            queryParams,
                            signal
                        );
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { get };
        };
    },

    /**
     * Creates conventional hook for using service list function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     *
     * ### Recommendation
     * Use `useNestedList` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    useList<TRecord, TQueryParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): ListServiceHook<TRecord, TQueryParams> {
        const serviceList = ServiceFactory.list<TRecord, TQueryParams>(
            recordType,
            baseEndpoint
        );

        return () => {
            const signal = useAbortSignal();

            const list = useCallback(
                async function list(
                    queryParams?: TQueryParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceList(queryParams, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { list };
        };
    },

    /**
     * Creates conventional hook for using service nested create function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useNestedCreate<TRecord extends RecordType, TPathParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): NestedCreateServiceHook<TRecord, TPathParams> {
        const serviceCreate = ServiceFactory.nestedCreate<TRecord, TPathParams>(
            recordType,
            baseEndpoint
        );

        return () => {
            const signal = useAbortSignal();

            const create = useCallback(
                async function create(
                    record: TRecord,
                    pathParams: TPathParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceCreate(record, pathParams, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { create };
        };
    },

    /**
     * Creates conventional hook for using service nested list function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useNestedList<TRecord, TPathParams, TQueryParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): NestedListServiceHook<TRecord, TPathParams, TQueryParams> {
        const serviceList = ServiceFactory.nestedList<
            TRecord,
            TPathParams,
            TQueryParams
        >(recordType, baseEndpoint);

        return () => {
            const signal = useAbortSignal();

            const list = useCallback(
                async function list(
                    pathParams: TPathParams,
                    queryParams?: TQueryParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceList(
                            pathParams,
                            queryParams,
                            signal
                        );
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { list };
        };
    },

    /**
     * Creates conventional hook for using service update function for the supplied resource type.
     * Automatically handles cancellation tokens internally.
     * @param recordType
     * @param baseEndpoint
     */
    useUpdate<TRecord extends RecordType, TPathParams>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): UpdateServiceHook<TRecord, TPathParams> {
        const serviceUpdate = ServiceFactory.update(
            recordType,
            resourceEndpoint
        );

        return () => {
            const signal = useAbortSignal();

            const update = useCallback(
                async function update(
                    record: TRecord,
                    pathParams?: TPathParams
                ): Promise<ServiceResponse<TRecord>> {
                    try {
                        return await serviceUpdate(record, pathParams, signal);
                    } catch (error) {
                        if (!(error instanceof CanceledError)) {
                            throw error;
                        }
                    }

                    return { status: 0, resultObjects: [], rowCount: 0 };
                },
                [signal]
            );

            return { update };
        };
    },
};

// #endregion Functions

// ---------------------------------------------------------------------------------------------
// #region Exports
// ---------------------------------------------------------------------------------------------

export { ServiceHookFactory };

// #endregion Exports
