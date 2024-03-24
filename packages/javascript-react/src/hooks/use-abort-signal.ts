import { useEffect, useRef } from "react";

export function useAbortSignal() {
    const abortController = useRef(new AbortController());

    useEffect(() => {
        return () => {
            abortController.current.abort();
        };
    }, []);

    return abortController.current.signal;
}
