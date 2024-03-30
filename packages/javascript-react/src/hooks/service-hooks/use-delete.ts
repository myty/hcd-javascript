import { CanceledError } from "axios";
import { useCallback, useState } from "react";
import { useAbortSignal } from "../use-abort-signal";
import type { DeleteServiceWithSignal } from "../../types/delete-service-type";

interface UseDeleteServiceHook {
    isDeleting: boolean;
    delete: (id: number, pathParams?: Record<string, unknown>) => void;
    deleted: number[];
    error?: Error;
}

/**
 * A hook that provides a delete function that can be used to delete a record by id.
 * @param deleteService The delete service function that will be called to delete the record.
 */
export function useDeleteService(
    deleteService: DeleteServiceWithSignal
): UseDeleteServiceHook {
    const signal = useAbortSignal();
    const [isDeleting, setIsDeleting] = useState(false);
    const [error, setError] = useState<Error>();
    const [deleted, setDeleted] = useState<number[]>([]);

    const _delete = useCallback(
        (id: number, pathParams?: Record<string, unknown>) => {
            (async function () {
                try {
                    setIsDeleting(true);
                    const { resultObject } = await deleteService(
                        id,
                        { id, ...pathParams },
                        signal
                    );

                    if (resultObject !== true) {
                        throw new Error("Result object is null");
                    }

                    setDeleted((deleted) => [...deleted, id]);
                } catch (error) {
                    if (
                        error instanceof Error &&
                        !(error instanceof CanceledError)
                    ) {
                        setError(error);
                    }
                } finally {
                    setIsDeleting(false);
                }
            })();
        },
        [deleteService, signal]
    );

    return { delete: _delete, deleted, error, isDeleting };
}
