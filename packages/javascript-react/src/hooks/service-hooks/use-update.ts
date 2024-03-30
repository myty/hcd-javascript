import { useCallback, useState } from "react";
import { CanceledError } from "axios";
import type { RecordType } from "services/service-factory";
import { useAbortSignal } from "../use-abort-signal";
import type { UpdateServiceWithSignal } from "../../types/update-service-type";

interface UseUpdateServiceHook<TRecord> {
    error?: Error;
    isUpdating: boolean;
    updated: TRecord[];
    update: (record: TRecord) => void;
}

export function useUpdateService<TRecord extends RecordType, TPathParams>(
    updateService: UpdateServiceWithSignal<TRecord, TPathParams>,
    pathParams?: TPathParams
): UseUpdateServiceHook<TRecord> {
    const signal = useAbortSignal();
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState<Error>();
    const [updated, setUpdated] = useState<TRecord[]>([]);

    const update = useCallback(
        (record: TRecord) => {
            (async function () {
                try {
                    setIsUpdating(true);
                    const { resultObject } = await updateService(
                        record,
                        pathParams,
                        signal
                    );

                    if (resultObject == null) {
                        throw new Error("Result object is null");
                    }

                    setUpdated((updated) => {
                        const index = updated.findIndex(
                            (u) => u.id === resultObject.id
                        );

                        if (index >= 0) {
                            return [
                                ...updated.slice(0, index),
                                resultObject,
                                ...updated.slice(index + 1),
                            ];
                        }

                        return [...updated, resultObject];
                    });
                    setIsUpdating(false);
                } catch (error: unknown) {
                    if (
                        error instanceof Error &&
                        !(error instanceof CanceledError)
                    ) {
                        setError(error);
                    }
                } finally {
                    setIsUpdating(false);
                }
            })();
        },
        [pathParams, signal, updateService]
    );

    return {
        error,
        isUpdating,
        updated,
        update,
    };
}
