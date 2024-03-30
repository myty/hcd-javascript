import { CanceledError } from "axios";
import { useCallback } from "react";
import { useAbortSignal } from "../use-abort-signal";
import type { DeleteServiceWithSignal } from "../../types/delete-service-type";

interface UseDeleteServiceHook {
    delete: (id: number, pathParams?: any) => void;
}

interface OnDeletedEvent {
    id: number;
    pathParams?: any;
    success: boolean;
    error?: any;
}

/**
 * A hook that provides a delete function that can be used to delete a record by id.
 * @param deleteService The delete service function that will be called to delete the record.
 * @param onDeleted An optional callback that will be called after the record has been deleted.
 */
export function useDeleteService(
    deleteService: DeleteServiceWithSignal,
    onDeleted?: (evt: OnDeletedEvent) => void
): UseDeleteServiceHook {
    const signal = useAbortSignal();

    const _delete = useCallback(
        (id: number, pathParams?: any) => {
            (async function () {
                try {
                    const result = await deleteService(id, pathParams, signal);
                    onDeleted?.({
                        id,
                        success: result?.resultObject ?? false,
                        pathParams,
                    });
                } catch (error) {
                    if (!(error instanceof CanceledError)) {
                        onDeleted?.({ id, pathParams, success: false, error });
                    }
                }
            })();
        },
        [deleteService, onDeleted, signal]
    );

    return { delete: _delete };
}
