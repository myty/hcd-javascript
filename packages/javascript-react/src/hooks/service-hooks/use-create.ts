import { useCallback, useState } from "react";
import { CanceledError } from "axios";
import { useAbortSignal } from "../use-abort-signal";
import type { CreateServiceWithSignal } from "../../types/create-service-type";

interface UseCreateServiceHook<TRecord> {
    error?: Error;
    isCreating: boolean;
    created: TRecord[];
    create: (record: TRecord) => void;
}

export function useCreateService<TRecord>(
    createService: CreateServiceWithSignal<TRecord>
): UseCreateServiceHook<TRecord> {
    const signal = useAbortSignal();
    const [isCreating, setIsCreating] = useState(false);
    const [error, setError] = useState<Error>();
    const [created, setCreated] = useState<TRecord[]>([]);

    const create = useCallback(
        (record: TRecord) => {
            (async function () {
                try {
                    setIsCreating(true);
                    const { resultObject } = await createService(
                        record,
                        signal
                    );

                    if (resultObject == null) {
                        throw new Error("Result object is null");
                    }

                    setCreated((created) => [...created, resultObject]);
                    setIsCreating(false);
                } catch (error: unknown) {
                    if (
                        error instanceof Error &&
                        !(error instanceof CanceledError)
                    ) {
                        setError(error);
                    }
                } finally {
                    setIsCreating(false);
                }
            })();
        },
        [createService, signal]
    );

    return {
        error,
        isCreating,
        created,
        create,
    };
}
