import type { DependencyList, EffectCallback } from "react";
import { useEffect, useCallback } from "react";
import type { AsyncEffectCallback } from "../types/async-effect-callback-type";

/**
 * Version of the useEffect hook that accepts an async function
 * @export
 * @param {AsyncEffectCallback} asyncEffect
 * @param {DependencyList} deps
 */
export function useAsyncEffect(
    asyncEffect: AsyncEffectCallback,
    deps: DependencyList
) {
    // eslint-disable-next-line react-hooks/exhaustive-deps -- deps are the dependencies of the asyncEffect
    const asyncCallback = useCallback<AsyncEffectCallback>(asyncEffect, deps);

    useEffect(() => {
        let cleanupMethod = () => {};
        let isMounted = true;

        async function runAsyncCallback() {
            const result: ReturnType<EffectCallback> = await asyncCallback(
                () => isMounted
            );

            if (typeof result === "function") {
                cleanupMethod = result;
            }
        }

        runAsyncCallback();

        return () => {
            cleanupMethod();
            isMounted = false;
        };
    }, [asyncCallback]);
}
