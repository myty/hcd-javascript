import axios from "axios";
import type { ServiceResponse } from "@rsm-hcd/javascript-core";
import { RouteUtils, ServiceUtils } from "@rsm-hcd/javascript-core";
import type { BulkUpdateServiceWithSignal } from "../types/bulk-update-service-type";
import type { DeleteServiceWithSignal } from "../types/delete-service-type";
import type { CreateServiceWithSignal } from "../types/create-service-type";
import type { ListServiceWithSignal } from "../types/list-service-type";
import type { GetServiceWithSignal } from "../types/get-service-type";
import type { NestedCreateServiceWithSignal } from "../types/nested-create-service-type";
import type { NestedListServiceWithSignal } from "../types/nested-list-service-type";
import type { UpdateServiceWithSignal } from "../types/update-service-type";

// ---------------------------------------------------------------------------------------------
// #region Types
// ---------------------------------------------------------------------------------------------

type RecordId = string | number | null | undefined;

export interface RecordType {
    id?: RecordId;
    toJS: () => unknown;
}

// ---------------------------------------------------------------------------------------------
// #region Public Functions
// ---------------------------------------------------------------------------------------------

/**
 * Factory to encapsulate common service function logic
 */
const ServiceFactory = {
    /**
     * Creates a conventional Service Update function for an Array of the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    bulkUpdate<TRecord extends RecordType, TPathParams extends any>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): BulkUpdateServiceWithSignal<TRecord, TPathParams> {
        return (records: TRecord[], pathParams?: any, signal?: AbortSignal) =>
            _bulkUpdate<TRecord, TPathParams>(
                recordType,
                records,
                resourceEndpoint,
                pathParams,
                signal
            );
    },

    /**
     * Creates conventional Service Create function for the supplied resource type
     *
     * ### Recommendation
     * Use `nestedCreate` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    create<TRecord extends RecordType>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): CreateServiceWithSignal<TRecord> {
        return (record?: TRecord, signal?: AbortSignal) =>
            _create<TRecord>(recordType, baseEndpoint, record, signal);
    },

    /**
     * Creates conventional Service Delete function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    delete(resourceEndpoint: string): DeleteServiceWithSignal {
        return (id: number, pathParams?: any, signal?: AbortSignal) =>
            _delete(id, resourceEndpoint, pathParams, signal);
    },

    /**
     * Creates conventional Service Get function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    get<TRecord, TPathParams, TQueryParams = undefined>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): GetServiceWithSignal<TRecord, TPathParams, TQueryParams> {
        return (
            pathParams: TPathParams,
            queryParams?: TQueryParams,
            signal?: AbortSignal
        ) =>
            _get<TRecord, TPathParams, TQueryParams>(
                recordType,
                resourceEndpoint,
                pathParams,
                queryParams,
                signal
            );
    },

    /**
     * Creates conventional Service List function for the supplied resource type
     *
     * ### Recommendation
     * Use `nestedList` when route is nested!
     *
     * @param recordType
     * @param baseEndpoint
     */
    list<TRecord, TQueryParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): ListServiceWithSignal<TRecord, TQueryParams> {
        return (queryParams?: TQueryParams, signal?: AbortSignal) =>
            _list<TRecord>(recordType, baseEndpoint, null, queryParams, signal);
    },

    /**
     * Creates conventional Service Create function for the supplied resource type
     * when the resource is nested
     * @param recordType
     * @param baseEndpoint
     */
    nestedCreate<TRecord extends RecordType, TPathParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): NestedCreateServiceWithSignal<TRecord, TPathParams> {
        return (
            record: TRecord,
            pathParams: TPathParams,
            signal?: AbortSignal
        ) => {
            const url = RouteUtils.getUrlFromPath(baseEndpoint, pathParams);
            if (!url) {
                throw new Error(
                    `Could not create nested resource. URL could not be constructed from path: ${baseEndpoint}`
                );
            }

            return _create<TRecord>(recordType, url, record, signal);
        };
    },

    /**
     * Creates conventional Service List function for the supplied resource type
     * @param recordType
     * @param baseEndpoint
     */
    nestedList<TRecord, TPathParams, TQueryParams>(
        recordType: new () => TRecord,
        baseEndpoint: string
    ): NestedListServiceWithSignal<TRecord, TPathParams, TQueryParams> {
        return (
            pathParams: TPathParams,
            queryParams?: TQueryParams,
            signal?: AbortSignal
        ) =>
            _list<TRecord>(
                recordType,
                baseEndpoint,
                pathParams,
                queryParams,
                signal
            );
    },

    /**
     * Creates conventional Service Update function for the supplied resource type
     * @param recordType
     * @param resourceEndpoint
     */
    update<TRecord extends RecordType, TPathParams extends any>(
        recordType: new () => TRecord,
        resourceEndpoint: string
    ): UpdateServiceWithSignal<TRecord, TPathParams> {
        return (record: TRecord, pathParams?: any, signal?: AbortSignal) =>
            _update<TRecord, TPathParams>(
                recordType,
                record,
                resourceEndpoint,
                pathParams,
                signal
            );
    },
};

