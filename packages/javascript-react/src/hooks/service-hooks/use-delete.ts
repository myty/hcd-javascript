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

export function useDeleteService(
    deleteService: DeleteServiceWithSignal,
    onDeleted?: (evt: OnDeletedEvent) => void
): UseDeleteServiceHook {
    const signal = useAbortSignal();

    const _delete = useCallback((id: number, pathParams?: any) => {
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
    }, []);

    return { delete: _delete };
}