// #endregion Public Functions

// ---------------------------------------------------------------------------------------------
// #region Private Functions
// ---------------------------------------------------------------------------------------------

const _buildUrl = (
    id: RecordId,
    resourceEndpoint: string,
    pathParams?: any
) => {
    if (pathParams == null) {
        pathParams = {};
    }
    pathParams = Object.assign(pathParams, { id });
    return RouteUtils.getUrlFromPath(resourceEndpoint, pathParams);
};

const _bulkUpdate = async function <
    TRecord extends RecordType,
    TPathParams extends any,
>(
    recordType: new () => TRecord,
    records: TRecord[],
    resourceEndpoint: string,
    pathParams: TPathParams,
    signal?: AbortSignal
) {
    const url = RouteUtils.getUrlFromPath(resourceEndpoint, pathParams);

    if (!url) {
        throw new Error(
            `Could not bulk update resource. URL could not be constructed from path: ${resourceEndpoint}`
        );
    }

    const response = await axios.put(
        url,
        records.map((r: TRecord) => r.toJS()),
        { signal }
    );

    return ServiceUtils.mapPagedAxiosResponse(recordType, response);
};

const _create = async function <TRecord extends RecordType>(
    recordType: new () => TRecord,
    url: string,
    record?: TRecord,
    signal?: AbortSignal
) {
    if (!record) {
        throw new TypeError(
            `Could not create resource. Record value was invalid.`
        );
    }

    return axios
        .post(url, record.toJS(), { signal })
        .then((r) => ServiceUtils.mapAxiosResponse(recordType, r));
};

const _delete = async function (
    id: number,
    resourceEndpoint: string,
    pathParams?: any,
    signal?: AbortSignal
): Promise<ServiceResponse<boolean>> {
    const url = _buildUrl(id, resourceEndpoint, pathParams);

    if (!url) {
        throw new Error(
            `Could not delete resource. URL could not be constructed from path: ${resourceEndpoint}`
        );
    }

    return axios.delete(url, { signal }).then((r) => {
        return {
            resultObjects: [],
            rowCount: 1,
            status: r.status,
            resultObject: r.data?.resultObject
                ? Boolean(r.data?.resultObject)
                : undefined,
        };
    });
};

const _get = function <TRecord, TPathParams, TQueryParams = undefined>(
    recordType: new () => TRecord,
    resourceEndpoint: string,
    pathParams: TPathParams,
    queryParams?: TQueryParams,
    signal?: AbortSignal
) {
    const url = RouteUtils.getUrlFromPath(
        resourceEndpoint,
        pathParams,
        queryParams
    );

    if (!url) {
        throw new Error(
            `Could not get resource. URL could not be constructed from path: ${resourceEndpoint}`
        );
    }

    return axios
        .get(url, { signal })
        .then((result) => ServiceUtils.mapAxiosResponse(recordType, result));
};

const _list = async function <TRecord extends any>(
    recordType: new () => TRecord,
    baseEndpoint: string,
    pathParams?: any,
    queryParams?: any,
    signal?: AbortSignal
) {
    const url = RouteUtils.getUrlFromPath(
        baseEndpoint,
        pathParams,
        queryParams
    );

    if (!url) {
        throw new Error(
            `Could not list resource. URL could not be constructed from path: ${baseEndpoint}`
        );
    }

    return axios
        .get(url, { signal })
        .then((r) => ServiceUtils.mapPagedAxiosResponse(recordType, r));
};

const _update = async function <
    TRecord extends RecordType,
    TPathParams extends any,
>(
    recordType: new () => TRecord,
    record: TRecord,
    resourceEndpoint: string,
    pathParams?: TPathParams,
    signal?: AbortSignal
) {
    const url = _buildUrl(record.id, resourceEndpoint, pathParams);

    if (!url) {
        throw new Error(
            `Could not update resource. URL could not be constructed from path: ${resourceEndpoint}`
        );
    }

    return axios
        .put(url, record.toJS(), { signal })
        .then((r) => ServiceUtils.mapAxiosResponse(recordType, r));
};

// #endregion Private Functions

// -----------------------------------------------------------------------------------------
// #region Exports
// -----------------------------------------------------------------------------------------

export { ServiceFactory };

// #endregion Exports
